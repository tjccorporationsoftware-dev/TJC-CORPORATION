"use client";
import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const resolveUrl = (u) => {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    if (u.startsWith("/images/")) return u;
    const cleanPath = u.startsWith("/") ? u : `/${u}`;
    return `${API_BASE}${cleanPath}`;
};

export default function CustomersCarousel({ speed = 40 }) {
    const [logos, setLogos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogos() {
            try {
                const res = await fetch(`${API_BASE}/api/customer-logos`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                const sorted = data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                setLogos(sorted);
            } catch (err) {
                console.error("Error loading logos:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchLogos();
    }, []);

    // เบิ้ลโลโก้ 3 ชุดเพื่อให้มั่นใจว่าแถวยาวพอที่จะเลื่อนได้ไม่สะดุด (Logic คงเดิม)
    const loopLogos = [...logos, ...logos, ...logos];

    if (loading || logos.length === 0) return null;

    return (
        <section className="relative py-24 lg:py-32 bg-white overflow-hidden border-t border-zinc-100">


            <div className="absolute top-0 right-0 w-[45%] h-full bg-zinc-50 -skew-x-12 transform origin-top-right pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[35%] h-[40%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-left pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">


                <div className="text-center mb-20 flex flex-col items-center">


                    <div className="flex items-center justify-center gap-3 mb-6">

                        <span className=" text-[#DAA520] font-black tracking-[0.25em] uppercase text-[10px] px-4 py-2 shadow-lg">
                            Trusted Partners
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-tight">
                        ลูกค้าที่ไว้วางใจเรา<span className="text-[#DAA520] text-5xl md:text-7xl">.</span>
                    </h2>

                    <p className="mt-8 text-zinc-500 text-lg md:text-xl font-semibold max-w-2xl mx-auto leading-relaxed">
                        ร่วมสร้างความสำเร็จไปกับ <span className="text-zinc-900 border-b-2 border-[#DAA520]">องค์กรชั้นนำ</span> ทั่วประเทศไทย
                    </p>
                </div>


                <div className="relative flex overflow-hidden group py-10">
                    <div
                        className="flex animate-scroll-infinite hover:[animation-play-state:paused]"
                        style={{
                            minWidth: "max-content",
                            animation: `scroll ${speed}s linear infinite`
                        }}
                    >
                        {loopLogos.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] p-8 mx-5 shrink-0 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(255,213,5,0.4)] hover:border-[#DAA520] hover:-translate-y-2"
                                style={{
                                    width: 250,
                                    height: 150,
                                }}
                            >
                                <img
                                    src={resolveUrl(item.image_url)}
                                    alt={item.name || "Customer Logo"}
                                    className="w-full h-full object-contain "
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Gradient Fade ปรับให้เข้มข้นขึ้นเพื่อความ Smooth */}
                    <div className="pointer-events-none absolute top-0 left-0 w-48 h-full bg-linear-to-r from-white via-white/70 to-transparent z-10" />
                    <div className="pointer-events-none absolute top-0 right-0 w-48 h-full bg-linear-to-l from-white via-white/70 to-transparent z-10" />
                </div>
            </div>

            {/* Keyframes (คงเดิมตาม Logic) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}} />
        </section>
    );
}