"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function CustomersCarousel({
    logos = [
        "/images/customers/c01-removebg-preview.png",
        "/images/customers/c02-removebg-preview.png",
        "/images/customers/c03-removebg-preview.png",
        "/images/customers/c04-removebg-preview.png",
        "/images/customers/c05-removebg-preview.png",
        "/images/customers/c06-removebg-preview.png",
        "/images/customers/c07-removebg-preview.png",
        "/images/customers/c08-removebg-preview.png",
        "/images/customers/c09-removebg-preview.png",
        "/images/customers/c010-removebg-preview.png",
        "/images/customers/c11-removebg-preview.png",
        "/images/customers/c12.png",
    ],
    duration = 50,
}) {
    const controls = useAnimation();
    const trackRef = useRef(null);

    const loopLogos = [...logos, ...logos]; // duplicated

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalWidth = track.scrollWidth;       // ความกว้างจริง
        const halfWidth = totalWidth / 2;           // สไลด์ครึ่งหนึ่งพอดี

        controls.start({
            x: [0, -halfWidth],
            transition: {
                duration,
                ease: "linear",
                repeat: Infinity,
            },
        });
    }, []);

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">

                <h3 className="text-3xl sm:text-4xl font-bold mb-10">
                    ลูกค้าที่ไว้วางใจเรา
                </h3>

                <div className="relative overflow-hidden">

                    <motion.div
                        ref={trackRef}
                        className="flex items-center gap-6 sm:gap-10"
                        animate={controls}
                    >
                        {loopLogos.map((src, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-center bg-white rounded-xl shadow p-4 shrink-0"
                                style={{
                                    width: 150,     // ❗ ใช้ px เพื่อให้รวมกว้างแน่นอน
                                    height: 80,
                                }}
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Fade overlays */}
                    <div className="pointer-events-none absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent" />
                </div>
            </div>
        </section>
    );
}
