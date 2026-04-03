"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function resolveUrl(u) {
  if (!u) return "";
  if (u.startsWith("/uploads/") || u.startsWith("uploads/")) {
    const cleanPath = u.startsWith("/") ? u : `/${u}`;
    return `${API_BASE}${cleanPath}`;
  }
  return u;
}

export default function FooterContact() {
  const [data, setData] = useState(null);

  // Refs สำหรับการทำ Scroll Animation แทน Framer Motion
  const cardLeftRef = useRef(null);
  const cardRightRef = useRef(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/site/contact`, { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        setData(json?.data || null);
      } catch {
        if (!alive) return;
        setData(null);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  // IntersectionObserver สำหรับ Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-5");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 } // เทียบเท่า amount: 0.2 ใน motion
    );

    if (cardLeftRef.current) observer.observe(cardLeftRef.current);
    if (cardRightRef.current) observer.observe(cardRightRef.current);

    return () => observer.disconnect();
  }, [data]);

  const d = data || {};
  const addressLines = useMemo(() => Array.isArray(d.address_lines) ? d.address_lines : [], [d]);

  const addressLabels = [
    "ชื่อบริษัท:",
    "ที่อยู่:",
    "ตำบล:",
    "อำเภอ:",
    "จังหวัด:",
    "เลขผู้เสียภาษี:"
  ];

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-linear-to-br from-zinc-800 via-zinc-700 to-zinc-800 border-t border-[#DAA520]/30"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-28 h-72 w-72 rounded-full bg-[#DAA520]/15 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-6">

          {/* CONTACT INFO CARD */}
          <div
            ref={cardLeftRef}
            className="opacity-0 translate-y-5 transition-all duration-700 ease-out rounded-2xl p-5 bg-zinc-700/60 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)] h-full"
          >
            <h3 className="text-[20px] md:text-[25px] font-extrabold bg-linear-to-r from-[#DAA520] via-[#DAA520] to-white bg-clip-text text-transparent">
              {d.heading || "ติดต่อเรา"}
            </h3>
            <p className="mt-1 text-zinc-200 text-xl">
              {d.description || "สอบถามข้อมูล ขอใบเสนอราคา หรือติดต่อทีมงานของเราได้ทุกเวลา"}
            </p>

            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
              {d.email && (
                <a href={`mailto:${d.email}`} className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition">
                  <i className="bx bx-envelope text-[#DAA520] text-xl" />
                  <div>
                    <p className="text-[11px] text-zinc-300">อีเมล</p>
                    <p className="font-semibold text-white break-all">{d.email}</p>
                  </div>
                </a>
              )}
              {d.phone && (
                <Link href={`tel:${String(d.phone).replace(/[^0-9+]/g, "")}`} className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition">
                  <i className="bx bx-phone-call text-[#DAA520] text-xl" />
                  <div>
                    <p className="text-[11px] text-zinc-300">โทรศัพท์</p>
                    <p className="font-semibold text-white">{d.phone}</p>
                  </div>
                </Link>
              )}
              {(d.line_url || d.line_label) && (
                <Link href={d.line_url || "#"} target="_blank" className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition">
                  {d.line_icon_url ? <img src={resolveUrl(d.line_icon_url)} className="w-6 h-6 rounded" alt="Line" /> : <i className="bx bxl-line text-[#DAA520] text-xl" />}
                  <div>
                    <p className="text-[11px] text-zinc-300">Line Official</p>
                    <p className="font-semibold text-white truncate">{d.line_label || "Line"}</p>
                  </div>
                </Link>
              )}
              {/* ✅ เพิ่มส่วน Facebook เข้ามา */}
              {(d.facebook_url || d.facebook_label) && (
                <Link href={d.facebook_url || "#"} target="_blank" className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition">
                  <i className="bx bxl-facebook-circle text-[#DAA520] text-xl" />
                  <div>
                    <p className="text-[11px] text-zinc-300">Facebook Page</p>
                    <p className="font-semibold text-white truncate">{d.facebook_label || "Facebook"}</p>
                  </div>
                </Link>
              )}
              {d.open_hours && (
                <div className="flex gap-3 items-start rounded-xl p-3">
                  <i className="bx bx-time text-[#DAA520] text-xl" />
                  <div>
                    <p className="text-[11px] text-zinc-300">เวลาทำการ</p>
                    <p className="font-semibold text-white">{d.open_hours}</p>
                  </div>
                </div>
              )}
            </div>

            {addressLines.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-zinc-800/60 border border-white/10">
                <p className="text-[15px] text-zinc-300 mb-2 font-semibold">ข้อมูลที่อยู่ & ใบกำกับภาษี</p>
                <div className="text-sm text-white flex flex-col gap-1.5">
                  {addressLines.map((line, i) => {
                    const label = addressLabels[i];
                    return (
                      <div key={i} className="flex flex-col sm:flex-row sm:gap-2 leading-snug">
                        {label && (
                          <span className="text-zinc-400 sm:w-28 shrink-0 font-medium">
                            {label}
                          </span>
                        )}
                        <span className="text-white font-light">
                          {line}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* MAP CARD */}
          <div
            ref={cardRightRef}
            className="
              opacity-0 translate-y-5 transition-all duration-700 ease-out delay-100
              rounded-2xl overflow-hidden
              bg-zinc-700/60 backdrop-blur-xl
              border border-white/15
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              h-full flex flex-col
            "
          >
            <div className="px-4 py-3 border-b border-white/15 flex justify-between items-center shrink-0">
              <div className="text-white font-semibold text-sm flex items-center gap-2">
                <i className="bx bx-map-alt text-[#DAA520] text-lg" />
                {d.map_title || "แผนที่"}
              </div>
              {d.map_open_url && (
                <a href={d.map_open_url} target="_blank" rel="noreferrer" className="text-xs text-[#DAA520] hover:text-[#DAA520]/80 transition">
                  เปิดแผนที่ →
                </a>
              )}
            </div>
            <div className="flex-1 relative min-h-75">
              {d.map_embed_url ? (
                <iframe
                  src={d.map_embed_url}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Google Map"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-5 text-sm text-zinc-200">
                  ยังไม่ได้ตั้งค่าแผนที่
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 h-px bg-linear-to-r from-transparent via-[#DAA520]/30 to-transparent" />

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="TJC" className="w-9 h-9 object-contain bg-white rounded-3xl " />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">TJC Corporation</p>
              <p className="text-xs text-zinc-300">© {new Date().getFullYear()} TJC Corporation. All rights reserved.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="/#about" className="text-zinc-200 hover:text-[#DAA520] transition">เกี่ยวกับเรา</a>
            <span className="text-zinc-500">•</span>
            <a href="/#services" className="text-zinc-200 hover:text-[#DAA520] transition">บริการ</a>
            <span className="text-zinc-500">•</span>
            <a href="/#contact" className="text-zinc-200 hover:text-[#DAA520] transition">ติดต่อ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}