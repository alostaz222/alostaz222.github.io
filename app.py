from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='admin')
UPLOAD_FOLDER = 'media'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Path to GSettings.json
GSETTINGS_FILE = 'api/GSettings.json'
os.makedirs(os.path.dirname(GSETTINGS_FILE), exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('admin.html')

@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

@app.route('/add-entry', methods=['POST'])
def add_entry():
    try:
        entry = {
            'stage': request.form.get('stage'),
            'term': request.form.get('entryTerm'),
            'name': request.form.get('name'),
            'directory': request.form.get('directory'),
            'directoryOrder': request.form.get('directoryOrder'),
            'session': request.form.get('session'),
            'order': request.form.get('order'),
            'type': request.form.get('type'),
            'availabilityDate': request.form.get('formattedDate')  # New formatted date field
        }

        # Creating a unique key for each entry based on the format ${stage}_${directoryOrder}_${order}
        entry_key = f"{entry['stage']}_{entry['directoryOrder']}_{entry['order']}"

        file = request.files.get('file')
        if file:
            file_ext = os.path.splitext(file.filename)[1]
            result = f"{entry['stage']}_{entry['term']}_{entry['name']}_{entry['directory']}_{entry['session']}_{entry['order']}__{entry['directoryOrder']}_{entry['type']}"
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

        # Add or update the entry using the entry_key
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
