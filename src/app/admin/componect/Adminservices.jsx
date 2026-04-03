"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard, Plus, Trash2, Edit, Save,
    Image as ImageIcon, Loader2, X,
    ChevronUp, ChevronDown, Tag
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ------------------ Helpers ------------------ */
function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
}

const getImgUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
};

async function apiFetch(endpoint, { method = "GET", body, token, isFormData = false } = {}) {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData) headers["Content-Type"] = "application/json";

    const config = {
        method,
        headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    };

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
        return data;
    } catch (error) {
        throw error;
    }
}

/* ------------------ UI Components (จากหน้า Contact) ------------------ */
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
            {toasts.map((t) => (
                <div key={t.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${t.type === "success" ? "bg-white border-emerald-100 text-emerald-800" : "bg-white border-red-100 text-red-800"}`} style={{ minWidth: "300px", maxWidth: "400px" }}>
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${t.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                        {t.type === "success" ? "✓" : "!"}
                    </div>
                    <div className="flex-1 text-sm font-medium">{t.msg}</div>
                    <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
            ))}
        </div>
    );
}

function SectionShell({ title, subtitle, children, right }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
                {right}
            </div>
            <div className="p-6 flex-1">{children}</div>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder = "", type = "text", hint }) {
    return (
        <label className="block space-y-1.5 w-full">
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

function TextareaField({ label, value, onChange, rows = 4, placeholder = "" }) {
    return (
        <label className="block space-y-1.5 w-full">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <textarea
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
            />
        </label>
    );
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, type = "danger" }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium border border-slate-200">Cancel</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm ${type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

/* ------------------ Multi-Image Upload Component ------------------ */
const MultiFileUpload = ({ images, onChange, token }) => {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        if (!token) { alert("กรุณาเข้าสู่ระบบใหม่"); return; }

        setUploading(true);
        const newUrls = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await apiFetch("/api/upload", { method: "POST", body: formData, token, isFormData: true });
                newUrls.push(res.url);
            } catch (err) {
                alert(`Upload failed for ${file.name}: ` + err.message);
            }
        }
        onChange([...images, ...newUrls]); // อัปเดตอาร์เรย์รูปภาพ
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                        <img src={getImgUrl(url)} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                            onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                            className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                            title="ลบรูปภาพ"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}
                    className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all text-slate-500 hover:text-indigo-600"
                >
                    {uploading ? <Loader2 className="animate-spin mb-2" size={24} /> : <Plus className="mb-2" size={24} />}
                    <span className="text-xs font-semibold">{uploading ? "Uploading..." : "Add Image"}</span>
                </button>
            </div>
            <input type="file" ref={inputRef} className="hidden" onChange={handleUpload} accept="image/*" multiple />
            <p className="text-xs text-slate-400">อัปโหลดได้หลายรูป (JPG, PNG) ขนาดไม่เกิน 5MB ต่อรูป</p>
        </div>
    );
};

/* ------------------ Form Component ------------------ */
function ServiceForm({ initialData, categories, onSave, onCancel, token }) {
    // แปลง image_url ที่คั่นด้วยลูกน้ำ กลับเป็น Array เพื่อใช้ใน MultiFileUpload
    const initialImages = initialData.image_url ? initialData.image_url.split(",").filter(Boolean) : [];

    const [form, setForm] = useState({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        is_active: initialData.is_active ?? true,
        images: initialImages
    });

    const handleSubmit = () => {
        // ก่อนเซฟให้แปลง Array กลับเป็น String คั่นด้วยลูกน้ำ
        const dataToSave = {
            id: initialData.id,
            title: form.title,
            description: form.description,
            category: form.category,
            is_active: form.is_active,
            image_url: form.images.join(",") // บันทึกลงฐานข้อมูลช่องเดิมได้เลย!
        };
        onSave(dataToSave);
    };

    return (
        <div className="space-y-6">
            <SectionShell title="รายละเอียดบริการ" subtitle="ข้อมูลทั่วไปของบริการ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="ชื่อบริการ (Service Name)" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="เช่น ติดตั้งกล้องวงจรปิด" />

                    <label className="block space-y-1.5 w-full">
                        <span className="text-sm font-semibold text-slate-700">หมวดหมู่ (Category)</span>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer text-sm"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="">-- เลือกหมวดหมู่ --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.title}>{cat.title}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </label>

                    <div className="md:col-span-2">
                        <TextareaField label="คำอธิบาย (Description)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} placeholder="รายละเอียดของบริการ..." />
                    </div>

                    <div className="md:col-span-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-3 text-sm font-semibold text-slate-700">แสดงผลบนเว็บไซต์ (Active)</span>
                        </label>
                    </div>
                </div>
            </SectionShell>

            <SectionShell title="รูปภาพประกอบ" subtitle="สามารถอัปโหลดได้หลายรูปภาพ">
                <MultiFileUpload images={form.images} onChange={(newImages) => setForm({ ...form, images: newImages })} token={token} />
            </SectionShell>

            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onCancel} className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-200 font-medium transition-colors">ยกเลิก</button>
                <button
                    onClick={handleSubmit}
                    disabled={!form.title}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    <Save size={18} /> บันทึกข้อมูล
                </button>
            </div>
        </div>
    );
}

/* ------------------ Main Page Component ------------------ */
export default function ServicesAdminPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [confirm, setConfirm] = useState({ isOpen: false });

    const addToast = (type, msg) => {
        const id = Date.now();
        setToasts(p => [...p, { id, type, msg }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [servicesData, categoriesData] = await Promise.all([
                apiFetch("/api/services"),
                apiFetch("/api/service-categories")
            ]);
            setServices(Array.isArray(servicesData) ? servicesData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
            addToast("error", "โหลดข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = getToken();
        if (!t) {
            router.push("/admin/login");
        } else {
            setToken(t);
            fetchData();
        }
    }, [router]);

    const handleSave = async (formData) => {
        if (!token) return;
        try {
            if (formData.id) {
                await apiFetch(`/api/services/${formData.id}`, { method: "PATCH", body: formData, token });
                addToast("success", "อัปเดตบริการเรียบร้อย");
            } else {
                const maxSort = services.length > 0 ? Math.max(...services.map(s => s.sort_order || 0)) : 0;
                await apiFetch("/api/services", { method: "POST", body: { ...formData, sort_order: maxSort + 1 }, token });
                addToast("success", "เพิ่มบริการใหม่เรียบร้อย");
            }
            setEditing(null);
            fetchData();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            addToast("error", err.message || "บันทึกไม่สำเร็จ");
        }
    };

    const handleDelete = async (id) => {
        if (!token) return;
        try {
            await apiFetch(`/api/services/${id}`, { method: "DELETE", token });
            addToast("success", "ลบบริการเรียบร้อย");
            fetchData();
        } catch {
            addToast("error", "ลบไม่สำเร็จ");
        }
    };

    const handleSort = async (index, dir) => {
        if (!token) return;
        const target = index + dir;
        if (target < 0 || target >= services.length) return;

        const itemA = services[index];
        const itemB = services[target];

        const newServices = [...services];
        newServices[index] = { ...itemB, sort_order: itemA.sort_order };
        newServices[target] = { ...itemA, sort_order: itemB.sort_order };
        setServices(newServices);

        try {
            await Promise.all([
                apiFetch(`/api/services/${itemA.id}`, { method: "PATCH", body: { sort_order: itemB.sort_order }, token }),
                apiFetch(`/api/services/${itemB.id}`, { method: "PATCH", body: { sort_order: itemA.sort_order }, token })
            ]);
        } catch {
            fetchData();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
            <ConfirmDialog {...confirm} onClose={() => setConfirm({ ...confirm, isOpen: false })} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">ADMIN</span>
                            <span className="text-slate-400 text-sm">/ Services</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">จัดการบริการ (Services)</h1>
                        <p className="text-slate-500 mt-1">เพิ่ม ลบ แก้ไข และจัดเรียงบริการของคุณ</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all shadow-sm"
                        >
                            รีเฟรช
                        </button>
                        {!editing && (
                            <button
                                onClick={() => setEditing({})}
                                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <Plus size={18} /> เพิ่มบริการใหม่
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
                        <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : editing ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <ServiceForm
                            initialData={editing}
                            categories={categories}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            token={token}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-800">รายการบริการทั้งหมด</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {services.map((service, index) => {
                                // รูปหน้าปกคือรูปแรกใน Array เสมอ
                                const firstImage = service.image_url ? service.image_url.split(",")[0] : null;

                                return (
                                    <div key={service.id} className="p-5 flex items-center gap-6 hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col gap-1 text-slate-300">
                                            <button onClick={() => handleSort(index, -1)} disabled={index === 0} className="hover:text-indigo-600 disabled:opacity-30 transition-colors"><ChevronUp size={20} /></button>
                                            <button onClick={() => handleSort(index, 1)} disabled={index === services.length - 1} className="hover:text-indigo-600 disabled:opacity-30 transition-colors"><ChevronDown size={20} /></button>
                                        </div>

                                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm p-1">
                                            {firstImage ? (
                                                <img src={getImgUrl(firstImage)} alt={service.title} className="w-full h-full object-cover rounded" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 rounded"><ImageIcon size={24} /></div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-slate-800 text-lg truncate">{service.title}</h3>

                                                {service.category && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        <Tag size={10} /> {service.category}
                                                    </span>
                                                )}

                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${service.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                                    {service.is_active ? "Active" : "Hidden"}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm truncate">{service.description || "ไม่มีคำอธิบาย"}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setEditing(service)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100" title="แก้ไข">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => setConfirm({ isOpen: true, title: "ยืนยันการลบ?", message: `คุณต้องการลบ "${service.title}" ใช่หรือไม่?`, onConfirm: () => handleDelete(service.id) })} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="ลบ">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {services.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                        <LayoutDashboard className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900">ไม่พบบริการ</h3>
                                    <p className="text-slate-500">กดปุ่ม "เพิ่มบริการใหม่" เพื่อเริ่มต้น</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}