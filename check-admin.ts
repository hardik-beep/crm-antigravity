
import dbConnect from './lib/mongodb';
import User from './lib/models/User';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    await dbConnect();
    const admin = await User.findOne({ username: 'admin' });
    console.log('Admin user in DB:', admin);
    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});
