"use client";
import React, { useState, useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const resolveUrl = (u) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  if (u.startsWith("/images/")) return u;
  const cleanPath = u.startsWith("/") ? u : `/${u}`;
  return `${API_BASE}${cleanPath}`;
};

export default function CertificationsSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/certifications`);
        const data = await res.json();
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          : [];
        setCerts(sorted);
      } catch (err) {
        console.error("Failed to load certs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || certs.length === 0) return;

    const animate = (el, anim) => {
      if (!el) return;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add(anim);
              ob.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      ob.observe(el);
    };

    if (headerRef.current) animate(headerRef.current, "fade-up-mid");

    cardRefs.current = cardRefs.current.slice(0, certs.length);
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${i * 0.15}s`;
      animate(el, "card-anim");
    });
  }, [loading, certs]);

  if (loading) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-zinc-50 py-24 lg:py-32 overflow-hidden border-t border-zinc-200"
      >
        {/* Background Texture: เพิ่มลวดลาย Grid จางๆ ให้ดู Technical และไม่โล่งจนเกินไป */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Gradient Glow: แสงทองจางๆ ตรงกลาง */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#DAA520]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-20 opacity-0 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1 mb-6 shadow-sm">
               <i className="bx bxs-certification text-[#DAA520] text-lg"></i>
               <span className="text-zinc-600 font-bold tracking-widest uppercase text-[10px]">
                  Official Certifications
               </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight leading-tight mb-6">
              มาตรฐานและ
              <span className="relative inline-block ml-3">
                 <span className="relative z-10 text-[#DAA520] drop-shadow-sm-dark">การรับรอง</span>
                 {/* ขีดเส้นใต้แบบปากกาไฮไลท์ */}
                 <span className="absolute bottom-2 left-0 w-full h-3 bg-zinc-900/5 z-0 rotate-1 rounded-full"></span>
              </span>
            </h2>
            
            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
              เรามุ่งมั่นยกระดับคุณภาพธุรกิจด้วยมาตรฐานระดับสากล <br className="hidden md:block"/>
              เพื่อความมั่นใจสูงสุดของคู่ค้าและลูกค้าทุกท่าน
            </p>
          </div>

          {/* Cards Grid */}
          {certs.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {certs.map((cert, i) => (
                <div
                  key={cert.id || i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onClick={() => setSelectedImage(resolveUrl(cert.image_url))}
                  className="group relative opacity-0 cursor-zoom-in h-full"
                >
                  {/* Card Container: ทำเหมือนกรอบรูป มีมิติเงาลึก */}
                  <div className="relative h-full bg-white rounded-2xl p-6 md:p-8 border border-zinc-200 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group-hover:border-[#DAA520]/50 overflow-hidden">
                    
                    {/* Decorative Top Line (สีทองวิ่ง) */}
                    <div className="absolute top-0 left-0 w-0 h-1 bg-linear-to-r from-[#DAA520] to-[#F59E0B] transition-all duration-700 group-hover:w-full" />

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start h-full">
                       
                       {/* Image Area: จำลองเหมือนใบประกาศวางอยู่ */}
                       <div className="relative w-full md:w-2/5 shrink-0">
                          <div className="relative bg-zinc-100 p-3 rounded-lg border border-zinc-200 shadow-inner group-hover:bg-[#DAA520]/10 transition-colors duration-500">
                             <div className="aspect-3/4 overflow-hidden rounded bg-white border border-zinc-100 shadow-sm relative">
                                <img
                                  src={resolveUrl(cert.image_url)}
                                  alt={cert.title}
                                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-2"
                                />
                                {/* Overlay search icon */}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                      <i className="bx bx-zoom-in text-zinc-900 text-xl"></i>
                                   </div>
                                </div>
                             </div>
                             
                             {/* Badge Icon ตราประทับ */}
                             <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#DAA520] text-zinc-900 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <i className="bx bxs-award text-2xl"></i>
                             </div>
                          </div>
                       </div>

                       {/* Text Content */}
                       <div className="flex flex-col grow text-center md:text-left">
                          <h3 className="text-xl font-black text-zinc-900 mb-3 group-hover:text-[#b49503] transition-colors">
                            {cert.title}
                          </h3>
                          
                          <div className="w-12 h-1 bg-zinc-200 rounded-full mb-4 mx-auto md:mx-0 group-hover:bg-[#DAA520] transition-colors duration-500"></div>

                          <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
                            {cert.description || "ได้รับการรับรองมาตรฐานคุณภาพระดับสากล เพื่อการันตีความเชี่ยวชาญและความน่าเชื่อถือในการดำเนินธุรกิจ"}
                          </p>

                          <div className="mt-auto">
                             <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 uppercase tracking-wide group-hover:bg-zinc-900 group-hover:text-[#DAA520] group-hover:border-zinc-900 transition-all duration-300">
                                View Certificate <i className="bx bx-right-arrow-alt"></i>
                             </span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-zinc-400 border-2 border-dashed border-zinc-300 rounded-2xl w-full text-center font-bold text-lg bg-zinc-50/50">
              <i className="bx bx-file-blank text-4xl mb-2 block opacity-50"></i>
              ไม่พบข้อมูลใบรับรองในระบบ
            </div>
          )}
        </div>
      </section>

      {/* MODAL - ปรับให้พื้นหลังมืดลง เพื่อให้รูปใบประกาศเด่นที่สุด */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-99999 p-4 backdrop-blur-sm animate-modal-fade cursor-zoom-out"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
             {/* Close Button */}
            <button className="absolute -top-12 right-0 md:-right-12 text-white hover:text-[#DAA520] transition-colors flex items-center gap-2 group">
              <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10">
                 <i className="bx bx-x text-2xl"></i>
              </div>
            </button>

            <img
              src={selectedImage}
              alt="Certification Detail"
              className="max-w-full max-h-[85vh] rounded shadow-2xl bg-white object-contain animate-modal-scale-sharp"
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .fade-up-mid {
          animation: fadeUpMid 0.8s ease-out forwards;
        }
        .card-anim {
          animation: cardFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes fadeUpMid {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFade {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-modal-fade {
          animation: modalFade 0.3s ease-out forwards;
        }
        .animate-modal-scale-sharp {
          animation: modalScaleSharp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalScaleSharp {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}