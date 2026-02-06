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
function safeParseJson(s, fallback) {
    try {
        return JSON.parse(s);
    } catch {
        return fallback;
    }
}

/* ------------------ date helpers ------------------ */
// แปลง YYYY-MM-DD -> ข้อความไทย (พ.ศ.)
function toThaiDateLabel(iso) {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    if (isNaN(d.getTime())) return "";

    const fmt = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // เช่น "วันศุกร์ที่ 9 ม.ค. 2569" หรือ "วันศุกร์ 9 ม.ค. 2569"
    const s = fmt.format(d);
    return s.replace(/^วัน/, "").trim();
}

// แปลง date_label ไทย (พ.ศ.) -> ISO YYYY-MM-DD (แก้ปัญหาแก้ไขแล้ววันที่หาย)
function guessISOFromLabel(label) {
    if (!label) return "";
    const s = String(label).trim();

    // ถ้าเป็น ISO อยู่แล้ว
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // map เดือนภาษาไทย
    const monthMap = {
        "ม.ค.": 1, "ม.ค": 1, "มกราคม": 1,
        "ก.พ.": 2, "ก.พ": 2, "กุมภาพันธ์": 2,
        "มี.ค.": 3, "มี.ค": 3, "มีนาคม": 3,
        "เม.ย.": 4, "เม.ย": 4, "เมษายน": 4,
        "พ.ค.": 5, "พ.ค": 5, "พฤษภาคม": 5,
        "มิ.ย.": 6, "มิ.ย": 6, "มิถุนายน": 6,
        "ก.ค.": 7, "ก.ค": 7, "กรกฎาคม": 7,
        "ส.ค.": 8, "ส.ค": 8, "สิงหาคม": 8,
        "ก.ย.": 9, "ก.ย": 9, "กันยายน": 9,
        "ต.ค.": 10, "ต.ค": 10, "ตุลาคม": 10,
        "พ.ย.": 11, "พ.ย": 11, "พฤศจิกายน": 11,
        "ธ.ค.": 12, "ธ.ค": 12, "ธันวาคม": 12,
    };

    // ตัดคำขึ้นต้นที่มักเจอ เช่น "ศุกร์" หรือ "วันศุกร์ที่"
    const cleaned = s
        .replace(/^วัน/i, "")
        .replace(/ที่/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

    // หา pattern: <day> <month> <year>
    // รองรับ: "9 ม.ค. 2569", "12 ธันวาคม 2568", "อังคาร 9 ธ.ค. 2568"
    const m = cleaned.match(/(\d{1,2})\s+([^\s]+)\s+(\d{4})/);
    if (!m) return "";

    const day = Number(m[1]);
    const monthText = m[2];
    const yearBE = Number(m[3]);
    const month = monthMap[monthText];

    if (!day || !month || !yearBE) return "";

    const yearCE = yearBE - 543;
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${yearCE}-${mm}-${dd}`;
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
        <div className="fixed z-9999 top-4 right-4 space-y-3 w-[92vw] max-w-sm">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="rounded-2xl border shadow-lg overflow-hidden backdrop-blur bg-white/90 animate-[toastIn_.18s_ease-out]"
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
                                            : "bg-slate-700",
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
            className="fixed inset-0 z-9998 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
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
            className="fixed inset-0 z-9997 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
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
function Input({ label, value, onChange, placeholder = "", type = "text", hint }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm
                   focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-300 transition"
            />
            {hint ? <p className="text-xs text-slate-500 mt-2">{hint}</p> : null}
        </label>
    );
}

function Textarea({ label, value, onChange, rows = 4, placeholder = "", hint }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <textarea
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder || label}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm
                   focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-300 transition resize-none"
            />
            {hint ? <p className="text-xs text-slate-500 mt-2">{hint}</p> : null}
        </label>
    );
}

function Toggle({ label, checked, onChange, desc }) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4 bg-white">
            <div className="min-w-0">
                <p className="font-semibold text-slate-800">{label}</p>
                {desc ? <p className="text-sm text-slate-500 mt-1">{desc}</p> : null}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={[
                    "relative inline-flex h-7 w-12 items-center rounded-full transition",
                    checked ? "bg-emerald-600" : "bg-slate-300",
                ].join(" ")}
                aria-pressed={checked}
            >
                <span
                    className={[
                        "inline-block h-5 w-5 transform rounded-full bg-white transition",
                        checked ? "translate-x-6" : "translate-x-1",
                    ].join(" ")}
                />
            </button>
        </div>
    );
}

function Dropzone({ title, subtitle, disabled, onPick, accept, multiple }) {
    const inputRef = useRef(null);
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-linear-to-br from-white to-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
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

/* ------------------ Page ------------------ */
export default function AdminNewsPage() {
    const router = useRouter();
    const { toasts, push, remove } = useToasts();

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingOrder, setSavingOrder] = useState(false);
    const [savingNews, setSavingNews] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [items, setItems] = useState([]);

    // list filter/search
    const [q, setQ] = useState("");
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    // confirm delete
    const [confirm, setConfirm] = useState({ open: false, id: null });

    // editor modal
    const [editorOpen, setEditorOpen] = useState(false);

    const emptyForm = {
        id: null,
        title: "",
        desc1: "",
        desc2: "",
        date_iso: "", // ✅ ใช้ปฏิทิน
        date_label: "", // เก็บไว้ใน DB ตามเดิม
        cover_image_url: "",
        gallery: [],
        is_active: true,
    };
    const [form, setForm] = useState(emptyForm);

    // local order by ids (จัดลำดับจากรายการ)
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

    async function loadNews() {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/news`, { cache: "no-store" });
            const data = await res.json();
            const arr = Array.isArray(data) ? data : [];
            setItems(arr);

            // ตั้งค่า orderIds จาก sort_order (มากก่อน) + id (มากก่อน)
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
            push("error", "โหลดไม่สำเร็จ", "ไม่สามารถดึงข้อมูลข่าวจากเซิร์ฟเวอร์ได้");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        loadNews();
        // eslint-disable-next-line
    }, [token]);

    const itemsById = useMemo(() => {
        const m = new Map();
        for (const it of items) m.set(it.id, it);
        return m;
    }, [items]);

    // แสดงรายการตาม orderIds
    const orderedItems = useMemo(() => {
        const list = orderIds.map((id) => itemsById.get(id)).filter(Boolean);

        const qq = q.trim().toLowerCase();
        return list
            .filter((it) => (showOnlyActive ? !!it.is_active : true))
            .filter((it) => {
                if (!qq) return true;
                const hay = `${it.title || ""} ${it.desc1 || ""} ${it.date_label || ""}`.toLowerCase();
                return hay.includes(qq);
            });
    }, [orderIds, itemsById, q, showOnlyActive]);

    function setField(name, value) {
        setForm((p) => ({ ...p, [name]: value }));
    }

    function openCreate() {
        setForm({ ...emptyForm, is_active: true });
        setEditorOpen(true);
        push("info", "เพิ่มข่าวใหม่", "กรอกข้อมูลแล้วกดบันทึก", 1800);
    }

    function openEdit(row) {
        const gallery =
            Array.isArray(row.gallery)
                ? row.gallery
                : typeof row.gallery === "string"
                    ? safeParseJson(row.gallery, [])
                    : [];

        // ✅ สำคัญ: กู้ ISO จาก date_label ไทย (พ.ศ.) ได้จริง
        const iso = guessISOFromLabel(row.date_label || "");

        setForm({
            id: row.id,
            title: row.title || "",
            desc1: row.desc1 || "",
            desc2: row.desc2 || "",
            date_iso: iso || "",              // ✅ ไม่หายแล้ว (ถ้า label อยู่ในรูปแบบที่รองรับ)
            date_label: row.date_label || "",
            cover_image_url: row.cover_image_url || "",
            gallery,
            is_active: !!row.is_active,
        });

        setEditorOpen(true);
        push("info", "แก้ไขข่าว", `กำลังแก้ไข ID: ${row.id}`, 1800);
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

    async function uploadMulti(files) {
        const fd = new FormData();
        for (const f of files) fd.append("files", f);

        const res = await fetch(`${API_BASE}/api/upload/multi`, {
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
        return Array.isArray(json?.urls) ? json.urls : [];
    }

    async function onUploadCover(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            push("info", "กำลังอัปโหลดรูปปก", file.name, 1600);
            const url = await uploadSingle(file);
            if (!url) return;
            setField("cover_image_url", url);
            push("success", "อัปโหลดรูปปกสำเร็จ", "ระบบใส่ URL ให้แล้ว");
        } catch (err) {
            push("error", "อัปโหลดรูปปกไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function onUploadGallery(e) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        try {
            setUploading(true);
            push("info", "กำลังอัปโหลด Gallery", `จำนวน ${files.length} รูป`, 1600);
            const urls = await uploadMulti(files);
            if (!urls) return;
            setField("gallery", [...(form.gallery || []), ...urls]);
            push("success", "อัปโหลด Gallery สำเร็จ", `เพิ่ม ${urls.length} รูป`);
        } catch (err) {
            push("error", "อัปโหลด Gallery ไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    function removeGalleryIndex(idx) {
        setField(
            "gallery",
            (form.gallery || []).filter((_, i) => i !== idx)
        );
        push("info", "ลบรูปจาก Gallery", `ลบรูปที่ ${idx + 1} แล้ว`, 1600);
    }

    async function onSaveNews() {
        try {
            setSavingNews(true);

            if (!token) {
                clearSession();
                push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
                router.push("/admin/login");
                return;
            }

            const title = form.title.trim();
            if (!title) {
                push("warning", "กรุณากรอกหัวข้อข่าว", "ช่อง Title ห้ามว่าง");
                return;
            }
            if (!form.date_iso) {
                push("warning", "กรุณาเลือกวันที่", "เลือกจากปฏิทิน");
                return;
            }

            // ✅ สร้าง date_label จาก date_iso แล้วส่งเก็บ DB เหมือนเดิม
            const date_label = toThaiDateLabel(form.date_iso) || form.date_iso;

            const payload = {
                title,
                desc1: form.desc1.trim(),
                desc2: form.desc2.trim(),
                date_label,
                cover_image_url: form.cover_image_url.trim(),
                gallery: form.gallery || [],
                is_active: !!form.is_active,
            };

            let res;
            if (form.id) {
                res = await fetch(`${API_BASE}/api/news/${form.id}`, {
                    method: "PATCH",
                    headers: headersAuth,
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${API_BASE}/api/news`, {
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

            push("success", "บันทึกสำเร็จ", form.id ? "อัปเดตข่าวแล้ว" : "สร้างข่าวใหม่แล้ว");
            setEditorOpen(false);
            setForm(emptyForm);
            await loadNews();
        } catch (err) {
            console.error(err);
            push("error", "บันทึกไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setSavingNews(false);
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
            const res = await fetch(`${API_BASE}/api/news/${id}`, {
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

            push("success", "ลบข่าวสำเร็จ", `ลบ ID: ${id}`);
            await loadNews();
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

    // บันทึกลำดับ -> map เป็น sort_order สูงสุดก่อน
    async function saveOrder() {
        if (!token) {
            clearSession();
            push("error", "Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
            router.push("/admin/login");
            return;
        }

        try {
            setSavingOrder(true);
            push("info", "กำลังบันทึกลำดับ", "โปรดรอสักครู่...", 1500);

            // ค่ามากอยู่บนสุด: 10000, 9999, ...
            const base = 10000;
            const updates = orderIds.map((id, index) => ({
                id,
                sort_order: base - index,
            }));

            for (const u of updates) {
                const res = await fetch(`${API_BASE}/api/news/${u.id}`, {
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

            push("success", "บันทึกลำดับสำเร็จ", "หน้าเว็บจะเรียงตามลำดับที่ตั้งไว้");
            await loadNews();
        } catch (err) {
            console.error(err);
            push("error", "บันทึกลำดับไม่สำเร็จ", err?.message || "Unknown error");
        } finally {
            setSavingOrder(false);
        }
    }

    function logout() {
        clearSession();
        push("success", "ออกจากระบบแล้ว", "", 1500);
        router.push("/admin/login");
    }

    return (
        <>
            <ToastStack toasts={toasts} onClose={remove} />

            <ConfirmModal
                open={confirm.open}
                danger
                title="ลบข่าวนี้ใช่ไหม?"
                desc="การลบจะไม่สามารถกู้คืนได้"
                confirmText="ลบข่าว"
                cancelText="ยกเลิก"
                onClose={() => setConfirm({ open: false, id: null })}
                onConfirm={onDeleteConfirmed}
            />

            {/* ✅ ฟอร์มเป็นป๊อปอัพ */}
            <Modal
                open={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setForm(emptyForm);
                }}
                title={form.id ? `แก้ไขข่าว #${form.id}` : "เพิ่มข่าวใหม่"}
                subtitle="เลือกวันที่จากปฏิทิน + อัปโหลดรูป + บันทึก"
            >
                <div className="space-y-5">
                    <Input
                        label="วันที่ (ปฏิทิน)"
                        type="date"
                        value={form.date_iso}
                        onChange={(v) => setField("date_iso", v)}
                        hint={form.date_iso ? `แสดงบนเว็บเป็น: ${toThaiDateLabel(form.date_iso)}` : "เลือกวันที่จากปฏิทิน"}
                    />

                    <Textarea
                        label="หัวข้อข่าว (title)"
                        value={form.title}
                        onChange={(v) => setField("title", v)}
                        rows={2}
                        placeholder="พาดหัวข่าว"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <Textarea
                            label="รายละเอียด (desc1)"
                            value={form.desc1}
                            onChange={(v) => setField("desc1", v)}
                            rows={6}
                            placeholder="รายละเอียดหลัก"
                        />
                        <Textarea
                            label="รายละเอียดเพิ่มเติม (desc2)"
                            value={form.desc2}
                            onChange={(v) => setField("desc2", v)}
                            rows={6}
                            placeholder="ถ้ามีหลายย่อหน้า ใส่เพิ่มได้"
                        />
                    </div>

                    {/* cover */}
                    <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-4">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
                            <div className="aspect-16/10 w-full bg-slate-100">
                                {form.cover_image_url ? (
                                    <img src={resolveUrl(form.cover_image_url)} alt="cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                                        ยังไม่มีรูปปก
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-semibold text-slate-800">รูปปก</p>
                                <p className="text-xs text-slate-500 mt-1">แนะนำ 1200×800 หรือใกล้เคียง</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Dropzone
                                title="อัปโหลดรูปปก"
                                subtitle="ไฟล์ .jpg/.png — ระบบคืนค่า /uploads/xxx.jpg"
                                disabled={uploading}
                                accept="image/*"
                                multiple={false}
                                onPick={onUploadCover}
                            />
                            <Input
                                label="หรือใส่ URL รูปปกเอง"
                                value={form.cover_image_url}
                                onChange={(v) => setField("cover_image_url", v)}
                                placeholder="/uploads/xxx.png หรือ https://..."
                            />
                        </div>
                    </div>

                    {/* gallery */}
                    <div className="space-y-3">
                        <Dropzone
                            title="อัปโหลด Gallery (หลายรูป)"
                            subtitle="เลือกได้หลายรูป ระบบจะเก็บเป็น array ใน DB"
                            disabled={uploading}
                            accept="image/*"
                            multiple
                            onPick={onUploadGallery}
                        />

                        {Array.isArray(form.gallery) && form.gallery.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {form.gallery.map((u, idx) => (
                                    <div key={idx} className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                                        <img src={resolveUrl(u)} alt={`g-${idx}`} className="w-full h-28 object-cover" />
                                        <button
                                            onClick={() => removeGalleryIndex(idx)}
                                            className="absolute top-2 right-2 rounded-full bg-black/60 hover:bg-black text-white text-xs px-3 py-1"
                                            type="button"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                                ยังไม่มีรูปใน Gallery
                            </div>
                        )}
                    </div>

                    <Toggle
                        label="แสดงบนหน้าเว็บ"
                        desc="ถ้าปิด จะยังเก็บในระบบ แต่ไม่แสดงฝั่งหน้าเว็บ"
                        checked={!!form.is_active}
                        onChange={(v) => setField("is_active", v)}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                        <button
                            onClick={() => setForm(emptyForm)}
                            className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm"
                            type="button"
                            disabled={savingNews}
                        >
                            ล้างฟอร์ม
                        </button>
                        <button
                            onClick={onSaveNews}
                            disabled={savingNews}
                            className={[
                                "px-5 py-3 rounded-2xl font-semibold text-sm text-white shadow-sm",
                                savingNews ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800",
                            ].join(" ")}
                            type="button"
                        >
                            {savingNews ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
                {/* topbar */}
                <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-500">Admin Panel</p>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
                                จัดการข่าวประชาสัมพันธ์
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href="/#news"
                                target="_blank"
                                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
                            >
                                ดูหน้าเว็บจริง ↗
                            </a>
                            <button
                                onClick={openCreate}
                                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm"
                                type="button"
                            >
                                + เพิ่มข่าว
                            </button>
                            <button
                                onClick={logout}
                                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
                                type="button"
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                    {/* toolbar */}
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
                        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-end">
                            <Input
                                label="ค้นหา"
                                value={q}
                                onChange={setQ}
                                placeholder="ค้นหาจากหัวข้อ/รายละเอียด/วันที่"
                            />

                            <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white">
                                <input
                                    type="checkbox"
                                    checked={showOnlyActive}
                                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-semibold text-slate-700">แสดงเฉพาะที่เปิด</span>
                            </label>

                            <button
                                onClick={saveOrder}
                                disabled={savingOrder || loading}
                                className={[
                                    "px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-sm",
                                    savingOrder || loading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700",
                                ].join(" ")}
                                type="button"
                                title="บันทึกลำดับข่าว (จะอัปเดต sort_order อัตโนมัติ)"
                            >
                                {savingOrder ? "กำลังบันทึกลำดับ..." : "บันทึกลำดับ"}
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-3">
                            ✅ จัดลำดับข่าวด้วยปุ่ม ↑ ↓ ในรายการ แล้วกด “บันทึกลำดับ”
                        </p>
                    </div>

                    {/* list */}
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-slate-900">รายการข่าว</h2>
                                <p className="text-sm text-slate-600 mt-1">คลิก “แก้ไข” เพื่อเปิดป๊อปอัพ</p>
                            </div>
                            <button
                                onClick={loadNews}
                                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
                                type="button"
                            >
                                รีเฟรช
                            </button>
                        </div>

                        <div className="p-5">
                            {loading ? (
                                <div className="py-16 text-center text-slate-500 animate-pulse">กำลังโหลด...</div>
                            ) : orderedItems.length === 0 ? (
                                <div className="py-16 text-center text-slate-500">ไม่พบข่าว</div>
                            ) : (
                                <div className="space-y-3">
                                    {orderedItems.map((row) => (
                                        <div
                                            key={row.id}
                                            className="group rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition overflow-hidden"
                                        >
                                            <div className="p-4 flex gap-4 items-start">
                                                <div className="w-28 h-20 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0">
                                                    {row.cover_image_url ? (
                                                        <img
                                                            src={resolveUrl(row.cover_image_url)}
                                                            alt="cover"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                                                            {row.date_label || "-"}
                                                        </span>
                                                        {!row.is_active ? (
                                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                                                                ซ่อน
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                                                แสดง
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-2 font-extrabold text-slate-900 line-clamp-2">
                                                        {row.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{row.desc1}</p>
                                                </div>

                                                <div className="flex flex-col gap-2 items-end">
                                                    {/* ปุ่มจัดลำดับ */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => moveUp(row.id)}
                                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold"
                                                            type="button"
                                                            title="เลื่อนขึ้น"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            onClick={() => moveDown(row.id)}
                                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold"
                                                            type="button"
                                                            title="เลื่อนลง"
                                                        >
                                                            ↓
                                                        </button>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEdit(row)}
                                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold"
                                                            type="button"
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button
                                                            onClick={() => requestDelete(row.id)}
                                                            className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
                                                            type="button"
                                                        >
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-4 pb-4">
                                                <div className="h-px bg-slate-100" />
                                                <div className="mt-3 text-xs text-slate-500 flex items-center justify-between gap-2">
                                                    <span>ID: {row.id}</span>
                                                    <span className="truncate">
                                                        Gallery:{" "}
                                                        {Array.isArray(row.gallery)
                                                            ? row.gallery.length
                                                            : typeof row.gallery === "string"
                                                                ? safeParseJson(row.gallery, []).length
                                                                : 0}{" "}
                                                        รูป
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 text-center pb-10">
                        API: <span className="font-mono">{API_BASE}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
