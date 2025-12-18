import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './lib/models/User';
import Session from './lib/models/Session';
import CRMRecordModel from './lib/models/Record';
import UploadHistory from './lib/models/UploadHistory';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env.local or .env');
        process.exit(1);
    }

    const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
    if (!fs.existsSync(DB_FILE)) {
        console.log('No db.json found in ./data/db.json. Nothing to migrate.');
        return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

    if (data.users && data.users.length > 0) {
        console.log(`Migrating ${data.users.length} users...`);
        for (const u of data.users) {
            await User.updateOne(
                { username: u.username },
                { $set: { ...u, createdAt: new Date(u.createdAt) } },
                { upsert: true }
            );
        }
    }

    if (data.sessions && data.sessions.length > 0) {
        console.log(`Migrating ${data.sessions.length} sessions...`);
        for (const s of data.sessions) {
            await Session.updateOne(
                { sessionId: s.sessionId },
                { $set: { ...s, punchInTime: new Date(s.punchInTime), lastActiveTime: new Date(s.lastActiveTime) } },
                { upsert: true }
            );
        }
    }

    if (data.records && data.records.length > 0) {
        console.log(`Migrating ${data.records.length} records...`);
        for (const r of data.records) {
            const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...rest } = r;
            await CRMRecordModel.updateOne(
                { id },
                {
                    $set: {
                        id, type, partner, name, mobileNumber, status, stage, uploadedFrom,
                        uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date(),
                        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
                        remarks, activityLog,
                        data: rest
                    }
                },
                { upsert: true }
            );
        }
    }

    if (data.uploadHistory && data.uploadHistory.length > 0) {
        console.log(`Migrating ${data.uploadHistory.length} upload history entries...`);
        for (const h of data.uploadHistory) {
            await UploadHistory.updateOne(
                { id: h.id },
                { $set: { ...h, uploadedAt: new Date(h.uploadedAt) } },
                { upsert: true }
            );
        }
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed with full error:');
    console.error(err);
    process.exit(1);
});
