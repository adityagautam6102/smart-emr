from fhirpy import AsyncFHIRClient
import os

class FHIRService:
    def __init__(self):
        # Default to local HAPI FHIR in Docker
        self.url = os.getenv("FHIR_BASE_URL", "http://localhost:8080/fhir")
        self.client = AsyncFHIRClient(self.url)

    async def get_patient(self, patient_id: str):
        try:
            patient = await self.client.resources("Patient").search(_id=patient_id).first()
            if patient:
                return {
                    "id": patient.id,
                    "name": f"{patient.name[0].given[0]} {patient.name[0].family}",
                    "gender": patient.gender,
                    "birthDate": patient.birthDate
                }
        except Exception as e:
            print(f"Error fetching patient: {e}")
        return None

    async def get_lab_observations(self, patient_id: str):
        # In a real system, we'd search FHIR Observations
        # For this demo, we'll simulate fetching from FHIR or return mock data if server empty
        try:
            observations = await self.client.resources("Observation").search(patient=patient_id).fetch_all()
            if observations:
                return [
                    {
                        "name": obs.code.coding[0].display,
                        "value": obs.valueQuantity.value,
                        "unit": obs.valueQuantity.unit,
                        "timestamp": obs.effectiveDateTime
                    }
                    for obs in observations
                ]
        except Exception as e:
            print(f"Error fetching observations: {e}")
        
        # Return mock data for demo if FHIR call fails
        return [
            {"name": "Creatinine", "value": 1.4, "unit": "mg/dL", "timestamp": "2024-03-20T10:00:00Z"},
            {"name": "Glucose", "value": 155, "unit": "mg/dL", "timestamp": "2024-03-20T10:00:00Z"},
            {"name": "BloodPressureSystolic", "value": 130, "unit": "mmHg", "timestamp": "2024-03-20T10:00:00Z"},
        ]
