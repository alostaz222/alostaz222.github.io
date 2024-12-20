import spacy

class NLPEngine:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def process_question(self, question):
        """
        Processes a question and extracts key information using spaCy.
        :param question: str
        :return: dict with parsed intent and context
        """
        doc = self.nlp(question)

        # Here, you can use spacy's entity recognition, POS tagging, etc.
        for ent in doc.ents:
            if ent.label_ == "GPE":  # Check for geopolitical entities
                return {"intent": "location_search", "context": {"location": ent.text}}

        if "Newton's Laws" in question:
            return {"intent": "topic_search", "context": {"topic": "Newton's Laws"}}
        return {"intent": "unknown", "context": {}}
