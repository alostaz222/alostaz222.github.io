# File: chatbot/api/question_handler.py

class QuestionHandler:
    def __init__(self, nlp_engine):
        self.nlp_engine = nlp_engine

    def handle_question(self, question):
        """
        Handles the user question and provides a response.
        :param question: str
        :return: dict
        """
        # Analyze question with NLP engine
        parsed_question = self.nlp_engine.process_question(question)

        if parsed_question["intent"] == "topic_search":
            # Example response
            return {"status": "answered", "answer": f"Here is information about {parsed_question['context']['topic']}."}

        # Return a fallback if not handled
        return {"status": "unanswered"}
