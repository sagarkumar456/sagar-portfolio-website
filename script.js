// ==========================================
// 1. TERMINAL PRELOADER LOGIC (SESSION STORAGE FIX)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");

    if (!sessionStorage.getItem("hasSeenPreloader")) {
        // Pehli baar aane par preloader chalega
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = "0";
                preloader.style.transition = "opacity 0.5s ease";

                setTimeout(() => {
                    preloader.style.display = "none";
                }, 800);
            }

            const header = document.querySelector('header');
            if (header) header.classList.add('show');
            setTimeout(typeEffect, 500);

        }, 4000);

        sessionStorage.setItem("hasSeenPreloader", "true");

    } else {
        // Back aane par preloader turant gayab
        if (preloader) {
            preloader.style.display = "none";
        }

        const header = document.querySelector('header');
        if (header) header.classList.add('show');
        setTimeout(typeEffect, 100);
    }
});

// ==========================================
// 2. CUSTOM CURSOR & HOVER EFFECTS
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const hoverTargets = document.querySelectorAll('a, .hover-target, .hover-target-card, button, .neon-btn, .floating-tool');

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
            cursorOutline.style.borderColor = 'rgba(0, 243, 255, 1)';
        });

        target.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'rgba(0, 243, 255, 0.5)';
        });
    });
}

// ==========================================
// 3. MAGNETIC BUTTONS
// ==========================================
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
        btn.style.transition = `transform 0.5s ease`;
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.transition = `none`;
    });
});

// ==========================================
// 4. 3D HOVER TILT EFFECT FOR GLASS CARDS
// ==========================================
const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out';
    });
});

// ==========================================
// 5. TYPEWRITER EFFECT (UPDATED LIST)
// ==========================================
const textArray = [
    "Hunting bugs before they reach users.",
    "Performing comprehensive manual testing.",
    "Building scalable POM frameworks.",
    "Automating and validating REST APIs.",
    "Executing complex SQL validations.",
    "Want project insights? Ask Elara AI!"
];
let typeIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

if (typewriterElement) {
    typewriterElement.style.color = "#60C09B"; // Mint Green Color
}

function typeEffect() {
    if (!typewriterElement) return;

    const currentText = textArray[typeIdx];

    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIdx + 1);
        charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    }
    else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        typeIdx = (typeIdx + 1) % textArray.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// ==========================================
// 6. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden-fade, .hidden-3d');
hiddenElements.forEach((el) => scrollObserver.observe(el));

// ==========================================
// 7. SWAYING TOOLS WITH "PATAKHA" BLAST 🧨
// ==========================================
const logContainer = document.getElementById('log-container');
const testingTools = [
    '🎭 Playwright', '⚡ Cypress', '🤖 Selenium', '🧪 Pytest',
    '⚙️ TestNG', '🥒 Cucumber (BDD)', '🛠️ JUnit', '🕷️ Katalon Studio',
    '🚀 Postman', '🌐 SoapUI', '🔥 JMeter', '📈 K6', '⚡ RestAssured',
    '📱 Appium', '🍏 Xcode', '▶️ Google Play Console', '☁️ BrowserStack',
    '♾️ Jenkins', '🐙 GitHub Actions', '🐳 Docker', '🦊 GitLab CI',
    '🐞 JIRA', '📋 Trello', '📊 Grafana', '📝 Zephyr', '📌 TestRail',
    '🐍 Python', '💾 SQL', '🖐️ Manual Testing'
];

function createPatakha(x, y) {
    const numParticles = 25;
    const colors = ['#00f3ff', '#60C09B', '#ffffff', '#ff00ff'];

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

function createToolBadge() {
    if (!logContainer) return;

    const badge = document.createElement('div');
    badge.className = 'floating-tool';
    badge.innerText = testingTools[Math.floor(Math.random() * testingTools.length)];

    badge.style.left = Math.random() * 80 + 10 + 'vw';
    badge.style.fontSize = (Math.random() * 0.4 + 0.9) + 'rem';
    badge.style.animationDuration = (Math.random() * 10 + 15) + 's';

    badge.addEventListener('click', function (e) {
        e.stopPropagation();

        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        createPatakha(centerX, centerY);
        this.remove();
    });

    logContainer.appendChild(badge);

    setTimeout(() => {
        if (badge.parentNode) {
            badge.remove();
        }
    }, 25000);
}

if (logContainer) {
    setInterval(createToolBadge, 1500);
}

// ==========================================
// 8. API TRACKING FOR "VIEW DETAILS" BUTTON
// ==========================================
const coreTestingBtn = document.getElementById('core-testing-btn');

if (coreTestingBtn) {
    coreTestingBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        const skillName = this.getAttribute('data-skill');
        const targetUrl = this.getAttribute('href');

        const apiUrl = `http://127.0.0.1:8000/api/track-click?skill=${skillName}`;

        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Click tracked successfully in Backend!");

        } catch (error) {
            console.log("Tracking API failed, but user will not be blocked.");
        } finally {
            window.location.href = targetUrl;
        }
    });
}


// ==========================================
// 14. RESUME DOWNLOAD TRACKER (WITH SECURE EMAIL CHECK)
// ==========================================
const resumeBtn = document.getElementById('resume-btn');
const emailFormContainer = document.getElementById('email-form-container');
const visitorEmail = document.getElementById('visitor-email');
const submitEmailBtn = document.getElementById('submit-email-btn');
const countDisplay = document.getElementById('download-count');

// Your Firebase Database URL
const FIREBASE_DB_URL = "https://sagar-portfolio-d89f9-default-rtdb.asia-southeast1.firebasedatabase.app"; 

// 1. Fetch live count on page load
async function fetchFirebaseCount() {
    try {
        let response = await fetch(`${FIREBASE_DB_URL}/resume_downloads.json`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        let data = await response.json();
        let currentCount = (data !== null && data !== undefined) ? data : 0;
        
        if (countDisplay) {
            countDisplay.innerText = `(${currentCount})`;
        }
    } catch (error) {
        console.log("Firebase Read Failed:", error);
    }
}

// Initialize Count Fetching and Button Click Event
if (resumeBtn) {
    fetchFirebaseCount();

    // Show the email form when "Download Resume" is clicked
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resumeBtn.style.display = 'none'; 
        if (emailFormContainer) {
            emailFormContainer.style.display = 'flex'; 
        }
    });
}

// Function to create a Toast Notification
function showToast(message, color, shadowColor) {
    const toastMessage = document.createElement('div');
    toastMessage.innerText = message;
    
    toastMessage.style.cssText = `position: fixed; bottom: 30px; right: 30px; background: ${color}; color: #fff; padding: 12px 20px; border-radius: 8px; font-weight: bold; z-index: 999999; box-shadow: 0 4px 15px ${shadowColor}; transition: opacity 0.5s ease;`;
    
    document.body.appendChild(toastMessage);

    setTimeout(() => {
        toastMessage.style.opacity = '0';
        setTimeout(() => toastMessage.remove(), 500);
    }, 3000);
}

// 2. Handle Email Submission, Secure Duplicate Check & File Download
if (submitEmailBtn) {
    submitEmailBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const emailValue = visitorEmail.value.trim().toLowerCase();

        // Validate Email Format
        if (!emailValue || !emailValue.includes('@')) {
            showToast("⚠️ Please enter a valid email address!", "#ffaa00", "rgba(255, 170, 0, 0.4)");
            return;
        }

        submitEmailBtn.innerText = "WAIT...";
        submitEmailBtn.disabled = true;

        try {
            // STEP A: SECURE API CALL (Data Exposure Bug Fixed)
            // Ab poora database fetch nahi hoga, sirf yeh specific email search hoga
            let emailCheckResponse = await fetch(`${FIREBASE_DB_URL}/resume_emails.json?orderBy="email"&equalTo="${emailValue}"`);
            let emailData = await emailCheckResponse.json();
            
            // Agar emailData khali nahi hai, matlab email mil gaya (Duplicate hai)
            let alreadyDownloaded = (emailData !== null && Object.keys(emailData).length > 0);

            // If duplicate found, show warning and stop the process
            if (alreadyDownloaded) {
                showToast("⚠️ You have already downloaded the resume with this email!", "#ffaa00", "rgba(255, 170, 0, 0.4)");
                
                // Reset UI
                if (emailFormContainer) emailFormContainer.style.display = 'none';
                resumeBtn.style.display = 'flex';
                visitorEmail.value = '';
                submitEmailBtn.innerText = "SUBMIT";
                submitEmailBtn.disabled = false;
                
                return; // Stops execution here, no download will happen
            }

            // STEP B: Force the PDF download
            const link = document.createElement('a');
            link.href = 'video/cv/new_cv (1).pdf'; 
            link.download = 'Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // STEP C: Update Download Count in Firebase
            let response = await fetch(`${FIREBASE_DB_URL}/resume_downloads.json`);
            let data = await response.json();
            let currentCount = (data !== null && data !== undefined) ? data : 0;
            let newCount = currentCount + 1;

            await fetch(`${FIREBASE_DB_URL}/resume_downloads.json`, {
                method: 'PUT',
                body: JSON.stringify(newCount),
                headers: { 'Content-Type': 'application/json' }
            });

            // STEP D: Save Email Address in Firebase
            await fetch(`${FIREBASE_DB_URL}/resume_emails.json`, {
                method: 'POST', 
                body: JSON.stringify({ 
                    email: emailValue, 
                    downloadedAt: new Date().toLocaleString() 
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            // STEP E: Update UI Counter
            if (countDisplay) {
                countDisplay.innerText = `(${newCount})`;
            }
            
            // STEP F: Reset UI and show success toast
            if (emailFormContainer) emailFormContainer.style.display = 'none';
            resumeBtn.style.display = 'flex';
            visitorEmail.value = ''; 
            
            showToast("🎉 Resume downloaded successfully! Thank you.", "#00f3ff", "rgba(0, 243, 255, 0.4)");

        } catch (error) {
            console.error("Download Error:", error);
            showToast("⚠️ Something went wrong, please try again.", "#ff4444", "rgba(255, 68, 68, 0.4)");
        } finally {
            submitEmailBtn.innerText = "SUBMIT";
            submitEmailBtn.disabled = false;
        }
    });
}
// ==========================================
// 15. LOGIN & REGISTRATION LOGIC WITH FIREBASE
// ==========================================

// ULTIMATE Z-INDEX TOAST (Sirf Login/Register form ke liye taaki blur ke upar aaye)
function showAuthToast(message, color, shadowColor) {
    const toastMessage = document.createElement('div');
    toastMessage.innerText = message;
    
    // Z-index maximum (2147483647) aur !important lagaya hai 
    toastMessage.style.cssText = `
        position: fixed !important; 
        bottom: 30px !important; 
        right: 30px !important; 
        background: ${color} !important; 
        color: #ffffff !important; 
        padding: 12px 20px !important; 
        border-radius: 8px !important; 
        font-weight: bold !important; 
        z-index: 2147483647 !important; 
        box-shadow: 0 4px 15px ${shadowColor} !important; 
        transition: opacity 0.5s ease !important;
        pointer-events: none !important;
    `;
    
    document.body.appendChild(toastMessage);

    setTimeout(() => {
        toastMessage.style.opacity = '0';
        setTimeout(() => toastMessage.remove(), 500);
    }, 3000);
}

// 1. Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwsMbPGzq73oMxqOfOz7673GwMGVzi-gg",
    authDomain: "sagar-portfolio-d89f9.firebaseapp.com",
    databaseURL: "https://sagar-portfolio-d89f9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sagar-portfolio-d89f9",
    storageBucket: "sagar-portfolio-d89f9.firebasestorage.app",
    messagingSenderId: "848087329356",
    appId: "1:848087329356:web:5e3c0c3baa9dcbee07e2e9",
    measurementId: "G-YETL3C0X2Y"
};

// 2. Initialize Firebase Application
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// UI Element Variables
const navLoginBtn = document.getElementById('nav-login-btn');
const navRegisterBtn = document.getElementById('nav-register-btn');
const authModal = document.getElementById('auth-modal');
const closeAuthBtn = document.getElementById('close-auth');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authToggleText = document.getElementById('auth-toggle-text');
const authToggleLink = document.getElementById('auth-toggle-link');
const authForm = document.getElementById('auth-form');
const googleAuthBtn = document.getElementById('google-auth-btn');

let isLoginMode = true; 

// Function to open and toggle the Authentication Modal
function openAuthModal(mode) {
    if (!authModal) return;
    
    isLoginMode = (mode === 'login');
    
    if (isLoginMode) {
        authTitle.innerText = "Login";
        authSubmitBtn.innerText = "Login to Account";
        authToggleText.innerText = "Don't have an account?";
        authToggleLink.innerText = "Register here";
    } else {
        authTitle.innerText = "Create Account";
        authSubmitBtn.innerText = "Register Now";
        authToggleText.innerText = "Already have an account?";
        authToggleLink.innerText = "Login here";
    }
    
    authModal.classList.add('active');
}

// Handle Login / Logout Event
if (navLoginBtn) {
    navLoginBtn.addEventListener('click', () => {
        const currentText = navLoginBtn.innerText.trim().toLowerCase();
        
        if (currentText === "logout") {
            auth.signOut().then(() => {
                showAuthToast("Logged out successfully!", "#00f3ff", "rgba(0, 243, 255, 0.4)");
                navLoginBtn.innerText = "Login";
                if(navRegisterBtn) navRegisterBtn.style.display = "inline-block";
            }).catch((error) => {
                showAuthToast("⚠️ Logout Error: " + error.message, "#ff4444", "rgba(255, 68, 68, 0.4)");
            });
        } else {
            openAuthModal('login');
        }
    });
}

if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => openAuthModal('register'));

// Event Listener to close the Authentication Modal
if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
        if(authForm) authForm.reset(); 
    });
}

// Event Listener to toggle between Login and Register
if (authToggleLink) {
    authToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(isLoginMode ? 'register' : 'login');
    });
}

// 3. Email and Password Submission Logic
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        authSubmitBtn.innerText = "Processing...";
        authSubmitBtn.disabled = true;

        if (isLoginMode) {
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    showAuthToast("🎉 Login Successful! Welcome " + userCredential.user.email, "#00f3ff", "rgba(0, 243, 255, 0.4)");
                    authModal.classList.remove('active');
                    authForm.reset();
                    navLoginBtn.innerText = "Logout";
                    if(navRegisterBtn) navRegisterBtn.style.display = "none";
                })
                .catch((error) => {
                    showAuthToast("⚠️ Login Failed: " + error.message, "#ff4444", "rgba(255, 68, 68, 0.4)");
                })
                .finally(() => {
                    authSubmitBtn.innerText = isLoginMode ? "Login to Account" : "Register Now";
                    authSubmitBtn.disabled = false;
                });
        } else {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    showAuthToast("🎉 Registration Successful! You can now login.", "#00f3ff", "rgba(0, 243, 255, 0.4)");
                    openAuthModal('login'); 
                })
                .catch((error) => {
                    showAuthToast("⚠️ Registration Failed: " + error.message, "#ff4444", "rgba(255, 68, 68, 0.4)");
                })
                .finally(() => {
                    authSubmitBtn.innerText = isLoginMode ? "Login to Account" : "Register Now";
                    authSubmitBtn.disabled = false;
                });
        }
    });
}

// 4. Google OAuth Authentication Logic
if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                showAuthToast(`🎉 Google Login Successful! Welcome, ${user.displayName}`, "#00f3ff", "rgba(0, 243, 255, 0.4)");
                
                if (authModal) authModal.classList.remove('active');
                if (authForm) authForm.reset();
                
                if (navLoginBtn) navLoginBtn.innerText = "Logout";
                if (navRegisterBtn) navRegisterBtn.style.display = "none";
            })
            .catch((error) => {
                console.error("Google Auth Error:", error);
                showAuthToast("⚠️ Google Auth Failed: " + error.message, "#ff4444", "rgba(255, 68, 68, 0.4)");
            });
    });
}

// ==========================================
// CHATBOT JAVASCRIPT
// ==========================================
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Toggle logic for open/close chat
function toggleChat() {
    const chatContainer = document.getElementById("chat-container");
    const toggleBtn = document.getElementById("chat-toggle-btn");

    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "flex";
        toggleBtn.style.display = "none";
    } else {
        chatContainer.style.display = "none";
        toggleBtn.style.display = "flex";
    }
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("bot-message");
    }

    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);

    // Auto-scroll
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // User message
    appendMessage(text, "user");
    userInput.value = "";

    // Typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.innerText = "Typing...";
    typingDiv.id = "typing-indicator";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Updated route path to '/api/app' exactly as configured in Vercel
        let response = await fetch('https://sagar-portfolio-website-kappa.vercel.app/api/app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        let data = await response.json();

        // Remove typing and show reply
        const typingElement = document.getElementById("typing-indicator");
        if (typingElement) typingElement.remove();

        appendMessage(data.reply, "bot");

    } catch (error) {
        console.error("Error:", error);
        const typingElement = document.getElementById("typing-indicator");
        if (typingElement) typingElement.remove();

        appendMessage("AI Assistant is temporarily unavailable. Please try again later.", "bot");
    }
}

// Enter key press handling
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}