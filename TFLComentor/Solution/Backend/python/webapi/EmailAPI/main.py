from fastapi import FastAPI

from routers.email_router import router as email_router
from services.email_service import EmailService
from repositories.email_repository import EmailRepository

app = FastAPI(title="Email API")

app.state.email_service = EmailService(EmailRepository())

app.include_router(email_router)


@app.get("/")
def home():
    return {"message": "Email API is running"}