import { checkAuth } from './auth/auth.js';
import { decodeJWT } from './utils/jwt.js';
import { graphqlQuery } from './api/client.js';
import { GET_USER_PROFILE, GET_TOTAL_XP, GET_AUDIT_STATS, GET_XP_TRANSACTIONS, GET_PISCINE_STATS } from './api/queries.js';
import { renderXPProgressionChart } from './graphs/xp-over-time.js';
import { renderAuditComparisonChart } from './graphs/audit-comparison.js';
import { renderPiscineStatsChart } from './graphs/piscine-stats.js';

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
    // Get all section containers
    const identificationContent = document.getElementById('identification-content');
    const xpContent = document.getElementById('xp-content');
    const auditContent = document.getElementById('audit-content');
    const skillsContent = document.getElementById('skills-content');
    const graphContainer = document.getElementById('graph-container');
    
    try {
        // Get user ID from JWT
        const token = localStorage.getItem('jwt');
        const payload = decodeJWT(token);
        const userId = parseInt(payload.sub);
        
        console.log('Fetching data for user ID:', userId);
        
        // Show loading state
        identificationContent.innerHTML = '<p>Loading...</p>';
        xpContent.innerHTML = '<p>Loading...</p>';
        auditContent.innerHTML = '<p>Loading...</p>';
        if (skillsContent) skillsContent.innerHTML = '<p>Loading...</p>';
        graphContainer.innerHTML = '<p>Loading graphs...</p>';
        
        // Fetch all data in parallel (including Piscine data now!)
        const [userProfile, totalXP, auditStats, xpTransactions, piscineProgress] = await Promise.all([
            graphqlQuery(GET_USER_PROFILE, { userId }),
            graphqlQuery(GET_TOTAL_XP, { userId }),
            graphqlQuery(GET_AUDIT_STATS, { userId }),
            graphqlQuery(GET_XP_TRANSACTIONS, { userId }),
            graphqlQuery(GET_PISCINE_STATS, { userId })
        ]);
        
        console.log('User Profile:', userProfile);
        console.log('Total XP:', totalXP);
        console.log('Audit Stats:', auditStats);
        console.log('XP Transactions:', xpTransactions.transaction.length, 'transactions');
        console.log('Piscine Progress:', piscineProgress.progress.length, 'exercises');
        
        // Extract data
        const user = userProfile.user[0];
        const xpSum = totalXP.transaction_aggregate.aggregate.sum.amount || 0;
        const auditData = auditStats.user[0];
        
        // SECTION 1: User Identification
        identificationContent.innerHTML = `
            <div class="info-grid">
                <div class="info-card">
                    <h3>User ID</h3>
                    <p class="info-value">${user.id}</p>
                </div>
                
                <div class="info-card">
                    <h3>Username</h3>
                    <p class="info-value">${user.login}</p>
                </div>
            </div>
        `;
        
        // SECTION 2: XP Progress
        xpContent.innerHTML = `
            <div class="info-grid">
                <div class="info-card">
                    <h3>Total XP Earned</h3>
                    <p class="info-value">${formatNumber(xpSum)} XP</p>
                    <p class="info-detail">Accumulated across all projects</p>
                </div>
                
                <div class="info-card">
                    <h3>Total Projects</h3>
                    <p class="info-value">${xpTransactions.transaction.length}</p>
                    <p class="info-detail">Completed XP transactions</p>
                </div>
            </div>
        `;
        
        // SECTION 3: Audit Performance
        auditContent.innerHTML = `
            <div class="info-grid">
                <div class="info-card">
                    <h3>Audit Ratio</h3>
                    <p class="info-value">${auditData.auditRatio.toFixed(2)}</p>
                    <p class="info-detail ${auditData.auditRatio >= 1 ? 'success' : 'warning'}">
                        ${auditData.auditRatio >= 1 ? '✓ Above required ratio' : '⚠ Below required ratio'}
                    </p>
                </div>
                
                <div class="info-card">
                    <h3>Audits Done</h3>
                    <p class="info-value">${formatNumber(auditData.totalUp)}</p>
                    <p class="info-detail">Given to other students</p>
                </div>
                
                <div class="info-card">
                    <h3>Audits Received</h3>
                    <p class="info-value">${formatNumber(auditData.totalDown)}</p>
                    <p class="info-detail">Received from other students</p>
                </div>
            </div>
        `;
        
        // SECTION 4: Skills
        if (skillsContent) {
            const skills = ['JavaScript', 'HTML', 'CSS', 'GraphQL', 'SVG', 'JWT', 'Authentication', 'Data Visualization'];
            skillsContent.innerHTML = `
                <div class="skills-grid">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            `;
        }
        
        // SECTION 5: Graphs (NOW WITH 3 GRAPHS!)
        graphContainer.innerHTML = `
            <div class="graph-wrapper">
                <div id="xp-chart" class="graph"></div>
            </div>
            <div class="graph-wrapper">
                <div id="audit-chart" class="graph"></div>
            </div>
            <div class="graph-wrapper">
                <div id="piscine-chart" class="graph"></div>
            </div>
        `;
        
        // Give DOM time to render containers
        setTimeout(() => {
            renderXPProgressionChart('xp-chart', xpTransactions.transaction);
            renderAuditComparisonChart('audit-chart', auditData);
            renderPiscineStatsChart('piscine-chart', piscineProgress.progress);
        }, 100);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        identificationContent.innerHTML = `
            <p class="error">Failed to load profile data: ${error.message}</p>
            <button onclick="location.reload()">Retry</button>
        `;
    }
}

// Load profile data when DOM is ready
document.addEventListener('DOMContentLoaded', loadProfileData);
