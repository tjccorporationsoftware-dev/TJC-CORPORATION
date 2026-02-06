'use client';

import React, { useState } from "react"; // 1. เพิ่ม useState
import Navbar from "./componect/Navbar";
import Hero from "./componect/Hero";
import Services from "./componect/Services";
import About from "./componect/About";
import Content from "./componect/Contact";
import Footer from "./componect/Footer";
import Work from "./componect/Work";
import AboutHeader from "./componect/AboutHeader";

import CoreValues from "./componect/CoreValues";
import TeamSection from "./componect/TeamSection";
import CertificationsSection from "./componect/CertificationsSection";
import ReviewsSection from "./componect/ReviewsSection";
import NewsSection from "./componect/NewsSection";
import CustomersCarousel from "./componect/CustomersCarousel";
import QuotationBuilder from "./componect/QuotationBuilder";
import FloatingPotato from "./componect/FloatingPotato";
import WelcomeLoader from "./componect/WelcomeLoader"; // 2. import ตัว Loader เข้ามา

export default function CompanyLandingPage() {
  // 3. สร้าง state เพื่อควบคุมการแสดงผล (เริ่มต้นเป็น true คือกำลังโหลด)
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* 4. ใส่ Loader ไว้บนสุด เช็คว่าถ้า isLoading เป็น true ให้แสดง Loader */}
      {isLoading && (
        <WelcomeLoader onFinished={() => setIsLoading(false)} />
      )}

      {/* 5. ส่วนเนื้อหาหลัก (ซ่อนไว้ก่อน หรือแสดงแต่จะถูก Loader ทับอยู่) */}
      {/* ใช้ className เพื่อทำ Transition ให้เนื้อหาค่อยๆ ปรากฏขึ้นมาเมื่อโหลดเสร็จ */}
      <div
        className={`min-h-screen bg-gray-50 text-slate-900 antialiased transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}
      >
        <FloatingPotato />
        <Navbar />
        <Hero />
        <AboutHeader />
        <TeamSection />
        <CertificationsSection />
        <Services />
        <Work />
        <NewsSection />
        <Content />
        <CustomersCarousel />
        <Footer />
      </div>
    </>
  );
}