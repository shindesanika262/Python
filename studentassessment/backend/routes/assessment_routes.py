from fastapi import APIRouter, HTTPException

from schemas.assessment_schema import AssessmentCreate
from services.assessment_service import AssessmentService


router = APIRouter(
    prefix="/api",
    tags=["Student Assessment"]
)

service = AssessmentService()


# Save assessment
@router.post("/assessments")
def save_assessment(data: AssessmentCreate):

    try:

        return service.save_assessment(data)

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail="Failed to save assessment"
        )


# Get all students
@router.get("/students")
def get_all_students():

    return service.get_all_students()


# Get assessment by student ID
@router.get("/assessments/{student_id}")
def get_assessment(student_id: int):

    result = service.get_assessment(student_id)

    if not result:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    return result