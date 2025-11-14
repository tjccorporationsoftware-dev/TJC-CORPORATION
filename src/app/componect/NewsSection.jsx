"use client";
import React, { useRef, useEffect, useState } from "react";

export default function NewsSlider() {
    const containerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

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
            title: "บันทึกข้อตกลงความร่วมมือ",
            desc: "ลดสูงสุด 30% สำหรับลูกค้าองค์กร",
            date: "14 พ.ย. 2568",
            image: "/images/04.jpg",
        },
        {
            id: 4,
            title: "สนับสนุนทีมปิงปองหงส์ขาว",
            desc: "บริการติดตั้งแบบ Smart Installation",
            date: "6 มี.ค. 2568",
            image: "/images/Screenshot 2025-06-03 101538.png",
        }
    ];

    // duplicate x3 → ให้เลื่อนแบบ infinite จริง
    const loopNews = [...news, ...news, ...news];

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let speed = 0.6;
        let frame;

        const smooth = () => {
            if (!isPaused) {
                el.scrollLeft += speed;
                const maxScroll = el.scrollWidth / 3;

                if (el.scrollLeft >= maxScroll) {
                    el.scrollLeft = 0;
                }
            }
            frame = requestAnimationFrame(smooth);
        };

        frame = requestAnimationFrame(smooth);

        return () => cancelAnimationFrame(frame);
    }, [isPaused]);

    // คลิกเพื่อหยุด/เล่นต่อ
    const togglePause = () => {
        setIsPaused((prev) => !prev);
    };

    return (
        <section className="w-full py-16 bg-white">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { scrollbar-width: none; }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    ข่าวสารบริษัท
                </h2>

                <div
                    ref={containerRef}
                    onClick={togglePause}
                    className="
                        flex gap-5 overflow-x-auto no-scrollbar pb-3
                        cursor-pointer select-none
                    "
                >
                    {loopNews.map((n, i) => (
                        <div
                            key={i}
                            className="
                                news-card
                                bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden
                                transition-all duration-300

                                min-w-[85%] max-w-[85%]
                                sm:min-w-[50%] sm:max-w-[50%]
                                md:min-w-[40%] md:max-w-[40%]
                                lg:min-w-[30%] lg:max-w-[30%]
                                xl:min-w-[25%] xl:max-w-[25%]
                            "
                        >
                            <img
                                src={n.image}
                                className="w-full h-48 sm:h-56 md:h-60 object-cover"
                                alt={n.title}
                            />
                            <div className="p-5">
                                <p className="text-sm text-yellow-700 font-medium">{n.date}</p>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                                    {n.title}
                                </h3>
                                <p className="text-gray-600 mt-2 text-sm md:text-base">
                                    {n.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-gray-500 mt-3 text-sm">
                    (คลิกที่สไลด์เพื่อ {isPaused ? "เล่นต่อ" : "หยุด"} )
                </p>
            </div>
        </section>
    );
}
