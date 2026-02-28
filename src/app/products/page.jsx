"use client";

import React, { useState, useEffect, Suspense, useMemo, memo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../componect/Navbar";
import FloatingPotatoCorner from "../componect/FloatingPotato";
import Link from "next/link";
import FooterContact from "../componect/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const normalize = (val) => String(val || "").toLowerCase().trim();

// ✅ Search Input Component
const SearchInput = ({ value, onChange }) => {
  return (
    <div className="relative flex items-center">
      <i className="bx bx-search absolute left-5 top-1/2 -translate-y-1/2 text-xl text-zinc-400" />
      <input
        type="text"
        placeholder="ค้นหาชื่อสินค้า..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-6 py-4.5 bg-white border-2 border-zinc-100 rounded-none outline-none 
          focus:border-[#DAA520] focus:bg-white transition-all 
          text-base font-bold text-zinc-800 placeholder:text-zinc-300 shadow-sm"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#DAA520]/20 rounded-full" />
    </div>
  );
};

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramCat = searchParams.get("cat");
  const selectedIdentifier = !paramCat || paramCat === "undefined" ? "all" : paramCat;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [partnerLogos, setPartnerLogos] = useState([]); // ✅ State สำหรับโลโก้พาร์ทเนอร์
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedSubcategory("all");
  }, [selectedIdentifier]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ ดึงข้อมูลพร้อมกันทั้ง Categories, Products และ Partner Logos
        const [catRes, prodRes, partnerRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/product-categories`),
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/partner-logos`), // ดึง API
        ]);

        const [cats, prods, partners] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          partnerRes.ok ? partnerRes.json() : [], // กัน Error ถ้า API มีปัญหา
        ]);

        setCategories(cats);
        setProducts(prods);
        setPartnerLogos(partners);
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

  // ✅ แก้: หา activeCategoryData ให้ match ได้ทั้ง slug / id / title
  const activeCategoryData = useMemo(() => {
    if (selectedIdentifier === "all") return null;

    const needle = normalize(selectedIdentifier);

    return categories.find((c) => {
      const slug = normalize(c.slug);
      const id = normalize(c.id);
      const title = normalize(c.title);
      return needle === slug || needle === id || needle === title;
    });
  }, [categories, selectedIdentifier]);

  // ✅ แก้: filter ให้รองรับทั้ง category_slug / category_id / category(title/slug)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // --- category filter ---
      if (selectedIdentifier !== "all") {
        if (!activeCategoryData) return false;

        const selectedSlug = normalize(activeCategoryData.slug);
        const selectedId = normalize(activeCategoryData.id);
        const selectedTitle = normalize(activeCategoryData.title);

        // Product fields (รองรับหลายรูปแบบจาก API)
        const prodCatSlug = normalize(product.category_slug);
        const prodCatId = normalize(product.category_id);

        // บางระบบเก็บ product.category เป็น "title" หรือ "slug" หรือ "id"
        const prodCategory = normalize(product.category);

        const isMatch =
          (selectedSlug && prodCatSlug && prodCatSlug === selectedSlug) ||
          (selectedId && prodCatId && prodCatId === selectedId) ||
          (selectedTitle && prodCategory && prodCategory === selectedTitle) ||
          (selectedSlug && prodCategory && prodCategory === selectedSlug) ||
          (selectedId && prodCategory && prodCategory === selectedId);

        if (!isMatch) return false;
      }

      // --- subcategory filter ---
      if (selectedSubcategory !== "all" && normalize(product.subcategory) !== normalize(selectedSubcategory))
        return false;

      // --- search filter ---
      if (debouncedSearchQuery.trim() !== "" && !normalize(product.name).includes(normalize(debouncedSearchQuery)))
        return false;

      // --- active ---
      return product.is_active !== false;
    });
  }, [products, selectedIdentifier, activeCategoryData, selectedSubcategory, debouncedSearchQuery]);

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
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#DAA520]/30 pb-0 overflow-hidden">
      <Navbar />
      <FloatingPotatoCorner />

      {/* --- BACKGROUND DECOR --- */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-zinc-50 -skew-x-12 transform origin-top-right opacity-30" />
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="max-w-400 mx-auto px-6 lg:px-12 pt-32 lg:pt-48 mb-16">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
          <div className="max-w-5xl">
            <h1 className="text-4xl lg:text-[70px] font-black tracking-tighter leading-[0.85] filter drop-shadow-[0_0_2px_#fff]">
              <span className="bg-linear-to-r from-zinc-900 via-zinc-800 to-[#DAA520] bg-clip-text text-transparent">
                PRODUCT CATALOG
              </span>
              <span className="text-[#DAA520]">.</span>
            </h1>
            <p className="mt-8 lg:mt-12 text-zinc-500 font-medium text-lg lg:text-xl leading-relaxed italic border-l-4 border-[#DAA520] pl-6 lg:pl-10 max-w-2xl">
              ศูนย์รวมนวัตกรรมไอทีและครุภัณฑ์สำนักงานระดับมาตรฐานสากล เพื่อขับเคลื่อนธุรกิจของคุณสู่ความสำเร็จ
            </p>
          </div>
          <div className="relative w-full xl:w-125">
            <SearchInput value={inputValue} onChange={setInputValue} />
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-400 mx-auto px-6 lg:px-12 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8 items-start">
          {/* 1. CATEGORY BOX */}
          <div className="col-span-1 w-full">
            <div className="bg-white border border-zinc-200 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.06)] flex flex-col rounded-none">
              <div className="px-6 py-5 bg-zinc-900 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-[#DAA520] tracking-[0.3em] uppercase">Browse</span>
                  <span className="text-xs font-black text-white uppercase tracking-widest mt-1">Categories</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#DAA520] shadow-[0_0_10px_#DAA520]" />
              </div>
              <div className="p-4">
                <CategoryLink
                  active={selectedIdentifier === "all"}
                  label="ผลิตภัณฑ์ทั้งหมด"
                  onClick={() => handleCategoryChange("all")}
                />
                <div className="h-px bg-zinc-100 mx-2 my-2" />
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex flex-col gap-1">
                      <CategoryLink
                        active={
                          normalize(selectedIdentifier) === normalize(cat.slug) ||
                          normalize(selectedIdentifier) === normalize(cat.id) ||
                          normalize(selectedIdentifier) === normalize(cat.title)
                        }
                        label={cat.title}
                        onClick={() => handleCategoryChange(cat.slug || cat.id || cat.title)}
                      />
                      {(normalize(selectedIdentifier) === normalize(cat.slug) ||
                        normalize(selectedIdentifier) === normalize(cat.id) ||
                        normalize(selectedIdentifier) === normalize(cat.title)) &&
                        cat.subcategories?.length > 0 && (
                          <div className="my-1 ml-4 pl-3 border-l-2 border-[#DAA520]/30 flex flex-col gap-1">
                            {cat.subcategories.map((sub, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedSubcategory(sub.title || sub)}
                                className={`text-left text-[11px] py-1.5 px-2 transition-all duration-300 wrap-break-word whitespace-normal
                                  ${normalize(selectedSubcategory) === normalize(sub.title || sub)
                                    ? "text-[#b49503] font-black translate-x-1"
                                    : "text-zinc-400 hover:text-zinc-800 font-bold hover:translate-x-1"
                                  }`}
                              >
                                - {sub.title || sub}
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

          {/* 2. PRODUCT CARDS */}
          {filteredProducts.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-4 min-h-60 flex flex-col items-center justify-center bg-zinc-50 border-2 border-dashed border-zinc-200">
              <i className="bx bx-package text-5xl text-zinc-300 mb-4" />
              <p className="text-zinc-400 font-bold text-base uppercase tracking-widest">No matching items found</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <MemoizedProductCard key={product.id} product={product} getImageUrl={getImageUrl} />
            ))
          )}
        </div>
      </div>

      {/* ✅ PARTNER SLIDER จาก API */}
      {partnerLogos.length > 0 && <PartnerSlider logos={partnerLogos} resolveUrl={getImageUrl} />}

      <FooterContact />
    </div>
  );
}

function CategoryLink({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-[12px] uppercase tracking-wide transition-all duration-300 flex items-start justify-between gap-2 rounded-lg
        ${active
          ? "bg-zinc-100 text-[#b49503] font-black border-l-4 border-[#DAA520]"
          : "text-zinc-500 hover:text-zinc-900 font-bold hover:bg-zinc-50"
        }`}
    >
      <span className="flex-1 leading-snug wrap-break-word whitespace-normal">{label}</span>
      {active && <i className="bx bxs-circle text-[5px] mt-1.5 shrink-0" />}
    </button>
  );
}

const MemoizedProductCard = memo(function ProductCard({ product, getImageUrl }) {
  return (
    <div className="group relative w-full transform transition-transform duration-300 hover:z-10">
      <div className="relative flex flex-col bg-white transition-all duration-500 group-hover:-translate-y-2 border border-zinc-200 group-hover:border-[#DAA520] group-hover:shadow-[0_20px_40px_-12px_rgba(255,213,5,0.2)] overflow-hidden">
        {/* Image Section */}
        <Link
          href={`/products/${product.id}`}
          className="block relative h-75 overflow-hidden bg-zinc-50/80 items-center justify-center p-8 cursor-pointer"
        >
          <div className="absolute w-40 h-40 bg-[#DAA520] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 will-change-opacity" />
          <div className="absolute top-4 left-4 z-20">
            <span className="block bg-[#DAA520] px-3 py-1 text-[10px] font-black tracking-widest uppercase text-zinc-900 shadow-sm">
              {product.category || "SELECT"}
            </span>
          </div>
          <Image
            src={getImageUrl(product.image_url)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="relative z-10 object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-2 will-change-transform"
            unoptimized={true}
            loading="lazy"
          />
        </Link>

        {/* Content Section */}
        <div className="p-6 flex flex-col relative bg-white border-t border-zinc-100">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-black text-zinc-900 mb-3 leading-tight group-hover:text-[#b49503] transition-colors line-clamp-2 uppercase h-[2.8em] cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2 mb-8 font-medium h-[3em]">
            {product.description || "Specifications available upon request."}
          </p>
          <div className="mt-auto">
            <Link
              href={`/products/${product.id}`}
              className="group/btn relative overflow-hidden flex items-center justify-between w-full pl-4 pr-2 py-3 bg-white border border-zinc-200 text-zinc-900 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-zinc-900 hover:border-zinc-900 hover:text-white cursor-pointer"
            >
              <span className="relative z-10">ดูรายละเอียด</span>
              <span className="flex items-center justify-center w-8 h-8 bg-zinc-100 group-hover/btn:bg-zinc-800 rounded transition-colors">
                <i className="bx bxs-right-arrow-alt text-lg text-zinc-400 group-hover/btn:text-[#DAA520]"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

// ✅ PARTNER SLIDER COMPONENT (เชื่อมต่อข้อมูลจริง)
const PartnerSlider = ({ logos, resolveUrl }) => {
  return (
    <section className="py-16 bg-zinc-50 border-t border-zinc-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-zinc-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-zinc-50 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 text-center mb-10 bg-linear-to-r from-zinc-900 via-zinc-800 to-[#DAA520] bg-clip-text text-transparent ">
        <span className="text-[10px] font-black text-[#DAA520] tracking-[0.3em] uppercase">Trusted Partners</span>
        <h3 className="text-2xl font-black text-zinc-900 uppercase mt-2">พาร์ทเนอร์ของเรา</h3>
      </div>

      <div className="flex w-full overflow-hidden">
        <div className="flex animate-infinite-scroll gap-16 items-center pr-16">
          {/* Render วนลูป 4 รอบเพื่อให้ไร้รอยต่อ */}
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {logos.map((logo) => (
                <PartnerLogo key={`${i}-${logo.id}`} logo={logo} resolveUrl={resolveUrl} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

const PartnerLogo = ({ logo, resolveUrl }) => (
  // ✅ แก้ไข: นำ grayscale และ opacity-50 ออก เพื่อให้แสดงสีปกติ
  <div className="relative w-36 h-20 shrink-0 transition-all duration-500 cursor-pointer">
    <img
      src={resolveUrl(logo.image_url)}
      alt={logo.name}
      className="w-full h-full object-contain"
      onError={(e) => (e.target.src = `https://placehold.co/150x80?text=${logo.name}`)}
    />
  </div>
);

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductContent />
    </Suspense>
  );
}