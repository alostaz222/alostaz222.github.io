import json
import os
import re

# Define the path to the JSON file and HTML files
json_file_path = './api/pages_data.json'
html_files = {
    "index": "index.html",
    "404": "404.html",
    "account": "account.html",
    "auth": "auth.html",
    "contact": "contact.html",
    "coupon": "coupon.html",
    "pricing": "pricing.html",
    "sessions": "sessions.html"
}

def load_json(file_path):
    """Load JSON data from a file."""
    if not os.path.isfile(file_path):
        print(f"File not found: {file_path}")
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def update_html_file(file_path, data):
    """Update the HTML file with the provided metadata."""
    if not os.path.isfile(file_path):
        print(f"HTML file not found: {file_path}")
        return

    with open(file_path, 'r+', encoding='utf-8') as file:
        content = file.read()
        
        # Update title
        if 'title' in data:
            content = re.sub(r'<title>.*?</title>', f'<title>{data["title"]}</title>', content, flags=re.IGNORECASE)
        
        # Update meta tags
        for meta_name, meta_content in data.get('meta', {}).items():
            pattern = rf'<meta name="{meta_name}" content=".*?">'
            replacement = f'<meta name="{meta_name}" content="{meta_content}">'
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        # Update Open Graph tags
        for og_property, og_content in data.get('og', {}).items():
            pattern = rf'<meta property="og:{og_property}" content=".*?">'
            replacement = f'<meta property="og:{og_property}" content="{og_content}">'
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

        # Update JSON-LD structured data
        json_ld = data.get('json_ld', {})
        if json_ld:
            json_ld_str = json.dumps(json_ld, indent=4, ensure_ascii=False)
            json_ld_pattern = r'<script type="application/ld\+json">.*?</script>'
            json_ld_replacement = f'<script type="application/ld+json">{json_ld_str}</script>'
            content = re.sub(json_ld_pattern, json_ld_replacement, content, flags=re.DOTALL)
        
        file.seek(0)
        file.write(content)
        file.truncate()
        print(f"Updated {file_path} with metadata.")

def main():
    # Load JSON data
    data = load_json(json_file_path)
    if data is None:
        print("Failed to load JSON data.")
        return

    # Update HTML files
    for page, file_name in html_files.items():
        if page in data:
            update_html_file(file_name, data[page])
        else:
            print(f"No data found for page: {page}")

if __name__ == "__main__":
    main()
