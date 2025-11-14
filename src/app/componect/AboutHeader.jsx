"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AboutHeader() {
  const [isReadyToHover, setIsReadyToHover] = useState(false);

  const items = [
    {
      title: "วิสัยทัศน์",
      desc: "เป็นบรฺิษัทชั้นนำด้านเทคโนโลยีสารสนเทศและสื่อสาร สินค้าไอที และจัดจำหน่ายวัสดุครุภัณฑ์สำนักงานครุภัณฑ์ทางการศึกษาที่ดีที่สุดในประเทศไทยและสร้างความพึงพอใจให้ลูกค้าสูงสุด",
    },
    {
      title: "พันธกิจ",
      desc: "ส่งมอบโซลูชันเทคโนโลยีที่ทันสมัย ด้วยมาตรฐานระดับสากลและบริการที่เข้าใจผู้ใช้งานจริง",
    },
  ];

  // ------- Detect screen width -------
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

  // ------- Animations -------
  const fadeUp = {
    hidden: { opacity: 0, y: isMobile ? 50 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: isMobile ? 55 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: "easeOut" },
    },
  };

  return (
    <div id="about" className="bg-white">
      {/* ---------------- HEADER ---------------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }} // ← ป้องกันกระพริบ
        className="
          relative
          py-10 sm:py-12 md:py-14 lg:py-16
          bg-linear-to-b from-gray-50 to-white 
          overflow-hidden
        "
      >
        <div
          className="
            absolute -top-24 left-1/2 -translate-x-1/2
            w-32 sm:w-44 lg:w-56 
            h-32 sm:h-44 lg:h-56 
            bg-yellow-400/20 blur-[120px]
          "
        />

        <motion.h2
          variants={fadeUp}
          className="
            text-center
            text-3xl sm:text-4xl lg:text-5xl
            font-bold text-gray-800 tracking-wide pt-4
          "
        >
          เกี่ยวกับบริษัท
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="
            h-[3px]
            bg-linear-to-r from-gray-300 via-yellow-500 to-gray-300
            mx-auto w-20 sm:w-[100px] md:w-[120px]
            mt-3 rounded-full
          "
        />

        <motion.p
          variants={fadeUp}
          className="
            text-center
            text-sm sm:text-base md:text-lg
            text-gray-600
            max-w-xl sm:max-w-2xl
            mx-auto mt-4 leading-relaxed
            px-4
          "
        >
          บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด ให้บริการด้านจัดจำหน่าย
          และจัดซื้อจัดจ้างสำหรับหน่วยงานภาครัฐและเอกชน
          พร้อมนำเสนอเทคโนโลยีคุณภาพสู่ลูกค้าทั่วประเทศ
        </motion.p>
      </motion.section>

      {/* ---------------- VISION / MISSION ---------------- */}
      <section
        className="
          max-w-6xl mx-auto
          px-4 sm:px-5 md:px-6
          py-10 sm:py-12 md:py-14
          grid grid-cols-1 md:grid-cols-2 
          gap-5 sm:gap-7 md:gap-8
        "
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={cardAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }} // ← ป้องกันกระพริบ!
            onAnimationComplete={() => setIsReadyToHover(true)}
            whileHover={
              isReadyToHover
                ? {
                  scale: isMobile ? 1.015 : 1.045,
                  y: isMobile ? -2 : -4,
                  transition: { type: "spring", stiffness: 180, damping: 14 },
                  boxShadow:
                    "0 14px 30px rgba(212,175,55,0.18), 0 0 10px rgba(150,150,150,0.1)",
                }
                : {}
            }
            className="
              bg-white border border-gray-200
              rounded-xl
              px-5 sm:px-6 md:px-7
              py-5 sm:py-6 md:py-7
              shadow-[0_3px_10px_rgba(0,0,0,0.04)]
              hover:border-yellow-500/60
              transition-all duration-300
            "
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="
                  w-2 h-2 rounded-full 
                  bg-linear-to-br from-yellow-400 to-yellow-600 
                "
              />
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
