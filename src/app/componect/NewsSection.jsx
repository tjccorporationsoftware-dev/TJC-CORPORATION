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

    // -------------------------------------------------------
    // CSS Animation + Stagger
    // -------------------------------------------------------
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            .slide-hidden {
                opacity: 0;
                transform: translateY(40px);
            }
            .slide-show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // -------------------------------------------------------
    // IntersectionObserver + Stagger Animation
    // -------------------------------------------------------
    useEffect(() => {
        const cards = document.querySelectorAll(".slide-card");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Array.from(cards).indexOf(entry.target);

                        entry.target.style.transition = `
                            opacity 0.8s ease-out ${index * 0.12}s,
                            transform 0.8s ease-out ${index * 0.12}s
                        `;

                        entry.target.classList.add("slide-show");
                        entry.target.classList.remove("slide-hidden");

                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        cards.forEach((card) => {
            card.classList.add("slide-hidden");
            observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    // -------------------------------------------------------
    // Resize Card Width
    // -------------------------------------------------------
    const updateCardWidth = () => {
        const track = trackRef.current;
        if (!track) return;
        const firstCard = track.querySelector(".slide-card");
        if (firstCard) {
            const gap = 20;
            setCardWidth(firstCard.clientWidth + gap);
        }
    };

    useEffect(() => {
        updateCardWidth();
        window.addEventListener("resize", updateCardWidth);
        return () => window.removeEventListener("resize", updateCardWidth);
    }, []);

    // -------------------------------------------------------
    // Auto Slide
    // -------------------------------------------------------
    useEffect(() => {
        if (dragging || cardWidth === 0) return;

        const interval = setInterval(() => {
            let newPos = translateX - cardWidth;
            const track = trackRef.current;

            const limit = -(track.scrollWidth / 3);
            if (newPos <= limit) newPos = 0;

            setTranslateX(newPos);
        }, 2500);

        return () => clearInterval(interval);
    }, [translateX, dragging, cardWidth]);

    // -------------------------------------------------------
    // Apply Transform
    // -------------------------------------------------------
    useEffect(() => {
        const track = trackRef.current;
        if (track) {
            track.style.transform = `translateX(${translateX}px)`;
        }
    }, [translateX]);

    // -------------------------------------------------------
    // Dragging
    // -------------------------------------------------------
    const handleStart = (clientX) => {
        setDragging(true);
        setStartX(clientX);
    };

    const handleMove = (clientX) => {
        if (!dragging) return;
        const delta = clientX - startX;
        const track = trackRef.current;
        track.style.transform = `translateX(${translateX + delta}px)`;
    };

    const handleEnd = (clientX) => {
        if (!dragging) return;

        const delta = clientX - startX;
        const newPos = translateX + delta;

        const snap = Math.round(newPos / cardWidth) * cardWidth;

        setTranslateX(snap);
        setDragging(false);
    };

    // -------------------------------------------------------
    // Event Handler
    // -------------------------------------------------------
    const onPointerDown = (e) => handleStart(e.clientX || e.touches?.[0]?.clientX);
    const onPointerMove = (e) => {
        if (dragging) e.preventDefault();
        handleMove(e.clientX || e.touches?.[0]?.clientX);
    };
    const onPointerUp = (e) => handleEnd(e.clientX || e.changedTouches?.[0]?.clientX);


    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
                <div className="justify-items-center ">
                    <h2 className="text-2xl md:text-3xl text-center font-extrabold bg-gradient-to-r from-yellow-500 to-gray-700 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-10">
                        ข่าวสารบริษัท
                    </h2>
                </div>

                <div className="select-none overflow-hidden w-full">
                    <div
                        ref={trackRef}
                        className="flex gap-5 transition-transform duration-500"
                        onMouseDown={onPointerDown}
                        onMouseMove={onPointerMove}
                        onMouseUp={onPointerUp}
                        onMouseLeave={onPointerUp}
                        onTouchStart={onPointerDown}
                        onTouchMove={onPointerMove}
                        onTouchEnd={onPointerUp}
                        onTouchCancel={onPointerUp}
                    >
                        {loopNews.map((n, i) => (
                            <div
                                key={i}
                                className="
                                    slide-card slide-hidden
                                    bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden
                                    inline-block
                                    min-w-[90%] max-w-[90%]
                                    sm:min-w-[60%] sm:max-w-[60%]
                                    md:min-w-[45%] md:max-w-[45%]
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
