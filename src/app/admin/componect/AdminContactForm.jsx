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

/* ------------------ Toast UI ------------------ */
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
    setToasts((p) => [{ id, type, title, message }, ...p].slice(0, 5));
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

function SectionCard({ title, desc, children, right }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{title}</h3>
          {desc ? <p className="text-sm text-slate-600 mt-1">{desc}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
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
export default function AdminContactPage() {
  const router = useRouter();
  const { toasts, push, remove } = useToasts();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    heading: "",
    description: "",
    email: "",
    phone: "",
    line_label: "",
    line_url: "",
    line_icon_url: "",
    address_lines_text: "",
    open_hours: "",
    map_title: "",
    map_embed_url: "",
  });

  useEffect(() => {
    const t = getToken();
    if (!t) {
      push("error", "ไม่พบ Token", "กรุณา Login ใหม่");
      setLoading(false);
      router.push("/admin/login");
      return;
    }
    setToken(t);
  }, [router]); // eslint-disable-line

  const headersAuth = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }, [token]);

  // Load existing data
  useEffect(() => {
    if (!token) return;
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/site/contact`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (res.status === 401) {
          clearSession();
          push("error", "Session หมดอายุ", "กรุณา Login ใหม่");
          router.push("/admin/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();
        if (!alive) return;

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

        push("success", "โหลดข้อมูลสำเร็จ", "พร้อมแก้ไขได้เลย", 1800);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        push("warning", "โหลดข้อมูลไม่สำเร็จ", "อาจยังไม่มีข้อมูลในระบบ หรือเซิร์ฟเวอร์มีปัญหา");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [token, router]); // eslint-disable-line

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  async function onUploadIcon(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      push("info", "กำลังอัปโหลดไอคอน Line", file.name, 1600);

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // ❌ ห้ามใส่ Content-Type
        body: fd,
      });

      if (res.status === 401) {
        clearSession();
        push("error", "Session หมดอายุ", "กรุณา Login ใหม่");
        router.push("/admin/login");
        return;
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Upload failed");

      setField("line_icon_url", json.url);
      push("success", "อัปโหลดสำเร็จ", "ระบบใส่ URL ให้แล้ว");
    } catch (err) {
      push("error", "อัปโหลดไม่สำเร็จ", err?.message || "Unknown error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSave() {
    try {
      setSaving(true);

      if (!token) {
        push("error", "Session หมดอายุ", "กรุณา Login ใหม่");
        clearSession();
        router.push("/admin/login");
        return;
      }

      const address_lines = form.address_lines_text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        data: {
          heading: form.heading.trim(),
          description: form.description.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          line_label: form.line_label.trim(),
          line_url: form.line_url.trim(),
          line_icon_url: form.line_icon_url.trim(),
          address_lines,
          open_hours: form.open_hours.trim(),
          map_title: form.map_title.trim(),
          map_embed_url: form.map_embed_url.trim(),
        },
      };

      const res = await fetch(`${API_BASE}/api/site/contact`, {
        method: "PUT",
        headers: headersAuth,
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        clearSession();
        push("error", "Session หมดอายุ", "กรุณา Login ใหม่");
        router.push("/admin/login");
        return;
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Save failed");

      push("success", "บันทึกสำเร็จ", "อัปเดตหน้า Contact เรียบร้อย ✅");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      push("error", "บันทึกไม่สำเร็จ", err?.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearSession();
    push("success", "ออกจากระบบแล้ว", "", 1500);
    router.push("/admin/login");
  }

  const canPreviewMap = !!form.map_embed_url && form.map_embed_url.startsWith("http");

  return (
    <>
      <ToastStack toasts={toasts} onClose={remove} />

      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
        {/* Topbar */}
        <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">Admin Panel</p>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
                แก้ไขหน้า Contact
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Header intro */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  ตั้งค่าข้อมูลการติดต่อ / แผนที่ / เวลาทำการ
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  แก้ไขเสร็จแล้วกด “บันทึกการเปลี่ยนแปลง” ด้านล่าง
                </p>
              </div>

              <button
                onClick={() => {
                  push("info", "รีเฟรชข้อมูล", "กำลังโหลดใหม่...", 1500);
                  // โหลดใหม่แบบง่าย: reload page (หรือจะทำเป็นฟังก์ชัน load แยกก็ได้)
                  window.location.reload();
                }}
                className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
                type="button"
              >
                รีเฟรชข้อมูล
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-10">
              <div className="py-16 text-center text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</div>
            </div>
          ) : (
            <>
              {/* 1) Heading */}
              <SectionCard title="หัวข้อและรายละเอียด" desc="ข้อความส่วนบนของหน้า Contact">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="หัวข้อหลัก (Heading)"
                    value={form.heading}
                    onChange={(v) => setField("heading", v)}
                    placeholder="เช่น ติดต่อเรา"
                  />
                  <Input
                    label="เวลาทำการ (Open hours)"
                    value={form.open_hours}
                    onChange={(v) => setField("open_hours", v)}
                    placeholder="เช่น จันทร์-ศุกร์ 08:30–17:30"
                  />
                </div>
                <div className="mt-4">
                  <Textarea
                    label="คำอธิบาย (Subtitle)"
                    value={form.description}
                    onChange={(v) => setField("description", v)}
                    rows={4}
                    placeholder="ใส่รายละเอียดสั้น ๆ เกี่ยวกับการติดต่อ"
                  />
                </div>
              </SectionCard>

              {/* 2) Contact channels */}
              <SectionCard title="ช่องทางการติดต่อ" desc="อีเมล โทรศัพท์ และ Line Official">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="อีเมล"
                    value={form.email}
                    onChange={(v) => setField("email", v)}
                    placeholder="example@company.com"
                  />
                  <Input
                    label="เบอร์โทรศัพท์"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    placeholder="เช่น 045-xxx-xxxx"
                  />
                </div>

                <div className="mt-5 grid lg:grid-cols-[1fr_0.9fr] gap-4">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="ข้อความแสดง (Line Label)"
                        value={form.line_label}
                        onChange={(v) => setField("line_label", v)}
                        placeholder="เช่น @tjcgroup"
                      />
                      <Input
                        label="ลิงก์ Line (Line URL)"
                        value={form.line_url}
                        onChange={(v) => setField("line_url", v)}
                        placeholder="https://lin.ee/xxxxxx"
                      />
                    </div>

                    <Input
                      label="URL ไอคอน Line"
                      value={form.line_icon_url}
                      onChange={(v) => setField("line_icon_url", v)}
                      placeholder="/uploads/line.png หรือ https://..."
                      hint="ถ้าอัปโหลดด้านขวา ระบบจะใส่ URL ให้อัตโนมัติ"
                    />
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                        {form.line_icon_url ? (
                          <img
                            src={resolveUrl(form.line_icon_url)}
                            alt="line icon"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">No Icon</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900">ไอคอน Line</p>
                        <p className="text-sm text-slate-600 mt-1">
                          แนะนำ .png พื้นหลังใส
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Dropzone
                        title="อัปโหลดไอคอน Line"
                        subtitle={uploading ? "กำลังอัปโหลด..." : "รองรับ .png, .jpg"}
                        disabled={uploading}
                        accept="image/*"
                        multiple={false}
                        onPick={onUploadIcon}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* 3) Address */}
              <SectionCard
                title="ที่อยู่"
                desc="ใส่หลายบรรทัดได้ (Enter เพื่อขึ้นบรรทัดใหม่) ระบบจะแปลงเป็น array"
              >
                <Textarea
                  label="ที่อยู่ (หลายบรรทัด)"
                  value={form.address_lines_text}
                  onChange={(v) => setField("address_lines_text", v)}
                  rows={5}
                  placeholder={"บริษัท ...\nเลขที่ ...\nอำเภอ ... จังหวัด ...\nรหัสไปรษณีย์ ..."}
                  hint="บรรทัดว่างจะถูกตัดออกอัตโนมัติ"
                />
              </SectionCard>

              {/* 4) Map */}
              <SectionCard
                title="แผนที่ Google Map"
                desc="วาง Embed URL (ค่า src จาก iframe ของ Google Maps)"
                right={
                  canPreviewMap ? (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Preview พร้อมใช้งาน
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      ยังไม่มี URL ที่ถูกต้อง
                    </span>
                  )
                }
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="หัวข้อแผนที่ (Map title)"
                    value={form.map_title}
                    onChange={(v) => setField("map_title", v)}
                    placeholder="เช่น แผนที่บริษัท"
                  />
                  <Input
                    label="Embed URL (src)"
                    value={form.map_embed_url}
                    onChange={(v) => setField("map_embed_url", v)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    hint="ต้องเป็นลิงก์ที่ขึ้นต้นด้วย http/https"
                  />
                </div>

                {canPreviewMap ? (
                  <div className="mt-5 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <p className="font-extrabold text-slate-900">Map Preview</p>
                      <a
                        href={form.map_embed_url}
                        target="_blank"
                        className="text-sm font-semibold text-slate-700 hover:underline"
                      >
                        เปิดในแท็บใหม่ ↗
                      </a>
                    </div>
                    <iframe
                      src={form.map_embed_url}
                      width="100%"
                      height="320"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Map Preview"
                    />
                  </div>
                ) : (
                  <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    ยังไม่สามารถแสดงแผนที่ได้ — กรุณาวาง Embed URL ที่ถูกต้อง (ค่า src จาก iframe)
                  </div>
                )}
              </SectionCard>

              {/* Save bar */}
              <div className="sticky bottom-4 z-30">
                <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur shadow-lg p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="text-sm text-slate-600">
                    พร้อมแล้วกดบันทึก เพื่ออัปเดตหน้า <span className="font-semibold">/contact</span>
                  </div>

                  <button
                    onClick={onSave}
                    disabled={saving}
                    className={[
                      "px-6 py-3 rounded-2xl font-extrabold text-white shadow-sm transition",
                      saving ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800",
                    ].join(" ")}
                    type="button"
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center pb-10">
                API: <span className="font-mono">{API_BASE}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
