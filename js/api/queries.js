/**
 * Query 1: NORMAL QUERY - Get basic user information
 * Demonstrates: Simple field selection
 */
export const GET_USER_PROFILE = `
query GetUserProfile($userId: Int!) {
  user(where: { id: { _eq: $userId } }) {
    id
    login
    attrs
  }
}
`;

/**
 * Query 2: AGGREGATE QUERY WITH ARGUMENTS - Get total XP
 * Demonstrates: Aggregation functions, where clause, type filtering
 */
export const GET_TOTAL_XP = `
query GetTotalXP($userId: Int!) {
  transaction_aggregate(
    where: { 
      userId: { _eq: $userId }, 
      type: { _eq: "xp" } 
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
`;

/**
 * Query 3: NESTED QUERY - Get audit ratio
 * Demonstrates: Nested data access, multiple fields
 */
export const GET_AUDIT_STATS = `
query GetAuditStats($userId: Int!) {
  user(where: { id: { _eq: $userId } }) {
    id
    auditRatio
    totalUp
    totalDown
  }
}
`;

/**
 * Query 4: XP TRANSACTIONS FOR GRAPH (with order and limit)
 * Demonstrates: Ordering, limiting results
 */
export const GET_XP_TRANSACTIONS = `
query GetXPTransactions($userId: Int!) {
  transaction(
    where: { 
      userId: { _eq: $userId }, 
      type: { _eq: "xp" } 
    }
    order_by: { createdAt: asc }
  ) {
    amount
    createdAt
    path
  }
}
`;

/**
 * Query 5: PROJECT RESULTS (nested with object data)
 * Demonstrates: Nested queries with related tables
 */
export const GET_PROJECT_RESULTS = `
query GetProjectResults($userId: Int!) {
  result(
    where: { userId: { _eq: $userId } }
    order_by: { createdAt: desc }
    limit: 50
  ) {
    id
    grade
    createdAt
    object {
      name
      type
    }
  }
}
`;

/**
 * Query 6: PISCINE PROGRESS (Go/JS)
 * Demonstrates: Pattern matching with _ilike, nested object data
 */
export const GET_PISCINE_STATS = `
query GetPiscineStats($userId: Int!) {
  progress(
    where: { 
      userId: { _eq: $userId },
      path: { _ilike: "%piscine%" }
    }
    order_by: { createdAt: asc }
  ) {
    id
    grade
    createdAt
    path
    object {
      name
      type
    }
  }
}
`;
