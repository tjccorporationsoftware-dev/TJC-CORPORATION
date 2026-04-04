"use client";
import React, { useEffect, useState, Suspense } from "react";
import Navbar from "../componect/Navbar";
import FloatingPotatoCorner from "../componect/FloatingPotato";
import FooterContact from "../componect/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ชุด Icon แบบ Fix ตายตัว ตามลำดับ
const FIXED_ICONS = ["bx-time-five", "bx-calendar-check", "bx-user-check", "bx-file"];

// ✅ Helper สำหรับแปลง JSON String กลับเป็น Array อย่างปลอดภัย
const safeParseArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }
    return [];
};

// --- 🚀 SCROLL TO TOP COMPONENT ---
const ScrollToTopBtn = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-52 z-[99] flex h-14 w-14 items-center justify-center bg-zinc-900 border border-[#DAA520]/30 shadow-2xl transition-all duration-500 group
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"}
        hover:bg-[#DAA520] hover:border-white rounded-[1rem]`}
        >
            <div className="flex flex-col items-center mt-1">
                <i className="bx bx-chevron-up text-3xl text-[#DAA520] group-hover:text-white transition-colors leading-none" />
                <span className="text-[9px] font-black text-white group-hover:text-zinc-900 uppercase tracking-widest -mt-1.5">TOP</span>
            </div>
        </button>
    );
};

function WarrantyContent() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลจาก API
    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/site/warranty`, { cache: "no-store" });
                const json = await res.json();
                if (!alive) return;
                setData(json?.data || null);
            } catch {
                if (!alive) return;
                setData(null);
            } finally {
                if (alive) setLoading(false);
            }
        }
        load();
        return () => { alive = false; };
    }, []);

    // JS Animation: ทำงานเมื่อข้อมูลโหลดเสร็จและ render ลง DOM แล้ว
    useEffect(() => {
        if (!data) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("fade-up-anim");
                        entry.target.classList.remove("opacity-0");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        const elements = document.querySelectorAll(".scroll-element");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [data]);

    const d = data || {};

    // ✅ ใช้ฟังก์ชัน safeParseArray ป้องกันข้อมูลหาย
    const generalTerms = safeParseArray(d.general_terms);
    const exclusions = safeParseArray(d.exclusions);
    const productWarranties = safeParseArray(d.product_warranties);
    const claimSteps = safeParseArray(d.claim_steps);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-zinc-100 border-t-[#DAA520] rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-(family-name:--font-ibm-plex-thai) selection:bg-[#DAA520]/30 pb-0 overflow-hidden relative">
            <Navbar />
            <FloatingPotatoCorner />

            <ScrollToTopBtn />

            {/* --- BACKGROUND DECOR --- */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 right-0 w-[60%] h-full bg-white -skew-x-12 transform origin-top-right opacity-40" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#DAA520]/5 rounded-full blur-[120px]" />
            </div>

            <section id="warranty" className="relative py-24 lg:py-32 xl:pt-48 min-h-screen">
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

                    {/* --- HEADER --- */}
                    <div className="text-center mb-20 opacity-0 max-w-3xl mx-auto scroll-element">
                        <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-5 py-1.5 mb-6 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)]">
                            <i className="bx bxs-shield-check text-[#DAA520] text-xl"></i>
                            <span className="text-zinc-600 font-black tracking-[0.25em] uppercase text-[12px] pt-0.5">Warranty Policy</span>
                        </div>
                        <h2 className="text-4xl md:text-[64px] font-black tracking-tighter  mb-8 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent filter drop-shadow-[0_0_2px_#fff]">
                            {d.heading || "นโยบายการรับประกันสินค้า"}
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#B49503] to-[#DAA520] mx-auto rounded-full shadow-sm"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-24">

                        {/* --- LEFT SIDE: GENERAL TERMS --- */}
                        <div className="lg:col-span-7 space-y-6">
                            {generalTerms.map((item, idx) => {
                                const iconClass = FIXED_ICONS[idx % FIXED_ICONS.length];
                                return (
                                    <div
                                        key={idx}
                                        className="group flex flex-col sm:flex-row gap-6 bg-white p-7 md:p-8 rounded-[2rem] border border-zinc-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(218,165,32,0.15)] hover:border-[#DAA520]/30 transition-all duration-500 opacity-0 scroll-element"
                                        style={{ animationDelay: `${idx * 0.15}s` }}
                                    >
                                        <div className="flex-none w-16 h-16 bg-zinc-50 group-hover:bg-[#DAA520] rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors duration-500">
                                            <i className={`bx ${iconClass} text-3xl`}></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xl md:text-2xl font-bold text-zinc-900 mb-3 tracking-tight group-hover:text-[#DAA520] transition-colors">{item.title}</h4>
                                            <p className="text-zinc-500 font-medium leading-relaxed md:text-lg">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* --- RIGHT SIDE: EXCLUSIONS (PREMIUM GOLD EDITION) --- */}
                        <div className="lg:col-span-5 opacity-0 scroll-element" style={{ animationDelay: "0.4s" }}>
                            {/* เปลี่ยนพื้นหลังเป็นสีทอง Luxury Gradient พร้อมเงาสะท้อนเรืองแสง */}
                            <div className="bg-gradient-to-br from-[#FCE883] via-[#DAA520] to-[#997300] rounded-[2.5rem] p-8 md:p-10 text-zinc-900 relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(218,165,32,0.4)] border border-white/40">

                                {/* เอฟเฟกต์แสงสว่างวาบที่มุมขวาบน (Glossy Flare) */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>
                                {/* เอฟเฟกต์แสงสะท้อนด้านล่างซ้าย */}
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD700]/30 rounded-full blur-[70px] -ml-20 -mb-20 pointer-events-none"></div>

                                {/* ลวดลายเส้นกรอบทองคำแบบบางๆ เพิ่มความหรูหรา (Filigree/Accent lines) */}
                                <div className="absolute top-6 right-6 w-24 h-24 border-t border-r border-white/30 rounded-tr-[1rem] pointer-events-none"></div>
                                <div className="absolute bottom-6 left-6 w-24 h-24 border-b border-l border-white/30 rounded-bl-[1rem] pointer-events-none"></div>

                                <h4 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-4 tracking-tight relative z-10 text-zinc-950">
                                    {/* กล่องไอคอนสีขาว ขับให้กากบาทสีแดงเด่นขึ้น */}
                                    <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-600 shrink-0 shadow-xl shadow-black/10 border border-white">
                                        <i className="bx bx-x text-3xl"></i>
                                    </div>
                                    {d.exclusion_heading || "เงื่อนไขที่อยู่นอกเหนือการรับประกัน"}
                                </h4>

                                <ul className="space-y-5 relative z-10">
                                    {exclusions.map((text, idx) => (
                                        <li key={idx} className="flex gap-4 text-zinc-900 text-[15px] md:text-base font-bold leading-relaxed">
                                            {/* จุด List เปลี่ยนเป็นสีขาวเรืองแสง */}
                                            <i className="bx bxs-circle text-white mt-1.5 shrink-0 text-[10px] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"></i>
                                            {text}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10 pt-6 border-t border-zinc-900/10 text-[13px] md:text-sm text-zinc-800 font-bold relative z-10">
                                    * เงื่อนไขเป็นไปตามที่บริษัทกำหนด และอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- PRODUCT WARRANTIES TABLE --- */}
                    {productWarranties.length > 0 && (
                        <div className="mb-24 opacity-0 scroll-element pt-10">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="text-[#DAA520] font-black tracking-[0.2em] uppercase text-[12px]">Product Categories</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tighter uppercase">{d.product_warranty_heading}</h3>
                                {d.product_warranty_desc && <p className="text-zinc-500 max-w-3xl mx-auto leading-relaxed text-lg md:text-xl font-medium">{d.product_warranty_desc}</p>}
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] border border-zinc-100 overflow-hidden">
                                <div className="hidden md:grid grid-cols-12 bg-zinc-900 text-white font-bold text-[15px] tracking-[0.1em] uppercase">
                                    <div className="col-span-5 p-6 pl-10 border-r border-white/10">ประเภทสินค้า</div>
                                    <div className="col-span-7 p-6 pl-10">เงื่อนไขการรับประกัน</div>
                                </div>

                                <div className="divide-y divide-zinc-100">
                                    {productWarranties.map((pw, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 hover:bg-zinc-50/80 transition-colors group">
                                            <div className="col-span-1 md:col-span-5 p-6 md:p-8 md:pl-10 md:border-r border-zinc-100 flex items-center">
                                                <span className="text-zinc-800 font-bold text-lg md:text-xl whitespace-pre-wrap leading-relaxed group-hover:text-[#DAA520] transition-colors">
                                                    {pw.type}
                                                </span>
                                            </div>
                                            <div className="col-span-1 md:col-span-7 p-6 md:p-8 md:pl-10 space-y-6 flex flex-col justify-center">
                                                {pw.covered && (
                                                    <div className="flex gap-4 items-start">
                                                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                            <i className="bx bx-check text-lg"></i>
                                                        </div>
                                                        <p className="text-[15px] md:text-base text-zinc-700 whitespace-pre-wrap leading-relaxed font-medium">
                                                            {pw.covered}
                                                        </p>
                                                    </div>
                                                )}
                                                {pw.not_covered && (
                                                    <div className="flex gap-4 items-start">
                                                        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                            <i className="bx bx-x text-lg"></i>
                                                        </div>
                                                        <p className="text-[15px] md:text-base text-zinc-500 whitespace-pre-wrap leading-relaxed font-medium">
                                                            {pw.not_covered}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CLAIM STEPS --- */}
                    {(claimSteps.length > 0 || d.claim_heading) && (
                        <div className="max-w-4xl mx-auto opacity-0 scroll-element pt-10">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="text-[#DAA520] font-black tracking-[0.2em] uppercase text-[12px]">How to Claim</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase">{d.claim_heading}</h3>
                            </div>

                            <div className="space-y-6">
                                {claimSteps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-5 lg:gap-8 items-start bg-white p-6 md:p-8 rounded-[2rem] border border-zinc-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DAA520] to-[#B49503] text-white font-black flex items-center justify-center text-2xl shadow-lg shadow-[#DAA520]/20 shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="text-zinc-700 leading-relaxed font-medium text-lg whitespace-pre-wrap pt-1 sm:pt-3">
                                            {step}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Notes */}
                            {d.claim_notes && (
                                <div className="mt-14 bg-zinc-900 rounded-[2rem] p-8 md:p-10 text-center relative overflow-hidden shadow-2xl border border-zinc-800">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(218,165,32,0.15)_0%,transparent_70%)] pointer-events-none"></div>
                                    <div className="relative z-10 flex flex-col items-center gap-5">
                                        <i className="bx bxs-info-circle text-[#DAA520] text-4xl drop-shadow-[0_0_10px_rgba(218,165,32,0.5)]"></i>
                                        <div className="text-zinc-300 font-medium whitespace-pre-wrap leading-relaxed text-[15px] md:text-lg">
                                            {d.claim_notes}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <style jsx global>{`
                    .fade-up-anim { animation: fadeUpMid 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    @keyframes fadeUpMid {
                        0% { opacity: 0; transform: translateY(40px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </section>
            <FooterContact />
        </div>
    );
}

export default function WarrantyPolicyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <WarrantyContent />
        </Suspense>
    );
}