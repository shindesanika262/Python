from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class Assessment(BaseModel):
    student_id: Optional[int] = None
    topic: str
    mentor_id: int
    assessment_date: date

    depth_understanding: int = Field(default=0, ge=0, le=10)
    practical_demons: int = Field(default=0, ge=0, le=10)
    problem_ability: int = Field(default=0, ge=0, le=10)
    content: int = Field(default=0, ge=0, le=10)
    storytelling: int = Field(default=0, ge=0, le=10)
    communication: int = Field(default=0, ge=0, le=10)
    presentation: int = Field(default=0, ge=0, le=10)
    video_quality: int = Field(default=0, ge=0, le=10)
    ai_literacy: int = Field(default=0, ge=0, le=10)
    professionalism: int = Field(default=0, ge=0, le=10)

    total_score: int = Field(default=0, ge=0, le=100)
    feedback: Optional[str] = None


class AssessmentResponse(Assessment):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)