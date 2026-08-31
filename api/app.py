import os
from flask import Flask, request, jsonify, make_response
from groq import Groq

app = Flask(__name__)

# 1. GLOBAL CORS HANDLER: Har preflight request (OPTIONS) ko yahan pass karenge
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
        return response

def send_cors_response(data, status=200):
    response = make_response(jsonify(data))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, status

# 2. CATCH-ALL ROUTE: Vercel URL mein kuch bhi bhej de, Flask usko pakad lega
@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET'])
def chat_with_ai(path):
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return send_cors_response({"reply": "Backend Error: GROQ_API_KEY is missing in Vercel Environment Variables!"})

        data = request.json
        if not data:
            return send_cors_response({"reply": "No message received."})

        user_message = data.get("message", "")
        
        client = Groq(api_key=api_key)
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
        
        return send_cors_response({"reply": completion.choices[0].message.content})
        
    except Exception as e:
        # Agar koi system error aaya, toh chat mein error dikhayega, CORS block nahi hoga
        return send_cors_response({"reply": f"System Error: {str(e)}"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)