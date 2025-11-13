"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Work() {
    const products = [
        {
            id: 1,
            name: "อุปกรณ์คอมพิวเตอร์",
            image: "/images/JTEC.png",
            desc: "คอมพิวเตอร์และอุปกรณ์ต่อพ่วงคุณภาพสูงสำหรับองค์กรและสำนักงาน",
        },
        {
            id: 2,
            name: "อุปกรณ์สำนักงานครบชุด",
            image: "/images/origina.png",
            desc: "เครื่องใช้สำนักงานครบวงจร เพิ่มประสิทธิภาพการทำงานในทุกวัน",
        },
        {
            id: 3,
            name: "อุปกรณ์ไอที",
            image: "/images/page.png",
            desc: "อุปกรณ์เครือข่ายและเทคโนโลยีไอทีที่เสถียรและปลอดภัย",
        },
        {
            id: 4,
            name: "ครุภัณฑ์ทางการศึกษา",
            image: "/images/SMEGP.png",
            desc: "ชุดครุภัณฑ์และอุปกรณ์เพื่อการเรียนรู้ยุคดิจิทัล",
        },
    ];

    return (
        <section
            id="work"
            className="relative bg-linear-to-b from-white via-green-50/30 to-white py-24 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* 🔹 หัวข้อ */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false }}
                    className="text-center mb-7"
                >
                    <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
                        สินค้าและโซลูชันของเรา
                    </h2>
                    <p className="mt-3 text-gray-600 text-lg">
                        นวัตกรรม เทคโนโลยี และคุณภาพที่องค์กรไว้วางใจ
                    </p>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: false }}
                        className="mt-4 h-[3px] bg-green-600 mx-auto rounded-full"
                    ></motion.div>
                </motion.div>

                {/* 🔹 สินค้า */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {products.map((product, index) => {
                        const direction = index % 2 === 0 ? -80 : 80; // 🔁 บนลงล่างสลับล่างขึ้นบน
                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: direction }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.9,
                                    delay: index * 0.15,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                viewport={{ once: false, amount: 0.3 }}
                                whileHover={{
                                    scale: 1.04,
                                    y: -5,
                                    boxShadow: "0px 12px 30px rgba(16,185,129,0.2)",
                                }}
                                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-2xl transition-all duration-500"
                            >
                                {/* ภาพสินค้า */}
                                <div className="overflow-hidden relative">
                                    <motion.img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                                        whileHover={{ scale: 1.08 }}
                                    />

                                    {/* overlay fade-in */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* ข้อความ overlay */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute bottom-4 left-0 w-full text-center text-white opacity-0 group-hover:opacity-100 transition duration-500"
                                    >
                                        <p className="text-sm font-medium">
                                            คลิกเพื่อดูรายละเอียดเพิ่มเติม
                                        </p>
                                    </motion.div>
                                </div>

                                {/* เนื้อหา */}
                                <div className="p-6">
                                    <h4 className="font-semibold text-lg text-gray-800 text-center group-hover:text-green-700 transition-colors duration-300">
                                        {product.name}
                                    </h4>
                                    <p className="mt-3 text-sm text-gray-500 leading-relaxed text-center">
                                        {product.desc || "โซลูชันคุณภาพสำหรับธุรกิจยุคใหม่"}
                                    </p>

                                    <div className="mt-5 text-center">
                                        <a
                                            href="#"
                                            className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-all group"
                                        >
                                            ดูรายละเอียด
                                            <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
                                                →
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 🌟 แสงพื้นหลังเคลื่อนไหวเบา ๆ */}
            <motion.div
                initial={{ opacity: 0.2, x: -300 }}
                animate={{ opacity: 0.3, x: [-300, 300, -300] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl"
            />
        </section>
    );
}
