
from repository.db import db


def save_assessment(data):

    connection = db.get_connection()
    cursor = connection.cursor()

    try:
        connection.start_transaction()

        student_name = data["student_name"]
        topic = data["topic"]
        evaluate_mentor = data["evaluate_mentor"]
        assessment_date = data["assessment_date"]
        scores = data["scores"]
        result_title = data.get("result_title")
        mentor_feedback = data.get("mentor_feedback")

        if len(assessment_date) == 10:
            formatted_date = assessment_date + " 00:00:00"
        else:
            formatted_date = assessment_date

        # 1. Insert Student Information
        cursor.execute(
            """
            INSERT INTO student_info (student_name, topic, evaluate_mentor, assessment_date)
            VALUES (%s, %s, %s, %s)""",
            (student_name,topic, evaluate_mentor,formatted_date )
        )

        student_id = cursor.lastrowid

        # 2. Insert Assessment Rubric
        cursor.execute(
            """
            INSERT INTO assessment_rubric (
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
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (student_id, *scores, 100)
        )

        rubric_id = cursor.lastrowid

        # 3. Insert Student Assessment Scores
        total_score = sum(scores)

        cursor.execute(
            """
            INSERT INTO student_assessment_scores
            (student_id, rubric_id, score)
            VALUES (%s, %s, %s)
            """,
            (
                student_id,
                rubric_id,
                total_score
            )
        )

        # 4. Insert Assessment Results
        cursor.execute(
            """
            INSERT INTO assessment_results
            (student_id, total_score, result_title, mentor_feedback)
            VALUES (%s, %s, %s, %s)
            """,
            (
                student_id,
                total_score,
                result_title or "Workplace-ready potential",
                mentor_feedback or ""
            )
        )

        result_id = cursor.lastrowid

        connection.commit()

        return {
            "student_id": student_id,
            "rubric_id": rubric_id,
            "result_id": result_id,
            "total_score": total_score
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()
