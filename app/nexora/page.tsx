"use client";

import Hero from "@/components/Hero";
import KeyFeatures from "@/components/KeyFeatures";
import ProblemSolution from "@/components/ProblemSolution";
import UseCases from "@/components/UseCases";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import DashboardPreview from "@/components/DashboardPreview";
import SecurityCompliance from "@/components/SecurityCompliance";
import Integrations from "@/components/Integrations";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LanguageThemeToggle from "@/components/LanguageThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NexoraPage() {
  const { dir } = useLanguage();
  const positionClass = dir === "rtl" ? "bottom-6 left-6" : "bottom-6 right-6";

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Hero />
      <KeyFeatures />
      <ProblemSolution />
      <UseCases />
      <Benefits />
      <HowItWorks />
      <DashboardPreview />
      <SecurityCompliance />
      <Integrations />
      <FAQ />
      <FinalCTA />
      <Footer />
      <div className={`fixed ${positionClass} z-50`}>
        <LanguageThemeToggle />
      </div>
    </main>
  );
}

