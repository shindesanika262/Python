from database import get_connection


class AssessmentRepository:

    def save_assessment(self, data, total_score):

        connection = get_connection()
        cursor = connection.cursor()

        try:

            # Insert student details
            student_query = """
                INSERT INTO student_info
                (
                    student_name,
                    topic,
                    evaluate_mentor,
                    assessment_date
                )
                VALUES (%s, %s, %s, %s)
            """

            cursor.execute(
                student_query,
                (
                    data.student_name,
                    data.topic,
                    data.evaluate_mentor,
                    data.assessment_date
                )
            )

            student_id = cursor.lastrowid

            # Insert assessment criteria
            rubric_query = """
                INSERT INTO assessment_rubric
                (
                    student_id,
                    depth_of_understanding,
                    practical_demonstration,
                    problem_solving_ability,
                    content_composition,
                    storytelling_ability,
                    communication_skills,
                    presentation_and_confidence,
                    visual_and_video_quality,
                    ai_literacy_and_independent_thinking,
                    professionalism_and_audience_engagement,
                    max_marks
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s
                )
            """

            cursor.execute(
                rubric_query,
                (
                    student_id,
                    data.depth_of_understanding,
                    data.practical_demonstration,
                    data.problem_solving_ability,
                    data.content_composition,
                    data.storytelling_ability,
                    data.communication_skills,
                    data.presentation_and_confidence,
                    data.visual_and_video_quality,
                    data.ai_literacy_and_independent_thinking,
                    data.professionalism_and_audience_engagement,
                    100
                )
            )

            rubric_id = cursor.lastrowid

            # Insert total assessment score
            score_query = """
                INSERT INTO student_assessment_scores
                (
                    student_id,
                    rubric_id,
                    score
                )
                VALUES (%s, %s, %s)
            """

            cursor.execute(
                score_query,
                (student_id, rubric_id, total_score)
            )

            # Insert assessment result and feedback
            result_query = """
                INSERT INTO assessment_results
                (
                    student_id,
                    total_score,
                    result_title,
                    mentor_feedback
                )
                VALUES (%s, %s, %s, %s)
            """

            cursor.execute(
                result_query,
                (
                    student_id,
                    total_score,
                    data.result_title,
                    data.mentor_feedback
                )
            )

            # Save all changes
            connection.commit()

            return student_id

        except Exception as e:

          # Undo changes if an insert fails
              connection.rollback()

              print("Database Error:", e)

              raise

        finally:

            cursor.close()
            connection.close()


    def get_all_students(self):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        try:

            cursor.execute("""
                SELECT *
                FROM student_info
                ORDER BY student_id DESC
            """)

            return cursor.fetchall()

        finally:

            cursor.close()
            connection.close()


    def get_assessment_by_student_id(self, student_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        try:

            query = """
                SELECT
                    s.student_id,
                    s.student_name,
                    s.topic,
                    s.evaluate_mentor,
                    s.assessment_date,

                    r.depth_of_understanding,
                    r.practical_demonstration,
                    r.problem_solving_ability,
                    r.content_composition,
                    r.storytelling_ability,
                    r.communication_skills,
                    r.presentation_and_confidence,
                    r.visual_and_video_quality,
                    r.ai_literacy_and_independent_thinking,
                    r.professionalism_and_audience_engagement,

                    sc.score AS total_score,
                    ar.result_title,
                    ar.mentor_feedback

                FROM student_info s

                LEFT JOIN assessment_rubric r
                    ON s.student_id = r.student_id

                LEFT JOIN student_assessment_scores sc
                    ON s.student_id = sc.student_id
                    AND r.rubric_id = sc.rubric_id

                LEFT JOIN assessment_results ar
                    ON s.student_id = ar.student_id

                WHERE s.student_id = %s
            """

            cursor.execute(query, (student_id,))

            return cursor.fetchone()

        finally:

            cursor.close()
            connection.close()