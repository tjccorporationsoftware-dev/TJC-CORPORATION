"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FloatingPotato() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let x = 100;
        let y = 100;
        let vx = 10.6; // ความเร็วแกน X
        let vy = 10.2; // ความเร็วแกน Y

        const size = 120; // ขนาดโลโก้ (px)
        let rafId;

        const animate = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            x += vx;
            y += vy;

            // เด้งเมื่อชนขอบจอ
            if (x <= 0 || x + size >= w) vx *= -1;
            if (y <= 0 || y + size >= h) vy *= -1;

            el.style.transform = `translate(${x}px, ${y}px)`;

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div
            ref={ref}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 520,
                height: 520,
                zIndex: 9999,
                pointerEvents: "none", // ไม่บังปุ่ม/ลิงก์บนเว็บ
            }}
        >
            <video

                autoPlay
                muted
                loop
                disablePictureInPicture
                preload="metadata"
                style={{ width: "100%", maxWidth: 720, borderRadius: 12 }}
            >
                <source src="/video/vo002.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
