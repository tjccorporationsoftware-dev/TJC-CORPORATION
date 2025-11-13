'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-gray-200 mb-[-65px] ">
            <div className="px-16 lg:px-8">
                <div className="flex justify-between items-center px-[60px] h-16 relative">
                    {/* โลโก้ */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center p-[-5px] bg-white rounded-[100%]  gap-2">
                            <img src="/images/logo.png"
                                alt=""
                                className='w-[60px] '

                            />

                        </div>
                        <span className="font-semibold text-[20px]">TJC Corporation</span>
                    </div>

                    {/* เมนูหลัก */}
                    <nav className="hidden md:flex gap-6 ml-6 text-[16px] text-slate-600">
                         <a className="hover:text-slate-900" href="#hero">หน้าแรก</a>
                        <a className="hover:text-slate-900" href="#services">บริการ</a>
                        <a className="hover:text-slate-900" href="#work">สินค้า</a>
                        <a className="hover:text-slate-900" href="#about">เกี่ยวกับเรา</a>

                        {/* ปุ่มติดต่อพร้อม dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-1 hover:text-slate-900 transition-colors duration-300"
                            >
                                ติดต่อ
                                <i className="bx bx-message-dots text-[18px]"></i>
                            </button>

                            <div
                                className={`absolute right-0 mt-2 w-48 bg-white  shadow-md rounded-md overflow-hidden transition-all duration-200 ease-in-out transform origin-top ${open
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                    }`}
                            >
                                <ul>
                                    <li>
                                        <Link
                                            href="#history"
                                            onClick={() => setOpen(false)}
                                            className="px-3 py-2 hover:bg-green-50 flex items-center gap-2 transition-colors duration-200"
                                        >
                                            <img src="/images/line.png" className="w-[35px]" alt="" />
                                            <p>Line</p>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#vision"
                                            onClick={() => setOpen(false)}
                                            className="px-4 py-2 hover:bg-green-50 flex items-center gap-2 transition-colors duration-200"
                                        >
                                            <i className="bx bxl-facebook-square text-[30px]"></i>
                                            <p>Facebook</p>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="tel:0804746169"
                                            onClick={() => setOpen(false)}
                                            className="px-4 py-2 hover:bg-green-50 flex items-center gap-2 transition-colors duration-200"
                                        >
                                            <i className="bx bxs-phone-call text-[30px]"></i>
                                            <p>080-4746169</p>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </nav>
                </div>
            </div>
        </header>
    );
}
