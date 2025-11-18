"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("admin_token")
            : null;

    useEffect(() => {
        if (!token) router.push("/admin/login");
    }, [token]);

    useEffect(() => {
        async function fetchSurveys() {
            try {
                const res = await fetch("http://localhost:4000/api/survey");
                const data = await res.json();
                setSurveys(data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchSurveys();
    }, []);

    const avg =
        surveys.length > 0
            ? surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length
            : 0;

    const countStars = (num) => surveys.filter((s) => s.rating === num).length;

    const ratingSummary = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: countStars(star),
    }));

    return (
        <div className="min-h-screen bg-[#f2f2f2] p-8">

            {/* TOP NAV */}
            <header className="bg-white shadow-sm border-b-4 border-[#d4af37] rounded-xl p-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#3d3d3d]">
                    <span className="text-[#b8922a]">Dashboard</span> — ระบบประเมินความพึงพอใจ
                </h1>

                <button
                    className="px-6 py-2 bg-[#8b0000] hover:bg-[#a30000] text-white rounded-lg font-semibold shadow"
                    onClick={() => {
                        localStorage.removeItem("admin_token");
                        router.push("/admin/login");
                    }}
                >
                    ออกจากระบบ
                </button>
            </header>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <StatCard title="จำนวนแบบประเมินทั้งหมด" value={surveys.length} icon="" />
                <StatCard title="คะแนนเฉลี่ยรวม" value={avg.toFixed(2)} icon="" />
                <StatCard title="ผู้ให้คะแนน 5 ดาว" value={countStars(5)} icon="" />
                <StatCard
                    title="คะแนนที่น้อยที่สุด"
                    value={surveys.length ? Math.min(...surveys.map((s) => s.rating)) : 0}
                    icon=""
                />
            </div>

            {/* RATING SUMMARY */}
            <div className="bg-white p-8 rounded-xl shadow mt-10 border border-gray-200">
                <h2 className="text-2xl font-bold text-[#3d3d3d] mb-6">
                    รายงานจำนวนผู้ให้คะแนน (แต่ละระดับดาว)
                </h2>

                <div className="space-y-4">
                    {ratingSummary.map((item) => (
                        <div key={item.star}>
                            <div className="flex justify-between text-[#4b4b4b] mb-1">
                                <span className="font-semibold">{item.star} ดาว</span>
                                <span className="font-bold text-[#b8922a]">{item.count} คน</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-linear-to-r from-[#b8922a] to-[#e6c768] h-4 rounded-full transition-all duration-500"
                                    style={{
                                        width:
                                            surveys.length === 0
                                                ? "0%"
                                                : `${(item.count / surveys.length) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* TABLE */}
            <div className="bg-white p-8 rounded-xl shadow mt-10 border border-gray-200">
                <h2 className="text-2xl font-bold text-[#3d3d3d] mb-6">
                    รายการประเมินทั้งหมด
                </h2>

                {loading ? (
                    <p className="text-gray-600">กำลังโหลด...</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b text-[#3d3d3d] uppercase text-sm">
                                <th className="p-3 text-left">ชื่อผู้ประเมิน</th>
                                <th className="p-3 text-left">คะแนน</th>
                                <th className="p-3 text-left">ความคิดเห็น</th>
                                <th className="p-3 text-left">วันที่</th>
                            </tr>
                        </thead>

                        <tbody>
                            {surveys.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium text-[#3d3d3d]">
                                        {s.name || "-"}
                                    </td>
                                    <td className="p-3 text-[#b8922a] font-semibold">
                                        {s.rating}⭐
                                    </td>
                                    <td className="p-3 text-gray-600">{s.comment || "-"}</td>
                                    <td className="p-3 text-gray-500">
                                        {new Date(s.created_at).toLocaleString("th-TH")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <p className="text-[#4b4b4b] font-medium">{title}</p>
                <span className="text-3xl">{icon}</span>
            </div>

            <h2 className="text-4xl font-bold text-[#b8922a] mt-3">{value}</h2>
        </div>
    );
}
