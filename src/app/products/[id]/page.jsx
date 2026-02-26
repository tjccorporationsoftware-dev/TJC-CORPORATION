"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../componect/Navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ✅ Helper สำหรับเปรียบเทียบข้อความให้แม่นยำขึ้น
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

    // ✅ กรองสินค้าหมวดเดียวกันให้ชัดเจน (Related Products)
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32 items-start mb-4">
                    <div className="relative aspect-square bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shadow-inner max-w-xl  ">
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
                            <h1 className="text-4xl lg:text-4xl font-black text-zinc-900 tracking-tighter leading-tight mb-4 uppercase">
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
                {relatedProducts.length > 0 && (
                    <section className="pt-24 border-t border-zinc-50">
                        <div className="flex items-end justify-between mb-16 px-2">
                            <div>
                                <span className="text-[10px] font-black text-[#DAA520] tracking-[0.4em] uppercase mb-3 block opacity-80">Portfolio Selection</span>
                                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">สินค้าในหมวดหมู่เดียวกัน</h2>
                            </div>
                            <div className="h-px flex-1 bg-zinc-50 mx-10 hidden md:block"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {relatedProducts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        router.push(`/products/${p.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-square bg-zinc-50 border border-zinc-100 mb-6 overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#DAA520]/20">
                                        <Image
                                            src={getImageUrl(p.image_url)}
                                            alt={p.name}
                                            fill
                                            className="object-contain p-10 transition-transform duration-1000 group-hover:scale-110"
                                            unoptimized
                                        />
                                    </div>
                                    <h4 className="text-[14px] font-black text-zinc-900 uppercase tracking-tight line-clamp-1 group-hover:text-[#DAA520] transition-colors">
                                        {p.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-4 h-0.5 bg-zinc-100 group-hover:bg-[#DAA520] transition-colors" />
                                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                                            {p.subcategory || "Official Edition"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
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