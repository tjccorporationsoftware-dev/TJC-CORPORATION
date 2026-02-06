"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SiLine, SiFacebook } from "react-icons/si";

export default function Navbar() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [navVisible, setNavVisible] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const navRefs = useRef([]);

    useEffect(() => {
        setNavVisible(true);
    }, []);

    // ✅ หมวดหมู่สินค้า (หมายหมู่)
    const productCategories = [
        { href: "/#education", label: "ครุภัณฑ์ทางการศึกษา" },
        { href: "/#it-computer", label: "สินค้าไอที และคอมพิวเตอร์" },
        { href: "/#network", label: "ระบบเครือข่าย และโครงสร้างพื้นฐาน IT" },
        { href: "/#cctv", label: "ระบบกล้องวงจรปิด (CCTV & Security)" },
        { href: "/#led", label: "จอ LED และระบบแสดงผล" },
        { href: "/#solutions", label: "ระบบไอทีครบวงจร (Solution & Services)" },
        { href: "/#others", label: "สินค้าและอุปกรณ์อื่น ๆ" },
    ];

    // เมนูหลัก (Desktop)
    const desktopMenu = [
        { href: "/#", label: "หน้าแรก", icon: <i className="bx bxs-home"></i> },
        { href: "/#about", label: "เกี่ยวกับเรา", icon: <i className="bx bxs-business"></i> },
        { href: "/#services", label: "บริการ", icon: <i className="bx bxs-donate-heart"></i> },
        // สินค้า = dropdown
        { label: "สินค้า", icon: <i className="bx bx-laptop"></i>, isDropdown: true },
        { href: "/#contact", label: "ติดต่อ", icon: <i className="bx bxs-comment-dots"></i> },
    ];

    // เมนูมือถือ
    const mobileMenuItems = [
        { href: "/#", label: "หน้าแรก" },
        { href: "/#about", label: "เกี่ยวกับเรา" },
        { href: "/#services", label: "บริการ" },
        { href: "/#work", label: "สินค้า", isDropdown: true },
        { href: "/#contact", label: "ติดต่อ" },
    ];

    return (
        <header
            className="
        fixed top-0 left-0 w-full z-50 
        bg-white/85 backdrop-blur-xl 
        border-b border-gray-200 
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
      "
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-15 sm:h-16 md:h-17.5 flex-nowrap">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <img
                            src="/images/logo.png"
                            alt="TJC"
                            className="w-12 sm:w-13 hover:scale-105 transition-transform duration-300"
                        />
                        <span
                            className="
                font-semibold 
                text-[18px] sm:text-[22px] md:text-[24px] 
                bg-linear-to-r from-yellow-600 to-yellow-500 
                bg-clip-text text-transparent tracking-wide
              "
                        >
                            TJC Corporation
                        </span>
                    </Link>

                    {/* MOBILE BUTTON */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-yellow-600"
                        onClick={() => setMobileMenu((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        <i className={`bx ${mobileMenu ? "bx-x" : "bx-menu"} text-[32px]`}></i>
                    </button>

                    {/* DESKTOP MENU */}
                    <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-[15px] lg:text-[16px] font-medium flex-nowrap">
                        {desktopMenu.map((item, i) => {
                            // ✅ Dropdown สินค้า (Desktop)
                            if (item.isDropdown) {
                                return (
                                    <div
                                        key={i}
                                        className={`
                      relative group
                      ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                      transition-all duration-500
                    `}
                                        style={{ transitionDelay: `${i * 80}ms` }}
                                    >
                                        <a
                                            href={item.href}
                                            className="
                        relative text-gray-700 hover:text-yellow-600
                        transition-all duration-300
                        whitespace-nowrap
                        flex items-center gap-2
                      "
                                        >
                                            {item.label}
                                            <span className="text-[18px]">{item.icon}</span>
                                            <i className="bx bx-chevron-down text-[18px] opacity-70"></i>

                                            {/* Underline */}
                                            <span
                                                className="
                          absolute -bottom-1 left-0 w-0 h-0.75
                          bg-yellow-500 rounded-full
                          transition-all duration-300
                          group-hover:w-full
                        "
                                            ></span>
                                        </a>

                                        {/* Dropdown panel */}
                                        <div
                                            className="
                        absolute left-0 top-full pt-3
                        opacity-0 translate-y-2 pointer-events-none
                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                        transition-all duration-200
                      "
                                        >
                                            <div
                                                className="
                          w-90
                          rounded-2xl bg-white/95 backdrop-blur-xl
                          border border-gray-200 shadow-xl
                          p-2
                        "
                                            >
                                                <div className="px-3 pt-2 pb-1 text-[12px] font-semibold text-gray-500">
                                                    หมวดหมู่สินค้า
                                                </div>

                                                <div className="grid grid-cols-1 gap-1 p-2">
                                                    {productCategories.map((c, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={c.href}
                                                            className="
                                px-3 py-2 rounded-xl
                                text-gray-700 hover:text-yellow-700
                                hover:bg-yellow-50
                                transition
                                text-[14px]
                              "
                                                        >
                                                            {c.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // ✅ เมนูปกติ (Desktop)
                            return (
                                <a
                                    key={i}
                                    href={item.href}
                                    ref={(el) => (navRefs.current[i] = el)}
                                    className={`
                    relative text-gray-700 hover:text-yellow-600 group
                    transition-all duration-500
                    whitespace-nowrap
                    ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  `}
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.label}
                                        <span className="text-[18px]">{item.icon}</span>
                                    </div>

                                    <span
                                        className="
                      absolute -bottom-1 left-0 w-0 h-0.75
                      bg-yellow-500 rounded-full 
                      transition-all duration-300 
                      group-hover:w-full
                    "
                                    ></span>
                                </a>
                            );
                        })}

                        {/* SOCIAL Icons */}
                        <div className="flex items-center gap-4 text-[20px] text-gray-600 shrink-0">
                            {[
                                {
                                    href: "https://lin.ee/twVZIGO",
                                    icon: <SiLine className="text-green-500" />,
                                    delay: 500,
                                },
                                {
                                    href: "https://www.facebook.com/profile.php?id=61573753956246",
                                    icon: <SiFacebook className="text-blue-600" />,
                                    delay: 600,
                                },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`
                    hover:scale-125 transition-all duration-500
                    ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  `}
                                    style={{ transitionDelay: `${social.delay}ms` }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        {/* placeholder video area (ยังคงไว้ตามโค้ดเดิม) */}
                        <div className="w-36">{/* video disabled */}</div>
                    </nav>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`
          md:hidden bg-white border-t border-gray-200 overflow-hidden
          transition-all duration-300
          ${mobileMenu ? "max-h-140 py-3" : "max-h-0"}
        `}
            >
                <nav className="flex flex-col px-6 space-y-2 text-[17px] font-medium">
                    {mobileMenuItems.map((item, i) => {
                        // ✅ Dropdown สินค้า (Mobile)
                        if (item.isDropdown) {
                            return (
                                <div key={i} className="rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setMobileProductsOpen((v) => !v)}
                                        className="
                      w-full flex items-center justify-between
                      py-2 px-2 rounded-lg
                      hover:bg-gray-100 hover:text-yellow-600 transition
                    "
                                    >
                                        <span>{item.label}</span>
                                        <i className={`bx bx-chevron-down text-[22px] transition ${mobileProductsOpen ? "rotate-180" : ""}`}></i>
                                    </button>

                                    <div
                                        className={`
                      overflow-hidden transition-all duration-300
                      ${mobileProductsOpen ? "max-h-96 mt-1" : "max-h-0"}
                    `}
                                    >
                                        <div className="pl-3 pr-2 pb-2 space-y-1">
                                            {productCategories.map((c, idx) => (
                                                <a
                                                    key={idx}
                                                    href={c.href}
                                                    onClick={() => {
                                                        setMobileMenu(false);
                                                        setMobileProductsOpen(false);
                                                    }}
                                                    className="
                            block py-2 px-3 rounded-lg
                            text-[15px] text-gray-700
                            hover:bg-yellow-50 hover:text-yellow-700 transition
                          "
                                                >
                                                    {c.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // ✅ เมนูปกติ (Mobile)
                        return (
                            <a
                                key={i}
                                href={item.href}
                                onClick={() => setMobileMenu(false)}
                                className="py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-yellow-600 transition"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {item.label}
                            </a>
                        );
                    })}

                    <div className="flex items-center gap-5 pt-3 text-[22px] text-gray-700">
                        <a href="https://lin.ee/twVZIGO" target="_blank" rel="noreferrer">
                            <SiLine className="text-green-500" />
                        </a>
                        <a
                            href="https://www.facebook.com/profile.php?id=61573753956246"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <SiFacebook className="text-blue-600" />
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
}
