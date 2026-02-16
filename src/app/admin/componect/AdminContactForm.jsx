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

/* ------------------ UI Components (Theme Consistent) ------------------ */

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-100 flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${t.type === "success" ? "bg-white border-emerald-100 text-emerald-800" : "bg-white border-red-100 text-red-800"
          }`} style={{ minWidth: "300px", maxWidth: "400px" }}>
          <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${t.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
            {t.type === "success" ? "✓" : "!"}
          </div>
          <div className="flex-1 text-sm font-medium">{t.title}</div>
          <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      ))}
    </div>
  );
}

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

function InputField({ label, value, onChange, placeholder = "", type = "text", hint }) {
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

function TextareaField({ label, value, onChange, rows = 4, placeholder = "" }) {
  return (
    <label className="block space-y-1.5">
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

/* ------------------ Page ------------------ */
export default function AdminContactPage() {
  const router = useRouter();

  // Toast logic compatible with the theme
  const [toasts, setToasts] = useState([]);
  const pushToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [{ id, type, title }, ...prev]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    heading: "", description: "", email: "", phone: "",
    line_label: "", line_url: "", line_icon_url: "",
    address_lines_text: "", open_hours: "",
    map_title: "", map_embed_url: "",
  });

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push("/admin/login");
      return;
    }
    setToken(t);
  }, [router]);

  // Load existing data
  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/site/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          clearSession(); router.push("/admin/login"); return;
        }
        const json = await res.json();
        const d = json?.data || {};
        setForm({
          heading: d.heading || "",
          description: d.description || "",
          email: d.email || "",
          phone: d.phone || "",
          line_label: d.line_label || "",
          line_url: d.line_url || "",
          line_icon_url: d.line_icon_url || "",
          address_lines_text: Array.isArray(d.address_lines) ? d.address_lines.join("\n") : "",
          open_hours: d.open_hours || "",
          map_title: d.map_title || "",
          map_embed_url: d.map_embed_url || "",
        });
      } catch (e) {
        pushToast("error", "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, router]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  async function onSave() {
    try {
      setSaving(true);
      const address_lines = form.address_lines_text.split("\n").map((s) => s.trim()).filter(Boolean);
      const payload = { data: { ...form, heading: form.heading.trim(), address_lines } };

      const res = await fetch(`${API_BASE}/api/site/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      pushToast("success", "บันทึกข้อมูลเรียบร้อย");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      pushToast("error", "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  const canPreviewMap = !!form.map_embed_url && form.map_embed_url.startsWith("http");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">ADMIN</span>
              <span className="text-slate-400 text-sm">/ Site Configuration</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Contact Information</h1>
            <p className="text-slate-500 mt-1">จัดการข้อมูลการติดต่อ แผนที่ และเวลาทำการ</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              รีเฟรช
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-70 flex items-center gap-2"
            >
              {saving && <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Section 1: Branding & Hours */}
            <SectionShell title="ข้อมูลทั่วไป" subtitle="หัวข้อหลักและเวลาทำการ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="หัวข้อหลัก (Heading)" value={form.heading} onChange={(v) => setField("heading", v)} placeholder="เช่น ติดต่อเรา" />
                <InputField label="เวลาทำการ" value={form.open_hours} onChange={(v) => setField("open_hours", v)} placeholder="จันทร์-ศุกร์ 08:30–17:30" />
                <div className="md:col-span-2">
                  <TextareaField label="คำอธิบายเพิ่มเติม" value={form.description} onChange={(v) => setField("description", v)} rows={2} placeholder="รายละเอียดสั้นๆ ใต้หัวข้อ" />
                </div>
              </div>
            </SectionShell>

            {/* Section 2: Contact Channels */}
            <SectionShell title="ช่องทางการติดต่อ" subtitle="อีเมล, เบอร์โทรศัพท์ และโซเชียลมีเดีย">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputField label="อีเมล" value={form.email} onChange={(v) => setField("email", v)} placeholder="example@company.com" />
                <InputField label="เบอร์โทรศัพท์" value={form.phone} onChange={(v) => setField("phone", v)} placeholder="045-xxx-xxxx" />
                <InputField label="LINE ID / Label" value={form.line_label} onChange={(v) => setField("line_label", v)} placeholder="@tjcgroup" />
                <InputField label="LINE URL" value={form.line_url} onChange={(v) => setField("line_url", v)} placeholder="https://lin.ee/..." />
              </div>
            </SectionShell>

            {/* Section 3: Address & Map */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
              <SectionShell title="ที่อยู่บริษัท" subtitle="รายละเอียดที่ตั้งสำนักงาน">
                <TextareaField label="ที่อยู่ (กด Enter เพื่อขึ้นบรรทัดใหม่)" value={form.address_lines_text} onChange={(v) => setField("address_lines_text", v)} rows={8} placeholder={"บริษัท...\nเลขที่...\nถนน..."} />
              </SectionShell>

              <SectionShell
                title="Google Maps"
                subtitle="แผนที่แบบฝัง (Embed)"
                right={
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${canPreviewMap ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {canPreviewMap ? 'พร้อมแสดงผล' : 'ไม่มีข้อมูล'}
                  </span>
                }
              >
                <div className="space-y-4">
                  <InputField label="ชื่อสถานที่บนแผนที่" value={form.map_title} onChange={(v) => setField("map_title", v)} placeholder="แผนที่สำนักงานใหญ่" />
                  <InputField
                    label="Embed URL (src จาก iframe)"
                    value={form.map_embed_url}
                    onChange={(v) => setField("map_embed_url", v)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    hint="คัดลอกเฉพาะค่าในเครื่องหมายคำพูดของ src='...'"
                  />

                  <div className="mt-4">
                    <span className="text-sm font-semibold text-slate-700 block mb-2">ตัวอย่างแผนที่</span>
                    {canPreviewMap ? (
                      <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-64 shadow-sm">
                        <iframe src={form.map_embed_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map Preview" />
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center h-64 text-slate-400 text-sm">
                        กรุณากรอก Embed URL เพื่อดูตัวอย่าง
                      </div>
                    )}
                  </div>
                </div>
              </SectionShell>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}