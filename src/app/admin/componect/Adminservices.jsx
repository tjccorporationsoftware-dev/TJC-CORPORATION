"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    LayoutDashboard, Plus, Trash2, Edit, Save,
    Image as ImageIcon, Loader2, X,
    ChevronUp, ChevronDown, Tag
} from "lucide-react";

// --- Config ---
// ตรวจสอบ Port ให้ตรงกับ Backend (4000)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- Helpers ---
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

// --- Custom Fetch Wrapper ---
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

        if (!res.ok) {
            if (res.status === 401) {
                if (typeof window !== "undefined") localStorage.removeItem("token");
                // window.location.href = "/login"; // Uncomment ถ้าต้องการให้เด้งไปหน้า login
                throw new Error("Session expired. Please login again.");
            }
            throw new Error(data.message || `Request failed with status ${res.status}`);
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// --- Toast Component ---
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-100 flex flex-col gap-3">
            {toasts.map((t) => (
                <div key={t.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border bg-white animate-in slide-in-from-right duration-300 ${t.type === "success" ? "border-emerald-100" : "border-red-100"}`} style={{ minWidth: "300px" }}>
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${t.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                        {t.type === "success" ? "✓" : "!"}
                    </div>
                    <div className={`flex-1 text-sm font-medium ${t.type === "success" ? "text-emerald-800" : "text-red-800"}`}>{t.msg}</div>
                    <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
            ))}
        </div>
    );
}

// --- Confirm Dialog ---
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, type = "danger" }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium">Cancel</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm ${type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

// --- File Upload ---
const FileUpload = ({ value, onChange, token }) => {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!token) { alert("กรุณาเข้าสู่ระบบใหม่"); return; }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            const res = await apiFetch("/api/upload", { method: "POST", body: formData, token, isFormData: true });
            onChange(res.url);
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {value ? <img src={getImgUrl(value)} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}
            </div>
            <div>
                <button onClick={() => inputRef.current?.click()} className="text-sm text-indigo-600 font-medium hover:underline mb-1">Change Image</button>
                <p className="text-xs text-slate-400">JPG, PNG up to 5MB</p>
                <input type="file" ref={inputRef} className="hidden" onChange={handleUpload} accept="image/*" />
            </div>
        </div>
    );
};

// --- Form Component ---
function ServiceForm({ initialData, categories, onSave, onCancel, token }) {
    // กำหนด default value ให้ category เป็น "" เสมอ ถ้าไม่มีค่า
    const [form, setForm] = useState({
        title: "", description: "", image_url: "", category: "", is_active: true,
        ...initialData,
        category: initialData.category || ""
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Service Icon/Image</label>
                    <FileUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} token={token} />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                            <div className="relative">
                                <select
                                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.title}>{cat.title}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. CCTV Installation"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                            placeholder="Brief details about this service..."
                            value={form.description || ""}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700">Active (Show on website)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button onClick={onCancel} className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button
                    onClick={() => onSave(form)}
                    disabled={!form.title}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium shadow-md shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Save size={18} /> Save Service
                </button>
            </div>
        </div>
    );
}

// --- Main Page Component ---
export default function ServicesAdminPage() {
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
            addToast("error", "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = getToken();
        if (t) { setToken(t); fetchData(); } else { setLoading(false); }
    }, []);

    const handleSave = async (formData) => {
        if (!token) { addToast("error", "No token found"); return; }

        try {
            if (formData.id) {
                await apiFetch(`/api/services/${formData.id}`, { method: "PATCH", body: formData, token });
                addToast("success", "Service updated");
            } else {
                const maxSort = services.length > 0 ? Math.max(...services.map(s => s.sort_order || 0)) : 0;
                await apiFetch("/api/services", { method: "POST", body: { ...formData, sort_order: maxSort + 1 }, token });
                addToast("success", "Service created");
            }
            setEditing(null);
            fetchData();
        } catch (err) {
            addToast("error", err.message || "Save failed");
        }
    };

    const handleDelete = async (id) => {
        if (!token) return;
        try {
            await apiFetch(`/api/services/${id}`, { method: "DELETE", token });
            addToast("success", "Service deleted");
            fetchData();
        } catch { addToast("error", "Delete failed"); }
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
        } catch { fetchData(); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 p-6 md:p-10">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
            <ConfirmDialog {...confirm} onClose={() => setConfirm({ ...confirm, isOpen: false })} />

            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Services Management</h1>
                        <p className="text-slate-500 mt-1">Manage your service listings</p>
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing({})}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} /> Add Service
                        </button>
                    )}
                </div>

                {editing ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">{editing.id ? "Edit Service" : "New Service"}</h2>
                            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <ServiceForm
                            initialData={editing}
                            categories={categories}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            token={token}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {services.map((service, index) => (
                            <div key={service.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-6 group hover:border-indigo-200 hover:shadow-md transition-all">
                                <div className="flex flex-col gap-1 text-slate-300">
                                    <button onClick={() => handleSort(index, -1)} disabled={index === 0} className="hover:text-indigo-600 disabled:opacity-30 transition-colors"><ChevronUp size={20} /></button>
                                    <button onClick={() => handleSort(index, 1)} disabled={index === services.length - 1} className="hover:text-indigo-600 disabled:opacity-30 transition-colors"><ChevronDown size={20} /></button>
                                </div>

                                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                    {service.image_url ? (
                                        <img src={getImgUrl(service.image_url)} alt={service.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>
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
                                    <p className="text-slate-500 text-sm truncate">{service.description || "No description provided"}</p>
                                </div>

                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditing(service)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18} /></button>
                                    <button onClick={() => setConfirm({ isOpen: true, title: "Delete?", message: `Delete "${service.title}"?`, onConfirm: () => handleDelete(service.id) })} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}

                        {services.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                    <LayoutDashboard className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No services found</h3>
                                <p className="text-slate-500">Get started by creating a new service.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}