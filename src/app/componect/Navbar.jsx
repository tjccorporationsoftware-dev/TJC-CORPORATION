"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* โลโก้ */}
                    <Link href="/" className="flex items-center gap-3">
                        <motion.img
                            src="/images/logo.png"
                            alt="TJC"
                            className="w-[50px] h-[50px] object-contain drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]"
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        />
                        <span className="font-semibold text-[20px] sm:text-[22px] bg-linear-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_1px_rgba(0,0,0,0.2)]">
                            TJC Corporation
                        </span>
                    </Link>

                    {/* ปุ่มเปิดเมนูมือถือ */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-yellow-600 transition"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        <i
                            className={`bx ${mobileMenu ? "bx-x" : "bx-menu"} text-3xl transition-transform`}
                        ></i>
                    </button>

                    {/* เมนู Desktop */}
                    <nav className="hidden md:flex items-center gap-8 text-[16px] font-medium">
                        {[
                            { href: "/#", label: "หน้าแรก", icon: <i className='bx bxs-home'></i> },
                            { href: "/#about", label: "เกี่ยวกับเรา", icon: <i className='bx bxs-business'></i> },
                            { href: "/#services", label: "บริการ", icon: <i className='bx bxs-donate-heart'></i> },
                            { href: "/#work", label: "สินค้า", icon: <i className='bx bx-laptop'></i> },
                            { href: "/#contact", label: "ติดต่อ", icon: <i className='bx bxs-comment-dots'></i> },
                        ].map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.href}
                                className="relative text-gray-700 hover:text-yellow-600 transition group"
                                whileHover={{ y: -2 }}
                            >
                                <div className="flex items-center gap-2">
                                    {item.label}
                                    {item.icon}
                                </div>
                                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-linear-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-300 group-hover:w-full"></span>
                            </motion.a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* เมนู Mobile */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: mobileMenu ? "auto" : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden bg-linear-to-b from-white to-gray-50 border-t border-gray-200 overflow-hidden"
            >
                <nav className="flex flex-col py-3 px-6 space-y-3 text-gray-700 font-medium">
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
                            className="hover:text-yellow-600 transition"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </motion.div>
        </header>
    );
}
