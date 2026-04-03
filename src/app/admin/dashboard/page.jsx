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
import AdminWarrantyPage from "../componect/AdminWarrantyPage";

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
                    {/* Newspaper / News */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            component: <AdminMenuPage />,
        },
        {
            id: "products",
            label: "จัดการสินค้า",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Box / Products */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            component: <Adminservices />,
        },
        {
            id: "contact",
            label: "ข้อมูลติดต่อ",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Phone/Contact */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            component: <AdminContactPage />,
        },
        {
            id: "certifications",
            label: "จัดการใบรับรอง",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Badge Check / Certifications */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            component: <AdminCertificationsPage />,
        },
        {
            id: "customer-logos",
            label: "จัดการโลโก้ลูกค้า",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Storefront / Customers */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            component: <AdminCustomerLogosPage />,
        },
        {
            id: "partners",
            label: "จัดการโลโก้พาร์ทเนอร์",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Handshake / Network / Partners */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
            component: <AdminPartnerLogosPage />,
        },
        {
            id: "warranty",
            label: "จัดการนโยบายการรับประกัน",
            icon: (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {/* Shield Check / Warranty */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            component: <AdminWarrantyPage />,
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