"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function WorkJSFast() {
  const productRefs = useRef([]);
  productRefs.current = [];
  const addToRefs = (el) => {
    if (el && !productRefs.current.includes(el)) productRefs.current.push(el);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    productRefs.current.forEach((el, i) => {
      const distance = isMobile ? 40 : 80;
      el.style.opacity = 0;
      el.style.transform = `translateY(${i % 2 === 0 ? distance : -distance}px) scale(0.92)`;
      el.style.transition = `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${(i * 0.12).toFixed(2)}s`;
      observer.observe(el);
    });
  }, [isMobile]);

  const products = [
    { id: 1, category: "Visual", name: "โปรเจคเตอร์ (Projectors)", image: "/images/product/01.png", desc: "อุปกรณ์ฉายภาพคุณภาพสูง เหมาะสำหรับห้องเรียน ห้องประชุม และงานนำเสนอทุกรูปแบบ" },
    { id: 2, category: "Display", name: "จอโปรเจคเตอร์ไฟฟ้า (Electric Projector Screen)", image: "/images/product/10.png", desc: "จอโปรเจคเตอร์แบบควบคุมไฟฟ้า ให้ภาพคมชัด รองรับการใช้งานร่วมกับโปรเจคเตอร์ทุกประเภท" },
    { id: 3, category: "Computer", name: "คอมพิวเตอร์ตั้งโต๊ะ (PC Desktop)", image: "/images/product/03.png", desc: "คอมพิวเตอร์ประสิทธิภาพสูง เหมาะสำหรับงานสำนักงาน เรียนออนไลน์ และงานกราฟิก" },
    { id: 4, category: "Infrastructure", name: "เมาส์ (Mouse) และ คีย์บอร์ด (Keyboard)", image: "/images/product/pd3.jpg", desc: "อุปกรณ์ควบคุมการใช้งานคอมพิวเตอร์ เช่น เมาส์และคีย์บอร์ด ใช้งานได้กับระบบคอมพิวเตอร์ทุกรูปแบบ" }
  ];

  return (
    <section id="work" className="relative bg-linear-to-b from-white via-gray-50 to-gray-100 py-24 overflow-hidden">
      {/* Gold Ambient Lighting */}
      <div className="absolute -top-20 right-0 w-96 h-96 bg-yellow-300/20 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-gray-400/10 blur-[120px] rounded-full"></div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-16 justify-items-center ">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight"
        >
          สินค้าและโซลูชันของเรา
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">เราคัดสรรโซลูชันที่เน้นประสิทธิภาพ ดีไซน์ทันสมัย และตอบโจทย์การใช้งานจริงขององค์กร</motion.p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 relative z-10">
        {products.map((p) => (
          <div key={p.id} ref={addToRefs} className="group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:scale-[1.03] flex flex-col h-full">

            {/* Image */}
            <div className="h-48 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
              <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col grow">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{p.category}</span>
              <h3 className="mt-2 text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">{p.name}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{p.desc}</p>
              <a href="https://line.me/R/ti/p/~yourlineid" target="_blank" className="mt-auto inline-block w-full text-center bg-linear-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all">สอบถามเพิ่มเติม</a>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`.animate-show { transform: translateY(0) scale(1) !important; opacity: 1 !important; }`}</style>
    </section>
  );
}