"use client";
import React, { useEffect, useRef, useState } from "react";

export default function WorkJSFast() {
  const productRefs = useRef([]);
  productRefs.current = [];
  const addToRefs = (el) => { if (el && !productRefs.current.includes(el)) productRefs.current.push(el); };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    productRefs.current.forEach((el, i) => {
      const distance = isMobile ? 40 : 80; // ขยับเร็วขึ้น
      el.style.opacity = 0;
      el.style.transform = `translateY(${i % 2 === 0 ? distance : -distance}px) scale(0.95)`;
      el.style.transition = `all 0.5s ease-out ${(i * 0.1).toFixed(2)}s`; // duration สั้นลง, stagger เร็วขึ้น
      observer.observe(el);
    });
  }, [isMobile]);

  const products = [
        {
            id: 1,
            name: "อุปกรณ์วิทยาศาสตร์และเครื่องมือทดลองทางการศึกษา",
            image: "/images/product/pd1.png",
            desc: "ชุดอุปกรณ์วิทยาศาสตร์และเครื่องมือทดลองสำหรับห้องเรียนและห้องปฏิบัติการ ออกแบบเพื่อเสริมประสบการณ์การเรียนรู้เชิงปฏิบัติ",
        },
        {
            id: 2,
            name: "อุปกรณ์ฉายภาพ, สื่อโฆษณา และมัลติมีเดีย",
            image: "/images/product/pd2.png",
            desc: "อุปกรณ์ฉายภาพและโซลูชันสื่อโฆษณาครบวงจร เช่น โปรเจคเตอร์ จอแสดงผล และชุดมัลติมีเดียสำหรับงานนำเสนอทุกรูปแบบ",
        },
        {
            id: 3,
            name: "อุปกรณ์ไอทีและคอมพิวเตอร์",
            image: "/images/product/pd3.jpg",
            desc: "คอมพิวเตอร์ อุปกรณ์ไอที และระบบเครือข่ายสำหรับองค์กร รองรับงานตั้งแต่พื้นฐานจนถึงงานประมวลผลระดับสูง",
        },
        {
            id: 4,
            name: "ครุภัณฑ์ทางการศึกษา และ ครุภัณฑ์สำนักงาน",
            image: "/images/product/pd4.png",
            desc: "ครุภัณฑ์สำหรับสถานศึกษาและสำนักงาน เน้นความทนทาน ใช้งานได้ยาวนาน พร้อมรองรับการใช้งานหลากหลายรูปแบบ",
        },
    ];

  return (
    <section id="work" className="relative bg-linear-to-b from-white via-gray-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">สินค้าและโซลูชันของเรา</h2>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            เราเลือกสรรสินค้าที่เน้นคุณภาพ ทนทาน และตอบโจทย์การใช้งานจริงสำหรับองค์กร
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {products.map((p, i) => (
            <article
              key={p.id}
              ref={addToRefs}
              className="relative group rounded-2xl bg-white border border-gray-200 overflow-hidden hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
            >
              <div className="h-44 sm:h-48 md:h-52 overflow-hidden bg-gray-50">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-5 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-show {
          transform: translateY(0) scale(1) !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
