from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.assessment_routes import router


app = FastAPI(
    title="Student Assessment API",
    description="API for Student Assessment Management",
    version="1.0.0"
)


# Allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register API routes
app.include_router(router)


@app.get("/")
def home():

    return {
        "message": "Student Assessment API is running"
    }