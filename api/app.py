import os
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/chat', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat_with_ai():
    # OPTIONS request (Preflight) ko explicitly handle aur allow karne ke liye headers
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

                    EXACT RESPONSE MATCHING (Follow this strictly):
                    - IF user says EXACTLY "hi", "hello", "hey": ALWAYS reply with "Hello! I am the official Elara AI for Sagar Kumar's personal portfolio website. How can I help you today?"
                    - IF user asks "who are you", "what is your name": ALWAYS reply with "I am the official Elara AI for Sagar Kumar's personal portfolio website."
                    - IF user says "talk to sagar", "I can talk to the sagar", "contact sagar", "phone", "email": ALWAYS reply with "Sagar is currently unavailable, but you can reach him directly at his email (skdas1641999@gmail.com)."

                    PROFILE OF SAGAR KUMAR (Use this to answer other technical or professional questions):
                    - Role: Manual & Automation Testing Engineer
                    - Experience: Over 3+ years in web, mobile, and API testing.
                    - Current Company: Software Testing Engineer at Onelap Telematics Pvt. Ltd. (March 2023 - Present).
                    - Skills: Playwright, Python, POM, BDD, Jenkins, Postman, SQL, JIRA, Trello.
                    - GitHub: https://github.com/sagarkumar456
                    - LinkedIn: https://www.linkedin.com/in/sagarautomation/

                    ONELAP HARDWARE, DASHCAM & GPS TRACKING APP TESTING:
                    - Core Testing Flow (Dashcam): Tested the complete end-to-end user flow inside the mobile application/control panel. This includes User Login, establishing a connection with the Dashcam hardware, validating smooth Live Streaming, checking Video Recording labels, verifying photo capture functionality, and comprehensive device Settings configuration.
                    - GPS Tracking & Mapping Features: Verified real-time GPS hardware integration. Tested features like tracking live location updates displayed accurately on the Map, changing calendar dates to fetch historical trip data, validating daily/weekly trip summaries, verifying seamless playback history (Route Playback), and validating Geofencing alerts (Safezone & Anti-theft alerts).
                    
                    ONELAP PROJECT & E-COMMERCE TESTING EXPERTISE:
                    - Website: Tested the official platform https://www.onelap.in where users purchase Dashcams and GPS Tracking systems.
                    - End-to-End Payment Flow Testing: Successfully executed comprehensive E-commerce testing for products like 'Onelap Locoshield Wireless'. 
                    - Verified complete purchase workflow: Product Listing Page -> Product Detail View (variant selections) -> My Cart Page validations (coupon/price detail calculations) -> Razorpay Payment Gateway integration (validating contact details, OTP/payment flows, and secure API handling).
                    
                    ONELAP WEB PLATFORM & GPS DASHBOARD TESTING (web.onelap.in):
                    - Core Portal Testing: Tested the Onelap Web Control Panel (https://web.onelap.in) designed for live fleet tracking and asset management.
                    - Authentication Module: Verified secure User Login and Registration flows, including language localization configuration (English selection dropdown), phone/password edge-case input validations, and 'Remember Me' state preservation.
                    - Live Tracking Dashboard & Data Sync: Validated the real-time device management system. Tested the dynamic rendering of the 'Devices' list panel alongside their exact asynchronous timestamps (e.g., tracking the status of hardware variations like 'locoshieldwithot_sim').
                    - Map API & Coordinates Integration: Extensively tested the integration of live mapping systems (OpenStreetMap/Google Maps UI). Confirmed accurate visual rendering of real-time GPS asset location markers dynamically over high-density traffic grids and regional maps (e.g., Bengaluru region grids like Majestic, Chickpete).
                    - Analytics & Reporting Engine: Evaluated the multi-option reporting dropdown interface. Tested data retrieval filters for 'Route' path histories, system 'Events' logging, chronological 'Trips' logs, and data-driven 'Summary' tables. Validated critical control states for action triggers like 'Configure', 'Show', 'Export' (handling CSV/data sheet generation), and 'Clear' states.
                    
                    TECHNICAL SKILLS:
                    - Tools & Frameworks: Playwright, Python, POM Design Pattern, BDD (Gherkin), Jenkins CI/CD, Postman (API Testing), SQL, JIRA, and Trello.
                    """
                },
                {"role": "user", "content": user_message}
            ]
        )
        
        ai_reply = completion.choices[0].message.content
        
        # POST response mein CORS headers attach karein
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