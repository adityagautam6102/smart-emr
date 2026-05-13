import requests
import json
import time

FHIR_URL = "http://localhost:8080/fhir"

def wait_for_fhir():
    print("Waiting for FHIR server to be ready...")
    for i in range(30):
        try:
            res = requests.get(f"{FHIR_URL}/metadata")
            if res.status_code == 200:
                print("FHIR server is ready!")
                return True
        except:
            pass
        time.sleep(2)
    return False

def upload_sample_data():
    # Sample Patient
    patient = {
        "resourceType": "Patient",
        "id": "12345",
        "name": [{"family": "Doe", "given": ["Jane"]}],
        "gender": "female",
        "birthDate": "1985-06-15"
    }
    
    # Sample Observations (Labs)
    observations = [
        {
            "resourceType": "Observation",
            "status": "final",
            "code": {"coding": [{"system": "http://loinc.org", "code": "2160-0", "display": "Creatinine"}]},
            "subject": {"reference": "Patient/12345"},
            "effectiveDateTime": "2024-03-20T10:00:00Z",
            "valueQuantity": {"value": 2.1, "unit": "mg/dL", "system": "http://unitsofmeasure.org", "code": "mg/dL"}
        },
        {
            "resourceType": "Observation",
            "status": "final",
            "code": {"coding": [{"system": "http://loinc.org", "code": "2339-0", "display": "Glucose"}]},
            "subject": {"reference": "Patient/12345"},
            "effectiveDateTime": "2024-03-20T10:00:00Z",
            "valueQuantity": {"value": 185, "unit": "mg/dL", "system": "http://unitsofmeasure.org", "code": "mg/dL"}
        }
    ]

    print("Uploading patient...")
    requests.put(f"{FHIR_URL}/Patient/12345", json=patient)

    print("Uploading lab observations...")
    for obs in observations:
        requests.post(f"{FHIR_URL}/Observation", json=obs)

    print("Sample data populated successfully!")

if __name__ == "__main__":
    if wait_for_fhir():
        upload_sample_data()
    else:
        print("Could not connect to FHIR server.")
