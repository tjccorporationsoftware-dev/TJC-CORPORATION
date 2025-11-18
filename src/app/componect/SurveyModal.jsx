"use client";
import React, { useState } from "react";

export default function SurveyModal({ onClose }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    async function submitSurvey(e) {
        e.preventDefault();
        await fetch("http://localhost:4000/api/survey", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, comment }),
        });

        alert("ส่งแบบประเมินสำเร็จ ขอบคุณค่ะ!");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-[#d4af37]">

                <h2 className="text-xl font-bold text-center mb-4 text-[#bfa334]">
                    แบบประเมินความพึงพอใจ
                </h2>

                <form onSubmit={submitSurvey} className="space-y-4">

                    {/* ⭐ คะแนน */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-1">ให้คะแนน</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    onClick={() => setRating(num)}
                                    className={`text-3xl cursor-pointer ${rating >= num ? "text-yellow-400" : "text-gray-400"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ✏ ความคิดเห็น */}
                    <textarea
                        className="w-full border rounded-xl p-3"
                        placeholder="ความคิดเห็นเพิ่มเติม"
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button className="w-full bg-[#d4af37] text-white py-2 rounded-xl hover:bg-[#b99730] transition">
                        ส่งแบบประเมิน
                    </button>

                    <button
                        type="button"
                        className="w-full text-gray-600 mt-2 hover:text-black"
                        onClick={onClose}
                    >
                        ปิด
                    </button>

                </form>

            </div>
        </div>
    );
}
