"use client";
import React, { useEffect, useRef, useState } from "react";

export default function NewsSlider() {
    const trackRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    const news = [
        { id: 1, title: "ร่วมสนับสนุนแข่งขันกีฬา", desc: "Smart Installation", date: "12 พ.ย. 2025", image: "/images/05.jpg" },
        { id: 2, title: "ประกวดราคาอิเล็กทรอนิกส์", desc: "จัดส่งทั่วประเทศ", date: "6 มิ.ย. 2567", image: "/images/3.jpg" },
        { id: 3, title: "บันทึกข้อตกลงความร่วมมือ", desc: "ลดสูงสุด 30%", date: "14 พ.ย. 2568", image: "/images/04.jpg" },
        { id: 4, title: "สนับสนุนทีมปิงปอง", desc: "Smart Installation", date: "6 มี.ค. 2568", image: "/images/Screenshot 2025-06-03 101538.png" },
    ];

    const loopNews = [...news, ...news, ...news];

    // ------------------------------
    // วัดขนาดการ์ดทุกหน้าจอ (Responsive จริง)
    // ------------------------------
    const updateCardWidth = () => {
        const track = trackRef.current;
        if (!track) return;

        const firstCard = track.querySelector(".slide-card");
        if (firstCard) {
            const style = window.getComputedStyle(firstCard);
            const gap = 20;
            setCardWidth(firstCard.clientWidth + gap);
        }
    };

    useEffect(() => {
        updateCardWidth();
        window.addEventListener("resize", updateCardWidth);
        return () => window.removeEventListener("resize", updateCardWidth);
    }, []);

    // ------------------------------
    // Auto Slide (ทีละใบแบบเป็นจังหวะ)
    // ------------------------------
    useEffect(() => {
        if (dragging || cardWidth === 0) return;

        const track = trackRef.current;
        if (!track) return;

        const interval = setInterval(() => {
            let newPos = translateX - cardWidth;

            const limit = -(track.scrollWidth / 3);
            if (newPos <= limit) newPos = 0;

            setTranslateX(newPos);
        }, 2500);

        return () => clearInterval(interval);
    }, [translateX, dragging, cardWidth]);

    // อัปเดตตำแหน่งแทร็ก
    useEffect(() => {
        const track = trackRef.current;
        if (track) {
            track.style.transform = `translateX(${translateX}px)`;
        }
    }, [translateX]);

    // ------------------------------
    // Drag ลื่น + Snap ทีละใบ
    // ------------------------------
    const handleStart = (e) => {
        setDragging(true);
        setStartX(e.clientX || e.touches?.[0]?.clientX);
    };

    const handleMove = (e) => {
        if (!dragging) return;

        const x = e.clientX || e.touches?.[0]?.clientX;
        const delta = x - startX;

        const track = trackRef.current;
        track.style.transform = `translateX(${translateX + delta}px)`;
    };

    const handleEnd = (e) => {
        if (!dragging) return;

        const x = e.clientX || e.changedTouches?.[0]?.clientX;
        const delta = x - startX;

        const newPos = translateX + delta;

        // Snap ทีละการ์ด: แม่นยำทุกหน้าจอ
        const snap = Math.round(newPos / cardWidth) * cardWidth;

        setTranslateX(snap);
        setDragging(false);
    };

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    ข่าวสารบริษัท
                </h2>

                <div className="select-none overflow-hidden w-full">
                    <div
                        ref={trackRef}
                        className="flex gap-5 transition-transform duration-500"

                        onPointerDown={handleStart}
                        onPointerMove={handleMove}
                        onPointerUp={handleEnd}
                        onPointerCancel={handleEnd}

                        onTouchStart={handleStart}
                        onTouchMove={handleMove}
                        onTouchEnd={handleEnd}
                    >
                        {loopNews.map((n, i) => (
                            <div
                                key={i}
                                className="
                                    slide-card bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden
                                    inline-block
                                    min-w-[90%] max-w-[90%]          /* mobile */
                                    sm:min-w-[60%] sm:max-w-[60%]   /* small tablet */
                                    md:min-w-[45%] md:max-w-[45%]   /* tablet */
                                    lg:min-w-[30%] lg:max-w-[30%]   /* laptop */
                                    xl:min-w-[25%] xl:max-w-[25%]   /* desktop */
                                "
                            >
                                <img
                                    src={n.image}
                                    className="w-full h-48 sm:h-56 md:h-60 object-cover"
                                    alt={n.title}
                                />

                                <div className="p-5">
                                    <p className="text-sm text-yellow-700 font-medium">{n.date}</p>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-1">{n.title}</h3>
                                    {/* <p className="text-gray-600 mt-2 text-sm md:text-base">{n.desc}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
