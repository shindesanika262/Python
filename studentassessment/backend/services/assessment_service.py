from repositories.assessment_repository import AssessmentRepository


class AssessmentService:

    def __init__(self):

        self.repository = AssessmentRepository()


    def save_assessment(self, data):

        # Calculate total score from all 10 criteria
        total_score = (
            data.depth_of_understanding
            + data.practical_demonstration
            + data.problem_solving_ability
            + data.content_composition
            + data.storytelling_ability
            + data.communication_skills
            + data.presentation_and_confidence
            + data.visual_and_video_quality
            + data.ai_literacy_and_independent_thinking
            + data.professionalism_and_audience_engagement
        )

        # Save assessment into MySQL
        student_id = self.repository.save_assessment(
            data,
            total_score
        )

        return {
            "message": "Assessment saved successfully",
            "student_id": student_id,
            "total_score": total_score,
            "max_marks": 100
        }


    def get_all_students(self):

        return self.repository.get_all_students()


    def get_assessment(self, student_id):

        return self.repository.get_assessment_by_student_id(
            student_id
        )