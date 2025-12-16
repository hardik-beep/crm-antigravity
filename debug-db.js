
const { db } = require('./lib/db');

try {
    const user = db.findUser('admin');
    console.log('User found:', user);
    if (user && user.password === 'admin123') {
        console.log('Credentials match!');
    } else {
        console.log('Credentials mismatch or user not found');
    }
} catch (e) {
    console.error('Error:', e);
}
