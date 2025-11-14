"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch((err) => console.log("Video play error:", err));
        }
    }, []);

    return (
        <div id="hero">
            <section className="relative overflow-hidden min-h-screen md:h-[92vh] flex items-center text-white">

                {/* 🎥 วิดีโอพื้นหลัง */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/video/1112.mp4" type="video/mp4" />
                </video>

                {/* 🌫️ Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-800/60 to-transparent"></div>

                {/* ✨ Content */}
                <div className="relative z-10 w-full px-6 sm:px-10 md:px-12 lg:ml-[60px]">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="max-w-2xl mx-auto md:mx-0 text-center md:text-left"
                    >

                        {/* 🏢 หัวข้อหลัก */}
                        <motion.h1
                            className="text-[32px] sm:text-[38px] md:text-[50px] lg:text-[56px] 
                                       font-extrabold leading-tight tracking-tight 
                                       text-white drop-shadow-[0_5px_12px_rgba(0,0,0,0.9)]
                                       bg-linear-to-r from-white via-[#f8f8f8] to-[#d4af37]
                                       bg-clip-text"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 1 }}
                        >
                            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด
                        </motion.h1>

                        {/* 📝 คำอธิบาย */}
                        <motion.p
                            className="mt-5 text-base sm:text-lg md:text-xl 
                                       max-w-[90%] md:max-w-[600px] mx-auto md:mx-0 
                                       text-gray-100 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            ผู้ให้บริการขาย ติดตั้ง และจัดส่งอุปกรณ์คอมพิวเตอร์ อุปกรณ์สำนักงานครบชุด
                            รวมถึงครุภัณฑ์ทางการศึกษา ด้วยมาตรฐานคุณภาพและบริการที่เชื่อถือได้
                        </motion.p>

                        {/* 🔸 สถิติ */}
                        <motion.div
                            className="mt-10 border-t border-gray-400/40 pt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 1 }}
                        >
                            <div className="
                                grid 
                                grid-cols-1 
                                sm:grid-cols-2 
                                lg:grid-cols-3 
                                gap-6 
                                text-center
                            ">
                                <div className="p-5 rounded-xl bg-linear-to-br from-gray-800/70 to-gray-700/40 shadow-lg backdrop-blur-md">
                                    <h3 className="text-4xl font-bold text-[#d4af37]">100+</h3>
                                    <p className="text-sm text-white">ลูกค้าที่ไว้วางใจ</p>
                                </div>

                                <div className="p-5 rounded-xl bg-linear-to-br from-gray-800/70 to-gray-700/40 shadow-lg backdrop-blur-md">
                                    <h3 className="text-4xl font-bold text-[#d4af37]">85+</h3>
                                    <p className="text-sm text-white">โปรเจกต์สำเร็จ</p>
                                </div>

                                <div className="p-5 rounded-xl bg-linear-to-br from-gray-800/70 to-gray-700/40 shadow-lg backdrop-blur-md">
                                    <h3 className="text-4xl font-bold text-[#d4af37]">10 ปี</h3>
                                    <p className="text-sm text-white">ประสบการณ์ในวงการ</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
