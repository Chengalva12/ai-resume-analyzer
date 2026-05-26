from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import fitz
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False
    allow_methods=["*"],
    allow_headers=["*"],
)

SKILLS = [
    "python", "java", "sql", "machine learning",
    "deep learning", "nlp", "react", "fastapi",
    "flask", "aws", "docker", "git",
    "mongodb", "postgresql", "tensorflow",
    "pytorch", "langchain", "rag",
    "openai api", "data analysis"
]

def extract_pdf_text(file_bytes):
    text = ""
    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    for page in pdf:
        text += page.get_text()

    return text

def clean_text(text):
    return re.sub(r"\s+", " ", text.lower())

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    file_bytes = await resume.read()

    resume_text = clean_text(
        extract_pdf_text(file_bytes)
    )

    jd_text = clean_text(job_description)

    matched_skills = []
    missing_skills = []

    for skill in SKILLS:

        if skill in resume_text and skill in jd_text:
            matched_skills.append(skill)

        elif skill in jd_text and skill not in resume_text:
            missing_skills.append(skill)

    total_required = len(matched_skills) + len(missing_skills)

    if total_required == 0:
        score = 0
    else:
        score = round(
            (len(matched_skills) / total_required) * 100
        )

    suggestions = []

    for skill in missing_skills:
        suggestions.append(
            f"Add projects or experience related to {skill}."
        )

    return {
        "ats_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }