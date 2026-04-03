"use client";
import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ชุด Icon แบบ Fix ตายตัว ตามลำดับ
const FIXED_ICONS = ["bx-time-five", "bx-calendar-check", "bx-user-check", "bx-file"];

export default function WarrantyPolicySection() {
    const [data, setData] = useState(null);

    // ดึงข้อมูลจาก API
    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/site/warranty`, { cache: "no-store" });
                const json = await res.json();
                if (!alive) return;
                setData(json?.data || null);
            } catch {
                if (!alive) return;
                setData(null);
            }
        }
        load();
        return () => { alive = false; };
    }, []);

    // JS Animation: ทำงานเมื่อข้อมูลโหลดเสร็จและ render ลง DOM แล้ว
    useEffect(() => {
        if (!data) return; // รอให้โหลดข้อมูลเสร็จก่อนค่อยผูก Animation

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
    const generalTerms = Array.isArray(d.general_terms) ? d.general_terms : [];
    const exclusions = Array.isArray(d.exclusions) ? d.exclusions : [];

    // ถ้ายังโหลดไม่เสร็จ ไม่ต้องแสดงอะไรเพื่อป้องกันจอแหว่ง
    if (!data) return null;

    return (
        <section id="warranty" className="relative bg-zinc-50 py-24 lg:py-32 overflow-hidden border-t border-zinc-200">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* --- Header --- */}
                <div className="text-center mb-16 opacity-0 max-w-3xl mx-auto scroll-element">
                    <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1 mb-6 shadow-sm">
                        <i className="bx bxs-shield-check text-[#DAA520] text-lg"></i>
                        <span className="text-zinc-600 font-bold tracking-widest uppercase text-[15px]">Warranty Policy</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">
                        {d.heading || "นโยบายการรับประกันสินค้า"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Side: General Terms */}
                    <div className="lg:col-span-7 space-y-6">
                        {generalTerms.map((item, idx) => {
                            // ดึง Icon มาใช้ตาม Index (ถ้าเกิน 4 กล่อง ให้ใช้ไอคอนแรกวนซ้ำ)
                            const iconClass = FIXED_ICONS[idx % FIXED_ICONS.length];

                            return (
                                <div
                                    key={idx}
                                    className="flex gap-5 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow opacity-0 scroll-element"
                                    style={{ animationDelay: `${idx * 0.15}s` }}
                                >
                                    <div className="flex-none w-12 h-12 bg-[#DAA520]/10 rounded-xl flex items-center justify-center text-[#DAA520]">
                                        <i className={`bx ${iconClass} text-2xl`}></i>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-zinc-900 mb-1">{item.title}</h4>
                                        <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Side: Exclusions */}
                    <div className="lg:col-span-5 opacity-0 scroll-element" style={{ animationDelay: "0.4s" }}>
                        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                                <i className="bx bx-error-circle text-[#d20909] text-4xl"></i>
                                {d.exclusion_heading || "เงื่อนไขที่อยู่นอกเหนือการรับประกัน"}
                            </h4>
                            <ul className="space-y-4 relative z-10">
                                {exclusions.map((text, idx) => (
                                    <li key={idx} className="flex gap-3 text-zinc-400 text-sm md:text-base font-medium leading-snug">
                                        <i className="bx bx-x-circle text-[#DAA520] mt-1 shrink-0 text-2xl"></i>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-zinc-500 italic">
                                * เงื่อนไขเป็นไปตามที่บริษัทกำหนด และอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .fade-up-anim { animation: fadeUpMid 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeUpMid {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}