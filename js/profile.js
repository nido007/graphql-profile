import { checkAuth } from './auth/auth.js';
import { decodeJWT } from './utils/jwt.js';
import { graphqlQuery } from './api/client.js';
import { GET_USER_PROFILE, GET_TOTAL_XP, GET_AUDIT_STATS } from './api/queries.js';

/**
 * Formats a number with commas
 */
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

/**
 * Loads and displays user profile data
 */
async function loadProfileData() {
    const infoContent = document.getElementById('info-content');
    
    try {
        // Get user ID from JWT
        const token = localStorage.getItem('jwt');
        const payload = decodeJWT(token);
        const userId = parseInt(payload.sub);
        
        console.log('Fetching data for user ID:', userId);
        
        // Show loading state
        infoContent.innerHTML = '<p>Loading your profile...</p>';
        
        // Fetch all data in parallel
        const [userProfile, totalXP, auditStats] = await Promise.all([
            graphqlQuery(GET_USER_PROFILE, { userId }),
            graphqlQuery(GET_TOTAL_XP, { userId }),
            graphqlQuery(GET_AUDIT_STATS, { userId })
        ]);
        
        console.log('User Profile:', userProfile);
        console.log('Total XP:', totalXP);
        console.log('Audit Stats:', auditStats);
        
        // Extract data
        const user = userProfile.user[0];
        const xpSum = totalXP.transaction_aggregate.aggregate.sum.amount || 0;
        const auditData = auditStats.user[0];
        
        // Display the information
        infoContent.innerHTML = `
            <div class="info-grid">
                <div class="info-card">
                    <h3>User ID</h3>
                    <p class="info-value">${user.id}</p>
                </div>
                
                <div class="info-card">
                    <h3>Username</h3>
                    <p class="info-value">${user.login}</p>
                </div>
                
                <div class="info-card">
                    <h3>Total XP</h3>
                    <p class="info-value">${formatNumber(xpSum)} XP</p>
                </div>
                
                <div class="info-card">
                    <h3>Audit Ratio</h3>
                    <p class="info-value">${auditData.auditRatio.toFixed(2)}</p>
                    <p class="info-detail">Done: ${formatNumber(auditData.totalUp)} | Received: ${formatNumber(auditData.totalDown)}</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading profile:', error);
        infoContent.innerHTML = `
            <p class="error">Failed to load profile data: ${error.message}</p>
            <button onclick="location.reload()">Retry</button>
        `;
    }
}

// Load profile data when DOM is ready
document.addEventListener('DOMContentLoaded', loadProfileData);
