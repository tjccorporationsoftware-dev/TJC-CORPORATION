"use client";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ReviewsSection() {
    const reviews = [
        {
            name: "คุณศิริพร - บริษัท ABC จำกัด",
            comment:
                "บริการดีมาก ทีมงานให้คำแนะนำอย่างมืออาชีพ จัดส่งตรงเวลาและติดตั้งอย่างเรียบร้อย ประทับใจมากค่ะ!",
            img: "/images/user1.png",
            rating: 5,
        },
        {
            name: "คุณธนวัฒน์ - ห้างหุ้นส่วน T&C",
            comment:
                "สินค้าคุณภาพดี ราคาสมเหตุสมผล บริการหลังการขายยอดเยี่ยม ตอบไวมากครับ",
            img: "/images/user2.png",
            rating: 5,
        },
        {
            name: "คุณพิมพ์แข - โรงเรียนบ้านพัฒนา",
            comment:
                "ติดตั้งระบบคอมพิวเตอร์ทั้งโรงเรียน ใช้งานดีไม่มีปัญหา ทีมงานดูแลดีมากค่ะ",
            img: "/images/user3.png",
            rating: 4,
        },
    ];

    return (
        <motion.section
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            viewport={{ once: true, amount: 0.3 }} // <-- เล่นครั้งเดียว
            className="bg-linear-to-b from-white via-gray-50 to-white py-20 border-t border-gray-200"
        >
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* ⭐ หัวข้อ */}
                <motion.h2
                    className="text-4xl font-bold text-gray-800 mb-4"
                    variants={fadeUp}
                >
                    เสียงจากลูกค้าของเรา
                </motion.h2>
                <motion.p
                    className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
                    variants={fadeUp}
                >
                    ความพึงพอใจจากลูกค้าคือแรงผลักดันให้เราพัฒนาอย่างต่อเนื่อง
                </motion.p>

                {/* 💬 การ์ดรีวิว */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            className="bg-white rounded-2xl border border-gray-200 shadow-[6px_6px_0px_rgba(180,180,180,0.3)] hover:shadow-[8px_8px_0px_rgba(212,175,55,0.3)] p-6 transition-all duration-500"
                            variants={fadeUp}
                            whileHover={{
                                scale: 1.03,
                                rotate: 1,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.img
                                src={review.img}
                                alt={review.name}
                                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-yellow-500"
                                whileHover={{ scale: 1.1 }}
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {review.name}
                            </h3>
                            <p className="text-gray-600 italic mb-3">“{review.comment}”</p>

                            <div className="flex justify-center gap-1">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <span
                                        key={j}
                                        className={`text-lg ${j < review.rating ? "text-yellow-500" : "text-gray-300"
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
