"use client";

import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // แสดงปุ่มเมื่อเลื่อนลงมาเกิน 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`fixed bottom-8 right-52 z-999 flex h-14 w-14 items-center justify-center bg-zinc-900 border border-[#DAA520]/30 shadow-2xl transition-all duration-500 group
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"}
        hover:bg-[#DAA520] hover:border-white`}
        >
            <div className="flex flex-col items-center">
                {/* ไอคอนจาก Boxicons */}
                <i className="bx bx-chevron-up text-3xl text-[#DAA520] group-hover:text-white transition-colors leading-none" />
                <span className="text-[8px] font-black text-white group-hover:text-zinc-900 uppercase tracking-tighter -mt-1">
                    TOP
                </span>
            </div>
        </button>
    );
};

export default ScrollToTop;