import re
import time

def check_password_strength(password):
    strength = 0
    errors = []
    score = 0
    crack_time = ""

    # Check password length
    if len(password) < 8:
        errors.append("Password is too short. It should be at least 8 characters.")
    else:
        strength += 1
        score += 2

    # Check for digits
    if not re.search(r"\d", password):
        errors.append("Password should have at least one digit.")
    else:
        strength += 1
        score += 2

    # Check for uppercase letters
    if not re.search(r"[A-Z]", password):
        errors.append("Password should have at least one uppercase letter.")
    else:
        strength += 1
        score += 2

    # Check for lowercase letters
    if not re.search(r"[a-z]", password):
        errors.append("Password should have at least one lowercase letter.")
    else:
        strength += 1
        score += 2

    # Check for special characters
    if not re.search(r"[^a-zA-Z0-9]", password):
        errors.append("Password should have at least one special character.")
    else:
        strength += 1
        score += 2

    # Check for common patterns
    common_patterns = ["abc", "123", "qwerty", "password"]
    for pattern in common_patterns:
        if pattern in password.lower():
            errors.append("Password should not contain common patterns.")
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

    return strength_level, errors, score, crack_time

def main():
    print("Password Policy:")
    print("1. Minimum length: 8 characters")
    print("2. At least one digit")
    print("3. At least one uppercase letter")
    print("4. At least one lowercase letter")
    print("5. At least one special character")
    print("6. No common patterns")

    password = input("Enter a password: ")
    start_time = time.time()
    strength_level, errors, score, crack_time = check_password_strength(password)
    end_time = time.time()

    print(f"Password strength: {strength_level} ({score}/10)")
    print(f"Estimated crack time: {crack_time}")
    print(f"Time taken to check password strength: {end_time - start_time:.6f} seconds")

    if strength_level == "Strong":
        print("Password is strong.")
    elif strength_level == "Medium":
        print("Password is medium strength.")
        print("Suggestions:")
        for error in errors:
            print("*", error)
    else:
        print("Password is weak.")
        print("Suggestions:")
        for error in errors:
            print("*", error)

if __name__ == "__main__":
    main()
