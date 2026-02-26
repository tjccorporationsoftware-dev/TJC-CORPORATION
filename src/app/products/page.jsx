"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../componect/Navbar";
import FloatingPotatoCorner from "../componect/FloatingPotato";
import Link from "next/link";

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
      <FloatingPotatoCorner />

      {/* --- BACKGROUND DECOR --- */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-zinc-50 -skew-x-12 transform origin-top-right opacity-30" />
      </div>

      {/* --- HEADER SECTION: Ultra-Wide 1600px --- */}
      <div className="max-w-400 mx-auto px-6 lg:px-12 pt-32 lg:pt-48 mb-20">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
          <div className="max-w-5xl">
            <h1 className="text-2xl lg:text-[70px] font-black tracking-tighter leading-[0.85] filter drop-shadow-[0_0_2px_#fff] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <span className="bg-linear-to-r from-zinc-900 via-zinc-800 to-[#DAA520] bg-clip-text text-transparent">
                PRODUCT CATALOG
              </span>
              <span className="text-[#DAA520]">.</span>
            </h1>

            <p className="mt-12 text-zinc-500 font-medium text-xl leading-relaxed italic border-l-4 border-[#DAA520] pl-10 max-w-2xl">
              ศูนย์รวมนวัตกรรมไอทีและครุภัณฑ์สำนักงานระดับมาตรฐานสากล เพื่อขับเคลื่อนธุรกิจของคุณสู่ความสำเร็จ
            </p>
          </div>

          <div className="relative w-full xl:w-125">
            <div className="relative flex items-center">
              <i className="bx bx-search absolute left-5 top-1/2 -translate-y-1/2 text-xl text-zinc-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้าหรือรหัสสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4.5 bg-white border-2 border-zinc-100 rounded-2xl outline-none 
                 focus:border-[#DAA520] focus:bg-white transition-all 
                 text-base font-bold text-zinc-800 placeholder:text-zinc-300 shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#DAA520]/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-400 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* SIDEBAR: ขยายความกว้างและแก้ตัวหนังสือตัด */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-32">
              <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden">

                <div className="px-10 py-8 border-b border-zinc-50 bg-zinc-900 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#DAA520] tracking-[0.3em] uppercase">Browse</span>
                    <span className="text-sm font-black text-white uppercase tracking-widest mt-1">Categories</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DAA520] shadow-[0_0_15px_#DAA520]" />
                </div>

                <div className="p-6 space-y-2.5">
                  <CategoryLink
                    active={selectedIdentifier === "all"}
                    label="ผลิตภัณฑ์ทั้งหมด"
                    onClick={() => handleCategoryChange("all")}
                  />

                  <div className="h-px bg-zinc-50 mx-2 my-2" />

                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex flex-col gap-1">
                        <CategoryLink
                          active={normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)}
                          label={cat.title}
                          onClick={() => handleCategoryChange(cat.slug || cat.id)}
                        />

                        {(normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)) &&
                          cat.subcategories?.length > 0 && (
                            <div className="my-2 ml-8 pl-5 border-l-2 border-[#DAA520]/20 flex flex-col gap-2">
                              {cat.subcategories.map((sub, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedSubcategory(sub.title || sub)}
                                  className={`text-left text-[13px] py-2.5 px-4 rounded-xl transition-all duration-300
                                    ${normalize(selectedSubcategory) === normalize(sub.title || sub)
                                      ? "text-[#b49503] font-black bg-zinc-50 translate-x-1"
                                      : "text-zinc-400 hover:text-zinc-800 font-bold hover:translate-x-1"
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
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex items-center gap-6 mb-12 border-b border-zinc-100 pb-10">
              <h2 className="text-zinc-900 font-black text-4xl uppercase tracking-tighter">
                {selectedIdentifier === "all" ? "Our Collections" : activeCategoryData?.title}
              </h2>
              <div className="h-2 w-2 rounded-full bg-[#DAA520]" />
              <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
                {filteredProducts.length} Premium Items
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="min-h-100 flex flex-col items-center justify-center bg-zinc-50 rounded-[3.5rem] border-2 border-dashed border-zinc-100">
                <i className="bx bx-package text-7xl text-zinc-200 mb-6" />
                <p className="text-zinc-400 font-bold text-xl uppercase tracking-widest">No matching items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-8">
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
      className={`w-full text-left px-6 py-4 rounded-2xl text-[14px] transition-all duration-500 flex items-start justify-between gap-3
        ${active
          ? "bg-zinc-50 text-[#b49503] font-black shadow-inner"
          : "text-zinc-500 hover:text-zinc-900 font-bold hover:translate-x-1"
        }`}
    >
      <span className="flex-1 leading-snug wrap-break-word">
        {label}
      </span>
      {active && <i className="bx bx-chevron-right text-xl mt-0.5" />}
    </button>
  );
}

function ProductCard({ product, getImageUrl }) {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-zinc-100 transition-all duration-700 hover:shadow-[0_60px_100px_-30px_rgba(218,165,32,0.12)] hover:border-[#DAA520]/20 flex flex-col h-full overflow-hidden">
      <div className="relative bg-zinc-50 aspect-square p-10 flex items-center justify-center overflow-hidden">
        <Image
          src={getImageUrl(product.image_url)}
          alt={product.name}
          fill
          className="object-contain p-10 transition-transform duration-1000 ease-out group-hover:scale-110"
          unoptimized={true}
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 text-[9px] font-black text-white bg-zinc-900 rounded-lg uppercase tracking-widest shadow-2xl">
            {product.category || "Official"}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-base font-black text-zinc-900 mb-3 leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-[#b49503] transition-colors">
          {product.name}
        </h3>
        <p className="text-zinc-400 text-[12px] leading-relaxed line-clamp-2 mb-8 italic">
          {product.description || "Specifications available upon request"}
        </p>

        <div className="mt-auto">
          {/* ✅ เปลี่ยนเป็นปุ่มดูรายละเอียดเพิ่มเติม และใช้ Link ไปที่หน้าสินค้า */}
          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center w-full bg-zinc-900 text-[#DAA520] hover:bg-[#DAA520] hover:text-zinc-900 py-4 rounded-2xl transition-all duration-500 font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95"
          >
            ดูรายละเอียดเพิ่มเติม
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductContent />
    </Suspense>
  );
}