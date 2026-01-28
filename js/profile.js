import { checkAuth } from './auth/auth.js';
import { decodeJWT } from './utils/jwt.js';
import { graphqlQuery } from './api/client.js';
import { GET_USER_PROFILE, GET_TOTAL_XP, GET_AUDIT_STATS, GET_XP_TRANSACTIONS } from './api/queries.js';
import { renderXPProgressionChart } from './graphs/xp-over-time.js';
import { renderAuditComparisonChart } from './graphs/audit-comparison.js';

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
    const graphContainer = document.getElementById('graph-container');
    
    try {
        // Get user ID from JWT
        const token = localStorage.getItem('jwt');
        const payload = decodeJWT(token);
        const userId = parseInt(payload.sub);
        
        console.log('Fetching data for user ID:', userId);
        
        // Show loading state
        infoContent.innerHTML = '<p>Loading your profile...</p>';
        graphContainer.innerHTML = '<p>Loading graphs...</p>';
        
        // Fetch all data in parallel
        const [userProfile, totalXP, auditStats, xpTransactions] = await Promise.all([
            graphqlQuery(GET_USER_PROFILE, { userId }),
            graphqlQuery(GET_TOTAL_XP, { userId }),
            graphqlQuery(GET_AUDIT_STATS, { userId }),
            graphqlQuery(GET_XP_TRANSACTIONS, { userId })
        ]);
        
        console.log('User Profile:', userProfile);
        console.log('Total XP:', totalXP);
        console.log('Audit Stats:', auditStats);
        console.log('XP Transactions:', xpTransactions.transaction.length, 'transactions');
        
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
        
        // Render graphs
        graphContainer.innerHTML = `
            <div class="graph-wrapper">
                <div id="xp-chart" class="graph"></div>
            </div>
            <div class="graph-wrapper">
                <div id="audit-chart" class="graph"></div>
            </div>
        `;
        
        // Give DOM time to render containers
        setTimeout(() => {
            renderXPProgressionChart('xp-chart', xpTransactions.transaction);
            renderAuditComparisonChart('audit-chart', auditData);
        }, 100);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        infoContent.innerHTML = `
            <p class="error">Failed to load profile data: ${error.message}</p>
            <button onclick="location.reload()">Retry</button>
        `;
        graphContainer.innerHTML = '';
    }
}

// Load profile data when DOM is ready
document.addEventListener('DOMContentLoaded', loadProfileData);
