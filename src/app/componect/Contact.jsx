"use client";
import React from "react";

export default function Contact() {
    return (
        <section id="contact" className="bg-neutral-900 text-white py-12 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
                {/* 🔹 ฝั่งข้อมูลติดต่อ */}
                <div className="space-y-5">
                    <div>
                        <h2 className="text-2xl font-semibold">ติดต่อเรา</h2>
                        <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                            สอบถามข้อมูล ขอใบเสนอราคา หรือติดต่อทีมงานของเราได้ทุกเวลา
                        </p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-slate-400">อีเมล</p>
                            <p className="font-medium hover:text-green-400 transition">
                                hello@company.co
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400">โทรศัพท์</p>
                            <p className="font-medium hover:text-green-400 transition">
                                099-420-0837
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400">ที่อยู่</p>
                            <p className="font-medium leading-relaxed">
                                311/1 ม.4 ต.คำน้ำแซบ <br />
                                อ.วารินชำราบ จ.อุบลราชธานี 34190
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400">เวลาทำการ</p>
                            <p className="font-medium">จันทร์ - ศุกร์ 08.00 - 17.00 น.</p>
                        </div>
                    </div>
                </div>

                {/* 🔹 แผนที่สำนักงาน */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold mb-1">ตำแหน่งที่ตั้งสำนักงาน</h3>
                    <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30801.33823928246!2d104.81621158814708!3d15.204009260745877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31168934ea2a73af%3A0xbc9f5816cefce4be!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4l-C4teC5gOC4iOC4i-C4tSDguITguK3guKPguYzguJvguK3guYDguKPguIrguLHguYjguJkg4LiI4LmN4Liy4LiB4Lix4LiU!5e0!3m2!1sth!2sth!4v1762829580390!5m2!1sth!2sth"
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
