"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiLine, SiFacebook } from "react-icons/si";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Navbar() {
    const router = useRouter();

    const [mobileMenu, setMobileMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [menuData, setMenuData] = useState({ products: [], services: [] });
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(null);

    const desktopDropdownRef = useRef(null);

    useEffect(() => {
        fetchMenu();
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        function onDocClick(e) {
            if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

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
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally {
            setLoading(false);
        }
    };

    function goHash(href) {
        setMobileMenu(false);
        setOpenDropdown(null);
        setMobileOpen(null);
        router.push(href);
    }

    function goCategory(type, identifier) {
        setMobileMenu(false);
        setOpenDropdown(null);
        setMobileOpen(null);
        const params = new URLSearchParams();
        const slug = identifier || "all";
        if (slug !== "all") params.set("cat", slug);
        router.push(`/${type}?${params.toString()}`);
    }

    const menuConfig = useMemo(() => [
        { label: "หน้าแรก", href: "/#", type: "link" },
        { label: "เกี่ยวกับเรา", href: "/#about", type: "link" },
        { label: "สินค้าของเรา", type: "dropdown", key: "products", data: menuData.products },
        { label: "งานบริการ", type: "dropdown", key: "services", data: menuData.services },
        { label: "ติดต่อเรา", href: "/#contact", type: "link" },
    ], [menuData]);

    return (
        <header
            /* ปรับให้เป็นสี Solid (bg-zinc-700/100) ตั้งแต่เริ่ม ไม่ใช้สีใส */
            className={`fixed top-0 left-0 w-full z-100 transition-all duration-500 bg-zinc-700 ${isScrolled
                ? "shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1"
                : "shadow-lg py-4"
                }`}
        >
            {/* เส้นสีทองบางๆ ด้านล่าง Navbar */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-[#DAA520]/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* --- LOGO: Clean & Sharp (สีขาวตัดดำ) --- */}
                    <Link href="/" className="flex items-center gap-4 group shrink-0">
                        <div className="relative">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:-rotate-3 group-hover:scale-105">
                                <img src="/images/logo.png" alt="TJC" className="w-12 h-12 object-contain" />
                            </div>
                        </div>
                        <div className="flex flex-col border-l border-zinc-700/50 pl-4">
                            <span className="font-black text-xl leading-none text-white tracking-tighter uppercase">
                                TJC <span className="text-[#DAA520]">CORPORATION</span>
                            </span>
                            <span className="text-[9px] font-bold text-zinc-500 mt-1 uppercase tracking-[0.25em]">Established Excellence</span>
                        </div>
                    </Link>

                    {/* --- DESKTOP NAVIGATION: High Contrast --- */}
                    <nav className="hidden lg:flex items-center gap-2" ref={desktopDropdownRef}>
                        {menuConfig.map((item, i) => {
                            const isActive = openDropdown === item.key;
                            if (item.type === "dropdown") {
                                return (
                                    <div key={i} className="relative h-full"
                                        onMouseEnter={() => setOpenDropdown(item.key)}
                                        onMouseLeave={() => setOpenDropdown(null)}>
                                        <button className={`px-5 py-2 text-[14px] font-bold transition-all duration-300 flex items-center gap-2 rounded-md ${isActive ? "text-[#DAA520] bg-white/5" : "text-zinc-200 hover:text-[#DAA520]"
                                            }`}>
                                            {item.label}
                                            <i className={`bx bx-chevron-down text-lg transition-transform duration-500 ${isActive ? "rotate-180" : "opacity-30"}`} />
                                        </button>

                                        {/* Dropdown Panel: Dark Premium Window */}
                                        <div className={`absolute left-0 top-full pt-4 transition-all duration-500 ${isActive ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"
                                            }`}>
                                            <div className="w-80 bg-zinc-900 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden p-3 backdrop-blur-xl">
                                                <button onClick={() => goCategory(item.key, "all")}
                                                    className="w-full text-center py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-900 bg-[#DAA520] hover:bg-white transition-all shadow-xl mb-3">
                                                    เรียกดูทั้งหมด
                                                </button>

                                                <div className="space-y-1 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                                                    {loading ? (
                                                        <div className="p-6 text-center text-zinc-600 text-xs italic">กำลังเข้าถึงฐานข้อมูล...</div>
                                                    ) : (
                                                        item.data.map((cat) => (
                                                            <button key={cat.id} onClick={() => goCategory(item.key, cat.slug || cat.title)}
                                                                className="w-full text-left px-5 py-3 rounded-xl text-[14px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-between group/item">
                                                                {cat.title}
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520] opacity-0 group-hover/item:opacity-100 transition-all shadow-[0_0_10px_#DAA520]" />
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <button key={i} onClick={() => goHash(item.href)}
                                    className="px-5 py-2 rounded-md text-[14px] font-bold text-zinc-200 hover:text-[#DAA520] transition-all duration-300">
                                    {item.label}
                                </button>
                            );
                        })}

                        {/* Social Buttons */}
                        <div className="flex items-center gap-3 ml-6 pl-6 border-l border-zinc-800">
                            <a href="https://lin.ee/twVZIGO" target="_blank" className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[#DAA520] hover:bg-[#DAA520] hover:text-zinc-950 transition-all duration-500 shadow-xl"><SiLine size={18} /></a>
                            <a href="https://facebook.com/..." target="_blank" className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[#DAA520] hover:bg-[#DAA520] hover:text-zinc-950 transition-all duration-500 shadow-xl"><SiFacebook size={18} /></a>
                        </div>
                    </nav>

                    {/* --- MOBILE TOGGLE --- */}
                    <button className="lg:hidden w-12 h-12 flex items-center justify-center text-[#DAA520] bg-white/5 rounded-xl border border-zinc-800 shadow-lg" onClick={() => setMobileMenu(!mobileMenu)}>
                        <i className={`bx ${mobileMenu ? "bx-x" : "bx-menu-alt-right"} text-3xl`} />
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU: Full Screen Solid Dark --- */}
            <div className={`lg:hidden fixed inset-x-0 top-19.5 bg-zinc-700 shadow-2xl transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) ${mobileMenu ? "max-h-screen opacity-100 py-10" : "max-h-0 opacity-0 overflow-hidden"
                }`}>
                <nav className="px-10 space-y-8">
                    {menuConfig.map((item, i) => (
                        <div key={i} className="border-b border-white/5 pb-6">
                            {item.type === "dropdown" ? (
                                <>
                                    <button onClick={() => setMobileOpen(mobileOpen === item.key ? null : item.key)}
                                        className="w-full flex items-center justify-between text-2xl font-black text-white tracking-tighter">
                                        {item.label}
                                        <i className={`bx bx-chevron-down transition-transform duration-500 ${mobileOpen === item.key ? "rotate-180 text-[#DAA520]" : "opacity-20"}`} />
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${mobileOpen === item.key ? "max-h-125 mt-6" : "max-h-0"}`}>
                                        <div className="flex flex-col gap-5 pl-6 border-l-2 border-[#DAA520]/40">
                                            <button onClick={() => goCategory(item.key, "all")} className="text-left text-[#DAA520] font-black text-[11px] uppercase tracking-widest">ดูทั้งหมด</button>
                                            {item.data.map((cat) => (
                                                <button key={cat.id} onClick={() => goCategory(item.key, cat.slug || cat.title)} className="text-left text-zinc-400 text-lg font-bold hover:text-white transition-colors">{cat.title}</button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => goHash(item.href)} className="block w-full text-left text-2xl font-black text-white tracking-tighter">{item.label}</button>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 213, 5, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #DAA520; }
            `}</style>
        </header>
    );
}