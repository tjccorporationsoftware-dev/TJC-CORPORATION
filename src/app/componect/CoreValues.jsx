"use client";
import { motion } from "framer-motion";

export default function CoreValues() {
  const values = [
    { title: "นวัตกรรม", desc: "กล้าคิด กล้าทำสิ่งใหม่ ๆ เพื่อสร้างคุณค่า" },
    { title: "ความร่วมมือ", desc: "ทำงานเป็นทีมอย่างแข็งแกร่งเพื่อผลลัพธ์ที่ดีที่สุด" },
    { title: "คุณภาพ", desc: "มุ่งมั่นสร้างงานคุณภาพและมาตรฐานระดับสูง" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
      className="bg-linear-to-r from-white via-gray-50 to-gray-100 py-12 sm:py-16 md:py-20 lg:py-24 border-t border-gray-200"
      id="core-values"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-wide"
          >
            ค่านิยมองค์กร
          </motion.h3>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: i === 0 ? -50 : i === 2 ? 50 : 0,
                scale: 0.92,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                bounce: 0.15,
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,240,0.97)",
                boxShadow: "0px 4px 22px rgba(212,175,55,0.25)",
                transition: { duration: 0.25 },
              }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7 md:p-8 lg:p-10 text-center transition-all duration-300"
            >
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl md:text-2xl font-semibold text-yellow-700 mb-3"
              >
                {item.title}
              </motion.h4>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg"
              >
                {item.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
