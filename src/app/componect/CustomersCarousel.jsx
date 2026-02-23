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

    // เบิ้ลโลโก้ 3 ชุดเพื่อให้มั่นใจว่าแถวยาวพอที่จะเลื่อนได้ไม่สะดุด
    const loopLogos = [...logos, ...logos, ...logos];

    if (loading || logos.length === 0) return null;

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="mb-14">
                    <h3 className="text-3xl md:text-4xl font-black bg-linear-to-r from-amber-500 to-slate-700 bg-clip-text text-transparent leading-tight">
                        ลูกค้าที่ไว้วางใจเรา
                    </h3>
                    <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
                </div>

                {/* รางเลื่อนหลัก */}
                <div className="relative flex overflow-hidden group">
                    <div 
                        className="flex py-4 animate-scroll-infinite hover:[animation-play-state:paused]"
                        style={{
                            // บังคับให้เป็นแถวเดียวยาวๆ ห้ามขึ้นบรรทัดใหม่
                            minWidth: "max-content", 
                            // ใช้ CSS Animation ผ่าน Inline Style เพื่อความชัวร์
                            animation: `scroll ${speed}s linear infinite`
                        }}
                    >
                        {loopLogos.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mx-4 shrink-0 transition-transform duration-300 hover:scale-110"
                                style={{
                                    width: 220,
                                    height: 140,
                                }}
                            >
                                <img
                                    src={resolveUrl(item.image_url)}
                                    alt={item.name || "Customer Logo"}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Gradient Fade ปิดหัวท้ายเพื่อให้ดูเนียน */}
                    <div className="pointer-events-none absolute top-0 left-0 w-32 h-full bg-linear-to-r from-white via-white/40 to-transparent z-10" />
                    <div className="pointer-events-none absolute top-0 right-0 w-32 h-full bg-linear-to-l from-white via-white/40 to-transparent z-10" />
                </div>
            </div>

            {/* เพิ่ม Keyframes ลงใน globals.css หรือใส่ไว้ที่นี่ก็ได้ครับ */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}} />
        </section>
    );
}