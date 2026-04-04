"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ------------------ 1. Helper Functions ------------------ */
function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
}
function clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
function resolveUrl(u) {
    if (!u) return "";
    if (u.startsWith("/uploads/") || u.startsWith("uploads/")) {
        const cleanPath = u.startsWith("/") ? u : `/${u}`;
        return `${API_BASE}${cleanPath}`;
    }
    return u;
}

/* ------------------ 2. UI Components (Toast, Modal, Inputs) ------------------ */
function useToasts() {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    function remove(id) {
        setToasts((p) => p.filter((t) => t.id !== id));
        const tm = timers.current.get(id);
        if (tm) clearTimeout(tm);
        timers.current.delete(id);
    }

    function push(type, title, message, ms = 2800) {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const t = { id, type, title, message };
        setToasts((p) => [t, ...p].slice(0, 5));

        const tm = setTimeout(() => remove(id), ms);
        timers.current.set(id, tm);
        return id;
    }

    return { toasts, push, remove };
}

function ToastStack({ toasts, onClose }) {
    return (
        <div className="fixed z-9999 top-6 right-6 space-y-3 w-[92vw] max-w-sm">
            {toasts.map((t) => (
                <div key={t.id} className="rounded-lg border shadow-lg overflow-hidden bg-white border-slate-200 animate-in slide-in-from-right duration-300">
                    <div className="flex items-start gap-3 p-4">
                        <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : t.type === "warning" ? "bg-amber-500" : "bg-slate-700"}`}>
                            {t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-slate-900 text-sm">{t.title}</p>
                                <button onClick={() => onClose(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors" type="button">✕</button>
                            </div>
                            {t.message && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.message}</p>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ConfirmModal({ open, title, desc, confirmText = "ยืนยัน", cancelText = "ยกเลิก", onConfirm, onClose, danger }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-9998 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onMouseDown={onClose}>
            <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl border border-slate-100 overflow-hidden p-6 animate-in zoom-in-95 duration-200" onMouseDown={(e) => e.stopPropagation()}>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    {desc && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>}
                </div>
                <div className="mt-6 flex gap-3">
                    <button className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-sm text-slate-700 transition-all" onClick={onClose} type="button">{cancelText}</button>
                    <button className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm text-white shadow-sm transition-all active:scale-95 ${danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-black"}`} onClick={onConfirm} type="button">{confirmText}</button>
                </div>
            </div>
        </div>
    );
}

function GlobalLinkModal({ open, link, onClose, onSave, saving }) {
    const [val, setVal] = useState(link || "");
    useEffect(() => { setVal(link || ""); }, [link, open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-9998 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onMouseDown={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col" onMouseDown={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-slate-800">ตั้งค่าลิงก์สั่งซื้อหลัก</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">
                        ลิงก์นี้จะถูกใช้เป็นปุ่ม "สั่งซื้อ/สอบถาม" สำหรับสินค้า<b>ทุกชิ้น</b>ในเว็บไซต์ (เช่น ลิงก์ LINE OA หรือ Facebook Inbox)
                    </p>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">ลิงก์ (URL)</label>
                        <input
                            type="text"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            placeholder="https://lin.ee/..."
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-white border border-transparent hover:border-slate-200 text-sm font-medium transition-all">ยกเลิก</button>
                    <button
                        onClick={() => onSave(val)}
                        disabled={saving}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm hover:bg-indigo-700 disabled:bg-slate-400 transition-all"
                    >
                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Modal({ open, title, subtitle, children, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-9997 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
            <div className="w-full max-w-6xl rounded-2xl bg-slate-50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]" onMouseDown={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all">✕</button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
            </div>
        </div>
    );
}

function FieldShell({ label, hint, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">
                {label}
                {hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}
            </label>
            <div>{children}</div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder = "", type = "text", hint }) {
    return (
        <FieldShell label={label} hint={hint}>
            <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
        </FieldShell>
    );
}

function Textarea({ label, value, onChange, rows = 3, placeholder = "", hint }) {
    return (
        <FieldShell label={label} hint={hint}>
            <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none" />
        </FieldShell>
    );
}

function Select({ label, value, onChange, options, disabled }) {
    return (
        <FieldShell label={label}>
            <div className="relative">
                <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={`w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}>
                    {options.map((o) => <option key={`${o.value}-${o.label}`} value={o.value}>{o.label}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
            </div>
        </FieldShell>
    );
}

function Toggle({ label, checked, onChange, desc }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                {desc && <p className="text-xs text-slate-500">{desc}</p>}
            </div>
            <button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? "bg-emerald-500" : "bg-slate-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${checked ? "translate-x-6" : "translate-x-1"}`} />
            </button>
        </div>
    );
}

function Dropzone({ disabled, onPick, accept }) {
    const inputRef = useRef(null);
    return (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-white hover:border-indigo-400 transition-all p-6 flex flex-col items-center text-center cursor-pointer group h-full justify-center" onClick={() => !disabled && inputRef.current?.click()}>
            <div className="mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="font-semibold text-slate-600 text-xs group-hover:text-indigo-600">คลิกเพื่ออัปโหลดรูป</p>
            <input ref={inputRef} type="file" accept={accept} onChange={onPick} disabled={disabled} className="hidden" />
        </div>
    );
}

/* ------------------ 3. Product Card ------------------ */
function ProductCard({ row, onUp, onDown, onEdit, onDelete }) {
    return (
        <div className="group rounded-xl border border-slate-200 bg-white hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 h-48 flex items-center justify-center relative p-4">
                {row.image_url ? (
                    <img src={resolveUrl(row.image_url)} alt="product" className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="text-slate-300 flex flex-col items-center"><svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-[10px] font-bold uppercase tracking-wider">No Image</span></div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={onUp} className="w-7 h-7 bg-white/90 backdrop-blur rounded border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                    <button onClick={onDown} className="w-7 h-7 bg-white/90 backdrop-blur rounded border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex gap-1.5 flex-wrap mb-2">
                    {row.is_active ? <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-200">ONLINE</span> : <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold border border-slate-200">HIDDEN</span>}
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-bold border border-slate-200">{row.category}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-1" title={row.name}>{row.name}</h3>
                <div className="flex-1">
                    {Array.isArray(row.specifications) && row.specifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {row.specifications.slice(0, 3).map((s, i) => <span key={i} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">{s.label}: {s.value}</span>)}
                            {row.specifications.length > 3 && <span className="text-[10px] text-slate-400 px-1">+{row.specifications.length - 3}</span>}
                        </div>
                    )}
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">ID: {row.id}</span>
                    <div className="flex gap-1">
                        <button title="แก้ไข" onClick={onEdit} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button title="ลบ" onClick={onDelete} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------ 4. Main Page ------------------ */
export default function AdminProductsPage() {
    const router = useRouter();
    const { toasts, push, remove } = useToasts();
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingItem, setSavingItem] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [items, setItems] = useState([]);
    const [catList, setCatList] = useState([]);

    // Global Link State
    const [globalLink, setGlobalLink] = useState("");
    const [contactData, setContactData] = useState({});
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [savingLink, setSavingLink] = useState(false);

    const [q, setQ] = useState("");
    const [showOnlyActive, setShowOnlyActive] = useState(false);
    const [activeCategory, setActiveCategory] = useState("__ALL__");
    const [confirm, setConfirm] = useState({ open: false, id: null });
    const [editorOpen, setEditorOpen] = useState(false);

    // Initial Form State
    const emptyForm = {
        id: null,
        category: "",
        subcategory: "",
        name: "",
        description: "",
        image_url: "",
        is_active: true,
        specifications: []
    };
    const [form, setForm] = useState(emptyForm);
    const [orderIds, setOrderIds] = useState([]);

    // ✅ Expanded Common Specs for IT, CCTV, Furniture
    const commonSpecs = [
        "ยี่ห้อ", "รุ่น", "การรับประกัน",
        "ขนาด", "วัสดุ", "สี",
        "CPU", "RAM", "SSD/HDD", "OS", "Display",
        "ความละเอียด", "เลนส์", "ระยะอินฟราเรด", "กันน้ำ",
        "กำลังวัตต์", "ความสว่าง", "Input/Output"
    ];

    useEffect(() => {
        const t = getToken();
        if (!t) { router.push("/admin/login"); return; }
        setToken(t);
    }, [router]);

    const headersAuth = useMemo(() => ({ "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" }), [token]);

    async function loadData() {
        try {
            setLoading(true);
            const [resProd, resCat, resContact] = await Promise.all([
                fetch(`${API_BASE}/api/products`, { cache: "no-store" }),
                fetch(`${API_BASE}/api/product-categories`, { cache: "no-store" }),
                fetch(`${API_BASE}/api/site/contact`, { cache: "no-store", headers: { Authorization: `Bearer ${token}` } })
            ]);
            const dataProd = await resProd.json();
            const dataCat = await resCat.json();
            const dataContact = await resContact.json();

            const arr = Array.isArray(dataProd) ? dataProd : [];
            setItems(arr);
            const sorted = [...arr].sort((a, b) => (Number(b.sort_order || 0) - Number(a.sort_order || 0)) || (Number(b.id || 0) - Number(a.id || 0)));
            setOrderIds(sorted.map((x) => x.id));
            setCatList(Array.isArray(dataCat) ? dataCat : []);

            // Set Global Link
            const cData = dataContact?.data || {};
            setContactData(cData);
            setGlobalLink(cData.line_url || "");

        } catch (e) { push("error", "โหลดไม่สำเร็จ", "ไม่สามารถดึงข้อมูลได้"); } finally { setLoading(false); }
    }

    useEffect(() => { if (token) loadData(); }, [token]);

    const itemsById = useMemo(() => { const m = new Map(); for (const it of items) m.set(it.id, it); return m; }, [items]);
    const categoryOptions = useMemo(() => [{ value: "", label: "เลือกหมวดหมู่หลัก" }, ...catList.map(c => ({ value: c.title, label: c.title }))], [catList]);
    const subcategoryOptions = useMemo(() => {
        if (!form.category) return [{ value: "", label: "เลือกหมวดหมู่หลักก่อน" }];
        const subs = catList.find(c => c.title === form.category)?.subcategories?.filter(s => s.is_active !== false) || [];
        return [{ value: "", label: "เลือกหมวดหมู่ย่อย (ถ้ามี)" }, ...subs.map(s => ({ value: s.title, label: s.title }))];
    }, [form.category, catList]);

    const filteredItems = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return orderIds.map(id => itemsById.get(id)).filter(Boolean)
            .filter(it => !showOnlyActive || it.is_active)
            .filter(it => activeCategory === "__ALL__" || (it.category || "").trim() === activeCategory)
            .filter(it => !qq || `${it.category} ${it.subcategory} ${it.name} ${it.description}`.toLowerCase().includes(qq));
    }, [orderIds, itemsById, q, showOnlyActive, activeCategory]);

    const setField = (name, value) => setForm(p => ({ ...p, [name]: value, ...(name === "category" ? { subcategory: "" } : {}) }));
    const updateSpec = (idx, key, val) => { const next = [...(form.specifications || [])]; next[idx][key] = val; setForm(p => ({ ...p, specifications: next })); };

    async function onUploadImage(e) {
        const file = e.target.files?.[0]; if (!file) return;
        try {
            setUploading(true);
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
            if (res.status === 401) { router.push("/admin/login"); return; }
            const json = await res.json();
            if (res.ok && json.url) { setField("image_url", json.url); push("success", "อัปโหลดสำเร็จ"); }
        } catch { push("error", "อัปโหลดไม่สำเร็จ"); } finally { setUploading(false); e.target.value = ""; }
    }

    async function onSaveItem() {
        if (!form.category || !form.name.trim()) return push("warning", "กรุณากรอกข้อมูล", "หมวดหมู่และชื่อสินค้าห้ามว่าง");

        try {
            setSavingItem(true);
            // ✅ เปลี่ยนการเช็คให้ปลอดภัยขึ้น ป้องกันไม่ให้ error (.map/.filter is not a function)
            const safeSpecs = Array.isArray(form.specifications) ? form.specifications : [];
            const cleanSpecs = safeSpecs.filter(s => s.label.trim() || s.value.trim());

            // ดึง id ออกมาแยกไว้ ป้องกัน Backend นำไปอัปเดตทับ Primary Key
            const { id, ...restForm } = form;

            const payload = {
                ...restForm,
                name: form.name.trim(),
                // ✅ บังคับแปลง Array ให้เป็น JSON String ก่อนส่ง
                specifications: JSON.stringify(cleanSpecs)
            };

            const method = form.id ? "PATCH" : "POST";
            const url = form.id ? `${API_BASE}/api/products/${form.id}` : `${API_BASE}/api/products`;

            const res = await fetch(url, {
                method,
                headers: headersAuth,
                body: JSON.stringify(payload)
            });

            if (res.status === 401) { router.push("/admin/login"); return; }
            if (!res.ok) throw new Error("Backend error");

            push("success", "บันทึกสำเร็จ");
            setEditorOpen(false);
            loadData();
        } catch (err) {
            push("error", "บันทึกไม่สำเร็จ", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSavingItem(false);
        }
    }

    async function onSaveGlobalLink(newLink) {
        try {
            setSavingLink(true);
            const updatedData = { ...contactData, line_url: newLink };
            const res = await fetch(`${API_BASE}/api/site/contact`, {
                method: "PUT",
                headers: headersAuth,
                body: JSON.stringify({ data: updatedData })
            });
            if (res.ok) {
                setGlobalLink(newLink);
                setContactData(updatedData);
                push("success", "บันทึกลิงก์หลักแล้ว");
                setLinkModalOpen(false);
            } else {
                throw new Error();
            }
        } catch {
            push("error", "บันทึกไม่สำเร็จ");
        } finally {
            setSavingLink(false);
        }
    }

    async function onDeleteConfirmed() {
        if (!confirm.id) return;
        try {
            await fetch(`${API_BASE}/api/products/${confirm.id}`, { method: "DELETE", headers: headersAuth });
            push("success", "ลบสินค้าแล้ว"); loadData();
        } catch { push("error", "ลบไม่สำเร็จ"); } finally { setConfirm({ open: false, id: null }); }
    }

    const moveItem = (id, dir) => {
        setOrderIds(prev => {
            const idx = prev.indexOf(id);
            if (idx < 0 || (dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];
            [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
            return next;
        });
    };

    async function saveOrder() {
        try {
            const base = 10000;
            await Promise.all(orderIds.map((id, i) => fetch(`${API_BASE}/api/products/${id}`, { method: "PATCH", headers: headersAuth, body: JSON.stringify({ sort_order: base - i }) })));
            push("success", "บันทึกลำดับสำเร็จ"); loadData();
        } catch { push("error", "บันทึกลำดับไม่สำเร็จ"); }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <ToastStack toasts={toasts} onClose={remove} />
            <ConfirmModal open={confirm.open} danger title="ลบสินค้า?" desc="ไม่สามารถกู้คืนได้" confirmText="ลบเลย" onClose={() => setConfirm({ open: false, id: null })} onConfirm={onDeleteConfirmed} />

            {/* ✅ Modal ตั้งค่า Global Link */}
            <GlobalLinkModal
                open={linkModalOpen}
                link={globalLink}
                onClose={() => setLinkModalOpen(false)}
                onSave={onSaveGlobalLink}
                saving={savingLink}
            />

            {/* ✅ MODAL เพิ่มสินค้า (Layout ใหม่) */}
            <Modal open={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}>
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* 📷 LEFT: Image & Status */}
                    <div className="w-full lg:w-72 space-y-5 shrink-0">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 block">รูปภาพสินค้า</label>
                            <div className="aspect-square rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2 relative shadow-sm">
                                {form.image_url ? <img src={resolveUrl(form.image_url)} className="w-full h-full object-contain" /> : <div className="text-slate-300 text-xs font-bold uppercase">No Image</div>}
                            </div>
                            <Dropzone title="อัปโหลดรูป" disabled={uploading} accept="image/*" onPick={onUploadImage} />
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                            <Toggle label="เปิดใช้งาน (Active)" desc="แสดงสินค้าบนหน้าเว็บ" checked={!!form.is_active} onChange={(v) => setField("is_active", v)} />
                        </div>
                    </div>

                    {/* 📝 RIGHT: Form Data */}
                    <div className="flex-1 w-full space-y-6">

                        {/* 1. หมวดหมู่ & ชื่อ */}
                        <div className="space-y-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm relative">
                            <div className="absolute top-5 left-0 w-1 h-6 bg-indigo-500 rounded-r"></div>
                            <h3 className="text-sm font-bold text-slate-800 pl-3">ข้อมูลพื้นฐาน</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Select label="หมวดหมู่หลัก" value={form.category} onChange={(v) => setField("category", v)} options={categoryOptions} />
                                <Select label="หมวดหมู่ย่อย" value={form.subcategory} onChange={(v) => setField("subcategory", v)} options={subcategoryOptions} disabled={!form.category} />
                            </div>
                            <Input label="ชื่อสินค้า" value={form.name} onChange={(v) => setField("name", v)} placeholder="เช่น กล้องวงจรปิด รุ่น..." />
                        </div>


                        {/* 3. สเปกสินค้า */}
                        <div className="space-y-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm relative">
                            <div className="absolute top-5 left-0 w-1 h-6 bg-indigo-500 rounded-r"></div>
                            <div className="pl-3">
                                <h3 className="text-sm font-bold text-slate-800 mb-2">สเปกสินค้า (Specifications)</h3>
                                {/* ✅ Wrap Quick Add Buttons */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="text-[10px] text-slate-400 self-center mr-1">เพิ่มด่วน:</span>
                                    {commonSpecs.map((s) => (
                                        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, specifications: Array.isArray(p.specifications) ? [...p.specifications, { label: s, value: "" }] : [{ label: s, value: "" }] }))} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {/* ✅ เช็ค Array เสมอก่อน map เพื่อป้องกัน Error */}
                                {Array.isArray(form.specifications) && form.specifications.map((spec, i) => (
                                    <div key={i} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                                        <div className="w-1/3"><input type="text" placeholder="หัวข้อ" value={spec.label} onChange={(e) => updateSpec(i, 'label', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors" /></div>
                                        <div className="flex-1"><input type="text" placeholder="รายละเอียด" value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors" /></div>
                                        <button type="button" onClick={() => setForm(p => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }))} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                    </div>
                                ))}
                                {(!Array.isArray(form.specifications) || form.specifications.length === 0) && <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">ยังไม่มีสเปกสินค้า</div>}
                            </div>
                            <button type="button" onClick={() => setForm(p => ({ ...p, specifications: Array.isArray(p.specifications) ? [...p.specifications, { label: "", value: "" }] : [{ label: "", value: "" }] }))} className="w-full py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-1 mt-2">
                                + เพิ่มรายการเอง (ว่าง)
                            </button>
                        </div>
                        {/* 2. รายละเอียด */}
                        <div className="space-y-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm relative">
                            <div className="absolute top-5 left-0 w-1 h-6 bg-indigo-500 rounded-r"></div>
                            <h3 className="text-sm font-bold text-slate-800 pl-3">รายละเอียดสินค้า</h3>
                            <Textarea label="รายละเอียดโดยย่อ" value={form.description} onChange={(v) => setField("description", v)} rows={3} />
                            <div className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded border border-slate-100 flex items-center gap-2">
                                <span className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">i</span>
                                ลิงก์สั่งซื้อจะใช้ลิงก์หลักที่ตั้งค่าไว้ (Global Link) โดยอัตโนมัติ
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end gap-3">
                            <button onClick={() => { setEditorOpen(false); setForm(emptyForm); }} className="px-5 py-2.5 rounded-lg text-slate-500 font-medium hover:bg-slate-100 transition-all text-sm" type="button">ยกเลิก</button>
                            <button onClick={onSaveItem} disabled={savingItem} className={`px-8 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 ${savingItem ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5"}`} type="button">
                                {savingItem ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2"><span className="h-6 px-2 rounded bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center">Admin</span><span className="text-slate-400 text-sm font-medium">/ Products</span></div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
                        <p className="text-slate-500 mt-1">จัดการรายการสินค้า หมวดหมู่ และการแสดงผล</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { clearSession(); router.push("/admin/login"); }} className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">ออกจากระบบ</button>
                        {/* ✅ ปุ่มตั้งค่า Global Link */}
                        <button onClick={() => setLinkModalOpen(true)} className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            ตั้งค่าลิงก์หลัก
                        </button>
                        <button onClick={() => { setForm({ ...emptyForm }); setEditorOpen(true); }} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>เพิ่มสินค้า</button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาชื่อสินค้า..." className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm transition-all" />
                                </div>
                                <div className="w-full sm:w-64">
                                    <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)} className="block w-full py-2.5 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                        <option value="__ALL__">ทุกหมวดหมู่</option>
                                        {catList.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={showOnlyActive} onChange={(e) => setShowOnlyActive(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 select-none">แสดงเฉพาะ Online</span>
                                </label>
                                <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>
                                <button onClick={saveOrder} disabled={loading} className="px-4 py-2 rounded-lg font-semibold text-sm bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-all">บันทึกลำดับ</button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>กำลังโหลด...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-slate-300 py-20 text-center"><p className="text-slate-500 font-medium">ไม่พบสินค้า</p></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map(row => (
                              
                                <ProductCard key={row.id} row={row} onUp={() => moveItem(row.id, -1)} onDown={() => moveItem(row.id, 1)} onEdit={() => { 
                                    let parsedSpecs = [];
                                    if (Array.isArray(row.specifications)) parsedSpecs = row.specifications;
                                    else if (typeof row.specifications === 'string') {
                                        try { parsedSpecs = JSON.parse(row.specifications || '[]'); } catch(e) {}
                                    }
                                    setForm({ ...row, specifications: parsedSpecs }); 
                                    setEditorOpen(true); 
                                }} onDelete={() => setConfirm({ open: true, id: row.id })} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}