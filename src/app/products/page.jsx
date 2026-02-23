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
        <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-(family-name:--font-ibm-plex-thai) selection:bg-amber-100/60 pb-24">
      <Navbar />

      {/* subtle background accents (gold/gray/white) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-white via-white to-[#F6F7F9]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-130 w-275 rounded-full bg-linear-to-r from-amber-100/45 via-white to-slate-100/50 blur-3xl" />
        <div className="absolute top-130 -right-55 h-105 w-105 rounded-full bg-amber-100/25 blur-3xl" />
      </div>

      {/* Top header */}
      <div className="max-w-400 mx-auto px-6 lg:px-12 pt-28 lg:pt-36">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-10 bg-amber-300/80" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-600 font-semibold">
                  TJC GROUP • PRODUCT CATALOG
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                รายการผลิตภัณฑ์
                <span className="text-slate-400 font-semibold"> / Catalog</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
                ค้นหาและเลือกดูสินค้าได้ตามหมวดหมู่ พร้อมรายละเอียดประกอบเพื่อการพิจารณาอย่างเป็นทางการ
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-xl">
              <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none
                           focus:border-amber-400 focus:ring-4 focus:ring-amber-100/70
                           text-sm font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Media panel (gold tone) */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-56 hidden lg:block bg-white">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="/video/vo002.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/25 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-amber-200/20 px-3 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <h3 className="text-white font-semibold text-sm tracking-wide">Official Product Overview</h3>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Section header */}
      <div className="max-w-400 mx-auto px-6 lg:px-12 mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            {selectedIdentifier === "all" ? "สินค้าทั้งหมด" : activeCategoryData?.title}
          </h2>
          <p className="text-xs text-slate-600 mt-1">แสดงผลตามหมวดหมู่และเงื่อนไขการค้นหา</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Results</span>
          <span className="text-[12px] font-extrabold text-amber-700">{filteredProducts.length}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-400 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:items-start">
          {/* Sidebar */}
          <aside className="w-full lg:sticky lg:top-28 z-30">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-linear-to-r from-white to-amber-50/40">
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <i className="bx bx-grid-alt text-amber-600" />
                  หมวดหมู่สินค้า
                </h3>
                <p className="text-xs text-slate-500 mt-1">เลือกหมวดหมู่เพื่อกรองรายการ</p>
              </div>

              <nav className="p-3 flex flex-col gap-1.5 max-h-[calc(100vh-240px)] overflow-y-auto no-scrollbar pr-1">
                <CategoryLink
                  active={selectedIdentifier === "all"}
                  label="สินค้าทั้งหมด"
                  onClick={() => handleCategoryChange("all")}
                />

                {categories.map((cat) => (
                  <div key={cat.id} className="flex flex-col">
                    <CategoryLink
                      active={normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)}
                      label={cat.title}
                      onClick={() => handleCategoryChange(cat.slug || cat.id)}
                    />

                    {(normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)) &&
                      cat.subcategories?.length > 0 && (
                        <div className="mt-1 mb-2 ml-3 pl-3 border-l border-amber-200/80 space-y-1">
                          {cat.subcategories.map((sub, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSubcategory(sub.title || sub)}
                              className={`w-full text-left text-[12px] py-2 px-3 rounded-lg transition
                                ${
                                  normalize(selectedSubcategory) === normalize(sub.title || sub)
                                    ? "bg-amber-500 text-white font-semibold shadow-sm"
                                    : "text-slate-700 hover:bg-amber-50 hover:text-slate-900 font-medium"
                                }`}
                            >
                              {sub.title || sub}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <div className="lg:col-span-4 min-h-80 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-3">
                <i className="bx bx-search text-2xl text-amber-600" />
              </div>
              <p className="text-slate-800 font-semibold">ไม่พบสินค้า</p>
              <p className="text-xs text-slate-500 mt-1">ลองปรับหมวดหมู่หรือคำค้นหาใหม่</p>
            </div>
          ) : (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} getImageUrl={getImageUrl} />)
          )}
        </div>
      </div>
    </div>
  );
}

/** UI HELPERS (โทนทอง-เทา-ขาว / ทางการ / ไม่แตะ logic) */
function CategoryLink({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition flex items-center justify-between border
        ${
          active
            ? "bg-slate-900 text-white border-slate-900 shadow-sm font-semibold"
            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50/60 hover:text-slate-900 hover:border-amber-200 font-medium"
        }`}
    >
      <span className="truncate pr-2">{label}</span>
      <span className="inline-flex items-center gap-2">
        {active && <span className="h-2 w-2 rounded-full bg-amber-300" />}
        <i className={`bx bx-chevron-right text-lg transition-transform ${active ? "rotate-90 text-amber-300" : "text-slate-400"}`} />
      </span>
    </button>
  );
}

function ProductCard({ product, getImageUrl }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col h-full overflow-hidden">
      <div className="relative bg-linear-to-b from-amber-50/35 to-white aspect-square flex items-center justify-center p-6">
        <div className="absolute inset-4 rounded-xl border border-slate-200/70 pointer-events-none" />
        <Image
          src={getImageUrl(product.image_url)}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-300 ease-out"
          unoptimized={true}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200">
            {product.category}
          </span>
        </div>

        <h3 className="text-[15px] font-bold text-slate-900 mb-2 leading-snug line-clamp-2 min-h-10">
          {product.name}
        </h3>

        <p className="text-slate-600 text-[12px] font-normal line-clamp-2 mb-5 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <a
            href={product.cta_url || "https://lin.ee/twVZIGO"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full
                       bg-amber-500 hover:bg-amber-600 text-white
                       py-3 rounded-xl font-semibold text-sm transition shadow-sm active:scale-[0.99]"
          >
            <i className="bx bxl-line text-xl" />
            <span>ติดต่อสอบถาม</span>
          </a>

          <p className="text-[10px] text-slate-500 mt-2 text-center">
            สำหรับขอใบเสนอราคา/เอกสารประกอบการจัดซื้อ
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-600 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading catalog...</span>
          </div>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}