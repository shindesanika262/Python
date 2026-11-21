
from fastapi import HTTPException

from schemas.assessment_schemas import AssessmentCreate
from services.assessment_service import save_assessment


def save_assessment_controller(data: AssessmentCreate):

    scores = [
        data.depth_of_understanding,
        data.practical_demonstration,
        data.problem_solving_ability,
        data.content_composition,
        data.storytelling_ability,
        data.communication_skills,
        data.presentation_and_confidence,
        data.visual_and_video_quality,
        data.ai_literacy_and_independent_thinking,
        data.professionalism_and_audience_engagement
    ]

    try:
        result = save_assessment({
            "student_name": data.student_name,
            "topic": data.topic,
            "evaluate_mentor": data.evaluate_mentor,
            "assessment_date": data.assessment_date.isoformat(),
            "scores": scores,
            "result_title": data.result_title,
            "mentor_feedback": data.mentor_feedback
        })

        return {
            "success": True,
            "message": "Assessment saved successfully!",
            **result
        }

    except Exception as error:
        print("Assessment Error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to save assessment"
        )
