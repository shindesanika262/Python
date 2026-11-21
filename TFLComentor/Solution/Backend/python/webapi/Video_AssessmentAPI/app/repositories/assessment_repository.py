
from app.models.assessment_model import Assessment
from app.core.config import getconnection


class AssessmentRepository:

    def add_assessment(self, assessment: Assessment) -> int:
        connection = getconnection()
        cursor = connection.cursor()

        total_score = (
            assessment.depth_understanding
            + assessment.practical_demons
            + assessment.problem_ability
            + assessment.content
            + assessment.storytelling
            + assessment.communication
            + assessment.presentation
            + assessment.video_quality
            + assessment.ai_literacy
            + assessment.professionalism
        )

        query = """
            INSERT INTO tflcomentor_db.video_assessments (
                student_id,
                topic,
                mentor_id,
                assessment_date,
                depth_understanding,
                practical_demons,
                problem_ability,
                content,
                storytelling,
                communication,
                presentation,
                video_quality,
                ai_literacy,
                professionalism,
                total_score,
                feedback
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s
            )
        """

        values = (
            assessment.student_id,
            assessment.topic,
            assessment.mentor_id,
            assessment.assessment_date,
            assessment.depth_understanding,
            assessment.practical_demons,
            assessment.problem_ability,
            assessment.content,
            assessment.storytelling,
            assessment.communication,
            assessment.presentation,
            assessment.video_quality,
            assessment.ai_literacy,
            assessment.professionalism,
            total_score,
            assessment.feedback,
        )

        cursor.execute(query, values)
        connection.commit()

        new_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return new_id
