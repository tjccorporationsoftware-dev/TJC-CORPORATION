"use client";
import React, { useEffect, useRef, useState } from "react";

export default function NewsSlider() {
    const trackRef = useRef(null);
    // State สำหรับสไลด์ด้านล่าง
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    // State สำหรับรูปภาพข่าวใหม่ (Highlight)
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // ข้อมูลข่าว
    const news = [
        {
            id: 1,
            title: "เปิดตัวโครงการสนับสนุนกีฬาประจำปี 2025",
            desc: "บริษัทร่วมมือกับสมาคมกีฬาเพื่อพัฒนาศักยภาพเยาวชน มุ่งเน้นการสร้างรากฐานที่มั่นคงและส่งเสริมสุขภาพที่ดี",
            date: "12 พ.ย. 2025",
            image: "/images/05.jpg",
            isNew: false
        },
        {
            id: 2,
            title: "ประกาศผลประกวดราคาอิเล็กทรอนิกส์",
            desc: "รายละเอียดการจัดซื้อจัดจ้างประจำไตรมาสที่ 2",
            date: "6 มิ.ย. 2567",
            image: "/images/3.jpg",
            isNew: false
        },
        {
            id: 3,
            title: "MOU ความร่วมมือทางวิชาการ",
            desc: "ลงนามบันทึกข้อตกลงร่วมกับมหาวิทยาลัยชั้นนำ",
            date: "14 พ.ย. 2568",
            image: "/images/04.jpg",
            isNew: false
        },
        {
            id: 4,
            title: "ทีมปิงปองคว้าแชมป์รายการใหญ่",
            desc: "ขอแสดงความยินดีกับตัวแทนพนักงานที่ได้รับรางวัล",
            date: "6 มี.ค. 2568",
            image: "/images/Screenshot 2025-06-03 101538.png",
            isNew: false
        },
        {
            id: 5,
            title: "\nกิจกรรมเลี้ยงอาหารกลางวันพนักงาน ทีเจซีกรุ๊ป",
            desc: "บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด และบริษัทในเครือ ขอขอบพระคุณอาจารย์วีรพงษ์  ไตรศิวะกุล  ที่ปรึกษาบริษัทฯ เป็นอย่างยิ่ง ที่ได้จัดกิจกรรมเลี้ยงอาหารกลางวันสุดพิเศษให้กับพนักงานทุกคน ณ อาคาร 2 ชั้น 1 ",
            desc2: "กิจกรรมนี้จัดขึ้นเมื่อ วันพฤหัสบดีที่ 4 ธันวาคม 2568 ณ อาคาร 2 ชั้น 1 โดยมีวัตถุประสงค์เพื่อตอบแทนความทุ่มเทของพนักงานทุกท่าน และเป็นโอกาสอันดีที่ผู้บริหารและพนักงานจะได้ร่วมรับประทานอาหารอร่อย ๆ และพูดคุยกันอย่างอบอุ่นและเป็นกันเอง",
            date: "พฤหัสบดี 4 ธ.ค. 2025",
            image: "/images/1241.jpg",
            isNew: false,
            // 🔥 เพิ่ม gallery ตรงนี้: ใส่รูปที่ต้องการให้วนลูป (เอารูปอื่นมาใส่ลองดูก่อนได้ครับ)
            gallery: [
                "/images/1241.jpg",  // รูปที่ 1
                "/images/1242.jpg",    // รูปที่ 2
                "/images/1243.jpg",
                // รูปที่ 3
            ]
        },
        {
            id: 6,
            title: "กิจกรรมเลี้ยงอาหารกลางวันพนักงาน ทีเจซีกรุ๊ป",
            desc: "\nเมื่อวันศุกร์ที่ 5 ธันวาคม 2568 ที่ผ่านมา  บริษัท ทีเจซี คอร์ปอเรชั่น จำกัด และบริษัทในเครือ ขอขอบคุณพ่อสนั่น (ประธานบริษัท) เป็นอย่างยิ่ง ที่ได้จัดกิจกรรมเลี้ยงอาหารกลางวันสุดพิเศษให้กับพนักงานทุกคน ณ อาคาร 2 ชั้น 1",
            desc2: "",
            date: "ศุกร์ 5 ธันวาคม 2568",
            image: "/images/206821.jpg",
            isNew: true,
            gallery: [
            ]
        },
    ];

    // Logic จัดการข้อมูล
    const latestNews = news.find(n => n.isNew) || news[0];
    const otherNews = news.filter(n => n.id !== latestNews.id);
    const loopNews = [...otherNews, ...otherNews, ...otherNews];

    // -------------------------------------------------------
    // 🔥 Effect สำหรับเปลี่ยนรูป Highlight อัตโนมัติ
    // -------------------------------------------------------
    useEffect(() => {
        // เช็คว่าข่าวนั้นมี gallery ไหม ถ้ามีให้เริ่มจับเวลา
        if (latestNews.gallery && latestNews.gallery.length > 1) {
            const timer = setInterval(() => {
                setActiveImageIndex((prev) => (prev + 1) % latestNews.gallery.length);
            }, 3000); // เปลี่ยนรูปทุก 3 วินาที (3000ms)

            return () => clearInterval(timer);
        }
    }, [latestNews]);


    // -------------------------------------------------------
    // Resize Card Width
    // -------------------------------------------------------
    const updateCardWidth = () => {
        const track = trackRef.current;
        if (!track) return;
        const firstCard = track.querySelector(".slide-card");
        if (firstCard) setCardWidth(firstCard.clientWidth + 20);
    };

    useEffect(() => {
        updateCardWidth();
        window.addEventListener("resize", updateCardWidth);
        return () => window.removeEventListener("resize", updateCardWidth);
    }, []);

    // -------------------------------------------------------
    // Auto Slide Logic (ด้านล่าง)
    // -------------------------------------------------------
    useEffect(() => {
        if (dragging || cardWidth === 0) return;
        const interval = setInterval(() => {
            let newPos = translateX - cardWidth;
            const track = trackRef.current;
            if (!track) return;
            const limit = -(track.scrollWidth / 3);
            if (newPos <= limit) newPos = 0;
            setTranslateX(newPos);
        }, 3000);
        return () => clearInterval(interval);
    }, [translateX, dragging, cardWidth]);

    // -------------------------------------------------------
    // Apply Transform & Drag Logic
    // -------------------------------------------------------
    useEffect(() => {
        const track = trackRef.current;
        if (track) track.style.transform = `translateX(${translateX}px)`;
    }, [translateX]);

    const handleStart = (clientX) => { setDragging(true); setStartX(clientX); };
    const handleMove = (clientX) => {
        if (!dragging) return;
        const track = trackRef.current;
        if (track) {
            track.style.transition = 'none';
            track.style.transform = `translateX(${translateX + (clientX - startX)}px)`;
        }
    };
    const handleEnd = (clientX) => {
        if (!dragging) return;
        const track = trackRef.current;
        if (track) track.style.transition = 'transform 0.5s ease-out';
        const newPos = translateX + (clientX - startX);
        setTranslateX(Math.round(newPos / cardWidth) * cardWidth);
        setDragging(false);
    };

    const onPointerDown = (e) => handleStart(e.clientX || e.touches?.[0]?.clientX);
    const onPointerMove = (e) => { if (dragging) e.preventDefault(); handleMove(e.clientX || e.touches?.[0]?.clientX); };
    const onPointerUp = (e) => handleEnd(e.clientX || e.changedTouches?.[0]?.clientX);

    return (
        <section className="w-full py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <h2 className="
                    text-3xl md:text-4xl font-extrabold mb-10 
                    border-l-8 border-yellow-500 pl-4 
                    bg-linear-to-r from-yellow-500 to-black bg-clip-text text-transparent
                ">
                    ข่าวประชาสัมพันธ์
                </h2>

                {/* Highlight Section (ข่าวใหม่ด้านบน) */}
                <div className="mb-16">
                    <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                        <div className="grid md:grid-cols-2 h-full">
                            <div className="relative h-64 md:h-auto overflow-hidden bg-gray-100">

                                {/* 🔥 ส่วนแสดงผลรูปภาพ Highlight แบบเปลี่ยนเอง */}
                                <img
                                    src={
                                        latestNews.gallery && latestNews.gallery.length > 0
                                            ? latestNews.gallery[activeImageIndex] // ถ้ามี gallery ใช้รูปตาม index
                                            : latestNews.image // ถ้าไม่มี gallery ใช้รูปหลักรูปเดียว
                                    }
                                    alt={latestNews.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                />

                                {/* จุดไข่ปลาบอกตำแหน่งรูป (Optional: แสดงเฉพาะตอนมีหลายรูป) */}
                                {latestNews.gallery && latestNews.gallery.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                        {latestNews.gallery.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                    ข่าวใหม่
                                </div>
                            </div>

                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center space-x-2 text-yellow-600 font-semibold mb-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span>{latestNews.date}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                    {latestNews.title}
                                </h3>
                                <p className="text-gray-600 text-base md:text-lg mb-3 leading-relaxed">
                                    {latestNews.desc}
                                </p>
                                <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                                    {latestNews.desc2}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other News Slider (สไลด์ด้านล่าง) */}
                <div className="w-full mt-12">
                    <h4 className="
                        text-xl font-bold mb-6 px-2
                        bg-linear-to-r from-yellow-500 to-black bg-clip-text text-transparent
                    ">
                        ข่าวสารย้อนหลัง
                    </h4>

                    {/* Container สำหรับ Slider + ปุ่มข้างๆ */}
                    <div className="relative group">
                        {/* ปุ่มซ้าย */}
                        <button
                            onClick={() => setTranslateX(prev => prev + cardWidth)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 md:-ml-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-110 transition-all duration-200 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>

                        {/* ปุ่มขวา */}
                        <button
                            onClick={() => setTranslateX(prev => prev - cardWidth)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 md:-mr-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-110 transition-all duration-200 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        {/* ตัวรางสไลด์ */}
                        <div className="select-none overflow-hidden w-full py-4 px-1">
                            <div
                                ref={trackRef}
                                className="flex gap-5 transition-transform duration-500 ease-out"
                                onMouseDown={onPointerDown} onMouseMove={onPointerMove} onMouseUp={onPointerUp} onMouseLeave={onPointerUp}
                                onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
                            >
                                {loopNews.map((n, i) => (
                                    <div
                                        key={i}
                                        className="slide-card bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden inline-block min-w-[85%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[30%] group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img src={n.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={n.title} />
                                        </div>
                                        <div className="p-5">
                                            <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">{n.date}</span>
                                            <h3 className="text-lg font-bold text-gray-800 mt-3 mb-2 line-clamp-2">{n.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">{n.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}