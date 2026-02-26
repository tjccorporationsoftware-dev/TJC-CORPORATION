"use client";
import React, { useEffect, useRef, useState } from "react";

// --- ส่วนของ Logic (คงเดิม 100%) ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function resolveUrl(u) {
    if (!u) return "";
    if (u.startsWith("/uploads/") || u.startsWith("uploads/")) {
        const cleanPath = u.startsWith("/") ? u : `/${u}`;
        return `${API_BASE}${cleanPath}`;
    }
    return u;
}

export default function NewsSlider() {
    const trackRef = useRef(null);

    // slider states
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    // highlight auto image
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // modal
    const [selectedNews, setSelectedNews] = useState(null);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    // ✅ data from API
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load news from API
    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/news`, { cache: "no-store" });
                const rows = await res.json();
                const mapped = (Array.isArray(rows) ? rows : [])
                    .filter((r) => r && (r.is_active === true || r.is_active === 1 || r.is_active === "true" || r.is_active === null))
                    .sort((a, b) => {
                        const so = Number(b.sort_order || 0) - Number(a.sort_order || 0);
                        if (so !== 0) return so;
                        return Number(b.id || 0) - Number(a.id || 0);
                    })
                    .map((r) => ({
                        id: r.id,
                        title: r.title || "",
                        desc: r.desc1 || "",
                        desc2: r.desc2 || "",
                        date: r.date_label || "",
                        image: r.cover_image_url || "",
                        gallery: Array.isArray(r.gallery)
                            ? r.gallery
                            : (typeof r.gallery === "string" ? safeParseJson(r.gallery, []) : []),
                    }));
                if (!alive) return;
                setNews(mapped);
            } catch (e) {
                console.error(e);
                if (!alive) return;
                setNews([]);
            } finally {
                if (alive) setLoading(false);
            }
        }
        load();
        return () => { alive = false; };
    }, []);

    function safeParseJson(s, fallback) {
        try { return JSON.parse(s); } catch { return fallback; }
    }

    // choose latest
    const latestNews = news[0] || null;
    const loopNews = news;

    // Highlight image auto-change
    useEffect(() => {
        if (!latestNews) return;
        setActiveImageIndex(0);
        if (latestNews.gallery && latestNews.gallery.length > 1) {
            const timer = setInterval(() => {
                setActiveImageIndex((prev) => (prev + 1) % latestNews.gallery.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [latestNews?.id]);

    // Resize card width
    const updateCardWidth = () => {
        const track = trackRef.current;
        if (!track) return;
        const firstCard = track.querySelector(".slide-card");
        if (firstCard) setCardWidth(firstCard.clientWidth + 20);
    };

    useEffect(() => {
        updateCardWidth();
        window.addEventListener("resize", updateCardWidth);
        return () => window.removeEventListener("resize", updateCardWidth);
    }, [news.length]);

    // Auto slide
    useEffect(() => {
        if (dragging || cardWidth === 0 || selectedNews) return;
        if (!loopNews.length) return;
        const interval = setInterval(() => {
            const track = trackRef.current;
            if (!track) return;
            const containerWidth = track.parentElement.clientWidth;
            const contentWidth = track.scrollWidth;
            let maxTranslate = -(contentWidth - containerWidth);
            if (maxTranslate > 0) maxTranslate = 0;
            setTranslateX((prev) => {
                if (prev <= maxTranslate) return 0;
                const nextPos = prev - cardWidth;
                return nextPos < maxTranslate ? maxTranslate : nextPos;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [translateX, dragging, cardWidth, selectedNews, loopNews.length]);

    useEffect(() => {
        const track = trackRef.current;
        if (track) track.style.transform = `translateX(${translateX}px)`;
    }, [translateX]);

    // Drag logic
    const handleStart = (clientX) => { setDragging(true); setStartX(clientX); };
    const handleMove = (clientX) => {
        if (!dragging) return;
        const track = trackRef.current;
        if (track) {
            track.style.transition = "none";
            track.style.transform = `translateX(${translateX + (clientX - startX)}px)`;
        }
    };
    const handleEnd = (clientX) => {
        if (!dragging) return;
        const track = trackRef.current;
        if (track) track.style.transition = "transform 0.5s ease-out";
        const moveDist = clientX - startX;
        if (Math.abs(moveDist) < 5) { setDragging(false); return; }
        let newPos = translateX + moveDist;
        newPos = Math.round(newPos / cardWidth) * cardWidth;
        const containerWidth = track.parentElement.clientWidth;
        const contentWidth = track.scrollWidth;
        let maxTranslate = -(contentWidth - containerWidth);
        if (maxTranslate > 0) maxTranslate = 0;
        if (newPos > 0) newPos = 0;
        if (newPos < maxTranslate) newPos = maxTranslate;
        setTranslateX(newPos);
        setDragging(false);
    };

    const onPointerDown = (e) => handleStart(e.clientX || e.touches?.[0]?.clientX);
    const onPointerMove = (e) => { if (dragging) e.preventDefault(); handleMove(e.clientX || e.touches?.[0]?.clientX); };
    const onPointerUp = (e) => handleEnd(e.clientX || e.changedTouches?.[0]?.clientX);

    // Modal
    const openModal = (newsItem) => { setModalImageIndex(0); setSelectedNews(newsItem); };
    const closeModal = () => setSelectedNews(null);
    // --- จบส่วน Logic ---


    // ------------------------------
    // UI - Center Balanced & Background
    // ------------------------------
    return (
        <section className="relative w-full py-24 lg:py-32 bg-white overflow-hidden border-t border-zinc-100" id="news">

            {/* 1. Background Decor: Watermark & Shapes */}
            {/* Watermark Text - จางๆ ด้านหลัง */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden">
                <span className="text-[12rem] md:text-[20rem] font-black text-zinc-50 opacity-60 leading-none whitespace-nowrap tracking-tighter">
                    NEWSROOM
                </span>
            </div>

            {/* Side Shapes - เพื่อมิติ */}
            <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-linear-to-b from-zinc-50 to-white -skew-x-12 transform origin-top-right pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#DAA520]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* 2. Header Section: Center Alignment (สมดุล) */}
                <div className="text-center max-w-4xl mx-auto mb-24">

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-zinc-400 font-bold tracking-[0.3em] uppercase text-xs">
                            Update Stories
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 bg-linear-to-r from-zinc-900 to-[#DAA520] bg-clip-text text-transparent">
                        ข่าวสาร<span className="text-[#DAA520] mx-2">/</span>กิจกรรม
                    </h2>

                    <p className="text-zinc-500 text-lg leading-relaxed font-medium max-w-2xl mx-auto">
                        ติดตามความเคลื่อนไหว กิจกรรมเพื่อสังคม และโปรโมชั่นล่าสุด<br className="hidden md:block" />
                        เพื่อไม่พลาดทุกโอกาสสำคัญจากเรา
                    </p>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center text-zinc-400 animate-pulse font-medium">Loading news...</div>
                ) : !latestNews ? (
                    <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/50 backdrop-blur text-zinc-400 font-medium">
                        ยังไม่มีข่าวประชาสัมพันธ์
                    </div>
                ) : (
                    <>
                        <div className="mb-20 group cursor-pointer" onClick={() => openModal(latestNews)}>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col md:flex-row items-stretch transition-all duration-500 hover:shadow-lg hover:border-[#DAA520]/30">

                                {/* Image Side (50%) - ปรับความสูงให้ Compact ขึ้น */}
                                <div className="w-full md:w-1/2 relative h-62.5 md:h-100 overflow-hidden bg-zinc-100">
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-500 z-10" />
                                    <img
                                        src={
                                            latestNews.gallery && latestNews.gallery.length > 0
                                                ? resolveUrl(latestNews.gallery[activeImageIndex])
                                                : resolveUrl(latestNews.image)
                                        }
                                        alt={latestNews.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    {/* Gallery Indicators */}
                                    {latestNews.gallery && latestNews.gallery.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                            {latestNews.gallery.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1 rounded-full transition-all duration-300 shadow-sm ${idx === activeImageIndex ? "bg-[#DAA520] w-6" : "bg-white/70 w-2"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Highlight Tag */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-[#DAA520] text-zinc-900 text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-md rounded-sm">
                                            ล่าสุด
                                        </span>
                                    </div>
                                </div>

                                {/* Content Side (50%) - ลด Padding และ Font Size ให้กระชับ */}
                                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <i className='bx bx-calendar text-[#DAA520] text-lg'></i>
                                        <span className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
                                            {latestNews.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-3xl font-black text-zinc-900 mb-4 leading-tight group-hover:text-[#b49503] transition-colors duration-300 line-clamp-2">
                                        {latestNews.title}
                                    </h3>

                                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 font-medium">
                                        {latestNews.desc}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-zinc-100">
                                        <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-900 transition-colors group-hover:gap-3">
                                            อ่านเพิ่มเติม <i className="bx bx-right-arrow-alt text-lg text-[#DAA520]"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slider Section */}
                        <div className="w-full relative pt-10">
                            <div className="flex items-end justify-between mb-8 px-2 border-b border-zinc-100 pb-4">
                                <h4 className="text-xl font-bold text-zinc-900">
                                    ข่าวสารอื่นๆ
                                </h4>

                                {/* Navigation Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTranslateX((prev) => Math.min(0, prev + cardWidth))}
                                        className="w-10 h-10 border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 flex items-center justify-center transition-all bg-white rounded-full"
                                    >
                                        <i className='bx bx-chevron-left text-2xl'></i>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setTranslateX((prev) => {
                                                const track = trackRef.current;
                                                if (!track) return prev;
                                                const maxTrans = -(track.scrollWidth - track.parentElement.clientWidth);
                                                const newPos = prev - cardWidth;
                                                return newPos < maxTrans ? maxTrans : newPos;
                                            })
                                        }
                                        className="w-10 h-10 bg-zinc-900 text-white hover:bg-[#DAA520] hover:text-zinc-900 flex items-center justify-center transition-all rounded-full shadow-md"
                                    >
                                        <i className='bx bx-chevron-right text-2xl'></i>
                                    </button>
                                </div>
                            </div>

                            <div className="select-none overflow-hidden w-full -mx-4 px-4 py-4">
                                <div
                                    ref={trackRef}
                                    className="flex gap-6 transition-transform duration-500 ease-out"
                                    onMouseDown={onPointerDown}
                                    onMouseMove={onPointerMove}
                                    onMouseUp={onPointerUp}
                                    onMouseLeave={onPointerUp}
                                    onTouchStart={onPointerDown}
                                    onTouchMove={onPointerMove}
                                    onTouchEnd={onPointerUp}
                                >
                                    {loopNews.map((n, i) => (
                                        <div
                                            key={n.id ?? i}
                                            onClick={() => !dragging && openModal(n)}
                                            className="slide-card inline-block min-w-[85%] sm:min-w-[50%] md:min-w-[35%] lg:min-w-[28%] group cursor-pointer"
                                        >
                                            <div className="bg-white h-full flex flex-col border border-zinc-100 hover:border-[#DAA520] transition-all duration-300 pb-4 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden">

                                                {/* Image */}
                                                <div className="h-56 overflow-hidden relative bg-zinc-100 border-b border-zinc-50">
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                                                    <img
                                                        src={resolveUrl(n.image)}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        alt={n.title}
                                                    />
                                                    {n.id === latestNews.id && (
                                                        <div className="absolute top-0 right-0 bg-[#DAA520] text-zinc-900 text-[9px] font-black px-2 py-1 uppercase tracking-widest z-20">
                                                            NEW
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex flex-col grow">
                                                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-3 block">
                                                        {n.date}
                                                    </span>

                                                    <h3 className="text-lg font-bold text-zinc-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#b49503] transition-colors">
                                                        {n.title}
                                                    </h3>

                                                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium grow">
                                                        {n.desc}
                                                    </p>

                                                    <div className="mt-auto pt-4 border-t border-zinc-50">
                                                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                                            Read More <i className="bx bx-right-arrow-alt text-base"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {selectedNews && (
                <div
                    className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-zinc-900/90 backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 hover:bg-[#DAA520] text-white hover:text-zinc-900 rounded-full flex items-center justify-center transition-all backdrop-blur-md"
                        >
                            <i className='bx bx-x text-2xl'></i>
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-[60%] bg-zinc-50 flex items-center justify-center relative overflow-hidden min-h-75 border-b md:border-b-0 md:border-r border-zinc-100">
                            {selectedNews.gallery && selectedNews.gallery.length > 0 ? (
                                <>
                                    <img
                                        src={resolveUrl(selectedNews.gallery[modalImageIndex] || selectedNews.image)}
                                        className="w-full h-full object-contain max-h-[90vh]"
                                        alt="gallery"
                                    />
                                    {selectedNews.gallery.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setModalImageIndex((prev) => (prev - 1 + selectedNews.gallery.length) % selectedNews.gallery.length); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-[#DAA520] text-zinc-900 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg"
                                            >
                                                <i className='bx bx-chevron-left text-3xl'></i>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setModalImageIndex((prev) => (prev + 1) % selectedNews.gallery.length); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-[#DAA520] text-zinc-900 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg"
                                            >
                                                <i className='bx bx-chevron-right text-3xl'></i>
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <img
                                    src={resolveUrl(selectedNews.image)}
                                    className="w-full h-full object-contain"
                                    alt={selectedNews.title}
                                />
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-[40%] flex flex-col bg-white h-full max-h-[90vh]">
                            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                                <div className="mb-8 pb-8 border-b border-zinc-100">
                                    <span className="text-[#DAA520] text-sm font-bold uppercase tracking-widest mb-2 block">
                                        {selectedNews.date}
                                    </span>
                                    <h3 className="text-3xl font-black text-zinc-900 leading-tight">
                                        {selectedNews.title}
                                    </h3>
                                </div>

                                <div className="space-y-6 text-zinc-600 text-base leading-relaxed font-medium">
                                    <p className="whitespace-pre-wrap">{selectedNews.desc}</p>
                                    {selectedNews.desc2 && (
                                        <div className="pt-4">
                                            <p className="whitespace-pre-wrap">{selectedNews.desc2}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}