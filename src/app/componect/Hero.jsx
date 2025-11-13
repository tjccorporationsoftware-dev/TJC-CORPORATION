"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0; // ควบคุมวินาทีเริ่มต้น
            video.play().catch((err) => console.log("Video play error:", err));
        }
    }, []);

    return (
        <div id="hero" >
            <div className=" w-full h-16  " ></div>
            <section  className="relative overflow-hidden h-[90vh] flex items-center text-white">
                {/* 🔹 วิดีโอพื้นหลัง */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/video/tjccoporation.mp4"
                />

                {/* 🔹 เลเยอร์ทึบโปร่ง */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* 🔹 เนื้อหาด้านหน้า */}
                <div className="relative z-10 max-w-6xl ml-[60px] px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <motion.h1
                            className="text-[40spx] md:text-[45px] font-extrabold tracking-tight leading-tight drop-shadow-lg"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 1 }}
                        >
                            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด
                        </motion.h1>

                        <motion.p
                            className="mt-6 text-lg md:text-xl max-w-[600px] text-gray-100 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            บริษัทผู้ให้บริการขาย ติดตั้ง และจัดส่งอุปกรณ์คอมพิวเตอร์
                            อุปกรณ์สำนักงานครบชุด อุปกรณ์ไอที รวมถึงครุภัณฑ์ทางการศึกษา
                            ด้วยมาตรฐานคุณภาพและการบริการที่เชื่อถือได้
                        </motion.p>
                        {/* 🔸 สถิติ */}
                        <motion.div
                            className="mt-2 flex items-center gap-5 text-gray-100 border-b border-gray-300 pt-6 pb-3 "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 1 }}
                        >
                            <div className="mt-10 grid grid-cols-3 gap-6 text-center text-white">
                                <div>
                                    <h3 className="text-4xl font-bold text-green-500">100+</h3>
                                    <p className="text-sm text-gray-200">ลูกค้าที่ไว้วางใจ</p>
                                </div>
                                <div>
                                    <h3 className="text-4xl font-bold text-green-500">85+</h3>
                                    <p className="text-sm text-gray-200">โปรเจกต์สำเร็จ</p>
                                </div>
                                <div>
                                    <h3 className="text-4xl font-bold text-green-500">10 ปี</h3>
                                    <p className="text-sm text-gray-200">ประสบการณ์ในวงการ</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
