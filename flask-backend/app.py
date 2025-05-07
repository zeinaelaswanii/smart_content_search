from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import uuid

app = Flask(__name__)
CORS(app)

SEARCH_API_URL = "https://smartcontentsearch-production.up.railway.app/search"

@app.route("/search", methods=["GET"])
def search():
    query_params = request.args.to_dict()
    if "page" not in query_params:
        query_params["page"] = 1
    if "per_page" not in query_params:
        query_params["per_page"] = 10

    print("Forwarding search parameters:", query_params)

    try:
        response = requests.get(SEARCH_API_URL, params=query_params, timeout=20)
        response.raise_for_status()
        print("Search API response:", response.json())  
        return jsonify(response.json())
    except requests.exceptions.Timeout:
        return jsonify({"error": "Search API request timed out"}), 504
    except requests.exceptions.RequestException as e:
        error_detail = e.response.text if e.response else str(e)
        return jsonify({"error": "Failed to fetch data from Search API", "details": error_detail}), 400


@app.route("/upload", methods=["POST"])
def upload():
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files provided"}), 400

    uploads_dir = "uploads"
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    saved_files = []
    for file in files:
        if file.filename == "" or not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Invalid file type. Only PDFs are allowed."}), 400
        
        unique_id = uuid.uuid4().hex[:8]
        filename = f"{unique_id}_{file.filename}"
        file_path = os.path.join(uploads_dir, filename)
        file.save(file_path)
        
        saved_files.append({"id": unique_id, "filename": filename, "file_path": file_path})

    return jsonify({"message": "Files uploaded successfully", "files": saved_files}), 200

@app.route("/process", methods=["POST"])
@app.route("/process/<lecture_id>", methods=["POST"])
def process(lecture_id=None):
    if lecture_id:
        message = f"Lecture {lecture_id} processed successfully."
    else:
        message = "All lectures processed successfully."
    return jsonify({"message": message}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5006)
