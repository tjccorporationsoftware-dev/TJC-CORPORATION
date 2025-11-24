"use client";
import React, { useState, useEffect, useRef } from "react";

export default function CertificationsSection() {
  const [selectedImage, setSelectedImage] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardRefs = useRef([]);
  const modalRef = useRef(null);

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
        className="opacity-0 bg-linear-to-b from-gray-50 via-white to-gray-100 py-16 md:py-20 border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2
            ref={titleRef}
            className="opacity-0 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            มาตรฐานและการรับรองคุณภาพ
          </h2>

          <p
            ref={descRef}
            className="opacity-0 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-12"
          >
            เราดำเนินธุรกิจตามมาตรฐานระดับสากล เพื่อให้ลูกค้าได้รับคุณภาพที่ดีที่สุด พร้อมความเชื่อถือได้สูงสุด
          </p>

          <div className="grid gap-8 sm:grid-cols-2">
            {certs.map((cert, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                onClick={() => setSelectedImage(cert.img)}
                className="opacity-0 translate-y-10 scale-90 bg-white rounded-2xl border border-gray-200 shadow-[5px_5px_0px_rgba(180,180,180,0.25)] p-7 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-yellow-50"
              >
                <img
                  src={cert.img}
                  alt={cert.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 object-contain"
                />

                <h3 className="text-xl sm:text-2xl font-semibold text-yellow-700 mb-2">
                  {cert.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {selectedImage && (
        <div
          ref={modalRef}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-modal-fade"
        >
          <img
            src={selectedImage}
            alt="ใบรับรอง"
            className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl animate-modal-scale"
          />
        </div>
      )}

      <style>{`
        .fade-up-big {
          animation: fadeUpBig 1s ease-out forwards;
        }
        .fade-up-mid {
          animation: fadeUpMid 0.9s ease-out forwards;
        }
        .card-anim {
          animation: cardFade 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes fadeUpBig {
          0% { opacity: 0; transform: translateY(80px) scale(0.9); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes fadeUpMid {
          0% { opacity: 0; transform: translateY(50px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes cardFade {
          0% { opacity: 0; transform: translateY(60px) scale(0.85) rotateX(8deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }

        /* MODAL */
        .animate-modal-fade {
          animation: modalFade 0.3s ease-out forwards;
        }
        .animate-modal-scale {
          animation: modalScale 0.3s ease-out forwards;
        }

        @keyframes modalFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes modalScale {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}