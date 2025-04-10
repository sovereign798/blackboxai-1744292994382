// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

// Show/Hide Error Message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Show/Hide Success Message
function showSuccess(message) {
    successText.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

// Show/Hide Loading State
function setLoading(isLoading) {
    if (isLoading) {
        buttonText.textContent = 'Signing in...';
        loadingSpinner.classList.remove('hidden');
        loginButton.disabled = true;
    } else {
        buttonText.textContent = 'Sign in';
        loadingSpinner.classList.add('hidden');
        loginButton.disabled = false;
    }
}

// Simulate API call
async function simulateAuth(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For demo purposes, accept any valid email with password length >= 6
            if (validateEmail(email) && validatePassword(password)) {
                resolve({ success: true });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1500); // Simulate network delay
    });
}

// Handle Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basic validation
    if (!email) {
        showError('Please enter your email address');
        emailInput.focus();
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        emailInput.focus();
        return;
    }

    if (!password) {
        showError('Please enter your password');
        passwordInput.focus();
        return;
    }

    if (!validatePassword(password)) {
        showError('Password must be at least 6 characters long');
        passwordInput.focus();
        return;
    }

    try {
        setLoading(true);
        await simulateAuth(email, password);
        
        // Show success message
        showSuccess('Login successful! Redirecting...');
        
        // Simulate redirect after successful login
        setTimeout(() => {
            window.location.href = 'video.html';
        }, 1500);
        
    } catch (error) {
        showError(error.message);
        setLoading(false);
    }
});

// Real-time validation
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() && !validateEmail(emailInput.value)) {
        emailInput.classList.add('border-red-500');
    } else {
        emailInput.classList.remove('border-red-500');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value && !validatePassword(passwordInput.value)) {
        passwordInput.classList.add('border-red-500');
    } else {
        passwordInput.classList.remove('border-red-500');
    }
});

// Clear error messages when user starts typing
emailInput.addEventListener('focus', hideError);
passwordInput.addEventListener('focus', hideError);

// Social login buttons (for demo purposes)
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showError('Social login is not implemented in this demo');
    });
});
