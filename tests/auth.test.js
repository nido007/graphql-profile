import { describe, it, expect } from 'vitest';
import { createBasicAuthHeader, decodeJWT } from '../js/utils/jwt.js';

describe('Auth Utilities', () => {
    describe('createBasicAuthHeader', () => {
        it('should encode username:password correctly', () => {
            const result = createBasicAuthHeader('testuser', 'testpass');
            expect(result).toBe('dGVzdHVzZXI6dGVzdHBhc3M=');
        });

        it('should encode email:password correctly', () => {
            const result = createBasicAuthHeader('user@example.com', 'mypassword');
            expect(result).toBe('dXNlckBleGFtcGxlLmNvbTpteXBhc3N3b3Jk');
        });

        it('should throw error if identifier is missing', () => {
            expect(() => createBasicAuthHeader('', 'password')).toThrow();
        });

        it('should throw error if password is missing', () => {
            expect(() => createBasicAuthHeader('user', '')).toThrow();
        });
    });

    describe('decodeJWT', () => {
        it('should decode a valid JWT payload', () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A';
            const decoded = decodeJWT(token);
            
            expect(decoded).toHaveProperty('sub', '1234567890');
            expect(decoded).toHaveProperty('name', 'John Doe');
        });

        it('should throw error for invalid token format', () => {
            expect(() => decodeJWT('invalid')).toThrow('Invalid JWT format');
        });

        it('should throw error for null token', () => {
            expect(() => decodeJWT(null)).toThrow('Invalid token');
        });
    });
});
