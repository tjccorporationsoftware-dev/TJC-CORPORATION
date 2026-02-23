"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// 1. ตั้งค่า API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


const resolveUrl = (u) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;

  // 1. ถ้าเป็นรูปในโฟลเดอร์ public ของหน้าบ้าน (Next.js) ให้ส่งกลับไปเลย ไม่ต้องเติม API URL
  if (u.startsWith("/images/")) {
    return u;
  }

  // 2. ถ้าเป็นรูปที่มาจากระบบอัปโหลดของ Backend ให้เติม API URL
  const cleanPath = u.startsWith("/") ? u : `/${u}`;
  return `${API_BASE}${cleanPath}`;
};

export default function WorkJSFast() {
  const [products, setProducts] = useState([]); // เก็บข้อมูลสินค้า
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [isMobile, setIsMobile] = useState(false);

  const productRefs = useRef([]);
  productRefs.current = [];

  const addToRefs = (el) => {
    if (el && !productRefs.current.includes(el)) productRefs.current.push(el);
  };

  // 3. ดึงข้อมูลสินค้าจาก Database
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // กรองเอาเฉพาะสินค้าที่ Active และเรียงลำดับตาม sort_order (ถ้ามี)
        const activeProducts = data
          .filter(p => p.is_active !== false)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        // เก็บไว้เพียง 4 รายการแรก
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

  // 4. จัดการ Animation หลังจากข้อมูลโหลดเสร็จแล้ว
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
      { threshold: 0.2 }
    );

    productRefs.current.forEach((el, i) => {
      if (!el) return;
      const distance = isMobile ? 40 : 80;
      el.style.opacity = 0;
      el.style.transform = `translateY(${i % 2 === 0 ? distance : -distance}px) scale(0.92)`;
      el.style.transition = `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${(i * 0.12).toFixed(2)}s`;
      observer.observe(el);
    });
  }, [loading, products, isMobile]);

  return (
    <section id="work" className="relative bg-linear-to-b from-white via-gray-50 to-gray-100 py-24 overflow-hidden">
      {/* Gold Ambient Lighting */}
      <div className="absolute -top-20 right-0 w-96 h-96 bg-yellow-300/20 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-gray-400/10 blur-[120px] rounded-full"></div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-16 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight"
        >
          สินค้าและโซลูชันของเรา
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg"
        >
          เราคัดสรรโซลูชันที่เน้นประสิทธิภาพ ดีไซน์ทันสมัย และตอบโจทย์การใช้งานจริงขององค์กร
        </motion.p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 relative z-10 mb-16">
        {loading ? (
          // Skeleton Loading (แสดงกล่องว่างๆ ขณะโหลด)
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200/50 rounded-3xl animate-pulse"></div>
          ))
        ) : (
          products.map((p) => (
            <div key={p.id} ref={addToRefs} className="group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:scale-[1.03] flex flex-col h-full">
              {/* Image */}
              <div className="h-48 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                <img
                  src={resolveUrl(p.image_url)}
                  alt={p.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{p.category}</span>
                <h3 className="mt-2 text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{p.description}</p>

                {/* ปุ่มสอบถามเพิ่มเติม (Link ไป Line ตามเดิม) */}
                <a href="https://lin.ee/twVZIGO" target="_blank" className="mt-auto inline-block w-full text-center bg-linear-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all">
                  สอบถามเพิ่มเติม
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ปุ่มดูสินค้าทั้งหมด (สไตล์เรียบหรูที่คุณเลือก) */}
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center mt-14">
        <Link
          href="/products"
          className="
            group relative inline-flex items-center gap-4 px-12 py-4 
            bg-white border border-amber-500/30 
            text-amber-700 font-semibold text-base rounded-full
            transition-all duration-700 ease-in-out
            hover:border-amber-500 hover:bg-amber-500 hover:text-white
            hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.2)]
            active:scale-95
          "
        >
          <span className="relative z-10 tracking-widest uppercase text-sm">
            ดูสินค้าทั้งหมด
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
        </Link>
      </div>

      <style jsx>{`.animate-show { transform: translateY(0) scale(1) !important; opacity: 1 !important; }`}</style>
    </section>
  );
}