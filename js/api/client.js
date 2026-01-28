const GRAPHQL_URL = 'https://learn.01founders.co/api/graphql-engine/v1/graphql';

/**
 * Makes a GraphQL query with JWT authentication
 * @param {string} query - The GraphQL query string
 * @param {object} variables - Query variables (optional)
 * @returns {Promise<object>} The query result
 */
export async function graphqlQuery(query, variables = {}) {
    const token = localStorage.getItem('jwt');
    
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        
        return result.data;
    } catch (error) {
        console.error('GraphQL query error:', error);
        throw error;
    }
}
