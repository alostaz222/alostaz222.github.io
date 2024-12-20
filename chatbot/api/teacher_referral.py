import random

class TeacherReferral:
    def escalate_to_teacher(self, question):
        """
        Escalates a question to a teacher with ticketing.
        :param question: str
        :return: str
        """
        ticket_id = random.randint(1000, 9999)  # Simulate a unique ticket number
        teacher_message = f"Ticket #{ticket_id}: This question has been referred to your teacher. You will receive an answer soon."
        return teacher_message
