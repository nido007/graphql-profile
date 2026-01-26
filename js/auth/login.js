import { createBasicAuthHeader } from '../utils/jwt.js';

// API endpoint for authentication
const SIGNIN_URL = 'https://learn.01founders.co/api/auth/signin';

console.log('Login.js loaded!'); // DEBUG

/**
 * Handles the login form submission
 */
async function handleLogin(event) {
    console.log('Form submitted!'); // DEBUG
    event.preventDefault();
    
    // Get form values
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error-message');
    
    console.log('Identifier:', identifier); // DEBUG (safe, doesn't show password)
    
    // Clear any previous error messages
    errorElement.textContent = '';
    
    // Basic validation
    if (!identifier || !password) {
        console.log('Validation failed - empty fields'); // DEBUG
        errorElement.textContent = 'Please enter both username/email and password';
        return;
    }
    
    try {
        console.log('Creating auth header...'); // DEBUG
        const encodedCredentials = createBasicAuthHeader(identifier, password);
        
        console.log('Sending request to:', SIGNIN_URL); // DEBUG
        const response = await fetch(SIGNIN_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status); // DEBUG
        
        if (!response.ok) {
            console.log('Login failed with status:', response.status); // DEBUG
            if (response.status === 401 || response.status === 403) {
                errorElement.textContent = 'Invalid username or password';
            } else {
                errorElement.textContent = `Error: ${response.status} - ${response.statusText}`;
            }
            return;
        }
        
        const data = await response.json();
        console.log('Response data received'); // DEBUG (don't log token for security)
        
        const token = data.token || data;
        
        if (!token) {
            console.log('No token in response'); // DEBUG
            errorElement.textContent = 'Login failed: No token received';
            return;
        }
        
        console.log('Storing token and redirecting...'); // DEBUG
        localStorage.setItem('jwt', token);
        window.location.href = 'profile.html';
        
    } catch (error) {
        console.error('Login error:', error); // DEBUG
        errorElement.textContent = 'Network error. Please check your connection and try again.';
    }
}

// Wait for DOM to load, then attach event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, attaching event listener'); // DEBUG
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Event listener attached to form'); // DEBUG
    } else {
        console.error('FATAL: Could not find login form!'); // DEBUG
    }
});
