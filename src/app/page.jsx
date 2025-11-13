import React from "react";
import Navbar from "./componect/Navbar";
import Hero from "./componect/Hero";
import Services from "./componect/Services";
import About from "./componect/About";
import Content from "./componect/Contact";
import Footer from "./componect/Footer";
import Work from "./componect/Work";

export default function CompanyLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 antialiased">


      <Navbar />

      <main className="" >
        <Hero />
        <Services />
        <Work />
        <About />
        <Content />
        <Footer />


      </main>
    </div>
  );
}
