"use client";

import { useState } from "react";
// Import Component ของคุณ
import AdminContactPage from "../componect/AdminContactForm";
import AdminNewsPage from "../componect/AdminNew";
import AdminProductsPage from "../componect/AdminProductsPage";

// --- สร้าง Component จำลองสำหรับหน้าอื่นๆ (เพื่อให้โค้ดรันได้เลย) ---
const DashboardOverview = () => <div className="p-4 bg-blue-50 text-blue-800 rounded">หน้าภาพรวมสถิติ (Dashboard Overview)</div>;
const SystemSettings = () => <div className="p-4 bg-orange-50 text-orange-800 rounded">หน้าตั้งค่าระบบ (Settings)</div>;
const UserManagement = () => <div className="p-4 bg-green-50 text-green-800 rounded">หน้าจัดการผู้ใช้งาน (Users)</div>;

export default function DashboardPage() {

    // 1. กำหนดชุดข้อมูลเมนู (Configuration Array)
    // ตรงนี้คือหัวใจสำคัญ: ใส่ id, ชื่อเมนู, และ Component ที่จะแสดง
    const menuItems = [
        {
            id: "New",
            label: "ข่าว",
            component: <AdminNewsPage />
        },
        {
            id: "contact",
            label: "ข้อมูลติดต่อ (Contact Form)",
            component: <AdminContactPage /> // Component จริงของคุณ
        },
        {
            id: "users",
            label: "จัดการสินค้า",
            component: <AdminProductsPage />
        },
        {
            id: "settings",
            label: "ตั้งค่าระบบ",
            component: <SystemSettings />
        },
    ];

    // 2. State เก็บ id ของเมนูที่ถูกเลือก (ค่าเริ่มต้นเอาตัวแรกสุดของ Array)
    const [activeMenuId, setActiveMenuId] = useState(menuItems[0].id);

    // ฟังก์ชันหา Component ที่ตรงกับ activeMenuId เพื่อนำไปแสดงผล
    const activeContent = menuItems.find(item => item.id === activeMenuId)?.component;

    return (
        <div className="flex h-screen w-full bg-gray-100">

            {/* --- SIDEBAR (วนลูปแสดงเมนู) --- */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-lg">
                <div className="p-6 text-xl font-bold border-b border-slate-700">
                    Admin Control
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {/* ใช้ .map() เพื่อวนลูปสร้างปุ่มตามจำนวนข้อมูลใน menuItems */}
                    {menuItems.map((item) => (
                        <button
                            key={item.id} // สำคัญ: ต้องมี key เวลาวนลูป
                            onClick={() => setActiveMenuId(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeMenuId === item.id
                                    ? "bg-blue-600 text-white shadow-md translate-x-1" // สไตล์ตอนถูกเลือก
                                    : "hover:bg-slate-800 text-gray-400 hover:text-white" // สไตล์ปกติ
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* --- CONTENT AREA (แสดงผลตามที่เลือก) --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8 pb-4 border-b border-gray-300">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {/* ดึงชื่อเมนูมาแสดงเป็นหัวข้อ */}
                        {menuItems.find(item => item.id === activeMenuId)?.label}
                    </h1>
                </header>

                <div className="bg-white p-6 rounded-xl shadow-sm min-h-125">
                    {/* แสดง Component ที่เลือก */}
                    {activeContent}
                </div>
            </main>

        </div>
    );
}