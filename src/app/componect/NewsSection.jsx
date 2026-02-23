"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";

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

    // ------------------------------
    // Load news from API
    // ------------------------------
    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/news`, { cache: "no-store" });
                const rows = await res.json();

                // map DB -> UI shape
                const mapped = (Array.isArray(rows) ? rows : [])
                    .filter((r) => r && (r.is_active === true || r.is_active === 1 || r.is_active === "true" || r.is_active === null))
                    .sort((a, b) => {
                        // sort_order desc then id desc
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
                        image: r.cover_image_url || "",         // cover
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
        return () => {
            alive = false;
        };
    }, []);

    function safeParseJson(s, fallback) {
        try {
            return JSON.parse(s);
        } catch {
            return fallback;
        }
    }

    // choose latest
    const latestNews = news[0] || null;
    const loopNews = news;

    // ------------------------------
    // Highlight image auto-change
    // ------------------------------
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

    // ------------------------------
    // Resize card width
    // ------------------------------
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

    // ------------------------------
    // Auto slide
    // ------------------------------
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
        }, 3000);

        return () => clearInterval(interval);
    }, [translateX, dragging, cardWidth, selectedNews, loopNews.length]);

    useEffect(() => {
        const track = trackRef.current;
        if (track) track.style.transform = `translateX(${translateX}px)`;
    }, [translateX]);

    // ------------------------------
    // Drag
    // ------------------------------
    const handleStart = (clientX) => {
        setDragging(true);
        setStartX(clientX);
    };

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
        if (Math.abs(moveDist) < 5) {
            setDragging(false);
            return;
        }

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
    const onPointerMove = (e) => {
        if (dragging) e.preventDefault();
        handleMove(e.clientX || e.touches?.[0]?.clientX);
    };
    const onPointerUp = (e) => handleEnd(e.clientX || e.changedTouches?.[0]?.clientX);

    // ------------------------------
    // Modal
    // ------------------------------
    const openModal = (newsItem) => {
        setModalImageIndex(0);
        setSelectedNews(newsItem);
    };
    const closeModal = () => setSelectedNews(null);

    // ------------------------------
    // UI
    // ------------------------------
    return (
        <section className="w-full py-16 bg-gray-50" id="news">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2
                    className="
            text-3xl md:text-4xl font-extrabold mb-10 
            border-l-8 border-yellow-500 pl-4 
            bg-linear-to-r from-yellow-500 to-black bg-clip-text text-transparent
          "
                >
                    ข่าวประชาสัมพันธ์
                </h2>

                {loading ? (
                    <div className="py-20 text-center text-gray-500 animate-pulse">กำลังโหลดข่าว...</div>
                ) : !latestNews ? (
                    <div className="py-20 text-center text-gray-500">ยังไม่มีข่าว</div>
                ) : (
                    <>
                        {/* Highlight */}
                        <div className="mb-16">
                            <div
                                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                                onClick={() => openModal(latestNews)}
                            >
                                <div className="grid md:grid-cols-2 h-full">
                                    <div className="relative h-64 md:h-auto overflow-hidden bg-gray-100">
                                        <img
                                            src={
                                                latestNews.gallery && latestNews.gallery.length > 0
                                                    ? resolveUrl(latestNews.gallery[activeImageIndex])
                                                    : resolveUrl(latestNews.image)
                                            }
                                            alt={latestNews.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105"
                                        />

                                        {latestNews.gallery && latestNews.gallery.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                {latestNews.gallery.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? "bg-white w-4" : "bg-white/50"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                            ข่าวใหม่
                                        </div>

                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-opacity">
                                                อ่านเพิ่มเติม
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center space-x-2 text-yellow-600 font-semibold mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{latestNews.date}</span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-yellow-600 transition-colors">
                                            {latestNews.title}
                                        </h3>

                                        <p className="text-gray-600 text-base md:text-lg mb-3 leading-relaxed line-clamp-3">
                                            {latestNews.desc}
                                        </p>

                                        <p className="text-gray-500 text-sm mt-auto flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                                            ดูรายละเอียด{" "}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="w-full mt-12">
                            <h4
                                className="
                  text-xl font-bold mb-6 px-2
                  bg-linear-to-r from-yellow-500 to-black bg-clip-text text-transparent
                "
                            >
                                ข่าวสารทั้งหมด
                            </h4>

                            <div className="relative group">
                                <button
                                    onClick={() => setTranslateX((prev) => Math.min(0, prev + cardWidth))}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 md:-ml-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-110 transition-all duration-200 focus:outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
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
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 md:-mr-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-110 transition-all duration-200 focus:outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <div className="select-none overflow-hidden w-full py-4 px-1">
                                    <div
                                        ref={trackRef}
                                        className="flex gap-5 transition-transform duration-500 ease-out"
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
                                                className="slide-card bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden inline-block min-w-[85%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[30%] group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <div className="h-48 overflow-hidden relative bg-gray-100">
                                                    <img
                                                        src={resolveUrl(n.image)}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        alt={n.title}
                                                    />
                                                    {n.id === latestNews.id && (
                                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                                            NEW
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-5">
                                                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                                        {n.date}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-gray-800 mt-3 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                                                        {n.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm line-clamp-2">{n.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal */}
                        {/* Modal */}
                        {selectedNews && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                                onClick={closeModal}
                            >
                                <div
                                    className="bg-white rounded-3xl w-full max-w-9xl max-h-[92vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-5 right-5 z-30 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full shadow-lg transition-all active:scale-95"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="flex flex-col md:flex-row h-full max-h-[92vh]">
                                        {/* Image Section - สัดส่วนที่สมดุล */}
                                        <div className="md:w-[45%] bg-black flex items-center justify-center relative overflow-hidden min-h-87.5 md:min-h-full">
                                            {selectedNews.gallery && selectedNews.gallery.length > 0 ? (
                                                <>
                                                    <img
                                                        src={resolveUrl(selectedNews.gallery[modalImageIndex] || selectedNews.image)}
                                                        className="w-full h-full object-contain"
                                                        alt="gallery"
                                                    />

                                                    {selectedNews.gallery.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setModalImageIndex((prev) => (prev - 1 + selectedNews.gallery.length) % selectedNews.gallery.length);
                                                                }}
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full transition-colors"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setModalImageIndex((prev) => (prev + 1) % selectedNews.gallery.length);
                                                                }}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full transition-colors"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </button>

                                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
                                                                {selectedNews.gallery.map((_, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`w-2.5 h-2.5 rounded-full shadow-md transition-all ${i === modalImageIndex ? "bg-white w-6" : "bg-white/50"}`}
                                                                    />
                                                                ))}
                                                            </div>
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

                                        {/* Content Section - ปรับให้แสดงข้อมูลได้ยาวและเต็มที่มากขึ้น */}
                                        <div className="md:w-[55%] p-10 md:p-14 flex flex-col bg-white overflow-hidden">
                                            <div className="mb-6">
                                                <span className="inline-block bg-amber-100 text-amber-800 text-[11px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest mb-5">
                                                    {selectedNews.date}
                                                </span>
                                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                                    {selectedNews.title}
                                                </h3>
                                            </div>

                                            {/* ส่วนของเนื้อหาที่เลื่อนอ่านได้ยาวๆ */}
                                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                                <div className="space-y-6 text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                                                    <p className="whitespace-pre-wrap">{selectedNews.desc}</p>
                                                    {selectedNews.desc2 && (
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <p className="whitespace-pre-wrap">{selectedNews.desc2}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <button
                                                    onClick={closeModal}
                                                    className="text-gray-400 hover:text-gray-900 font-bold text-sm uppercase tracking-widest transition-colors"
                                                >
                                                    Back to news
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
