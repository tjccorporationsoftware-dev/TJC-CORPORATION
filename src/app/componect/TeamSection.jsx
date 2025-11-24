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

    staggerRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${i * 0.3}s`;
      observe(el, "anim-stagger");
    });
  }, []);

  return (
    <>
      {/* SECTION */}
      <section
        ref={fadeRef}
        className="opacity-0 py-20 bg-linear-to-br from-gray-50 to-gray-200"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT IMAGE */}
          <div ref={leftRef} className="opacity-0">
            <div className="rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700">
              <img
                src="/images/tjc02.jpg"
                className="w-full h-[340px] md:h-[450px] object-cover"
                onClick={() => setPreviewImg("/images/tjc.jpg")}
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div ref={rightRef} className="opacity-0">
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              ทีมผู้บริหารของเรา
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-4 border-yellow-500 pl-4">
              ทีมผู้บริหารที่มุ่งมั่นขับเคลื่อนองค์กรด้วยความเชี่ยวชาญ
              และประสบการณ์ในหลายสาขา เพื่อสร้างมาตรฐานงานที่ดีที่สุดให้ลูกค้า
            </p>

            <div className="space-y-6">
              {members.map((m, i) => (
                <div
                  key={i}
                  ref={(el) => (staggerRefs.current[i] = el)}
                  onClick={() => setPreviewImg(m.img)}
                  className="opacity-0 translate-x-10 cursor-pointer backdrop-blur-lg bg-white/70 border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all p-6 flex gap-6 hover:-translate-y-1"
                >
                  <img
                    src={m.img}
                    className="w-20 h-20 rounded-full object-cover object-top border-2 border-yellow-500 shadow"
                  />

                  <div className="flex flex-col justify-center">
                    <h4 className="text-xl font-semibold text-gray-900">{m.name}</h4>
                    <p className="text-yellow-700 font-medium">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* LIGHTBOX */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
        >
          <img
            src={previewImg}
            className="animate-scale-in max-w-[90%] max-h-[85%] rounded-3xl shadow-2xl border-4 border-white/80"
          />
        </div>
      )}
    </>
  );
}
