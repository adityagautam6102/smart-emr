from transformers import pipeline
import torch

class NLPSummarizer:
    def __init__(self):
        # Mocking the summarizer for the demo because the environment's 
        # transformers library (v5.5.3) is missing the 'summarization' task.
        # This ensures the backend can start and the frontend can be shown.
        pass

    async def summarize(self, text: str):
        if not text or len(text.strip()) < 10:
            return "Note too short to summarize."
        
        # Simple mockup: take the first sentence or first 100 characters
        summary = text.split('.')[0] + "."
        if len(summary) > 200:
            summary = text[:200] + "..."
        
        return f"[AI Summary]: {summary}"
