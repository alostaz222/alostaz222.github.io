from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='admin')
UPLOAD_FOLDER = 'media'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Path to GSettings.json
GSETTINGS_FILE = 'api/GSettings.json'
os.makedirs(os.path.dirname(GSETTINGS_FILE), exist_ok=True)

# Translation map for Arabic to Franco-Arabic
arabic_to_franco = {
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': '7', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': '9', 
    'ض': '9\'', 'ط': '6', 'ظ': '6\'', 'ع': '3', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
    'ء': '2', 'أ': '2', 'إ': 'e', 'ؤ': '2', 'ئ': 'e', 'ى': 'a', 'ة': 'h'
}

def translate_to_francoarabic(arabic_text):
    # Translate Arabic characters to Franco-Arabic using the dictionary
    return ''.join([arabic_to_franco.get(char, char) for char in arabic_text])


def ensure_json_file_initialized(file_path):
    """Ensure the JSON file exists and is initialized with an empty dictionary if necessary."""
    if not os.path.exists(file_path):
        # If file doesn't exist, create it and initialize with an empty dictionary
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({}, f, ensure_ascii=False, indent=4)
    else:
        # If file exists but is empty or contains invalid JSON, reset it to an empty dictionary
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = f.read().strip()
                if not data or data == "":
                    raise ValueError("File is empty")
                json.loads(data)  # Attempt to parse the JSON
        except (ValueError, json.JSONDecodeError):
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump({}, f, ensure_ascii=False, indent=4)

@app.route('/')
def index():
    return app.send_static_file('admin.html')

@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

@app.route('/add-entry', methods=['POST'])
def add_entry():
    try:
        # Ensure the entries.json file is initialized
        entries_file = 'api/entries.json'
        ensure_json_file_initialized(entries_file)
        
        # Extract form data and translate the name field to English
        arabic_name = request.form.get('name')
        franco_name = translate_to_francoarabic(arabic_name)

        entry = {
            'stage': request.form.get('stage'),
            'term': request.form.get('entryTerm'),
            'name': arabic_name,
            'franco_name': franco_name,  # Store the translated Franco-Arabic name
            'availability': request.form.get('availability'),
            'directory': request.form.get('directory'),
            'directoryOrder': request.form.get('directoryOrder'),
            'session': request.form.get('session'),
            'order': request.form.get('order'),
            'type': request.form.get('type'),
            'availabilityDate': request.form.get('formattedDate')  # New formatted date field
        }

        # Creating a unique key for each entry
        entry_key = f"{entry['stage']}_{entry['directoryOrder']}_{entry['order']}_{franco_name}"

        file = request.files.get('file')
        if file:
            file_ext = os.path.splitext(file.filename)[1]
            if file_ext:
                result = f"{entry['stage']}_{entry['term']}_{entry['availability']}_{entry['directory']}_{entry['session']}_{entry['order']}__{entry['directoryOrder']}_{entry['type']}"
                unique_filename = f"{result}{file_ext}"
                file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                file.save(file_path)
                entry['file'] = unique_filename
                entry['url'] = f"/media/{unique_filename}"

        entries_file = 'api/entries.json'
        if os.path.exists(entries_file):
            with open(entries_file, 'r', encoding='utf-8') as f:
                entries = json.load(f)
        else:
            entries = {}

        # Add or update the entry using the unique entry_key
        entries[entry_key] = entry

        # Save updated entries to the file as an object (dictionary)
        with open(entries_file, 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=4)

        return jsonify({'status': 'success', 'message': 'Entry saved successfully!'})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/media/<filename>')
def media(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/save-term', methods=['POST'])
def save_term():
    try:
        term = request.json.get('term')
        settings = {}

        if os.path.exists(GSETTINGS_FILE):
            with open(GSETTINGS_FILE, 'r', encoding='utf-8') as f:
                settings = json.load(f)

        settings['CurrentTerm'] = term

        with open(GSETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=4)

        return jsonify({'status': 'success'})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/get-term', methods=['GET'])
def get_term():
    try:
        if os.path.exists(GSETTINGS_FILE):
            with open(GSETTINGS_FILE, 'r', encoding='utf-8') as f:
                settings = json.load(f)
            return jsonify({'term': settings.get('CurrentTerm')})
        else:
            return jsonify({'term': None})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
