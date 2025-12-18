import dbConnect from './mongodb';
import User from './models/User';
import Session from './models/Session';
import CRMRecordModel from './models/Record';
import UploadHistory from './models/UploadHistory';
import type { CRMRecord, UploadHistory as UploadHistoryType } from './types';

export interface DBUser {
    id: string;
    username: string;
    password: string;
    name: string;
    role: 'admin' | 'agent';
    createdAt: string;
}

export interface DBSession {
    sessionId: string;
    userId: string;
    punchInTime: string;
    lastActiveTime: string;
    isActive: boolean;
}

// Helper to ensure connection
async function connect() {
    const conn = await dbConnect();
    if (!conn) {
        console.error("[DB] MongoDB URI is missing. Cannot connect to database.");
        throw new Error("Database connection failed. Check MONGODB_URI.");
    }
    return true;
}

// Initial data for fresh DB
async function seedInitialData() {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        await User.create({
            username: 'admin',
            password: 'admin123',
            name: 'Administrator',
            role: 'admin',
            createdAt: new Date(),
        });
        await User.create({
            username: 'agent',
            password: 'agent',
            name: 'Default Agent',
            role: 'agent',
            createdAt: new Date(),
        });
        console.log('[DB] Seeded initial admin and agent users.');
    }
}

export const db = {
    getUsers: async () => {
        await connect();
        await seedInitialData();
        const users = await User.find({});
        return users.map(u => ({
            id: u._id.toString(),
            username: u.username,
            password: u.password,
            name: u.name,
            role: u.role,
            createdAt: u.createdAt.toISOString(),
        }));
    },
    addUser: async (user: DBUser) => {
        await connect();
        await User.create({
            username: user.username,
            password: user.password,
            name: user.name,
            role: user.role,
            createdAt: new Date(),
        });
    },
    deleteUser: async (userId: string) => {
        await connect();
        await User.findByIdAndDelete(userId);
        await Session.deleteMany({ userId });
    },
    findUser: async (username: string) => {
        await connect();
        await seedInitialData();
        const u = await User.findOne({ username });
        if (!u) return null;
        return {
            id: u._id.toString(),
            username: u.username,
            password: u.password,
            name: u.name,
            role: u.role,
            createdAt: u.createdAt.toISOString(),
        };
    },
    getLastModified: async () => {
        // We can use a special setting or just return now for now
        // This was used for sync checking in JSON. 
        // With MongoDB, the app might not need this as much if it fetches fresh data.
        return new Date().toISOString();
    },

    getSessions: async () => {
        await connect();
        const sessions = await Session.find({});
        return sessions.map(s => ({
            sessionId: s.sessionId,
            userId: s.userId,
            punchInTime: s.punchInTime.toISOString(),
            lastActiveTime: s.lastActiveTime.toISOString(),
            isActive: s.isActive,
        }));
    },
    createSession: async (session: DBSession) => {
        await connect();
        // Deactivate previous sessions for this user
        await Session.updateMany({ userId: session.userId, isActive: true }, { isActive: false });
        await Session.create({
            sessionId: session.sessionId,
            userId: session.userId,
            punchInTime: new Date(session.punchInTime),
            lastActiveTime: new Date(session.lastActiveTime),
            isActive: true,
        });
    },
    updateHeartbeat: async (userId: string) => {
        await connect();
        await Session.findOneAndUpdate(
            { userId, isActive: true },
            { lastActiveTime: new Date() }
        );
    },
    logoutUser: async (userId: string) => {
        await connect();
        await Session.updateMany({ userId, isActive: true }, { isActive: false });
    },

    // Records management
    getRecords: async () => {
        await connect();
        const records = await CRMRecordModel.find({});
        return records.map(r => {
            const { data, ...rest } = r.toObject();
            return {
                ...rest,
                ...data,
                id: r.id, // Ensure we use the 'id' field from our schema, not _id
            };
        }) as CRMRecord[];
    },
    saveRecords: async (records: CRMRecord[]) => {
        await connect();
        // This is a bulk overwrite in the current logic.
        // For MongoDB, it's better to update individual records or use bulkWrite.
        // But to maintain exact current behavior:
        await CRMRecordModel.deleteMany({});
        const toInsert = records.map(r => {
            const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...data } = r;
            return {
                id, type, partner, name, mobileNumber, status, stage, uploadedFrom,
                uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date(),
                updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
                remarks, activityLog,
                data
            };
        });
        await CRMRecordModel.insertMany(toInsert);
    },
    addRecord: async (record: CRMRecord) => {
        await connect();
        const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...data } = record;
        await CRMRecordModel.create({
            id, type, partner, name, mobileNumber, status, stage, uploadedFrom,
            uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date(),
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
            remarks, activityLog,
            data
        });
    },
    updateRecord: async (record: CRMRecord) => {
        await connect();
        const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...data } = record;
        await CRMRecordModel.findOneAndUpdate(
            { id },
            {
                type, partner, name, mobileNumber, status, stage, uploadedFrom,
                updatedAt: new Date(),
                remarks, activityLog,
                data
            },
            { upsert: true }
        );
    },
    deleteRecord: async (id: string) => {
        await connect();
        await CRMRecordModel.deleteOne({ id });
    },
    deleteRecords: async (ids: string[]) => {
        await connect();
        await CRMRecordModel.deleteMany({ id: { $in: ids } });
    },

    // Upload History
    getUploadHistory: async () => {
        await connect();
        const histories = await UploadHistory.find({}).sort({ uploadedAt: -1 });
        return histories.map(h => ({
            id: h.id,
            fileName: h.fileName,
            uploadedAt: h.uploadedAt.toISOString(),
            recordType: h.recordType as any,
            partner: h.partner as any,
            totalRows: h.totalRows,
            validRows: h.validRows,
            invalidRows: h.invalidRows,
        }));
    },
    addUploadHistory: async (history: UploadHistoryType) => {
        await connect();
        await UploadHistory.create({
            id: history.id,
            fileName: history.fileName,
            uploadedAt: history.uploadedAt ? new Date(history.uploadedAt) : new Date(),
            recordType: history.recordType,
            partner: history.partner,
            totalRows: history.totalRows,
            validRows: history.validRows,
            invalidRows: history.invalidRows,
        });
    },
    // Get active sessions populated with user details
    getActiveAgents: async () => {
        await connect();
        const users = await User.find({});
        const sessions = await Session.find({ isActive: true });

        return users.map(user => {
            const activeSession = sessions.find(s => s.userId === user._id.toString());
            return {
                id: user._id.toString(),
                username: user.username,
                password: '***',
                name: user.name,
                role: user.role as 'admin' | 'agent',
                createdAt: user.createdAt.toISOString(),
                isLoggedIn: !!activeSession,
                punchInTime: activeSession?.punchInTime?.toISOString() || null,
                lastActiveTime: activeSession?.lastActiveTime?.toISOString() || null,
            };
        });
    }
};
