"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const resolveUrl = (u) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  if (u.startsWith("/images/")) return u;
  const cleanPath = u.startsWith("/") ? u : `/${u}`;
  return `${API_BASE}${cleanPath}`;
};

export default function WorkJSFast() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const productRefs = useRef([]);
  productRefs.current = [];

  const addToRefs = (el) => {
    if (el && !productRefs.current.includes(el)) productRefs.current.push(el);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const activeProducts = data
          .filter((p) => p.is_active !== false)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setProducts(activeProducts.slice(0, 4));
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------------------------------
  // 🔽 ปรับความเร็วอนิเมชั่นตรงนี้ (Slower Animation)
  // -------------------------------------------------------
  useEffect(() => {
    if (loading || products.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 } // เริ่มเล่นเมื่อเห็นแค่ 15% ของกล่อง
    );

    productRefs.current.forEach((el, i) => {
      if (!el) return;

      const distance = isMobile ? 30 : 60;
      const direction = i % 2 === 0 ? 1 : -1; // คู่=ล่างขึ้นบน, คี่=บนลงล่าง

      el.style.opacity = 0;
      el.style.transform = `translateY(${distance * direction}px)`;

      // ✅ แก้ไข: เพิ่มเวลา Duration เป็น 1.6s และ Delay เป็น 0.3s
      el.style.transition = `all 1.6s cubic-bezier(0.19, 1, 0.22, 1) ${(i * 0.3).toFixed(2)}s`;

      observer.observe(el);
    });
  }, [loading, products, isMobile]);
  // -------------------------------------------------------

  return (
    <section id="work" className="relative bg-white py-24 lg:py-32 overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-zinc-100/50 -skew-x-12 transform origin-top-right pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-left pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-zinc-50 text-zinc-800 border-l-4 border-[#DAA520] font-bold tracking-[0.2em] uppercase text-[11px] px-4 py-1.5 shadow-sm">
                EXECUTIVE SHOWCASE
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.9]">
              สินค้าและ<br />
              <span className="text-[#DAA520] drop-shadow-sm inline-block">
                โซลูชันของเรา
              </span>
              <span className="text-zinc-300 text-6xl md:text-8xl leading-none">.</span>
            </h2>
          </div>

          <div className="hidden md:block pb-2 border-l-4 border-zinc-200 pl-6">
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-bold">
              คัดสรรนวัตกรรมคุณภาพสูง<br />
              <span className="text-zinc-900">เพื่อยกระดับธุรกิจของคุณให้เหนือกว่า</span>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-350 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 relative z-10 mb-24">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-112.5 bg-zinc-50 rounded-none animate-pulse border border-zinc-100" />
          ))
        ) : (
          products.map((p) => (
            <div key={p.id} ref={addToRefs} className="group relative opacity-0">

              <div className="relative flex flex-col h-full bg-white transition-all duration-500 group-hover:-translate-y-2 border border-zinc-200 group-hover:border-[#DAA520] group-hover:shadow-[0_20px_40px_-12px_rgba(255,213,5,0.2)] overflow-hidden">

                <div className="relative h-75 overflow-hidden bg-zinc-50/80 flex items-center justify-center p-8">
                  <div className="absolute w-40 h-40 bg-[#DAA520] rounded-full blur-[70px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  <img
                    src={resolveUrl(p.image_url)}
                    alt={p.name}
                    className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="block bg-[#DAA520] px-3 py-1 text-[10px] font-black tracking-widest uppercase text-zinc-900 shadow-sm">
                      {p.category || "SELECT"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col grow relative bg-white border-t border-zinc-100">
                  <h3 className="text-xl font-black text-zinc-900 mb-3 leading-tight group-hover:text-[#b49503] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2 mb-8 font-medium">
                    {p.description}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="https://lin.ee/twVZIGO"
                      target="_blank"
                      className="group/btn relative overflow-hidden flex items-center justify-between w-full pl-4 pr-2 py-3 bg-white border border-zinc-200 text-zinc-900 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-zinc-900 hover:border-zinc-900 hover:text-white"
                    >
                      <span className="relative z-10">
                        สอบถามข้อมูล
                      </span>
                      <span className="flex items-center justify-center w-8 h-8 bg-zinc-100 group-hover/btn:bg-zinc-800 rounded transition-colors">
                        <i className="bx bxs-right-arrow-alt text-lg text-zinc-400 group-hover/btn:text-[#DAA520]"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center relative z-10">
        <Link
          href="/products"
          className="inline-block group relative"
        >
          <div className="absolute inset-0 bg-zinc-200 transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
          <div className="relative bg-[#DAA520] px-14 py-5 text-zinc-900 font-black text-sm uppercase tracking-[0.25em] transition-all duration-300 hover:shadow-xl hover:shadow-[#DAA520]/20 flex items-center gap-4 border-2 border-[#DAA520]">
            <span>ดูสินค้าทั้งหมด</span>
            <i className="bx bx-grid-alt text-xl" />
          </div>
        </Link>
      </div>

      <style jsx>{`
        .animate-show {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}