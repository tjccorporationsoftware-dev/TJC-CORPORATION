"use client";

import React, { useState, useEffect } from "react";

export default function FloatingPotatoCorner() {
    const [showBubble, setShowBubble] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    // รายการข้อความต้อนรับแบบทางการ
    const messages = [
        "ยินดีต้อนรับสู่ TJC Corporation คัดสรรนวัตกรรมเพื่อคุณครับ .",
        "ตรวจสอบสเปกสินค้าและราคากลางได้ใน Catalog นี้ครับ .",
        "ต้องการใบเสนอราคาสำหรับงานโครงการ ติดต่อเราได้ทันที .",
        "อัปเดตเทคโนโลยีและอุปกรณ์ไอทีล่าสุดเพื่อธุรกิจของคุณ ."
    ];

    useEffect(() => {
        // เด้งกล่องขึ้นมาครั้งแรกหลังจากโหลดหน้าเว็บ 1.5 วินาที
        const initialTimer = setTimeout(() => setShowBubble(true), 1500);

        // ระบบสลับข้อความทุกๆ 5 วินาที
        const interval = setInterval(() => {
            setIsFading(true); // เริ่มจางออก

            setTimeout(() => {
                setMessageIndex((prev) => (prev + 1) % messages.length);
                setIsFading(false); // เริ่มจางเข้าพร้อมข้อความใหม่
            }, 500); // ระยะเวลาจางออก (ครึ่งวินาที)

        }, 5000); // เปลี่ยนข้อความใหม่ทุก 5 วินาที

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end pointer-events-none">

            {/* กล่องข้อความต้อนรับ (Speech Bubble) */}
            <div
                className={`
                    mb-4 transition-all duration-700 ease-out transform pointer-events-auto
                    ${showBubble ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"}
                `}
            >
                <div className="bg-white/95 backdrop-blur-md border border-zinc-100 p-5 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] relative w-64 min-h-27.5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#DAA520] animate-pulse" />
                        <span className="text-[9px] font-black text-[#DAA520] tracking-[0.2em] uppercase opacity-80">
                            TJC Assistant
                        </span>
                    </div>

                    {/* ข้อความที่เปลี่ยนวนไปมาพร้อม Animation */}
                    <p className={`
                        text-zinc-800 font-bold text-xs leading-relaxed transition-all duration-500
                        ${isFading ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"}
                    `}>
                        {messages[messageIndex]}
                    </p>

                    {/* หางของกล่องข้อความ */}
                    <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r border-b border-zinc-100 rotate-45" />
                </div>
            </div>

            {/* ส่วนของวิดีโอตัวการ์ตูน */}
            <div className="w-32 h-32  drop-shadow-2xl overflow-hidden rounded-full border-4 bg-white border-gray-300 shadow-xl relative">
                <video
                    autoPlay
                    muted
                    loop
                    disablePictureInPicture
                    preload="metadata"
                    className="w-full h-full object-cover scale-110"
                >
                    <source src="/video/vo002.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-full pointer-events-none" />
            </div>
        </div>
    );
}