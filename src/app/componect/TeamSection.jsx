"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamSection() {
  const [previewImg, setPreviewImg] = useState(null);

  const members = [
    { name: "นายสนั่น สุตัญจั้งใจ", role: "ประธานบริษัท", img: "/images/executive01.jpg" },
    { name: "นางประนอม สุตัญตั้งใจ", role: "รองประธานบริษัท", img: "/images/executive02.jpg" },
    { name: "นายอรรถสิทธิ์ สุตัญตั้งใจ", role: "ประธานเจ้าหน้าที่บริหาร", img: "/images/executive03.jpg" },
  ];

  return (
    <>
      {/* =================== MAIN SECTION =================== */}
      <motion.section
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.25 }}
        className="bg-linear-to-br from-white via-gray-50 to-gray-100 py-14 sm:py-18 md:py-20 lg:py-24 border-t border-gray-200"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-14 items-center">

          {/* 📸 Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -90 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.25 }}
            className="relative group rounded-3xl overflow-hidden shadow-[10px_10px_30px_rgba(0,0,0,0.08)] border border-gray-200"
          >
            <motion.img
              src="/images/tjc.jpg"
              alt="Company Building"
              className="w-full h-[280px] sm:h-[340px] md:h-[420px] lg:h-[480px] object-cover rounded-3xl transition-transform duration-1000 group-hover:scale-110 cursor-pointer"
              onClick={() => setPreviewImg("/images/tjc.jpg")}
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 via-gray-900/10 to-transparent rounded-3xl" />
            <div className="absolute inset-0 border-[3px] border-yellow-500/40 rounded-3xl" />
          </motion.div>

          {/* 👨‍💼 Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 90 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.25 }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-5 tracking-wide">
              ทีมผู้บริหารของเรา
            </h3>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
              ทีมผู้บริหารของเราประกอบด้วยผู้เชี่ยวชาญในหลากหลายสาขา
              ทั้งเทคโนโลยี การตลาด และการบริหารจัดการ
              มุ่งมั่นสร้างองค์กรที่เติบโตอย่างมั่นคงและยั่งยืน
              ด้วยความเป็นมืออาชีพและจิตวิญญาณแห่งนวัตกรรม
            </p>

            {/* สมาชิก */}
            <div className="space-y-5 sm:space-y-6">
              {members.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.7 + i * 0.15, ease: "easeOut" },
                  }}
                  viewport={{ once: false, amount: 0.25 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 6px 20px rgba(212,175,55,0.28)",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    transition: { duration: 0.28 },
                  }}
                  className="
                    flex items-center gap-4 sm:gap-5 
                    bg-white rounded-2xl 
                    border border-gray-200 
                    shadow-[6px_6px_0px_rgba(180,180,180,0.22)]
                    p-4 sm:p-5 md:p-6 
                    transition-all cursor-pointer
                  "
                  onClick={() => setPreviewImg(m.img)}
                >
                  <img
                    src={m.img}
                    alt={m.name}
                    className="
                      w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 
                      rounded-full object-cover object-top
                      border-2 border-yellow-500 shadow-md
                    "
                  />
                  <div className="text-left">
                    <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                      {m.name}
                    </h4>
                    <p className="text-yellow-700 text-xs sm:text-sm md:text-base font-medium">
                      {m.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* =================== LIGHTBOX MODAL =================== */}
      <AnimatePresence>
        {previewImg && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-999"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImg(null)}
          >
            <motion.img
              src={previewImg}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl object-contain border-4 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
