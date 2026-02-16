"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../componect/Navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 🔥 1. เพิ่มฟังก์ชัน normalize เพื่อช่วยเปรียบเทียบค่า
const normalize = (val) => String(val || "").toLowerCase().trim();

function ProductContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // 🔥 2. ดึงค่า cat จาก URL อย่างปลอดภัย
    const paramCat = searchParams.get("cat");
    const selectedIdentifier = (!paramCat || paramCat === "undefined") ? "all" : paramCat;

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    // รีเซ็ต Subcategory เมื่อ URL เปลี่ยน
    useEffect(() => {
        setSelectedSubcategory("all");
    }, [selectedIdentifier]);

    // ดึงข้อมูล
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catRes, prodRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/product-categories`),
                    fetch(`${API_BASE_URL}/api/products`),
                ]);
                const cats = await catRes.json();
                const prods = await prodRes.json();
                setCategories(cats);
                setProducts(prods);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ล็อกสกรอลเมื่อเปิด Modal
    useEffect(() => {
        document.body.style.overflow = selectedProduct ? "hidden" : "unset";
    }, [selectedProduct]);

    // เปลี่ยนหมวดหมู่
    const handleCategoryChange = (slug) => {
        const params = new URLSearchParams();
        if (slug !== "all") {
            params.set("cat", slug);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // 🔥 3. Logic หาหมวดหมู่ปัจจุบัน (แก้ไขให้รองรับทั้ง ID, Slug, Title)
    const activeCategoryData = useMemo(() => {
        if (selectedIdentifier === "all") return null;
        return categories.find(
            (c) =>
                normalize(c.slug) === normalize(selectedIdentifier) ||
                normalize(c.id) === normalize(selectedIdentifier) ||
                normalize(c.title) === normalize(selectedIdentifier)
        );
    }, [categories, selectedIdentifier]);

    const activeSubcategories = activeCategoryData?.subcategories || [];

    // 🔥 4. Logic กรองสินค้า (แก้ไขให้ Robust ขึ้น)
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // 4.1 กรองตามหมวดหมู่หลัก
            if (selectedIdentifier !== "all") {
                if (!activeCategoryData && !loading) return false;

                if (activeCategoryData) {
                    const prodCat = normalize(product.category);
                    const targetTitle = normalize(activeCategoryData.title);
                    const targetId = normalize(activeCategoryData.id);
                    const targetSlug = normalize(activeCategoryData.slug);

                    // ยอมให้ผ่านถ้าตรงกับ Title หรือ ID หรือ Slug
                    const isMatch =
                        prodCat === targetTitle ||
                        prodCat === targetId ||
                        prodCat === targetSlug;

                    if (!isMatch) return false;
                }
            }

            // 4.2 กรองตามหมวดหมู่ย่อย
            if (selectedSubcategory !== "all") {
                if (normalize(product.subcategory) !== normalize(selectedSubcategory)) return false;
            }

            // 4.3 กรองตามคำค้นหา
            if (searchQuery.trim() !== "") {
                if (!normalize(product.name).includes(normalize(searchQuery))) return false;
            }

            return product.is_active !== false;
        });
    }, [products, selectedIdentifier, activeCategoryData, selectedSubcategory, searchQuery, loading]);

    const getImageUrl = (url) =>
        !url
            ? "https://placehold.co/600x600/f4f4f5/a1a1aa?text=No+Image"
            : url.startsWith("http")
                ? url
                : `${API_BASE_URL}${url}`;

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-5">
                    <div className="w-12 h-12 border-4 border-zinc-200 border-t-amber-500 rounded-full animate-spin shadow-lg"></div>
                    <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                        กำลังโหลดข้อมูล...
                    </span>
                </div>
            </div>
        );

    return (
        <div className="bg-[#FAFAFA] min-h-screen font-(family-name:--font-ibm-plex-thai) text-zinc-800 selection:bg-amber-500 selection:text-white pb-32">
            <Navbar />

            {/* ======= HEADER ======= */}
            <div className="w-full px-6 lg:px-10 2xl:px-16 pt-32 lg:pt-40">
                <header className="flex flex-col-reverse lg:flex-row lg:items-end justify-between gap-12 mb-20">
                    <div className="flex-1 max-w-3xl flex flex-col gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center justify-center p-3 overflow-hidden group">
                                <Image
                                    src="/images/logo.png"
                                    alt="TJC Corporation Logo"
                                    width={80}
                                    height={80}
                                    className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight leading-none mb-2">
                                    TJC Corporation
                                </h1>
                                <span className="text-xs font-semibold text-amber-600 tracking-[0.25em] uppercase">
                                    มาตรฐานคุณภาพที่คุณวางใจ
                                </span>
                            </div>
                        </div>

                        <div className="relative group max-w-lg">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <i className="bx bx-search text-xl text-zinc-400 group-focus-within:text-amber-500 transition-colors"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้าที่คุณต้องการ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-lg shadow-zinc-100/50 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="relative group cursor-pointer w-full md:w-auto self-start lg:self-end">
                        <div className="w-full md:w-[320px] h-45 relative rounded-3xl overflow-hidden shadow-2xl shadow-zinc-300/60 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-zinc-300/80">
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent group-hover:opacity-50 transition-opacity z-10" />
                            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000">
                                <source src="/video/vo002.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute bottom-5 right-5 z-20">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-500/90 group-hover:border-amber-400">
                                    <i className="bx bx-play text-white text-2xl ml-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <div className="w-full px-6 lg:px-10 2xl:px-16 flex flex-col lg:flex-row gap-12 xl:gap-20 lg:items-start">
                {/* Sidebar หมวดหมู่ */}
                <aside className="w-full lg:w-72 shrink-0 self-start lg:sticky lg:top-28">
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100/50">
                        <h3 className="hidden lg:flex items-center gap-2 text-xs font-bold text-zinc-800 uppercase tracking-widest mb-6">
                            <i className="bx bx-category text-amber-500 text-base"></i>
                            หมวดหมู่สินค้า
                        </h3>

                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar items-center lg:items-stretch">
                            <CategoryItem
                                active={selectedIdentifier === "all"}
                                onClick={() => handleCategoryChange("all")}
                                label="ดูทั้งหมด"
                            />

                            {categories.map((cat) => (
                                <div key={cat.id} className="flex flex-col w-full">
                                    <CategoryItem
                                        // ใช้ normalize เปรียบเทียบ
                                        active={normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)}
                                        onClick={() => handleCategoryChange(cat.slug || cat.id)}
                                        label={cat.title}
                                        count={products.filter(p => normalize(p.category) === normalize(cat.title) || normalize(p.category) === normalize(cat.id)).length}
                                    />

                                    {/* เมนูย่อย (Subcategories) */}
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${(normalize(selectedIdentifier) === normalize(cat.slug) || normalize(selectedIdentifier) === normalize(cat.id)) && activeSubcategories.length > 0 ? "max-h-96 opacity-100 mt-2 mb-3" : "max-h-0 opacity-0"}`}>
                                        <div className="flex flex-col pl-4 gap-1 border-l-2 border-zinc-100 ml-5">
                                            {activeSubcategories.map((sub, idx) => {
                                                const subName = typeof sub === "string" ? sub : sub.title;
                                                const isActiveSub = normalize(selectedSubcategory) === normalize(subName);
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedSubcategory(subName)}
                                                        className={`text-left text-sm py-2 px-4 rounded-xl transition-all duration-300 relative ${isActiveSub ? "text-amber-600 font-semibold bg-amber-50/50" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"}`}
                                                    >
                                                        {isActiveSub && <span className="absolute -left-px top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-amber-500 rounded-r-full"></span>}
                                                        {subName}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* รายการสินค้า */}
                <main className="grow min-h-[50vh]">
                    <div className="flex items-end justify-between mb-10 border-b border-zinc-200 pb-6">
                        <div>
                            <span className="text-[11px] text-amber-600 uppercase tracking-widest font-bold">รายการสินค้า</span>
                            <h2 className="text-3xl font-bold text-zinc-900 mt-2">
                                {selectedIdentifier === "all" ? "สินค้าทั้งหมด" : (activeCategoryData?.title || "ไม่พบหมวดหมู่")}
                            </h2>
                        </div>
                        <span className="text-xs font-semibold text-zinc-600 bg-white px-4 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                            {filteredProducts.length} รายการ
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="min-h-100 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                <i className="bx bx-search-alt text-4xl text-zinc-300"></i>
                            </div>
                            <p className="text-zinc-600 font-medium text-lg">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                            <button
                                onClick={() => { setSearchQuery(""); handleCategoryChange("all"); }}
                                className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
                            >
                                ล้างตัวกรองทั้งหมด
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10 gap-x-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} getImageUrl={getImageUrl} onOpenModal={setSelectedProduct} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal รายละเอียดสินค้า */}
            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} getImageUrl={getImageUrl} />
            )}
        </div>
    );
}

// ส่วนประกอบหลักที่ต้องมี Suspense ครอบไว้
export default function ProductPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ProductContent />
        </Suspense>
    );
}

// ================= SUB COMPONENTS (UI ส่วนย่อย) =================

const CategoryItem = ({ active, onClick, label, count }) => (
    <button
        onClick={onClick}
        className={`group relative w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 outline-none shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal ${active ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]" : "bg-transparent text-zinc-600 hover:bg-white hover:shadow-md hover:text-zinc-900"}`}
    >
        <span className={`text-sm tracking-wide ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
        {count !== undefined && (
            <span className={`hidden lg:flex items-center justify-center w-6 h-6 rounded-full transition-colors ${active ? "text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"}`}>
                <i className={`bx ${active ? "bx-chevron-up" : "bx-chevron-down"} text-xl`}></i>
            </span>
        )}
    </button>
);

function ProductCard({ product, getImageUrl, onOpenModal }) {
    return (
        <div onClick={() => onOpenModal(product)} className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-zinc-200/60 transition-all duration-500 border border-zinc-100 flex flex-col h-full transform hover:-translate-y-1 rounded-3xl">
            <div className="relative bg-zinc-50/50 p-8 aspect-square flex items-center justify-center overflow-hidden">
                <Image src={getImageUrl(product.image_url)} alt={product.name} fill className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out p-6" unoptimized />
            </div>
            <div className="p-6 flex flex-col grow bg-white relative z-20">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md">{product.category}</span>
                    {product.subcategory && <span className="text-[10px] font-medium text-zinc-400 truncate">• {product.subcategory}</span>}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors duration-300">{product.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light line-clamp-3 wrap-break-word mb-6">{product.description}</p>
                <div className="mt-auto border-t border-zinc-100 pt-4">
                    {product.cta_url ? (
                        <div className="group flex items-center justify-center gap-3 w-full bg-zinc-900 hover:bg-amber-500 text-white py-4 rounded-2xl text-base font-medium tracking-wide transition-all duration-300">
                            <span>ดูรายละเอียด</span>
                            <i className="bx bx-right-arrow-alt text-2xl group-hover:translate-x-2 transition-transform"></i>
                        </div>
                    ) : (
                        <button disabled className="w-full bg-zinc-100 text-zinc-400 py-4 rounded-2xl text-base font-bold cursor-not-allowed">สินค้าหมดชั่วคราว</button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductModal({ product, onClose, getImageUrl }) {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 lg:p-12">
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300 max-h-[90vh]">
                <button onClick={onClose} className="absolute top-8 right-8 z-10 w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <i className="bx bx-x text-2xl text-zinc-900"></i>
                </button>
                <div className="w-full md:w-1/2 bg-[#f9f9f9] p-12 flex items-center justify-center">
                    <div className="relative w-full aspect-square">
                        <Image src={getImageUrl(product.image_url)} alt={product.name} fill className="object-contain" unoptimized />
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col overflow-y-auto">
                    <div className="flex gap-2 mb-6">
                        <span className="px-4 py-1.5 bg-zinc-900 text-white text-[10px] font-black rounded-full uppercase">{product.category}</span>
                        {product.subcategory && <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase border border-amber-200">{product.subcategory}</span>}
                    </div>
                    <h2 className="text-4xl font-bold text-zinc-900 mb-6 leading-tight">{product.name}</h2>
                    <p className="text-zinc-500 text-lg leading-relaxed mb-10 font-light whitespace-pre-wrap">{product.description || "ไม่มีรายละเอียดเพิ่มเติมสำหรับสินค้านี้"}</p>
                    <div className="mt-auto space-y-4">
                        {product.cta_url && (
                            <a href={product.cta_url} target="_blank" rel="noreferrer" className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-2xl font-bold text-lg transition-all">Contact For More Details</a>
                        )}
                        <button onClick={onClose} className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-800 transition-colors">ปิดหน้าต่าง</button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C5A059; }
            `}</style>
        </div>
    );
}