import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
}

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
        }
    ],
    sessions: [],
    records: [],
    uploadHistory: []
};

function readDB(): DBData {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return INITIAL_DATA;
    }
}

function writeDB(data: DBData) {
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
