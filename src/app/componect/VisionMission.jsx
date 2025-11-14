"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function VisionMission() {
  const ref = useRef(null);

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ["-15%", "0%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["15%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const items = [
    {
      title: "วิสัยทัศน์",
      desc: "เป็นพาร์ทเนอร์ทางเทคโนโลยีที่องค์กรไว้วางใจ พร้อมขับเคลื่อนธุรกิจไทยสู่อนาคตดิจิทัล",
    },
    {
      title: "พันธกิจ",
      desc: "พัฒนาเทคโนโลยีที่ตอบโจทย์ผู้ใช้งาน ออกแบบระบบที่เสถียร ใช้งานง่าย และสร้างคุณค่าให้กับองค์กร",
    },
  ];

  return (
    <div id="about">
      {/* SECTION: ABOUT HEADER -------------------------------- */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-center py-20 bg-linear-to-r from-gray-100 via-white to-gray-50 border-b border-gray-200"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false }}
          className="text-4xl font-bold text-gray-800 mb-3 tracking-wide"
        >
          เกี่ยวกับเรา
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="w-24 h-[3px] bg-linear-to-r from-yellow-500 to-yellow-600 mx-auto mb-6 rounded-full origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false }}
          className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด
          ดำเนินธุรกิจด้านการจัดจำหน่ายและให้บริการจัดซื้อจัดจ้าง สำหรับหน่วยงานภาครัฐ รัฐวิสาหกิจ
          และองค์กรเอกชนทั่วประเทศ โดยมุ่งเน้นการนำเสนอสินค้าและบริการที่มีคุณภาพ
          ตรงตามความต้องการของลูกค้าในทุกภาคส่วน
        </motion.p>
      </motion.section>

      {/* SECTION: VISION & MISSION ---------------------------- */}
      <section
        ref={ref}
        className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10"
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            style={{
              opacity,
              x: i % 2 === 0 ? xLeft : xRight,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "10px 10px 0px rgba(212,175,55,0.5)",
              transition: { duration: 0.25 },
            }}
            className="bg-white border border-gray-200 rounded-2xl p-10 shadow-[6px_6px_0px_rgba(150,150,150,0.25)] 
                       hover:shadow-[10px_10px_0px_rgba(212,175,55,0.3)] transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-yellow-600 mb-3 tracking-wide">
              {item.title}
            </h3>

            <p className="text-gray-700 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
