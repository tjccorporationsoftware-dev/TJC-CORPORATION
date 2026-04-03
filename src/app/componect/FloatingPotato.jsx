"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, Phone, Mail, Facebook } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function FloatingPotatoCorner() {
    const [showBubble, setShowBubble] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [data, setData] = useState(null);

    const messages = [
        "ยินดีต้อนรับสู่ TJC Corporation คัดสรรนวัตกรรมเพื่อคุณครับ .",
        "ต้องการใบเสนอราคาสำหรับงานโครงการ ติดต่อเราได้ทันที .",
        "อัปเดตเทคโนโลยีและอุปกรณ์ไอทีล่าสุดเพื่อธุรกิจของคุณ ."
    ];

    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/site/contact`, { cache: "no-store" });
                const json = await res.json();
                if (alive) setData(json?.data || null);
            } catch (e) {
                if (alive) setData(null);
            }
        }
        load();
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        const initialTimer = setTimeout(() => setShowBubble(true), 1500);
        const interval = setInterval(() => {
            if (!isContactOpen) {
                setIsFading(true);
                setTimeout(() => {
                    setMessageIndex((prev) => (prev + 1) % messages.length);
                    setIsFading(false);
                }, 500);
            }
        }, 5000);
        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isContactOpen]);

    const d = data || {};

    const ContactItem = ({ href, label, icon, color, delay }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-end gap-4 group pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
            style={{ animationDelay: delay }}
        >
            <div className="relative bg-[#333333] text-white px-6 py-2.5 rounded-2xl text-[15px] font-bold shadow-2xl transition-all group-hover:-translate-x-2 group-hover:bg-black">
                {label}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-l-[10px] border-l-[#333333] border-b-[7px] border-b-transparent group-hover:border-l-black transition-colors"></div>
            </div>
            <div className={`w-[56px] h-[56px] ${color} rounded-full flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-110`}>
                {icon}
            </div>
        </a>
    );

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end pointer-events-none gap-5">

            {/* --- 1. เมนูติดต่อ --- */}
            {isContactOpen && (
                <div className="flex flex-col gap-5 mb-2">
                    {d.map_embed_url && (
                        <ContactItem
                            href={d.map_embed_url}
                            label="ดูแผนที่"
                            icon={<MapPin size={28} fill="currentColor" />}
                            color="bg-[#E14B3D]"
                            delay="0ms"
                        />
                    )}
                    {d.facebook_url && (
                        <ContactItem
                            href={d.facebook_url}
                            label="แชทผ่าน Facebook"
                            icon={<Facebook size={28} fill="currentColor" />}
                            color="bg-[#1877F2]"
                            delay="50ms"
                        />
                    )}
                    {d.line_url && (
                        <ContactItem
                            href={d.line_url}
                            label="แชทผ่าน LINE"
                            icon={
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                                    <path d="M24 10.304c0-5.23-5.383-9.486-12-9.486-6.617 0-12 4.256-12 9.486 0 4.69 4.27 8.606 10.022 9.362.39.084.92.258 1.054.592.12.302.079.774.038 1.079l-.164 1.002c-.049.303-.24 1.187 1.035.647 1.275-.54 6.879-4.05 9.387-6.932 1.739-1.892 2.628-3.716 2.628-5.75zm-15.54 3.731h-2.14a.375.375 0 01-.375-.375V8.527a.375.375 0 01.375-.375h.5a.375.375 0 01.375.375v4.264h1.265a.375.375 0 01.375.375v.5a.375.375 0 01-.375.375zm3.11 0h-.5a.375.375 0 01-.375-.375V8.527a.375.375 0 01.375-.375h.5a.375.375 0 01.375.375v5.133a.375.375 0 01-.375.375zm5.727 0h-.578a.372.372 0 01-.318-.178l-2.074-3.037v2.84a.375.375 0 01-.375.375h-.5a.375.375 0 01-.375-.375V8.527a.375.375 0 01.375-.375h.578c.127 0 .245.065.318.173l2.074 3.037v-2.835a.375.375 0 01.375-.375h.5a.375.375 0 01.375.375v5.133a.375.375 0 01-.375.375zm3.504-2.115h-1.265v-1.147h1.265a.375.375 0 01.375.375v.4a.375.375 0 01-.375.375zm0-2.148h-1.265V8.897h1.265a.375.375 0 01.375.375v.4a.375.375 0 01-.375.375zm.375 2.523a.375.375 0 01-.375.375h-2.14a.375.375 0 01-.375-.375V8.527a.375.375 0 01.375-.375h2.14a.375.375 0 01.375.375v.4a.375.375 0 01-.375.375h-1.265v1.148h1.265a.375.375 0 01.375.375v.4a.375.375 0 01-.375.375z" />
                                </svg>
                            }
                            color="bg-[#00B900]"
                            delay="100ms"
                        />
                    )}
                    {d.phone && (
                        <ContactItem
                            href={`tel:${d.phone}`}
                            label="โทรศัพท์"
                            icon={<Phone size={28} fill="currentColor" />}
                            color="bg-[#F7941E]"
                            delay="150ms"
                        />
                    )}
                    {d.email && (
                        <ContactItem
                            href={`mailto:${d.email}`}
                            label="ส่งอีเมล"
                            icon={<Mail size={28} />}
                            color="bg-[#4CB0A9]"
                            delay="200ms"
                        />
                    )}
                </div>
            )}

            {/* --- 2. กล่องข้อความต้อนรับ --- */}
            {!isContactOpen && showBubble && (
                <div className="mb-3 transition-all duration-700 ease-out transform pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-md border border-zinc-100 p-6 rounded-3xl shadow-2xl relative w-72 min-h-[90px] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-2 w-2 rounded-full bg-[#DAA520] animate-pulse" />
                            <span className="text-[10px] font-black text-[#DAA520] tracking-widest uppercase">TJC Assistant</span>
                        </div>
                        <p className={`text-zinc-800 font-bold text-sm leading-relaxed transition-all duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}>
                            {messages[messageIndex]}
                        </p>
                        <div className="absolute -bottom-2 right-12 w-5 h-5 bg-white border-r border-b border-zinc-100 rotate-45" />
                    </div>
                </div>
            )}

            {/* --- 3. ปุ่มหลัก (ขยายเป็น w-28 h-28) --- */}
            <button
                onClick={() => setIsContactOpen(!isContactOpen)}
                className={`
                    group pointer-events-auto relative w-28 h-28 overflow-hidden rounded-full transition-all duration-500 shadow-2xl active:scale-95 flex items-center justify-center
                    ${isContactOpen ? "bg-[#1877F2] rotate-180" : "bg-white border-4 border-white"}
                `}
            >
                {isContactOpen ? (
                    <X size={56} className="text-white animate-in zoom-in duration-300" />
                ) : (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture
                        controlsList="nopictureinpicture"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                    >
                        <source src="/video/vo002.mp4" type="video/mp4" />
                    </video>
                )}
            </button>
        </div>
    );
}