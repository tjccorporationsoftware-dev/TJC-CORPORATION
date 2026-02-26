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
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 uppercase">
                <span className="bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent  drop-shadow-[0_2px_10px_rgba(218,165,32,0.3)]">
                  TJC <br />
                  <span className="inline-block mt-2 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent ">CORPORATION</span>
                </span>

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


      <section className="px-6 py-8 relative z-10">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">


          <div className="bg-white rounded-4xl px-10 py-8 text-zinc-900 relative overflow-hidden reveal-on-scroll scale-in border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(218,165,32,0.1)] group flex flex-col justify-center min-h-62.5">

            {/* Background Decor */}
            <div className="absolute inset-0 bg-linear-to-br from-white via-[#FDF9EC] to-[#F3E7C9] opacity-70" />
            <div className="absolute left-0 top-0 w-1.5 h-full bg-[#DAA520] opacity-80" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#DAA520] font-black text-[9px] tracking-[0.3em] uppercase">// VISION</span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-black mb-4 tracking-tighter uppercase">
                <span className="bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">
                  วิสัยทัศน์
                </span>
              </h3>

              <p className="text-zinc-600 text-lg lg:text-xl leading-snug font-medium italic tracking-tight max-w-lg">
                "มุ่งสู่การเป็นผู้นำด้านเทคโนโลยีและสื่อสาร รวมถึงจัดจำหน่ายวัสดุครุภัณฑ์ที่ครบวงจรที่สุด"
              </p>
            </div>

            {/* Symbol Deco */}
            <div className="absolute right-8 bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src="/images/logo.png" alt="TJC" className="w-16 h-16 grayscale brightness-0" />
            </div>
          </div>

          {/* ======= Mission Card (Right - Gray Rectangle) ======= */}
          <div className="bg-zinc-100 rounded-4xl px-10 py-8 text-zinc-900 relative overflow-hidden reveal-on-scroll scale-in border border-zinc-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] group flex flex-col justify-center min-h-62.5">

            {/* Background Decor */}
            <div className="absolute inset-0 bg-linear-to-br from-zinc-50 via-zinc-100 to-zinc-200 opacity-90" />
            <div className="absolute left-0 top-0 w-1.5 h-full bg-zinc-400 opacity-80" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-zinc-400 font-black text-[9px] tracking-[0.3em] uppercase">// MISSION</span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-black mb-4 tracking-tighter uppercase text-zinc-900">
                <span className="bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">
                  พันธกิจ
                </span>

              </h3>

              <p className="text-zinc-500 text-lg lg:text-xl leading-snug font-medium italic tracking-tight max-w-lg">
                "ส่งมอบโซลูชันเทคโนโลยีที่ทันสมัย ด้วยมาตรฐานสากลและบริการที่เข้าใจผู้ใช้งานจริง"
              </p>
            </div>

            {/* Dots Deco */}
            <div className="absolute right-8 bottom-8 flex gap-1.5 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            </div>
          </div>

        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 bg-zinc-50/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-[#DAA520]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[30%] h-[40%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-right pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 reveal-on-scroll fade-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#DAA520]/30" />
              <span className="text-[10px] font-black text-[#DAA520] tracking-[0.5em] uppercase">
                Our Core Philosophy
              </span>
              <div className="h-px w-8 bg-[#DAA520]/30" />
            </div>

            <h3 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase">
              <span className="bg-linear-to-r from-zinc-900 via-zinc-800 to-[#DAA520] bg-clip-text text-transparent">
                ค่านิยมองค์กร
              </span>
            </h3>

            <div className="flex justify-center">
              <div className="h-1.5 w-20 bg-linear-to-r from-[#B49503] to-[#DAA520] rounded-full shadow-sm" />
            </div>
          </div>

          {/* Cards Grid: ปรับแต่ง Card ให้ดูมีระดับมากขึ้น */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
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
                {/* Card Container: เน้นความโค้งมนและเงาที่นุ่มนวล */}
                <div className="relative h-full bg-white rounded-[3rem] p-10 lg:p-14 border border-zinc-200/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_-20px_rgba(218,165,32,0.15)] group-hover:border-[#DAA520]/30 overflow-hidden flex flex-col">

                  {/* Metallic Shine Overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-white via-white to-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Sequence Number */}
                  <span className="absolute top-10 right-12 text-7xl font-black text-zinc-100/30 transition-colors duration-500 group-hover:text-[#DAA520]/10 select-none">
                    0{idx + 1}
                  </span>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon Box: Zinc-900 ขัดเงา */}
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-10 transition-all duration-700 group-hover:bg-[#DAA520] group-hover:rotate-6 shadow-xl group-hover:shadow-[#DAA520]/20">
                      <svg className="w-8 h-8 text-[#DAA520] group-hover:text-zinc-900 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={val.icon} />
                      </svg>
                    </div>

                    {/* Text Content */}
                    <div className="grow">
                      <h4 className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.4em] mb-4 opacity-80">
                        {val.title}
                      </h4>

                      <h5 className="text-3xl font-black mb-6 tracking-tighter uppercase leading-tight">
                        <span className="bg-linear-to-r from-zinc-900 via-zinc-800 to-[#DAA520] bg-clip-text text-transparent">
                          {val.titleTh}
                        </span>
                      </h5>

                      <p className="text-zinc-500 text-lg leading-relaxed font-medium group-hover:text-zinc-700 transition-colors duration-500">
                        {val.desc}
                      </p>
                    </div>

                    {/* Decorative Accent: แถบสีทองที่มุมด้านล่าง */}
                    <div className="mt-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <div className="h-0.5 w-8 bg-[#DAA520]" />
                      <div className="h-0.5 w-2 bg-[#DAA520]/30" />
                    </div>
                  </div>

                  {/* Hover Borders */}
                  <div className="absolute top-0 left-0 w-1.5 h-0 bg-[#DAA520] transition-all duration-700 group-hover:h-full opacity-60" />
                  <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#DAA520] transition-all duration-700 group-hover:w-full" />
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