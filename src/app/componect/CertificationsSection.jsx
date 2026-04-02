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

  const headerRef = useRef(null);
  const warrantyHeaderRef = useRef(null);
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
    if (loading) return;

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
        { threshold: 0.1 }
      );
      ob.observe(el);
    };

    if (headerRef.current) animate(headerRef.current, "fade-up-mid");
    if (warrantyHeaderRef.current) animate(warrantyHeaderRef.current, "fade-up-mid");

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${i * 0.1}s`;
      animate(el, "card-anim");
    });
  }, [loading, certs]);

  if (loading) return null;

  return (
    <>
      <section className="relative bg-zinc-50 py-24 lg:py-32 overflow-hidden border-t border-zinc-200">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* --- SECTION 1: CERTIFICATIONS --- */}
          <div ref={headerRef} className="text-center mb-20 opacity-0 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1 mb-6 shadow-sm">
              <i className="bx bxs-certification text-[#DAA520] text-lg"></i>
              <span className="text-zinc-600 font-bold tracking-widest uppercase text-[13px] md:text-[15px]">
                Official Certifications
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">
              มาตรฐานและการรับรอง
            </h2>
            <p className="text-zinc-500 text-lg md:text-[20px] font-medium leading-relaxed">
              เรามุ่งมั่นยกระดับคุณภาพธุรกิจด้วยมาตรฐานระดับสากล เพื่อความมั่นใจสูงสุดของลูกค้า
            </p>
          </div>

          {certs.length > 0 && (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mb-32">
              {certs.map((cert, i) => (
                <div
                  key={cert.id || i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onClick={() => setSelectedImage(resolveUrl(cert.image_url))}
                  className="group relative opacity-0 cursor-zoom-in h-full"
                >
                  <div className="relative h-full bg-white rounded-2xl p-6 md:p-8 border border-zinc-200 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group-hover:border-[#DAA520]/50 overflow-hidden">
                    <div className="absolute top-0 left-0 w-0 h-1 bg-linear-to-r from-[#DAA520] to-[#F59E0B] transition-all duration-700 group-hover:w-full" />
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start h-full">
                      <div className="relative w-full md:w-2/5 shrink-0">
                        <div className="relative bg-zinc-100 p-3 rounded-lg border border-zinc-200 shadow-inner group-hover:bg-[#DAA520]/10 transition-colors duration-500">
                          <div className="aspect-3/4 overflow-hidden rounded bg-white border border-zinc-100 shadow-sm relative">
                            <img src={resolveUrl(cert.image_url)} alt={cert.title} className="w-full h-full object-contain p-2" />
                          </div>
                          <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#DAA520] text-zinc-900 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <i className="bx bxs-award text-2xl"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col grow text-center md:text-left">
                        <h3 className="text-xl font-black text-zinc-900 mb-3 group-hover:text-[#b49503]">
                          {cert.title}
                        </h3>
                        <div className="w-12 h-1 bg-zinc-200 rounded-full mb-4 mx-auto md:mx-0 group-hover:bg-[#DAA520]"></div>
                        <p className="text-zinc-500 leading-relaxed font-medium mb-6">
                          {cert.description || "ได้รับการรับรองมาตรฐานคุณภาพระดับสากล เพื่อการันตีความเชี่ยวชาญ"}
                        </p>
                        <div className="mt-auto">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 group-hover:bg-zinc-900 group-hover:text-[#DAA520] transition-all">
                            View Certificate <i className="bx bx-right-arrow-alt"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- SECTION 2: WARRANTY POLICY --- */}
          <div className="pt-20 border-t border-zinc-200">
            <div ref={warrantyHeaderRef} className="text-center mb-16 opacity-0 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1 mb-6 shadow-sm">
                <i className="bx bxs-shield-check text-[#DAA520] text-lg"></i>
                <span className="text-zinc-600 font-bold tracking-widest uppercase text-[15px]">Warranty Policy</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">
                นโยบายการรับประกันสินค้า
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Side: General Terms */}
              <div className="lg:col-span-7 space-y-6">
                {[
                  {
                    icon: "bx-time-five",
                    title: "ระยะเวลาการรับประกัน",
                    desc: "ระยะเวลาการรับประกันขึ้นอยู่กับชนิดสินค้า อ้างอิงจากหน้าเว็บไซต์ และเงื่อนไขที่ระบุใน https://tjc.co.th/ เท่านั้น"
                  },
                  {
                    icon: "bx-calendar-check",
                    title: "การเริ่มนับระยะเวลา",
                    desc: "เริ่มนับตั้งแต่วันที่ลูกค้าได้รับสินค้าแล้วเท่านั้น กรณีรับสินค้าไปแล้วแต่ไม่ได้ใช้งาน บริษัทฯ จะเริ่มนับจากวันที่รับสินค้าเป็นสำคัญ"
                  },
                  {
                    icon: "bx-user-check",
                    title: "สิทธิ์การรับประกัน",
                    desc: "สงวนสิทธิ์ให้ลูกค้าของ บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด เท่านั้น โดยข้อมูลผู้ซื้อต้องตรงกับฐานข้อมูลของบริษัทฯ"
                  },
                  {
                    icon: "bx-file",
                    title: "หลักฐานการรับประกัน",
                    desc: "ต้องมีใบเสร็จ/ใบกำกับภาษี หรือใบรับประกัน หรือสติ๊กเกอร์วอยด์รับประกันที่ชัดเจน หากขาดหลักฐานยืนยัน ทางบริษัทฯ ขอสงวนสิทธิ์ในการปฏิเสธการเคลม"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-none w-12 h-12 bg-[#DAA520]/10 rounded-xl flex items-center justify-center text-[#DAA520]">
                      <i className={`bx ${item.icon} text-2xl`}></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-zinc-900 mb-1">{item.title}</h4>
                      <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Exclusions */}
              <div className="lg:col-span-5">
                <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                    <i className="bx bx-error-circle text-[#d20909] text-4xl"></i>
                    เงื่อนไขที่อยู่นอกเหนือการรับประกัน
                  </h4>
                  <ul className="space-y-4 relative z-10">
                    {[
                      "สินค้าถูกดัดแปลง แก้ไข ถูกแกะ แงะ หรือซ่อมแซมจากสภาพปกติ",
                      "การใช้งานผิดประเภท ความประมาท หรืออุบัติเหตุจากผู้ใช้งาน",
                      "การละเลยไม่ปฏิบัติตามคำแนะนำในคู่มือการใช้สินค้า",
                      "ความเสียหายจากภัยธรรมชาติ แรงดันไฟฟ้าผิดปกติ/ไม่ได้มาตรฐาน",
                      "ความเสียหายอันเนื่องจากสัตว์ หรือ แมลงเข้าไปทำลาย",
                      "มีการแกะสติ๊กเกอร์วอยด์รับประกันบนตัวสินค้าออก",
                      "สินค้ามีสภาพผิดปกติทางรูปทรง: แตก, หัก, บิ่น, งอ, ยุบ, เบี้ยว, ร้าว, ทะลุ",
                      "สินค้าที่เป็นของรางวัล, สินค้าแถม, สินค้า OUTLET หรือไม่ได้ระบุระยะเวลาประกัน"
                    ].map((text, idx) => (
                      <li key={idx} className="flex gap-3 text-zinc-400 text-sm md:text-base font-medium leading-snug">
                        <i className="bx bx-x-circle text-[#DAA520] mt-1 shrink-0 text-2xl "></i>
                        {text}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-white/10 text-xs text-zinc-500 italic">
                    * เงื่อนไขเป็นไปตามที่บริษัทกำหนด และอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MODAL */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 bg-black/95 flex items-center justify-center z-[99999] p-4 backdrop-blur-sm animate-modal-fade cursor-zoom-out">
          <div className="relative max-w-5xl w-full flex flex-col items-center justify-center">
            <button className="absolute -top-12 right-0 text-white hover:text-[#DAA520] transition-colors flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest">Close</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <i className="bx bx-x text-2xl"></i>
              </div>
            </button>
            <img src={selectedImage} alt="Certification Detail" className="max-w-full max-h-[85vh] rounded shadow-2xl bg-white object-contain animate-modal-scale-sharp" />
          </div>
        </div>
      )}

      <style jsx global>{`
        .fade-up-mid { animation: fadeUpMid 0.8s ease-out forwards; }
        .card-anim { animation: cardFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeUpMid { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes cardFade { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-modal-fade { animation: modalFade 0.3s ease-out forwards; }
        .animate-modal-scale-sharp { animation: modalScaleSharp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes modalFade { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes modalScaleSharp { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}