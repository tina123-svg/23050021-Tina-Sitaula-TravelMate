import React from "react";
import Header from "../../layout/Header";
import Hero from "./Hero";
import FeaturedPackages from "./FeaturedPackages";
import Footer from "../../layout/Footer";
import { WhyChooseTravelMate } from "./WhyChoose";
import CTA from "./CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Hero />
      <FeaturedPackages />
      <WhyChooseTravelMate />
      <CTA />
      <Footer />
    </div>
  );
}