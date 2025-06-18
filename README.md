

Password Strength Checker 🔒💻

Overview
A password strength checker tool that evaluates the security of your passwords 🔍

Initial Version
Initially built using:
- Python 🐍
- Argon2-cffi password hasher 🔒
- Tkinter for GUI 📊

Initial Installation
pip install argon2-cffi tkinter

Initial Code Snippet
import tkinter as tk
from argon2 import PasswordHasher

Create a PasswordHasher object
ph = PasswordHasher()

Hash a password
hashed_password = ph.hash("mysecretpassword")
Current Version
Later refactored to use:
- HTML/CSS 🌐
- JavaScript 💻

Features
1. *Password Strength Evaluation*: Checks password strength based on length, complexity, and more 🔒
2. *Real-time Feedback*: Provides instant feedback on password strength 💡
3. *Secure Password Generation*: Suggests strong and unique passwords 🔑

Live Demo
Try out the Password Strength Checker tool: https://reaishma.github.io/Password-strength-checker-/ 🔗

Code Structure
- `index.html`: The main HTML file for the tool 📄
- `script.js`: The JavaScript file containing the password strength checker logic 💻
- `style.css`: The CSS file for styling the tool 🎨

JavaScript Code Snippet
function checkPasswordStrength(password) {
    // Check password length
    if (password.length < 8) {
        return "Password is too short";
    }
    // Check password complexity
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return "Password should contain at least one lowercase letter, one uppercase letter, and one digit";
    }
    return "Password is strong";
}
Author
- *Reaishma N* 🙋‍♀️

License
 GNU GENERAL PUBLIC LICENSE 📄


