import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
# CORS(app) automatically handles all OPTIONS preflight requests correctly
CORS(app) 

@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET'])
def handle_chat(path):
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return jsonify({"reply": "System Error: GROQ_API_KEY is missing."}), 200
            
        data = request.json or {}
        user_message = data.get("message", "")
        
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            # Duplicate model hata kar sirf ek stable model rakha hai
            model="llama3-8b-8192", 
            temperature=0.1,
            messages=[
                {
                    "role": "system",
                    "content": "You are Elara, the AI assistant for this portfolio website. The engineer is a QA Automation Engineer (do not use the engineer's personal name in testing demonstration content). Contact: skdas1641999@gmail.com"
                },
                {"role": "user", "content": user_message}
            ]
        )
        return jsonify({"reply": completion.choices[0].message.content}), 200
        
    except Exception as e:
        return jsonify({"reply": f"API Error: {str(e)}"}), 200

# Required for Vercel
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)