"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Services() {
  const services = [
    {
      title: "จัดส่งสินค้า",
      desc: "บริการจัดส่งสินค้าอย่างรวดเร็ว ปลอดภัย",
      images: "/images/delivery.png",
    },
    {
      title: "บริการติดตั้ง",
      desc: "ให้บริการติดตั้งอุปกรณ์ทุกประเภทโดยทีมช่างผู้เชี่ยวชาญ มาตรฐานมืออาชีพ",
      images: "/images/install.png",
    },
    {
      title: "ตรวจเช็กการทำงาน",
      desc: "ตรวจสอบประสิทธิภาพอุปกรณ์ พร้อมดูแลหลังการขายโดยผู้เชี่ยวชาญ",
      images: "/images/After-sales service.png",
    },
    {
      title: "รับประกันสินค้า",
      desc: "รับประกันสินค้าทุกชิ้น พร้อมบริการดูแล เปลี่ยน หรือซ่อมแซม",
      images: "/images/Productguarantee.png",
    },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 55, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="services" className="relative py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.h2
            className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            บริการของเรา
          </motion.h2>

          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
            ครบวงจรด้านอุปกรณ์คอมพิวเตอร์ ตั้งแต่จำหน่าย ติดตั้ง ไปจนถึงบริการหลังการขาย
          </p>

          <motion.div
            className="w-14 sm:w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="
            grid gap-4 sm:gap-8
            grid-cols-1 
            md:grid-cols-2 
            lg:grid-cols-4
            place-items-center
          "
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              whileHover={{
                y: -6,
                boxShadow:
                  "6px 6px 0px rgba(0,0,0,0.25), -3px -3px 0px rgba(255,255,255,0.5)",
              }}
              transition={{ duration: 0.3 }}
              className="
                group bg-white rounded-2xl
                p-4 sm:p-6 lg:p-7
                border-l-4 border-b-4 border-yellow-500
                shadow-[5px_5px_5px_rgba(0,0,0,0.20)]
                transition-all duration-300

                max-w-[260px] w-full
                sm:max-w-full
              "
            >
              {/* Image */}
              <motion.div
                whileHover={{ scale: 1.07, rotate: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-3 sm:mb-6 flex justify-center"
              >
                <img
                  src={service.images}
                  alt={service.title}
                  className="
                    w-20 h-20
                    sm:w-32 sm:h-32 
                    lg:w-40 lg:h-40 
                    object-contain 
                    drop-shadow-[2px_3px_3px_rgba(0,0,0,0.3)]
                  "
                />
              </motion.div>

              {/* Text */}
              <div className="text-center">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-yellow-600 transition">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-base text-gray-600 leading-relaxed mb-2 sm:mb-3">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
