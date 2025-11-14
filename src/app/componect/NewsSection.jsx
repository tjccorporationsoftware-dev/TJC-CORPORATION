"use client";
import React, { useRef, useEffect } from "react";

export default function NewsSlider() {
    const containerRef = useRef(null);

    const news = [
        {
            id: 1,
            title: "ร่วมสนับสนุนการเเข่งขันกีฬา",
            desc: "ระบบจัดส่งอัจฉริยะและบริการติดตั้งแบบ Smart Installation",
            date: "12 พ.ย. 2025",
            image: "/images/05.jpg",
        },
        {
            id: 2,
            title: "กิจกรรมการประกวดราคาอิเล็กทรอนิกส์",
            desc: "รองรับการจัดส่งรวดเร็วทั่วประเทศมากขึ้น",
            date: "6 มิ.ย. 2567",
            image: "/images/3.jpg",
        },
        {
            id: 3,
            title: "บันทึกข้อตกลงความร่วมมือบริษัท ทีเจซี คอรปอเรชั่น จำกัด",
            desc: "ลดสูงสุด 30% สำหรับลูกค้าองค์กร",
            date: "14 พ.ย. 2568",
            image: "/images/04.jpg",
        },
        {
            id: 4,
            title: "สนับสนุนทีมปิงปองหงส์ขาว",
            desc: "ระบบจัดส่งอัจฉริยะและบริการติดตั้งแบบ Smart Installation",
            date: "6 มี.ค. 2568",
            image: "/images/Screenshot 2025-06-03 101538.png",
        },
    ];

    const scroll = (direction) => {
        if (!containerRef.current) return;
        const el = containerRef.current;

        const cardWidth = el.querySelector(".news-card")?.clientWidth || 350;

        el.scrollBy({
            left: direction === "left" ? -cardWidth : cardWidth,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const el = containerRef.current;
            if (!el) return;

            const cardWidth = el.querySelector(".news-card")?.clientWidth || 350;
            const maxScroll = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft + cardWidth >= maxScroll) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                el.scrollBy({ left: cardWidth, behavior: "smooth" });
            }
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full py-16 bg-white">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { scrollbar-width: none; }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    ข่าวสารบริษัท
                </h2>

                {/* LEFT */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute top-1/2 -translate-y-1/2 sm:flex hidden
                               left-0 z-20 bg-white/90 backdrop-blur
                               border border-gray-300 shadow p-3 rounded-full"
                >
                    {"<"}
                </button>

                {/* RIGHT */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute top-1/2 -translate-y-1/2 sm:flex hidden
                               right-0 z-20 bg-white/90 backdrop-blur
                               border border-gray-300 shadow p-3 rounded-full"
                >
                    {">"}
                </button>

                {/* SLIDER */}
                <div
                    ref={containerRef}
                    className="
                        flex gap-4 overflow-x-auto no-scrollbar pb-3
                        snap-x snap-mandatory
                    "
                >
                    {news.map((n) => (
                        <div
                            key={n.id}
                            className="
                                news-card snap-start
                                bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden
                                transition-all duration-300

                                /* --- TRUE RESPONSIVE --- */
                                min-w-[90%] max-w-[90%]        /* Mobile */
                                sm:min-w-[50%] sm:max-w-[50%]  /* Tablet = 2 card */
                                md:min-w-[45%] md:max-w-[45%]
                                lg:min-w-[33%] lg:max-w-[33%]  /* Laptop = 3 card */
                                xl:min-w-[25%] xl:max-w-[25%]  /* 2K/4K = 4 card */
                            "
                        >
                            <img
                                src={n.image}
                                className="w-full h-48 sm:h-52 md:h-56 object-cover"
                                alt={n.title}
                            />

                            <div className="p-5">
                                <p className="text-sm text-yellow-700 font-medium">
                                    {n.date}
                                </p>

                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                                    {n.title}
                                </h3>

                                <p className="text-gray-600 mt-2 leading-relaxed text-sm md:text-base">
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
