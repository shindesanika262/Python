from fastapi import APIRouter, Depends, Request, status

from app.schemas.assessment_schema import Assessment, AssessmentResponse
from app.services.assessment_service import AssessmentService
from app.models.assessment_model import Assessment as AssessmentModel


router = APIRouter(
    prefix="/api/assessments",
    tags=["Assessments"]
)


def get_assessment_service(request: Request) -> AssessmentService:
    return request.app.state.assessment_service


@router.post("/addassessment", status_code=status.HTTP_201_CREATED)
def create_assessment_new(
    assessment: Assessment,
    service: AssessmentService = Depends(get_assessment_service)
):
    assessment_model = AssessmentModel(
        student_id=assessment.student_id,
        topic=assessment.topic,
        mentor_id=assessment.mentor_id,
        assessment_date=assessment.assessment_date,
        depth_understanding=assessment.depth_understanding,
        practical_demons=assessment.practical_demons,
        problem_ability=assessment.problem_ability,
        content=assessment.content,
        storytelling=assessment.storytelling,
        communication=assessment.communication,
        presentation=assessment.presentation,
        video_quality=assessment.video_quality,
        ai_literacy=assessment.ai_literacy,
        professionalism=assessment.professionalism,
        total_score=assessment.total_score,
        feedback=assessment.feedback
    )

    new_id = service.create_new_assessment(assessment_model)

    return {
        "message": "Video assessment added successfully",
        "new_assessment_id": new_id
    }