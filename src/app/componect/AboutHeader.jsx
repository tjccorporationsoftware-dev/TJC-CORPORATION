"use client";
import { motion } from "framer-motion";

export default function AboutHeader() {
  const items = [
    {
      title: "วิสัยทัศน์",
      desc: "เป็นพาร์ทเนอร์ด้านเทคโนโลยีที่เชื่อถือได้ พร้อมยกระดับองค์กรสู่อนาคตดิจิทัลอย่างยั่งยืน",
    },
    {
      title: "พันธกิจ",
      desc: "ส่งมอบโซลูชันเทคโนโลยีที่ทันสมัย ด้วยมาตรฐานระดับสากลและบริการที่เข้าใจผู้ใช้งานจริง",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div id="about" className="bg-white">

      {/* ---------------- HEADER ---------------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        className="relative py-14 bg-linear-to-b from-gray-50 to-white overflow-hidden"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-400/20 blur-[130px]" />

        <motion.h2
          variants={fadeUp}
          className="text-center text-4xl font-bold text-gray-800 tracking-wide"
        >
          เกี่ยวกับบริษัท
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="h-[3px] bg-linear-to-r from-gray-300 via-yellow-500 to-gray-300 mx-auto w-[100px] mt-3 rounded-full"
        />

        <motion.p
          variants={fadeUp}
          className="text-center text-base text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed"
        >
          บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด ให้บริการด้านจัดจำหน่าย
          และจัดซื้อจัดจ้างสำหรับหน่วยงานภาครัฐและเอกชน
          พร้อมนำเสนอเทคโนโลยีคุณภาพสู่ลูกค้าทั่วประเทศ
        </motion.p>
      </motion.section>

      {/* ---------------- VISION / MISSION ---------------- */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={cardAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 12px 30px rgba(212,175,55,0.22)",
            }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-gray-200 rounded-xl px-8 py-8 
                       shadow-[0_4px_14px_rgba(0,0,0,0.05)]
                       hover:border-yellow-500/60 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 shadow-md"></div>

              <h3 className="text-xl font-semibold text-gray-800 tracking-wide">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-[15.5px]">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
