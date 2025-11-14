"use client";
import React, { useEffect, useRef, useState } from "react";

export default function NewsSlider() {
    const trackRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const news = [
        { id: 1, title: "ร่วมสนับสนุนการแข่งขันกีฬา", desc: "Smart Installation", date: "12 พ.ย. 2025", image: "/images/05.jpg" },
        { id: 2, title: "กิจกรรมประกวดราคาอิเล็กทรอนิกส์", desc: "จัดส่งทั่วประเทศ", date: "6 มิ.ย. 2567", image: "/images/3.jpg" },
        { id: 3, title: "บันทึกข้อตกลงความร่วมมือ", desc: "ลดสูงสุด 30%", date: "14 พ.ย. 2568", image: "/images/04.jpg" },
        { id: 4, title: "สนับสนุนทีมปิงปองหงส์ขาว", desc: "Smart Installation", date: "6 มี.ค. 2568", image: "/images/Screenshot 2025-06-03 101538.png" }
    ];

    const loopNews = [...news, ...news, ...news];

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let pos = 0;
        let speed = 0.3;
        let frame;

        const animate = () => {
            if (!isPaused) {
                pos -= speed;
                track.style.transform = `translateX(${pos}px)`;

                const resetPoint = -(track.scrollWidth / 3);
                if (pos <= resetPoint) pos = 0;
            }
            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [isPaused]);

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    ข่าวสารบริษัท
                </h2>

                {/* TRACK (click = pause) */}
                <div
                    onClick={() => setIsPaused(!isPaused)}
                    className="cursor-pointer select-none overflow-hidden w-full"
                >
                    <div
                        ref={trackRef}
                        className="flex gap-5"
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {loopNews.map((n, i) => (
                            <div
                                key={i}
                                className="
                                    bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden
                                    inline-block
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
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-1">{n.title}</h3>
                                    <p className="text-gray-600 mt-2 text-sm md:text-base">{n.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center text-gray-500 mt-3 text-sm">
                    (คลิกที่สไลด์เพื่อ {isPaused ? "เล่นต่อ" : "หยุด"})
                </p>
            </div>
        </section>
    );
}
