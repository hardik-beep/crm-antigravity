(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/theme-provider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        isAuthenticated: false,
        attendance: [],
        login: (user)=>{
            set({
                isAuthenticated: true,
                user
            });
        },
        logout: ()=>set({
                user: null,
                isAuthenticated: false
            }),
        punchIn: ()=>{
            const { user, attendance } = get();
            if (!user) return;
            const record = {
                id: `punch-${Date.now()}`,
                userId: user.id,
                type: 'in',
                timestamp: new Date().toISOString()
            };
            set({
                attendance: [
                    ...attendance,
                    record
                ]
            });
        },
        punchOut: ()=>{
            const { user, attendance } = get();
            if (!user) return;
            const record = {
                id: `punch-${Date.now()}`,
                userId: user.id,
                type: 'out',
                timestamp: new Date().toISOString()
            };
            set({
                attendance: [
                    ...attendance,
                    record
                ]
            });
        },
        getLastPunch: (userId)=>{
            const records = get().attendance.filter((r)=>r.userId === userId);
            return records[records.length - 1];
        }
    }), {
    name: 'auth-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "detectPartner",
    ()=>detectPartner,
    "detectRecordType",
    ()=>detectRecordType,
    "getDPDGroup",
    ()=>getDPDGroup,
    "useCRMStore",
    ()=>useCRMStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/idb-keyval/dist/index.js [app-client] (ecmascript)");
"use client";
;
;
;
// Custom Storage Adapter for IndexedDB
const storage = {
    getItem: async (name)=>{
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(name) || null;
    },
    setItem: async (name, value)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(name, value);
    },
    removeItem: async (name)=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["del"])(name);
    }
};
function getDPDGroup(dpd) {
    if (dpd <= 30) return "0-30";
    if (dpd <= 60) return "31-60";
    if (dpd <= 90) return "61-90";
    if (dpd <= 180) return "91-180";
    return "180+";
}
function detectPartner(row) {
    const values = Object.values(row).map((v)=>String(v).toLowerCase().trim());
    if (values.some((v)=>v.includes("sayyam") || v.includes("sayam") || v === "sy")) return "sayyam";
    if (values.some((v)=>v.includes("snapmint") || v.includes("snap mint") || v === "sm")) return "snapmint";
    return null;
}
function detectRecordType(columns) {
    const lowerCols = columns.map((c)=>c.toLowerCase().trim());
    // Unique columns for Nexus
    const nexusIndicators = [
        "user id",
        "user_id",
        "nexus purchase date",
        "tx_date_time",
        "tx date time"
    ];
    // Unique columns for Settlement
    const settlementIndicators = [
        "creditor name",
        "debt type",
        "loan amount",
        "is emi bounced",
        "customer wish amount",
        "recommended amount"
    ];
    // Unique columns for Protect
    const protectIndicators = [
        "plan",
        "institution",
        "account number",
        "emi amount",
        "current dpd"
    ];
    const hasNexus = lowerCols.some((c)=>c.includes("user_id") || c.includes("user id")) || lowerCols.some((c)=>c.includes("tx_date_time")) || lowerCols.some((c)=>c.includes("user_id")) && lowerCols.some((c)=>c.includes("email"));
    const hasSettlement = settlementIndicators.some((ind)=>lowerCols.some((col)=>col.includes(ind)));
    const hasProtect = protectIndicators.some((ind)=>lowerCols.some((col)=>col.includes(ind)));
    if (hasNexus) return "nexus";
    // Prefer Settlement if strong indicators exist
    if (hasSettlement) return "settlement";
    if (hasProtect) return "protect";
    // Fallback or default
    return "protect";
}
const useCRMStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        records: [],
        uploadHistory: [],
        searchQuery: "",
        statusFilter: "all",
        partnerFilter: "all",
        lenderFilter: "all",
        dpdGroupFilter: "all",
        dateRangeStart: "",
        dateRangeEnd: "",
        typeFilter: "both",
        dateFilterType: "30d",
        npaOnly: false,
        isInitialized: false,
        geminiApiKey: "",
        setInitialized: (val)=>set({
                isInitialized: val
            }),
        setGeminiApiKey: (key)=>set({
                geminiApiKey: key
            }),
        setRecords: (records)=>set({
                records
            }),
        fetchRecords: async ()=>{
            try {
                const res = await fetch('/api/records');
                const data = await res.json();
                if (data.records) {
                    set({
                        records: data.records
                    });
                }
            } catch (error) {
                console.error("Failed to fetch records:", error);
            }
        },
        fetchUploadHistory: async ()=>{
            try {
                const res = await fetch('/api/upload-history');
                const data = await res.json();
                if (data.history) {
                    set({
                        uploadHistory: data.history
                    });
                }
            } catch (error) {
                console.error("Failed to fetch upload history:", error);
            }
        },
        addRecords: async (newRecords, upload)=>{
            // Optimistic update? No, let's wait for server for bulk add to ensure ID stability if server generated IDs (but here we generate IDs in client possibly? yes, in excel-upload).
            // Actually excel-upload generates IDs.
            // Optimistic:
            set((state)=>({
                    records: [
                        ...state.records,
                        ...newRecords
                    ],
                    uploadHistory: [
                        upload,
                        ...state.uploadHistory
                    ]
                }));
            // Sync
            try {
                await fetch('/api/records', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        records: newRecords
                    })
                });
                await fetch('/api/upload-history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(upload)
                });
            } catch (e) {
                console.error("Sync failed", e);
            }
        },
        updateRecord: async (id, updates)=>{
            set((state)=>({
                    records: state.records.map((r)=>r.id === id ? {
                            ...r,
                            ...updates
                        } : r)
                }));
            try {
                await fetch(`/api/records/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                });
            } catch (e) {
                console.error("Sync failed", e);
            }
        },
        updateRecordStatus: async (id, status)=>{
            const record = get().records.find((r)=>r.id === id);
            if (record) {
                const entry = {
                    action: "Status Changed",
                    details: `Status updated to "${status}"`,
                    timestamp: new Date().toISOString(),
                    user: "Current User"
                };
                const updatedRecord = {
                    ...record,
                    status,
                    activityLog: [
                        ...record.activityLog,
                        {
                            ...entry,
                            id: `log-${Date.now()}`
                        }
                    ]
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === id ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        updateRecordStage: async (id, stage)=>{
            const record = get().records.find((r)=>r.id === id);
            if (record) {
                const entry = {
                    action: "Stage Changed",
                    details: `Stage updated to "${stage}"`,
                    timestamp: new Date().toISOString(),
                    user: "Current User"
                };
                const updatedRecord = {
                    ...record,
                    stage,
                    activityLog: [
                        ...record.activityLog,
                        {
                            ...entry,
                            id: `log-${Date.now()}`
                        }
                    ]
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === id ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        updatePartPayment: async (id, amount)=>{
            const record = get().records.find((r)=>r.id === id);
            if (record) {
                const entry = {
                    action: "Part Payment Updated",
                    details: `Part Payment updated to ₹${amount.toLocaleString()}`,
                    timestamp: new Date().toISOString(),
                    user: "Current User"
                };
                const updatedRecord = {
                    ...record,
                    partPaymentAmount: amount,
                    activityLog: [
                        ...record.activityLog,
                        {
                            ...entry,
                            id: `log-${Date.now()}`
                        }
                    ]
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === id ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        addRemark: async (recordId, remark)=>{
            const record = get().records.find((r)=>r.id === recordId);
            if (record) {
                const newRemark = {
                    ...remark,
                    id: `remark-${Date.now()}`
                };
                const logEntry = {
                    id: `log-${Date.now()}`,
                    action: "Remark Added",
                    details: remark.text.substring(0, 50) + (remark.text.length > 50 ? "..." : ""),
                    timestamp: new Date().toISOString(),
                    user: remark.createdBy
                };
                const updatedRecord = {
                    ...record,
                    remarks: [
                        ...record.remarks,
                        newRemark
                    ],
                    activityLog: [
                        ...record.activityLog,
                        logEntry
                    ]
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === recordId ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${recordId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        updateRemark: async (recordId, remarkId, text)=>{
            const record = get().records.find((r)=>r.id === recordId);
            if (record) {
                const updatedRecord = {
                    ...record,
                    remarks: record.remarks.map((rem)=>rem.id === remarkId ? {
                            ...rem,
                            text,
                            updatedAt: new Date().toISOString()
                        } : rem)
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === recordId ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${recordId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        deleteRemark: async (recordId, remarkId)=>{
            const record = get().records.find((r)=>r.id === recordId);
            if (record) {
                const updatedRecord = {
                    ...record,
                    remarks: record.remarks.filter((rem)=>rem.id !== remarkId)
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === recordId ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${recordId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        deleteRecord: async (id)=>{
            set((state)=>({
                    records: state.records.filter((r)=>r.id !== id)
                }));
            try {
                await fetch(`/api/records/${id}`, {
                    method: 'DELETE'
                });
            } catch (e) {
                console.error("Sync failed", e);
            }
        },
        deleteRecords: async (ids)=>{
            console.log("store.deleteRecords called with ids:", ids);
            set((state)=>{
                const newRecords = state.records.filter((r)=>!ids.includes(r.id));
                console.log("Records before:", state.records.length, "Records after:", newRecords.length);
                return {
                    records: newRecords
                };
            });
            try {
                await fetch(`/api/records/bulk-delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ids
                    })
                });
            } catch (e) {
                console.error("Sync failed", e);
            }
        },
        addActivityLog: async (recordId, entry)=>{
            const record = get().records.find((r)=>r.id === recordId);
            if (record) {
                const updatedRecord = {
                    ...record,
                    activityLog: [
                        ...record.activityLog,
                        {
                            ...entry,
                            id: `log-${Date.now()}`
                        }
                    ]
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === recordId ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${recordId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        deleteActivityLog: async (recordId, logId)=>{
            const record = get().records.find((r)=>r.id === recordId);
            if (record) {
                const updatedRecord = {
                    ...record,
                    activityLog: record.activityLog.filter((log)=>log.id !== logId)
                };
                set((state)=>({
                        records: state.records.map((r)=>r.id === recordId ? updatedRecord : r)
                    }));
                try {
                    await fetch(`/api/records/${recordId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedRecord)
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        },
        setSearchQuery: (query)=>set({
                searchQuery: query
            }),
        setStatusFilter: (status)=>set({
                statusFilter: status
            }),
        setPartnerFilter: (partner)=>set({
                partnerFilter: partner
            }),
        setLenderFilter: (lender)=>set({
                lenderFilter: lender
            }),
        setDpdGroupFilter: (group)=>set({
                dpdGroupFilter: group
            }),
        setDateRange: (start, end)=>set({
                dateRangeStart: start,
                dateRangeEnd: end
            }),
        setTypeFilter: (type)=>set({
                typeFilter: type
            }),
        setDateFilterType: (type)=>set({
                dateFilterType: type
            }),
        setNpaOnly: (val)=>set({
                npaOnly: val
            }),
        getProtectRecords: ()=>get().records.filter((r)=>r.type === "protect"),
        getSettlementRecords: ()=>get().records.filter((r)=>r.type === "settlement"),
        getNexusRecords: ()=>get().records.filter((r)=>r.type === "nexus"),
        getFilteredProtectRecords: ()=>{
            const { records, searchQuery, statusFilter, partnerFilter, dpdGroupFilter, dateRangeStart, dateRangeEnd } = get();
            return records.filter((r)=>r.type === "protect").filter((r)=>{
                const matchesSearch = searchQuery === "" || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.mobileNumber.includes(searchQuery) || r.accountNumber.includes(searchQuery);
                // Custom Stage Filtering for Protect Page
                let matchesStatus = true;
                if (statusFilter !== "all") {
                    if (statusFilter === "Part Payment" || statusFilter === "Skip EMI") {
                        // Filter by Stage
                        matchesStatus = r.stage === statusFilter;
                    } else {
                        // Filter by Status (standard)
                        matchesStatus = r.status === statusFilter;
                    }
                }
                const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter;
                const matchesLender = get().lenderFilter === "all" || r.institution === get().lenderFilter;
                const matchesDpd = dpdGroupFilter === "all" || r.dpdGroup === dpdGroupFilter;
                let matchesDate = true;
                if (dateRangeStart && dateRangeEnd) {
                    const dateStr = r.nexusPurchaseDate || r.formFilledDate;
                    const recordDate = new Date(dateStr);
                    const start = new Date(dateRangeStart);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(dateRangeEnd);
                    end.setHours(23, 59, 59, 999);
                    matchesDate = recordDate >= start && recordDate <= end;
                }
                return matchesSearch && matchesStatus && matchesPartner && matchesLender && matchesDpd && matchesDate;
            }).sort((a, b)=>new Date(b.formFilledDate).getTime() - new Date(a.formFilledDate).getTime());
        },
        getFilteredSettlementRecords: ()=>{
            const { records, searchQuery, statusFilter, partnerFilter, dateRangeStart, dateRangeEnd } = get();
            return records.filter((r)=>r.type === "settlement").filter((r)=>{
                const matchesSearch = searchQuery === "" || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.mobileNumber.includes(searchQuery) || r.loanAccNo.includes(searchQuery);
                const matchesStatus = statusFilter === "all" || r.status === statusFilter;
                const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter;
                const matchesLender = get().lenderFilter === "all" || r.lenderName === get().lenderFilter;
                let matchesDate = true;
                if (dateRangeStart && dateRangeEnd) {
                    const dateStr = r.createdDate || r.nexusPurchaseDate || r.formFilledDate;
                    const recordDate = new Date(dateStr);
                    const start = new Date(dateRangeStart);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(dateRangeEnd);
                    end.setHours(23, 59, 59, 999);
                    matchesDate = recordDate >= start && recordDate <= end;
                }
                return matchesSearch && matchesStatus && matchesPartner && matchesLender && matchesDate;
            }).sort((a, b)=>new Date(b.createdDate || b.formFilledDate).getTime() - new Date(a.createdDate || a.formFilledDate).getTime());
        },
        getFilteredRecords: ()=>{
            const { records, searchQuery, statusFilter, partnerFilter, lenderFilter, dpdGroupFilter, dateRangeStart, dateRangeEnd, typeFilter, npaOnly } = get();
            return records.filter((r)=>{
                // Type Filter
                if (typeFilter !== "both" && r.type !== typeFilter) return false;
                // Search Filter
                let matchesSearch = false;
                if (r.type === "protect") {
                    const pr = r;
                    matchesSearch = searchQuery === "" || pr.name.toLowerCase().includes(searchQuery.toLowerCase()) || pr.mobileNumber.includes(searchQuery) || pr.accountNumber.includes(searchQuery);
                } else if (r.type === "settlement") {
                    const sr = r;
                    matchesSearch = searchQuery === "" || sr.name.toLowerCase().includes(searchQuery.toLowerCase()) || sr.mobileNumber.includes(searchQuery) || sr.loanAccNo.includes(searchQuery);
                } else if (r.type === "nexus") {
                    const nr = r;
                    matchesSearch = searchQuery === "" || nr.name.toLowerCase().includes(searchQuery.toLowerCase()) || nr.mobileNumber.includes(searchQuery) || nr.email.toLowerCase().includes(searchQuery.toLowerCase()) || nr.userId.toLowerCase().includes(searchQuery.toLowerCase());
                }
                // Common Filters
                const matchesStatus = statusFilter === "all" || r.status === statusFilter;
                // Nexus records might not have partner logic fully fleshed out but we keep it for now
                const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter;
                // Lender Filter
                let matchesLender = true;
                if (lenderFilter !== "all") {
                    if (r.type === "protect") {
                        matchesLender = r.institution === lenderFilter;
                    } else if (r.type === "settlement") {
                        matchesLender = r.lenderName === lenderFilter;
                    } else {
                        // For Nexus or others, assume no match if a lender filter is active
                        matchesLender = false;
                    }
                }
                // DPD Filter (only for protect)
                const matchesDpd = r.type === "protect" ? dpdGroupFilter === "all" || r.dpdGroup === dpdGroupFilter : true;
                let matchesDate = true;
                if (dateRangeStart && dateRangeEnd) {
                    let dateStr = "";
                    if (r.type === "settlement") {
                        dateStr = r.createdDate;
                    } else {
                        dateStr = r.nexusPurchaseDate || r.formFilledDate;
                    }
                    // Fallback for any record if empty
                    if (!dateStr) dateStr = r.nexusPurchaseDate || r.formFilledDate || r.createdDate;
                    const recordDate = new Date(dateStr);
                    const start = new Date(dateRangeStart);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(dateRangeEnd);
                    end.setHours(23, 59, 59, 999);
                    // If date is invalid, it won't match range usually.
                    if (!isNaN(recordDate.getTime())) {
                        matchesDate = recordDate >= start && recordDate <= end;
                    } else {
                        matchesDate = false;
                    }
                }
                // NPA Filter
                let matchesNpa = true;
                if (npaOnly) {
                    if (r.type === "nexus") return false // Nexus records don't have NPA logic yet
                    ;
                    const todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    const todayStr = todayDate.toISOString().split("T")[0];
                    // Safe cast because we checked type is not nexus
                    let referenceDateStr = r.lastPaymentDate;
                    const isDefaultOrMissing = !referenceDateStr || referenceDateStr === todayStr;
                    if (isDefaultOrMissing) {
                        if (r.type === "protect" && r.emiDate && r.emiDate !== todayStr) {
                            referenceDateStr = r.emiDate;
                        } else if (r.type === "settlement" && r.dueDate && r.dueDate !== todayStr) {
                            referenceDateStr = r.dueDate;
                        }
                    }
                    if (referenceDateStr) {
                        const refDate = new Date(referenceDateStr);
                        if (!isNaN(refDate.getTime())) {
                            refDate.setHours(0, 0, 0, 0);
                            const diffTime = todayDate.getTime() - refDate.getTime();
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            matchesNpa = diffDays >= 90;
                        } else {
                            matchesNpa = false;
                        }
                    } else {
                        matchesNpa = false;
                    }
                }
                return matchesSearch && matchesStatus && matchesPartner && matchesLender && matchesDpd && matchesDate && matchesNpa;
            });
        },
        getRecordById: (id)=>get().records.find((r)=>r.id === id),
        hasHydrated: false,
        setHasHydrated: (state)=>set({
                hasHydrated: state
            })
    }), {
    name: "crm-storage-indexeddb",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>storage),
    partialize: (state)=>{
        // Exclude records and uploadHistory from persistence
        const { records, uploadHistory, ...rest } = state;
        return rest;
    },
    onRehydrateStorage: ()=>(state)=>{
            state?.setHasHydrated(true);
        // Fetch records on hydration (or maybe call it explicitly in app)
        // Better to call it in app/layout to control timing and auth, but here works for "on load".
        // However, we can't await here easily.
        }
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth/login-screen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginScreen",
    ()=>LoginScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function LoginScreen() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "LoginScreen.useAuthStore[login]": (state)=>state.login
    }["LoginScreen.useAuthStore[login]"]);
    const handleLogin = async (e)=>{
        e.preventDefault();
        setError("");
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }
            // Login successful
            // We pass the username as email for compatibility with current store interface
            const user = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.username,
                role: data.user.role
            };
            login(user);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "w-full max-w-md shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    className: "space-y-1 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-12 w-12 bg-primary rounded-xl flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "h-6 w-6 text-primary-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/components/auth/login-screen.tsx",
                                    lineNumber: 55,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/auth/login-screen.tsx",
                                lineNumber: 54,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/auth/login-screen.tsx",
                            lineNumber: 53,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "text-2xl font-bold",
                            children: "Welcome back"
                        }, void 0, false, {
                            fileName: "[project]/components/auth/login-screen.tsx",
                            lineNumber: 58,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                            children: "Enter your credentials to access the CRM"
                        }, void 0, false, {
                            fileName: "[project]/components/auth/login-screen.tsx",
                            lineNumber: 59,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/auth/login-screen.tsx",
                    lineNumber: 52,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleLogin,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "email",
                                            children: "User ID"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/login-screen.tsx",
                                            lineNumber: 66,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/auth/login-screen.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "email",
                                                    type: "text",
                                                    placeholder: "Enter User ID",
                                                    className: "pl-9",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/components/auth/login-screen.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/auth/login-screen.tsx",
                                            lineNumber: 67,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/auth/login-screen.tsx",
                                    lineNumber: 65,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "password",
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/login-screen.tsx",
                                            lineNumber: 81,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                    className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/auth/login-screen.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "password",
                                                    type: "password",
                                                    placeholder: "••••••••",
                                                    className: "pl-9",
                                                    value: password,
                                                    onChange: (e)=>setPassword(e.target.value),
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/components/auth/login-screen.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/auth/login-screen.tsx",
                                            lineNumber: 82,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/auth/login-screen.tsx",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-red-500 font-medium text-center",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/components/auth/login-screen.tsx",
                                    lineNumber: 96,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Default Admin: admin / admin123"
                                    }, void 0, false, {
                                        fileName: "[project]/components/auth/login-screen.tsx",
                                        lineNumber: 101,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/auth/login-screen.tsx",
                                    lineNumber: 100,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/auth/login-screen.tsx",
                            lineNumber: 64,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardFooter"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                className: "w-full",
                                children: "Sign In"
                            }, void 0, false, {
                                fileName: "[project]/components/auth/login-screen.tsx",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/auth/login-screen.tsx",
                            lineNumber: 104,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/auth/login-screen.tsx",
                    lineNumber: 63,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/auth/login-screen.tsx",
            lineNumber: 51,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/auth/login-screen.tsx",
        lineNumber: 50,
        columnNumber: 9
    }, this);
}
_s(LoginScreen, "/WHSuERxLuK3s8e59teRjIkv4OI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = LoginScreen;
var _c;
__turbopack_context__.k.register(_c, "LoginScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth/auth-wrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthWrapper",
    ()=>AuthWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$login$2d$screen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth/login-screen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AuthWrapper({ children }) {
    _s();
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "AuthWrapper.useAuthStore[isAuthenticated]": (state)=>state.isAuthenticated
    }["AuthWrapper.useAuthStore[isAuthenticated]"]);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "AuthWrapper.useAuthStore[user]": (state)=>state.user
    }["AuthWrapper.useAuthStore[user]"]);
    const fetchRecords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCRMStore"])({
        "AuthWrapper.useCRMStore[fetchRecords]": (state)=>state.fetchRecords
    }["AuthWrapper.useCRMStore[fetchRecords]"]);
    const fetchUploadHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCRMStore"])({
        "AuthWrapper.useCRMStore[fetchUploadHistory]": (state)=>state.fetchUploadHistory
    }["AuthWrapper.useCRMStore[fetchUploadHistory]"]);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthWrapper.useEffect": ()=>{
            setMounted(true);
        }
    }["AuthWrapper.useEffect"], []);
    // Heartbeat to keep session active
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthWrapper.useEffect": ()=>{
            if (!isAuthenticated || !user?.id) return;
            const sendHeartbeat = {
                "AuthWrapper.useEffect.sendHeartbeat": ()=>{
                    fetch('/api/auth/heartbeat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: user.id
                        })
                    }).catch({
                        "AuthWrapper.useEffect.sendHeartbeat": (e)=>console.error("Heartbeat failed", e)
                    }["AuthWrapper.useEffect.sendHeartbeat"]);
                }
            }["AuthWrapper.useEffect.sendHeartbeat"];
            sendHeartbeat(); // Send immediately
            const interval = setInterval(sendHeartbeat, 60000) // Then every 60s
            ;
            return ({
                "AuthWrapper.useEffect": ()=>clearInterval(interval)
            })["AuthWrapper.useEffect"];
        }
    }["AuthWrapper.useEffect"], [
        isAuthenticated,
        user?.id
    ]);
    // Fetch initial data on auth
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthWrapper.useEffect": ()=>{
            if (isAuthenticated) {
                fetchRecords();
                fetchUploadHistory();
            }
        }
    }["AuthWrapper.useEffect"], [
        isAuthenticated,
        fetchRecords,
        fetchUploadHistory
    ]);
    if (!mounted) {
        return null // Avoid hydration mismatch
        ;
    }
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$login$2d$screen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginScreen"], {}, void 0, false, {
            fileName: "[project]/components/auth/auth-wrapper.tsx",
            lineNumber: 50,
            columnNumber: 16
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthWrapper, "oq8B3R9QKJ1vW9Zkc7tXmcZFeX8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCRMStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCRMStore"]
    ];
});
_c = AuthWrapper;
var _c;
__turbopack_context__.k.register(_c, "AuthWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Toaster = ({ ...props })=>{
    _s();
    const { theme = 'system' } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        theme: theme,
        className: "toaster group",
        style: {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)'
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sonner.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Toaster, "bbCbBsvL7+LiaR8ofHlkcwveh/Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Toaster;
;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_7aa87030._.js.map