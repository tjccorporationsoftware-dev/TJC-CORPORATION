"use client";

import React, { useEffect, useState } from "react";
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

/* ------------------ UI Components ------------------ */
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
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

/* ------------------ Page ------------------ */
export default function AdminWarrantyPage() {
    const router = useRouter();
    const [toasts, setToasts] = useState([]);
    const pushToast = (type, title) => {
        const id = Date.now();
        setToasts((prev) => [{ id, type, title }, ...prev]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ✅ รวม State ทุกส่วนไว้ในฟอร์มเดียว
    const [form, setForm] = useState({
        heading: "",
        general_terms: [],
        exclusion_heading: "",
        exclusions: [],
        product_warranty_heading: "",
        product_warranty_desc: "",
        product_warranties: [],
        claim_heading: "",
        claim_steps: [],
        claim_notes: ""
    });

    useEffect(() => {
        const t = getToken();
        if (!t) {
            router.push("/admin/login");
            return;
        }
        setToken(t);
    }, [router]);

    useEffect(() => {
        if (!token) return;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/site/warranty`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.status === 401) {
                    clearSession(); router.push("/admin/login"); return;
                }
                const json = await res.json();
                const d = json?.data || {};

                setForm({
                    heading: d.heading || "นโยบายการรับประกันสินค้า",
                    general_terms: Array.isArray(d.general_terms) ? d.general_terms : [],
                    exclusion_heading: d.exclusion_heading || "เงื่อนไขที่อยู่นอกเหนือการรับประกัน",
                    exclusions: Array.isArray(d.exclusions) ? d.exclusions : [],

                    // ส่วนตารางเงื่อนไขสินค้า
                    product_warranty_heading: d.product_warranty_heading || "เงื่อนไขการรับประกันสินค้าประเภทต่างๆ",
                    product_warranty_desc: d.product_warranty_desc || "ระยะเวลาการประกัน ของแต่ละสินค้าจะไม่เท่ากัน ซึ่งสินค้าบางชนิดอาจไม่มีการรับประกัน...",
                    product_warranties: Array.isArray(d.product_warranties) ? d.product_warranties : [],

                    // ส่วนขั้นตอนการเคลม
                    claim_heading: d.claim_heading || "ขั้นตอนส่งเรื่องพิจารณาการใช้รับประกันสินค้า",
                    claim_steps: Array.isArray(d.claim_steps) ? d.claim_steps : [],
                    claim_notes: d.claim_notes || ""
                });
            } catch (e) {
                pushToast("error", "โหลดข้อมูลไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [token, router]);

    async function onSave() {
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/site/warranty`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ data: form }),
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

    // --- Helper Functions จัดการ General Terms ---
    const addTerm = () => setForm({ ...form, general_terms: [...form.general_terms, { title: "", desc: "" }] });
    const updateTerm = (idx, field, val) => {
        const newTerms = [...form.general_terms];
        newTerms[idx][field] = val;
        setForm({ ...form, general_terms: newTerms });
    };
    const removeTerm = (idx) => setForm({ ...form, general_terms: form.general_terms.filter((_, i) => i !== idx) });

    // --- Helper Functions จัดการ Exclusions ---
    const addExclusion = () => setForm({ ...form, exclusions: [...form.exclusions, ""] });
    const updateExclusion = (idx, val) => {
        const newEx = [...form.exclusions];
        newEx[idx] = val;
        setForm({ ...form, exclusions: newEx });
    };
    const removeExclusion = (idx) => setForm({ ...form, exclusions: form.exclusions.filter((_, i) => i !== idx) });

    // ✅ Helper Functions จัดการ ตารางสินค้า (Product Warranties)
    const addProductWarranty = () => setForm({ ...form, product_warranties: [...form.product_warranties, { type: "", covered: "", not_covered: "" }] });
    const updateProductWarranty = (idx, field, val) => {
        const newArr = [...form.product_warranties];
        newArr[idx][field] = val;
        setForm({ ...form, product_warranties: newArr });
    };
    const removeProductWarranty = (idx) => setForm({ ...form, product_warranties: form.product_warranties.filter((_, i) => i !== idx) });

    // --- Helper Functions จัดการ ขั้นตอนการเคลม (Claim Steps) ---
    const addClaimStep = () => setForm({ ...form, claim_steps: [...form.claim_steps, ""] });
    const updateClaimStep = (idx, val) => {
        const newSteps = [...form.claim_steps];
        newSteps[idx] = val;
        setForm({ ...form, claim_steps: newSteps });
    };
    const removeClaimStep = (idx) => setForm({ ...form, claim_steps: form.claim_steps.filter((_, i) => i !== idx) });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

                {/* --- Header --- */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">ADMIN</span>
                            <span className="text-slate-400 text-sm">/ Site Configuration</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Warranty Policy</h1>
                        <p className="text-slate-500 mt-1">จัดการนโยบายการรับประกันสินค้าและข้อยกเว้น</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all shadow-sm">
                            รีเฟรช
                        </button>
                        <button onClick={onSave} disabled={saving} className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-70 flex items-center gap-2">
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

                        {/* --- Section 1: หัวข้อหลัก --- */}
                        <SectionShell title="ข้อมูลทั่วไป" subtitle="หัวข้อหลักของนโยบาย">
                            <div className="w-full md:w-1/2">
                                <InputField
                                    label="หัวข้อหลัก (Heading)"
                                    value={form.heading}
                                    onChange={(v) => setForm({ ...form, heading: v })}
                                    placeholder="เช่น นโยบายการรับประกันสินค้า"
                                />
                            </div>
                        </SectionShell>

                        {/* --- Section 2 & 3: แบง 2 คอลัมน์ซ้ายขวา --- */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                            <SectionShell title="เงื่อนไขการรับประกัน" subtitle="รายละเอียดระยะเวลาและสิทธิ์ต่างๆ" right={<button onClick={addTerm} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-md font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"><i className="bx bx-plus"></i> เพิ่มรายการ</button>}>
                                <div className="space-y-4">
                                    {form.general_terms.map((term, idx) => (
                                        <div key={idx} className="relative bg-slate-50 border border-slate-200 rounded-lg p-5 pt-8">
                                            <button onClick={() => removeTerm(idx)} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white border border-red-100 text-red-500 rounded hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"><i className="bx bx-x text-lg"></i></button>
                                            <div className="space-y-4">
                                                <InputField label={`หัวข้อที่ ${idx + 1}`} value={term.title} onChange={v => updateTerm(idx, 'title', v)} placeholder="เช่น ระยะเวลาการรับประกัน" />
                                                <TextareaField label="รายละเอียด (Description)" value={term.desc} onChange={v => updateTerm(idx, 'desc', v)} rows={2} placeholder="รายละเอียดของเงื่อนไข..." />
                                            </div>
                                        </div>
                                    ))}
                                    {form.general_terms.length === 0 && <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">ยังไม่มีรายการเงื่อนไข</div>}
                                </div>
                            </SectionShell>

                            <SectionShell title="ข้อยกเว้นการรับประกัน" subtitle="กรณีที่อยู่นอกเหนือความคุ้มครอง" right={<button onClick={addExclusion} className="text-xs bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1.5 rounded-md font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"><i className="bx bx-plus"></i> เพิ่มข้อยกเว้น</button>}>
                                <div className="space-y-6">
                                    <InputField label="หัวข้อข้อยกเว้น (Exclusion Heading)" value={form.exclusion_heading} onChange={v => setForm({ ...form, exclusion_heading: v })} placeholder="เช่น เงื่อนไขที่อยู่นอกเหนือการรับประกัน" />
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 block border-b border-slate-100 pb-2">รายการข้อยกเว้น</label>
                                        {form.exclusions.map((ex, idx) => (
                                            <div key={idx} className="flex gap-3 items-start group">
                                                <div className="mt-2.5 text-slate-300"><i className="bx bx-radio-circle-marked"></i></div>
                                                <div className="flex-1"><textarea value={ex} onChange={e => updateExclusion(idx, e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none" rows={2} placeholder="เช่น สินค้าถูกดัดแปลง แก้ไข..." /></div>
                                                <button onClick={() => removeExclusion(idx)} className="mt-1 w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shrink-0 shadow-sm"><i className="bx bx-trash text-lg"></i></button>
                                            </div>
                                        ))}
                                        {form.exclusions.length === 0 && <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">ยังไม่มีรายการข้อยกเว้น</div>}
                                    </div>
                                </div>
                            </SectionShell>
                        </div>

                        {/* ✅ Section 4: ตารางเงื่อนไขตามประเภทสินค้า (ที่เคยตกหล่นไป) */}
                        <SectionShell
                            title="ตารางเงื่อนไขตามประเภทสินค้า"
                            subtitle="ตั้งค่าการรับประกันแยกตามชนิดของสินค้า"
                            right={
                                <button onClick={addProductWarranty} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-md font-bold hover:bg-amber-100 transition-colors flex items-center gap-1">
                                    <i className="bx bx-plus"></i> เพิ่มประเภทสินค้า
                                </button>
                            }
                        >
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="หัวข้อตาราง"
                                        value={form.product_warranty_heading}
                                        onChange={v => setForm({ ...form, product_warranty_heading: v })}
                                        placeholder="เช่น เงื่อนไขการรับประกันสินค้าประเภทต่างๆ"
                                    />
                                    <TextareaField
                                        label="คำอธิบายใต้หัวข้อ"
                                        value={form.product_warranty_desc}
                                        onChange={v => setForm({ ...form, product_warranty_desc: v })}
                                        rows={2}
                                        placeholder="เช่น ระยะเวลาการประกัน ของแต่ละสินค้าจะไม่เท่ากัน..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    {form.product_warranties.map((item, idx) => (
                                        <div key={idx} className="relative bg-slate-50 border border-slate-200 rounded-lg p-5 pt-8 shadow-sm">
                                            <button onClick={() => removeProductWarranty(idx)} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white border border-red-100 text-red-500 rounded hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                                                <i className="bx bx-x text-lg"></i>
                                            </button>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <div className="lg:col-span-1">
                                                    <TextareaField
                                                        label={`ประเภทสินค้าที่ ${idx + 1}`}
                                                        value={item.type}
                                                        onChange={v => updateProductWarranty(idx, 'type', v)}
                                                        rows={4}
                                                        placeholder="เช่น อุปกรณ์โซล่าเซลล์ทุกชนิด เช่น หมุดถนนพลังงานแสงอาทิตย์ โคมไฟกระพริบ..."
                                                    />
                                                </div>
                                                <div className="lg:col-span-2 space-y-4">
                                                    <TextareaField
                                                        label="เงื่อนไขที่รับประกัน (ส่วนบน)"
                                                        value={item.covered}
                                                        onChange={v => updateProductWarranty(idx, 'covered', v)}
                                                        rows={2}
                                                        placeholder="รับประกัน : สินค้าไม่สามารถเปิดใช้งานได้..."
                                                    />
                                                    <TextareaField
                                                        label="เงื่อนไขที่ไม่รับประกัน (ส่วนล่าง)"
                                                        value={item.not_covered}
                                                        onChange={v => updateProductWarranty(idx, 'not_covered', v)}
                                                        rows={2}
                                                        placeholder="ไม่รับประกัน : สกปรก มีรอยถลอกจากการใช้งาน..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {form.product_warranties.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                            ยังไม่มีรายการประเภทสินค้า
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SectionShell>

                        {/* ✅ Section 5: ขั้นตอนส่งเรื่องพิจารณาการเคลม */}
                        <SectionShell
                            title="ขั้นตอนส่งเรื่องพิจารณาการใช้รับประกันสินค้า"
                            subtitle="ข้อปฏิบัติและขั้นตอนการเคลม"
                            right={
                                <button onClick={addClaimStep} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-md font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                    <i className="bx bx-plus"></i> เพิ่มขั้นตอน
                                </button>
                            }
                        >
                            <div className="space-y-8">
                                <div className="w-full md:w-1/2">
                                    <InputField
                                        label="หัวข้อขั้นตอนการเคลม"
                                        value={form.claim_heading}
                                        onChange={v => setForm({ ...form, claim_heading: v })}
                                        placeholder="เช่น ขั้นตอนส่งเรื่องพิจารณาการใช้รับประกันสินค้า"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-slate-700 block border-b border-slate-100 pb-2">ลำดับขั้นตอน (กรอกรายละเอียด หรือ ข้อข้อย่อย 1.1, 1.2 ได้เลยในกล่องข้อความ)</label>
                                    {form.claim_steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 items-start group">
                                            <div className="mt-1 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full font-bold text-sm shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={step}
                                                    onChange={e => updateClaimStep(idx, e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
                                                    rows={3}
                                                    placeholder={`รายละเอียดขั้นตอนที่ ${idx + 1}...`}
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeClaimStep(idx)}
                                                className="mt-1 w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shrink-0 shadow-sm"
                                                title="ลบ"
                                            >
                                                <i className="bx bx-trash text-lg"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {form.claim_steps.length === 0 && (
                                        <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                            ยังไม่มีรายการขั้นตอน
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <TextareaField
                                        label="หมายเหตุเพิ่มเติมด้านล่าง (Footer Notes)"
                                        value={form.claim_notes}
                                        onChange={v => setForm({ ...form, claim_notes: v })}
                                        rows={4}
                                        placeholder="เช่น ทั้งนี้ บริษัทฯ ขอสงวนสิทธิ์ที่จะพิจารณาชี้ขาด... หรือคำเตือนการถ่ายวิดีโอ"
                                    />
                                </div>
                            </div>
                        </SectionShell>

                    </div>
                )}
            </div>
        </div>
    );
}