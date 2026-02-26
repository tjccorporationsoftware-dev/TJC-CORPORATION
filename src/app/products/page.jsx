"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../componect/Navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const normalize = (val) => String(val || "").toLowerCase().trim();

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramCat = searchParams.get("cat");
  const selectedIdentifier = !paramCat || paramCat === "undefined" ? "all" : paramCat;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedSubcategory("all");
  }, [selectedIdentifier]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/product-categories`),
          fetch(`${API_BASE_URL}/api/products`),
        ]);
        setCategories(await catRes.json());
        setProducts(await prodRes.json());
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (slug) => {
    const params = new URLSearchParams();
    if (slug !== "all") params.set("cat", slug);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const activeCategoryData = useMemo(() => {
    if (selectedIdentifier === "all") return null;
    return categories.find(
      (c) => normalize(c.slug) === normalize(selectedIdentifier) || normalize(c.id) === normalize(selectedIdentifier)
    );
  }, [categories, selectedIdentifier]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedIdentifier !== "all") {
        if (!activeCategoryData && !loading) return false;
        if (activeCategoryData) {
          const prodCat = normalize(product.category);
          const isMatch = prodCat === normalize(activeCategoryData.title) || prodCat === normalize(activeCategoryData.id);
          if (!isMatch) return false;
        }
      }
      if (selectedSubcategory !== "all" && normalize(product.subcategory) !== normalize(selectedSubcategory)) return false;
      if (searchQuery.trim() !== "" && !normalize(product.name).includes(normalize(searchQuery))) return false;
      return product.is_active !== false;
    });
  }, [products, selectedIdentifier, activeCategoryData, selectedSubcategory, searchQuery, loading]);

  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x600/f4f4f5/a1a1aa?text=No+Image";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/images/")) return url;
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-zinc-100 border-t-[#DAA520] rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#DAA520]/30 pb-24 overflow-hidden">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[45%] h-full bg-zinc-50 -skew-x-12 transform origin-top-right opacity-40" />
        <div className="absolute bottom-0 left-0 w-[35%] h-[40%] bg-[#DAA520]/5 -skew-x-12 transform origin-bottom-left" />
      </div>

      <div className="max-w-400 mx-auto px-6 lg:px-12 pt-32 lg:pt-44 mb-16">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 font-black tracking-[0.25em] uppercase text-[10px] px-4 py-2 shadow-sm">
                  EXECUTIVE CATALOG
                </span>
              </div>
              <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-zinc-800 leading-[0.9]">
                รายการผลิตภัณฑ์<span className="text-[#DAA520] text-5xl md:text-8xl">.</span>
              </h1>
              <p className="mt-8 text-zinc-500 font-medium leading-relaxed max-w-xl text-lg">
                คัดสรรนวัตกรรมและอุปกรณ์ไอทีคุณภาพสูง เพื่อตอบโจทย์การใช้งานระดับองค์กรอย่างมีประสิทธิภาพ
              </p>
            </div>

            <div className="relative w-full md:w-125 group">
              <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-400 group-focus-within:text-[#DAA520] transition-colors" />
              <input
                type="text"
                placeholder="ค้นหาสินค้าในระบบ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4.5 bg-white border border-zinc-200 rounded-sm outline-none
                           focus:border-[#DAA520] focus:ring-0 transition-all
                           text-sm font-bold shadow-sm placeholder:text-zinc-300"
              />
            </div>
          </div>

          <div className="lg:col-span-4 relative rounded-none border border-zinc-200 shadow-xl h-87.5 hidden lg:block overflow-hidden bg-zinc-100 group">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover group-hover:opacity-100 transition-opacity duration-700">
              <source src="/video/vo002.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-linear-to-t from-white/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-zinc-100 px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#DAA520] animate-pulse" />
                <h3 className="text-zinc-800 font-black text-[10px] uppercase tracking-[0.2em]">Official Showcase</h3>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-400 mx-auto px-6 lg:px-12">
        <div className="mb-12 flex items-center justify-between border-b border-zinc-100 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-[#DAA520] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">
                {selectedIdentifier === "all" ? "ALL PRODUCTS" : activeCategoryData?.title}
              </h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Found {filteredProducts.length} high-quality results</p>
            </div>
          </div>
        </div>

        {/* ปรับสัดส่วน Grid: Sidebar ขยายจาก 2 เป็น 3 ในจอใหญ่ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Sidebar: ขยายให้กว้างกว่าเดิมเพื่อรองรับชื่อเต็ม */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-32">
              <div className="bg-white rounded-4xl border border-zinc-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500">

                <div className="px-8 py-6 border-b border-zinc-50 bg-zinc-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-[#DAA520] rounded-full"></div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.25em] leading-none">PRODUCT</span>
                      <span className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.25em] leading-none mt-1">CATEGORIES</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <CategoryLink
                    active={selectedIdentifier === "all"}
                    label="สินค้าทั้งหมด"
                    onClick={() => handleCategoryChange("all")}
                  />

                  <div className="space-y-1 mt-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex flex-col gap-1">
                        <CategoryLink
                          active={normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)}
                          label={cat.title}
                          onClick={() => handleCategoryChange(cat.slug || cat.id)}
                        />

                        {(normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)) &&
                          cat.subcategories?.length > 0 && (
                            <div className="my-2 ml-4 pl-4 border-l-2 border-zinc-100 space-y-1">
                              {cat.subcategories.map((sub, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedSubcategory(sub.title || sub)}
                                  className={`w-full text-left text-[11px] py-2.5 px-3 rounded-lg transition-all duration-300 leading-relaxed
                                    ${normalize(selectedSubcategory) === normalize(sub.title || sub)
                                      ? "text-[#b49503] font-black bg-zinc-50 translate-x-1"
                                      : "text-zinc-500 hover:text-zinc-800 font-bold hover:translate-x-1"
                                    }`}
                                >
                                  — {sub.title || sub}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid: ปรับสัดส่วนให้เข้ากับ Sidebar ที่ขยายขึ้น */}
          <div className="lg:col-span-8 xl:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="min-h-80 flex flex-col items-center justify-center bg-zinc-50 border-2 border-dashed border-zinc-200">
                <i className="bx bx-package text-5xl text-zinc-300 mb-4" />
                <p className="text-zinc-500 font-bold text-lg uppercase tracking-widest">No Products Found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} getImageUrl={getImageUrl} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl text-[13px] transition-all duration-300 flex items-start justify-between border-l-4
        ${active
          ? "bg-[#DAA520] text-zinc-900 border-[#DAA520] shadow-md font-black"
          : "bg-white text-zinc-600 border-transparent hover:border-zinc-200 hover:bg-zinc-50 font-bold"
        }`}
    >
      <span className="leading-snug flex-1 mr-2 wrap-break-word">
        {label}
      </span>
      <i className={`bx bx-right-arrow-alt text-lg transition-transform mt-0.5 ${active ? "translate-x-1" : "opacity-0"}`} />
    </button>
  );
}

function ProductCard({ product, getImageUrl }) {
  return (
    <div className="group bg-white rounded-none border border-zinc-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-[#DAA520]/30 hover:-translate-y-2 flex flex-col h-full overflow-hidden">
      <div className="relative bg-zinc-50 aspect-square flex items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#DAA520] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
        <Image
          src={getImageUrl(product.image_url)}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
          unoptimized={true}
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2.5 py-1 text-[10px] font-black text-zinc-700 bg-white border border-zinc-100 uppercase tracking-[0.2em] shadow-sm">
            {product.category || "GENERAL"}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-black text-zinc-800 mb-2 leading-tight group-hover:text-[#b49503] transition-colors min-h-12 line-clamp-2 uppercase">
          {product.name}
        </h3>
        <p className="text-zinc-500 text-[12px] font-medium leading-relaxed line-clamp-2 mb-6 italic">
          {product.description || "Inquire for full technical specifications"}
        </p>
        <div className="mt-auto pt-6 border-t border-zinc-50">
          <a
            href={product.cta_url || "https://lin.ee/twVZIGO"}
            target="_blank"
            rel="noreferrer"
            className="group/btn flex items-center justify-between w-full bg-[#DAA520] text-zinc-900 hover:bg-[#DAA520] px-6 py-4 rounded-sm transition-all duration-300 shadow-[0_4px_15px_rgba(255,213,5,0.15)] hover:shadow-[0_10px_25px_rgba(255,213,5,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {/* ข้อความใช้ font-black และเพิ่มระยะห่างตัวอักษรเพื่อความหรูหรา */}
            <span className="font-black text-[11px] uppercase tracking-[0.2em]">
              ติดต่อสอบถามข้อมูล
            </span>

            <div className="flex items-center gap-2">
              {/* ไอคอน Line ปรับขนาดให้พอดี */}
              <i className="bx bxl-line text-xl transition-transform group-hover/btn:scale-110" />
              {/* ลูกศรที่จะเลื่อนออกมาเมื่อ Hover */}
              <i className="bx bx-right-arrow-alt text-xl opacity-0 -translate-x-2 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
            </div>
          </a>

          {/* ส่วนท้ายปรับให้ดู Official และสมดุลมากขึ้น */}
          <div className="flex items-center justify-center gap-3 mt-4 opacity-50">
            <div className="h-px w-4 bg-zinc-200"></div>
            <p className="text-[9px] font-black text-zinc-400 tracking-[0.3em] uppercase whitespace-nowrap">
              Official TJC Support
            </p>
            <div className="h-px w-4 bg-zinc-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-10 h-10 border-4 border-zinc-100 border-t-[#DAA520] rounded-full animate-spin" />
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}