"use client";

import React, { useState } from "react";

export default function Survey() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!rating) return alert("กรุณาให้คะแนน");

        const res = await fetch("http://localhost:4000/api/survey", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, comment: message, rating }),
        });

        if (res.ok) {
            setSuccess(true);
            setName("");
            setMessage("");
            setRating(0);
        } else {
            alert("ส่งข้อมูลไม่สำเร็จ");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-700 text-center">
                    แบบประเมินความพึงพอใจ
                </h1>

                {/* Stars */}
                <div className="mt-6">
                    <p className="font-medium text-gray-600 mb-2">ให้คะแนน:</p>
                    <div className="flex gap-3 text-4xl justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <button
                                key={i}
                                type="button"
                                className={`${(hover || rating) >= i ? "text-[#d4af37]" : "text-gray-300"
                                    } transition-transform hover:scale-110`}
                                onMouseEnter={() => setHover(i)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(i)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="block text-gray-600 font-medium">
                            ชื่อผู้ประเมิน (ไม่จำเป็น)
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mt-1 bg-white text-gray-700
                            focus:outline-none focus:border-[#d4af37]"
                            placeholder="ใส่ชื่อของคุณ"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium">ความคิดเห็น</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mt-1 bg-white text-gray-700
                            focus:outline-none focus:border-[#d4af37] min-h-[100px]"
                            placeholder="บอกเราเพิ่มเติม..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#d4af37] text-white py-3 rounded-lg font-semibold
                        hover:bg-[#b99730] transition"
                    >
                        ส่งแบบประเมิน
                    </button>
                </form>

                {success && (
                    <p className="text-green-600 text-center mt-4 font-medium">
                        ขอบคุณสำหรับการประเมินของคุณ!
                    </p>
                )}
            </div>
        </div>
    );
}
