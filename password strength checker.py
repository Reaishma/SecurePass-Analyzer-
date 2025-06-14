import re
import time
import getpass
from argon2 import PasswordHasher
import tkinter as tk
from tkinter import messagebox

class PasswordStrengthChecker:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("Password Strength Checker")

        self.password_label = tk.Label(self.window, text="Enter Password:")
        self.password_label.pack()

        self.password_entry = tk.Entry(self.window, show="*", width=50)
        self.password_entry.pack()

        self.check_button = tk.Button(self.window, text="Check Password Strength", command=self.check_password_strength)
        self.check_button.pack()

        self.strength_label = tk.Label(self.window, text="Password Strength:")
        self.strength_label.pack()

        self.strength_result = tk.Label(self.window, text="")
        self.strength_result.pack()

        self.suggestions_label = tk.Label(self.window, text="Suggestions:")
        self.suggestions_label.pack()

        self.suggestions_result = tk.Label(self.window, text="", wraplength=400, justify=tk.LEFT)
        self.suggestions_result.pack()

        self.hash_label = tk.Label(self.window, text="Argon2 Hash:")
        self.hash_label.pack()

        self.hash_result = tk.Label(self.window, text="", wraplength=400, justify=tk.LEFT)
        self.hash_result.pack()

    def check_password_strength(self):
        password = self.password_entry.get()

        strength = 0
        errors = []
        score = 0
        crack_time = ""
        suggestions = []

        # Check password length
        if len(password) < 8:
            errors.append("Password is too short. It should be at least 8 characters.")
            suggestions.append("Increase password length to at least 8 characters.")
        else:
            strength += 1
            score += 2

        # Check for digits
        if not re.search(r"\d", password):
            errors.append("Password should have at least one digit.")
            suggestions.append("Add at least one digit to the password.")
        else:
            strength += 1
            score += 2

        # Check for uppercase letters
        if not re.search(r"[A-Z]", password):
            errors.append("Password should have at least one uppercase letter.")
            suggestions.append("Add at least one uppercase letter to the password.")
        else:
            strength += 1
            score += 2

        # Check for lowercase letters
        if not re.search(r"[a-z]", password):
            errors.append("Password should have at least one lowercase letter.")
            suggestions.append("Add at least one lowercase letter to the password.")
        else:
            strength += 1
            score += 2

        # Check for special characters
        if not re.search(r"[^a-zA-Z0-9]", password):
            errors.append("Password should have at least one special character.")
            suggestions.append("Add at least one special character to the password.")
        else:
            strength += 1
            score += 2

        # Check for common patterns
        common_patterns = ["abc", "123", "qwerty", "password"]
        for pattern in common_patterns:
            if pattern in password.lower():
                errors.append("Password should not contain common patterns.")
                suggestions.append("Avoid using common patterns in the password.")
                score -= 2
                break

        # Estimate crack time
        if score <= 4:
            crack_time = "Less than a minute"
        elif score <= 6:
            crack_time = "Several minutes to hours"
        elif score <= 8:
            crack_time = "Several hours to days"
        else:
            crack_time = "More than a year"

        if strength == 5:
            strength_level = "Strong"
        elif strength >= 3:
            strength_level = "Medium"
        else:
            strength_level = "Weak"

        # Hash the password using Argon2
        ph = PasswordHasher()
        hashed_password = ph.hash(password)

        self.strength_result.config(text=f"{strength_level} ({score}/10)")
        self.suggestions_result.config(text="\n".join(suggestions))
        self.hash_result.config(text=hashed_password)

    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    password_strength_checker = PasswordStrengthChecker()
    password_strength_checker.run()
