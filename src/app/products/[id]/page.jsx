"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../componect/Navbar";
import FooterContact from "../../componect/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ✅ Helper สำหรับเปรียบเทียบข้อความ
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

    // ✅ กรองสินค้าหมวดเดียวกัน (Related Products)
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

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#DAA520]/30">
            <Navbar />
            <main className="max-w-400 mx-auto px-6 lg:px-12 pt-32 lg:pt-48 pb-24">

                {/* --- ส่วนรายละเอียดสินค้าหลัก (Main Detail) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32 items-start mb-4">
                    <div className="relative aspect-square bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shadow-inner max-w-xl">
                        <Image
                            src={getImageUrl(product.image_url)}
                            alt={product.name}
                            fill
                            className="object-contain p-12 transition-transform duration-700 hover:scale-110"
                            unoptimized
                        />
                    </div>

                    <div className="flex flex-col">
                        <header className="mb-10">
                            <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter leading-tight mb-4 uppercase">
                                {product.name}
                            </h1>
                            <div className="w-12 h-2 bg-[#DAA520] shadow-[0_0_15px_rgba(218,165,32,0.3)]" />
                        </header>
                        <div className="mb-12 border-l-4 border-zinc-100 pl-8">
                            <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-4">Detailed Description</h3>
                            <div className="text-zinc-500 leading-relaxed font-medium text-lg italic">
                                {product.description || "Inquire for full technical specifications."}
                            </div>
                        </div>
                        <div className="pt-10 border-t border-zinc-50 space-y-4">
                            <MetaInfo label="Classification" value={product.category} color="#DAA520" />
                            {product.subcategory && (
                                <MetaInfo label="Technical Tags" value={product.subcategory} />
                            )}
                        </div>
                        <div className="mt-16 flex flex-col sm:flex-row gap-5">
                            <a
                                href={product.cta_url || "https://lin.ee/twVZIGO"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-2 bg-zinc-900 text-white hover:bg-[#DAA520] hover:text-zinc-900 py-6 px-10 font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl active:scale-95"
                            >
                                <i className="bx bxl-line text-2xl" /> ขอใบเสนอราคา
                            </a>
                            <button
                                onClick={() => router.back()}
                                className="flex-1 border-2 border-zinc-100 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 py-6 px-10 font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-300"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- ส่วน Related Products (ดีไซน์ใหม่) --- */}
                {relatedProducts.length > 0 && (
                    <section className="pt-24 border-t border-zinc-50">
                        <div className="flex items-end justify-between mb-16 px-2">
                            <div>
                                <span className="text-[10px] font-black text-[#DAA520] tracking-[0.4em] uppercase mb-3 block opacity-80">Portfolio Selection</span>
                                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">สินค้าในหมวดหมู่เดียวกัน</h2>
                            </div>
                            <div className="h-px flex-1 bg-zinc-50 mx-10 hidden md:block"></div>
                        </div>

                        {/* Grid สินค้าปรับใหม่ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        router.push(`/products/${p.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="group relative cursor-pointer h-full"
                                >
                                    <div className="relative flex flex-col h-full bg-white transition-all duration-500 group-hover:-translate-y-2 border border-zinc-200 group-hover:border-[#DAA520] group-hover:shadow-[0_20px_40px_-12px_rgba(255,213,5,0.2)] overflow-hidden">

                                        {/* Image Section */}
                                        <div className="relative h-75 overflow-hidden bg-zinc-50/80 flex items-center justify-center p-8">
                                            {/* Gold Blur Circle */}
                                            <div className="absolute w-40 h-40 bg-[#DAA520] rounded-full blur-[70px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                                            {/* Tag */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="block bg-[#DAA520] px-3 py-1 text-[10px] font-black tracking-widest uppercase text-zinc-900 shadow-sm">
                                                    {p.category || "SELECT"}
                                                </span>
                                            </div>

                                            <Image
                                                src={getImageUrl(p.image_url)}
                                                alt={p.name}
                                                fill
                                                className="relative z-10 object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-2"
                                                unoptimized
                                            />
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 flex flex-col grow relative bg-white border-t border-zinc-100">
                                            <h3 className="text-lg font-black text-zinc-900 mb-3 leading-tight group-hover:text-[#b49503] transition-colors line-clamp-1 uppercase">
                                                {p.name}
                                            </h3>
                                            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                                                {p.description || p.subcategory || "High-quality industrial solution."}
                                            </p>

                                            {/* Fake Button Visual */}
                                            <div className="mt-auto">
                                                <div className="group/btn relative overflow-hidden flex items-center justify-between w-full pl-4 pr-2 py-2 bg-zinc-50 border border-zinc-100 text-zinc-600 font-bold text-[10px] uppercase tracking-wider transition-all duration-300 group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:text-white">
                                                    <span className="relative z-10">
                                                        ดูรายละเอียด
                                                    </span>
                                                    <span className="flex items-center justify-center w-6 h-6 bg-white rounded group-hover:bg-zinc-700 transition-colors">
                                                        <i className="bx bxs-right-arrow-alt text-base text-zinc-400 group-hover:text-[#DAA520]"></i>
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

function MetaInfo({ label, value, color }) {
    return (
        <div className="flex items-center gap-3 text-[11px]">
            <span className="font-black text-zinc-300 uppercase tracking-widest min-w-25">{label}:</span>
            <span className="font-black tracking-wide uppercase" style={{ color: color || "#52525b" }}>{value}</span>
        </div>
    );
}