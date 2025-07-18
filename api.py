from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

FIGMA_TOKEN = os.getenv("FIGMA_TOKEN")
TEAM_ID = os.getenv("TEAM_ID")

headers = {"X-Figma-Token": FIGMA_TOKEN}

@app.route("/search")
def search():
    keyword = request.args.get("q", "").lower()
    if not keyword:
        return jsonify({"error": "关键词不能为空"}), 400

    projects_res = requests.get(f"https://api.figma.com/v1/teams/{TEAM_ID}/projects", headers=headers)
    projects = projects_res.json().get("projects", [])

    results = []
    for proj in projects:
        files_res = requests.get(f"https://api.figma.com/v1/projects/{proj['id']}/files", headers=headers)
        files = files_res.json().get("files", [])
        for f in files:
            if keyword in f["name"].lower():
                results.append({
                    "name": f["name"],
                    "link": f"https://www.figma.com/file/{f['key']}",
                    "thumbnail": f.get("thumbnail_url", "")
                })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run()
