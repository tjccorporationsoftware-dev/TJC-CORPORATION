"use client";
import React, { useEffect, useRef } from "react";

export default function Services3D() {
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

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

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
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    cardsRef.current.forEach((card) => observer.observe(card));
  }, []);

  return (
    <>
      <section
        id="services"
        ref={sectionRef}
        className="services-section opacity-0 py-20 sm:py-28 md:py-32 bg-linear-to-b from-gray-50 to-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="text-center mb-5 md:mb-5 opacity-0 fade-up" style={{ transitionDelay: "0.1s" }}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
              บริการของเรา
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              ครบวงจรด้านอุปกรณ์คอมพิวเตอร์ ตั้งแต่จำหน่าย ติดตั้ง ไปจนถึงบริการหลังการขาย
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-10 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={service.title}
                ref={addToRefs}
                className="service-card group opacity-0 transform translate-y-12 scale-95 transition-all duration-700 ease-out cursor-pointer hover:z-10"
                style={{ transitionDelay: `${0.15 * index}s` }}
              >
                {/* 3D Card ครอบทั้งรูปและข้อความ */}
                <div className="relative rounded-3xl w-76 overflow-hidden bg-white shadow-[0_10px_25px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.1)] border-l-4 border-b-4 border-yellow-500 transform transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgba(212,175,55,0.25),0_8px_20px_rgba(0,0,0,0.15)] p-6 sm:p-8 flex flex-col h-full">

                  {/* Image */}
                  <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden shadow-lg bg-gray-100 mb-6">
                    <img
                      src={service.images}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 rounded-2xl" />
                    <div className="absolute inset-0 bg-black/5 mix-blend-soft-light rounded-2xl" />
                  </div>

                  {/* Text */}
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed flex-1">
                      {service.desc}
                    </p>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto mt-6 rounded-full transition-all duration-700" />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .fade-up {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
    </>
  );
}
