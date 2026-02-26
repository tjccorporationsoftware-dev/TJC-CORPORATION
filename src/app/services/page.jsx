"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../componect/Navbar";
import { Loader2, ArrowUpRight, Sparkles } from "lucide-react";

// บังคับให้เป็น Dynamic Rendering เพื่อป้องกันการ Error ตอน Build เมื่อ API ไม่พร้อม
export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getImgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

// แยก Logic ออกมาเป็น Component ย่อยเพื่อใช้ร่วมกับ Suspense
function ServicesContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/services`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const activeServices = Array.isArray(data)
          ? data.filter((s) => s.is_active !== false).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          : [];
        setServices(activeServices);

        const uniqueCategories = ["All", ...new Set(activeServices.map((s) => s.category).filter((c) => c && c.trim() !== ""))];
        setCategories(uniqueCategories);

        const catFromUrl = searchParams.get("cat");
        if (catFromUrl && catFromUrl !== "all") {
          const matched = uniqueCategories.find((c) => c.toLowerCase() === decodeURIComponent(catFromUrl).toLowerCase());
          if (matched) setActiveCategory(matched);
        } else {
          setActiveCategory("All");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchParams]);

  const filteredServices = activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <>
      {/* ======= HERO SECTION ======= */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[45%] h-full bg-zinc-50 -skew-x-12 transform origin-top-right opacity-40" />
          <div className="absolute bottom-0 left-0 w-[35%] h-[40%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-left" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center animate-soft-fade">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-[#DAA520] font-bold tracking-[0.25em] uppercase text-[10px] px-5 py-2 shadow-sm">
              EXECUTIVE SERVICES
            </span>
          </div>

          <h1 className="text-4xl lg:text-7xl font-bold text-zinc-900 tracking-tighter leading-[1.1] mb-10 max-w-5xl mx-auto uppercase">
            Integrated Services<br />
            & Innovations<span className="text-[#DAA520]">.</span>
          </h1>

          <p className="text-zinc-500 text-lg lg:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            ยกระดับองค์กรด้วยโซลูชันเทคโนโลยีแบบครบวงจร โดยทีมผู้เชี่ยวชาญที่พร้อมขับเคลื่อนความสำเร็จอย่างยั่งยืน
          </p>
        </div>
      </div>

      {/* ======= TABS ======= */}
      <div className="sticky top-16 z-30 mb-12">
        <div className="max-w-min mx-auto bg-white/90 backdrop-blur-xl border border-zinc-100 p-2 rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`
                  relative px-6 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-500 whitespace-nowrap
                  ${activeCategory === cat
                    ? "bg-zinc-900/90 text-[#DAA520] shadow-md"
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"}
                `}
              >
                {cat === "All" ? "ทั้งหมด" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======= SERVICES GRID ======= */}
      <div className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#DAA520]" />
            </div>
          ) : (
            <div key={animationKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start animate-soft-fade">
              {filteredServices.length === 0 ? (
                <div className="col-span-full text-center py-32 bg-zinc-50 rounded-4xl border-2 border-dashed border-zinc-200">
                  <p className="text-zinc-400 font-bold uppercase tracking-[0.2em]">COMING SOON</p>
                </div>
              ) : (
                filteredServices.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// คอมโพเนนต์หลักที่ Export ออกไป
function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-800 selection:bg-[#DAA520]/30 overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUpSoft {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-soft-fade { animation: fadeInUpSoft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />
      <Navbar />

      {/* ใช้ Suspense หุ้มส่วนที่มีการเรียกใช้ useSearchParams */}
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 animate-spin text-[#DAA520]" />
        </div>
      }>
        <ServicesContent />
      </Suspense>

      {/* ======= CONTACT CTA ======= */}
      <div className="relative py-24 lg:py-40 bg-white overflow-hidden border-t border-zinc-100 text-center">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl lg:text-7xl font-bold text-zinc-900 mb-8 tracking-tighter leading-none uppercase">
            Let's build the future <br className="hidden md:block" />
            together<span className="text-[#DAA520] text-5xl md:text-8xl">.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="https://lin.ee/twVZIGO" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-14 py-5 bg-[#DAA520] text-zinc-900 font-bold text-[12px] uppercase tracking-[0.3em] rounded-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
              Line Official <i className="bx bxl-line text-xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, index }) {
  return (
    <div className="group relative flex flex-col bg-white rounded-none border border-zinc-100 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:border-[#DAA520]/30 hover:-translate-y-2 h-full overflow-hidden">
      <div className="relative h-64 overflow-hidden bg-zinc-50">
        {getImgUrl(service.image_url) ? (
          <img src={getImgUrl(service.image_url)} alt={service.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <Sparkles size={40} className="text-zinc-300" />
          </div>
        )}
        <div className="absolute top-6 left-6 z-10">
          <span className="inline-block px-4 py-2 bg-white border border-zinc-100 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em] shadow-sm">
            {service.category || "Service"}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1 relative">
        <h3 className="text-2xl font-bold text-zinc-800 leading-tight uppercase tracking-tight group-hover:text-[#b49503] transition-colors line-clamp-2 mb-4">
          {service.title}
        </h3>
        <p className="text-zinc-500 text-base font-medium leading-relaxed mb-10 line-clamp-3 italic">
          {service.description || "สอบถามข้อมูลเพิ่มเติมเกี่ยวกับบริการและรายละเอียดการติดตั้งได้โดยตรง"}
        </p>
        <div className="mt-auto">
          <a href="https://lin.ee/twVZIGO" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.25em] text-zinc-800 group/link">
            <span>Explore Solution</span>
            <ArrowUpRight size={18} className="text-[#DAA520] transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;