"use client";
import { useEffect, useRef } from "react";

export default function CoreValues() {
  const values = [
    { title: "นวัตกรรม", desc: "กล้าคิด กล้าทำสิ่งใหม่ ๆ เพื่อสร้างคุณค่า" },
    { title: "ความร่วมมือ", desc: "ทำงานเป็นทีมอย่างแข็งแกร่งเพื่อผลลัพธ์ที่ดีที่สุด" },
    { title: "คุณภาพ", desc: "มุ่งมั่นสร้างงานคุณภาพและมาตรฐานระดับสูง" },
  ];

  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const animate = (el, animation) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              el.classList.add(animation);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
    };

    animate(sectionRef.current, "fade-up-big");
    animate(titleRef.current, "fade-up-mid");

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${i * 0.25}s`;
      animate(el, "card-anim");
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="core-values"
      className="opacity-0 bg-linear-to-r from-white via-gray-50 to-gray-100 py-16 md:py-20 lg:py-24 border-t border-gray-200"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
        <div ref={titleRef} className="opacity-0 text-center mb-14">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-wide">
            ค่านิยมองค์กร
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="opacity-0 scale-90 translate-y-10 bg-white border border-gray-200 rounded-3xl shadow p-5 md:p-10 lg:px-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-yellow-50/80 cursor-pointer"
            >
              <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold text-yellow-700 mb-4">
                {item.title}
              </h4>
              <p className="text-gray-700  leading-relaxed text-base md:text-lg lg:text-xl">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS ANIMATIONS */}
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
      `}</style>
    </section>
  );
}