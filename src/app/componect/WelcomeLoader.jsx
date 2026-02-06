'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomeLoader({ onFinished }) {
    const [isFading, setIsFading] = useState(false);
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        // เริ่ม Animation zoom ทันทีที่โหลด
        setIsZooming(true);

        // แสดงหน้านี้ค้างไว้ 2.5 วินาที
        const timer = setTimeout(() => {
            setIsFading(true); // เริ่ม Animation จางหาย (Fade out ทั้งหน้า)

            // รอให้ Animation จางหายจบ (0.7 วินาที) แล้วค่อยแจ้งว่าโหลดเสร็จ
            setTimeout(() => {
                if (onFinished) onFinished();
            }, 700);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinished]);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Container หลัก สำหรับจัดการสัดส่วนภาพ */}
            <div className="relative w-full h-full md:w-full md:h-screen overflow-hidden">

                {/* 1. ส่วนรูปภาพ Background */}
                <div
                    className={`absolute inset-0 w-full h-full transition-transform duration-[3000ms] ease-out ${isZooming ? 'scale-105' : 'scale-100'
                        }`}
                >
                    <Image
                        src="/images/tjc-team.png"
                        alt="TJC Corporation Team"
                        fill
                        priority
                        className="object-cover object-center" // object-cover จะทำให้ภาพเต็มพื้นที่เสมอโดยไม่เสียสัดส่วน
                        sizes="100vw"
                    />
                </div>

                {/* 2. Overlay สีดำไล่เฉด (เพื่อให้ตัวหนังสืออ่านง่าย) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>

                {/* 3. ส่วนข้อความ (วางซ้อนบนภาพ) */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-24 px-4 text-center">
                    <div className="animate-fade-in-up space-y-3 md:space-y-5 max-w-4xl">

                        {/* หัวข้อรอง */}
                        <p className="text-gray-300 text-sm md:text-lg font-medium tracking-[0.2em] uppercase opacity-90">
                            Welcome to
                        </p>

                        {/* ชื่อบริษัท */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
                            TJC Corporation
                        </h1>

                        {/* คำบรรยายภาษาไทย */}
                        <div className="h-[2px] w-24 bg-white/50 mx-auto my-4 rounded-full"></div>
                        <p className="text-gray-200 text-base md:text-xl font-light drop-shadow-md">
                            ยินดีต้อนรับเข้าสู่ TJC corporation
                        </p>
                    </div>

                    {/* Loading Indicator แบบ Line ด้านล่างสุด */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                        <div className="h-full bg-white animate-loading-bar"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}