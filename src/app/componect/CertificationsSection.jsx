"use client";
import React, { useState, useEffect, useRef } from "react";

export default function CertificationsSection() {
  const [selectedImage, setSelectedImage] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardRefs = useRef([]);

  const certs = [
    {
      title: "ISO 14001:2015",
      desc: "มาตรฐานระบบบริหารสิ่งแวดล้อมสากล ช่วยลดผลกระทบต่อสิ่งแวดล้อมและพัฒนาความยั่งยืนทางธุรกิจ",
      img: "/images/06.png",
    },
    {
      title: "ISO 9001:2015",
      desc: "มาตรฐานระบบบริหารคุณภาพสากล เพื่อให้ผลิตภัณฑ์และบริการได้คุณภาพและความพึงพอใจสูงสุด",
      img: "/images/07.png",
    },
  ];

  useEffect(() => {
    const animate = (el, anim) => {
      if (!el) return;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              el.classList.add(anim);
              ob.unobserve(el);
            }
          });
        },
        { threshold: 0.3 }
      );
      ob.observe(el);
    };

    animate(sectionRef.current, "fade-up-big");
    animate(titleRef.current, "fade-up-mid");
    animate(descRef.current, "fade-up-mid");

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${i * 0.25}s`;
      animate(el, "card-anim");
    });
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="opacity-0 bg-linear-to-b from-gray-50 via-white to-gray-100 py-20 border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center  justify-items-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight"
          >
            มาตรฐานและการรับรองคุณภาพ
          </h2>

          <p
            ref={descRef}
            className="opacity-0 text-lg text-gray-600 max-w-3xl mx-auto mb-14"
          >
            เราดำเนินธุรกิจตามมาตรฐานระดับสากล เพื่อให้ลูกค้าได้รับคุณภาพที่ดีที่สุด พร้อมความเชื่อถือได้สูงสุด
          </p>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 px-4" style={{ perspective: '1500px' }}>
            {certs.map((cert, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                onClick={() => setSelectedImage(cert.img)}
                className="
        group relative
        opacity-0 translate-y-10 scale-90
        cursor-pointer
        transition-all duration-500 ease-out
        w-full h-full
        [backface-visibility:hidden]
        will-change-transform
      "
              >
                {/* ตัวการ์ด 3D */}
                <div
                  className="
          relative h-full w-full
          bg-white
          rounded-3xl border border-gray-100
          shadow-xl
          group-hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.4)]
          p-6 flex flex-col items-center text-center
          transition-all duration-500 transform-gpu preserve-3d
          group-hover:transform-[rotateX(5deg)_rotateY(5deg)_translateY(-10px)]
        "
                  style={{ transformStyle: 'preserve-3d' }}
                >

                  {/* แสงสะท้อน Glass Shine */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />

                  {/* Layer 1: รูปภาพ */}
                  <div className="mb-6 transition-transform duration-500 ease-out group-hover:scale-105">
                    <div className="relative">
                      {/* เงาใต้รูป */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/20 rounded-full opacity-100"></div>
                      <img
                        src={cert.img}
                        alt={cert.title}
                        className="w-28 h-28 object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>

                  {/* Layer 2: ข้อความ */}
                  <div className="grow flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-amber-600 mb-3 tracking-tight antialiased">
                      {cert.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed antialiased">
                      {cert.desc}
                    </p>
                  </div>

                  {/* Decoration */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400"></div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-modal-fade"
        >
          <img
            src={selectedImage}
            alt="ใบรับรอง"
            className="
              max-w-[90vw] max-h-[85vh] 
              rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.35)]
              border-4 border-yellow-300/60
              animate-modal-scale
            "
          />
        </div>
      )}

      <style>{`
        /* FADE / CARD ANIM */
        .fade-up-big {
          animation: fadeUpBig 1s ease-out forwards;
        }
        .fade-up-mid {
          animation: fadeUpMid 0.9s ease-out forwards;
        }
        .card-anim {
          animation: cardFade 1s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes fadeUpBig {
          0% { opacity: 0; transform: translateY(80px) scale(0.9); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes fadeUpMid {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFade {
          0% { opacity: 0; transform: translateY(60px) scale(0.85) rotateX(6deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }

        /* MODAL */
        .animate-modal-fade {
          animation: modalFade 0.25s ease-out forwards;
        }
        .animate-modal-scale {
          animation: modalScale 0.25s ease-out forwards;
        }

        @keyframes modalFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalScale {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
