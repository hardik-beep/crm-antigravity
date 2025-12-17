import fs from 'fs';
import path from 'path';

// Determine if we are in a production environment (like Vercel)
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// In production, use /tmp which is writable. In development, use local data folder.
const DATA_DIR = IS_PRODUCTION ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Source file to seed from (committed data)
const SEED_FILE = path.join(process.cwd(), 'data', 'db.json');

import type { CRMRecord, UploadHistory } from './types';

export interface DBUser {
    id: string;
    username: string; // ID/Email
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

interface DBData {
    users: DBUser[];
    sessions: DBSession[];
    records: CRMRecord[];
    uploadHistory: UploadHistory[];
}

const INITIAL_DATA: DBData = {
    users: [
        {
            id: 'admin-1',
            username: 'admin',
            password: 'admin123', // Default credentials
            name: 'Administrator',
            role: 'admin',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'agent-default',
            username: 'agent',
            password: 'agent', // Default agent credentials
            name: 'Default Agent',
            role: 'agent',
            createdAt: new Date().toISOString(),
        }
    ],
    sessions: [],
    records: [],
    uploadHistory: []
};

function ensureDB() {
    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // If DB_FILE doesn't exist in the working directory
    if (!fs.existsSync(DB_FILE)) {
        // Try to copy from seed file (committed data) if it exists
        if (fs.existsSync(SEED_FILE)) {
            try {
                const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
                fs.writeFileSync(DB_FILE, seedData);
                return;
            } catch (error) {
                console.error("Failed to copy seed file:", error);
            }
        }

        // Fallback to INITIAL_DATA
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    }
}

let cachedData: DBData | null = null;

function readDB(): DBData {
    ensureDB();
    if (cachedData) return cachedData;

    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        cachedData = JSON.parse(data);
        return cachedData!;
    } catch (error) {
        cachedData = JSON.parse(JSON.stringify(INITIAL_DATA));
        return cachedData!;
    }
}

function writeDB(data: DBData) {
    ensureDB();
    cachedData = data; // Update cache
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export const db = {
    getUsers: () => readDB().users,
    addUser: (user: DBUser) => {
        const data = readDB();
        data.users.push(user);
        writeDB(data);
    },
    deleteUser: (userId: string) => {
        const data = readDB();
        data.users = data.users.filter(u => u.id !== userId);
        data.sessions = data.sessions.filter(s => s.userId !== userId);
        writeDB(data);
    },
    findUser: (username: string) => readDB().users.find(u => u.username === username),

    getSessions: () => readDB().sessions,
    createSession: (session: DBSession) => {
        const data = readDB();
        // Deactivate previous sessions for this user
        data.sessions.forEach(s => {
            if (s.userId === session.userId && s.isActive) {
                s.isActive = false;
            }
        });
        data.sessions.push(session);
        writeDB(data);
    },
    updateHeartbeat: (userId: string) => {
        // Only update in memory to avoid triggering reload in dev
        const data = readDB();
        const session = data.sessions.find(s => s.userId === userId && s.isActive);
        if (session) {
            session.lastActiveTime = new Date().toISOString();
            // We do NOT call writeDB(data) here to prevent file watcher from triggering a reload
            // cachedData is already updated since it's a reference
        }
    },
    logoutUser: (userId: string) => {
        const data = readDB();
        const session = data.sessions.find(s => s.userId === userId && s.isActive);
        if (session) {
            session.isActive = false;
            writeDB(data);
        }
    },

    // Records management
    getRecords: () => readDB().records || [],
    saveRecords: (records: CRMRecord[]) => {
        const data = readDB();
        data.records = records;
        writeDB(data);
    },
    addRecord: (record: CRMRecord) => {
        const data = readDB();
        if (!data.records) data.records = [];
        data.records.push(record);
        writeDB(data);
    },
    updateRecord: (record: CRMRecord) => {
        const data = readDB();
        if (!data.records) data.records = [];
        data.records = data.records.map(r => r.id === record.id ? record : r);
        writeDB(data);
    },
    deleteRecord: (id: string) => {
        const data = readDB();
        if (!data.records) data.records = [];
        data.records = data.records.filter(r => r.id !== id);
        writeDB(data);
    },
    deleteRecords: (ids: string[]) => {
        const data = readDB();
        if (!data.records) data.records = [];
        data.records = data.records.filter(r => !ids.includes(r.id));
        writeDB(data);
    },

    // Upload History
    getUploadHistory: () => readDB().uploadHistory || [],
    addUploadHistory: (history: UploadHistory) => {
        const data = readDB();
        if (!data.uploadHistory) data.uploadHistory = [];
        data.uploadHistory.unshift(history);
        writeDB(data);
    },
    // Get active sessions populated with user details
    getActiveAgents: () => {
        const data = readDB();
        return data.users.map(user => {
            const activeSession = data.sessions.find(s => s.userId === user.id && s.isActive);
            return {
                ...user,
                // Don't return password
                password: '***',
                isLoggedIn: !!activeSession,
                punchInTime: activeSession?.punchInTime || null,
                lastActiveTime: activeSession?.lastActiveTime || null,
            };
        });
    }
};
