"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* --- SHARED HELPERS & UI --- */
function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
}
const resolveUrl = (u) => {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    if (u.startsWith("/images/")) return u;
    const cleanPath = u.startsWith("/") ? u : `/${u}`;
    return `${API_BASE}${cleanPath}`;
};

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-100 flex flex-col gap-3">
            {toasts.map((t) => (
                <div key={t.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${t.type === "success" ? "bg-white border-emerald-100 text-emerald-800" : "bg-white border-red-100 text-red-800"}`} style={{ minWidth: "300px", maxWidth: "400px" }}>
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${t.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>{t.type === "success" ? "✓" : "!"}</div>
                    <div className="flex-1 text-sm font-medium">{t.title}</div>
                    <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
            ))}
        </div>
    );
}

function InputField({ label, value, onChange, placeholder = "", type = "text", hint }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" />
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </label>
    );
}

function ImageUploadField({ label, value, onChange, token }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_BASE}/api/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            onChange(data.url);
        } catch (error) {
            alert("อัปโหลดรูปภาพไม่สำเร็จ");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700 block">{label}</span>
            <div className="flex items-start gap-4">
                {value ? (
                    <div className="relative group w-24 h-24 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                        <img src={resolveUrl(value)} alt="Preview" className="w-full h-full object-contain p-1" />
                        <button onClick={() => onChange("")} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xs font-medium">ลบรูป</button>
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-xs text-center p-2">
                        ไม่มีรูป
                    </div>
                )}
                <div className="flex-1">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                    <p className="text-xs text-slate-500 mt-2">{uploading ? "กำลังอัปโหลด..." : "รองรับ JPG, PNG, WEBP"}</p>
                </div>
            </div>
        </div>
    );
}

/* ------------------ MAIN PAGE ------------------ */
export default function AdminCustomerLogosPage() {
    const router = useRouter();
    const [toasts, setToasts] = useState([]);
    const pushToast = (type, title) => {
        const id = Date.now();
        setToasts((prev) => [{ id, type, title }, ...prev]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: "", image_url: "", sort_order: 0 });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const t = getToken();
        if (!t) { router.push("/admin/login"); return; }
        setToken(t);
        fetchItems(t);
    }, [router]);

    const fetchItems = async (t) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/customer-logos`, { headers: { Authorization: `Bearer ${t}` } });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (e) {
            pushToast("error", "โหลดข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, image_url: item.image_url, sort_order: item.sort_order });
        } else {
            setEditingItem(null);
            setFormData({ name: "", image_url: "", sort_order: 0 });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const method = editingItem ? "PATCH" : "POST";
            const url = editingItem ? `${API_BASE}/api/customer-logos/${editingItem.id}` : `${API_BASE}/api/customer-logos`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed");

            pushToast("success", editingItem ? "แก้ไขสำเร็จ" : "เพิ่มรายการสำเร็จ");
            setIsModalOpen(false);
            fetchItems(token);
        } catch (e) {
            pushToast("error", "บันทึกข้อมูลไม่สำเร็จ");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/customer-logos/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                pushToast("success", "ลบรายการเรียบร้อย");
                fetchItems(token);
            }
        } catch (e) {
            pushToast("error", "ลบไม่สำเร็จ");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">ADMIN</span>
                            <span className="text-slate-400 text-sm">/ Content Management</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Customer Logos</h1>
                        <p className="text-slate-500 mt-1">จัดการโลโก้ลูกค้าหรือพันธมิตร</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                        + เพิ่มโลโก้ใหม่
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">กำลังโหลด...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                                <div className="aspect-square bg-white relative border-b border-slate-100 flex items-center justify-center p-6">
                                    {item.image_url ? (
                                        <img
                                            src={resolveUrl(item.image_url)}
                                            alt={item.name}
                                            className="max-w-full max-h-full object-contain transition-all duration-300"
                                        />
                                    ) : (
                                        <div className="text-slate-300 text-xs">No Logo</div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">
                                        #{item.sort_order}
                                    </div>
                                </div>
                                <div className="p-3 flex flex-col items-center">
                                    <h3 className="font-semibold text-slate-800 text-sm mb-2 text-center truncate w-full">{item.name}</h3>
                                    <div className="flex gap-2 w-full">
                                        <button onClick={() => handleOpenModal(item)} className="flex-1 py-1.5 rounded bg-slate-50 text-slate-600 text-xs font-medium hover:bg-slate-100">แก้ไข</button>
                                        <button onClick={() => handleDelete(item.id)} className="flex-1 py-1.5 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100">ลบ</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                                ยังไม่มีข้อมูลโลโก้
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">{editingItem ? "แก้ไขโลโก้" : "เพิ่มโลโก้ใหม่"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <div className="p-6 space-y-5">
                            <InputField label="ชื่อลูกค้า / บริษัท" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="เช่น บริษัท ก. จำกัด" />
                            <InputField type="number" label="ลำดับการแสดงผล" value={formData.sort_order} onChange={(v) => setFormData({ ...formData, sort_order: parseInt(v) || 0 })} />
                            <ImageUploadField label="ไฟล์โลโก้" token={token} value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} />
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors">ยกเลิก</button>
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {saving ? "กำลังบันทึก..." : "บันทึก"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}