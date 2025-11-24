"use client";

import { useEffect, useState, useRef } from "react";

export default function AboutHeader() {
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

  /* ------------------- Animation System ------------------- */
  const fadeRefs = useRef([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const animate = (el, className) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add(className);
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
    };

    fadeRefs.current.forEach((el) => animate(el, "fade-up-big"));
    cardRefs.current.forEach((el, i) => {
      if (el) el.style.animationDelay = `${i * 0.25}s`;
      animate(el, "card-pop-big");
    });
  }, []);

  return (
    <div className="bg-white">

      {/* -------- HEADER -------- */}
      <section className="relative py-16 md:py-10 overflow-hidden">

        <div
          ref={(el) => (fadeRefs.current[0] = el)}
          className="opacity-0 translate-y-10"
        >
          <h2 className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800">
            เกี่ยวกับบริษัท
          </h2>

          <p className="text-center text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto mt-6 px-4 leading-relaxed">
            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด ให้บริการด้านจัดจำหน่าย
            และจัดซื้อจัดจ้างสำหรับหน่วยงานภาครัฐและเอกชน
            พร้อมนำเสนอเทคโนโลยีคุณภาพสู่ลูกค้าทั่วประเทศ
          </p>
        </div>
      </section>

      {/* -------- CARDS -------- */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">

        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="
              opacity-0 translate-y-10 scale-[0.9]
              bg-white border border-gray-200 rounded-3xl
              px-10 py-10 shadow-xl
              hover:scale-[1.05] hover:border-yellow-500 transition-all duration-300
            "
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg" />
              <h3 className="text-2xl font-semibold text-gray-800">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              {item.desc}
            </p>
          </div>
        ))}

      </section>

      <style>{`
                    /* -------- BIG FADE UP -------- */
            .fade-up-big {
              opacity: 1 !important;
              transform: translateY(0) scale(1) !important;
              filter: blur(0) !important;
              animation: fadeUpBig 1s ease-out;
            }

            @keyframes fadeUpBig {
              0% {
                opacity: 0;
                transform: translateY(60px) scale(0.92);
                filter: blur(8px);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }

            /* -------- CARD POP STRONG -------- */
            .card-pop-big {
              animation: cardPopBig 1.1s ease-out forwards;
            }

            @keyframes cardPopBig {
              0% {
                opacity: 0;
                transform: translateY(80px) scale(0.85);
                filter: blur(12px);
              }
              70% {
                transform: translateY(-8px) scale(1.06);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }

      `}</style>
    </div>
  );
}
