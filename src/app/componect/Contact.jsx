"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Contact() {



    // ------------------ Animation ------------------
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <>
            <motion.section
                id="contact"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-linear-to-br from-white via-gray-50 to-gray-100 py-20 px-6 border-t border-gray-200"
            >
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">

                    {/* 🟡 ข้อมูลติดต่อ */}
                    <motion.div
                        variants={fadeUp}
                        className="
                            space-y-6 bg-white/80 backdrop-blur-sm 
                            rounded-2xl p-8 
                            shadow-[10px_10px_0px_rgba(180,180,180,0.3)] 
                            border border-[#d4af37]/50
                        "
                    >
                        <div>

                            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-10">
                                ติดต่อเรา
                            </h2>

                            <p className="mt-2 text-gray-700 leading-relaxed text-[16px]">
                                สอบถามข้อมูล ขอใบเสนอราคา หรือติดต่อทีมงานของเราได้ทุกเวลา
                                เรายินดีให้บริการด้วยความเป็นมืออาชีพ
                            </p>
                        </div>



                        <div className="space-y-0 flex flex-col gap-4 text-gray-700">

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 text-center">
                                    <i className="bx bx-envelope text-[#bfa334] text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">อีเมล</p>
                                    <p className="font-semibold hover:text-[#bfa334] transition">
                                        TJC.OFFICE21@gmail.com
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <Link href="tel:0994132744">
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="w-8 text-center">
                                        <i className="bx bx-phone-call text-[#bfa334] text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">โทรศัพท์</p>
                                        <p className="font-semibold hover:text-[#bfa334] transition">
                                            099-413-2744
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* HR Phone */}
                            <Link href="tel:0804746169">
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="w-8 text-center">
                                        <i className="bx bx-phone-call text-[#bfa334] text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">เบอร์กลางบริษัท HR</p>
                                        <p className="font-semibold hover:text-[#bfa334] transition">
                                            080-474-6169
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Line OA */}
                            <Link href="https://line.me/ti/p/dGpNTpUUdq" target="_blank">
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="w-8 text-center">
                                        <img src="/images/line2.png" className="w-7 mx-auto" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Line Official</p>
                                        <p className="font-semibold hover:text-[#bfa334] transition">
                                            @TJC-CORP
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 text-center pt-1">
                                    <i className="bx bx-map text-[#bfa334] text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ที่อยู่</p>
                                    <p className="font-semibold leading-relaxed">
                                        311/1 ม.4 ต.คำน้ำแซบ <br />
                                        อ.วารินชำราบ จ.อุบลราชธานี 34190
                                    </p>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 text-center">
                                    <i className="bx bx-time text-[#bfa334] text-2xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">เวลาทำการ</p>
                                    <p className="font-semibold">
                                        จันทร์ - ศุกร์ 08.00 - 17.00 น.
                                    </p>
                                </div>
                            </div>


                        </div>
                    </motion.div>

                    {/* 🗺️ แผนที่ */}
                    <motion.div
                        variants={fadeUp}
                        transition={{ delay: 0.2 }}
                        className="space-y-5"
                    >
                        <h3 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-10">
                            ตำแหน่งที่ตั้งสำนักงาน
                        </h3>

                        <div className="rounded-2xl overflow-hidden shadow-[10px_10px_0px_rgba(180,180,180,0.3)] border border-[#d4af37]/50">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30801.33823928246!2d104.81621158814708!3d15.204009260745877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31168934ea2a73af%3A0xbc9f5816cefce4be!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4l-C4teC5gOC4iOC4i-C4tSDguITguK3guKPguYzguJvguK3guYDguKPguIrguLHguYjguJkg4LiI4LmN4Liy4LiB4Lix4LiU!5e0!3m2!1sth!2sth!4v1762829580390!5m2!1sth!2sth"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </motion.div>

                </div>
            </motion.section>


        </>
    );
}
