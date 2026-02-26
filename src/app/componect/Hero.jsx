"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Hero() {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch((err) => console.log("Video play error:", err));
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="hero" className="mt-15 overflow-hidden">
            <section
                className="
                relative 
                min-h-[95vh]
                md:min-h-[92vh] 
                flex items-center 
                bg-white
            "
            >
                {/* Background Video Section */}
                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    >
                        <source src="/video/1112.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay: ปรับให้เข้มข้นขึ้นทางซ้ายเพื่อขับตัวหนังสือให้เด่น */}
                    <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/50 to-transparent"></div>
                    {/* Decorative Slanted Shape: แถบเฉียงซิกเนเจอร์จางๆ */}
                    <div className="absolute top-0 left-0 w-[40%] h-full bg-[#DAA520]/5 -skew-x-12 transform origin-top-left pointer-events-none" />
                </div>

                <div
                    className="
                    relative z-10 w-full
                    px-6 sm:px-8 md:px-12
                    lg:px-24
                "
                >
                    <div
                        className={`
                            max-w-4xl mx-auto md:mx-0 text-center md:text-left
                            transition-all duration-1000 ease-out transform
                            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                        `}
                    >
                        {/* TAG: สไตล์พรีเมียมพื้นดำตัวทอง */}
                        <div className="inline-flex items-center gap-3 mb-8 reveal-on-scroll">
                            <span className=" text-[#DAA520] font-black tracking-[0.25em] uppercase text-[10px] px-4 py-2 shadow-xl">
                                INNOVATING YOUR FUTURE
                            </span>
                        </div>

                        {/* TITLE: เน้นความหนาและจุดสีทอง */}
                        <h1
                            className={`
                                font-black leading-[0.9] tracking-tighter
                                text-white drop-shadow-xl
                                text-2xl
                                sm:text-5xl
                                md:text-7xl
                                lg:text-7xl
                                mb-8
                                transition-all duration-1000 ease-out delay-400 transform
                                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
                            `}
                        >
                            บริษัท ทีเจซี
                        </h1>
                        {/* TITLE: เน้นความหนาและจุดสีทอง */}
                        <h1
                            className={`
                                font-black leading-[0.9] tracking-tighter
                                text-white drop-shadow-xl
                                text-2xl
                                sm:text-5xl
                                md:text-7xl
                                lg:text-7xl
                                mb-3
                                transition-all duration-1000 ease-out delay-400 transform
                                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
                            `}
                        >
                           คอร์ปอเรชั่น จำกัด<span className="text-[#DAA520]">.</span>
                        </h1>

                        {/* DESCRIPTION */}
                        <p
                            className={`
                                text-base
                                sm:text-lg
                                md:text-xl
                                leading-relaxed
                                max-w-xl
                                mx-auto md:mx-0
                                text-zinc-300
                                mb-5
                                font-medium
                                transition-all duration-1000 ease-out delay-600
                                ${isVisible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            ผู้จัดจำหน่ายคอมพิวเตอร์และอุปกรณ์ไอทีครบวงจร
                            คัดสรรนวัตกรรมคุณภาพสูงเพื่อยกระดับธุรกิจของคุณให้เหนือกว่า
                        </p>

                        {/* CTA BUTTONS: สไตล์ High Contrast */}
                        <div
                            className={`
                                flex flex-wrap gap-5 justify-center md:justify-start
                                transition-all duration-1000 ease-out delay-800
                                ${isVisible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            <a
                                href="#contact"
                                className="
                                    px-10 py-4 
                                    bg-[#DAA520] hover:bg-[#E6C200]
                                    text-zinc-900 font-black rounded-sm
                                    shadow-lg hover:shadow-[#DAA520]/20
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    flex items-center gap-3
                                    text-xs uppercase tracking-widest
                                "
                            >
                                <i className='bx bxs-phone text-lg'></i>
                                ติดต่อเรา
                            </a>
                            <a
                                href="#services"
                                className="
                                    px-10 py-4
                                    bg-white/10 backdrop-blur-md hover:bg-white/20
                                    text-white font-black rounded-sm
                                    border border-white/20
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    flex items-center gap-3
                                    text-xs uppercase tracking-widest
                                "
                            >
                                <i className='bx bx-info-circle text-lg'></i>
                                เรียนรู้เพิ่มเติม
                            </a>
                        </div>

                        {/* STATS SECTION: ปรับสีเป็นทองสด */}
                        <div
                            className={`
                                mt-20 pt-10 border-t border-white/10
                                transition-all duration-1000 ease-out delay-1200
                                ${isVisible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            <div
                                className="
                                    grid
                                    grid-cols-3
                                    gap-8
                                    text-center md:text-left
                                "
                            >
                                {[
                                    { num: "3000+", label: "TRUSTED CLIENTS", icon: "bx-group" },
                                    { num: "5000+", label: "PROJECTS DONE", icon: "bx-check-circle" },
                                    { num: "10+ YRS", label: "EXPERIENCE", icon: "bx-time-five" },
                                ].map((item, index) => (
                                    <div key={index} className="group">
                                        <div className="flex flex-col md:flex-row items-center gap-3">
                                            <i className={`bx ${item.icon} text-3xl text-[#DAA520] mb-2 md:mb-0`}></i>
                                            <div>
                                                <h3 className="font-black text-[#DAA520] text-2xl sm:text-3xl lg:text-4xl leading-none">
                                                    {item.num}
                                                </h3>
                                                <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mt-1">
                                                    {item.label}
                                                </p>
                                            </div>
                                        </div>
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