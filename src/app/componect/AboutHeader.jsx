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
    <div id="about" className="bg-white text-zinc-800 font-(family-name:--font-ibm-plex-thai) selection:bg-[#DAA520]/30">

      {/* --- SECTION 1: THE STATEMENT --- */}
      <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-1/2 reveal-on-scroll fade-left">
              <div className="flex items-center gap-3 mb-10">
                <span className="text-[#DAA520] font-bold tracking-[0.25em] uppercase text-[15px] px-5 py-2 shadow-lg">
                  Established Excellence
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 uppercase">
                <span className="bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(218,165,32,0.3)]">
                  TJC <br />
                  <span className="inline-block mt-2 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent ">CORPORATION</span>
                </span>
              </h1>
            </div>

            <div className="w-full lg:w-1/2 reveal-on-scroll fade-up delay-200 lg:pt-16">
              <div className="w-16 h-1.5 bg-[#DAA520] mb-10 rounded-full shadow-sm"></div>
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
      <section className="px-6 py-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vision Card */}
          <div className="bg-white rounded-4xl px-10 py-8 text-zinc-900 relative overflow-hidden reveal-on-scroll scale-in border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(218,165,32,0.1)] group flex flex-col justify-center min-h-62.5">
            <div className="absolute inset-0 bg-linear-to-br from-white via-[#FDF9EC] to-[#F3E7C9] opacity-70" />
            <div className="absolute left-0 top-0 w-1.5 h-full bg-[#DAA520] opacity-80" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#DAA520] font-black text-[13px] tracking-[0.3em] uppercase"> VISION</span>
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
            <div className="absolute right-8 bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src="/images/logo.png" alt="TJC" className="w-16 h-16 grayscale brightness-0" />
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-zinc-100 rounded-4xl px-10 py-8 text-zinc-900 relative overflow-hidden reveal-on-scroll scale-in border border-zinc-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] group flex flex-col justify-center min-h-62.5">
            <div className="absolute inset-0 bg-linear-to-br from-zinc-50 via-zinc-100 to-zinc-200 opacity-90" />
            <div className="absolute left-0 top-0 w-1.5 h-full bg-zinc-400 opacity-80" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-zinc-400 font-black text-[13px] tracking-[0.3em] uppercase">MISSION</span>
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
            <div className="absolute right-8 bottom-8 flex gap-1.5 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CORE VALUES (ปรับเหมือนรูป 100%) --- */}
      {/* --- SECTION 3: CORE VALUES --- */}
      <section className="py-24 lg:py-28 px-6 relative overflow-hidden bg-[#f8f4f1]">
        {/* ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-[10%] w-72 h-72 bg-[#f3c861]/10 rounded-full blur-[90px]" />
          <div className="absolute bottom-0 right-[8%] w-80 h-80 bg-[#f0b93a]/10 rounded-full blur-[110px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-9">
            {[
              {
                title: "INNOVATION",
                titleTh: "นวัตกรรม",
                desc: "พัฒนาเทคโนโลยีและแนวคิดใหม่เพื่อขับเคลื่อนองค์กรสู่ความเป็นผู้นำอย่างต่อเนื่อง",
                iconSrc: "/images/value-innovation.png",
              },
              {
                title: "COLLABORATION",
                titleTh: "ความร่วมมือ",
                desc: "ส่งเสริมการทำงานร่วมกันเป็นทีมและประสานพลังของทุกฝ่ายเพื่อความสำเร็จร่วมกัน",
                iconSrc: "/images/value-collaboration.png",
              },
              {
                title: "QUALITY",
                titleTh: "คุณภาพ",
                desc: "ยึดมั่นในมาตรฐานการทำงานและการส่งมอบผลงานคุณภาพสูงในทุกขั้นตอน",
                iconSrc: "/images/value-quality.png",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="reveal-on-scroll fade-up group relative max-w-[320px] mx-auto w-full min-h-[500px] rounded-[34px] border border-[#f2e8db] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,252,247,0.98)_100%)] px-8 pt-8 pb-10 overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(212,161,48,0.16)]"
                style={{ transitionDelay: `${idx * 140}ms` }}
              >
                {/* glossy overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0)_35%,rgba(255,220,120,0.06)_100%)] pointer-events-none" />

                {/* top shine */}
                <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/70 blur-2xl rounded-full opacity-60 pointer-events-none" />

                {/* card outline glow */}
                <div className="absolute inset-[1px] rounded-[33px] border border-white/70 pointer-events-none" />

                {/* number */}
                <div className="absolute top-5 right-5 text-[56px] font-black leading-none tracking-tight text-[#f3ece4] select-none">
                  0{idx + 1}
                </div>

                {/* lower light streaks */}
                <div className="absolute left-[-18%] bottom-[84px] w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#f3c459]/80 to-transparent rotate-[-16deg] opacity-90" />
                <div className="absolute left-[-18%] bottom-[90px] w-[150%] h-[10px] bg-gradient-to-r from-transparent via-[#f6d57f]/25 to-transparent rotate-[-16deg] blur-[10px] opacity-90" />
                <div className="absolute left-[-18%] bottom-[54px] w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#f3c459]/40 to-transparent rotate-[-16deg] opacity-70" />

                {/* icon area */}
                <div className="relative h-[170px] mb-7 flex items-center justify-center">
                  <div className="relative icon-float">
                    <img
                      src={item.iconSrc}
                      alt={item.title}
                      className="w-[132px] h-[132px] object-contain select-none pointer-events-none  transition-all duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="icon-shine absolute inset-0 rounded-[28px] pointer-events-none" />
                  </div>
                </div>

                {/* content */}
                <div className="relative z-10 text-left">
                  <div className="text-[11px] font-extrabold tracking-[0.28em] text-[#c79d3d] uppercase mb-2">
                    {item.title}
                  </div>

                  <h4 className="text-[30px] leading-none font-black text-[#1d1d1d] mb-4 tracking-tight">
                    {item.titleTh}
                  </h4>

                  <div className="w-10 h-[2px] rounded-full bg-gradient-to-r from-[#c9972d] to-[#f0c75a] mb-4 group-hover:w-16 transition-all duration-500" />

                  <p className="text-[14px] leading-[1.9] text-[#5f5f5f] font-medium max-w-[230px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- CSS ANIMATIONS & EFFECTS --- */}
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

  .icon-float {
    animation: iconFloat 4.8s ease-in-out infinite;
  }

  .icon-shine::before {
    content: "";
    position: absolute;
    inset: -12%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      transparent 35%,
      rgba(255,255,255,0.28) 50%,
      transparent 65%,
      transparent 100%
    );
    transform: translateX(-130%) skewX(-18deg);
    animation: shineSweep 4.6s ease-in-out infinite;
  }

  @keyframes iconFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes shineSweep {
    0%, 100% {
      transform: translateX(-130%) skewX(-18deg);
      opacity: 0;
    }
    18% {
      opacity: 1;
    }
    35% {
      transform: translateX(130%) skewX(-18deg);
      opacity: 0.9;
    }
    36%, 100% {
      opacity: 0;
    }
  }
      `}</style>
    </div>
  );
}