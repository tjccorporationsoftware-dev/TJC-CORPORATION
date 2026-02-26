"use client";

import { useEffect } from "react";

export default function AboutHeader() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    /* บังคับใช้ฟอนต์ IBM Plex Sans Thai ผ่าน CSS Variable */
    <div id="about" className="bg-white text-zinc-800 font-(family-name:--font-ibm-plex-thai) selection:bg-[#DAA520]/30">

      {/* --- SECTION 1: THE STATEMENT --- */}
      <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-1/2 reveal-on-scroll fade-left">

              {/* Executive Tag: ใช้ความหนา 700 และระยะห่างตัวอักษรกว้างตามหน้า Hero */}
              <div className="flex items-center gap-3 mb-10">
                <span className="text-[#DAA520] font-bold tracking-[0.25em] uppercase text-[10px] px-5 py-2 shadow-lg">
                  Established Excellence
                </span>
              </div>

              {/* Title: font-bold (700) พร้อม leading-[0.9] เพื่อความคมชัดแบบพรีเมียม */}
              <h1 className="text-5xl md:text-8xl font-bold text-zinc-900 tracking-tighter leading-[0.9] mb-10 uppercase">
                TJC <br />
                <span className="text-zinc-200">CORPORATION</span>
                <span className="text-[#DAA520] ml-2">.</span>
              </h1>
            </div>

            <div className="w-full lg:w-1/2 reveal-on-scroll fade-up delay-200 lg:pt-16">
              <div className="w-16 h-1.5 bg-[#DAA520] mb-10 rounded-full shadow-sm"></div>

              {/* ภาษาไทยใช้ font-bold (700) และ leading-relaxed เพื่อความสวยงามของสระ */}
              <p className="text-xl md:text-3xl text-zinc-700 leading-relaxed font-bold mb-4">
                เราเชื่อว่าเทคโนโลยีที่ดีที่สุด คือเทคโนโลยีที่สร้าง <span className="text-zinc-900 border-b-4 border-[#DAA520]/40">โอกาส</span> และความมั่งคั่งให้กับองค์กรอย่างยั่งยืน
              </p>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด ดำเนินธุรกิจด้วยความเชี่ยวชาญในการจัดหาโซลูชัน
                ไม่ว่าจะเป็นงานระบบไอทีหรืองานจัดซื้อจัดจ้างภาครัฐ
                เราคัดสรรเฉพาะวัสดุและอุปกรณ์ที่ตอบโจทย์การใช้งานจริงในมาตรฐานสากล
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: VISION & MISSION --- */}
      <section className="px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Vision Card */}
          <div className="lg:col-span-7 bg-zinc-900 rounded-[2.5rem] p-10 lg:p-16 text-white relative overflow-hidden reveal-on-scroll scale-in border border-zinc-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAA520]/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10">
              <span className="text-[#DAA520] font-bold text-[10px] mb-8 block tracking-[0.3em] uppercase opacity-90">// VISION</span>
              <h3 className="text-4xl lg:text-6xl font-bold mb-10 tracking-tight uppercase">วิสัยทัศน์</h3>
              <p className="text-zinc-400 text-xl lg:text-2xl leading-relaxed max-w-xl font-medium italic">
                มุ่งสู่การเป็นผู้นำด้านเทคโนโลยีและสื่อสาร รวมถึงการจัดจำหน่ายวัสดุครุภัณฑ์สำนักงานที่ครบวงจรที่สุด เพื่อความพึงพอใจสูงสุดของลูกค้าทั่วประเทศ
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-10 lg:p-16 border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] reveal-on-scroll scale-in delay-200 relative overflow-hidden">
            <div className="absolute left-0 top-0 w-2 h-full bg-[#DAA520]" />
            <span className="text-zinc-400 font-bold text-[10px] mb-8 block tracking-[0.3em] uppercase">// MISSION</span>
            <h3 className="text-4xl font-bold text-zinc-900 mb-10 tracking-tight uppercase">พันธกิจ</h3>
            <p className="text-zinc-600 leading-relaxed font-bold text-xl italic">
              "ส่งมอบโซลูชันเทคโนโลยีที่ทันสมัย ด้วยมาตรฐานระดับสากลและบริการที่เข้าใจผู้ใช้งานจริง"
            </p>
            <div className="mt-14 pt-10 border-t border-zinc-50 flex gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DAA520] shadow-sm" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-100" />
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: CORE VALUES --- */}
      <section className="py-32 px-6 bg-zinc-50/30 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-right pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-28 reveal-on-scroll fade-up">
            <h2 className="text-[10px] font-bold text-[#DAA520] tracking-[0.5em] uppercase mb-6">Our Core Philosophy</h2>
            <h3 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tighter uppercase">ค่านิยมองค์กร</h3>
            <div className="mt-8 flex justify-center">
              <div className="h-1.5 w-20 bg-[#DAA520] rounded-full shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation",
                titleTh: "นวัตกรรม",
                desc: "มุ่งมั่นพัฒนาและนำเสนอเทคโนโลยีที่ทันสมัยเพื่อสร้างคุณค่าที่เหนือกว่าให้กับองค์กร",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              {
                title: "Collaboration",
                titleTh: "ความร่วมมือ",
                desc: "ส่งเสริมการทำงานเป็นทีมและการประสานงานอย่างมีประสิทธิภาพ เพื่อเป้าหมายร่วมกัน",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              },
              {
                title: "Quality",
                titleTh: "คุณภาพ",
                desc: "ยึดมั่นในมาตรฐานการให้บริการและการส่งมอบผลงานที่มีคุณภาพสูงสุดในทุกขั้นตอน",
                icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="reveal-on-scroll fade-up group relative h-full"
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="relative h-full bg-white rounded-4xl p-12 border border-zinc-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:border-[#DAA520]/40">
                  <span className="absolute top-8 right-10 text-8xl font-bold text-zinc-50 transition-colors duration-500 group-hover:text-[#DAA520]/10">
                    0{idx + 1}
                  </span>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-12 transition-all duration-700 group-hover:bg-[#DAA520] group-hover:rotate-10 shadow-2xl">
                      <svg className="w-10 h-10 text-[#DAA520] group-hover:text-zinc-900 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={val.icon} />
                      </svg>
                    </div>
                    <h4 className="text-[11px] font-bold text-[#DAA520] uppercase tracking-[0.4em] mb-4">{val.title}</h4>
                    <h5 className="text-3xl font-bold text-zinc-900 mb-6 tracking-tight uppercase">{val.titleTh}</h5>
                    <p className="text-zinc-500 text-lg leading-relaxed font-medium group-hover:text-zinc-700 transition-colors duration-500">
                      {val.desc}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#DAA520] transition-all duration-700 group-hover:w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CSS ANIMATIONS (คงเดิม) --- */}
      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .fade-left { transform: translateX(-50px); }
        .fade-up { transform: translateY(50px); }
        .scale-in { transform: scale(0.9); }
        .reveal-active {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        .delay-200 { transition-delay: 200ms; }
      `}</style>
    </div>
  );
}