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
        <div className="fixed z-[9999] top-4 right-4 space-y-3 w-[92vw] max-w-sm">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="rounded-2xl border border-slate-200 shadow-xl overflow-hidden backdrop-blur bg-white/90 animate-[toastIn_.18s_ease-out]"
                >
                    <div className="flex items-start gap-3 p-4">
                        <div
                            className={[
                                "mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0",
                                t.type === "success"
                                    ? "bg-emerald-600"
                                    : t.type === "error"
                                        ? "bg-rose-600"
                                        : t.type === "warning"
                                            ? "bg-amber-500"
                                            : "bg-slate-800",
                            ].join(" ")}
                            aria-hidden
                        >
                            {t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-slate-900 truncate">{t.title}</p>
                                <button
                                    onClick={() => onClose(t.id)}
                                    className="rounded-full hover:bg-slate-100 p-1 text-slate-500"
                                    type="button"
                                    aria-label="Close toast"
                                >
                                    ✕
                                </button>
                            </div>
                            {t.message ? (
                                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{t.message}</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            ))}

            <style jsx global>{`
        @keyframes toastIn {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `}</style>
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
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    {desc ? <p className="text-sm text-slate-600 mt-2 leading-relaxed">{desc}</p> : null}
                </div>

                <div className="px-6 pb-6 flex gap-3 justify-end">
                    <button
                        className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-sm"
                        onClick={onClose}
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        className={[
                            "px-4 py-2 rounded-xl font-semibold text-sm text-white",
                            danger ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-slate-800",
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
            className="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{title}</h2>
                        {subtitle ? <p className="text-sm text-slate-600 mt-1">{subtitle}</p> : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full hover:bg-slate-100 p-2 text-slate-500"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

/* ------------------ Inputs ------------------ */
function FieldShell({ label, hint, right, children }) {
    return (
        <div>
            <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>
            <div className="mt-2">{children}</div>
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm
          focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-300 transition"
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm
          focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-300 transition resize-none"
            />
        </FieldShell>
    );
}

function Select({ label, value, onChange, options, hint, right }) {
    return (
        <FieldShell label={label} hint={hint} right={right}>
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm
          focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-300 transition"
            >
                {options.map((o) => (
                    <option key={`${o.value}-${o.label}`} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </FieldShell>
    );
}

function Toggle({ label, checked, onChange, desc }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
                <p className="font-semibold text-slate-900">{label}</p>
                {desc ? <p className="text-sm text-slate-600 mt-1">{desc}</p> : null}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={[
                    "relative inline-flex h-8 w-14 items-center rounded-full transition",
                    checked ? "bg-emerald-600" : "bg-slate-300",
                ].join(" ")}
                aria-pressed={checked}
            >
                <span
                    className={[
                        "inline-block h-6 w-6 transform rounded-full bg-white transition shadow",
                        checked ? "translate-x-7" : "translate-x-1",
                    ].join(" ")}
                />
            </button>
        </div>
    );
}

function Dropzone({ title, subtitle, disabled, onPick, accept, multiple }) {
    const inputRef = useRef(null);
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
                </div>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                    className={[
                        "px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border",
                        disabled
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800",
                    ].join(" ")}
                >
                    เลือกรูป
                </button>
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
            ? "bg-emerald-100 text-emerald-800"
            : tone === "red"
                ? "bg-rose-100 text-rose-800"
                : tone === "amber"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-800";
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{children}</span>;
}

function Chip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "px-3 py-2 rounded-2xl text-sm font-semibold border transition",
                active
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function IconButton({ children, onClick, title, variant = "ghost", disabled }) {
    const cls =
        variant === "danger"
            ? "bg-rose-600 hover:bg-rose-700 text-white"
            : variant === "primary"
                ? "bg-slate-900 hover:bg-slate-800 text-white"
                : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200";
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`h-10 px-3 rounded-2xl text-sm font-semibold shadow-sm transition ${disabled ? "opacity-60 cursor-not-allowed" : ""
                } ${cls}`}
        >
            {children}
        </button>
    );
}

/* ------------------ Grid Card ------------------ */
function ProductCard({ row, onUp, onDown, onEdit, onDelete }) {
    return (
        <div className="group rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-4 flex flex-col h-full">
                <div className="rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden h-40 flex items-center justify-center">
                    {row.image_url ? (
                        <img
                            src={resolveUrl(row.image_url)}
                            alt="product"
                            className="w-full h-full object-contain p-3"
                        />
                    ) : (
                        <span className="text-xs text-slate-400">No Image</span>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex gap-2 flex-wrap">
                        <Badge tone="slate">{row.category || "-"}</Badge>
                        {row.is_active ? <Badge tone="green">แสดง</Badge> : <Badge tone="red">ซ่อน</Badge>}
                    </div>
                    <span className="text-xs text-slate-400">ID: {row.id}</span>
                </div>

                <p className="mt-3 font-extrabold text-slate-900 line-clamp-2 min-h-3">
                    {row.name || "-"}
                </p>

                {/* ✅ ตัด 4 บรรทัด + ... (ต้องมี line-clamp plugin) */}
                <p className="mt-1 text-sm text-slate-600 line-clamp-4 break-all min-h-21">
                    {row.description || ""}
                </p>

                <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                    <div className="flex gap-2">
                        <IconButton title="เลื่อนขึ้น" onClick={onUp}>↑</IconButton>
                        <IconButton title="เลื่อนลง" onClick={onDown}>↓</IconButton>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <IconButton title="แก้ไข" onClick={onEdit}>แก้ไข</IconButton>
                        <IconButton variant="danger" title="ลบ" onClick={onDelete}>ลบ</IconButton>
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

    // search/filter
    const [q, setQ] = useState("");
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    // ✅ หมวดที่เลือกดู
    const [activeCategory, setActiveCategory] = useState("__ALL__");

    // confirm delete
    const [confirm, setConfirm] = useState({ open: false, id: null });

    // editor modal
    const [editorOpen, setEditorOpen] = useState(false);

    const categoryOptions = [
        { value: "", label: "เลือกหมวดหมู่" },
        { value: "ครุภัณฑ์ทางการศึกษา", label: "ครุภัณฑ์ทางการศึกษา" },
        { value: "สินค้าไอที และคอมพิวเตอร์", label: "สินค้าไอที และคอมพิวเตอร์" },
        { value: "ระบบเครือข่าย และโครงสร้างพื้นฐาน IT", label: "ระบบเครือข่าย และโครงสร้างพื้นฐาน IT" },
        { value: "ระบบกล้องวงจรปิด (CCTV & Security)", label: "ระบบกล้องวงจรปิด (CCTV & Security)" },
        { value: "จอ LED และระบบแสดงผล", label: "จอ LED และระบบแสดงผล" },
        { value: "ระบบไอทีครบวงจร (Solution & Services)", label: "ระบบไอทีครบวงจร (Solution & Services)" },
        { value: "สินค้าและอุปกรณ์อื่น ๆ", label: "สินค้าและอุปกรณ์อื่น ๆ" },
    ];

    const emptyForm = {
        id: null,
        category: "",
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

    async function loadItems() {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
            const data = await res.json();
            const arr = Array.isArray(data) ? data : [];
            setItems(arr);

            const sorted = [...arr].sort((a, b) => {
                const sa = Number(a.sort_order || 0);
                const sb = Number(b.sort_order || 0);
                if (sb !== sa) return sb - sa;
                return Number(b.id || 0) - Number(a.id || 0);
            });
            setOrderIds(sorted.map((x) => x.id));
        } catch (e) {
            console.error(e);
            setItems([]);
            setOrderIds([]);
            push("error", "โหลดไม่สำเร็จ", "ไม่สามารถดึงข้อมูลสินค้าได้");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        loadItems();
        // eslint-disable-next-line
    }, [token]);

    const itemsById = useMemo(() => {
        const m = new Map();
        for (const it of items) m.set(it.id, it);
        return m;
    }, [items]);

    // ✅ หมวดที่มีของจริง (ทำชิป)
    const availableCategories = useMemo(() => {
        const set = new Set(items.map((x) => (x.category || "").trim()).filter(Boolean));
        const ordered = categoryOptions.map((c) => c.value).filter((v) => v && set.has(v));
        const rest = [...set].filter((c) => !ordered.includes(c)).sort((a, b) => a.localeCompare(b, "th"));
        return [...ordered, ...rest];
    }, [items, categoryOptions]);

    // ✅ list แบบไม่แยกหัวข้อหมวด (Grid เดียว)
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
                const hay = `${it.category || ""} ${it.name || ""} ${it.description || ""}`.toLowerCase();
                return hay.includes(qq);
            });
    }, [orderIds, itemsById, q, showOnlyActive, activeCategory]);

    function setField(name, value) {
        setForm((p) => ({ ...p, [name]: value }));
    }

    function openCreate() {
        setForm({ ...emptyForm, is_active: true, cta_url: "https://lin.ee/twVZIGO" });
        setEditorOpen(true);
        push("info", "เพิ่มสินค้าใหม่", "กรอกข้อมูลแล้วกดบันทึก", 1600);
    }

    function openEdit(row) {
        setForm({
            id: row.id,
            category: row.category || "",
            name: row.name || "",
            description: row.description || "",
            image_url: row.image_url || "",
            cta_url: row.cta_url || "https://lin.ee/twVZIGO",
            is_active: !!row.is_active,
        });
        setEditorOpen(true);
        push("info", "แก้ไขสินค้า", `กำลังแก้ไข ID: ${row.id}`, 1600);
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
            await loadItems();
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
            await loadItems();
        } catch (err) {
            push("error", "ลบไม่สำเร็จ", err?.message || "Unknown error");
        }
    }

    // ---- reorder actions (↑ ↓) ----
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
            await loadItems();
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
        <>
            <ToastStack toasts={toasts} onClose={remove} />

            <ConfirmModal
                open={confirm.open}
                danger
                title="ลบสินค้านี้ใช่ไหม?"
                desc="การลบจะไม่สามารถกู้คืนได้"
                confirmText="ลบสินค้า"
                cancelText="ยกเลิก"
                onClose={() => setConfirm({ open: false, id: null })}
                onConfirm={onDeleteConfirmed}
            />

            {/* ✅ ฟอร์มสินค้าเป็นป๊อปอัพ */}
            <Modal
                open={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setForm(emptyForm);
                }}
                title={form.id ? `แก้ไขสินค้า #${form.id}` : "เพิ่มสินค้าใหม่"}
                subtitle="เลือกหมวดหมู่ + ใส่ชื่อ/รายละเอียด + ใส่รูปทีหลังได้"
            >
                <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Select
                            label="หมวดหมู่"
                            value={form.category}
                            onChange={(v) => setField("category", v)}
                            options={categoryOptions}
                        />
                        <Input
                            label="ลิงก์ปุ่มสอบถาม"
                            value={form.cta_url}
                            onChange={(v) => setField("cta_url", v)}
                            placeholder="https://lin.ee/..."
                        />
                    </div>

                    <Input label="ชื่อสินค้า" value={form.name} onChange={(v) => setField("name", v)} />

                    <Textarea
                        label="รายละเอียดสินค้า"
                        value={form.description}
                        onChange={(v) => setField("description", v)}
                        rows={5}
                    />

                    <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
                            <div className="aspect-[16/10] w-full bg-slate-100 flex items-center justify-center">
                                {form.image_url ? (
                                    <img
                                        src={resolveUrl(form.image_url)}
                                        alt="product"
                                        className="w-full h-full object-contain p-6"
                                    />
                                ) : (
                                    <div className="text-sm text-slate-400">ยังไม่มีรูปสินค้า (ใส่ทีหลังได้)</div>
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-semibold text-slate-900">รูปสินค้า</p>
                                <p className="text-xs text-slate-500 mt-1">ถ้ายังไม่พร้อม ปล่อยว่างได้</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Dropzone
                                title="อัปโหลดรูปสินค้า"
                                subtitle="ไฟล์ .jpg/.png — ระบบคืนค่า /uploads/xxx.png"
                                disabled={uploading}
                                accept="image/*"
                                multiple={false}
                                onPick={onUploadImage}
                            />

                            <Input
                                label="หรือใส่ URL รูปเอง"
                                value={form.image_url}
                                onChange={(v) => setField("image_url", v)}
                                placeholder="/uploads/xxx.png หรือ https://..."
                                hint="ปล่อยว่างได้"
                            />
                        </div>
                    </div>

                    <Toggle
                        label="แสดงบนหน้าเว็บ"
                        desc="ปิดไว้ได้ หากต้องการซ่อนไว้ก่อน"
                        checked={!!form.is_active}
                        onChange={(v) => setField("is_active", v)}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                        <button
                            onClick={() => setForm(emptyForm)}
                            className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm"
                            type="button"
                            disabled={savingItem}
                        >
                            ล้างฟอร์ม
                        </button>
                        <button
                            onClick={onSaveItem}
                            disabled={savingItem}
                            className={[
                                "px-5 py-3 rounded-2xl font-semibold text-sm text-white shadow-sm",
                                savingItem ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800",
                            ].join(" ")}
                            type="button"
                        >
                            {savingItem ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ------------------ modern layout ------------------ */}
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* topbar */}
                <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-500">Admin Panel</p>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
                                จัดการสินค้า
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <IconButton variant="primary" title="เพิ่มสินค้า" onClick={openCreate}>
                                + เพิ่มสินค้า
                            </IconButton>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                    {/* toolbar */}
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                        <div className="grid lg:grid-cols-[1fr_280px_auto] gap-3 items-end">
                            <Input
                                label="ค้นหา"
                                value={q}
                                onChange={setQ}
                                placeholder="ค้นหาจากหมวดหมู่ / ชื่อ / รายละเอียด"
                            />

                            <Select
                                label="ดูหมวดหมู่"
                                value={activeCategory}
                                onChange={setActiveCategory}
                                options={[
                                    { value: "__ALL__", label: "ทั้งหมด" },
                                    ...availableCategories.map((c) => ({ value: c, label: c })),
                                ]}
                            />

                            <IconButton
                                variant="primary"
                                title="บันทึกลำดับ"
                                onClick={saveOrder}
                                disabled={savingOrder || loading}
                            >
                                {savingOrder ? "กำลังบันทึก..." : "บันทึกลำดับ"}
                            </IconButton>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 items-center justify-between text-xs text-slate-500">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showOnlyActive}
                                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="font-semibold">แสดงเฉพาะที่เปิด</span>
                            </label>
                        </div>
                    </div>

                    {/* ✅ แสดงเป็น GRID เดียว (ไม่แยกหมวดด้านล่างแล้ว) */}
                    {loading ? (
                        <div className="py-16 text-center text-slate-500 animate-pulse">กำลังโหลด...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">ไม่พบสินค้า</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
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

                    <div className="text-xs text-slate-500 text-center pb-10">© TJC Admin • Products</div>
                </div>
            </div>
        </>
    );
}
