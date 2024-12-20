from flask import Flask, request, jsonify, render_template
import json
from api.nlp_engine import NLPEngine
from api.question_handler import QuestionHandler
from api.teacher_referral import TeacherReferral

app = Flask(__name__, template_folder='templates', static_folder='static')

# Initialize NLP Engine and Handlers
nlp_engine = NLPEngine()
question_handler = QuestionHandler(nlp_engine)
teacher_referral = TeacherReferral()

# Load questions from JSON files
def load_questions(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

# Route for displaying unanswered questions (for teacher)
@app.route('/teacher/questions', methods=['GET'])
def teacher_questions():
    unanswered_questions = load_questions('static/data/unanswered_questions.json')
    return jsonify(unanswered_questions)

# Route for submitting an answer to a question (by teacher)
@app.route('/teacher/answer', methods=['POST'])
def teacher_answer():
    data = request.get_json()
    question_id = data.get('question_id')
    answer = data.get('answer')
    
    # Load unanswered questions and find the question
    unanswered = load_questions('static/data/unanswered_questions.json')
    answered = load_questions('static/data/answered_questions.json')
    
    question = next(q for q in unanswered['questions'] if q['id'] == question_id)
    question['answer'] = answer
    question['teacher'] = "Mr. Smith"  # Example teacher name
    
    # Remove from unanswered and add to answered questions
    unanswered['questions'] = [q for q in unanswered['questions'] if q['id'] != question_id]
    answered['questions'].append(question)
    
    # Save back the updated lists
    with open('static/data/unanswered_questions.json', 'w') as f:
        json.dump(unanswered, f)
    with open('static/data/answered_questions.json', 'w') as f:
        json.dump(answered, f)
    
    return jsonify({"status": "success", "message": "Answer submitted successfully!"})

# Route for displaying answered questions (for student)
@app.route('/student/questions', methods=['GET'])
def student_questions():
    answered_questions = load_questions('static/data/answered_questions.json')
    return jsonify(answered_questions)

if __name__ == '__main__':
    app.run(debug=True)
