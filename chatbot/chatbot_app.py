# File: chatbot/chatbot_app.py

from flask import Flask, request, jsonify, render_template
import json
from api.nlp_engine import NLPEngine
from api.question_handler import QuestionHandler
from api.teacher_referral import TeacherReferral

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Initialize NLP Engine and Handlers
nlp_engine = NLPEngine()
question_handler = QuestionHandler(nlp_engine)
teacher_referral = TeacherReferral()

@app.route('/')
def chatbot_ui():
    return render_template('chatbot.html')

@app.route('/api/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question', '')

    if not question:
        return jsonify({"error": "No question provided."}), 400

    # Process the question using NLP Engine
    response = question_handler.handle_question(question)

    if response.get('status') == 'answered':
        return jsonify({"answer": response['answer']})

    # If the chatbot cannot answer, refer to teacher
    teacher_response = teacher_referral.escalate_to_teacher(question)
    return jsonify({"answer": teacher_response})

if __name__ == '__main__':
    app.run(debug=True)
