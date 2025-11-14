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
        <div id="hero" className=" mt-16 " >
            <section className="
                relative overflow-hidden 
                min-h-screen 
                md:min-h-[92vh] 
                flex items-center 
                text-white
            ">

                {/* 🎥 Background Video */}
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

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent"></div>

                {/* Content */}
                <div className="
                    relative z-10 w-full 
                    px-4 xxs:px-5 xs:px-6 sm:px-10 md:px-12 
                    lg:ml-[60px] 
                    mt-20 sm:mt-24 md:mt-20
                ">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="max-w-2xl mx-auto md:mx-0 text-center md:text-left"
                    >

                        {/* Title */}
                        <motion.h1
                            className="
    font-extrabold leading-tight tracking-tight
    text-white drop-shadow-[0_5px_12px_rgba(0,0,0,0.9)]
    bg-linear-to-r from-white via-gray-200 to-[#d4af37]
    bg-clip-text

    text-[24px] sm:text-[28px] md:text-[34px] lg:text-[40px] xl:text-[44px] 2xl:text-[50px]
    whitespace-nowrap
    overflow-hidden
    truncate
  "
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด
                        </motion.h1>


                        {/* Description */}
                        <motion.p
                            className="
                                mt-4 sm:mt-5 
                                text-[14px] xxs:text-[15px] xs:text-[16px] 
                                sm:text-[17px] md:text-[19px] lg:text-[20px]
                                2xl:text-[22px] 3xl:text-[24px]

                                max-w-[95%] md:max-w-[620px]
                                mx-auto md:mx-0
                                text-gray-100 leading-relaxed
                            "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            ผู้ให้บริการขาย ติดตั้ง และจัดส่งอุปกรณ์คอมพิวเตอร์และสำนักงานครบวงจร
                            รวมถึงครุภัณฑ์ทางการศึกษา ด้วยมาตรฐานคุณภาพและบริการระดับมืออาชีพ
                        </motion.p>

                        {/* Stats */}
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
                                    sm:grid-cols-2 
                                    lg:grid-cols-3 
                                    gap-6 
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
                                        <h3 className="
                                            font-bold text-[#d4af37]
                                            text-[32px] sm:text-[38px] md:text-[42px] 
                                            lg:text-[46px] 2xl:text-[52px] 3xl:text-[60px]
                                        ">
                                            {item.num}
                                        </h3>
                                        <p className="
                                            text-white 
                                            text-[12px] xxs:text-[13px] sm:text-[14px] 
                                            md:text-[15px] lg:text-[16px]
                                        ">
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
