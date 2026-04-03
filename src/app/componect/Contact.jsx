"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function resolveUrl(u) {
    if (!u) return "";
    if (u.startsWith("/uploads/") || u.startsWith("uploads/")) {
        const cleanPath = u.startsWith("/") ? u : `/${u}`;
        return `${API_BASE}${cleanPath}`;
    }
    return u;
}

export default function Contact() {
    const [data, setData] = useState(null);

    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/site/contact`, { cache: "no-store" });
                const json = await res.json();
                if (!alive) return;
                setData(json?.data || null);
            } catch {
                if (!alive) return;
                setData(null);
            }
        }
        load();
        return () => {
            alive = false;
        };
    }, []);

    // JS Animation: สังเกตการเลื่อนหน้าจอแทน Framer Motion
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        entry.target.classList.remove("opacity-0", "translate-y-10");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        const elements = document.querySelectorAll(".animate-on-scroll");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [data]); // ทำงานใหม่เมื่อโหลดข้อมูลเสร็จและ render html แล้ว

    const d = data || {};

    const addressLines = useMemo(() => {
        if (Array.isArray(d.address_lines)) return d.address_lines;
        return [];
    }, [d]);

    return (
        <section
            id="contact"
            className="bg-linear-to-br from-white via-gray-50 to-gray-100 py-20 px-6 border-t border-gray-200"
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                {/* ข้อมูลติดต่อ */}
                <div
                    className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[10px_10px_0px_rgba(180,180,180,0.3)] border border-[#d4af37]/50"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-10">
                            {d.heading || "ติดต่อเรา"}
                        </h2>

                        <p className="mt-2 text-gray-700 leading-relaxed text-[16px]">
                            {d.description || "สอบถามข้อมูล ขอใบเสนอราคา หรือติดต่อทีมงานของเราได้ทุกเวลา"}
                        </p>
                    </div>

                    <div className="space-y-0 flex flex-col gap-4 text-gray-700">
                        {/* Email */}
                        {d.email && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 text-center">
                                    <i className="bx bx-envelope text-[#bfa334] text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">อีเมล</p>
                                    <a
                                        href={`mailto:${d.email}`}
                                        className="font-semibold hover:text-[#bfa334] transition"
                                    >
                                        {d.email}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Phone */}
                        {d.phone && (
                            <Link href={`tel:${String(d.phone).replace(/[^0-9+]/g, "")}`}>
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="w-8 text-center">
                                        <i className="bx bx-phone-call text-[#bfa334] text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">โทรศัพท์</p>
                                        <p className="font-semibold hover:text-[#bfa334] transition">{d.phone}</p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Line OA */}
                        {(d.line_url || d.line_label) && (
                            <Link href={d.line_url || "#"} target="_blank">
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="w-8 text-center">
                                        {d.line_icon_url ? (
                                            <img src={resolveUrl(d.line_icon_url)} className="w-7 mx-auto" alt="Line" />
                                        ) : (
                                            <i className="bx bxl-line text-[#bfa334] text-2xl"></i>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Line Official</p>
                                        <p className="font-semibold hover:text-[#bfa334] transition">
                                            {d.line_label || "Line"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Facebook (✅ ส่วนที่เพิ่มเข้ามาใหม่) */}
                        {(d.facebook_url || d.facebook_label) && (
                            <Link href={d.facebook_url || "#"} target="_blank">
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="w-8 text-center">
                                        <i className="bx bxl-facebook-circle text-[#bfa334] text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Facebook Page</p>
                                        <p className="font-semibold hover:text-[#bfa334] transition">
                                            {d.facebook_label || "Facebook"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Address */}
                        {addressLines.length > 0 && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 text-center pt-1">
                                    <i className="bx bx-map text-[#bfa334] text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ที่อยู่</p>
                                    <p className="font-semibold leading-relaxed">
                                        {addressLines.map((line, idx) => (
                                            <span key={idx}>
                                                {line}
                                                <br />
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Time */}
                        {d.open_hours && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 text-center">
                                    <i className="bx bx-time text-[#bfa334] text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">เวลาทำการ</p>
                                    <p className="font-semibold">{d.open_hours}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* แผนที่ */}
                <div
                    className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out space-y-5"
                    style={{ transitionDelay: "200ms" }}
                >
                    <h3 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-10">
                        {d.map_title || "ตำแหน่งที่ตั้งสำนักงาน"}
                    </h3>

                    {d.map_embed_url && d.map_embed_url.startsWith("http") ? (
                        <div className="rounded-2xl overflow-hidden shadow-[10px_10px_0px_rgba(180,180,180,0.3)] border border-[#d4af37]/50">
                            <iframe
                                src={d.map_embed_url}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Map Preview"
                            />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
                            ยังไม่ได้ตั้งค่าแผนที่
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}