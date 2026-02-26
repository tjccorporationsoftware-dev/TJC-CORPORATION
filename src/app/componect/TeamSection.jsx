"use client";
import { useEffect, useRef, useState } from "react";

export default function TeamSection() {
  const [previewImg, setPreviewImg] = useState(null);
  const fadeRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  const president = {
    name: "นายสนั่น สุตัญตั้งใจ",
    role: "ประธานบริษัท",
    img: "/images/4230.png", // รูป PNG พื้นหลังใส
    quote: "มุ่งมั่นสร้างสรรค์ผลงานคุณภาพ ด้วยความเป็นเลิศและความรับผิดชอบ"
  };

  useEffect(() => {
    const observe = (element, className, delay = 0) => {
      if (!element) return;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setTimeout(() => {
                e.target.classList.add(className);
              }, delay);
              ob.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      ob.observe(element);
    };

    observe(fadeRef.current, "anim-fade");
    // สลับชื่อ animation ให้สื่อความหมายตามทิศทางใหม่
    observe(textRef.current, "anim-slide-from-right", 200);
    observe(imageRef.current, "anim-slide-from-left", 400);
  }, []);

  return (
    <>
      <section ref={fadeRef} className="relative h-187.5 flex items-end overflow-hidden opacity-0 transition-opacity duration-700 bg-white">

        {/* --- ส่วนพื้นหลัง (Background) --- */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tjc02.jpg"
            alt="Background"
            // ปรับ opacity เพิ่มขึ้นเพื่อให้พื้นหลังชัดเจน (จาก 40 เป็น 70)
            className="w-full h-full object-cover object-top opacity-70"
          />
          {/* Overlay ปรับทิศทาง: ขาวทึบจากขวา ไล่ไปใสทางซ้าย เพื่อให้อ่าน text รู้เรื่อง */}
          <div className="absolute inset-0 bg-linear-to-l from-white via-white/90 to-transparent"></div>
          {/* ย้ายแถบกราฟิกเฉียงไปอยู่ฝั่งซ้าย เพื่อสมดุล */}
          <div className="absolute top-0 left-0 w-[40%] h-full bg-zinc-50 -skew-x-12 transform origin-top-left pointer-events-none opacity-50" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full">
          <div className="grid lg:grid-cols-12 gap-8 h-full items-end">

            {/* --- ส่วนที่ 1: รูปคน (ย้ายมาอยู่ซ้าย) --- */}
            <div ref={imageRef} className="lg:col-span-5 relative h-125 lg:h-full w-full flex items-end justify-center lg:justify-start opacity-0 transform -translate-x-20">

              {/* แสงออร่าสีทองด้านหลังคน */}
              <div className="absolute bottom-0 left-0 w-[140%] h-2/3 bg-[radial-gradient(circle,rgba(255,213,5,0.15)_0%,rgba(255,255,255,0)_70%)] blur-3xl rounded-full"></div>

              <div className="relative z-10 h-full w-full group flex items-end justify-center lg:justify-start">
                <img
                  src={president.img}
                  alt={president.name}
                  // ปรับตำแหน่งรูปเล็กน้อยให้ชิดซ้ายสวยงาม
                  className="h-[95%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-transform duration-1000 group-hover:scale-105 lg:ml-[-5%]"
                />
              </div>
            </div>


            {/* --- ส่วนที่ 2: ข้อความ (ย้ายมาอยู่ขวา) --- */}
            {/* เพิ่ม lg:pl-12 เพื่อเว้นระยะห่างจากรูป */}
            <div ref={textRef} className="lg:col-span-7 pb-20 lg:pb-28 lg:pl-12 opacity-0 transform translate-x-20">

              {/* Tag */}
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-zinc-900 border-l-4 border-[#DAA520] mb-8 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-ping"></span>
                <span className="text-[#DAA520] font-black tracking-[0.25em] uppercase text-xs">
                  EXECUTIVE LEADERSHIP
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 mb-4 tracking-tighter leading-none">
                {president.name}
                <span className="text-[#DAA520] ml-2">.</span>
              </h1>

              <p className="text-2xl md:text-3xl text-zinc-400 font-bold mb-10 tracking-tight">
                {president.role}
              </p>

              {/* Decorative Line */}
              <div className="w-24 h-1.5 bg-[#DAA520] rounded-full mb-12"></div>

              {/* Quote Box */}
              <div className="relative bg-white/60 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-white/80 max-w-2xl group transition-all duration-500 hover:border-[#DAA520]/40">
                <div className="absolute -top-6 left-10 bg-[#DAA520] w-12 h-12 flex items-center justify-center rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-6 h-6 text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                  </svg>
                </div>

                <p className="text-xl md:text-2xl text-zinc-700 italic leading-relaxed pt-2 font-medium">
                  "{president.quote}"
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <div className="h-0.5 w-12 bg-[#DAA520]"></div>
                  <span className="text-zinc-400 text-xs font-black tracking-[0.3em] uppercase">TJC Corporation</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Image Preview Modal (คงเดิม) */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-100 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div className="relative max-h-screen w-auto animate-scale-in">
            <img
              src={previewImg}
              className="max-h-[90vh] w-auto rounded-xl shadow-2xl bg-white object-contain"
              alt="Full Preview"
            />
            <button className="absolute -top-12 right-0 text-white hover:text-[#DAA520] transition-colors">
              <i className="bx bx-x text-4xl"></i>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .anim-fade { animation: fadeIn 1s ease-out forwards; }
        /* อัปเดต Keyframes ให้สอดคล้องกับทิศทางใหม่ */
        .anim-slide-from-right { animation: slideFromRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-slide-from-left { animation: slideFromLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideFromRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideFromLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}