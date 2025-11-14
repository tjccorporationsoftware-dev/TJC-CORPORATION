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
        <div id="hero" className="mt-14 sm:mt-16">
            <section
                className="
                relative overflow-hidden 
                min-h-[88vh] 
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

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent"></div>

                <div
                    className="
                    relative z-10 w-full
                    px-5 sm:px-8 md:px-12
                    lg:ml-[60px]
                    mt-16 sm:mt-20 md:mt-10
                "
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="max-w-2xl mx-auto md:mx-0 text-center md:text-left"
                    >
                        {/* TITLE */}
                        <motion.h1
                            className="
                                font-extrabold leading-tight tracking-tight
                                text-white drop-shadow-[0_5px_12px_rgba(0,0,0,0.9)]
                                bg-linear-to-r from-white via-gray-200 to-[#d4af37]
                                bg-clip-text

                                text-[26px]
                                sm:text-[32px]
                                md:text-[38px]
                                lg:text-[44px]
                                xl:text-[48px]
                                2xl:text-[52px]
                            "
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด
                        </motion.h1>

                        {/* DESCRIPTION */}
                        <motion.p
                            className="
                                mt-4 sm:mt-5
                                text-[14px]
                                sm:text-[16px]
                                md:text-[18px]
                                lg:text-[20px]
                                leading-relaxed
                                max-w-[95%] md:max-w-[620px]
                                mx-auto md:mx-0
                                text-gray-100
                            "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            ผู้ให้บริการขาย ติดตั้ง และจัดส่งอุปกรณ์คอมพิวเตอร์และสำนักงานครบวงจร
                            รวมถึงครุภัณฑ์ทางการศึกษา ด้วยมาตรฐานคุณภาพและบริการระดับมืออาชีพ
                        </motion.p>

                        {/* STATS */}
                        <motion.div
                            className="mt-10 border-t border-gray-300/40 pt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3 }}
                        >
                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    xxs:grid-cols-2
                                    sm:grid-cols-3
                                    gap-5 sm:gap-6
                                    text-center
                                "
                            >
                                {[
                                    { num: "100+", label: "ลูกค้าที่ไว้วางใจ" },
                                    { num: "85+", label: "โปรเจกต์สำเร็จ" },
                                    { num: "10 ปี", label: "ประสบการณ์ในวงการ" },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="
                                            p-5 rounded-xl 
                                            bg-linear-to-br from-gray-800/70 to-gray-700/40 
                                            shadow-lg backdrop-blur-md
                                        "
                                    >
                                        <h3
                                            className="
                                                font-bold text-[#d4af37]
                                                text-[30px]
                                                sm:text-[36px]
                                                md:text-[42px]
                                                lg:text-[46px]
                                                xl:text-[52px]
                                            "
                                        >
                                            {item.num}
                                        </h3>
                                        <p
                                            className="
                                                text-white 
                                                text-[12px]
                                                sm:text-[14px]
                                                md:text-[15px]
                                                lg:text-[16px]
                                            "
                                        >
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
