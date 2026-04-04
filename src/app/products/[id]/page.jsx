"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../componect/Navbar";
import FooterContact from "../../componect/Footer";
import ScrollToTop from "../../componect/ScrollToTop";
import FloatingPotatoCorner from "../../componect/FloatingPotato";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const normalize = (val) => String(val || "").toLowerCase().trim();

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [res, allRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/products/${id}`),
                    fetch(`${API_BASE_URL}/api/products`)
                ]);

                if (!res.ok) throw new Error("Product not found");

                setProduct(await res.json());
                setAllProducts(await allRes.json());
            } catch (err) {
                console.error("Fetch error:", err);
                router.push("/products");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id, router]);

    const relatedProducts = useMemo(() => {
        if (!product || !allProducts.length) return [];
        return allProducts.filter(p =>
            normalize(p.category) === normalize(product.category) &&
            p.id.toString() !== id.toString()
        ).slice(0, 4);
    }, [product, allProducts, id]);

    const getImageUrl = (url) => {
        if (!url) return "https://placehold.co/600x600/f4f4f5/a1a1aa?text=No+Image";
        if (url.startsWith("http")) return url;
        if (url.startsWith("/images/")) return url;
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        return `${API_BASE_URL}${cleanPath}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-zinc-100 border-t-[#DAA520] rounded-full animate-spin" />
        </div>
    );

    // ✅ แก้ไขปัญหาข้อมูลสเปกหาย โดยการเช็คและแปลง JSON String เป็น Array ให้ถูกต้อง
    let specs = [];
    if (product && product.specifications) {
        if (Array.isArray(product.specifications)) {
            specs = product.specifications;
        } else if (typeof product.specifications === 'string') {
            try {
                specs = JSON.parse(product.specifications);
            } catch (e) {
                console.error("Failed to parse specifications", e);
                specs = [];
            }
        }
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-(family-name:--font-ibm-plex-thai) selection:bg-[#DAA520]/30">
            <Navbar />
            <FloatingPotatoCorner />
            <ScrollToTop />
            <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 lg:pt-48 pb-24">

                {/* --- Main Detail --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start mb-0">
                    <div className="relative aspect-square bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shadow-inner w-full rounded-2xl">
                        <Image
                            src={getImageUrl(product.image_url)}
                            alt={product.name}
                            fill
                            className="object-contain p-8 transition-transform duration-700 hover:scale-105"
                            unoptimized
                        />
                    </div>

                    <div className="flex flex-col">
                        <header className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                    {product.category}
                                </span>
                                {product.is_active && (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                                        Available
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight leading-tight mb-4 uppercase">
                                {product.name}
                            </h1>
                            <div className="w-16 h-1.5 bg-[#DAA520]" />
                        </header>

                        {/* SPECIFICATIONS */}
                        {specs.length > 0 && (
                            <div className="mb-10 bg-zinc-50 rounded-xl p-6 border border-zinc-100">
                                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <i className='bx bx-list-ul text-lg'></i> รายละเอียดสินค้า
                                </h3>
                                <div className="space-y-3">
                                    {specs.map((spec, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-zinc-200/60 last:border-0">
                                            <span className="text-sm font-semibold text-zinc-500">{spec.label}</span>
                                            <span className="text-sm font-bold text-zinc-900 text-right mt-1 sm:mt-0">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-10">
                            <h3 className="text-xl font-black text-zinc-400 uppercase tracking-widest mb-4">
                                รายละเอียดเพิ่มเติม (Description)
                            </h3>
                            <div className="text-zinc-600 text-[15px] leading-relaxed font-medium text-base">
                                {product.description || "รายละเอียดเพิ่มเติม กรุณาติดต่อฝ่ายขาย"}
                            </div>
                        </div>

                        <div className="pt-6 border-t text-[20px] border-zinc-100 space-y-3">
                            {product.subcategory && <MetaInfo label="Subcategory" value={product.subcategory} />}
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <a
                                href={product.cta_url || "https://lin.ee/twVZIGO"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-[#DAA520] hover:bg-[#b88a1b] text-white py-4 px-8 font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-[#DAA520]/20 hover:-translate-y-1"
                            >
                                <i className="bx bxl-line text-2xl" /> สั่งซื้อ / สอบถาม
                            </a>
                            <button
                                onClick={() => router.back()}
                                className="flex-none px-8 py-4 border border-zinc-200 text-zinc-500 font-bold text-sm uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-all"
                            >
                                ย้อนกลับ
                            </button>
                        </div>
                    </div>
                </div>
                {relatedProducts.length > 0 && (
                    <section className="pt-10 border-t border-zinc-100 mt-20">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <span className="text-[10px] font-black text-[#DAA520] tracking-[0.4em] uppercase mb-2 block">Related Items</span>
                                <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">สินค้าที่เกี่ยวข้อง</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <div key={p.id} className="group relative w-full transform transition-transform duration-300 hover:z-10">
                                    <div className="relative flex flex-col bg-white transition-all duration-500 group-hover:-translate-y-2 border border-zinc-200  group-hover:shadow-[0_20px_40px_-12px_rgba(255,213,5,0.2)] overflow-hidden">
                                        <div onClick={() => { router.push(`/products/${p.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block relative h-75 overflow-hidden bg-zinc-50/80 items-center justify-center p-8 cursor-pointer">
                                            <div className="absolute w-40 h-40 bg-[#DAA520] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 will-change-opacity" />
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="block bg-[#DAA520] px-3 py-1 text-[10px] font-black tracking-widest uppercase text-zinc-900 shadow-sm">
                                                    {p.category || "SELECT"}
                                                </span>
                                            </div>
                                            <Image
                                                src={getImageUrl(p.image_url)}
                                                alt={p.name}
                                                fill
                                                className="relative z-10 object-contain p-6 transition-transform duration-500 ease-out  will-change-transform"
                                                unoptimized={true}
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col relative bg-white border-t border-zinc-100">
                                            <div onClick={() => { router.push(`/products/${p.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="cursor-pointer">
                                                <h3 className="text-lg font-black text-zinc-900 mb-3 leading-tight group-hover:text-[#b49503] transition-colors line-clamp-2 uppercase h-[2.8em]">
                                                    {p.name}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2 mb-8 font-medium h-[3em]">
                                                {p.description || "Specifications available upon request."}
                                            </p>
                                            <div className="mt-auto">
                                                <div
                                                    onClick={() => { router.push(`/products/${p.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    className="group/btn relative overflow-hidden flex items-center justify-between w-full pl-4 pr-2 py-3 bg-white border border-zinc-200 text-zinc-900 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-zinc-900 hover:border-zinc-900 hover:text-white cursor-pointer"
                                                >
                                                    <span className="relative z-10">ดูรายละเอียด</span>
                                                    <span className="flex items-center justify-center w-8 h-8 bg-zinc-100 group-hover/btn:bg-zinc-800 rounded transition-colors">
                                                        <i className="bx bxs-right-arrow-alt text-lg text-zinc-400 group-hover/btn:text-[#DAA520]"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <FooterContact />
        </div>
    );
}

function MetaInfo({ label, value }) {
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-zinc-400 uppercase tracking-wider min-w-24">{label}:</span>
            <span className="font-semibold text-zinc-700 uppercase">{value}</span>
        </div>
    );
}