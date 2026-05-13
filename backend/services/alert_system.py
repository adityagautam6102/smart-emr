from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ClinicalAlert(BaseModel):
    id: str
    type: str  # e.g., "LabResult"
    severity: str  # "Critical", "Warning", "Normal"
    message: str
    value: float
    unit: str
    timestamp: str

class AlertSystem:
    def __init__(self):
        # Comprehensive clinical thresholds
        self.thresholds = {
            "Troponin I": {"max": 0.04, "unit": "ng/mL"},
            "Creatinine": {"max": 1.3, "unit": "mg/dL"},
            "Glucose": {"max": 140, "min": 70, "unit": "mg/dL"},
            "Blood Pressure Systolic": {"max": 140, "unit": "mmHg"},
            "Blood Pressure Diastolic": {"max": 90, "unit": "mmHg"},
            "BUN": {"max": 20, "unit": "mg/dL"},
            "Potassium": {"max": 5.0, "min": 3.5, "unit": "mEq/L"},
            "Hemoglobin": {"max": 16, "min": 12, "unit": "g/dL"},
            "WBC Count": {"max": 11, "min": 4.5, "unit": "K/uL"},
            "Phosphorus": {"max": 4.5, "unit": "mg/dL"},
        }

    def analyze_labs(self, lab_data: List[dict]) -> List[ClinicalAlert]:
        alerts = []
        for lab in lab_data:
            name = lab.get("name")
            value = lab.get("value")
            unit = lab.get("unit")
            time = lab.get("timestamp", datetime.now().isoformat())

            if name in self.thresholds:
                threshold = self.thresholds[name]
                severity = "Normal"
                message = f"{name} is within normal range."

                if "max" in threshold and value > threshold["max"]:
                    if value > threshold["max"] * 1.5:
                        severity = "Critical"
                        message = f"CRITICAL: {name} significantly elevated: {value} {unit}."
                    else:
                        severity = "Warning"
                        message = f"Elevated {name}: {value} {unit}."
                elif "min" in threshold and value < threshold["min"]:
                    if value < threshold["min"] * 0.75:
                        severity = "Critical"
                        message = f"CRITICAL: {name} significantly low: {value} {unit}."
                    else:
                        severity = "Warning"
                        message = f"Low {name}: {value} {unit}."

                if severity != "Normal":
                    alerts.append(ClinicalAlert(
                        id=f"alert-{name.replace(' ', '-')}-{time}",
                        type="LabResult",
                        severity=severity,
                        message=message,
                        value=value,
                        unit=unit,
                        timestamp=time
                    ))
        return alerts
