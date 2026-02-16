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

    const s = fmt.format(d);
    return s.replace(/^วัน/, "").trim();
}

function guessISOFromLabel(label) {
    if (!label) return "";
    const s = String(label).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

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

    const cleaned = s
        .replace(/^วัน/i, "")
        .replace(/ที่/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

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

/* ------------------ StatusBadge ------------------ */
function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${active
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-50 text-slate-500 border-slate-200"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
            {active ? "Published" : "Draft"}
        </span>
    );
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
                <div key={t.id} className="rounded-lg border shadow-lg overflow-hidden bg-white border-slate-200 animate-in slide-in-from-right duration-300">
                    <div className="flex items-start gap-3 p-4">
                        <div className={[
                            "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-white shrink-0 text-[10px] font-bold",
                            t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-rose-600" : t.type === "warning" ? "bg-amber-500" : "bg-slate-600",
                        ].join(" ")}>
                            {t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-slate-900 text-sm">{t.title}</p>
                                <button onClick={() => onClose(t.id)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            {t.message && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.message}</p>}
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
        <div className="fixed inset-0 z-9998 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onMouseDown={onClose}>
            <div className="w-full max-w-sm rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden p-6 animate-in zoom-in-95 duration-200" onMouseDown={(e) => e.stopPropagation()}>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    {desc && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>}
                </div>
                <div className="mt-6 flex gap-3">
                    <button className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-medium text-sm text-slate-700 transition-all" onClick={onClose}>{cancelText}</button>
                    <button className={["flex-1 px-4 py-2 rounded-lg font-medium text-sm text-white shadow-sm transition-all active:scale-95", danger ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-slate-800"].join(" ")} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}

function Modal({ open, title, subtitle, children, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-9997 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
            <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onMouseDown={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="rounded-lg hover:bg-slate-100 p-2 text-slate-400 hover:text-slate-600 transition-all">✕</button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">{children}</div>
            </div>
        </div>
    );
}

/* ------------------ Inputs (Professional Style) ------------------ */
function Input({ label, value, onChange, placeholder = "", type = "text", hint }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </label>
    );
}

function Textarea({ label, value, onChange, rows = 4, placeholder = "", hint }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <textarea
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder || label}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
            />
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </label>
    );
}

function Toggle({ label, checked, onChange, desc }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 bg-white transition-all">
            <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{label}</p>
                {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm ${checked ? "translate-x-6" : "translate-x-1"}`} />
            </button>
        </div>
    );
}

function Dropzone({ title, subtitle, disabled, onPick, accept, multiple }) {
    const inputRef = useRef(null);
    return (
        <div
            onClick={() => !disabled && inputRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-white hover:border-indigo-500 transition-all p-6 flex flex-col items-center text-center cursor-pointer group"
        >
            <div className="mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="font-medium text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{title}</p>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={onPick} disabled={disabled} className="hidden" />
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
        date_iso: "",
        date_label: "",
        cover_image_url: "",
        gallery: [],
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

    async function loadNews() {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/news`, { cache: "no-store" });
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

        const iso = guessISOFromLabel(row.date_label || "");

        setForm({
            id: row.id,
            title: row.title || "",
            desc1: row.desc1 || "",
            desc2: row.desc2 || "",
            date_iso: iso || "",
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
            push("info", "กำลังบันทึกลำดับ", "โปรดรอสักครู่...", 1500);

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
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-32">
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

            <Modal
                open={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setForm(emptyForm);
                }}
                title={form.id ? "Edit Article" : "New Article"}
                subtitle="จัดการข้อมูลข่าวสารและกิจกรรม"
            >
                <div className="space-y-6 bg-white rounded-lg p-2">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="วันที่ประชาสัมพันธ์"
                            type="date"
                            value={form.date_iso}
                            onChange={(v) => setField("date_iso", v)}
                            hint={form.date_iso ? `แสดงผล: ${toThaiDateLabel(form.date_iso)}` : "เลือกวันที่เพื่อคำนวณ พ.ศ. อัตโนมัติ"}
                        />
                        <Input
                            label="หัวข้อข่าว"
                            value={form.title}
                            onChange={(v) => setField("title", v)}
                            placeholder="พาดหัวข่าวสั้นๆ ได้ใจความ..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Textarea
                            label="เนื้อหา (ส่วนที่ 1)"
                            value={form.desc1}
                            onChange={(v) => setField("desc1", v)}
                            rows={6}
                            placeholder="เนื้อหาหลักของข่าว..."
                        />
                        <Textarea
                            label="เนื้อหา (ส่วนที่ 2)"
                            value={form.desc2}
                            onChange={(v) => setField("desc2", v)}
                            rows={6}
                            placeholder="เนื้อหาเพิ่มเติม (ถ้ามี)..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start border-t border-slate-100 pt-6">
                        <div className="space-y-3">
                            <span className="text-sm font-semibold text-slate-700 block">รูปภาพปก (Cover Image)</span>
                            <div className="aspect-video rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                                {form.cover_image_url ? (
                                    <img src={resolveUrl(form.cover_image_url)} alt="cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-xs font-medium">No Image</span>
                                    </div>
                                )}
                            </div>
                            <Dropzone
                                title="เปลี่ยนรูปปก"
                                subtitle="ไฟล์ .jpg, .png ขนาดแนะนำ 1200x800px"
                                disabled={uploading}
                                accept="image/*"
                                multiple={false}
                                onPick={onUploadCover}
                            />
                        </div>

                        <div className="space-y-3">
                            <span className="text-sm font-semibold text-slate-700 block">แกลเลอรี (Gallery)</span>
                            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 min-h-35">
                                {Array.isArray(form.gallery) && form.gallery.map((u, idx) => (
                                    <div key={idx} className="aspect-square rounded border border-slate-200 relative group overflow-hidden bg-white">
                                        <img src={resolveUrl(u)} alt={`g-${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeGalleryIndex(idx)}
                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs flex items-center justify-center"
                                            type="button"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => document.getElementById('gal-up').click()}
                                    className="aspect-square rounded border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white"
                                >
                                    <span className="text-2xl font-light">+</span>
                                </button>
                                <input id="gal-up" type="file" multiple accept="image/*" className="hidden" onChange={onUploadGallery} disabled={uploading} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Toggle
                            label="เผยแพร่ข่าวนี้"
                            desc="เปิดเพื่อแสดงผลบนหน้าเว็บไซต์"
                            checked={!!form.is_active}
                            onChange={(v) => setField("is_active", v)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
                        <button
                            onClick={() => setForm(emptyForm)}
                            className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
                            type="button"
                            disabled={savingNews}
                        >
                            ล้างฟอร์ม
                        </button>
                        <button
                            onClick={onSaveNews}
                            disabled={savingNews}
                            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm transition-all text-sm disabled:opacity-70"
                            type="button"
                        >
                            {savingNews ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
                {/* Header Area */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">ADMIN</span>
                            <span className="text-slate-400 text-sm">/ News Management</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">News & Relations</h1>
                    </div>
                    <div className="flex gap-3">

                        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-black transition-all shadow-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            สร้างข่าวใหม่
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Toolbar Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative flex-1 w-full max-w-lg">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </div>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="ค้นหาข่าว..."
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={showOnlyActive} onChange={(e) => setShowOnlyActive(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-medium text-slate-600">แสดงเฉพาะที่เผยแพร่</span>
                                </label>
                                <div className="h-6 w-px bg-slate-200"></div>
                                <button
                                    onClick={saveOrder}
                                    disabled={savingOrder || loading}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${savingOrder || loading
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                                >
                                    {savingOrder && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                    {savingOrder ? "กำลังบันทึก" : "บันทึกลำดับ"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* News Grid Area */}
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-8 w-8 bg-slate-200 rounded-full mb-2"></div>
                                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orderedItems.map((row) => (
                                <div key={row.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
                                    {/* Image Area */}
                                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                        {row.cover_image_url ? (
                                            <img src={resolveUrl(row.cover_image_url)} alt="cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">NO IMAGE</div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <StatusBadge active={row.is_active} />
                                        </div>
                                        {/* Sort Controls */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button onClick={() => moveUp(row.id)} className="w-7 h-7 bg-white/90 backdrop-blur rounded shadow flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button onClick={() => moveDown(row.id)} className="w-7 h-7 bg-white/90 backdrop-blur rounded shadow flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-semibold text-indigo-600">{row.date_label || "-"}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">ID: {row.id}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-indigo-700 transition-colors">{row.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{row.desc1}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                            <div className="flex items-center gap-1 text-slate-400 text-xs">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span>{Array.isArray(row.gallery) ? row.gallery.length : safeParseJson(row.gallery, []).length}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEdit(row)} className="p-2 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="แก้ไข">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => requestDelete(row.id)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="ลบ">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium">
                    <p>© TJC News Management System</p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-600 transition-colors mt-2 sm:mt-0">
                        Back to Top ↑
                    </button>
                </footer>
            </div>
        </div>
    );
}