// Utility for generating unique message IDs that are time-sortable and collision-resistant
let lastId = 0n;
const RANDOM_MAX = 999999n;

/**
 * Generates a unique message ID that is:
 * - Time-sortable (based on timestamp)
 * - Collision-resistant (includes random component)
 * - Always increasing (even if multiple IDs requested in same millisecond)
 * Returns a BigInt for exact precision
 */
export const generateMessageId = (): bigint => {
  const timestamp = BigInt(Date.now());
  const random = BigInt(Math.floor(Math.random() * Number(RANDOM_MAX)));
  
  // Ensure IDs are always increasing even within same millisecond
  const currentId = (timestamp * RANDOM_MAX) + random;
  if (currentId <= lastId) {
    lastId += 1n;
    return lastId;
  }
  
  lastId = currentId;
  return currentId;
};