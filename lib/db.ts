import { supabaseAdmin } from './supabase';
import crypto from 'crypto';
import type { CRMRecord, UploadHistory as UploadHistoryType } from './types';

// DB Types reflecting Supabase Schema
interface SupabaseUser {
    id: string;
    username: string;
    password: string;
    name: string;
    role: 'admin' | 'agent';
    created_at: string;
}

interface SupabaseSession {
    session_id: string;
    user_id: string;
    punch_in_time: string | null;
    last_active_time: string;
    is_active: boolean;
}

interface SupabaseRecord {
    id: string;
    type: 'protect' | 'settlement' | 'nexus';
    partner: string;
    name: string;
    mobile_number: string;
    status: string;
    stage: string;
    uploaded_from: string;
    uploaded_at: string;
    updated_at: string;
    remarks: any;
    activity_log: any;
    data: any;
}

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
    punchInTime?: string | null;
    lastActiveTime: string;
    isActive: boolean;
}

// Helper to ensure we have the admin client
function getClient() {
    if (!supabaseAdmin) {
        // Log specifically so it shows up in Vercel logs
        console.warn("[DB] Supabase Admin Client not initialized. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
        return null; // Return null instead of throwing to allow fallbacks
    }
    return supabaseAdmin;
}

// Initial data for fresh DB
async function seedInitialData() {
    const supabase = getClient();
    if (!supabase) return;

    try {
        const { data: adminExists, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin')
            .maybeSingle();

        if (checkError) {
            console.error('[DB] Error checking for admin user:', checkError.message);
            return; // If we can't even check, don't try to insert blindly
        }

        if (!adminExists) {
            console.log('[DB] No admin found, seeding default users...');
            const { error: seedError } = await supabase.from('users').insert([
                {
                    id: 'admin-1',
                    username: 'admin',
                    password: 'admin123',
                    name: 'Administrator',
                    role: 'admin',
                    created_at: new Date().toISOString(),
                },
                {
                    id: 'agent-default',
                    username: 'agent',
                    password: 'agent',
                    name: 'Default Agent',
                    role: 'agent',
                    created_at: new Date().toISOString(),
                }
            ]);

            if (seedError) {
                console.error('[DB] Error seeding initial users:', seedError.message);
            } else {
                console.log('[DB] Seeded initial admin and agent users.');
            }
        }
    } catch (error) {
        console.error('[DB] unexpected error during initial data seeding:', error);
    }
}

export const db = {
    getUsers: async () => {
        const supabase = getClient();
        if (!supabase) return [];
        await seedInitialData();
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;

        return data.map((u: SupabaseUser) => ({
            id: u.id,
            username: u.username,
            password: u.password,
            name: u.name,
            role: u.role,
            createdAt: u.created_at,
        }));
    },

    addUser: async (user: DBUser) => {
        const supabase = getClient();
        if (!supabase) throw new Error("Supabase client not initialized.");
        const { data, error } = await supabase.from('users').insert({
            id: user.id || crypto.randomUUID(), // Ensure ID if not provided
            username: user.username,
            password: user.password,
            name: user.name,
            role: user.role,
            created_at: new Date().toISOString(),
        }).select().single();

        if (error) throw error;
        return data; // Returns inserted row
    },

    deleteUser: async (userId: string) => {
        const supabase = getClient();
        if (!supabase) return;
        await supabase.from('users').delete().eq('id', userId);
        // Cascade delete handles sessions ideally, but just in case
        await supabase.from('sessions').delete().eq('user_id', userId);
    },

    findUser: async (username: string) => {
        const supabase = getClient();
        if (!supabase) return null; // Fallback to hardcoded users if no client

        await seedInitialData();
        const { data: u, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .maybeSingle();

        if (error) {
            console.error(`[DB] findUser error for ${username}:`, error.message);
            return null; // Treat error as user not found for login flow to allow fallback
        }
        if (!u) return null;

        return {
            id: u.id,
            username: u.username,
            password: u.password,
            name: u.name,
            role: u.role,
            createdAt: u.created_at,
        };
    },

    getLastModified: async () => {
        const supabase = getClient();
        if (!supabase) return new Date(0).toISOString();
        const { data: lastRecord } = await supabase
            .from('crm_records')
            .select('updated_at')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const { data: lastUpload } = await supabase
            .from('upload_history')
            .select('uploaded_at')
            .order('uploaded_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const recordTime = lastRecord?.updated_at ? new Date(lastRecord.updated_at).getTime() : 0;
        const uploadTime = lastUpload?.uploaded_at ? new Date(lastUpload.uploaded_at).getTime() : 0;

        const maxTime = Math.max(recordTime, uploadTime);
        return maxTime > 0 ? new Date(maxTime).toISOString() : new Date(0).toISOString();
    },

    getRecordCount: async () => {
        const supabase = getClient();
        if (!supabase) return 0;
        const { count, error } = await supabase
            .from('crm_records')
            .select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
    },

    getUploadCount: async () => {
        const supabase = getClient();
        if (!supabase) return 0;
        const { count, error } = await supabase
            .from('upload_history')
            .select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
    },

    getSessions: async () => {
        const supabase = getClient();
        if (!supabase) return [];
        const { data, error } = await supabase.from('sessions').select('*');
        if (error) throw error;

        return data.map((s: SupabaseSession) => ({
            sessionId: s.session_id,
            userId: s.user_id,
            punchInTime: s.punch_in_time,
            lastActiveTime: s.last_active_time,
            isActive: s.is_active,
        }));
    },

    createSession: async (session: DBSession) => {
        const supabase = getClient();
        if (!supabase) return;

        // Deactivate previous sessions for this user
        try {
            await supabase
                .from('sessions')
                .update({ is_active: false })
                .eq('user_id', session.userId)
                .eq('is_active', true);

            await supabase.from('sessions').insert({
                session_id: session.sessionId,
                user_id: session.userId,
                punch_in_time: session.punchInTime || null,
                last_active_time: new Date(session.lastActiveTime).toISOString(),
                is_active: true,
            });
        } catch (e: any) {
            console.error("[DB] createSession failed for user:", session.userId, "Error:", e?.message || e);
        }
    },

    updateHeartbeat: async (userId: string) => {
        const supabase = getClient();
        if (!supabase) return true; // Fallback to success if DB is unavailable

        try {
            const { data, error } = await supabase
                .from('sessions')
                .update({ last_active_time: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('is_active', true)
                .select();

            if (error) {
                console.error("[DB] Heartbeat update error:", error.message);
                return true; // Return true to avoid logging out the user on DB errors
            }

            // If no sessions were updated, it means the session was deactivated (e.g. by admin)
            // or it never existed. In this case we return false to trigger logout.
            return data && data.length > 0;
        } catch (e) {
            console.error("[DB] Heartbeat unexpected error:", e);
            return true;
        }
    },

    punchInUser: async (userId: string) => {
        const supabase = getClient();
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('sessions')
            .update({ punch_in_time: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('is_active', true)
            .select()
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    logoutUser: async (userId: string) => {
        const supabase = getClient();
        if (!supabase) return;
        await supabase
            .from('sessions')
            .update({ is_active: false })
            .eq('user_id', userId)
            .eq('is_active', true);
    },

    // Records management
    getRecords: async () => {
        const supabase = getClient();
        if (!supabase) return [];
        const { data, error } = await supabase.from('crm_records').select('*');
        if (error) throw error;

        return data.map((r: SupabaseRecord) => {
            const { data: recordData, ...fields } = r;
            // Spread stored JSON data (Protect/Settlement specific fields) into the object
            // Map snake_case fields back to CamelCase
            return {
                ...recordData, // Spread first
                id: fields.id,
                type: fields.type,
                partner: fields.partner,
                name: fields.name,
                mobileNumber: fields.mobile_number,
                status: fields.status,
                stage: fields.stage,
                uploadedFrom: fields.uploaded_from,
                uploadedAt: fields.uploaded_at,
                updatedAt: fields.updated_at,
                remarks: fields.remarks,
                activityLog: fields.activity_log,
            };
        }) as CRMRecord[];
    },

    getRecord: async (id: string) => {
        const supabase = getClient();
        if (!supabase) return null;
        const { data: r, error } = await supabase
            .from('crm_records')
            .select('*')
            .eq('id', id)
            .single();

        if (!r) return null;

        const { data: recordData, ...fields } = r as SupabaseRecord;
        return {
            ...recordData,
            id: fields.id,
            type: fields.type,
            partner: fields.partner,
            name: fields.name,
            mobileNumber: fields.mobile_number,
            status: fields.status,
            stage: fields.stage,
            uploadedFrom: fields.uploaded_from,
            uploadedAt: fields.uploaded_at,
            updatedAt: fields.updated_at,
            remarks: fields.remarks,
            activityLog: fields.activity_log,
        } as CRMRecord;
    },

    saveRecords: async (records: CRMRecord[]) => {
        const supabase = getClient();
        if (!supabase) return;
        // Nuke all records
        await supabase.from('crm_records').delete().neq('id', 'placeholder_never_match'); // Delete all

        if (records.length === 0) return;

        const toInsert = records.map(r => {
            const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...extraData } = r;
            return {
                id,
                type,
                partner,
                name,
                mobile_number: mobileNumber,
                status,
                stage,
                uploaded_from: uploadedFrom,
                uploaded_at: uploadedAt ? new Date(uploadedAt).toISOString() : new Date().toISOString(),
                updated_at: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
                remarks,
                activity_log: activityLog,
                data: extraData
            };
        });

        // Supabase bulk insert
        const { error } = await supabase.from('crm_records').insert(toInsert);
        if (error) throw error;
    },

    addRecord: async (record: CRMRecord) => {
        const supabase = getClient();
        if (!supabase) return;
        const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...extraData } = record;

        const { error } = await supabase.from('crm_records').insert({
            id,
            type,
            partner,
            name,
            mobile_number: mobileNumber,
            status,
            stage,
            uploaded_from: uploadedFrom,
            uploaded_at: uploadedAt ? new Date(uploadedAt).toISOString() : new Date().toISOString(),
            updated_at: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
            remarks,
            activity_log: activityLog,
            data: extraData
        });
        if (error) throw error;
    },

    updateRecord: async (record: CRMRecord) => {
        const supabase = getClient();
        if (!supabase) return;
        const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...extraData } = record;

        // Upsert
        const { error } = await supabase.from('crm_records').upsert({
            id,
            type,
            partner,
            name,
            mobile_number: mobileNumber,
            status,
            stage,
            uploaded_from: uploadedFrom,
            // Keep uploaded_at as is logic? Record passed in has it.
            uploaded_at: uploadedAt ? new Date(uploadedAt).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
            remarks,
            activity_log: activityLog,
            data: extraData
        });
        if (error) throw error;
    },

    deleteRecord: async (id: string) => {
        const supabase = getClient();
        if (!supabase) return;
        await supabase.from('crm_records').delete().eq('id', id);
    },

    deleteRecords: async (ids: string[]) => {
        const supabase = getClient();
        if (!supabase) return;
        await supabase.from('crm_records').delete().in('id', ids);
    },

    addManyRecords: async (records: CRMRecord[]) => {
        const supabase = getClient();
        if (!supabase) throw new Error("Supabase client not initialized.");
        const insertionTime = new Date();
        const toInsert = records.map(r => {
            const { id, type, partner, name, mobileNumber, status, stage, uploadedFrom, uploadedAt, updatedAt, remarks, activityLog, ...extraData } = r;
            return {
                id,
                type: type || 'protect', // fallback
                partner: partner || 'other',
                name: name || 'Unknown',
                mobile_number: mobileNumber || '0000000000',
                status: status || 'New',
                stage: stage || 'New',
                uploaded_from: uploadedFrom || 'Bulk',
                uploaded_at: uploadedAt ? new Date(uploadedAt).toISOString() : insertionTime.toISOString(),
                updated_at: insertionTime.toISOString(),
                remarks: remarks || [],
                activity_log: activityLog || [],
                data: extraData
            };
        });

        // Use upsert to be safe, or insert. Original used insertMany with ordered:false.
        // Supabase insert is all or nothing unless we ignore duplicates?
        // Let's use upsert in case of ID collision, or just insert.
        const { error } = await supabase.from('crm_records').insert(toInsert);

        if (error) {
            console.error("DB Insert Error:", error);
            throw error;
        }
        return insertionTime.toISOString();
    },

    // Upload History
    getUploadHistory: async () => {
        const supabase = getClient();
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('upload_history')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) throw error;

        return data.map(h => ({
            id: h.id,
            fileName: h.file_name,
            uploadedAt: h.uploaded_at,
            recordType: h.record_type,
            partner: h.partner,
            totalRows: h.total_rows,
            validRows: h.valid_rows,
            invalidRows: h.invalid_rows,
        }));
    },

    addUploadHistory: async (history: UploadHistoryType) => {
        const supabase = getClient();
        if (!supabase) return;
        const { error } = await supabase.from('upload_history').insert({
            id: history.id,
            file_name: history.fileName,
            uploaded_at: history.uploadedAt ? new Date(history.uploadedAt).toISOString() : new Date().toISOString(),
            record_type: history.recordType,
            partner: history.partner,
            total_rows: history.totalRows,
            valid_rows: history.validRows,
            invalid_rows: history.invalidRows,
        });
        if (error) throw error;
    },

    // Get active sessions populated with user details
    getActiveAgents: async () => {
        const supabase = getClient();
        if (!supabase) return [];

        const { data: users } = await supabase.from('users').select('*');
        const { data: sessions } = await supabase.from('sessions').select('*').eq('is_active', true);

        if (!users) return [];
        const activeSessions = sessions || [];

        return users.map((user: SupabaseUser) => {
            const activeSession = activeSessions.find((s: SupabaseSession) => s.user_id === user.id);
            return {
                id: user.id,
                username: user.username,
                password: '***',
                name: user.name,
                role: user.role,
                createdAt: user.created_at,
                isLoggedIn: !!activeSession,
                punchInTime: activeSession?.punch_in_time || null,
                lastActiveTime: activeSession?.last_active_time || null,
            };
        });
    }
};

