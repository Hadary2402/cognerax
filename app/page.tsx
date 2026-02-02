"use client";

import CogneraXHero from "@/components/CogneraXHero";
import SectorModels from "@/components/SectorModels";
import CogneraXAbout from "@/components/CogneraXAbout";
import Newsletter from "@/components/Newsletter";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LanguageThemeToggle from "@/components/LanguageThemeToggle";
import CookieConsent from "@/components/CookieConsent";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { dir } = useLanguage();
  const positionClass = dir === "rtl" ? "bottom-6 left-6" : "bottom-6 right-6";

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <CogneraXHero />
      <SectorModels />
      <CogneraXAbout />
      <Newsletter />
      <FinalCTA />
      <Footer />
      <div className={`fixed ${positionClass} z-50`}>
        <LanguageThemeToggle />
      </div>
      <CookieConsent />
    </main>
  );
}
