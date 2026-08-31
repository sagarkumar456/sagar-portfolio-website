import os
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Basic CORS setup
CORS(app, resources={r"/*": {"origins": "*"}})

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Route exact match for Vercel Zero-Config
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat_with_ai():
    # Preflight (OPTIONS) explicitly handled for CORS
    if request.method == "OPTIONS":
        response = make_response(jsonify({"status": "ok"}))
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200
        
    try:
        data = request.json
        user_message = data.get("message")
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            temperature=0.1, 
            messages=[
                {
                    "role": "system", 
                    "content": """You are Elara. 

                    CRITICAL RULE: Respond ONLY in English. Do not add unnecessary greetings.

                    EXACT RESPONSE MATCHING:
                    - IF user says EXACTLY "hi", "hello", "hey": ALWAYS reply with "Hello! I am the official Elara AI for this portfolio website. How can I help you today?"
                    - IF user asks "who are you", "what is your name": ALWAYS reply with "I am the official Elara AI for this portfolio website."
                    - IF user says "contact", "phone", "email": ALWAYS reply with "The engineer is currently unavailable, but you can reach out directly via email (skdas1641999@gmail.com)."

                    PROFILE OF THE ENGINEER:
                    - Role: Manual & Automation Testing Engineer
                    - Experience: Over 3+ years in web, mobile, and API testing.
                    - Current Company: Software Testing Engineer at Onelap Telematics Pvt. Ltd. (March 2023 - Present).
                    - Skills: Playwright, Python, POM, BDD, Jenkins, Postman, SQL, JIRA, Trello.
                    """
                },
                {"role": "user", "content": user_message}
            ]
        )
        
        ai_reply = completion.choices[0].message.content
        
        final_response = make_response(jsonify({"reply": ai_reply}))
        final_response.headers.add("Access-Control-Allow-Origin", "*")
        return final_response
        
    except Exception as e:
        print("Error during Groq API call:", e)
        error_response = make_response(jsonify({"reply": "An error occurred with the backend server."}))
        error_response.headers.add("Access-Control-Allow-Origin", "*")
        return error_response, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)