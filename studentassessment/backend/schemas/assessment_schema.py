from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AssessmentCreate(BaseModel):

    student_name: str = Field(min_length=1)
    topic: str
    evaluate_mentor: str
    assessment_date: datetime

    depth_of_understanding: int = Field(ge=0, le=10)
    practical_demonstration: int = Field(ge=0, le=10)
    problem_solving_ability: int = Field(ge=0, le=10)
    content_composition: int = Field(ge=0, le=10)
    storytelling_ability: int = Field(ge=0, le=10)
    communication_skills: int = Field(ge=0, le=10)
    presentation_and_confidence: int = Field(ge=0, le=10)
    visual_and_video_quality: int = Field(ge=0, le=10)
    ai_literacy_and_independent_thinking: int = Field(ge=0, le=10)
    professionalism_and_audience_engagement: int = Field(ge=0, le=10)

    result_title: str
    mentor_feedback: Optional[str] = ""


class AssessmentResponse(BaseModel):

    message: str
    student_id: int
    total_score: int
    max_marks: int