"use client";
import React from "react";
import { motion } from "framer-motion";

export default function About() {
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };
    const fadeLeft = {
        hidden: { opacity: 0, x: -60 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };
    const fadeRight = {
        hidden: { opacity: 0, x: 60 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div id="about" className="bg-linear-to-b from-gray-50 to-white overflow-hidden">

            {/* 🔶 ส่วนหัว */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="text-center pt-20 relative"
            >
                <div className="absolute -top-5 right-0 w-[350px] h-[350px] bg-yellow-200/20 blur-[150px] rounded-full"></div>
                <motion.h2
                    className="text-5xl font-bold text-gray-800 mb-4 tracking-wide"
                    whileHover={{ scale: 1.03, color: "#d4af37" }}
                >
                    เกี่ยวกับเรา
                </motion.h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    บริษัทของเรามุ่งมั่นพัฒนาโซลูชันดิจิทัลครบวงจร เพื่อขับเคลื่อนธุรกิจไทย
                    สู่อนาคตด้วยเทคโนโลยีที่ทันสมัยและยั่งยืน
                </p>
            </motion.section>

            {/* 🔸 วิสัยทัศน์ / พันธกิจ */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
                {[
                    {
                        title: "วิสัยทัศน์",
                        desc: "เป็นพาร์ทเนอร์ทางเทคโนโลยีที่องค์กรไว้วางใจ พร้อมขับเคลื่อนธุรกิจไทยสู่อนาคตดิจิทัล",
                    },
                    {
                        title: "พันธกิจ",
                        desc: "พัฒนาเทคโนโลยีที่ตอบโจทย์ผู้ใช้งาน ออกแบบระบบที่เสถียร ใช้งานง่าย และสร้างคุณค่าให้กับองค์กร",
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial="hidden"
                        whileInView="show"
                        variants={i % 2 === 0 ? fadeLeft : fadeRight}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: "8px 8px 20px rgba(212,175,55,0.25)",
                        }}
                        className="bg-white border border-gray-200 rounded-3xl p-10 shadow-[6px_6px_0px_rgba(200,200,200,0.3)] transition-all"
                    >
                        <h3 className="text-3xl font-semibold text-yellow-600 mb-4">
                            {item.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{item.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* 🔸 ค่านิยมองค์กร */}
            <motion.section
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-linear-to-r from-white via-gray-50 to-gray-100 py-20"
            >
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-12">
                        ค่านิยมองค์กร
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            { title: "💡 นวัตกรรม", desc: "กล้าคิด กล้าทำสิ่งใหม่ ๆ เพื่อสร้างคุณค่า" },
                            { title: "🤝 ความร่วมมือ", desc: "ทำงานเป็นทีมอย่างแข็งแกร่งเพื่อผลลัพธ์ที่ดีที่สุด" },
                            { title: "🎯 คุณภาพ", desc: "มุ่งมั่นสร้างงานคุณภาพและมาตรฐานระดับสูง" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{
                                    scale: 1.06,
                                    backgroundColor: "rgba(255,255,240,0.95)",
                                    boxShadow: "0 0 25px rgba(212,175,55,0.3)",
                                }}
                                className="bg-white border border-gray-200 rounded-3xl shadow-[6px_6px_0px_rgba(180,180,180,0.3)] p-8 transition-all"
                            >
                                <h4 className="text-2xl font-semibold text-yellow-700 mb-3">
                                    {item.title}
                                </h4>
                                <p className="text-gray-700 text-lg">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* 🔸 ภาพบริษัทและทีมผู้บริหาร */}
            <motion.section
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.3 }}
                className="relative bg-linear-to-br from-white via-gray-50 to-gray-100 py-24 border-t border-gray-200 overflow-hidden"
            >
                <div className="absolute -top-20 -right-20 w-100 h-100 bg-yellow-300/25 blur-[160px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center relative z-10">
                    {/* 📸 ภาพบริษัท */}
                    <motion.div
                        variants={fadeLeft}
                        whileHover={{ scale: 1.02 }}
                        className="relative group rounded-3xl overflow-hidden shadow-[10px_10px_30px_rgba(0,0,0,0.1)] border border-gray-200"
                    >
                        <motion.img
                            src="/images/tjc.jpg"
                            alt="Company Building"
                            className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 via-gray-900/10 to-transparent rounded-3xl"></div>
                        <div className="absolute inset-0 border-[3px] border-yellow-500/40 rounded-3xl"></div>
                    </motion.div>

                    {/* 👔 ทีมผู้บริหาร */}
                    <motion.div variants={fadeRight} className="text-center md:text-left">
                        <h3 className="text-4xl font-extrabold text-gray-800 mb-6">
                            ทีมผู้บริหารของเรา
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-10 text-lg max-w-lg">
                            ทีมผู้บริหารของเราประกอบด้วยผู้เชี่ยวชาญในหลากหลายสาขา
                            ทั้งเทคโนโลยี การตลาด และการบริหารจัดการ
                            มุ่งมั่นสร้างองค์กรที่เติบโตอย่างมั่นคงและยั่งยืน
                            ด้วยความเป็นมืออาชีพและจิตวิญญาณแห่งนวัตกรรม
                        </p>

                        <div className="space-y-6">
                            {[
                                { name: "นายธวัชชัย เจริญผล", role: "ประธานกรรมการบริหาร (CEO)", img: "/images/ceo.jpg" },
                                { name: "นางสาวพัชราภา มณีวงศ์", role: "ผู้อำนวยการฝ่ายเทคโนโลยี (CTO)", img: "/images/cto.jpg" },
                                { name: "นายปิยะพงษ์ สุวรรณโชติ", role: "ผู้อำนวยการฝ่ายการตลาด (CMO)", img: "/images/cmo.jpg" },
                            ].map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 6px 25px rgba(212,175,55,0.3)",
                                    }}
                                    className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-[6px_6px_0px_rgba(180,180,180,0.3)] p-5 transition-all"
                                >
                                    <img
                                        src={m.img}
                                        alt={m.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500 shadow-md"
                                    />
                                    <div className="text-left">
                                        <h4 className="text-lg font-semibold text-gray-800">{m.name}</h4>
                                        <p className="text-yellow-700 text-sm font-medium">{m.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* 🔸 จุดเด่นขององค์กร */}
            <motion.section
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-linear-to-r from-gray-100 to-white py-20"
            >
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-8">จุดเด่นของเรา</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            "ออกแบบระบบตามหลัก UX/UI ที่เหมาะสมกับผู้ใช้งานจริง",
                            "ใช้เทคโนโลยีสมัยใหม่ เช่น Next.js, Node.js, MySQL และ Cloud",
                            "บริการครบวงจร ตั้งแต่ให้คำปรึกษา วางระบบ ไปจนถึงดูแลหลังใช้งาน",
                            "ทีมงานมีความเชี่ยวชาญทั้งด้านเทคนิคและการสื่อสารกับลูกค้า",
                            "เน้นความปลอดภัยของข้อมูลและมาตรฐานการพัฒนาแบบมืออาชีพ",
                        ].map((text, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 4px 18px rgba(212,175,55,0.25)",
                                }}
                                className="bg-white border border-gray-200 rounded-xl shadow-[4px_4px_0px_rgba(200,200,200,0.4)] px-6 py-5 text-lg"
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* 🔸 ผลงาน */}
            <motion.section
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white py-20 border-t border-gray-100"
            >
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-8">
                        ผลงานที่น่าภาคภูมิใจ
                    </h3>
                    <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">
                        {[
                            "ระบบบริหารจัดการร้านค้าออนไลน์สำหรับผู้ประกอบการ SME",
                            "เว็บไซต์ตลาดซื้อขายผลงานศิลปะออนไลน์สำหรับศิลปินไทย",
                            "ระบบติดตามและจัดการคำสั่งซื้อแบบเรียลไทม์",
                            "แพลตฟอร์มชำระเงินออนไลน์ด้วย QR Code PromptPay",
                            "ระบบแชตและแจ้งเตือนระหว่างผู้ขาย–ผู้ซื้อ",
                            "เว็บระบบบริการองค์กรระดับภาครัฐ",
                        ].map((text, i) => (
                            <motion.li
                                key={i}
                                variants={fadeUp}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 6px 18px rgba(212,175,55,0.3)",
                                }}
                                className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-[6px_6px_0px_rgba(160,160,160,0.3)] p-6"
                            >
                                {text}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            

        </div>
    );
}
