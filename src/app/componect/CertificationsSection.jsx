"use client";
import React, { useState, useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const resolveUrl = (u) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;

  // 1. ตรวจสอบว่าถ้าพาธขึ้นต้นด้วย /images/ ให้ดึงจากโฟลเดอร์ public ในโปรเจกต์หน้าบ้านเลย
  if (u.startsWith("/images/")) {
    return u;
  }

  // 2. ถ้าเป็นรูปที่อัปโหลดผ่านหลังบ้าน (มักขึ้นต้นด้วย /uploads/) ให้เติม URL ของ API
  const cleanPath = u.startsWith("/") ? u : `/${u}`;
  return `${API_BASE}${cleanPath}`;
};

export default function CertificationsSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
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
              el.classList.add(anim);
              ob.unobserve(el);
            }
          });
        },
        { threshold: 0.2 }
      );
      ob.observe(el);
    };

    if (sectionRef.current) animate(sectionRef.current, "fade-in-sharp");
    if (titleRef.current) animate(titleRef.current, "fade-up-mid");
    if (descRef.current) animate(descRef.current, "fade-up-mid");

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
        className="opacity-0 bg-linear-to-b from-slate-50 via-white to-slate-100 py-24 border-t border-slate-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center justify-items-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-black bg-linear-to-r from-amber-500 to-slate-700 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-4"
          >
            มาตรฐานและการรับรองคุณภาพ
          </h2>

          <p
            ref={descRef}
            className="opacity-0 text-lg text-slate-600 max-w-3xl mx-auto mb-16 font-medium"
          >
            เราดำเนินธุรกิจตามมาตรฐานระดับสากล เพื่อให้ลูกค้าได้รับคุณภาพที่ดีที่สุด พร้อมความเชื่อถือได้สูงสุด
          </p>

          {certs.length > 0 ? (
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 px-4" style={{ perspective: '2000px' }}>
              {certs.map((cert, i) => (
                <div
                  key={cert.id || i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onClick={() => setSelectedImage(resolveUrl(cert.image_url))}
                  className="group relative opacity-0 translate-y-8 cursor-zoom-in transition-all duration-500 ease-out w-full h-full backface-hidden will-change-transform"
                >
                  <div
                    className="relative h-full w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl group-hover:shadow-amber-500/20 p-8 flex flex-col items-center text-center transition-all duration-500 transform-gpu preserve-3d group-hover:transform-[rotateX(4deg)_rotateY(4deg)_translateY(-8px)]"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-tr from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="mb-8 transition-transform duration-500 ease-out group-hover:scale-110">
                      <div className="relative">
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900/10 rounded-[100%] blur-md"></div>
                        <img
                          src={resolveUrl(cert.image_url)}
                          alt={cert.title}
                          className="w-32 h-32 object-contain drop-shadow-2xl image-render-sharp"
                        />
                      </div>
                    </div>

                    <div className="grow flex flex-col justify-center w-full">
                      <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                        {cert.title}
                      </h3>
                      <p className="text-slate-500 text-base leading-relaxed font-medium line-clamp-3">
                        {cert.description || "ได้รับการรับรองมาตรฐานคุณภาพระดับสากล"}
                      </p>
                    </div>

                    <div className="mt-6 w-10 h-1 rounded-full bg-amber-400 group-hover:w-20 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-slate-400 border-4 border-dotted border-slate-200 rounded-[3rem] w-full max-w-4xl font-bold text-xl">
              ไม่พบข้อมูลใบรับรองในระบบ
            </div>
          )}
        </div>
      </section>

      {/* MODAL - ปรับให้ใหญ่และคมชัดขึ้น */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-99999 p-2 md:p-6 backdrop-blur-md animate-modal-fade cursor-zoom-out"
        >
          <div className="relative max-w-[98vw] max-h-[92vh] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="ใบรับรองแบบขยาย"
              className="
                max-w-full max-h-full
                rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)]
                border border-white/10
                animate-modal-scale-sharp
                object-contain
                bg-white
                image-render-sharp
              "
            />
            <div className="absolute -top-12 right-0 text-white font-light flex items-center gap-2 opacity-70">
              <span className="text-sm uppercase tracking-widest">คลิกเพื่อปิด</span>
              <span className="text-3xl">✕</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .image-render-sharp {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        .fade-in-sharp {
          animation: fadeInSharp 0.8s ease-out forwards;
        }
        .fade-up-mid {
          animation: fadeUpMid 0.8s ease-out forwards;
        }
        .card-anim {
          animation: cardFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes fadeInSharp {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUpMid {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFade {
          0% { opacity: 0; transform: translateY(40px) rotateX(10deg); }
          100% { opacity: 1; transform: translateY(0) rotateX(0); }
        }

        .animate-modal-fade {
          animation: modalFade 0.2s ease-out forwards;
        }
        .animate-modal-scale-sharp {
          animation: modalScaleSharp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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