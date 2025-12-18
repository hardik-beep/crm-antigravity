module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
// Determine if we are in a Vercel environment
const IS_VERCEL = !!process.env.VERCEL;
// In Vercel, we MUST use /tmp (ephemeral). 
// In other production environments (VPS, etc.), we prefer the persistent 'data' directory.
const DATA_DIR = IS_VERCEL ? '/tmp' : __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
const DB_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'db.json');
console.log(`[DB] Using storage path: ${DB_FILE} (Environment: ${IS_VERCEL ? 'Vercel' : 'Standard'})`);
// Source file to seed from (committed data)
const SEED_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', 'db.json');
const INITIAL_DATA = {
    users: [
        {
            id: 'admin-1',
            username: 'admin',
            password: 'admin123',
            name: 'Administrator',
            role: 'admin',
            createdAt: new Date().toISOString()
        },
        {
            id: 'agent-default',
            username: 'agent',
            password: 'agent',
            name: 'Default Agent',
            role: 'agent',
            createdAt: new Date().toISOString()
        }
    ],
    sessions: [],
    records: [],
    uploadHistory: [],
    lastModified: new Date().toISOString()
};
function ensureDB() {
    // Ensure directory exists
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
                recursive: true
            });
        } catch (e) {
            console.error("[DB] Failed to create data directory:", e);
        }
    }
    // If DB_FILE doesn't exist in the working directory
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DB_FILE)) {
        // Try to copy from seed file (committed data) if it exists and we're using /tmp or a fresh setup
        // Note: checking SEED_FILE !== DB_FILE to avoid copy-to-self if paths overlap
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(SEED_FILE) && __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(SEED_FILE) !== __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(DB_FILE)) {
            try {
                const seedData = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(SEED_FILE, 'utf-8');
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DB_FILE, seedData);
                console.log("[DB] Seeded database from committed file.");
                return;
            } catch (error) {
                console.error("[DB] Failed to copy seed file:", error);
            }
        }
        // Fallback to INITIAL_DATA
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA));
            console.log("[DB] Created new database with initial data.");
        } catch (e) {
            console.error("[DB] Failed to write initial data:", e);
        }
    }
}
// Removed persistent memory cache to ensure multi-process consistency (e.g., PM2 cluster)
// Each read will verify the file state.
function readDB() {
    ensureDB();
    try {
        const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed.lastModified) parsed.lastModified = new Date(0).toISOString();
        return parsed;
    } catch (error) {
        console.error("[DB] Failed to read database, returning initial data:", error);
        return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
}
function writeDB(data) {
    ensureDB();
    try {
        data.lastModified = new Date().toISOString();
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DB_FILE, JSON.stringify(data));
    } catch (error) {
        console.error("[DB] Failed to write database:", error);
    }
}
const db = {
    getUsers: ()=>readDB().users,
    addUser: (user)=>{
        const data = readDB();
        data.users.push(user);
        writeDB(data);
    },
    deleteUser: (userId)=>{
        const data = readDB();
        data.users = data.users.filter((u)=>u.id !== userId);
        data.sessions = data.sessions.filter((s)=>s.userId !== userId);
        writeDB(data);
    },
    findUser: (username)=>readDB().users.find((u)=>u.username === username),
    getLastModified: ()=>readDB().lastModified,
    getSessions: ()=>readDB().sessions,
    createSession: (session)=>{
        const data = readDB();
        // Deactivate previous sessions for this user
        data.sessions.forEach((s)=>{
            if (s.userId === session.userId && s.isActive) {
                s.isActive = false;
            }
        });
        data.sessions.push(session);
        writeDB(data);
    },
    updateHeartbeat: (userId)=>{
        // For heartbeat, we can just read, modify, write. 
        // Or to save IO, we COULD cache, but strict consistency requires writing.
        // Given heartbeat is every minute, writing is fine for low traffic.
        const data = readDB();
        const session = data.sessions.find((s)=>s.userId === userId && s.isActive);
        if (session) {
            session.lastActiveTime = new Date().toISOString();
            writeDB(data);
        }
    },
    logoutUser: (userId)=>{
        const data = readDB();
        const session = data.sessions.find((s)=>s.userId === userId && s.isActive);
        if (session) {
            session.isActive = false;
            writeDB(data);
        }
    },
    // Records management
    getRecords: ()=>readDB().records || [],
    saveRecords: (records)=>{
        const data = readDB();
        data.records = records;
        writeDB(data);
    },
    addRecord: (record)=>{
        const data = readDB();
        if (!data.records) data.records = [];
        data.records.push(record);
        writeDB(data);
    },
    updateRecord: (record)=>{
        const data = readDB();
        if (!data.records) data.records = [];
        data.records = data.records.map((r)=>r.id === record.id ? record : r);
        writeDB(data);
    },
    deleteRecord: (id)=>{
        const data = readDB();
        if (!data.records) data.records = [];
        data.records = data.records.filter((r)=>r.id !== id);
        writeDB(data);
    },
    deleteRecords: (ids)=>{
        const data = readDB();
        if (!data.records) data.records = [];
        data.records = data.records.filter((r)=>!ids.includes(r.id));
        writeDB(data);
    },
    // Upload History
    getUploadHistory: ()=>readDB().uploadHistory || [],
    addUploadHistory: (history)=>{
        const data = readDB();
        if (!data.uploadHistory) data.uploadHistory = [];
        data.uploadHistory.unshift(history);
        writeDB(data);
    },
    // Get active sessions populated with user details
    getActiveAgents: ()=>{
        const data = readDB();
        return data.users.map((user)=>{
            const activeSession = data.sessions.find((s)=>s.userId === user.id && s.isActive);
            return {
                ...user,
                // Don't return password
                password: '***',
                isLoggedIn: !!activeSession,
                punchInTime: activeSession?.punchInTime || null,
                lastActiveTime: activeSession?.lastActiveTime || null
            };
        });
    }
};
}),
"[project]/app/api/upload-history/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const history = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].getUploadHistory();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            history
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch history'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const entry = await req.json();
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].addUploadHistory(entry);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to save history'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4b71dc7b._.js.map