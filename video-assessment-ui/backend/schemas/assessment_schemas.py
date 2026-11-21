
from datetime import date

from pydantic import BaseModel, StrictInt, Field


class AssessmentCreate(BaseModel):

    student_name: str
    topic: str
    evaluate_mentor: str
    assessment_date: datetime


    depth_of_understanding: StrictInt = Field(ge=0, le=10)
    practical_demonstration: StrictInt = Field(ge=0, le=10)
    problem_solving_ability: StrictInt = Field(ge=0, le=10)
    content_composition: StrictInt = Field(ge=0, le=10)
    storytelling_ability: StrictInt = Field(ge=0, le=10)
    communication_skills: StrictInt = Field(ge=0, le=10)
    presentation_and_confidence: StrictInt = Field(ge=0, le=10)
    visual_and_video_quality: StrictInt = Field(ge=0, le=10)
    ai_literacy_and_independent_thinking: StrictInt = Field(ge=0, le=10)
    professionalism_and_audience_engagement: StrictInt = Field(ge=0, le=10)

    result_title: str
    mentor_feedback: str = ""
