
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
        username: String,
        password: String,
        role: String
    }));

    const admin = await User.findOne({ username: 'admin' });
    console.log('Admin user found:', admin ? { username: admin.username, role: admin.role, password: admin.password } : 'NOT FOUND');
    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});
