"use client";
import React from "react";
import Image from "next/image";
import Navbar from "../componect/Navbar";

const products = [
    {
        id: 1,
        name: "คอมพิวเตอร์สำนักงาน",
        image: "/images/JTEC.png",
        desc: "เหมาะสำหรับงานเอกสารและงานธุรกิจทั่วไป",
    },
    {
        id: 2,
        name: "โปรเจคเตอร์มัลติมีเดีย",
        image: "/images/origina.png",
        desc: "ให้ภาพคมชัดสำหรับห้องเรียนและห้องประชุม",
    },
    {
        id: 3,
        name: "อุปกรณ์เครือข่าย",
        image: "/images/page.png",
        desc: "สร้างระบบเครือข่ายเสถียรสำหรับทุกองค์กร",
    },
    {
        id: 4,
        name: "ชุดเครื่องมือทดลอง",
        image: "/images/SMEGP.png",
        desc: "เหมาะสำหรับงานวิทยาศาสตร์และห้องทดลอง",
    },
];

export default function ProductList() {
    return (
        <div>
            <Navbar />
            <div className="w-full bg-white py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">
                    สินค้าแนะนำ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {products.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#C9A86A] hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                                <Image
                                    src={item.image}
                                    width={300}
                                    height={300}
                                    alt={item.name}
                                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Text */}
                            <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-[#C9A86A] transition-all">
                                {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-700">
                                {item.desc}
                            </p>

                            {/* Gold Hover Bar */}
                            <div className="mt-4 w-0 h-1 bg-[#C9A86A] rounded-full transition-all duration-300 group-hover:w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}