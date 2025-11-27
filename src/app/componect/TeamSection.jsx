"use client";
import { useEffect, useRef, useState } from "react";

export default function TeamSection() {
  const [previewImg, setPreviewImg] = useState(null);

  const fadeRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const staggerRefs = useRef([]);

  const members = [
    { name: "นายสนั่น สุตัญตั้งใจ", role: "ประธานบริษัท", img: "/images/executive01.jpg" },
    { name: "นางประนอม สุตัญตั้งใจ", role: "รองประธานบริษัท", img: "/images/executive02.jpg" },
  ];

  useEffect(() => {
    const observe = (element, className) => {
      if (!element) return;

      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add(className);
              ob.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      ob.observe(element);
    };

    observe(fadeRef.current, "anim-fade-up");
    observe(leftRef.current, "anim-slide-left");
    observe(rightRef.current, "anim-slide-right");

    // ⭐ สมาชิกผู้บริหารไหลมาจากขวาทีละกล่อง
    staggerRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${i * 0.3}s`;
      observe(el, "anim-stagger-right");
    });
  }, []);

  return (
    <>
      {/* SECTION */}
      <section
        ref={fadeRef}
        className="opacity-0 py-20 bg-linear-to-br from-gray-50 via-amber-50/30 to-white"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* LEFT IMAGE */}
            <div ref={leftRef} className="opacity-0">
              <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 group cursor-pointer border border-amber-200">
                <img
                  src="/images/tjc02.jpg"
                  className="w-full h-[340px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  onClick={() => setPreviewImg("/images/tjc02.jpg")}
                  alt="TJC Corporation"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div ref={rightRef} className="opacity-0">
              <div className="mb-5">
                <h3 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight">
                  ทีมผู้บริหารของเรา
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-4 border-yellow-500 pl-4">
                  ทีมผู้บริหารที่มุ่งมั่นขับเคลื่อนองค์กรด้วยความเชี่ยวชาญ
                  และประสบการณ์ในหลายสาขา เพื่อสร้างมาตรฐานงานที่ดีที่สุดให้ลูกค้า
                </p>
              </div>

              {/* MEMBERS */}
              <div className="space-y-6">
                {members.map((m, i) => (
                  <div
                    key={i}
                    ref={(el) => (staggerRefs.current[i] = el)}
                    onClick={() => setPreviewImg(m.img)}
                    className="opacity-0 cursor-pointer bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 flex gap-6 hover:-translate-y-1 hover:border-amber-400 group"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                      <img
                        src={m.img}
                        className="relative w-24 h-24 rounded-full object-cover object-top border-3 border-amber-500 shadow-lg"
                        alt={m.name}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-amber-700 transition-colors">
                        {m.name}
                      </h4>
                      <p className="text-amber-700 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {m.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ANIMATIONS */}
      <style>{`
        .anim-fade-up {
          animation: fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .anim-slide-left {
          animation: slideLeft 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .anim-slide-right {
          animation: slideRight 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ⭐ เลื่อนเข้าทีละกล่องจากขวา */
        .anim-stagger-right {
          animation: slideInRightToLeft 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(80px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* ⭐ แอนิเมชันใหม่ - เลื่อนจากขวา → ซ้าย */
        @keyframes slideInRightToLeft {
          from { opacity: 0; transform: translateX(80px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
