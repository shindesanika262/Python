
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.DTO.Requests;
using backend.DTO.Responses;
using backend.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace backend.Repositories.Implementations;

public class AssessmentRepository : IAssessmentRepository
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;

    public AssessmentRepository(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    private MySqlConnection GetConnection()
    {
        string? connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "DefaultConnection is missing from configuration.");
        }

        return new MySqlConnection(connectionString);
    }

    // 1. Upcoming assessments with date filter
    public async Task<List<Assessments>> GetAllUpcomingAssessments(
        long userId,
        DateTime fromDate,
        DateTime toDate)
    {
        var assessments = new List<Assessments>();

        string query = @"
            SELECT
                a.id AS AssessmentId,
                t.title AS AssessmentName,
                a.scheduled_at AS ScheduledAt,
                t.duration AS Duration,
                a.status AS Status
            FROM assessments a
            LEFT JOIN tests t ON a.test_id = t.id
            WHERE a.student_id = @UserId
              AND a.status = 'Assigned'
              AND a.is_active = 1
              AND DATE(a.scheduled_at) BETWEEN @FromDate AND @ToDate
            ORDER BY a.scheduled_at ASC;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@UserId", userId);
        command.Parameters.AddWithValue("@FromDate", fromDate.Date);
        command.Parameters.AddWithValue("@ToDate", toDate.Date);

        await using var reader = await command.ExecuteReaderAsync();

        int srNo = 1;

        while (await reader.ReadAsync())
        {
            assessments.Add(new Assessments
            {
                SrNo = srNo++,
                AssessmentId = Convert.ToInt32(reader["AssessmentId"]),
                AssessmentName = reader["AssessmentName"] == DBNull.Value
                    ? null
                    : reader["AssessmentName"].ToString(),
                ScheduledAt = reader["ScheduledAt"] == DBNull.Value
                    ? default
                    : Convert.ToDateTime(reader["ScheduledAt"]),
                Duration = reader["Duration"] == DBNull.Value
                    ? null
                    : Convert.ToInt32(reader["Duration"]),
                Status = reader["Status"]?.ToString()
            });
        }

        return assessments;
    }

    // 2. Upcoming assessments without date filter
    public async Task<List<Assessments>>
        GetAllUpcomingAssessmentsWithoutDateFilter(long userId)
    {
        var assessments = new List<Assessments>();

        string query = @"
            SELECT
                a.id AS AssessmentId,
                t.title AS AssessmentName,
                a.scheduled_at AS ScheduledAt,
                t.duration AS Duration,
                a.status AS Status
            FROM assessments a
            LEFT JOIN tests t ON a.test_id = t.id
            WHERE a.student_id = @UserId
              AND a.status = 'Assigned'
              AND a.is_active = 1
            ORDER BY a.scheduled_at ASC;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@UserId", userId);

        await using var reader = await command.ExecuteReaderAsync();

        int srNo = 1;

        while (await reader.ReadAsync())
        {
            assessments.Add(new Assessments
            {
                SrNo = srNo++,
                AssessmentId = Convert.ToInt32(reader["AssessmentId"]),
                AssessmentName = reader["AssessmentName"] == DBNull.Value
                    ? null
                    : reader["AssessmentName"].ToString(),
                ScheduledAt = reader["ScheduledAt"] == DBNull.Value
                    ? default
                    : Convert.ToDateTime(reader["ScheduledAt"]),
                Duration = reader["Duration"] == DBNull.Value
                    ? null
                    : Convert.ToInt32(reader["Duration"]),
                Status = reader["Status"]?.ToString()
            });
        }

        return assessments;
    }

    // 3. Get all assessments
    public async Task<List<AllAssessments>> GetAllAssessments()
    {
        var list = new List<AllAssessments>();

        string query = @"
            SELECT
                a.id AS Id,
                COALESCE(t.title, 'N/A') AS AssessmentTitle,
                COALESCE(
                    CONCAT_WS(' ', p.first_name, p.last_name),
                    'N/A'
                ) AS FullName,
                COALESCE(t.difficulty, 'N/A') AS DifficultyLevel,
                a.status AS Status,
                a.is_active AS IsActive
            FROM assessments a
            LEFT JOIN tests t ON a.test_id = t.id
            LEFT JOIN users u ON a.student_id = u.id
            LEFT JOIN personal_informations p ON u.id = p.user_id
            ORDER BY a.assigned_at DESC;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        await using var reader = await command.ExecuteReaderAsync();

        int srNo = 1;

        while (await reader.ReadAsync())
        {
            list.Add(new AllAssessments
            {
                Id = reader.GetInt64("Id"),
                SrNo = srNo++,
                AssessmentTitle = reader["AssessmentTitle"]?.ToString(),
                FullName = reader["FullName"]?.ToString(),
                DifficultyLevel = reader["DifficultyLevel"]?.ToString(),
                Status = reader["Status"]?.ToString(),
                IsActive = reader["IsActive"] != DBNull.Value &&
                           Convert.ToBoolean(reader["IsActive"])
            });
        }

        return list;
    }

    // 4. Deactivate assessment
    public async Task<bool> DeactivateAssessment(long id)
    {
        const string query = @"
            UPDATE assessments
            SET is_active = 0
            WHERE id = @Id AND is_active = 1;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Id", id);

        return await command.ExecuteNonQueryAsync() > 0;
    }

    // 5. Cancel assessments for a test
    public async Task<int> CancelAssessmentsByTestId(long testId)
    {
        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var transaction = await connection.BeginTransactionAsync();

        try
        {
            const string checkQuery =
                "SELECT COUNT(*) FROM tests WHERE id = @TestId;";

            await using (var checkCommand =
                new MySqlCommand(checkQuery, connection, (MySqlTransaction)transaction))
            {
                checkCommand.Parameters.AddWithValue("@TestId", testId);

                int count = Convert.ToInt32(
                    await checkCommand.ExecuteScalarAsync());

                if (count == 0)
                {
                    await transaction.RollbackAsync();
                    return 0;
                }
            }

            // Assumes tests.status uses 0 to mean inactive.
            const string updateTestQuery = @"
                UPDATE tests
                SET status = 0
                WHERE id = @TestId;";

            int testRows;

            await using (var updateTestCommand =
                new MySqlCommand(updateTestQuery, connection, (MySqlTransaction)transaction))
            {
                updateTestCommand.Parameters.AddWithValue("@TestId", testId);
                testRows = await updateTestCommand.ExecuteNonQueryAsync();
            }

            const string updateAssessmentsQuery = @"
                UPDATE assessments
                SET status = 'Cancelled',
                    is_active = 0
                WHERE test_id = @TestId
                  AND is_active = 1
                  AND status <> 'Completed';";

            int assessmentRows;

            await using (var updateAssessmentsCommand =
                new MySqlCommand(updateAssessmentsQuery, connection, (MySqlTransaction)transaction))
            {
                updateAssessmentsCommand.Parameters.AddWithValue("@TestId", testId);
                assessmentRows =
                    await updateAssessmentsCommand.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();

            return testRows + assessmentRows;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // 6. Restore assessment
    public async Task<bool> RestoreAssessment(long id)
    {
        const string query = @"
            UPDATE assessments
            SET is_active = 1
            WHERE id = @Id AND is_active = 0;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Id", id);

        return await command.ExecuteNonQueryAsync() > 0;
    }

    // 7. Get all tests
    public async Task<List<Tests>> GetTestsAsync()
    {
        var tests = new List<Tests>();

        const string query = @"
            SELECT id, title, duration, description, difficulty
            FROM tests
            ORDER BY id DESC;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            tests.Add(new Tests
            {
                Id = Convert.ToInt64(reader["id"]),
                Title = reader["title"]?.ToString(),
                Duration = reader["duration"] == DBNull.Value
                    ? null
                    : Convert.ToInt32(reader["duration"]),
                Description = reader["description"] == DBNull.Value
                    ? null
                    : reader["description"].ToString(),
                Difficulty = reader["difficulty"] == DBNull.Value
                    ? null
                    : reader["difficulty"].ToString()
            });
        }

        return tests;
    }

    // 8. Get students
    public async Task<List<Student>> GetStudentsAsync()
    {
        var students = new List<Student>();

        const string query = @"
            SELECT
                u.id,
                CONCAT_WS(' ', pi.first_name, pi.last_name) AS FullName,
                pi.email
            FROM users u
            INNER JOIN personal_informations pi ON u.id = pi.user_id
            INNER JOIN user_roles ur ON u.id = ur.user_id
            INNER JOIN roles r ON ur.role_id = r.role_id
            WHERE r.role_name = 'Student'
            ORDER BY pi.first_name;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            students.Add(new Student
            {
                Id = reader.GetInt64("id"),
                FullName = reader["FullName"]?.ToString() ?? string.Empty,
                Email = reader["email"]?.ToString() ?? string.Empty
            });
        }

        return students;
    }

    // 9. Assign a test to selected students
    public async Task AssignAssessmentAsync(AssignAssessments dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        if (dto.TestId <= 0)
            throw new ArgumentException("Invalid Test Id.");

        if (dto.StudentIds == null || dto.StudentIds.Count == 0)
            throw new ArgumentException("At least one student is required.");

        if (dto.StudentIds.Any(id => id <= 0))
            throw new ArgumentException("One or more student IDs are invalid.");

        var uniqueStudentIds = dto.StudentIds.Distinct().ToList();

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var transaction = await connection.BeginTransactionAsync();

        try
        {
            // Verify that the selected test exists.
            const string testQuery = @"
                SELECT COUNT(*)
                FROM tests
                WHERE id = @TestId;";

            await using (var testCommand =
                new MySqlCommand(testQuery, connection, (MySqlTransaction)transaction))
            {
                testCommand.Parameters.AddWithValue("@TestId", dto.TestId);

                int testExists = Convert.ToInt32(
                    await testCommand.ExecuteScalarAsync());

                if (testExists == 0)
                    throw new ArgumentException("The selected test does not exist.");
            }

            foreach (long studentId in uniqueStudentIds)
            {
                // Verify that the student exists.
                const string studentQuery = @"
                    SELECT COUNT(*)
                    FROM users u
                    INNER JOIN user_roles ur ON u.id = ur.user_id
                    INNER JOIN roles r ON ur.role_id = r.role_id
                    WHERE u.id = @StudentId
                      AND r.role_name = 'Student';";

                await using (var studentCommand =
                    new MySqlCommand(studentQuery, connection, (MySqlTransaction)transaction))
                {
                    studentCommand.Parameters.AddWithValue("@StudentId", studentId);

                    int studentExists = Convert.ToInt32(
                        await studentCommand.ExecuteScalarAsync());

                    if (studentExists == 0)
                    {
                        throw new ArgumentException(
                            $"Student ID {studentId} does not exist or is not a student.");
                    }
                }

                // Do not create a second active Assigned/Pending assignment.
                const string checkQuery = @"
                    SELECT COUNT(*)
                    FROM assessments
                    WHERE test_id = @TestId
                      AND student_id = @StudentId
                      AND is_active = 1
                      AND status IN ('Assigned', 'Pending');";

                int existingAssignment;

                await using (var checkCommand =
                    new MySqlCommand(checkQuery, connection, (MySqlTransaction)transaction))
                {
                    checkCommand.Parameters.AddWithValue("@TestId", dto.TestId);
                    checkCommand.Parameters.AddWithValue("@StudentId", studentId);

                    existingAssignment = Convert.ToInt32(
                        await checkCommand.ExecuteScalarAsync());
                }

                if (existingAssignment > 0)
                {
                    // This student already has this test assigned.
                    continue;
                }

                const string insertQuery = @"
                    INSERT INTO assessments
                    (
                        test_id,
                        student_id,
                        assigned_by,
                        assigned_at,
                        scheduled_at,
                        status,
                        is_active
                    )
                    VALUES
                    (
                        @TestId,
                        @StudentId,
                        @AssignedBy,
                        @AssignedAt,
                        @ScheduledAt,
                        @Status,
                        @IsActive
                    );";

                await using var insertCommand =
                    new MySqlCommand(insertQuery, connection, (MySqlTransaction)transaction);

                insertCommand.Parameters.AddWithValue("@TestId", dto.TestId);
                insertCommand.Parameters.AddWithValue("@StudentId", studentId);
                insertCommand.Parameters.AddWithValue("@AssignedBy", dto.AssignedBy);
                insertCommand.Parameters.AddWithValue("@AssignedAt", DateTime.Now);
                insertCommand.Parameters.AddWithValue(
                    "@ScheduledAt", dto.ScheduledAt);
                insertCommand.Parameters.AddWithValue("@Status", "Assigned");
                insertCommand.Parameters.AddWithValue("@IsActive", true);

                await insertCommand.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // 10. Get questions for an assigned assessment
    public async Task<List<AssessmentQuestions>> GetAssessmentQuestionsAsync(
        int assessmentId)
    {
        var questions = new List<AssessmentQuestions>();

        const string query = @"
            SELECT
                tst.duration AS Duration,
                ques.question_id AS QuestionId,
                ques.description AS Description,
                ques.question_type AS QuestionType,
                mcq.option_a AS OptionA,
                mcq.option_b AS OptionB,
                mcq.option_c AS OptionC,
                mcq.option_d AS OptionD
            FROM assessments asm
            INNER JOIN tests tst ON asm.test_id = tst.id
            INNER JOIN test_questions testQues ON testQues.test_id = tst.id
            INNER JOIN questions ques ON ques.question_id = testQues.question_id
            LEFT JOIN mcq_options mcq ON mcq.question_id = ques.question_id
            WHERE asm.id = @AssessmentId
              AND asm.is_active = 1
            ORDER BY testQues.sequence_order ASC;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@AssessmentId", assessmentId);

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            questions.Add(new AssessmentQuestions
            {
                Duration = reader["Duration"] == DBNull.Value
                    ? null
                    : Convert.ToInt32(reader["Duration"]),
                QuestionId = reader["QuestionId"] == DBNull.Value
                    ? 0
                    : Convert.ToInt32(reader["QuestionId"]),
                Description = reader["Description"] == DBNull.Value
                    ? null
                    : reader["Description"].ToString(),
                QuestionType = reader["QuestionType"] == DBNull.Value
                    ? null
                    : reader["QuestionType"].ToString(),
                OptionA = reader["OptionA"] == DBNull.Value
                    ? null
                    : reader["OptionA"].ToString(),
                OptionB = reader["OptionB"] == DBNull.Value
                    ? null
                    : reader["OptionB"].ToString(),
                OptionC = reader["OptionC"] == DBNull.Value
                    ? null
                    : reader["OptionC"].ToString(),
                OptionD = reader["OptionD"] == DBNull.Value
                    ? null
                    : reader["OptionD"].ToString()
            });
        }

        return questions;
    }

    // 11. Save student answers
    public async Task<bool> SaveAssessmentAnswersAsync(
        int studentId,
        int assessmentId,
        List<StudentAnswer> answers)
    {
        if (answers.Any(a =>
                a.StudentId != studentId ||
                a.AssessmentId != assessmentId))
        {
            throw new ArgumentException(
                "All answers must belong to the same student and assessment.");
        }

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var transaction = await connection.BeginTransactionAsync();

        try
        {
            // Lock the assignment so duplicate submit requests are safe.
            const string verifyQuery = @"
                SELECT status
                FROM assessments
                WHERE id = @AssessmentId
                  AND student_id = @StudentId
                  AND is_active = 1
                FOR UPDATE;";

            string? status;
            await using (var verifyCommand =
                new MySqlCommand(verifyQuery, connection, (MySqlTransaction)transaction))
            {
                verifyCommand.Parameters.AddWithValue("@StudentId", studentId);
                verifyCommand.Parameters.AddWithValue("@AssessmentId", assessmentId);

                status = (await verifyCommand.ExecuteScalarAsync())?.ToString();
            }

            if (status == null)
            {
                throw new InvalidOperationException(
                    "Assessment not found, inactive, or not assigned to this student.");
            }

            if (status == "Completed")
            {
                await transaction.CommitAsync();
                return true;
            }

            if (status != "Assigned")
            {
                throw new InvalidOperationException(
                    "Assessment is not available for submission.");
            }

            const string deleteQuery = @"
                DELETE FROM studentanswers
                WHERE StudentId = @StudentId
                  AND AssessmentId = @AssessmentId;";

            await using (var deleteCommand =
                new MySqlCommand(deleteQuery, connection, (MySqlTransaction)transaction))
            {
                deleteCommand.Parameters.AddWithValue("@StudentId", studentId);
                deleteCommand.Parameters.AddWithValue("@AssessmentId", assessmentId);
                await deleteCommand.ExecuteNonQueryAsync();
            }

            const string insertQuery = @"
                INSERT INTO studentanswers
                (
                    StudentId,
                    AssessmentId,
                    QuestionId,
                    SelectedOption,
                    TimeTakenMinutes,
                    CreatedAt
                )
                VALUES
                (
                    @StudentId,
                    @AssessmentId,
                    @QuestionId,
                    @SelectedOption,
                    @TimeTakenMinutes,
                    @CreatedAt
                );";

            foreach (var answer in answers)
            {
                await using var insertCommand =
                    new MySqlCommand(insertQuery, connection, (MySqlTransaction)transaction);

                insertCommand.Parameters.AddWithValue("@StudentId", answer.StudentId);
                insertCommand.Parameters.AddWithValue("@AssessmentId", answer.AssessmentId);
                insertCommand.Parameters.AddWithValue("@QuestionId", answer.QuestionId);
                insertCommand.Parameters.AddWithValue(
                    "@SelectedOption", answer.SelectedOption ?? string.Empty);
                insertCommand.Parameters.AddWithValue(
                    "@TimeTakenMinutes", answer.TimeTakenMinutes);
                insertCommand.Parameters.AddWithValue("@CreatedAt", DateTime.Now);

                await insertCommand.ExecuteNonQueryAsync();
            }

            const string updateQuery = @"
                UPDATE assessments
                SET status = 'Completed'
                WHERE id = @AssessmentId
                  AND student_id = @StudentId;";

            await using (var updateCommand =
                new MySqlCommand(updateQuery, connection, (MySqlTransaction)transaction))
            {
                updateCommand.Parameters.AddWithValue("@AssessmentId", assessmentId);
                updateCommand.Parameters.AddWithValue("@StudentId", studentId);
                await updateCommand.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();
            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // 12. Get result report
    public async Task<AssessmentReports> GetResultData(
        int studentId,
        int assessmentId)
    {
        AssessmentReports? report = null;
        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command =
            new MySqlCommand("GetStudentAssessmentReport", connection);

        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@studentId", studentId);
        command.Parameters.AddWithValue("@assessmentId", assessmentId);

        await using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            report = new AssessmentReports
            {
                StudentId = Convert.ToInt32(reader["StudentId"]),
                AssessmentId = Convert.ToInt32(reader["AssessmentId"]),
                Score = Convert.ToInt32(reader["Score"]),
                Percentage = Convert.ToInt32(reader["Percentage"]),
                TestTitle = reader["TestTitle"]?.ToString(),
                TotalQuestions = Convert.ToInt32(reader["TotalQuestions"]),
                CorrectAnswers = Convert.ToInt32(reader["CorrectAnswers"]),
                WrongAnswers = Convert.ToInt32(reader["WrongAnswers"]),
                ScorePercentage = Convert.ToDouble(reader["ScorePercentage"])
            };
        }

        return report!;
    }

    // 13. Assessment performance for test creator
    public async Task<List<AssessmentPerformanceResponse>>
        GetAssessmentPerformance(long userId)
    {
        var assessments = new List<AssessmentPerformanceResponse>();

        const string query = @"
            SELECT
                t.id AS AssessmentId,
                t.title AS AssessmentTitle,
                t.description AS Description,
                t.difficulty AS Difficulty,
                COUNT(a.student_id) AS CandidateCount
            FROM tests t
            LEFT JOIN assessments a
                ON t.id = a.test_id
               AND a.is_active = 1
            WHERE t.user_id = @UserId
            GROUP BY t.id, t.title, t.description, t.difficulty
            ORDER BY t.id;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@UserId", userId);

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            assessments.Add(new AssessmentPerformanceResponse
            {
                AssessmentId = Convert.ToInt64(reader["AssessmentId"]),
                AssessmentName = reader["AssessmentTitle"]?.ToString(),
                Description = reader["Description"]?.ToString(),
                CandidateCount = Convert.ToInt32(reader["CandidateCount"]),
                Difficulty = reader["Difficulty"]?.ToString(),

                // Replace these placeholder values with calculated metrics.
                Subject = "JavaScript",
                AverageScore = 82.5,
                PassRate = 86.7
            });
        }

        return assessments;
    }

    // 14. Total assessments
    public async Task<int> GetTotalAssessmentsAsync()
    {
        const string query = "SELECT COUNT(*) FROM assessments;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);

        return Convert.ToInt32(await command.ExecuteScalarAsync());
    }

    // 15. Completed assessments count
    public async Task<int> GetCompletedAssessmentsAsync()
    {
        const string query = @"
            SELECT COUNT(*)
            FROM assessments
            WHERE status = 'Completed';";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);

        return Convert.ToInt32(await command.ExecuteScalarAsync());
    }

    // 16. Assessment summaries for a student
    public async Task<List<AssessmentSummaries>>
        GetAssessmentSummariesForStudent(long studentId)
    {
        // Existing implementation is a placeholder.
        return await Task.FromResult(new List<AssessmentSummaries>());
    }

    // 17. Get full assessment data
    public List<StudentAssessments> GetFullData()
    {
        var list = new List<StudentAssessments>();
        const string query = @"
            SELECT
                a.id AS AssessmentId,
                COALESCE(t.id, 0) AS TestId,
                COALESCE(t.title, 'No Test') AS TestTitle,
                COALESCE(u.id, 0) AS StudentId,
                COALESCE(
                    CONCAT_WS(' ', p.first_name, p.last_name),
                    'Unknown'
                ) AS StudentName,
                a.status AS Status,
                a.assigned_at AS AssignedAt,
                a.scheduled_at AS ScheduledAt,
                r.score AS ResultScore,
                r.percentile AS ResultPercentile,
                r.time_taken_minutes AS ResultTimeTaken
            FROM assessments a
            LEFT JOIN tests t ON a.test_id = t.id
            LEFT JOIN users u ON a.student_id = u.id
            LEFT JOIN personal_informations p ON u.id = p.user_id
            LEFT JOIN student_assessment_results r
                ON a.id = r.assessment_id
            ORDER BY a.assigned_at DESC;";

        using var connection = GetConnection();
        connection.Open();

        using var command = new MySqlCommand(query, connection);
        using var reader = command.ExecuteReader();

        while (reader.Read())
        {
            var item = new StudentAssessments
            {
                AssessmentId = reader.GetInt64("AssessmentId"),
                TestId = reader.GetInt64("TestId"),
                TestTitle = reader["TestTitle"]?.ToString(),
                StudentId = reader.GetInt64("StudentId"),
                StudentName = reader["StudentName"]?.ToString(),
                Status = reader["Status"]?.ToString(),

                AssignedAt = reader["AssignedAt"] == DBNull.Value
                    ? null
                    : (DateTime?)Convert.ToDateTime(reader["AssignedAt"]),

                ScheduledAt = reader["ScheduledAt"] == DBNull.Value
                    ? null
                    : (DateTime?)Convert.ToDateTime(reader["ScheduledAt"]),

                Result = reader["ResultScore"] == DBNull.Value
                    ? null
                    : new backend.DTO.Responses.Results
                    {
                        Score = Convert.ToDouble(reader["ResultScore"]),

                        Percentile = reader["ResultPercentile"] == DBNull.Value
                            ? 0
                            : Convert.ToDouble(reader["ResultPercentile"]),

                        TimeTakenMinutes = reader["ResultTimeTaken"] == DBNull.Value
                            ? null
                            : (int?)Convert.ToInt32(reader["ResultTimeTaken"])
                    }
            };

            list.Add(item);
        }

        return list;
    }

    // 18. Upcoming assessments for a student
    public async Task<List<UpcomingAssessmentResponse>>
        GetUpcomingAssessments(int studentId)
    {
        var assessments = new List<UpcomingAssessmentResponse>();

        const string query = @"
            SELECT
                a.id,
                t.title,
                a.scheduled_at,
                t.duration,
                a.status
            FROM assessments a
            INNER JOIN tests t ON a.test_id = t.id
            LEFT JOIN student_assessment_results sar
                ON sar.assessment_id = a.id
               AND sar.student_id = a.student_id
            WHERE a.student_id = @StudentId
              AND a.status = 'Assigned'
              AND a.is_active = 1
              AND sar.id IS NULL
            ORDER BY a.scheduled_at;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@StudentId", studentId);

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            assessments.Add(new UpcomingAssessmentResponse
            {
                AssessmentId = Convert.ToInt32(reader["id"]),
                AssessmentName = reader["title"]?.ToString() ?? string.Empty,
                ScheduledAt = Convert.ToDateTime(reader["scheduled_at"]),
                Duration = reader["duration"] == DBNull.Value
                    ? 0
                    : Convert.ToInt32(reader["duration"]),
                Status = reader["status"]?.ToString() ?? string.Empty
            });
        }

        return assessments;
    }

    // 19. Completed assessments for a student
    public async Task<List<CompletedAssessmentsResponse>>
        GetCompletedAssessments(int studentId)
    {
        var list = new List<CompletedAssessmentsResponse>();

        const string query = @"
            SELECT
                sar.id,
                sar.assessment_id,
                t.title AS assessment_name,
                sar.score,
                sar.percentage,
                sar.time_taken_minutes
            FROM student_assessment_results sar
            INNER JOIN assessments a ON sar.assessment_id = a.id
            INNER JOIN tests t ON a.test_id = t.id
            WHERE sar.student_id = @StudentId
            ORDER BY sar.id DESC;";

        await using var connection = GetConnection();
        await connection.OpenAsync();

        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@StudentId", studentId);

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            list.Add(new CompletedAssessmentsResponse
            {
                Id = Convert.ToInt32(reader["id"]),
                AssessmentId = Convert.ToInt32(reader["assessment_id"]),
                AssessmentName = reader["assessment_name"]?.ToString()
                    ?? string.Empty,
                Score = reader["score"] == DBNull.Value
                    ? 0
                    : Convert.ToInt32(reader["score"]),
                Percentage = reader["percentage"] == DBNull.Value
                    ? 0
                    : Convert.ToDouble(reader["percentage"]),
                TimeTakenMinutes = reader["time_taken_minutes"] == DBNull.Value
                    ? 0
                    : Convert.ToInt32(reader["time_taken_minutes"])
            });
        }

        return list;
    }
}
