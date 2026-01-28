/**
 * Transforms XP transaction data into cumulative progression
 * @param {Array} transactions - Raw transaction data from GraphQL
 * @returns {Array} Array of {date, cumulativeXP} objects
 */
export function transformXPProgression(transactions) {
    if (!transactions || transactions.length === 0) {
        return [];
    }
    
    let cumulative = 0;
    const progression = [];
    
    // Group by date and accumulate XP
    const dateMap = new Map();
    
    transactions.forEach(tx => {
        const date = new Date(tx.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
        cumulative += tx.amount;
        dateMap.set(date, cumulative);
    });
    
    // Convert to array format
    for (const [date, xp] of dateMap) {
        progression.push({ date, xp });
    }
    
    return progression;
}

/**
 * Formats large numbers with K/M suffixes
 * @param {number} num - The number to format
 * @returns {string} Formatted string (e.g., "1.2M", "450K")
 */
export function formatLargeNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Calculates nice round tick values for Y-axis
 * @param {number} maxValue - Maximum value in dataset
 * @param {number} tickCount - Desired number of ticks (default 5)
 * @returns {Array<number>} Array of tick values
 */
export function calculateYAxisTicks(maxValue, tickCount = 5) {
    if (maxValue === 0) return [0];
    
    const roughStep = maxValue / (tickCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const normalizedStep = Math.ceil(roughStep / magnitude) * magnitude;
    
    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
        ticks.push(normalizedStep * i);
    }
    
    return ticks;
}
