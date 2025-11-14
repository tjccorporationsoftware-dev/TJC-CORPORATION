"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <header className="
            fixed top-0 left-0 w-full z-50 
            bg-white/85 backdrop-blur-xl 
            border-b border-gray-200 
            shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        ">
            <div className="max-w-7xl mx-auto 
                px-3 xxs:px-4 xs:px-5 sm:px-6 lg:px-8
            ">
                <div className="
                    flex justify-between items-center 
                    h-[60px] sm:h-16 md:h-[70px]
                ">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3">
                        <motion.img
                            src="/images/logo.png"
                            alt="TJC"
                            className="
                                w-[42px] h-[42px] 
                                xxs:w-[46px] xxs:h-[46px]
                                xs:w-[48px] xs:h-[48px]
                                sm:w-[50px] sm:h-[50px]
                                object-contain
                            "
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            transition={{ type: "spring", stiffness: 280, damping: 16 }}
                        />

                        <span className="
                            font-semibold 
                            text-[17px] xxs:text-[18px] xs:text-[19px] 
                            sm:text-[22px] md:text-[24px] 
                            bg-linear-to-r from-yellow-600 to-yellow-500 
                            bg-clip-text text-transparent tracking-wide
                        ">
                            TJC Corporation
                        </span>
                    </Link>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="
                            md:hidden p-2 
                            text-gray-700 hover:text-yellow-600 
                            transition active:scale-95
                        "
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        <i
                            className={`bx ${mobileMenu ? "bx-x" : "bx-menu"} text-[32px]`}
                        ></i>
                    </button>

                    {/* DESKTOP MENU */}
                    <nav className="
                        hidden md:flex items-center 
                        gap-6 lg:gap-8 
                        text-[15px] lg:text-[16px] xl:text-[17px]
                        font-medium
                    ">
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
                                className="
                                    relative text-gray-700 hover:text-yellow-600 
                                    transition group select-none
                                "
                                whileHover={{ y: -2 }}
                            >
                                <div className="flex items-center gap-2">
                                    {item.label}
                                    {item.icon}
                                </div>

                                {/* Hover Underline */}
                                <span className="
                                    absolute -bottom-1.5 left-0 
                                    w-0 h-[3px] 
                                    bg-linear-to-r from-yellow-500 to-yellow-400 
                                    rounded-full 
                                    transition-all duration-300 
                                    group-hover:w-full
                                "></span>
                            </motion.a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* MOBILE MENU */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: mobileMenu ? "auto" : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="
                    md:hidden 
                    bg-linear-to-b from-white to-gray-50 
                    border-t border-gray-200 
                    overflow-hidden
                "
            >
                <nav
                    className="
                        flex flex-col 
                        py-3 
                        px-5 xxs:px-6 xs:px-7 
                        space-y-3 
                        text-[16px] xxs:text-[17px] xs:text-[18px]
                        font-medium
                    "
                >
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
                            className="
                                py-2 px-2 rounded-lg
                                hover:bg-gray-100 
                                hover:text-yellow-600 
                                transition
                                active:scale-[0.98]
                            "
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </motion.div>
        </header>
    );
}
