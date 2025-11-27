"use client";

import { useEffect, useRef } from "react";

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

  const values = [
    { title: "นวัตกรรม", desc: "มุ่งมั่นพัฒนาและนำเสนอเทคโนโลยีที่ทันสมัยเพื่อสร้างคุณค่าให้กับองค์กร" },
    { title: "ความร่วมมือ", desc: "ส่งเสริมการทำงานเป็นทีมและการประสานงานอย่างมีประสิทธิภาพ" },
    { title: "คุณภาพ", desc: "ยึดมั่นในมาตรฐานการให้บริการและการส่งมอบผลงานที่มีคุณภาพสูงสุด" },
  ];

  const fadeRefs = useRef([]);
  const cardRefs = useRef([]);
  const valueRefs = useRef([]);

  useEffect(() => {
    const animate = (el, className, delay = 0) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add(className), delay);
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    };

    fadeRefs.current.forEach((el) => animate(el, "fade-up-big"));
    cardRefs.current.forEach((el, i) => el && animate(el, "card-pop-big", i * 200));
    valueRefs.current.forEach((el, i) => el && animate(el, "card-slide-in", i * 150));
  }, []);

  return (
    <div id="about" className="bg-linear-to-b from-gray-100 via-white to-gray-50 relative overflow-hidden">
      {/* HERO HEADER */}
      <section className="relative py-20 sm:py-24 md:py-28 lg:py-20 overflow-hidden bg-linear-to-br from-amber-50 via-white to-gray-50">
        <div className="absolute -top-16 -left-16 w-72 h-72 sm:w-96 sm:h-96 bg-amber-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-200/10 rounded-full blur-3xl" />

        <div ref={(el) => (fadeRefs.current[0] = el)} className="opacity-0 translate-y-10 relative z-10 text-center px-4 sm:px-6 md:px-8 justify-items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight">
            เกี่ยวกับบริษัท
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl sm:max-w-4xl mx-auto leading-relaxed">
            บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด ให้บริการด้านจัดจำหน่ายและจัดซื้อจัดจ้าง
            สำหรับหน่วยงานภาครัฐและเอกชน พร้อมนำเสนอเทคโนโลยีคุณภาพ
            <br />
            <span className="text-amber-700 font-medium">
              เพื่อตอบสนองความต้องการของลูกค้าทั่วประเทศอย่างมีประสิทธิภาพ
            </span>
          </p>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 md:px-8 py-16 sm:py-20 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {items.map((item, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className="opacity-0  scale-95 group relative"
              >
                <div className="relative h-full  mt-3 backdrop-blur-lg border border-amber-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md hover:shadow-lg transition-all duration-500 hover:scale-[1.03] hover:border-amber-300">
                  <div className=" relative z-10">
                    <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-yellow-700 mb-3 sm:mb-4">{item.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base md:text-base lg:text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="relative z-10 max-w-7xl mx-auto px-ao sm:px-6 md:px-8 justify-items-center">
          <div ref={(el) => (fadeRefs.current[1] = el)} className="opacity-0 translate-y-10 text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight">ค่านิยมองค์กร</h2>
          </div>

          <div className="w-full  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
            {values.map((item, i) => (
              <div
                key={i}
                ref={(el) => (valueRefs.current[i] = el)}
                className="opacity-0 group flex justify-center"
              >
                <div className="relative h-full bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-amber-300">
                  <div className="text-center relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-linear-to-br from-yellow-500 to-amber-400 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
                        {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                        {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />}
                      </svg>
                    </div>
                    <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <style>{`
        .fade-up-big {animation: fadeUpBig 1.2s cubic-bezier(0.22,1,0.36,1) forwards;}
        .card-pop-big {animation: cardPopBig 1s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        .card-slide-in {animation: cardSlideIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards;}

        @keyframes fadeUpBig {0% { opacity:0; transform:translateY(80px) scale(0.92); filter:blur(10px);} 100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }}
        @keyframes cardPopBig {0% {opacity:0; transform:translateY(60px) scale(0.88);} 60% {transform:translateY(-10px) scale(1.02);} 100% {opacity:1; transform:translateY(0) scale(1); }}
        @keyframes cardSlideIn {0% {opacity:0; transform:translateX(-50px) scale(0.9);} 100% {opacity:1; transform:translateX(0) scale(1);}}
      `}</style>
    </div>
  );
}
