"use client";

import React, { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- 🟢 1. Auth Helpers ---
function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
}

function setToken(t) {
    if (typeof window === "undefined") return;
    if (!t) localStorage.removeItem("token");
    else localStorage.setItem("token", t);
}

// --- 2. API Helper ---
async function apiFetch(path, { method = "GET", token = "", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = { message: text }; }
    if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
    return json;
}

// --- 🔔 Toast (Professional) ---
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-100 flex flex-col gap-3">
            {toasts.map((t) => (
                <div key={t.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border bg-white animate-in slide-in-from-right duration-300 ${t.type === "success" ? "border-emerald-100" : "border-red-100"
                    }`} style={{ minWidth: "300px", maxWidth: "400px" }}>
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${t.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                        {t.type === "success" ? "✓" : "!"}
                    </div>
                    <div className={`flex-1 text-sm font-medium ${t.type === "success" ? "text-emerald-800" : "text-red-800"}`}>{t.msg}</div>
                    <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                </div>
            ))}
        </div>
    );
}

// --- 🗨️ Confirmation Dialog ---
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "ยืนยัน", cancelText = "ยกเลิก", type = "danger" }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${type === "danger" ? "bg-red-50 text-red-500" : "bg-indigo-50 text-indigo-500"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 text-center mb-1">{title}</h3>
                <p className="text-slate-500 text-center mb-6 text-sm">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-all text-sm">ยกเลิก</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 px-4 py-2 font-medium rounded-lg shadow-sm transition-all text-sm ${type === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}

// --- Status Badge ---
function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${active
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-50 text-slate-500 border-slate-200"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
            {active ? "Active" : "Inactive"}
        </span>
    );
}

// --- Section Shell ---
function SectionShell({ title, subtitle, children, right }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
                {right}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// --- 📂 SubCategory Manager ---
function SubCategoryManager({ parentId, subcategories = [], onUpdate, disabled, showConfirm }) {
    const [newSub, setNewSub] = useState("");
    const [localSubs, setLocalSubs] = useState(() => Array.isArray(subcategories) ? subcategories : []);
    useEffect(() => { setLocalSubs(Array.isArray(subcategories) ? subcategories : []); }, [subcategories]);

    const handleAdd = () => {
        if (!newSub.trim()) return;
        const updated = [...localSubs, { title: newSub.trim(), is_active: true }];
        setLocalSubs(updated); onUpdate(updated); setNewSub("");
    };

    return (
        <div className="mt-4 ml-6 pl-6 border-l border-slate-200">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Subcategories</h4>
            <div className="space-y-2 mb-3">
                {localSubs.map((sub, idx) => (
                    <div key={idx} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                        <input
                            className="flex-1 text-sm font-medium bg-transparent outline-none text-slate-700 placeholder-slate-400"
                            value={sub.title}
                            onChange={(e) => {
                                const u = [...localSubs]; u[idx].title = e.target.value; setLocalSubs(u);
                            }}
                            onBlur={() => onUpdate(localSubs)}
                            disabled={disabled}
                        />
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    const u = [...localSubs]; u[idx].is_active = !u[idx].is_active; setLocalSubs(u); onUpdate(u);
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${sub.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                            >
                                {sub.is_active ? "On" : "Off"}
                            </button>
                            <button
                                onClick={() => {
                                    showConfirm({
                                        title: "ลบรายการย่อย?", message: `ยืนยันลบ "${localSubs[idx].title}"?`, onConfirm: () => {
                                            const u = localSubs.filter((_, i) => i !== idx); setLocalSubs(u); onUpdate(u);
                                        }
                                    });
                                }}
                                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
                {localSubs.length === 0 && <p className="text-sm text-slate-400 italic py-1">ไม่มีรายการย่อย</p>}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="เพิ่มรายการย่อย..."
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <button onClick={handleAdd} className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm">เพิ่ม</button>
            </div>
        </div>
    );
}

// --- 🛍️ Product Category Editor ---
function ProductListEditor({ title, subtitle, endpoint, token, rows, loading, error, onNeedReload, notify }) {
    const [newTitle, setNewTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const [localRows, setLocalRows] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

    useEffect(() => { if (rows) setLocalRows(rows); }, [rows]);

    const handlePatch = async (id, patch) => {
        try {
            setLocalRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
            await apiFetch(`/api/${endpoint}/${id}`, { method: "PATCH", token, body: patch });
        } catch { onNeedReload?.(); }
    };

    const handleSort = async (index, dir) => {
        const target = index + dir;
        if (target < 0 || target >= localRows.length) return;
        const itemA = localRows[index]; const itemB = localRows[target];
        const newRows = [...localRows];
        newRows[index] = { ...itemB, sort_order: itemA.sort_order };
        newRows[target] = { ...itemA, sort_order: itemB.sort_order };
        setLocalRows(newRows);
        try {
            await Promise.all([
                apiFetch(`/api/${endpoint}/${itemA.id}`, { method: "PATCH", token, body: { sort_order: itemB.sort_order } }),
                apiFetch(`/api/${endpoint}/${itemB.id}`, { method: "PATCH", token, body: { sort_order: itemA.sort_order } })
            ]);
            onNeedReload?.();
        } catch { onNeedReload?.(); }
    };

    return (
        <>
            <ConfirmDialog {...confirmDialog} onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
            <SectionShell title={title} subtitle={subtitle} right={<span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">{localRows.length} Categories</span>}>
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                            placeholder="สร้างหมวดหมู่ใหม่..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (async () => {
                                if (!newTitle.trim()) return; setSaving(true);
                                try {
                                    const maxSort = localRows.length > 0 ? Math.max(...localRows.map(r => r.sort_order || 0)) : 0;
                                    await apiFetch(`/api/${endpoint}`, { method: "POST", token, body: { title: newTitle.trim(), is_active: true, subcategories: [], sort_order: maxSort + 1 } });
                                    setNewTitle(""); onNeedReload?.();
                                } catch { notify?.("error", "Error"); } finally { setSaving(false); }
                            })()}
                        />
                    </div>
                    <button
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={saving}
                        onClick={async () => {
                            if (!newTitle.trim()) return; setSaving(true);
                            try {
                                const maxSort = localRows.length > 0 ? Math.max(...localRows.map(r => r.sort_order || 0)) : 0;
                                await apiFetch(`/api/${endpoint}`, { method: "POST", token, body: { title: newTitle.trim(), is_active: true, subcategories: [], sort_order: maxSort + 1 } });
                                setNewTitle(""); onNeedReload?.();
                            } catch { notify?.("error", "Error"); } finally { setSaving(false); }
                        }}
                    >
                        {saving ? "Creating..." : "Create"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                    {localRows.map((r, idx) => {
                        const isExpanded = expandedIds.includes(r.id);
                        let subs = []; try { subs = (typeof r.subcategories === "string" ? JSON.parse(r.subcategories) : r.subcategories) || []; } catch { subs = []; }
                        return (
                            <div key={r.id} className={`bg-white rounded-xl border transition-all duration-200 ${isExpanded ? "border-indigo-300 ring-4 ring-indigo-50 shadow-lg" : "border-slate-200 hover:border-indigo-200 hover:shadow-md"}`}>
                                <div className="p-4 flex gap-3">
                                    <div className="flex flex-col gap-1 pt-1">
                                        <button onClick={() => handleSort(idx, -1)} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 disabled:opacity-30">▲</button>
                                        <button onClick={() => handleSort(idx, 1)} disabled={idx === localRows.length - 1} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 disabled:opacity-30">▼</button>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            className="w-full text-base font-bold text-slate-800 bg-transparent outline-none focus:text-indigo-700 transition-colors"
                                            defaultValue={r.title}
                                            onBlur={(e) => e.target.value !== r.title && handlePatch(r.id, { title: e.target.value })}
                                        />
                                        <div className="flex items-center gap-3 mt-2">
                                            <StatusBadge active={r.is_active} />
                                            <span className="text-xs text-slate-400 font-medium">{subs.length} subcategories</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handlePatch(r.id, { is_active: !r.is_active })}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${r.is_active ? "bg-emerald-500" : "bg-slate-200"}`}
                                            >
                                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${r.is_active ? "translate-x-4.5" : "translate-x-1"}`} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1 mt-auto">
                                            <button
                                                onClick={() => setExpandedIds(i => isExpanded ? i.filter(x => x !== r.id) : [...i, r.id])}
                                                className={`p-1.5 rounded-lg transition-colors ${isExpanded ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"}`}
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                            <button
                                                onClick={() => setConfirmDialog({ isOpen: true, title: "ลบหมวดหมู่?", message: `ยืนยันการลบ "${r.title}"?`, onConfirm: async () => { await apiFetch(`/api/${endpoint}/${r.id}`, { method: "DELETE", token }); onNeedReload(); } })}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="px-4 pb-4">
                                        <SubCategoryManager parentId={r.id} subcategories={subs} disabled={!token} onUpdate={(v) => handlePatch(r.id, { subcategories: v })} showConfirm={(c) => setConfirmDialog({ ...c, isOpen: true })} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </SectionShell>
        </>
    );
}

// --- 🛠️ Simple List Editor (Services) ---
function SimpleListEditor({ title, subtitle, endpoint, token, rows, loading, error, onNeedReload, notify }) {
    const [newTitle, setNewTitle] = useState("");
    const [localRows, setLocalRows] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
    useEffect(() => { if (rows) setLocalRows(rows); }, [rows]);

    const handlePatch = async (id, patch) => {
        try {
            setLocalRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
            await apiFetch(`/api/${endpoint}/${id}`, { method: "PATCH", token, body: patch });
        } catch { onNeedReload?.(); }
    };

    const handleSort = async (index, dir) => {
        const target = index + dir; if (target < 0 || target >= localRows.length) return;
        const itemA = localRows[index]; const itemB = localRows[target];
        const newRows = [...localRows];
        newRows[index] = { ...itemB, sort_order: itemA.sort_order }; newRows[target] = { ...itemA, sort_order: itemB.sort_order };
        setLocalRows(newRows);
        try {
            await Promise.all([
                apiFetch(`/api/${endpoint}/${itemA.id}`, { method: "PATCH", token, body: { sort_order: itemB.sort_order } }),
                apiFetch(`/api/${endpoint}/${itemB.id}`, { method: "PATCH", token, body: { sort_order: itemA.sort_order } })
            ]);
            onNeedReload?.();
        } catch { onNeedReload?.(); }
    };

    return (
        <>
            <ConfirmDialog {...confirmDialog} onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
            <SectionShell title={title} subtitle={subtitle} right={<span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">{localRows.length} Services</span>}>
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                            placeholder="เพิ่มบริการใหม่..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (async () => {
                                if (!newTitle.trim()) return;
                                const maxSort = localRows.length > 0 ? Math.max(...localRows.map(r => r.sort_order || 0)) : 0;
                                await apiFetch(`/api/${endpoint}`, { method: "POST", token, body: { title: newTitle.trim(), is_active: true, sort_order: maxSort + 1 } });
                                setNewTitle(""); onNeedReload?.();
                            })()}
                        />
                    </div>
                    <button className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm">Add Service</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {localRows.map((r, idx) => (
                        <div key={r.id} className="bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                                <button onClick={() => handleSort(idx, -1)} disabled={idx === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-30"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg></button>
                                <button onClick={() => handleSort(idx, 1)} disabled={idx === localRows.length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-30"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <input
                                    className="w-full font-bold text-slate-800 bg-transparent outline-none truncate text-sm focus:text-indigo-700"
                                    defaultValue={r.title}
                                    onBlur={(e) => e.target.value !== r.title && handlePatch(r.id, { title: e.target.value })}
                                />
                                <div className="mt-1">
                                    <StatusBadge active={r.is_active} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handlePatch(r.id, { is_active: !r.is_active })}
                                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${r.is_active ? "bg-emerald-500" : "bg-slate-200"}`}
                                >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${r.is_active ? "translate-x-3.5" : "translate-x-0.5"}`} />
                                </button>
                                <button
                                    onClick={() => setConfirmDialog({ isOpen: true, title: "ลบ?", message: `ลบ "${r.title}"?`, onConfirm: async () => { await apiFetch(`/api/${endpoint}/${r.id}`, { method: "DELETE", token }); onNeedReload(); } })}
                                    className="text-slate-300 hover:text-red-500 flex justify-end"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionShell>
        </>
    );
}

// --- 🏗️ Main Page ---
export default function AdminMenuPage() {
    const [token, setTokenState] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [prodCats, setProdCats] = useState([]); const [svcCats, setSvcCats] = useState([]);
    const [loading, setLoading] = useState(false); const [toasts, setToasts] = useState([]);

    const addToast = (type, msg) => {
        const id = Date.now(); setToasts((prev) => [...prev, { id, type, msg }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [p, s] = await Promise.all([apiFetch(`/api/product-categories`), apiFetch(`/api/service-categories`)]);
                setProdCats(Array.isArray(p) ? p : []); setSvcCats(Array.isArray(s) ? s : []);
            } catch { addToast("error", "Error loading data"); } finally { setLoading(false); }
        };
        load();
    }, [reloadKey]);

    useEffect(() => { setTokenState(getToken()); }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">ADMIN</span>
                        <span className="text-slate-400 text-sm">/ Site Configuration</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Categories & Menus</h1>
                    <p className="text-slate-500 mt-1">จัดการหมวดหมู่สินค้า เมนูย่อย และรายการบริการ</p>
                </div>

                <div className="grid gap-10">
                    <ProductListEditor title="Product Categories" subtitle="หมวดหมู่สินค้าและเมนูย่อย" endpoint="product-categories" token={token} rows={prodCats} loading={loading} onNeedReload={() => setReloadKey(k => k + 1)} notify={addToast} />
                    <SimpleListEditor title="Services & Installation" subtitle="รายการบริการและงานติดตั้ง" endpoint="service-categories" token={token} rows={svcCats} loading={loading} onNeedReload={() => setReloadKey(k => k + 1)} notify={addToast} />
                </div>
            </div>
        </div>
    );
}