"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Hero() {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false); // state สำหรับคุม animation

    useEffect(() => {
        // จัดการ Video
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch((err) => console.log("Video play error:", err));
        }

        // Trigger Animation หลังจาก mount Component แล้วเล็กน้อย
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100); // delay เล็กน้อยเพื่อให้มั่นใจว่า render ครั้งแรกเสร็จแล้ว

        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="hero" className="mt-15">
            <section
                className="
                relative overflow-hidden 
                min-h-[95vh]
                md:min-h-[92vh] 
                flex items-center 
                text-white
            "
            >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center"
                >
                    <source src="/video/1112.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-black/40"></div>

                <div
                    className="
                    relative z-10 w-full
                    px-6 sm:px-8 md:px-12
                    lg:ml-16
                "
                >
                    {/* Main Container Wrapper */}
                    <div
                        className={`
                            max-w-4xl mx-auto md:mx-0 text-center md:text-left
                            transition-all duration-1000 ease-out transform
                            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                        `}
                    >
                        {/* TITLE */}
                        {/* Delay 0.4s (400ms) | Slide from y: -20 to y: 0 */}
                        <h1
                            className={`
                                font-bold leading-tight tracking-tight
                                text-white drop-shadow-2xl
                                text-3xl
                                sm:text-4xl
                                md:text-5xl
                                lg:text-6xl
                                mb-6
                                transition-all duration-1000 ease-out delay-400 transform
                                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
                            `}
                        >
                            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด
                        </h1>

                        {/* DESCRIPTION */}
                        {/* Delay 0.6s (600ms) */}
                        <p
                            className={`
                                text-base
                                sm:text-lg
                                md:text-xl
                                leading-relaxed
                                max-w-2xl
                                mx-auto md:mx-0
                                text-gray-200
                                mb-8
                                transition-all duration-1000 ease-out delay-600
                                ${isVisible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            ผู้จัดจำหน่ายคอมพิวเตอร์และอุปกรณ์ไอทีครบวงจร
                            พร้อมบริการติดตั้งและดูแลด้วยมาตรฐานระดับมืออาชีพ
                        </p>

                        {/* CTA BUTTONS */}
                        {/* Delay 0.8s (800ms) */}
                        <div
                            className={`
                                flex flex-wrap gap-4 justify-center md:justify-start
                                transition-all duration-1000 ease-out delay-800
                                ${isVisible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            <a
                                href="#contact"
                                className="
                                    px-8 py-3 
                                    bg-amber-600 hover:bg-amber-700
                                    text-white font-semibold rounded-lg
                                    shadow-lg hover:shadow-xl
                                    transition-all duration-300
                                    hover:scale-105
                                    flex items-center gap-2
                                "
                            >
                                <i className='bx bxs-phone'></i>
                                ติดต่อเรา
                            </a>
                            <a
                                href="#services"
                                className="
                                    px-8 py-3
                                    bg-white/10 backdrop-blur-md hover:bg-white/20
                                    text-white font-semibold rounded-lg
                                    border border-white/30
                                    transition-all duration-300
                                    hover:scale-105
                                    flex items-center gap-2
                                "
                            >
                                <i className='bx bx-info-circle'></i>
                                เรียนรู้เพิ่มเติม
                            </a>
                        </div>

                        {/* STATS */}
                        {/* Delay 1.2s (1200ms) */}
                        <div
                            className={`
                                mt-16 pt-8 border-t border-white/20
                                transition-all duration-1000 ease-out delay-1200
                                ${isVisible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            <div
                                className="
                                    grid
                                    grid-cols-3
                                    gap-6 sm:gap-8
                                    text-center
                                "
                            >
                                {[
                                    { num: "3000+", label: "ลูกค้าที่ไว้วางใจ", icon: "bx-group" },
                                    { num: "5000+", label: "โปรเจกต์สำเร็จ", icon: "bx-check-circle" },
                                    { num: "10+ ปี", label: "ประสบการณ์", icon: "bx-time-five" },
                                ].map((item, index) => (
                                    <div key={index}>
                                        <i className={`bx ${item.icon} text-4xl text-amber-400 mb-2`}></i>
                                        <h3
                                            className="
                                                font-bold text-amber-400
                                                text-2xl
                                                sm:text-3xl
                                                md:text-4xl
                                                mb-1
                                            "
                                        >
                                            {item.num}
                                        </h3>
                                        <p
                                            className="
                                                text-white/90
                                                text-xs
                                                sm:text-sm
                                                md:text-base
                                            "
                                        >
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}