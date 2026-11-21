from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class Assessment:
    id: Optional[int] = None
    student_id: Optional[int] = None
    topic: str = ""
    mentor_id: int = 0
    assessment_date: Optional[date] = None

    depth_understanding: int = 0
    practical_demons: int = 0
    problem_ability: int = 0
    content: int = 0
    storytelling: int = 0
    communication: int = 0
    presentation: int = 0
    video_quality: int = 0
    ai_literacy: int = 0
    professionalism: int = 0

    total_score: int = 0
    feedback: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None