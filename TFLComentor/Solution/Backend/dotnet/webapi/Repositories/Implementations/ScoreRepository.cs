using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using backend.DTOs.Responses;
using backend.Repositories.Interfaces;
using backend.DTO.Responses;

namespace backend.Repositories
{
    public class ScoreRepository : IScoreRepository
    {
        private readonly IConfiguration _configuration;

        public ScoreRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));
        }


        public async Task<AverageScore> GetAverageScoreByIdAsync(int studentId)
        {
            AverageScore score = new AverageScore();

            using (MySqlConnection con = GetConnection())
            {
                string query = @"
                    SELECT 
                        sar.student_id,
                        COUNT(*) AS total_completed_assessments,
                        ROUND(AVG(sar.percentile), 2) AS avg_score
                    FROM student_assessment_results sar
                    JOIN assessments a 
                        ON sar.assessment_id = a.test_id
                    WHERE a.status = 'Completed'
                    AND sar.student_id = @student_id
                    GROUP BY sar.student_id";

                using (MySqlCommand cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@student_id", studentId);

                    await con.OpenAsync();

                    using (MySqlDataReader reader =
                           (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            score.StudentId =
                                Convert.ToInt32(reader["student_id"]);

                            score.TotalCompletedAssessments =
                                Convert.ToInt32(reader["total_completed_assessments"]);

                            score.AvgScore =
                                Convert.ToDouble(reader["avg_score"]);
                        }
                    }
                }
            }

            return score;
        }



        public async Task<List<AverageScore>> GetAllStudentsAverageScoreAsync()
        {
            List<AverageScore> list = new List<AverageScore>();

            using (MySqlConnection con = GetConnection())
            {
                string query = @"
                    SELECT 
                        sar.student_id,
                        COUNT(*) AS total_completed_assessments,
                        ROUND(AVG(sar.percentile), 2) AS avg_score
                    FROM student_assessment_results sar
                    JOIN assessments a 
                        ON sar.assessment_id = a.test_id
                    WHERE a.status = 'Completed'
                    GROUP BY sar.student_id";


                using (MySqlCommand cmd = new MySqlCommand(query, con))
                {
                    await con.OpenAsync();

                    using (MySqlDataReader reader =
                           (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            list.Add(new AverageScore
                            {
                                StudentId =
                                    Convert.ToInt32(reader["student_id"]),

                                TotalCompletedAssessments =
                                    Convert.ToInt32(reader["total_completed_assessments"]),

                                AvgScore =
                                    Convert.ToDouble(reader["avg_score"])
                            });
                        }
                    }
                }
            }

            return list;
        }



        public async Task<List<StudentAssessmentAnswerDetail>> GetAssessmentAnswerDetailsAsync(
            int studentId,
            int assessmentId)
        {
            List<StudentAssessmentAnswerDetail> details =
                new List<StudentAssessmentAnswerDetail>();

            using (MySqlConnection con = GetConnection())
            {
                string query = @"
                    SELECT
                        q.question_id,
                        q.description AS question_description,
                        mo.option_a,
                        mo.option_b,
                        mo.option_c,
                        mo.option_d,
                        mo.correct_answer,
                        sa.SelectedOption
                    FROM studentanswers sa
                    INNER JOIN questions q 
                        ON sa.QuestionId = q.question_id
                    LEFT JOIN mcq_options mo 
                        ON q.question_id = mo.question_id
                    WHERE sa.StudentId = @studentId
                    AND sa.AssessmentId = @assessmentId
                    ORDER BY q.question_id;";


                using (MySqlCommand cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@studentId", studentId);
                    cmd.Parameters.AddWithValue("@assessmentId", assessmentId);

                    await con.OpenAsync();

                    using (MySqlDataReader reader =
                           (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            details.Add(new StudentAssessmentAnswerDetail
                            {
                                QuestionId =
                                    Convert.ToInt32(reader["question_id"]),

                                QuestionDescription =
                                    reader["question_description"]?.ToString()
                                    ?? string.Empty,

                                OptionA =
                                    reader["option_a"]?.ToString(),

                                OptionB =
                                    reader["option_b"]?.ToString(),

                                OptionC =
                                    reader["option_c"]?.ToString(),

                                OptionD =
                                    reader["option_d"]?.ToString(),

                                CorrectAnswer =
                                    reader["correct_answer"]?.ToString(),

                                SelectedOption =
                                    reader["SelectedOption"]?.ToString()
                            });
                        }
                    }
                }
            }

            return details;
        }




        public async Task<AssessmentScores> GetAssessmentResultData(
            long studentId,
            long assessmentId)
        {
            AssessmentScores report = new AssessmentScores();


            using (MySqlConnection con = GetConnection())
            {
                string query = @"
                SELECT 
                    a.id AS assessment_id,
                    t.id AS test_id,
                    t.title AS test_title,
                    @studentId AS StudentId,

                    COUNT(DISTINCT CASE
                        WHEN sa.SelectedOption = mo.correct_answer
                        THEN tq.question_id
                    END) AS correct_answers,

                    COUNT(DISTINCT CASE
                        WHEN sa.SelectedOption IS NOT NULL
                        AND sa.SelectedOption <> mo.correct_answer
                        THEN tq.question_id
                    END) AS wrong_answers,

                    COUNT(DISTINCT tq.question_id) AS total_questions,

                    ROUND(
                        COUNT(DISTINCT CASE
                            WHEN sa.SelectedOption = mo.correct_answer
                            THEN tq.question_id
                        END) * 100.0
                        / NULLIF(COUNT(DISTINCT tq.question_id), 0),
                        2
                    ) AS score_percentage

                FROM (
                    SELECT id, test_id
                    FROM assessments
                    WHERE student_id = @studentId
                      AND (id = @assessmentId OR test_id = @assessmentId)
                    ORDER BY (id = @assessmentId) DESC, id DESC
                    LIMIT 1
                ) a
                INNER JOIN tests t
                    ON a.test_id = t.id
                LEFT JOIN test_questions tq
                    ON tq.test_id = t.id
                LEFT JOIN mcq_options mo
                    ON mo.question_id = tq.question_id
                LEFT JOIN studentanswers sa
                    ON sa.QuestionId = tq.question_id
                    AND sa.StudentId = @studentId
                    AND sa.AssessmentId = a.id
                GROUP BY a.id, t.id, t.title;
                ";


                using (MySqlCommand cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@studentId", studentId);
                    cmd.Parameters.AddWithValue("@assessmentId", assessmentId);


                    await con.OpenAsync();


                    using (MySqlDataReader reader =
                           (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            report.AssessmentId =
                                Convert.ToInt64(reader["assessment_id"]);

                            report.TestId =
                                reader["test_id"] != DBNull.Value
                                ? Convert.ToInt64(reader["test_id"])
                                : 0;


                            report.TestTitle =
                                reader["test_title"]?.ToString();


                            report.StudentId =
                                reader["StudentId"] != DBNull.Value
                                ? Convert.ToInt32(reader["StudentId"])
                                : 0;


                            report.CorrectAnswers =
                                reader["correct_answers"] != DBNull.Value
                                ? Convert.ToInt32(reader["correct_answers"])
                                : 0;


                            report.WrongAnswers =
                                reader["wrong_answers"] != DBNull.Value
                                ? Convert.ToInt32(reader["wrong_answers"])
                                : 0;


                            report.TotalQuestions =
                                reader["total_questions"] != DBNull.Value
                                ? Convert.ToInt32(reader["total_questions"])
                                : 0;


                            report.ScorePercentage =
                                reader["score_percentage"] != DBNull.Value
                                ? Convert.ToDecimal(reader["score_percentage"])
                                : 0;
                        }
                    }
                }
            }


            return report;
        }
    }
}