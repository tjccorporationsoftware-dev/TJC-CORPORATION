"use client";

import React, { useState, useEffect } from "react";

export default function FloatingPotatoCorner() {
    const [showBubble, setShowBubble] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const messages = [
        "ยินดีต้อนรับสู่ TJC Corporation คัดสรรนวัตกรรมเพื่อคุณครับ .",
        "ตรวจสอบสเปกสินค้าและราคากลางได้ใน Catalog นี้ครับ .",
        "ต้องการใบเสนอราคาสำหรับงานโครงการ ติดต่อเราได้ทันที .",
        "อัปเดตเทคโนโลยีและอุปกรณ์ไอทีล่าสุดเพื่อธุรกิจของคุณ ."
    ];

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
    }, [isContactOpen]); // ทำงานใหม่เมื่อสถานะ Contact เปลี่ยน

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">

            {/* --- Bubble Section --- */}
            <div
                className={`
                    mb-4 transition-all duration-700 ease-out transform pointer-events-auto
                    ${showBubble ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"}
                `}
            >
                <div className="bg-white/95 backdrop-blur-md border border-zinc-100 p-5 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] relative w-64 min-h-27.5 flex flex-col justify-center">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DAA520] animate-pulse" />
                            <span className="text-[9px] font-black text-[#DAA520] tracking-[0.2em] uppercase opacity-80">
                                {isContactOpen ? "Contact Us" : "TJC Assistant"}
                            </span>
                        </div>
                        {isContactOpen && (
                            <button onClick={() => setIsContactOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <i className="bx bx-x text-lg"></i>
                            </button>
                        )}
                    </div>

                    {/* Content: สลับระหว่างข้อความปกติ กับ ข้อมูลติดต่อ */}
                    {!isContactOpen ? (
                        <p className={`
                            text-zinc-800 font-bold text-xs leading-relaxed transition-all duration-500
                            ${isFading ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"}
                        `}>
                            {messages[messageIndex]}
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Line Button */}
                            <a
                                href="https://lin.ee/kfKx9AW8" // 👈 แก้ Link Line ของคุณที่นี่
                                target="_blank"
                                className="flex items-center justify-between bg-[#06C755] text-white p-2.5 rounded-xl hover:brightness-105 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <i className="bx bxl-line text-xl"></i>
                                    <span className="text-xs font-black">@660gvigl</span>
                                </div>
                                <i className="bx bx-chevron-right"></i>
                            </a>

                            {/* Phone Button */}
                            <a
                                href="tel:0993613247" // 👈 แก้เบอร์โทรของคุณที่นี่
                                className="flex items-center justify-between bg-zinc-900 text-[#DAA520] p-2.5 rounded-xl hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <i className="bx bxs-phone-call text-xl"></i>
                                    <span className="text-xs font-black">099-361-3247</span>
                                </div>
                                <i className="bx bx-chevron-right text-white/50"></i>
                            </a>
                        </div>
                    )}

                    {/* หางของกล่องข้อความ */}
                    <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r border-b border-zinc-100 rotate-45" />
                </div>
            </div>

            {/* --- Avatar Section (Video) --- */}
            <button
                onClick={() => setIsContactOpen(!isContactOpen)}
                className={`
                    group pointer-events-auto relative w-32 h-32 overflow-hidden rounded-full border-4 transition-all duration-500
                    ${isContactOpen ? "border-[#DAA520] scale-110 shadow-[0_0_30px_rgba(218,165,32,0.3)]" : "border-gray-100 hover:border-[#DAA520]/50 shadow-xl"}
                    bg-white active:scale-95
                `}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    preload="metadata"
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                >
                    <source src="/video/vo002.mp4" type="video/mp4" />
                </video>

                {/* Overlay แสงเงาเวลา Hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-full pointer-events-none" />

                {/* Badge เล็กๆ บอกว่ากดได้ */}
                {!isContactOpen && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#DAA520] text-zinc-900 text-[8px] font-black px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        CLICK ME
                    </div>
                )}
            </button>
        </div>
    );
}