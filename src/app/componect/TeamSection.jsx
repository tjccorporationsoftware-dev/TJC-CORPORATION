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
    observe(textRef.current, "anim-slide-right", 200);
    observe(imageRef.current, "anim-slide-up", 400);
  }, []);

  return (
    <>
      {/* section ยังคงสูง 750px เท่าเดิม */}
      <section ref={fadeRef} className="relative h-[750px] flex items-end overflow-hidden opacity-0 transition-opacity duration-700">

        {/* --- ส่วนพื้นหลัง (Background) --- */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tjc02.jpg"
            alt="Background"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-white/20"></div>
          <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-amber-100/40"></div>
        </div>


        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
          <div className="grid lg:grid-cols-12 gap-8 h-full items-end pb-0 lg:pb-0">

            {/* ส่วนข้อความ (ซ้าย) */}
            <div ref={textRef} className="lg:col-span-7 pb-16 lg:pb-24 opacity-0 transform -translate-x-10">
              <div className="relative backdrop-blur-sm p-6 rounded-3xl border border-white/40 shadow-sm bg-white/30">
                {/* ... (เนื้อหาข้อความเหมือนเดิม) ... */}
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-amber-200 rounded-full mb-6 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-amber-800 font-bold tracking-wide text-base">
                    ผู้นำองค์กร
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 leading-tight drop-shadow-sm">
                  {president.name}
                </h1>
                <p className="text-2xl md:text-3xl text-amber-700 font-medium mb-8">
                  {president.role}
                </p>
                <div className="w-24 h-1.5 bg-linear-to-r from-amber-500 to-orange-500 rounded-full mb-10"></div>
                <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white max-w-2xl">
                  <div className="absolute -top-5 left-8 bg-linear-to-br from-amber-400 to-orange-500 w-12 h-12 flex items-center justify-center rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                    </svg>
                  </div>
                  <p className="text-lg md:text-xl text-gray-800 italic leading-relaxed pt-2 font-light">
                    "{president.quote}"
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-px w-12 bg-amber-300"></div>
                    <span className="text-amber-800/60 text-xs font-bold tracking-widest uppercase">TJC Corporation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ส่วนรูปคน (ขวา) */}
            <div ref={imageRef} className="lg:col-span-5 relative h-[500px] lg:h-full w-full flex items-end justify-center lg:justify-end opacity-0 transform translate-y-20">

              {/* แสงสีทองด้านหลังคน */}
              <div className="absolute bottom-0 w-[120%] h-2/3 bg-linear-to-t from-white via-amber-100/40 to-transparent blur-2xl rounded-full"></div>

              <div
                className="relative z-10 h-full w-full cursor-pointer group flex items-end justify-center"
              >
                <img
                  src={president.img}
                  alt={president.name}
                  className="h-[90%] ml-24 w-auto max-w-none object-contain object-bottom drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Image Preview Modal (คงเดิม) */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div className="relative max-h-screen w-auto animate-scale-in">
            <img
              src={previewImg}
              className="max-h-[90vh] w-auto rounded-lg shadow-2xl bg-white"
              alt="Full Preview"
            />
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .anim-fade { animation: fadeIn 1s ease-out forwards; }
        .anim-slide-right { animation: slideRight 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .anim-slide-up { animation: slideUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}