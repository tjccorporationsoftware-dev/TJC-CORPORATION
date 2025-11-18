import React from "react";
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




export default function CompanyLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 antialiased">


      <Navbar />

      <main className="  " >
        <Hero />
        <AboutHeader />
        <CoreValues />
        <TeamSection />
        <CertificationsSection />
        <Services />
        <Work />
        <NewsSection />
        <Content />
        <CustomersCarousel />
        {/* <ReviewsSection /> */}
        <Footer />


      </main>
    </div>
  );
}
