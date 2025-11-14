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
    <section id="services" className="relative py-12 sm:py-16 md:py-20 bg-linear-to-b from-gray-50 to-white overflow-hidden">
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            บริการของเรา
          </motion.h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            ครบวงจรด้านอุปกรณ์คอมพิวเตอร์ ตั้งแต่จำหน่าย ติดตั้ง ไปจนถึงบริการหลังการขาย
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="
            grid gap-6 sm:gap-8
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-4
          "
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="
                group 
                bg-white
                rounded-2xl
                p-6 sm:p-8
                border-l-4 border-b-4 border-yellow-500
                shadow-[-3px_3px_0px_0px_rgba(234,179,8,0.25)]
                hover:shadow-[-5px_5px_0px_0px_rgba(234,179,8,0.4)]
                transition-all duration-400
                relative
                overflow-hidden
                h-full
                flex flex-col
                
                before:absolute before:inset-0 before:rounded-2xl
                before:border-2 before:border-gray-100
                before:pointer-events-none
                before:z-0
                
                after:absolute after:top-0 after:right-0 
                after:w-32 after:h-32 
                after:bg-linear-to-br after:from-yellow-400/10 after:to-transparent
                after:rounded-full after:blur-2xl
                after:-translate-y-1/2 after:translate-x-1/2
                after:group-hover:scale-150
                after:transition-transform after:duration-500
              "
            >
              {/* Image Container - Fixed Height */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex justify-center items-center relative z-10 h-40"
              >
                <img
                  src={service.images}
                  alt={service.title}
                  className="
                    w-32 h-32
                    object-contain 
                    drop-shadow-[3px_4px_6px_rgba(0,0,0,0.2)]
                    group-hover:drop-shadow-[4px_6px_8px_rgba(234,179,8,0.3)]
                    transition-all duration-300
                  "
                />
              </motion.div>

              {/* Text Container - Flexible Height */}
              <div className="text-center relative z-10 flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                  {service.desc}
                </p>

                {/* Decorative line */}
                <motion.div 
                  className="w-16 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 64 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}