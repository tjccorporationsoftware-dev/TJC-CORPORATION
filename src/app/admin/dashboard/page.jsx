"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Import Component ของคุณ
import AdminContactPage from "../componect/AdminContactForm";
import AdminNewsPage from "../componect/AdminNew";
import AdminProductsPage from "../componect/AdminProductsPage";
import AdminMenuPage from "../componect/AdminCategories";
import AdminCertificationsPage from "../componect/Admincertifications";
import AdminCustomerLogosPage from "../componect/Admincustomer-logos";
import Adminservices from "../componect/Adminservices";
import AdminPartnerLogosPage from "../componect/Adminpartners";

export default function DashboardPage() {
    const router = useRouter();

    // ✅ Icons style: ขนาดเท่ากัน + เส้นคมชัด
    const iconClass = "w-5 h-5";

    const menuItems = [
        {
            id: "news",
            label: "ข่าวประชาสัมพันธ์",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Newspaper */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 20H6a2 2 0 01-2-2V7a3 3 0 013-3h9a2 2 0 012 2v12a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5 7v11a2 2 0 002 2h12M9 8h6M9 12h6M9 16h4" />
                </svg>
            ),
            component: <AdminNewsPage />,
        },
        {
            id: "categories",
            label: "หมวดหมู่สินค้าและบริการ",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Grid / Categories */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
                </svg>
            ),
            component: <AdminMenuPage />,
        },
        {
            id: "products",
            label: "จัดการสินค้า",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Cube / Product */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 8l-9-5-9 5 9 5 9-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8v8l9 5 9-5V8" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 13v8" />
                </svg>
            ),
            component: <AdminProductsPage />,
        },
        {
            id: "services",
            label: "จัดการบริการ",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Wrench / Services */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M14.7 6.3a4 4 0 01-5.66 5.66l-5.1 5.1a2 2 0 102.83 2.83l5.1-5.1a4 4 0 005.66-5.66l-1.6 1.6-2.83-2.83 1.6-1.6z" />
                </svg>
            ),
            component: <Adminservices />,
        },
        {
            id: "contact",
            label: "ข้อมูลติดต่อ",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Phone */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            component: <AdminContactPage />,
        },
        {
            id: "certifications",
            label: "จัดการใบรับรอง",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Badge Check */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 2l2.2 2.2 3.1.4-1.7 2.6.5 3.1-2.8-1.2L12 10l-1.3-1-2.8 1.3.5-3.1L6.7 4.6l3.1-.4L12 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 14v6l5-2 5 2v-6" />
                </svg>
            ),
            component: <AdminCertificationsPage />,
        },
        {
            id: "customer-logos",
            label: "จัดการโลโก้ลูกค้า",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Users / Customers */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h5v-1a4 4 0 00-4-4h-1" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 20H2v-1a4 4 0 014-4h1" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 12a3 3 0 100-6 3 3 0 000 6zM18 12a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
            ),
            component: <AdminCustomerLogosPage />,
        },
        {
            id: "partners",
            label: "จัดการโลโก้พาร์ทเนอร์",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Handshake-ish / Partners */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 12l2-2a3 3 0 014 0l2 2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 14l4 4m12-4l-4 4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 10l4-4 4 4m6-4l4 4" />
                </svg>
            ),
            component: <AdminPartnerLogosPage />,
        },
    ];

    const [activeMenuId, setActiveMenuId] = useState(menuItems[0].id);
    const activeContent = menuItems.find((item) => item.id === activeMenuId)?.component;

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
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
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
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
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* --- CONTENT AREA --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {menuItems.find((i) => i.id === activeMenuId)?.label}
                    </h2>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-400 mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeContent}
                    </div>
                </div>
            </main>
        </div>
    );
}