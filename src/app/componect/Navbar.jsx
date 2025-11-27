"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    FaHome,
    FaInfoCircle,
    FaServicestack,
    FaBox,
    FaEnvelope
} from "react-icons/fa";
import { SiLine, SiFacebook, SiInstagram } from "react-icons/si";

export default function Navbar() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [navVisible, setNavVisible] = useState(false);
    const navRefs = useRef([]);

    // Animate desktop menu items on mount
    useEffect(() => {
        setNavVisible(true);
    }, []);

    return (
        <header className="
            fixed top-0 left-0 w-full z-50 
            bg-white/85 backdrop-blur-xl 
            border-b border-gray-200 
            shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-[60px] sm:h-16 md:h-[70px]">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="TJC"
                            className="w-12 sm:w-[52px] hover:scale-105 transition-transform duration-300"
                        />
                        <span className="
                            font-semibold 
                            text-[18px] sm:text-[22px] md:text-[24px] 
                            bg-linear-to-r from-yellow-600 to-yellow-500 
                            bg-clip-text text-transparent tracking-wide
                        ">
                            TJC Corporation
                        </span>
                    </Link>

                    {/* MOBILE BUTTON */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-yellow-600"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        <i className={`bx ${mobileMenu ? "bx-x" : "bx-menu"} text-[32px]`}></i>
                    </button>

                    {/* DESKTOP MENU */}
                    <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-[15px] lg:text-[16px] font-medium">
                        {[
                            { href: "/#", label: "หน้าแรก", icon: <i className='bx bxs-home'></i> },
                            { href: "/#about", label: "เกี่ยวกับเรา", icon: <i className='bx bxs-business'></i> },
                            { href: "/#services", label: "บริการ", icon: <i className='bx bxs-donate-heart'></i> },
                            { href: "/#work", label: "สินค้า", icon: <i className='bx bx-laptop'></i> },
                            { href: "/#contact", label: "ติดต่อ", icon: <i className='bx bxs-comment-dots'></i> },
                        ].map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                ref={(el) => (navRefs.current[i] = el)}
                                className={`
                                    relative text-gray-700 hover:text-yellow-600 group
                                    transition-all duration-500
                                    ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                                `}
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="flex items-center gap-2">
                                    {item.label}
                                    <span className="text-[18px]">{item.icon}</span>
                                </div>

                                {/* Underline */}
                                <span className="
                                    absolute -bottom-1 left-0 w-0 h-[3px]
                                    bg-yellow-500 rounded-full 
                                    transition-all duration-300 
                                    group-hover:w-full
                                "></span>
                            </a>
                        ))}

                        {/* SOCIAL Icons */}
                        <div className="flex items-center gap-4 text-[20px] text-gray-600">
                            {[
                                {
                                    href: "https://line.me/",
                                    icon: <SiLine className="text-green-500" />,
                                    delay: 500 // หน่วงเวลาให้มาช้ากว่าเมนูตัวสุดท้าย
                                },
                                {
                                    href: "https://facebook.com/",
                                    icon: <SiFacebook className="text-blue-600" />,
                                    delay: 600
                                },
                                // {
                                //     href: "https://instagram.com/",
                                //     icon: <SiInstagram className="text-pink-500" />,
                                //     delay: 700
                                // }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    // เพิ่ม Logic: ถ้า navVisible เป็น true ให้แสดง, ถ้าไม่ ให้ซ่อนและเลื่อนขึ้นไปข้างบน
                                    className={`
                                                hover:scale-125 transition-all duration-500
                                                ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                                            `}
                                    // ใส่ Delay เพื่อให้เด้งมาทีละตัว
                                    style={{ transitionDelay: `${social.delay}ms` }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`
                    md:hidden bg-white border-t border-gray-200 overflow-hidden
                    transition-all duration-300
                    ${mobileMenu ? "max-h-96 py-3" : "max-h-0"}
                `}
            >
                <nav className="flex flex-col px-6 space-y-3 text-[17px] font-medium">
                    {[
                        { href: "/#", label: "หน้าแรก" },
                        { href: "/#about", label: "เกี่ยวกับเรา" },
                        { href: "/#services", label: "บริการ" },
                        { href: "/#work", label: "สินค้า" },
                        { href: "/#contact", label: "ติดต่อ" },
                    ].map((item, i) => (
                        <a
                            key={i}
                            href={item.href}
                            onClick={() => setMobileMenu(false)}
                            className="py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-yellow-600 transition"
                            style={{ transitionDelay: `${i * 50}ms` }}
                        >
                            {item.label}
                        </a>
                    ))}

                    <div className="flex items-center gap-5 pt-3 text-[22px] text-gray-700">
                        <SiLine className="text-green-500" />
                        <SiFacebook className="text-blue-600" />
                        {/* <SiInstagram className="text-pink-500" /> */}
                    </div>
                </nav>
            </div>
        </header>
    );
}
