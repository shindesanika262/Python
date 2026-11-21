
from fastapi import APIRouter

from schemas.assessment_schemas import AssessmentCreate
from controllers.assessment_controller import save_assessment_controller

router = APIRouter()


@router.post("/save")
def save_assessment(data: AssessmentCreate):
    return save_assessment_controller(data)
