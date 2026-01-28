import { describe, it, expect } from 'vitest';
import { transformXPProgression, formatLargeNumber, calculateYAxisTicks } from '../js/utils/transforms.js';

describe('Data Transformations', () => {
    describe('transformXPProgression', () => {
        it('should calculate cumulative XP correctly', () => {
            const transactions = [
                { amount: 100, createdAt: '2024-01-01T10:00:00Z' },
                { amount: 200, createdAt: '2024-01-01T12:00:00Z' },
                { amount: 150, createdAt: '2024-01-02T10:00:00Z' }
            ];
            
            const result = transformXPProgression(transactions);
            
            expect(result).toHaveLength(2); // 2 unique dates
            expect(result[0]).toEqual({ date: '2024-01-01', xp: 300 }); // 100 + 200
            expect(result[1]).toEqual({ date: '2024-01-02', xp: 450 }); // 300 + 150
        });
        
        it('should handle empty array', () => {
            const result = transformXPProgression([]);
            expect(result).toEqual([]);
        });
        
        it('should handle null input', () => {
            const result = transformXPProgression(null);
            expect(result).toEqual([]);
        });
    });
    
    describe('formatLargeNumber', () => {
        it('should format millions correctly', () => {
            expect(formatLargeNumber(1500000)).toBe('1.5M');
            expect(formatLargeNumber(2000000)).toBe('2.0M');
        });
        
        it('should format thousands correctly', () => {
            expect(formatLargeNumber(1500)).toBe('1.5K');
            expect(formatLargeNumber(45000)).toBe('45.0K');
        });
        
        it('should not format small numbers', () => {
            expect(formatLargeNumber(500)).toBe('500');
            expect(formatLargeNumber(0)).toBe('0');
        });
    });
    
    describe('calculateYAxisTicks', () => {
        it('should generate nice round numbers', () => {
            const ticks = calculateYAxisTicks(706055, 5);
            
            expect(ticks).toHaveLength(5);
            expect(ticks[0]).toBe(0);
            expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(706055);
            
            // Each tick should be evenly spaced
            const step = ticks[1] - ticks[0];
            for (let i = 1; i < ticks.length; i++) {
                expect(ticks[i] - ticks[i-1]).toBe(step);
            }
        });
        
        it('should handle zero maxValue', () => {
            const ticks = calculateYAxisTicks(0);
            expect(ticks).toEqual([0]);
        });
    });
});
