/**
 * Runner: Generate random test user credentials
 */
export function generateRandomUser() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  const user = {
    username: `prodtest${timestamp}${randomSuffix}`,
    password: `TestPass${randomSuffix}123!`,
    timestamp,
    randomSuffix
  };
  
  console.log(`👤 Generated test user: ${user.username}`);
  return user;
}

/**
 * Runner: Generate multiple test users
 */
export function generateMultipleUsers(count = 3) {
  console.log(`👥 Generating ${count} test users...`);
  
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUser());
  }
  
  console.log(`✅ Generated ${users.length} test users`);
  return users;
}

/**
 * Runner: Generate user with specific criteria
 */
export function generateUserWithCriteria(criteria = {}) {
  const base = generateRandomUser();
  
  return {
    ...base,
    username: criteria.usernamePrefix ? 
      `${criteria.usernamePrefix}${base.timestamp}${base.randomSuffix}` : 
      base.username,
    password: criteria.passwordPrefix ? 
      `${criteria.passwordPrefix}${base.randomSuffix}123!` : 
      base.password,
    ...criteria
  };
} 