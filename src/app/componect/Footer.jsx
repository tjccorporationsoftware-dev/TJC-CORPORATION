"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

  const d = data || {};

  const addressLines = useMemo(() => {
    if (Array.isArray(d.address_lines)) return d.address_lines;
    return [];
  }, [d]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.footer
      id="contact"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="
        relative overflow-hidden
        bg-linear-to-br from-zinc-800 via-zinc-700 to-zinc-800
        border-t border-[#DAA520]/30
      "
    >
      {/* subtle glow (ทอง + ขาว นุ่ม ๆ) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-28 h-72 w-72 rounded-full bg-[#DAA520]/15 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* CONTACT + MAP */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* CONTACT CARD */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-2xl p-5
              bg-zinc-700/60 backdrop-blur-xl
              border border-white/15
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            "
          >
            <h3
              className="
                text-lg md:text-xl font-extrabold
                bg-linear-to-r from-[#DAA520] via-[#DAA520] to-white
                bg-clip-text text-transparent
              "
            >
              {d.heading || "ติดต่อเรา"}
            </h3>

            <p className="mt-1 text-zinc-200 text-sm">
              {d.description || "สอบถามข้อมูล ขอใบเสนอราคา หรือติดต่อทีมงานของเราได้ทุกเวลา"}
            </p>

            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
              {d.email && (
                <a
                  href={`mailto:${d.email}`}
                  className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition"
                >
                  <i className="bx bx-envelope text-[#DAA520] text-xl" />
                  <div>
                    <p className="text-[11px] text-zinc-300">อีเมล</p>
                    <p className="font-semibold text-white break-all">{d.email}</p>
                  </div>
                </a>
              )}

              {d.phone && (
                <Link
                  href={`tel:${String(d.phone).replace(/[^0-9+]/g, "")}`}
                  className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition"
                >
                  <i className="bx bx-phone-call text-[#DAA520] text-xl" />
                  <div>
                    <p className="text-[11px] text-zinc-300">โทรศัพท์</p>
                    <p className="font-semibold text-white">{d.phone}</p>
                  </div>
                </Link>
              )}

              {(d.line_url || d.line_label) && (
                <Link
                  href={d.line_url || "#"}
                  target="_blank"
                  className="flex gap-3 items-start rounded-xl p-3 hover:bg-white/5 transition"
                >
                  {d.line_icon_url ? (
                    <img src={resolveUrl(d.line_icon_url)} className="w-6 h-6 rounded" />
                  ) : (
                    <div className="w-6 h-6 bg-white/20 rounded" />
                  )}
                  <div>
                    <p className="text-[11px] text-zinc-300">Line Official</p>
                    <p className="font-semibold text-white truncate">
                      {d.line_label || "Line"}
                    </p>
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
                <p className="text-[11px] text-zinc-300 mb-1">ที่อยู่</p>
                <p className="text-sm text-white leading-relaxed line-clamp-3">
                  {addressLines.join(" ")}
                </p>
              </div>
            )}
          </motion.div>

          {/* MAP CARD */}
          <motion.div
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="
              rounded-2xl overflow-hidden
              bg-zinc-700/60 backdrop-blur-xl
              border border-white/15
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            "
          >
            <div className="px-4 py-3 border-b border-white/15 flex justify-between items-center">
              <div className="text-white font-semibold text-sm flex items-center gap-2">
                <i className="bx bx-map-alt text-[#DAA520] text-lg" />
                {d.map_title || "แผนที่"}
              </div>
              {d.map_open_url && (
                <a
                  href={d.map_open_url}
                  target="_blank"
                  className="text-xs text-[#DAA520] hover:text-[#DAA520]/80 transition"
                >
                  เปิดแผนที่ →
                </a>
              )}
            </div>

            {d.map_embed_url ? (
              <iframe
                src={d.map_embed_url}
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
              />
            ) : (
              <div className="p-5 text-sm text-zinc-200">ยังไม่ได้ตั้งค่าแผนที่</div>
            )}
          </motion.div>
        </div>

        {/* divider */}
        <div className="mt-8 h-px bg-linear-to-r from-transparent via-[#DAA520]/30 to-transparent" />

        {/* 🔽 ส่วนล่างสุด */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="TJC" className="w-9 h-9 object-contain bg-white rounded-3xl " />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">TJC Corporation</p>
              <p className="text-xs text-zinc-300">
                © {new Date().getFullYear()} TJC Corporation. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a href="/#about" className="text-zinc-200 hover:text-[#DAA520] transition">
              เกี่ยวกับเรา
            </a>
            <span className="text-zinc-500">•</span>
            <a href="/#services" className="text-zinc-200 hover:text-[#DAA520] transition">
              บริการ
            </a>
            <span className="text-zinc-500">•</span>
            <a href="/#contact" className="text-zinc-200 hover:text-[#DAA520] transition">
              ติดต่อ
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}