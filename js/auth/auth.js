import { decodeJWT } from '../utils/jwt.js';

/**
 * Checks if user is authenticated and redirects to login if not
 * @returns {object|null} Decoded JWT payload or null
 */
export function checkAuth() {
    const token = localStorage.getItem('jwt');
    
    if (!token) {
        // No token - redirect to login
        window.location.href = 'index.html';
        return null;
    }
    
    try {
        // Decode and return the payload
        const payload = decodeJWT(token);
        return payload;
    } catch (error) {
        // Invalid token - clear and redirect
        console.error('Invalid token:', error);
        localStorage.removeItem('jwt');
        window.location.href = 'index.html';
        return null;
    }
}

/**
 * Logs out the user by clearing token and redirecting
 */
export function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}

// Check auth on page load
const userPayload = checkAuth();

if (userPayload) {
    console.log('User authenticated:', userPayload);
    console.log('User ID:', userPayload.sub);
    
    // Attach logout handler
    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    });
}
