/**
 * Decodes a JWT token and returns the payload
 * @param {string} token - The JWT token
 * @returns {object} The decoded payload
 */
export function decodeJWT(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }

    try {
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        throw new Error('Failed to decode JWT');
    }
}

/**
 * Creates a Basic Authentication header value
 * @param {string} identifier - Username or email
 * @param {string} password - Password
 * @returns {string} Base64 encoded credentials
 */
export function createBasicAuthHeader(identifier, password) {
    if (!identifier || !password) {
        throw new Error('Identifier and password are required');
    }
    
    const credentials = `${identifier}:${password}`;
    return btoa(credentials);
}
