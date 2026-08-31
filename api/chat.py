import os
from flask import Flask, request, jsonify
from groq import Groq

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['POST', 'OPTIONS', 'GET'])
@app.route('/<path:path>', methods=['POST', 'OPTIONS', 'GET'])
def handle_chat(path):
    # Auto-approve preflight requests
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return jsonify({"reply": "System Error: GROQ_API_KEY is missing."}), 200
            
        data = request.json or {}
        user_message = data.get("message", "")
        
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama3-8b-8192", 
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            messages=[
                {
                    "role": "system",
                    "content": "You are Elara, the AI assistant for this portfolio website. The engineer is a QA Automation Engineer. Contact: skdas1641999@gmail.com"
                },
                {"role": "user", "content": user_message}
            ]
        )
        return jsonify({"reply": completion.choices[0].message.content}), 200
        
    except Exception as e:
        # Return a 200 status code with the error text so CORS doesn't block it
        return jsonify({"reply": f"API Error: {str(e)}"}), 200

# Required for Vercel
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)