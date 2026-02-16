"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ------------------ session helpers ------------------ */
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

/* ------------------ tiny UI: Toast + Confirm + Modal ------------------ */
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
                <div
                    key={t.id}
                    className="rounded-lg border shadow-lg overflow-hidden bg-white border-slate-200 animate-in slide-in-from-right duration-300"
                >
                    <div className="flex items-start gap-3 p-4">
                        <div
                            className={[
                                "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold",
                                t.type === "success"
                                    ? "bg-emerald-500"
                                    : t.type === "error"
                                        ? "bg-red-500"
                                        : t.type === "warning"
                                            ? "bg-amber-500"
                                            : "bg-slate-700",
                            ].join(" ")}
                        >
                            {t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-slate-900 text-sm">{t.title}</p>
                                <button
                                    onClick={() => onClose(t.id)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                    type="button"
                                >
                                    ✕
                                </button>
                            </div>
                            {t.message ? (
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.message}</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ConfirmModal({
    open,
    title,
    desc,
    confirmText = "ยืนยัน",
    cancelText = "ยกเลิก",
    onConfirm,
    onClose,
    danger,
}) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-9998 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-sm rounded-xl bg-white shadow-2xl border border-slate-100 overflow-hidden p-6 animate-in zoom-in-95 duration-200"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    {desc ? <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p> : null}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-sm text-slate-700 transition-all"
                        onClick={onClose}
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        className={[
                            "flex-1 px-4 py-2.5 rounded-lg font-medium text-sm text-white shadow-sm transition-all active:scale-95",
                            danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-black",
                        ].join(" ")}
                        onClick={onConfirm}
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Modal({ open, title, subtitle, children, onClose }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-9997 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                        {subtitle ? <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p> : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar bg-white">{children}</div>
            </div>
        </div>
    );
}

/* ------------------ Inputs (Professional Style) ------------------ */
function FieldShell({ label, hint, right, children }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
                <label className="text-sm font-semibold text-slate-700">
                    {label}
                    {hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}
                </label>
                {right && <div className="shrink-0">{right}</div>}
            </div>
            <div className="">{children}</div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder = "", type = "text", hint, right }) {
    return (
        <FieldShell label={label} hint={hint} right={right}>
            <input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
        </FieldShell>
    );
}

function Textarea({ label, value, onChange, rows = 4, placeholder = "", hint, right }) {
    return (
        <FieldShell label={label} hint={hint} right={right}>
            <textarea
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder || label}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
            />
        </FieldShell>
    );
}

function Select({ label, value, onChange, options, hint, right, disabled }) {
    return (
        <FieldShell label={label} hint={hint} right={right}>
            <div className="relative">
                <select
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
                >
                    {options.map((o) => (
                        <option key={`${o.value}-${o.label}`} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </FieldShell>
    );
}

function Toggle({ label, checked, onChange, desc }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50 transition-all">
            <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                {desc ? <p className="text-xs text-slate-500 mt-0.5">{desc}</p> : null}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? "bg-indigo-600" : "bg-slate-300"}`}
                aria-pressed={checked}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${checked ? "translate-x-6" : "translate-x-1"}`}
                />
            </button>
        </div>
    );
}

function Dropzone({ title, subtitle, disabled, onPick, accept, multiple }) {
    const inputRef = useRef(null);
    return (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all p-6 flex flex-col items-center text-center group cursor-pointer"
            onClick={() => !disabled && inputRef.current?.click()}
        >
            <div className="mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600">{title}</p>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={onPick}
                disabled={disabled}
                className="hidden"
            />
        </div>
    );
}

/* ------------------ small UI bits ------------------ */
function Badge({ tone = "slate", children }) {
    const cls =
        tone === "green"
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : tone === "red"
                ? "bg-red-50 text-red-600 border-red-100"
                : tone === "amber"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : "bg-slate-100 text-slate-600 border-slate-200";
    return <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${cls}`}>{children}</span>;
}

function IconButton({ children, onClick, title, variant = "ghost", disabled }) {
    const cls =
        variant === "danger"
            ? "text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            : variant === "primary"
                ? "bg-slate-900 hover:bg-indigo-600 text-white shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200";
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all active:scale-95 ${disabled ? "opacity-30 cursor-not-allowed" : ""
                } ${cls}`}
        >
            {children}
        </button>
    );
}

/* ------------------ Grid Card (Refined) ------------------ */
function ProductCard({ row, onUp, onDown, onEdit, onDelete }) {
    return (
        <div className="group rounded-xl border border-slate-200 bg-white hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            {/* Image Area */}
            <div className="bg-slate-50 border-b border-slate-100 h-48 flex items-center justify-center relative p-4">
                {row.image_url ? (
                    <img
                        src={resolveUrl(row.image_url)}
                        alt="product"
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="text-slate-300 flex flex-col items-center">
                        <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                    </div>
                )}

                {/* Sort Controls (Visible on Hover) */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={onUp} className="w-7 h-7 bg-white/90 backdrop-blur rounded border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button onClick={onDown} className="w-7 h-7 bg-white/90 backdrop-blur rounded border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex gap-1.5 flex-wrap">
                        {row.is_active ? <Badge tone="green">Online</Badge> : <Badge tone="slate">Hidden</Badge>}
                        <Badge tone="slate">{row.category || "Uncategorized"}</Badge>
                        {row.subcategory && <Badge tone="amber">{row.subcategory}</Badge>}
                    </div>
                </div>

                <div className="flex-1 mb-4">
                    <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-2" title={row.name}>
                        {row.name || "Untitled Product"}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed h-9">
                        {row.description || "No description available."}
                    </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">ID: {row.id}</span>
                    <div className="flex gap-1">
                        <IconButton title="แก้ไข" onClick={onEdit} variant="ghost">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </IconButton>
                        <IconButton variant="danger" title="ลบ" onClick={onDelete}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------ Page ------------------ */
export default function AdminProductsPage() {
    const router = useRouter();
    const { toasts, push, remove } = useToasts();

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingOrder, setSavingOrder] = useState(false);
    const [savingItem, setSavingItem] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [items, setItems] = useState([]);

    // ✅ Store Category Data from API
    const [catList, setCatList] = useState([]);

    // search/filter
    const [q, setQ] = useState("");
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    // ✅ หมวดที่เลือกดู
    const [activeCategory, setActiveCategory] = useState("__ALL__");

    // confirm delete
    const [confirm, setConfirm] = useState({ open: false, id: null });

    // editor modal
    const [editorOpen, setEditorOpen] = useState(false);

    const emptyForm = {
        id: null,
        category: "",
        subcategory: "",
        name: "",
        description: "",
        image_url: "",
        cta_url: "https://lin.ee/twVZIGO",
        is_active: true,
    };
    const [form, setForm] = useState(emptyForm);

    // local order by ids
    const [orderIds, setOrderIds] = useState([]);

    useEffect(() => {
        const t = getToken();
        if (!t) {
            push("error", "กรุณาเข้าสู่ระบบใหม่", "ไม่พบ Token ในเครื่อง");
            setLoading(false);
            router.push("/admin/login");
            return;
        }
        setToken(t);
        // eslint-disable-next-line
    }, [router]);

    const headersAuth = useMemo(() => {
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        };
    }, [token]);

    async function loadData() {
        try {
            setLoading(true);
            // 1. Load Products
            const resProd = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
            const dataProd = await resProd.json();
            const arr = Array.isArray(dataProd) ? dataProd : [];
            setItems(arr);

            const sorted = [...arr].sort((a, b) => {
                const sa = Number(a.sort_order || 0);
                const sb = Number(b.sort_order || 0);
                if (sb !== sa) return sb - sa;
                return Number(b.id || 0) - Number(a.id || 0);
            });
            setOrderIds(sorted.map((x) => x.id));

            // 2. Load Categories
            const resCat = await fetch(`${API_BASE}/api/product-categories`, { cache: "no-store" });
            const dataCat = await resCat.json();
            setCatList(Array.isArray(dataCat) ? dataCat : []);

        } catch (e) {
            console.error(e);
            setItems([]);
            setOrderIds([]);
            push("error", "โหลดไม่สำเร็จ", "ไม่สามารถดึงข้อมูลได้");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        loadData();
        // eslint-disable-next-line
    }, [token]);

    const itemsById = useMemo(() => {
        const m = new Map();
        for (const it of items) m.set(it.id, it);
        return m;
    }, [items]);

    // ✅ Generate Options for Main Category Select (from API Data)
    const categoryOptions = useMemo(() => {
        return [
            { value: "", label: "เลือกหมวดหมู่หลัก" },
            ...catList.map(c => ({ value: c.title, label: c.title }))
        ];
    }, [catList]);

    // ✅ Generate Options for Subcategory Select based on selected Main Category
    const subcategoryOptions = useMemo(() => {
        if (!form.category) return [{ value: "", label: "กรุณาเลือกหมวดหมู่หลักก่อน" }];

        const selectedCat = catList.find(c => c.title === form.category);
        if (!selectedCat || !Array.isArray(selectedCat.subcategories)) {
            return [{ value: "", label: "ไม่มีหมวดหมู่ย่อย" }];
        }

        const subs = selectedCat.subcategories
            .filter(s => s.is_active !== false)
            .map(s => ({ value: s.title, label: s.title }));

        return [{ value: "", label: "เลือกหมวดหมู่ย่อย (ถ้ามี)" }, ...subs];
    }, [form.category, catList]);

    const filteredItems = useMemo(() => {
        const list = orderIds.map((id) => itemsById.get(id)).filter(Boolean);
        const qq = q.trim().toLowerCase();

        return list
            .filter((it) => (showOnlyActive ? !!it.is_active : true))
            .filter((it) => {
                if (activeCategory === "__ALL__") return true;
                return (it.category || "").trim() === activeCategory;
            })
            .filter((it) => {
                if (!qq) return true;
                const hay = `${it.category || ""} ${it.subcategory || ""} ${it.name || ""} ${it.description || ""}`.toLowerCase();
                return hay.includes(qq);
            });
    }, [orderIds, itemsById, q, showOnlyActive, activeCategory]);

    function setField(name, value) {
        setForm((p) => {
            const next = { ...p, [name]: value };
            if (name === "category") {
                next.subcategory = "";
            }
            return next;
        });
    }

    function openCreate() {
        setForm({ ...emptyForm, is_active: true, cta_url: "https://lin.ee/twVZIGO" });
        setEditorOpen(true);
    }

    function openEdit(row) {
        setForm({
            id: row.id,
            category: row.category || "",
            subcategory: row.subcategory || "",
            name: row.name || "",
            description: row.description || "",
            image_url: row.image_url || "",
            cta_url: row.cta_url || "https://lin.ee/twVZIGO",
            is_active: !!row.is_active,
        });
        setEditorOpen(true);
    }

    async function uploadSingle(file) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch(`${API_BASE}/api/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });

        if (res.status === 401) {
            clearSession();
            push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
            router.push("/admin/login");
            return null;
        }

        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Upload failed");
        return json?.url || null;
    }

    async function onUploadImage(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            push("info", "กำลังอัปโหลดรูปสินค้า", file.name, 1400);
            const url = await uploadSingle(file);
            if (!url) return;
            setField("image_url", url);
            push("success", "อัปโหลดสำเร็จ", "ระบบใส่ URL ให้แล้ว");
        } catch (err) {
            push("error", "อัปโหลดไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function onSaveItem() {
        try {
            setSavingItem(true);

            if (!token) {
                clearSession();
                push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
                router.push("/admin/login");
                return;
            }

            const name = form.name.trim();
            const category = form.category.trim();

            if (!category) {
                push("warning", "กรุณาเลือกหมวดหมู่", "เลือกจากรายการ");
                return;
            }
            if (!name) {
                push("warning", "กรุณากรอกชื่อสินค้า", "ช่อง Name ห้ามว่าง");
                return;
            }

            const payload = {
                category,
                subcategory: form.subcategory.trim(),
                name,
                description: form.description.trim(),
                image_url: form.image_url.trim(),
                cta_url: form.cta_url.trim(),
                is_active: !!form.is_active,
            };

            let res;
            if (form.id) {
                res = await fetch(`${API_BASE}/api/products/${form.id}`, {
                    method: "PATCH",
                    headers: headersAuth,
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${API_BASE}/api/products`, {
                    method: "POST",
                    headers: headersAuth,
                    body: JSON.stringify(payload),
                });
            }

            if (res.status === 401) {
                clearSession();
                push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
                router.push("/admin/login");
                return;
            }

            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Save failed");

            push("success", "บันทึกสำเร็จ", form.id ? "อัปเดตสินค้าแล้ว" : "สร้างสินค้าใหม่แล้ว");
            setEditorOpen(false);
            setForm(emptyForm);
            await loadData();
        } catch (err) {
            console.error(err);
            push("error", "บันทึกไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setSavingItem(false);
        }
    }

    function requestDelete(id) {
        setConfirm({ open: true, id });
    }

    async function onDeleteConfirmed() {
        const id = confirm.id;
        setConfirm({ open: false, id: null });
        if (!id) return;

        try {
            const res = await fetch(`${API_BASE}/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                clearSession();
                push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
                router.push("/admin/login");
                return;
            }

            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Delete failed");

            push("success", "ลบสินค้าแล้ว", `ลบ ID: ${id}`);
            await loadData();
        } catch (err) {
            push("error", "ลบไม่สำเร็จ", err?.message || "Unknown error");
        }
    }

    function moveUp(id) {
        setOrderIds((prev) => {
            const idx = prev.indexOf(id);
            if (idx <= 0) return prev;
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
    }
    function moveDown(id) {
        setOrderIds((prev) => {
            const idx = prev.indexOf(id);
            if (idx < 0 || idx >= prev.length - 1) return prev;
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });
    }

    async function saveOrder() {
        if (!token) {
            clearSession();
            push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
            router.push("/admin/login");
            return;
        }

        try {
            setSavingOrder(true);
            push("info", "กำลังบันทึกลำดับ", "โปรดรอสักครู่...", 1400);

            const base = 10000;
            const updates = orderIds.map((id, index) => ({
                id,
                sort_order: base - index,
            }));

            for (const u of updates) {
                const res = await fetch(`${API_BASE}/api/products/${u.id}`, {
                    method: "PATCH",
                    headers: headersAuth,
                    body: JSON.stringify({ sort_order: u.sort_order }),
                });

                if (res.status === 401) {
                    clearSession();
                    push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
                    router.push("/admin/login");
                    return;
                }
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.message || `Save order failed for id ${u.id}`);
                }
            }

            push("success", "บันทึกลำดับสำเร็จ", "หน้าเว็บจะเรียงสินค้าตามลำดับนี้");
            await loadData();
        } catch (err) {
            console.error(err);
            push("error", "บันทึกลำดับไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setSavingOrder(false);
        }
    }

    function logout() {
        clearSession();
        push("success", "ออกจากระบบแล้ว", "", 1200);
        router.push("/admin/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <ToastStack toasts={toasts} onClose={remove} />

            <ConfirmModal
                open={confirm.open}
                danger
                title="ยืนยันการลบสินค้า?"
                desc="รายการที่ถูกลบจะไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?"
                confirmText="ลบสินค้าทันที"
                cancelText="ยกเลิก"
                onClose={() => setConfirm({ open: false, id: null })}
                onConfirm={onDeleteConfirmed}
            />

            <Modal
                open={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setForm(emptyForm);
                }}
                title={form.id ? `แก้ไขสินค้า #${form.id}` : "เพิ่มสินค้าใหม่"}
                subtitle="จัดการข้อมูลสินค้า รูปภาพ และหมวดหมู่"
            >
                <div className="space-y-6">
                    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
                        {/* Image Column */}
                        <div className="space-y-4">
                            <div className="aspect-square rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                                {form.image_url ? (
                                    <img
                                        src={resolveUrl(form.image_url)}
                                        alt="product"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                        <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-xs font-semibold uppercase">No Preview</span>
                                    </div>
                                )}
                            </div>
                            <Dropzone
                                title="อัปโหลดรูปภาพ"
                                subtitle="ไฟล์ .jpg, .png"
                                disabled={uploading}
                                accept="image/*"
                                multiple={false}
                                onPick={onUploadImage}
                            />
                        </div>

                        {/* Form Column */}
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Select
                                    label="หมวดหมู่หลัก"
                                    value={form.category}
                                    onChange={(v) => setField("category", v)}
                                    options={categoryOptions}
                                />
                                <Select
                                    label="หมวดหมู่ย่อย"
                                    value={form.subcategory}
                                    onChange={(v) => setField("subcategory", v)}
                                    options={subcategoryOptions}
                                    disabled={!form.category}
                                />
                            </div>
                            <Input
                                label="ชื่อสินค้า"
                                value={form.name}
                                onChange={(v) => setField("name", v)}
                                placeholder="เช่น กล้องวงจรปิด Hikvision..."
                            />
                            <Input
                                label="ลิงก์ CTA (ปุ่มสั่งซื้อ/สอบถาม)"
                                value={form.cta_url}
                                onChange={(v) => setField("cta_url", v)}
                                placeholder="https://lin.ee/..."
                            />
                            <Textarea
                                label="รายละเอียดสินค้าโดยย่อ"
                                value={form.description}
                                onChange={(v) => setField("description", v)}
                                rows={4}
                                placeholder="รายละเอียดสินค้า..."
                            />
                            <Toggle
                                label="เผยแพร่สินค้านี้"
                                desc="แสดงผลในหน้าแคตตาล็อกทันที"
                                checked={!!form.is_active}
                                onChange={(v) => setField("is_active", v)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            onClick={() => setForm(emptyForm)}
                            className="px-5 py-2.5 rounded-lg text-slate-500 font-medium hover:bg-slate-50 transition-all text-sm"
                            type="button"
                            disabled={savingItem}
                        >
                            ล้างข้อมูล
                        </button>
                        <button
                            onClick={onSaveItem}
                            disabled={savingItem}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm text-white shadow-sm transition-all active:scale-95
                            ${savingItem ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
                        `}
                            type="button"
                        >
                            {savingItem ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-6 px-2 rounded bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center">Admin</span>
                            <span className="text-slate-400 text-sm font-medium">/ Products</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
                        <p className="text-slate-500 mt-1">จัดการรายการสินค้า หมวดหมู่ และการแสดงผล</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={logout} className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm">
                            ออกจากระบบ
                        </button>
                        <button onClick={openCreate} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            เพิ่มสินค้า
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Toolbar Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <input
                                        value={q}
                                        onChange={e => setQ(e.target.value)}
                                        placeholder="ค้นหาชื่อสินค้า, รายละเอียด..."
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    />
                                </div>
                                <div className="w-full sm:w-64">
                                    <select
                                        value={activeCategory}
                                        onChange={e => setActiveCategory(e.target.value)}
                                        className="block w-full py-2.5 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="__ALL__">ทุกหมวดหมู่</option>
                                        {catList.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={showOnlyActive}
                                        onChange={(e) => setShowOnlyActive(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 select-none">แสดงเฉพาะ Online</span>
                                </label>

                                <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>

                                <button
                                    onClick={saveOrder}
                                    disabled={savingOrder || loading}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${savingOrder || loading
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
                                        }`}
                                >
                                    {savingOrder ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            บันทึก
                                        </>
                                    ) : "บันทึกลำดับ"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-slate-300 py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <p className="text-slate-500 font-medium">ไม่พบสินค้า</p>
                            <p className="text-slate-400 text-sm">ลองปรับเงื่อนไขการค้นหา หรือเพิ่มสินค้าใหม่</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map((row) => (
                                <ProductCard
                                    key={row.id}
                                    row={row}
                                    onUp={() => moveUp(row.id)}
                                    onDown={() => moveDown(row.id)}
                                    onEdit={() => openEdit(row)}
                                    onDelete={() => requestDelete(row.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
                    <p>© TJC GROUP Inventory Control System. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}