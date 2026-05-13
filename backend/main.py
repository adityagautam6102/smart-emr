from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random
import uvicorn

from backend.services.nlp_service import NLPSummarizer
from backend.services.alert_system import AlertSystem, ClinicalAlert
from backend.services.fhir_service import FHIRService

app = FastAPI(title="SMART EMR API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
nlp_summarizer = NLPSummarizer()
alert_system = AlertSystem()
fhir_service = FHIRService()

# ==================== FAKE DATA ====================
FAKE_PATIENTS = {
    "P001": {
        "id": "P001",
        "name": "John Smith",
        "age": 58,
        "gender": "male",
        "birthDate": "1967-03-15",
        "mrn": "MRN-001234",
        "department": "Cardiology",
        "status": "Admitted",
        "admission_date": "2026-05-10"
    },
    "P002": {
        "id": "P002",
        "name": "Sarah Johnson",
        "age": 42,
        "gender": "female",
        "birthDate": "1983-07-22",
        "mrn": "MRN-005678",
        "department": "Oncology",
        "status": "Outpatient",
        "admission_date": None
    },
    "P003": {
        "id": "P003",
        "name": "Michael Chen",
        "age": 71,
        "gender": "male",
        "birthDate": "1954-11-08",
        "mrn": "MRN-009012",
        "department": "Nephrology",
        "status": "Admitted",
        "admission_date": "2026-05-08"
    }
}

FAKE_CLINICAL_NOTES = {
    "P001": "Patient presents with chest pain radiating to left arm and dyspnea. Vital signs show elevated blood pressure 155/95 mmHg. EKG shows ST elevation in anterior leads. Patient has history of hypertension and type 2 diabetes. Recent lab work shows elevated troponin levels. Recommended admission to CCU for cardiac monitoring and evaluation. Cardiologist consulted.",
    "P002": "62-year-old female presenting with complaint of persistent cough and weight loss over 3 months. Chest X-ray reveals mass in right upper lobe suspicious for malignancy. Sputum culture negative for TB. Patient is a former smoker with 15 pack-year history. Referred for oncology evaluation and possible biopsy.",
    "P003": "Patient with chronic kidney disease stage 4 presents for routine follow-up. Creatinine elevated at 2.8 mg/dL, up from 2.5 last month. Urine protein 4+ on urinalysis. Patient reports increased fatigue and decreased appetite. Discussing renal replacement therapy options.",
}

FAKE_LAB_DATA = {
    "P001": [
        {"name": "Troponin I", "value": 2.5, "unit": "ng/mL", "timestamp": "2026-05-13T08:00:00Z", "reference": "0-0.04"},
        {"name": "Creatinine", "value": 1.8, "unit": "mg/dL", "timestamp": "2026-05-13T08:00:00Z", "reference": "0.7-1.3"},
        {"name": "Glucose", "value": 185, "unit": "mg/dL", "timestamp": "2026-05-13T08:00:00Z", "reference": "70-100"},
        {"name": "Blood Pressure Systolic", "value": 155, "unit": "mmHg", "timestamp": "2026-05-13T08:00:00Z", "reference": "<120"},
        {"name": "Blood Pressure Diastolic", "value": 95, "unit": "mmHg", "timestamp": "2026-05-13T08:00:00Z", "reference": "<80"},
    ],
    "P002": [
        {"name": "Creatinine", "value": 0.9, "unit": "mg/dL", "timestamp": "2026-05-13T09:30:00Z", "reference": "0.7-1.3"},
        {"name": "Glucose", "value": 95, "unit": "mg/dL", "timestamp": "2026-05-13T09:30:00Z", "reference": "70-100"},
        {"name": "Hemoglobin", "value": 11.5, "unit": "g/dL", "timestamp": "2026-05-13T09:30:00Z", "reference": "12-16"},
        {"name": "WBC Count", "value": 6.2, "unit": "K/uL", "timestamp": "2026-05-13T09:30:00Z", "reference": "4.5-11"},
    ],
    "P003": [
        {"name": "Creatinine", "value": 2.8, "unit": "mg/dL", "timestamp": "2026-05-13T07:00:00Z", "reference": "0.7-1.3"},
        {"name": "BUN", "value": 52, "unit": "mg/dL", "timestamp": "2026-05-13T07:00:00Z", "reference": "7-20"},
        {"name": "Potassium", "value": 5.8, "unit": "mEq/L", "timestamp": "2026-05-13T07:00:00Z", "reference": "3.5-5.0"},
        {"name": "Phosphorus", "value": 5.2, "unit": "mg/dL", "timestamp": "2026-05-13T07:00:00Z", "reference": "2.5-4.5"},
    ]
}

TREATMENT_RECOMMENDATIONS = {
    "P001": [
        "Initiate dual antiplatelet therapy (Aspirin + P2Y12 inhibitor)",
        "Start high-intensity statin therapy (Atorvastatin 80mg)",
        "Beta-blocker for rate and blood pressure control",
        "ACE inhibitor for cardiac remodeling prevention",
        "Schedule cardiac catheterization within 24 hours"
    ],
    "P002": [
        "Refer for PET/CT scan to rule out metastatic disease",
        "Schedule pulmonary biopsy for tissue diagnosis",
        "Consider oncology consultation for treatment planning",
        "Screen for paraneoplastic syndromes",
        "Nutritional support and counseling"
    ],
    "P003": [
        "Initiate nephrology consultation for dialysis planning",
        "Start phosphate binder (Calcium acetate with meals)",
        "Restrict sodium intake to <2g daily",
        "Restrict fluid intake based on urine output",
        "Schedule AV fistula creation for hemodialysis access"
    ]
}

# ==================== MODELS ====================
class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    summary: str

class LabTrend(BaseModel):
    date: str
    value: float

class PatientSummary(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    mrn: str
    department: str
    status: str

# ==================== ENDPOINTS ====================
@app.get("/")
async def root():
    return {"status": "ok", "message": "SMART EMR Backend is running", "version": "1.0.0"}

@app.get("/api/patients", response_model=List[PatientSummary])
async def get_all_patients():
    """Get list of all patients"""
    return [
        PatientSummary(
            id=p["id"],
            name=p["name"],
            age=p["age"],
            gender=p["gender"],
            mrn=p["mrn"],
            department=p["department"],
            status=p["status"]
        ) for p in FAKE_PATIENTS.values()
    ]

@app.get("/api/patient/{patient_id}")
async def get_patient(patient_id: str):
    """Get patient details"""
    if patient_id in FAKE_PATIENTS:
        return FAKE_PATIENTS[patient_id]
    # Fallback to mock data
    return {
        "id": patient_id,
        "name": "Jane Doe",
        "age": 45,
        "gender": "female",
        "birthDate": "1980-06-15",
        "mrn": "MRN-999999",
        "department": "General Medicine",
        "status": "Outpatient"
    }

@app.get("/api/patient/{patient_id}/notes")
async def get_clinical_notes(patient_id: str):
    """Get clinical notes for patient"""
    if patient_id in FAKE_CLINICAL_NOTES:
        return {
            "patient_id": patient_id,
            "notes": FAKE_CLINICAL_NOTES[patient_id],
            "last_updated": "2026-05-13T08:00:00Z"
        }
    return {
        "patient_id": patient_id,
        "notes": "No clinical notes available",
        "last_updated": None
    }

@app.get("/api/patient/{patient_id}/labs")
async def get_patient_labs(patient_id: str):
    """Get lab observations for patient"""
    if patient_id in FAKE_LAB_DATA:
        return {
            "patient_id": patient_id,
            "labs": FAKE_LAB_DATA[patient_id],
            "timestamp": "2026-05-13T10:00:00Z"
        }
    return {
        "patient_id": patient_id,
        "labs": [],
        "timestamp": None
    }

@app.get("/api/patient/{patient_id}/recommendations")
async def get_treatment_recommendations(patient_id: str):
    """Get treatment recommendations for patient"""
    if patient_id in TREATMENT_RECOMMENDATIONS:
        return {
            "patient_id": patient_id,
            "recommendations": TREATMENT_RECOMMENDATIONS[patient_id],
            "generated_at": "2026-05-13T08:30:00Z"
        }
    return {
        "patient_id": patient_id,
        "recommendations": [],
        "generated_at": None
    }

@app.get("/api/alerts", response_model=List[ClinicalAlert])
async def get_alerts(patient_id: str = "P001"):
    """Get clinical alerts for patient"""
    try:
        lab_data = FAKE_LAB_DATA.get(patient_id, [])
        alerts = alert_system.analyze_labs(lab_data)
        return alerts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    """Summarize clinical text"""
    try:
        summary = await nlp_summarizer.summarize(request.text)
        return SummarizeResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/patient/{patient_id}/trends")
async def get_lab_trends(patient_id: str, lab_name: str = "Creatinine"):
    """Get lab value trends over time"""
    # Simulate historical data
    trends = []
    base_value = 1.0
    if patient_id == "P001":
        base_value = 1.6
    elif patient_id == "P003":
        base_value = 2.4
    
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime("%Y-%m-%d")
        value = base_value + random.uniform(-0.3, 0.3)
        trends.append({"date": date, "value": round(value, 2)})
    
    return {
        "patient_id": patient_id,
        "lab_name": lab_name,
        "trends": trends
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
