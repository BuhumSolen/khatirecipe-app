// Run this script to generate the admin user SQL with hashed password
// Usage: node setup-admin.js

const bcrypt = require('bcryptjs');

const username = 'buhumsolen';
const password = 'Angvaiti@1';
const email = 'admin@example.com';
const fullName = 'Buhum Solen';
const userRole = '100'; // Admin role

// Hash the password
const hashedPassword = bcrypt.hashSync(password, 10);

// Generate SQL
const sql = `-- Insert admin user
INSERT INTO admin (username, password, email, full_name, user_role) 
VALUES ('${username}', '${hashedPassword}', '${email}', '${fullName}', '${userRole}');`;

console.log('\n=== Setup Admin User ===\n');
console.log('Copy the SQL below and run it using:');
console.log('npx wrangler d1 execute recipe-db --command="<paste SQL here>"\n');
console.log('Or save to a file and run:');
console.log('npx wrangler d1 execute recipe-db --file=insert-admin.sql\n');
console.log('SQL:\n');
console.log(sql);
console.log('\n');
