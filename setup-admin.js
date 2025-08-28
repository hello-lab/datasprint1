#!/usr/bin/env node

const path = require('path');
const readline = require('readline');

// Setup admin user
async function setupAdmin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    console.log('\n=== Admin User Setup ===\n');
    
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');
    const email = await question('Enter admin email (optional): ');
    const setupKey = await question('Enter setup key (set ADMIN_SETUP_KEY env var): ');
    
    const payload = {
      username,
      password,
      email: email || null,
      setupKey
    };

    console.log('\nCreating admin user...');
    
    // You would typically make an HTTP request here to your setup endpoint
    // For now, we'll just show the curl command
    console.log('\nRun this curl command when your server is running:');
    console.log(`curl -X POST http://localhost:3003/api/admin/auth/setup \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload, null, 2)}'`);
    
    console.log('\nMake sure to set the ADMIN_SETUP_KEY environment variable before running the server.');
    console.log('Example: ADMIN_SETUP_KEY=your_secret_key npm run dev');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

setupAdmin();