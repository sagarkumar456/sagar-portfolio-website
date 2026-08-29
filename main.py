from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File jahan hum count save karenge
COUNT_FILE = "resume_count.json"

# File se current count nikalne ka function
def get_current_count():
    if not os.path.exists(COUNT_FILE):
        return 0
    with open(COUNT_FILE, "r") as f:
        data = json.load(f)
        return data.get("downloads", 0)

# Naya count file me save karne ka function
def save_count(count):
    with open(COUNT_FILE, "w") as f:
        json.dump({"downloads": count}, f)

# 1. API: Page load hone par count bhejne ke liye
@app.get("/api/resume-count")
def read_count():
    return {"downloads": get_current_count()}

# 2. API: Jab koi button click kare tab count badhane ke liye
@app.post("/api/track-resume")
def track_resume():
    current_count = get_current_count()
    new_count = current_count + 1
    save_count(new_count) # Save to file
    
    time_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{time_now}] 📄 Resume Downloaded! Total count: {new_count}")
    
    return {"status": "success", "downloads": new_count}

# Puraana View Details wala API
@app.post("/api/track-click")
def track_button_click(skill: str):
    print(f"🎯 User clicked on skill: {skill}")
    return {"status": "success", "message": "Tracked"}