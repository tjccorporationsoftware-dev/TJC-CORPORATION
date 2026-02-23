"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // เพิ่มสำหรับการ Redirect

// Import Component ของคุณ
import AdminContactPage from "../componect/AdminContactForm";
import AdminNewsPage from "../componect/AdminNew";
import AdminProductsPage from "../componect/AdminProductsPage";
import AdminMenuPage from "../componect/AdminCategories";
import AdminCertificationsPage from "../componect/Admincertifications";
import AdminCustomerLogosPage from "../componect/Admincustomer-logos";
import Adminservices from "../componect/Adminservices";

export default function DashboardPage() {
    const router = useRouter();

    // 1. กำหนดชุดข้อมูลเมนู (Configuration Array)
    // เพิ่ม icon SVG เข้าไปใน Data เพื่อความสวยงาม (Logic ยังคงเดิม)
    const menuItems = [
        {
            id: "news",
            label: "ข่าวประชาสัมพันธ์",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            component: <AdminNewsPage />
        },
        {
            id: "categories",
            label: "หมวดหมู่สินค้าและบริการ",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            ),
            component: <AdminMenuPage />
        },
        {
            id: "products",
            label: "จัดการสินค้า",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            component: <AdminProductsPage />
        },
        {
            id: "services", // ✅ เปลี่ยน id ให้สื่อความหมาย
            label: "จัดการบริการ", // ✅ เปลี่ยนชื่อให้ตรงกับเนื้อหา
            icon: (
                // ✅ ใช้ไอคอน Briefcase เพื่อสื่อถึงงานบริการ/Solutions
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            component: <Adminservices />
        },
        {
            id: "contact",
            label: "ข้อมูลติดต่อ",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            component: <AdminContactPage />
        },
        {
            id: "certifications",
            label: "จัดการใบรับรอง",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            component: <AdminCertificationsPage />
        },
        {
            id: "logos",
            label: "จัดการโลโก้ลูกค้า",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            component: <AdminCustomerLogosPage />
        }
    ];

    // 2. State เก็บ id ของเมนูที่ถูกเลือก
    const [activeMenuId, setActiveMenuId] = useState(menuItems[0].id);

    // ฟังก์ชันหา Component ที่ตรงกับ activeMenuId
    const activeContent = menuItems.find(item => item.id === activeMenuId)?.component;

    // ฟังก์ชัน Logout
    const handleLogout = () => {
        // ลบ Token ออกจาก LocalStorage (ตาม Logic เดิมที่ใช้ในไฟล์อื่นๆ)
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        // เปลี่ยนหน้าไป Login
        router.push("/admin/login");
    };

    return (
        <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden">

            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl relative z-20">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-slate-800 bg-[#0F172A]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">
                            A
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Admin Console</span>
                    </div>
                </div>

                {/* Menu Area */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
                    {menuItems.map((item) => {
                        const isActive = activeMenuId === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveMenuId(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                    : "hover:bg-slate-800/50 hover:text-white"
                                    }`}
                            >
                                <span className={`${isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-slate-300"}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User & Logout Area */}
                <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    >
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* --- CONTENT AREA --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
                {/* Top Bar (Optional: สำหรับแสดงชื่อหน้า หรือ Profile ย่อ) */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {menuItems.find(i => i.id === activeMenuId)?.label}
                    </h2>
                </header>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Render Component ที่เลือก */}
                    <div className="max-w-400 mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeContent}
                    </div>
                </div>
            </main>

        </div>
    );
}