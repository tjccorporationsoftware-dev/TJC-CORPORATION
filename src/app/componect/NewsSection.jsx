"use client";
import React, { useRef, useEffect } from "react";

export default function NewsSlider() {
    const containerRef = useRef(null);

    const news = [
        {
            id: 1,
            title: "เปิดตัวบริการใหม่ปี 2025",
            desc: "ระบบจัดส่งอัจฉริยะและบริการติดตั้งแบบ Smart Installation",
            date: "12 พ.ย. 2025",
            image: "/images/news1.jpg",
        },
        {
            id: 2,
            title: "ขยายคลังสินค้าเพิ่ม",
            desc: "รองรับการจัดส่งรวดเร็วทั่วประเทศมากขึ้น",
            date: "3 พ.ย. 2025",
            image: "/images/news2.jpg",
        },
        {
            id: 3,
            title: "โปรโมชั่นพิเศษปลายปี",
            desc: "ลดสูงสุด 30% สำหรับลูกค้าองค์กร",
            date: "27 ต.ค. 2025",
            image: "/images/news3.jpg",
        },
        {
            id: 4,
            title: "เปิดตัวบริการใหม่ปี 2025",
            desc: "ระบบจัดส่งอัจฉริยะและบริการติดตั้งแบบ Smart Installation",
            date: "12 พ.ย. 2025",
            image: "/images/news1.jpg",
        },
        {
            id: 5,
            title: "ขยายคลังสินค้าเพิ่ม",
            desc: "รองรับการจัดส่งรวดเร็วทั่วประเทศมากขึ้น",
            date: "3 พ.ย. 2025",
            image: "/images/news2.jpg",
        },
        {
            id: 6,
            title: "โปรโมชั่นพิเศษปลายปี",
            desc: "ลดสูงสุด 30% สำหรับลูกค้าองค์กร",
            date: "27 ต.ค. 2025",
            image: "/images/news3.jpg",
        }
    ];

    const scroll = (direction) => {
        if (!containerRef.current) return;
        const amount = 350;
        containerRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            const el = containerRef.current;
            if (!el) return;

            const maxScroll = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft + 350 >= maxScroll) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                el.scrollBy({ left: 350, behavior: "smooth" });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full py-16 bg-white">
            <style>{`
                /* ซ่อน Scrollbar แบบแท้จริง */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    scrollbar-width: none;
                }
            `}</style>

            <div className="max-w-6xl mx-auto px-6 relative">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    ข่าวสารบริษัท
                </h2>

                {/* ปุ่มซ้าย */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 
                    bg-linear-to-br from-gray-200 to-gray-100 
                    text-yellow-700 border border-yellow-500 
                    shadow-md p-3 rounded-full z-20 hover:bg-yellow-50"
                >
                    {"<"}
                </button>

                {/* ปุ่มขวา */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 
                    bg-linear-to-br from-gray-200 to-gray-100 
                    text-yellow-700 border border-yellow-500 
                    shadow-md p-3 rounded-full z-20 hover:bg-yellow-50"
                >
                    {">"}
                </button>

                {/* slider */}
                <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {news.map((n) => (
                        <div
                            key={n.id}
                            className="min-w-[300px] bg-white border border-gray-200 
                            rounded-2xl shadow-md overflow-hidden"
                        >
                            <img
                                src={n.image}
                                className="w-full h-40 object-cover"
                                alt={n.title}
                            />

                            <div className="p-5">
                                <p className="text-sm text-yellow-700 font-medium">
                                    {n.date}
                                </p>

                                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                    {n.title}
                                </h3>

                                <p className="text-gray-600 mt-2 leading-relaxed">
                                    {n.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
