"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../componect/Navbar";
import { Loader2, ArrowUpRight } from "lucide-react";

// --- Config ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getImgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

function ServicesPage() {
  const searchParams = useSearchParams();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [animateTrigger, setAnimateTrigger] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/services`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        const activeServices = Array.isArray(data)
          ? data
              .filter((s) => s.is_active !== false)
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          : [];

        setServices(activeServices);

        const uniqueCategories = [
          "All",
          ...new Set(activeServices.map((s) => s.category).filter((c) => c && c.trim() !== "")),
        ];
        setCategories(uniqueCategories);

        const catFromUrl = searchParams.get("cat");
        if (catFromUrl && catFromUrl !== "all") {
          const matched = uniqueCategories.find(
            (c) => c.toLowerCase() === decodeURIComponent(catFromUrl).toLowerCase()
          );
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

  const filteredServices =
    activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setAnimateTrigger(false);
    setTimeout(() => setAnimateTrigger(true), 20);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-(family-name:--font-ibm-plex-thai) selection:bg-amber-100/60 overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(14px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-custom-fade { animation: fadeInUp 0.55s ease-out forwards; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

            /* more subtle, formal hover zoom */
            .img-hover-zoom { transition: transform 0.75s cubic-bezier(0.2, 0, 0.2, 1); }
            .group:hover .img-hover-zoom { transform: scale(1.04); }
          `,
        }}
      />

      <Navbar />

      {/* ======= HERO SECTION (Gold/Gray/White) ======= */}
      <div className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-24 border-b border-slate-100">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-b from-white via-white to-[#F6F7F9]" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-130 w-275 rounded-full bg-linear-to-r from-amber-100/55 via-white to-slate-100/60 blur-3xl" />
          <div className="absolute top-130 -right-55 h-105 w-105 rounded-full bg-amber-100/25 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 text-center animate-custom-fade">
          {/* Branding Label */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-7">
            <span className="h-px w-6 bg-amber-200/90" />
            <h2 className="text-slate-800 font-semibold tracking-[0.22em] text-[9px] sm:text-[10px] uppercase">
              TJC <span className="text-amber-700">Corporation</span>
            </h2>
            <span className="h-px w-6 bg-amber-200/90" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 sm:mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            Integrated Technology & <br className="hidden sm:block" />
            <span className="text-amber-700 font-semibold">Infrastructure Solutions</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            ผู้เชี่ยวชาญด้านการจัดจำหน่ายและวางระบบเทคโนโลยีสำหรับหน่วยงานภาครัฐและเอกชน
            ครอบคลุมทั้งระบบโครงข่ายไอทีและครุภัณฑ์ทางการศึกษาทั่วประเทศ
          </p>

          {/* subtle separator */}
          <div className="mt-10 flex justify-center">
            <div className="h-px w-24 bg-linear-to-r from-transparent via-amber-300/80 to-transparent" />
          </div>
        </div>
      </div>

      {/* ======= TABS (Formal, Gold underline) ======= */}
      <div className="sticky top-16 z-30 bg-white/92 backdrop-blur-md border-b border-slate-200 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-3.5 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`
                  relative text-[13px] sm:text-sm font-semibold transition-all duration-300 pb-2 whitespace-nowrap
                  ${
                    activeCategory === cat
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                <span className="relative">
                  {cat === "All" ? "ทั้งหมด" : cat}
                  {/* underline */}
                  <span
                    className={`
                      absolute left-0 -bottom-2 h-0.5 w-full rounded-full transition-all duration-300
                      ${
                        activeCategory === cat
                          ? "bg-linear-to-r from-amber-300 via-amber-500 to-amber-300 opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======= SERVICES GRID ======= */}
      <div className="bg-[#F6F7F9] py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-start ${
                animateTrigger ? "animate-custom-fade" : "opacity-0"
              }`}
            >
              {filteredServices.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-500 font-light text-sm sm:text-base">
                  ไม่พบข้อมูลในหมวดหมู่นี้
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="
                      group flex flex-col bg-white border border-slate-200 rounded-2xl
                      hover:border-amber-300/70 hover:shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]
                      transition-all duration-300 overflow-hidden
                    "
                  >
                    {/* Image */}
                    <div className="relative aspect-16/10 sm:aspect-4/3 lg:aspect-16/10 overflow-hidden bg-slate-100">
                      {getImgUrl(service.image_url) ? (
                        <img
                          src={getImgUrl(service.image_url)}
                          alt={service.title}
                          className="w-full h-full object-cover img-hover-zoom"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                          <div className="w-10 h-10 bg-white rounded-full opacity-70 border border-slate-200" />
                        </div>
                      )}

                      {/* Gold frame line */}
                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-amber-200/35" />
                      {/* top accent */}
                      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-amber-500 to-amber-300 opacity-80" />
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1">
                      <div className="mb-4 sm:mb-5">
                        <p className="text-[9px] sm:text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">
                          {service.category || "Service"}
                        </p>

                        <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                          {service.title}
                        </h3>
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6 sm:mb-8 flex-1 line-clamp-3 lg:line-clamp-2">
                        {service.description ||
                          "สอบถามข้อมูลเพิ่มเติมเกี่ยวกับบริการได้ผ่านช่องทางการติดต่อของเรา"}
                      </p>

                      {/* Action */}
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <a
                          href="https://lin.ee/twVZIGO"
                          target="_blank"
                          rel="noreferrer"
                          className="
                            inline-flex items-center justify-between w-full
                            text-[11px] sm:text-xs font-bold uppercase tracking-widest
                            text-slate-700 hover:text-slate-900
                            transition-colors
                          "
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                            View Details
                          </span>
                          <ArrowUpRight size={16} className="text-amber-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======= CONTACT CTA ======= */}
      <div className="bg-white py-16 sm:py-24 border-t border-slate-100 text-center">
        <div className="max-w-3xl mx-auto px-6 animate-custom-fade">
          <div className="flex justify-center mb-6">
            <div className="h-px w-28 bg-linear-to-r from-transparent via-amber-300/80 to-transparent" />
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-4 sm:mb-5 tracking-tight">
            ร่วมงานกับ TJC Corporation
          </h2>

          <p className="text-slate-600 mb-10 font-light text-sm sm:text-base leading-relaxed">
            ทีมงาน TJC พร้อมให้คำปรึกษาและจัดหาโซลูชันที่เหมาะสมที่สุดสำหรับคุณ
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
            <a
              href="https://lin.ee/twVZIGO"
              target="_blank"
              rel="noreferrer"
              className="
                w-full sm:w-auto
                bg-slate-900 hover:bg-slate-800 text-white
                px-8 sm:px-12 py-3.5 rounded-xl
                text-[11px] sm:text-xs font-bold uppercase tracking-widest
                transition-all shadow-sm active:scale-95
              "
            >
              Line Official
            </a>

            <a
              href="/contact"
              className="
                w-full sm:w-auto
                bg-white border border-slate-200 hover:border-amber-300
                text-slate-900
                px-8 sm:px-12 py-3.5 rounded-xl
                text-[11px] sm:text-xs font-bold uppercase tracking-widest
                transition-all active:scale-95
              "
            >
              Contact Us
            </a>
          </div>

          <p className="mt-6 text-[11px] text-slate-500">
            สำหรับขอใบเสนอราคา/เอกสารประกอบการจัดซื้อ
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;