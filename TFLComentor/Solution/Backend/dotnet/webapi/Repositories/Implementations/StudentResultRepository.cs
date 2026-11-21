using backend.DTO.Requests;
using backend.DTO.Responses;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Security;
using ZstdSharp.Unsafe;

namespace backend.Repositories.Implementations
{
    public class StudentResultRepository : IStudentResultRepository
    {
        private readonly string _connectionString;

        public StudentResultRepository(IConfiguration configuration)
        {
            _connectionString =
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "DefaultConnection is missing from configuration.");
        }

        public async Task<List<StudentResults>> GetStudentResultsAsync()
        {

            return await Task.FromResult(new List<StudentResults>());
        }

        public async Task<StudentAnswersResults> GetStudentAnswerResultAsync(int questionId, int studentId, int assessmentId)
        {
            StudentAnswersResults result = null;

            string query = @"SELECT q.question_id, q.description AS question_description,
                            m.option_a, m.option_b, m.option_c, m.option_d,
                            m.correct_answer, sa.SelectedOption AS student_selected_answer
                        FROM questions q
                            LEFT JOIN mcq_options m ON q.question_id = m.question_id
                            LEFT JOIN studentanswers sa ON q.question_id = sa.QuestionId
                    AND sa.StudentId = @student_id
                    AND sa.AssessmentId = @assessment_id

                WHERE q.question_id = @question_id;
            ";

            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                await con.OpenAsync();

                using (MySqlCommand cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@student_id", studentId);
                    cmd.Parameters.AddWithValue("@assessment_id", assessmentId);
                    cmd.Parameters.AddWithValue("@question_id", questionId);


                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            result = new StudentAnswersResults
                            {
                                QuestionId = Convert.ToInt32(reader["question_id"]),
                                QuestionDescription = reader["question_description"]?.ToString(),

                                OptionA = reader["option_a"]?.ToString(),
                                OptionB = reader["option_b"]?.ToString(),
                                OptionC = reader["option_c"]?.ToString(),
                                OptionD = reader["option_d"]?.ToString(),

                                CorrectAnswer = reader["correct_answer"]?.ToString(),
                                StudentSelectedAnswer = reader["student_selected_answer"]?.ToString()
                            };
                        }
                    }
                }
            }

            return result;
        }

        public async Task<bool> SaveStudentAssessmentResult(StudentAssessmentResultRequest result)
        {
            const string columnQuery = @"
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'student_assessment_results'
                  AND COLUMN_NAME IN ('percentile', 'percentage')
                ORDER BY CASE WHEN COLUMN_NAME = 'percentile' THEN 0 ELSE 1 END
                LIMIT 1;";

            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                await con.OpenAsync();

                string? percentageColumn;
                using (MySqlCommand columnCommand = new MySqlCommand(columnQuery, con))
                {
                    percentageColumn =
                        (await columnCommand.ExecuteScalarAsync())?.ToString();
                }

                if (percentageColumn is not ("percentile" or "percentage"))
                {
                    throw new InvalidOperationException(
                        "The student_assessment_results table must contain a percentile or percentage column.");
                }

                await using var transaction = await con.BeginTransactionAsync();
                const string assessmentQuery = @"
                    SELECT id
                    FROM assessments
                    WHERE student_id = @student_id
                      AND is_active = 1
                      AND (id = @assessment_id OR test_id = @assessment_id)
                    ORDER BY (id = @assessment_id) DESC, id DESC
                    LIMIT 1
                    FOR UPDATE;";

                object? assessmentId;
                await using (var assessmentCommand =
                    new MySqlCommand(
                        assessmentQuery, con, (MySqlTransaction)transaction))
                {
                    assessmentCommand.Parameters.AddWithValue(
                        "@student_id", result.StudentId);
                    assessmentCommand.Parameters.AddWithValue(
                        "@assessment_id", result.AssessmentId);
                    assessmentId = await assessmentCommand.ExecuteScalarAsync();
                }

                if (assessmentId == null || assessmentId == DBNull.Value)
                {
                    throw new InvalidOperationException(
                        "No active assessment was found for this student and assessment ID.");
                }

                result.AssessmentId = Convert.ToInt32(assessmentId);

                const string findQuery = @"
                    SELECT id
                    FROM student_assessment_results
                    WHERE student_id = @student_id
                      AND assessment_id = @assessment_id
                    ORDER BY id DESC
                    LIMIT 1
                    FOR UPDATE;";

                object? existingId;
                await using (var findCommand =
                    new MySqlCommand(findQuery, con, (MySqlTransaction)transaction))
                {
                    findCommand.Parameters.AddWithValue(
                        "@student_id", result.StudentId);
                    findCommand.Parameters.AddWithValue(
                        "@assessment_id", result.AssessmentId);
                    existingId = await findCommand.ExecuteScalarAsync();
                }

                string saveQuery = existingId != null
                    ? $@"
                        UPDATE student_assessment_results
                        SET score = @score,
                            {percentageColumn} = @percentile,
                            time_taken_minutes = @time_taken_minutes
                        WHERE id = @id;"
                    : $@"
                        INSERT INTO student_assessment_results
                        (
                            student_id,
                            assessment_id,
                            score,
                            {percentageColumn},
                            time_taken_minutes
                        )
                        VALUES
                        (
                            @student_id,
                            @assessment_id,
                            @score,
                            @percentile,
                            @time_taken_minutes
                        );";

                await using (var saveCommand =
                    new MySqlCommand(saveQuery, con, (MySqlTransaction)transaction))
                {
                    AddResultParameters(saveCommand, result);
                    if (existingId != null)
                    {
                        saveCommand.Parameters.AddWithValue("@id", existingId);
                    }

                    await saveCommand.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();
                return true;
            }

        }

        private static void AddResultParameters(
            MySqlCommand command,
            StudentAssessmentResultRequest result)
        {
            command.Parameters.AddWithValue("@student_id", result.StudentId);
            command.Parameters.AddWithValue("@assessment_id", result.AssessmentId);
            command.Parameters.AddWithValue("@score", result.Score);
            command.Parameters.AddWithValue("@percentile", result.Percentile);
            command.Parameters.AddWithValue(
                "@time_taken_minutes", result.TimeTakenMinutes);
        }
    }
}