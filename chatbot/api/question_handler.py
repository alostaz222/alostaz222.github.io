class QuestionHandler:
    def __init__(self, nlp_engine):
        self.nlp_engine = nlp_engine

    def handle_question(self, question):
        """
        Handles the user question and provides a response.
        :param question: str
        :return: dict
        """
        parsed_question = self.nlp_engine.process_question(question)

        if parsed_question["intent"] == "topic_search":
            topic = parsed_question['context']['topic']
            return {"status": "answered", "answer": f"Here is a detailed explanation about {topic}: \n- Newton's Laws describe the relationship between the motion of an object and the forces acting on it."}

        if parsed_question["intent"] == "location_search":
            location = parsed_question['context']['location']
            return {"status": "answered", "answer": f"Here is some information about {location}."}

        return {"status": "unanswered", "answer": "I couldn't find the information you're asking for. Please contact your teacher for more details."}
