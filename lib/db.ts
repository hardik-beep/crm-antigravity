import fs from 'fs';
import path from 'path';

// Determine if we are in a Vercel environment
const IS_VERCEL = !!process.env.VERCEL;

// In Vercel, we MUST use /tmp (ephemeral). 
// In other production environments (VPS, etc.), we prefer the persistent 'data' directory.
const DATA_DIR = IS_VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

console.log(`[DB] Using storage path: ${DB_FILE} (Environment: ${IS_VERCEL ? 'Vercel' : 'Standard'})`);

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
    lastModified: string;
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
    uploadHistory: [],
    lastModified: new Date(0).toISOString()
};

function ensureDB() {
    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
        try {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        } catch (e) {
            console.error("[DB] Failed to create data directory:", e);
        }
    }

    // If DB_FILE doesn't exist in the working directory
    if (!fs.existsSync(DB_FILE)) {
        // Try to copy from seed file (committed data) if it exists and we're using /tmp or a fresh setup
        // Note: checking SEED_FILE !== DB_FILE to avoid copy-to-self if paths overlap
        if (fs.existsSync(SEED_FILE) && path.resolve(SEED_FILE) !== path.resolve(DB_FILE)) {
            try {
                const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
                fs.writeFileSync(DB_FILE, seedData);
                console.log("[DB] Seeded database from committed file.");
                return;
            } catch (error) {
                console.error("[DB] Failed to copy seed file:", error);
            }
        }

        // Fallback to INITIAL_DATA
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA));
            console.log("[DB] Created new database with initial data.");
        } catch (e) {
            console.error("[DB] Failed to write initial data:", e);
        }
    }
}

// Removed persistent memory cache to ensure multi-process consistency (e.g., PM2 cluster)
// Each read will verify the file state.
function readDB(): DBData {
    ensureDB();

    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed.lastModified) parsed.lastModified = new Date(0).toISOString();
        return parsed;
    } catch (error) {
        console.error("[DB] Failed to read database, returning initial data:", error);
        return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
}

function writeDB(data: DBData) {
    ensureDB();
    try {
        data.lastModified = new Date().toISOString();
        fs.writeFileSync(DB_FILE, JSON.stringify(data));
    } catch (error) {
        console.error("[DB] Failed to write database:", error);
    }
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
    getLastModified: () => readDB().lastModified,

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
        // For heartbeat, we can just read, modify, write. 
        // Or to save IO, we COULD cache, but strict consistency requires writing.
        // Given heartbeat is every minute, writing is fine for low traffic.
        const data = readDB();
        const session = data.sessions.find(s => s.userId === userId && s.isActive);
        if (session) {
            session.lastActiveTime = new Date().toISOString();
            writeDB(data);
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
