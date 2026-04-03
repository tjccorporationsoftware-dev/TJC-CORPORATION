"use client";

import React, { useState, useEffect } from "react";
import { X, ExternalLink, Map, PhoneCall, MailOpen, QrCode } from "lucide-react";
import { SiFacebook, SiLine } from "react-icons/si";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ฟังก์ชันแปลง URL รูปภาพให้สมบูรณ์
const resolveUrl = (u) => {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    const cleanPath = u.startsWith("/") ? u : `/${u}`;
    return `${API_BASE}${cleanPath}`;
};

// ✅ ฟังก์ชันเช็กลิงก์ให้ออกไปข้างนอกได้ถูกต้องชัวร์ๆ (ป้องกันกรณีลืมใส่ https://)
const getValidLink = (link, type) => {
    if (!link) return "#";
    if (type === 'phone' || type === 'email') return link;
    if (!link.startsWith("http")) return `https://${link}`;
    return link;
};

export default function FloatingPotatoCorner() {
    const [showBubble, setShowBubble] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [data, setData] = useState(null);

    const [activePopup, setActivePopup] = useState(null);

    const messages = [
        "ยินดีต้อนรับสู่ TJC Corporation คัดสรรนวัตกรรมเพื่อคุณครับ .",
        "ต้องการใบเสนอราคาสำหรับงานโครงการ ติดต่อเราได้ทันที .",
        "อัปเดตเทคโนโลยีและอุปกรณ์ไอทีล่าสุดเพื่อธุรกิจของคุณ ."
    ];

    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/site/contact`, { cache: "no-store" });
                const json = await res.json();
                if (alive) setData(json?.data || null);
            } catch (e) {
                if (alive) setData(null);
            }
        }
        load();
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        const initialTimer = setTimeout(() => setShowBubble(true), 1500);
        const interval = setInterval(() => {
            if (!isContactOpen && !activePopup) {
                setIsFading(true);
                setTimeout(() => {
                    setMessageIndex((prev) => (prev + 1) % messages.length);
                    setIsFading(false);
                }, 500);
            }
        }, 5000);
        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isContactOpen, activePopup]);

    const d = data || {};

    const ContactItem = ({ onClick, label, icon, color, delay }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-end gap-4 group pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
            style={{ animationDelay: delay }}
        >
            <div className="relative bg-[#333333] text-white px-6 py-2.5 rounded-2xl text-[15px] font-medium shadow-2xl transition-all group-hover:-translate-x-2 group-hover:bg-black">
                {label}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-l-[10px] border-l-[#333333] border-b-[7px] border-b-transparent group-hover:border-l-black transition-colors"></div>
            </div>
            <div className={`w-[52px] h-[52px] ${color} rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {icon}
            </div>
        </button>
    );

    return (
        <>
            {/* ===================== POPUP MODAL ===================== */}
            {activePopup && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200" onMouseDown={() => setActivePopup(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-300" onMouseDown={(e) => e.stopPropagation()}>

                        <button onClick={() => setActivePopup(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors z-10">
                            <X size={18} />
                        </button>

                        {/* แสดงผลตามประเภทของเมนู */}
                        {activePopup.type === 'map' && activePopup.embedUrl ? (
                            <div className="w-full h-56 mx-auto mb-5 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-slate-50 relative mt-2">
                                <iframe src={activePopup.embedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                            </div>
                        ) : activePopup.type === 'line' && activePopup.qrCodeUrl ? (
                            <div className="w-48 h-48 mx-auto mb-5 rounded-2xl overflow-hidden border-2 border-zinc-100 shadow-inner p-2 bg-white">
                                <img src={resolveUrl(activePopup.qrCodeUrl)} alt="QR Code LINE" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white mb-5 shadow-inner ${activePopup.color}`}>
                                {activePopup.icon}
                            </div>
                        )}

                        <h3 className="text-xl font-black text-zinc-900 mb-2">{activePopup.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-8 px-2 whitespace-pre-wrap">
                            {activePopup.desc}
                        </p>

                        {activePopup.actionText && (
                            <a
                                href={getValidLink(activePopup.href, activePopup.type)}
                                target={activePopup.type === 'phone' || activePopup.type === 'email' ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    // ✅ แก้ไขปัญหาพอกดแล้วไม่เด้งไปลิงก์ 
                                    // เราหน่วงเวลาให้เบราว์เซอร์เปิดลิงก์ก่อน แล้วค่อยให้ React สั่งปิดป๊อปอัป
                                    setTimeout(() => {
                                        setActivePopup(null);
                                    }, 200);
                                }}
                                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[15px] transition-all text-white shadow-lg active:scale-95 ${activePopup.color} hover:brightness-110`}
                            >
                                {activePopup.actionText} <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* ===================== FLOATING BUTTONS ===================== */}
            <div className={`fixed bottom-8 right-8 z-[9999] flex flex-col items-end pointer-events-none gap-4 transition-all duration-300 ${activePopup ? "opacity-0 invisible" : "opacity-100 visible"}`}>

                {/* --- 1. เมนูติดต่อ --- */}
                {isContactOpen && (
                    <div className="flex flex-col gap-4 mb-2">
                        {d.map_embed_url && (
                            <ContactItem
                                onClick={() => {
                                    // 1. นำข้อมูลที่อยู่ในฐานข้อมูลมาต่อกันเป็นที่อยู่เต็ม
                                    const fullAddress = [
                                        d.addr_company,
                                        d.addr_house,
                                        d.addr_subdistrict,
                                        d.addr_district,
                                        d.addr_province
                                    ].filter(Boolean).join(" "); // กรองเอาเฉพาะฟิลด์ที่มีข้อมูลมาเว้นวรรคต่อกัน

                                    // 2. สร้างลิงก์สำหรับเปิดใน Google Maps แท็บใหม่ (Search URL)
                                    const mapsSearchUrl = `https://www.google.com/maps/place/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B8%97%E0%B8%B5%E0%B9%80%E0%B8%88%E0%B8%8B%E0%B8%B5+%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9B%E0%B8%AD%E0%B9%80%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99+%E0%B8%88%E0%B9%8D%E0%B8%B2%E0%B8%81%E0%B8%B1%E0%B8%94/@15.2035222,104.8116976,1091m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31168934ea2a73af:0xbc9f5816cefce4be!8m2!3d15.2035222!4d104.8142725!16s%2Fg%2F11xcw87xxz?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D`;

                                    setActivePopup({
                                        type: 'map',
                                        href: mapsSearchUrl,      // ✅ ลิงก์ที่กดแล้วจะเด้งไป Google Maps ตามที่อยู่ที่ระบุใน DB
                                        embedUrl: d.map_embed_url, // สำหรับแสดงผล iframe ในป๊อปอัป
                                        icon: <Map size={28} />,
                                        color: "bg-[#E14B3D]",
                                        title: "แผนที่ตั้งบริษัท",
                                        desc: `ที่ตั้ง: ${fullAddress || "TJC Corporation สำนักงานใหญ่"}`,
                                        actionText: "เปิดใน Google Maps"
                                    });
                                }}
                                label="แผนที่บริษัท"
                                icon={<Map size={24} />}
                                color="bg-[#E14B3D]"
                                delay="0ms"
                            />
                        )}
                        {d.facebook_url && (
                            <ContactItem
                                onClick={() => setActivePopup({
                                    type: 'facebook', href: d.facebook_url,
                                    icon: <SiFacebook size={28} />, color: "bg-[#1877F2]",
                                    title: "Facebook Page",
                                    desc: "เยี่ยมชมหน้าแฟนเพจของเรา เพื่อติดตามข่าวสารและทักแชทสอบถามข้อมูลผ่าน Messenger",
                                    actionText: "เปิด Facebook"
                                })}
                                label="แชทผ่าน Facebook"
                                icon={<SiFacebook size={22} />}
                                color="bg-[#1877F2]"
                                delay="50ms"
                            />
                        )}
                        {d.line_url && (
                            <ContactItem
                                onClick={() => setActivePopup({
                                    type: 'line',
                                    href: d.line_url,
                                    qrCodeUrl: d.line_qr_url,
                                    icon: <SiLine size={30} />, color: "bg-[#06C755]",
                                    title: "LINE Official Account",
                                    desc: d.line_qr_url
                                        ? "สแกน QR Code หรือกดปุ่มด้านล่างเพื่อเพิ่มเพื่อน\nและแชทสอบถามข้อมูลอย่างรวดเร็ว"
                                        : "กดปุ่มด้านล่างเพื่อเพิ่มเพื่อน\nและแชทสอบถามข้อมูลอย่างรวดเร็ว",
                                    actionText: "เปิดแอปพลิเคชัน LINE"
                                })}
                                label="แชทผ่าน LINE"
                                icon={<SiLine size={24} />}
                                color="bg-[#06C755]"
                                delay="100ms"
                            />
                        )}
                        {d.phone && (
                            <ContactItem
                                onClick={() => setActivePopup({
                                    type: 'phone', href: `tel:${d.phone}`,
                                    icon: <PhoneCall size={26} />, color: "bg-[#F7941E]",
                                    title: "ฝ่ายบริการลูกค้า",
                                    desc: `เจ้าหน้าที่พร้อมให้คำปรึกษาและบริการในวันและเวลาทำการ\nเบอร์โทร: ${d.phone}`,
                                    actionText: "โทรออกทันที"
                                })}
                                label="โทรศัพท์ติดต่อ"
                                icon={<PhoneCall size={22} />}
                                color="bg-[#F7941E]"
                                delay="150ms"
                            />
                        )}
                        {d.email && (
                            <ContactItem
                                onClick={() => setActivePopup({
                                    type: 'email', href: `mailto:${d.email}`,
                                    icon: <MailOpen size={26} />, color: "bg-[#4CB0A9]",
                                    title: "ติดต่อผ่านอีเมล",
                                    desc: `ส่งรายละเอียดงาน หรือข้อมูลที่ต้องการประเมินราคามาที่\n${d.email}`,
                                    actionText: "เขียนอีเมล"
                                })}
                                label="ส่งอีเมล"
                                icon={<MailOpen size={22} />}
                                color="bg-[#4CB0A9]"
                                delay="200ms"
                            />
                        )}
                    </div>
                )}

                {/* --- 2. กล่องข้อความต้อนรับ --- */}
                {!isContactOpen && showBubble && (
                    <div className="mb-2 transition-all duration-700 ease-out transform pointer-events-auto">
                        <div className="bg-white/95 backdrop-blur-md border border-zinc-100 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative w-72 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-2 w-2 rounded-full bg-[#DAA520] animate-pulse" />
                                <span className="text-[10px] font-black text-[#DAA520] tracking-widest uppercase">TJC Assistant</span>
                            </div>
                            <p className={`text-zinc-800 font-bold text-sm leading-relaxed transition-all duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}>
                                {messages[messageIndex]}
                            </p>
                            <div className="absolute -bottom-2 right-12 w-5 h-5 bg-white border-r border-b border-zinc-100 rotate-45" />
                        </div>
                    </div>
                )}

                {/* --- 3. ปุ่มหลัก (Toggle) --- */}
                <button
                    onClick={() => setIsContactOpen(!isContactOpen)}
                    className={`
                        group pointer-events-auto relative w-28 h-28 overflow-hidden rounded-full transition-all duration-500 shadow-2xl active:scale-95 flex items-center justify-center
                        ${isContactOpen ? "bg-[#1877F2] rotate-180" : "bg-white border-4 border-white"}
                    `}
                >
                    {isContactOpen ? (
                        <X size={56} className="text-white animate-in zoom-in duration-300" />
                    ) : (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            disablePictureInPicture
                            controlsList="nopictureinpicture"
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                        >
                            <source src="/video/vo002.mp4" type="video/mp4" />
                        </video>
                    )}
                </button>
            </div>
        </>
    );
}