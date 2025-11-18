"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AboutHeader() {
  const [isReadyToHover, setIsReadyToHover] = useState(false);

  const items = [
    {
      title: "วิสัยทัศน์",
      desc: "เป็นบริษัทชั้นนำด้านเทคโนโลยีสารสนเทศและสื่อสาร สินค้าไอที และจัดจำหน่ายวัสดุครุภัณฑ์สำนักงานครุภัณฑ์ทางการศึกษาที่ดีที่สุดในประเทศไทยและสร้างความพึงพอใจให้ลูกค้าสูงสุด",
    },
    {
      title: "พันธกิจ",
      desc: "ส่งมอบโซลูชันเทคโนโลยีที่ทันสมัย ด้วยมาตรฐานระดับสากลและบริการที่เข้าใจผู้ใช้งานจริง",
    },
  ];

  /* ------- Responsive check ------- */
  const useScreen = (width) => {
    const [isMatch, setIsMatch] = useState(false);
    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      const listener = () => setIsMatch(media.matches);
      listener();
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [width]);
    return isMatch;
  };

  const isMobile = useScreen(640);

  /* ------- Improve Animation (Soft Floating + Blur + Scale) ------- */
  const fadeSoft = {
    hidden: { opacity: 0, y: 35, scale: 0.96, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: "easeOut" },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 45, scale: 0.97, filter: "blur(6px)" },
    show: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: "easeOut",
        delay: i * 0.18,     // สไลด์ทีละใบแบบ stagger
      },
    }),
  };

  return (
    <div id="about" className="bg-white">

      {/* ---------------- HEADER ---------------- */}
      <motion.section
        variants={fadeSoft}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative py-12 md:py-16 bg-linear-to-b from-gray-50 to-white overflow-hidden"
      >

        {/* Soft Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-44 h-44 bg-yellow-300/20 blur-[120px]" />

        <motion.h2
          variants={fadeSoft}
          className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-wide"
        >
          เกี่ยวกับบริษัท
        </motion.h2>

        <motion.p
          variants={fadeSoft}
          className="text-center text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 px-4 leading-relaxed"
        >
          บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด ให้บริการด้านจัดจำหน่าย
          และจัดซื้อจัดจ้างสำหรับหน่วยงานภาครัฐและเอกชน
          พร้อมนำเสนอเทคโนโลยีคุณภาพสู่ลูกค้าทั่วประเทศ
        </motion.p>
      </motion.section>

      {/* ---------------- VISION / MISSION CARDS ---------------- */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            onAnimationComplete={() => setIsReadyToHover(true)}
            whileHover={
              isReadyToHover
                ? {
                  scale: isMobile ? 1.02 : 1.045,
                  y: isMobile ? -2 : -4,
                  transition: { type: "spring", stiffness: 160, damping: 14 },
                  boxShadow: "0 18px 35px rgba(212,175,55,0.22)",
                }
                : {}
            }
            className="
              bg-white border border-gray-200 rounded-2xl
              px-6 py-7 shadow-[0_3px_10px_rgba(0,0,0,0.05)]
              transition-all duration-300 hover:border-yellow-500/60
            "
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-wide">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-[15px]">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
