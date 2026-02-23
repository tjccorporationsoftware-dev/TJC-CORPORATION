"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiLine, SiFacebook } from "react-icons/si";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Navbar() {
    const router = useRouter();

    // --- State ---
    const [mobileMenu, setMobileMenu] = useState(false);
    const [navVisible, setNavVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // เก็บข้อมูลเมนูจาก API
    const [menuData, setMenuData] = useState({ products: [], services: [] });

    // ควบคุม Dropdown
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(null);

    const desktopDropdownRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
        setNavVisible(true);
        fetchMenu();
    }, []);

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        function onDocClick(e) {
            if (!desktopDropdownRef.current) return;
            if (!desktopDropdownRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // --- Fetching ---
    const fetchMenu = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/site/menu`);
            if (res.ok) {
                const data = await res.json();
                setMenuData({
                    products: data.products || [],
                    services: data.services || [],
                });
            } else {
                console.error("Error fetching menu:", res.status);
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Navigation Helpers ---
    function goHash(href) {
        setMobileMenu(false);
        setOpenDropdown(null);
        setMobileOpen(null);
        router.push(href);
    }

    // 🔥 แก้ไข Logic ตรงนี้: รองรับทั้ง slug และ id และตรวจสอบค่าว่าง
    // ฟังก์ชันใน Navbar ของคุณ (ไม่ต้องแก้ แต่ตรวจสอบให้แน่ใจว่าเป็นแบบนี้)
    function goCategory(type, identifier) {
        setMobileMenu(false);
        setOpenDropdown(null);
        setMobileOpen(null);

        const params = new URLSearchParams();
        const slug = identifier || "all";

        if (slug !== "all") {
            params.set("cat", slug);
        }

        if (type === "products") {
            router.push(`/products?${params.toString()}`);
        } else if (type === "services") {
            router.push(`/services?${params.toString()}`); // จะไปที่ /services?cat=ชื่อหมวดหมู่
        }
    }

    // --- Menu Configuration ---
    const menuConfig = useMemo(
        () => [
            { label: "หน้าแรก", href: "/#", type: "link", icon: <i className="bx bxs-home" /> },
            { label: "เกี่ยวกับเรา", href: "/#about", type: "link", icon: <i className="bx bxs-business" /> },
            {
                label: "สินค้า",
                type: "dropdown",
                key: "products",
                icon: <i className="bx bx-laptop" />,
                data: menuData.products,
            },
            {
                label: "บริการ",
                type: "dropdown",
                key: "services",
                icon: <i className="bx bxs-donate-heart" />,
                data: menuData.services,
            },
            { label: "ติดต่อ", href: "/#contact", type: "link", icon: <i className="bx bxs-comment-dots" /> },
        ],
        [menuData]
    );

    // --- Render Helpers ---
    const renderDropdownContent = (item) => {
        if (loading) {
            return <div className="px-3 py-2 text-white/30 text-sm">กำลังโหลดข้อมูล...</div>;
        }

        return (
            <>
                {/* ปุ่มดูทั้งหมดภายใน Dropdown */}
                <button
                    type="button"
                    onClick={() => goCategory(item.key, "all")}
                    className="text-left px-3 py-2 rounded-xl text-white/40 hover:text-amber-200 hover:bg-white/5 transition text-[12px] font-bold border-b border-white/5 mb-1 w-full"
                >
                    {item.label}ทั้งหมด
                </button>

                {item.data.length === 0 ? (
                    <div className="px-3 py-2 text-white/30 text-sm">ไม่พบหมวดหมู่</div>
                ) : (
                    item.data.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            // ✅ แก้ไข: ใช้ slug หรือ title แทน id เพื่อให้ filter ตรงกับหน้า services/products
                            onClick={() => goCategory(item.key, cat.slug || cat.title)}
                            className="text-left px-3 py-2 rounded-xl text-white/90 hover:text-amber-200 hover:bg-white/6 transition text-[14px] w-full"
                        >
                            {cat.title}
                        </button>
                    ))
                )}
            </>
        );
    };

    const renderMobileDropdownContent = (item) => {
        if (loading) {
            return <div className="px-3 py-2 text-white/30 text-sm">กำลังโหลด...</div>;
        }

        return (
            <>
                <button
                    type="button"
                    onClick={() => goCategory(item.key, "all")}
                    className="block w-full text-left py-2 px-3 rounded-lg text-[14px] text-white/50 hover:bg-white/6 transition"
                >
                    ดู{item.label}ทั้งหมด
                </button>
                {item.data.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        // ✅ แก้ไข: ใช้ slug หรือ title แทน id เพื่อให้ filter ตรงกับหน้า services/products
                        onClick={() => goCategory(item.key, cat.slug || cat.title)}
                        className="block w-full text-left py-2 px-3 rounded-lg text-[14px] text-white/90 hover:bg-white/6 hover:text-amber-200 transition"
                    >
                        {cat.title}
                    </button>
                ))}
            </>
        );
    };

    return (
        <header
            className="
        fixed top-0 left-0 w-full z-50
        bg-zinc-800/85 backdrop-blur-xl
        border-b border-amber-400/25
        shadow-[0_2px_12px_rgba(0,0,0,0.28)]
      "
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -left-24 h-56 w-56 rounded-full bg-amber-400/12 blur-3xl" />
                <div className="absolute -bottom-20 -right-24 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <img
                            src="/images/logo.png"
                            alt="TJC"
                            className="w-12 hover:scale-105 transition-transform duration-300 bg-white rounded-full"
                        />
                        <span
                            className="
                font-semibold text-[18px] sm:text-[22px] md:text-[24px]
                bg-linear-to-r from-amber-300 via-yellow-400 to-white
                bg-clip-text text-transparent tracking-wide
              "
                        >
                            TJC Corporation
                        </span>
                    </Link>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="md:hidden p-2 text-white/90 hover:text-amber-200 transition"
                        onClick={() => setMobileMenu((v) => !v)}
                        aria-label="Toggle menu"
                        type="button"
                    >
                        <i className={`bx ${mobileMenu ? "bx-x" : "bx-menu"} text-[32px]`} />
                    </button>

                    {/* DESKTOP MENU */}
                    <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-[16px] lg:text-[17px] font-medium" ref={desktopDropdownRef}>
                        {menuConfig.map((item, i) => {
                            if (item.type === "dropdown") {
                                const isOpen = openDropdown === item.key;
                                return (
                                    <div
                                        key={i}
                                        className={`
                      relative
                      ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                      transition-all duration-500
                    `}
                                        style={{ transitionDelay: `${i * 80}ms` }}
                                        onMouseEnter={() => setOpenDropdown(item.key)}
                                        onMouseLeave={() => setOpenDropdown(null)}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                                            className="text-white/90 hover:text-amber-200 transition flex items-center gap-1.5 py-2"
                                            aria-expanded={isOpen}
                                        >
                                            {item.label}
                                            <span className="text-[18px] opacity-90">{item.icon}</span>
                                            <i className={`bx bx-chevron-down text-[18px] opacity-70 transition ${isOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {/* Desktop Dropdown Content */}
                                        <div
                                            className={`
                        absolute left-0 top-full pt-2
                        ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}
                        transition-all duration-200
                      `}
                                        >
                                            <div className="w-[320px] rounded-2xl bg-zinc-800/95 backdrop-blur-xl border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-2">
                                                <div className="grid grid-cols-1 gap-1 p-2 max-h-100 overflow-y-auto custom-scrollbar">
                                                    {renderDropdownContent(item)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => goHash(item.href)}
                                    className={`
                    text-white/90 hover:text-amber-200 transition-all duration-500
                    ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  `}
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        {item.label}
                                        <span className="text-[18px] opacity-90">{item.icon}</span>
                                    </span>
                                </button>
                            );
                        })}

                        {/* SOCIAL Icons */}
                        <div className="flex items-center gap-4 text-[20px] text-white/70 shrink-0 ml-2">
                            <a
                                href="https://lin.ee/twVZIGO"
                                target="_blank"
                                rel="noreferrer"
                                className={`text-amber-200/90 hover:text-amber-100 hover:scale-125 transition-all duration-500 ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                                    }`}
                                style={{ transitionDelay: "500ms" }}
                            >
                                <SiLine />
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=61573753956246"
                                target="_blank"
                                rel="noreferrer"
                                className={`text-amber-200/90 hover:text-amber-100 hover:scale-125 transition-all duration-500 ${navVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                                    }`}
                                style={{ transitionDelay: "600ms" }}
                            >
                                <SiFacebook />
                            </a>
                        </div>
                    </nav>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`
          md:hidden bg-zinc-800/95 backdrop-blur-xl border-t border-white/12 overflow-hidden
          transition-all duration-300
          ${mobileMenu ? "max-h-[80vh] py-3 overflow-y-auto" : "max-h-0"}
        `}
            >
                <nav className="flex flex-col px-6 space-y-2 text-[16px] font-medium pb-10">
                    {menuConfig.map((item, i) => {
                        if (item.type === "dropdown") {
                            const isMobileOpen = mobileOpen === item.key;
                            return (
                                <div key={i} className="rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setMobileOpen(isMobileOpen ? null : item.key)}
                                        className="w-full flex items-center justify-between py-2 px-2 rounded-lg text-white/90 hover:bg-white/6 hover:text-amber-200 transition"
                                    >
                                        <span className="flex items-center gap-2">
                                            {item.label}
                                        </span>
                                        <i className={`bx bx-chevron-down text-[22px] transition ${isMobileOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ${isMobileOpen ? "max-h-100 mt-1" : "max-h-0"}`}>
                                        <div className="pl-4 pr-2 pb-2 space-y-1 border-l border-white/10 ml-2">
                                            {renderMobileDropdownContent(item)}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goHash(item.href)}
                                className="text-left py-2 px-2 rounded-lg text-white/90 hover:bg-white/6 hover:text-amber-200 transition"
                            >
                                {item.label}
                            </button>
                        );
                    })}

                    <div className="flex items-center gap-5 pt-3 text-[22px] pl-2 border-t border-white/10 mt-2">
                        <a href="https://lin.ee/twVZIGO" target="_blank" rel="noreferrer" className="text-amber-200/90 hover:text-amber-100 transition">
                            <SiLine />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61573753956246" target="_blank" rel="noreferrer" className="text-amber-200/90 hover:text-amber-100 transition">
                            <SiFacebook />
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
}