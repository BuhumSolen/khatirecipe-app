// Verify bcrypt password hash
const bcrypt = require('bcryptjs');

const password = 'Angvaiti@1';
const hashFromDB = '$2b$10$Q9mymwbeBmUPvCqNsko4C.arlhWgzPlx9TbsRkAYR/up3RK.FavNS';

console.log('\n=== Password Verification Test ===\n');
console.log('Testing password:', password);
console.log('Against hash:', hashFromDB);
console.log('\nResult:', bcrypt.compareSync(password, hashFromDB) ? '✓ MATCH' : '✗ NO MATCH');
console.log('\n');
