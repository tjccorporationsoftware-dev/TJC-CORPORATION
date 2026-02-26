"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link"; // ✅ เพิ่มการ Import Link
import { Boxes } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const resolveUrl = (u) => {
  if (!u) return "/images/placeholder.png";
  if (u.startsWith("http")) return u;
  if (u.startsWith("/images/")) return u;
  const cleanPath = u.startsWith("/") ? u : `/${u}`;
  return `${API_BASE}${cleanPath}`;
};

export default function ServicesSection() {
  const [activeCard, setActiveCard] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${API_BASE}/api/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        const activeServices = data
          .filter((s) => s.is_active !== false)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        setServices(activeServices.slice(0, 4)); // แสดงแค่ 4 อันแรกในหน้าแรก
      } catch (err) {
        console.error("API Error (Services):", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;
    cardsRef.current = cardsRef.current.slice(0, services.length);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    cardsRef.current.forEach((card, i) => {
      if (card) {
        card.classList.remove("animate-fade-up");
        card.style.animationDelay = `${i * 0.1}s`;
        observer.observe(card);
      }
    });
    return () => observer.disconnect();
  }, [loading, services]);

  return (
    <section id="services" ref={sectionRef} className="relative py-24 lg:py-32 bg-white overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[40%] h-full bg-zinc-50 -skew-x-12 transform origin-top-left pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30%] h-[40%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-right pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div ref={headerRef} className="mb-20 opacity-0 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-zinc-50 text-zinc-800 border-l-4 border-[#DAA520] font-bold tracking-[0.2em] uppercase text-[11px] px-4 py-1.5 shadow-sm">
                OUR SERVICES
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent tracking-tighter leading-[0.9]">
              บริการ<br />
              <span className="bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">ครบวงจร</span>
              <span className="text-zinc-300 text-6xl md:text-8xl leading-none">.</span>
            </h2>
          </div>
          <div className="hidden md:block pb-2 border-l-4 border-zinc-200 pl-6">
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-bold">
              ดูแลคุณทุกขั้นตอน<br />
              <span className="text-zinc-900">ด้วยทีมงานมืออาชีพและมาตรฐานสากล</span>
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-zinc-50 animate-pulse border border-zinc-100" />
            ))
          ) : (
            services.map((service, index) => (
              <div
                key={service.id || index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group relative bg-white border border-zinc-200 hover:border-[#DAA520] transition-all duration-500 flex flex-col h-full opacity-0 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(255,213,5,0.15)] overflow-hidden"
              >
                {/* Image Area */}
                <div className="relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden p-6 border-b border-zinc-100">
                  <div className="absolute w-32 h-32 bg-[#DAA520] rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  <img
                    src={resolveUrl(service.image_url)}
                    alt={service.title}
                    className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                  />
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col grow bg-white relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-4xl font-black text-zinc-200 group-hover:text-[#DAA520]/20">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 mb-3 group-hover:text-[#b49503] transition-colors relative z-10">{service.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed grow font-medium relative z-10 line-clamp-3">{service.description}</p>
                  <div className="w-8 h-1 bg-zinc-200 mt-6 group-hover:w-full group-hover:bg-[#DAA520] transition-all duration-500" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* ======= ✅ เพิ่มปุ่มลิงก์ไปหน้า Services ตรงนี้ ======= */}
        <div className="text-center relative z-10">
          <Link href="/services" className="inline-block group relative">
            {/* เงาสีเทาด้านหลัง */}
            <div className="absolute inset-0 bg-zinc-200 transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>

            {/* ตัวปุ่มสีทอง */}
            <div className="relative bg-[#DAA520] px-14 py-5 text-zinc-900 font-black text-sm uppercase tracking-[0.25em] transition-all duration-300 hover:shadow-xl hover:shadow-[#DAA520]/20 flex items-center gap-4 border-2 border-[#DAA520]">
              <span>ดูบริการทั้งหมด</span>
              {/* เลือกเปลี่ยนไอค่อนตรงนี้ครับ */}
              <Boxes size={20} className="transition-transform duration-500 group-hover:scale-110" />
            </div>
          </Link>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        :global(.animate-spin-slow) { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}