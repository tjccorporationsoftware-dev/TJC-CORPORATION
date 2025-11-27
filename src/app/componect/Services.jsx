"use client";
import React, { useEffect, useRef, useState } from "react";

export default function ServicesSection() {
  const [activeCard, setActiveCard] = useState(null);

  const services = [
    { title: "จัดส่งสินค้า", desc: "บริการจัดส่งสินค้าอย่างรวดเร็ว ปลอดภัย ตรงเวลา ทั่วทุกภูมิภาค", images: "/images/delivery.png" },
    { title: "บริการติดตั้ง", desc: "ให้บริการติดตั้งอุปกรณ์ทุกประเภทโดยทีมช่างผู้เชี่ยวชาญ มาตรฐานมืออาชีพ", images: "/images/install.png" },
    { title: "ตรวจเช็กการทำงาน", desc: "ตรวจสอบประสิทธิภาพอุปกรณ์ พร้อมดูแลหลังการขายโดยผู้เชี่ยวชาญ", images: "/images/After-sales service.png" },
    { title: "รับประกันสินค้า", desc: "รับประกันสินค้า พร้อมบริการดูแล เปลี่ยน หรือซ่อมแซมตลอดอายุการใช้งาน", images: "/images/Productguarantee.png" }
  ];

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    cardsRef.current.forEach((card, i) => {
      if (card) {
        card.style.animationDelay = `${i * 0.12}s`;
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-24 bg-gray-50 overflow-hidden">
      {/* Subtle Gold Light Shapes */}
      <div className="absolute top-0 left-1/4 w-60 h-60 bg-yellow-300/15 blur-[100px] rounded-full rotate-12"></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-yellow-200/10 blur-[140px] rounded-full -rotate-6"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-300/12 blur-[120px] rounded-full rotate-45"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 opacity-0 justify-items-center ">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight py-2">
            บริการของเรา
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            ครบวงจรด้านอุปกรณ์คอมพิวเตอร์ ตั้งแต่จำหน่าย ติดตั้ง ไปจนถึงบริการหลังการขาย
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <div key={index} ref={(el) => (cardsRef.current[index] = el)} onMouseEnter={() => setActiveCard(index)} onMouseLeave={() => setActiveCard(null)} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full opacity-0">

              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img src={service.images} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Text */}
              <div className="px-5 py-6 flex flex-col grow text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 grow">
                  {service.desc}
                </p>
                
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-linear-to-r from-amber-400 via-yellow-500 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </section>
  );
}