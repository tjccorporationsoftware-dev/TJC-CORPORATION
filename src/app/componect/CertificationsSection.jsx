"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export default function CertificationsSection() {
    const [selectedImage, setSelectedImage] = useState(null);

    const certs = [
        {
            title: "ISO 14001:2015",
            desc: "มาตรฐานระบบบริหารสิ่งแวดล้อมสากล ช่วยลดผลกระทบต่อสิ่งแวดล้อมและพัฒนาความยั่งยืนทางธุรกิจ",
            img: "/images/รับรอง01.png",
        },
        {
            title: "ISO 9001:2015",
            desc: "มาตรฐานระบบบริหารคุณภาพสากล เพื่อให้ผลิตภัณฑ์และบริการได้คุณภาพและความพึงพอใจสูงสุด",
            img: "/images/รับรอง02.png",
        },
    ];

    return (
        <>
            {/* SECTION */}

            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.25 }}
                variants={fadeUp}
                className="bg-linear-to-b from-gray-50 via-white to-gray-100
                py-14 md:py-20 border-t border-gray-200"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

                    {/* TITLE */}
                    <motion.h2
                        variants={fadeUp}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3"
                    >
                        มาตรฐานและการรับรองคุณภาพ
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-10 md:mb-14"
                    >
                        เราดำเนินธุรกิจตามมาตรฐานระดับสากล เพื่อให้ลูกค้าได้รับคุณภาพที่ดีที่สุด
                        พร้อมความเชื่อถือได้สูงสุด
                    </motion.p>

                    {/* CARDS */}
                    <div
                        className="
                        grid gap-6 sm:gap-8 
                        sm:grid-cols-2
                        "
                    >
                        {certs.map((cert, index) => (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "8px 8px 0px rgba(212,175,55,0.35)",
                                    transition: { duration: 0.3 },
                                }}
                                className="
                                    bg-white rounded-2xl border border-gray-200
                                    shadow-[5px_5px_0px_rgba(180,180,180,0.25)]
                                    hover:shadow-[8px_8px_0px_rgba(212,175,55,0.35)]
                                    p-5 sm:p-6 lg:p-7 transition-all duration-500
                                    cursor-pointer
                                "
                                onClick={() => setSelectedImage(cert.img)}
                            >
                                <motion.img
                                    src={cert.img}
                                    alt={cert.title}
                                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 object-contain"
                                    whileInView={{ scale: [0.92, 1] }}
                                    transition={{ duration: 0.45 }}
                                />

                                <h3 className="text-lg sm:text-xl font-semibold text-yellow-700 mb-2">
                                    {cert.title}
                                </h3>

                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    {cert.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* MODAL */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            src={selectedImage}
                            alt="ใบรับรอง"
                            className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
