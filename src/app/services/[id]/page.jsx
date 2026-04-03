"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import Navbar from "../../componect/Navbar";
import Footer from "../../componect/Footer";
import ScrollToTop from "../../componect/ScrollToTop";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const resolveUrl = (u) => {
    if (!u) return "/images/placeholder.png";
    if (u.startsWith("http")) return u;
    if (u.startsWith("/images/")) return u;
    const cleanPath = u.startsWith("/") ? u : `/${u}`;
    return `${API_BASE}${cleanPath}`;
};

export default function ServiceDetailPage() {
    const { id } = useParams(); // รับ ID จาก URL
    const router = useRouter();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState("");

    // ดึงข้อมูลบริการจาก Backend ตาม ID
    useEffect(() => {
        if (!id) return;
        async function fetchService() {
            try {
                const res = await fetch(`${API_BASE}/api/services/${id}`);
                if (!res.ok) throw new Error("Service not found");
                const data = await res.json();
                setService(data);

                // จัดการรูประบบ Multi-upload (แยกด้วยลูกน้ำ)
                if (data.image_url) {
                    const imgArray = data.image_url.split(",").filter(Boolean);
                    setImages(imgArray);
                    setMainImage(imgArray[0]); // ให้รูปแรกเป็นรูปหลัก
                }
            } catch (err) {
                console.error(err);
                setService(null);
            } finally {
                setLoading(false);
            }
        }
        fetchService();
    }, [id]);

    // JS Animation: เฟดขึ้นมาตอนโหลดเสร็จ
    useEffect(() => {
        if (loading || !service) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-up");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        const elements = document.querySelectorAll(".scroll-element");
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [loading, service]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium tracking-wide">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 p-6 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-300">
                    <i className="bx bx-file-blank text-4xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">ไม่พบข้อมูลบริการนี้</h1>
                <p className="text-slate-500">บริการที่คุณกำลังค้นหาอาจถูกลบ หรือไม่มีอยู่จริง</p>
                <button onClick={() => router.back()} className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium">
                    <ArrowLeft size={18} /> กลับหน้าหลัก
                </button>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <ScrollToTop />
            <div className="min-h-screen bg-white font-sans pb-24 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* --- ฝั่งซ้าย: รูปภาพ (Gallery) --- */}
                        <div className="lg:col-span-7 opacity-0 scroll-element">
                            {/* รูปภาพหลัก */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden aspect-video sm:aspect-[4/3] relative flex items-center justify-center p-4">
                                {mainImage ? (
                                    <img
                                        src={resolveUrl(mainImage)}
                                        alt={service.title}
                                        className="w-full h-full object-contain drop-shadow-xl animate-in fade-in zoom-in-95 duration-500"
                                        key={mainImage} // บังคับให้ React re-render เวลากดเปลี่ยนรูป
                                    />
                                ) : (
                                    <div className="text-slate-300 flex flex-col items-center gap-3">
                                        <i className="bx bx-image text-5xl"></i>
                                        <span>ไม่มีรูปภาพประกอบ</span>
                                    </div>
                                )}
                            </div>

                            {/* แถบรูปภาพย่อย (Thumbnails) ถ้ามีมากกว่า 1 รูป */}
                            {images.length > 1 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-slate-50
                                              ${mainImage === img ? 'border-[#DAA520] shadow-md scale-105' : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'}
                                            `}
                                        >
                                            <img src={resolveUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- ฝั่งขวา: เนื้อหาและรายละเอียด --- */}
                        <div className="lg:col-span-5 flex flex-col opacity-0 scroll-element" style={{ animationDelay: "0.2s" }}>

                            {/* หมวดหมู่ */}
                            {service.category && (
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
                                        <Tag size={12} /> {service.category}
                                    </span>
                                </div>
                            )}

                            {/* ชื่อบริการ */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                                {service.title}
                            </h1>

                            {/* เส้นคั่นสีทอง */}
                            <div className="w-16 h-1.5 bg-[#DAA520] mb-8 rounded-full"></div>

                            {/* รายละเอียด */}
                            <div className="text-slate-600 text-lg leading-relaxed mb-10 whitespace-pre-wrap">
                                {service.description ? service.description : "ไม่มีรายละเอียดเพิ่มเติมสำหรับบริการนี้"}
                            </div>

                            {/* ✅ กล่องติดต่อ (Call to action) แบบใหม่ */}
                            <div className="mt-auto">
                                <p className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">สนใจบริการนี้?</p>
                                <div className="flex flex-col sm:flex-row gap-4">

                                    <a
                                        href="https://lin.ee/kfKx9AW8"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-[#06C755] hover:bg-[#05b34c] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#06C755]/20"
                                    >
                                        <i className="bx bxl-line text-2xl"></i> สอบถามข้อมูลเพิ่มเติม
                                    </a>
                                    <button
                                        onClick={() => router.push('/services')}
                                        className="flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                                    >
                                        <ArrowLeft size={18} /> ย้อนกลับ
                                    </button>

                                    {/* ปุ่มสอบถามผ่าน LINE */}


                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

                    .animate-fade-up {
                      animation: fadeUpDetail 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    @keyframes fadeUpDetail {
                      0% { opacity: 0; transform: translateY(40px); }
                      100% { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
            <Footer />
        </div>
    );
}