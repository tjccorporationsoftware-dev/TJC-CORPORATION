"use client";
import { useEffect, useRef } from "react";
import { Zap, Users, ShieldCheck } from "lucide-react"; // ✅ นำเข้าไอคอน Lucide

export default function CoreValues() {
  const values = [
    {
      number: "01",
      engTitle: "INNOVATION",
      icon: Zap, // ✅ ใช้ไอคอน Zap สำหรับนวัตกรรม
      title: "นวัตกรรม",
      desc: "กล้าคิด กล้าทำสิ่งใหม่ ๆ เพื่อสร้างคุณค่า"
    },
    {
      number: "02",
      engTitle: "COLLABORATION",
      icon: Users, // ✅ ใช้ไอคอน Users สำหรับความร่วมมือ
      title: "ความร่วมมือ",
      desc: "ทำงานเป็นทีมอย่างแข็งแกร่งเพื่อผลลัพธ์ที่ดีที่สุด"
    },
    {
      number: "03",
      engTitle: "QUALITY",
      icon: ShieldCheck, // ✅ ใช้ไอคอน ShieldCheck สำหรับคุณภาพ
      title: "คุณภาพ",
      desc: "มุ่งมั่นสร้างงานคุณภาพและมาตรฐานระดับสูง"
    },
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
              className="opacity-0 scale-90 translate-y-10 bg-white border border-gray-200 rounded-3xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-yellow-50/80 cursor-pointer relative"
            >
              {/* ✅ เลขอันดับขวาบน เหมือนในรูป */}
              <div className="text-4xl font-bold text-[#DAA520]/20 absolute top-4 right-4">
                {item.number}
              </div>

              {/* ✅ ไอคอนในสี่เหลี่ยมสีดำ ขอบมน เรืองแสง เหมือนในรูป */}
              <div className="w-20 h-20 rounded-xl bg-black flex center mx-auto mb-6 relative icon-glow overflow-hidden">
                {/* แสงเรืองแสงชั้นใน */}
                <div className="absolute inset-0 icon-center-glow" />
                {/* ไอคอนหลัก Lucide */}
                <item.icon size={32} className="text-[#DAA520] relative z-10" />
              </div>

              {/* ✅ ข้อความภาษาอังกฤษ ก่อนหัวข้อภาษาไทย */}
              <p className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.2em] mb-2">
                {item.engTitle}
              </p>

              <h4 className="text-xl md:text-2xl font-semibold text-[#DAA520] mb-4">
                {item.title}
              </h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS ANIMATIONS & PSEUDO-ELEMENTS */}
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

        /* ✅ CSS สำหรับอนุภาคระยิบระยับ แอนิเมชัน เหมือนในรูป */
        @keyframes particleAnimation {
          from { background-position: 0 0; }
          to { background-position: 200% 200%; }
        }

        .icon-glow::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: 
            radial-gradient(1px 1px at 20% 30%, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40% 70%, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 60% 50%, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 80% 90%, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90% 10%, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 10% 60%, #fff, rgba(0,0,0,0));
          background-size: 200% 200%;
          animation: particleAnimation 10s linear infinite;
          opacity: 0.8;
          z-index: 1;
        }

        /* ✅ CSS สำหรับแสงเรืองแสงสีทอง เหมือนในรูป */
        .icon-glow::after {
          content: '';
          position: absolute;
          width: 140%;
          height: 140%;
          top: -20%;
          left: -20%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(218, 165, 32, 0.4) 0%, rgba(218, 165, 32, 0) 70%);
          filter: blur(15px);
          z-index: -1;
        }

        /* แสงเรืองแสงชั้นใน */
        .icon-center-glow::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: inherit;
          background: radial-gradient(circle, rgba(218, 165, 32, 0.8) 0%, rgba(218, 165, 32, 0) 70%);
          filter: blur(10px);
          opacity: 0.8;
          z-index: 1;
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