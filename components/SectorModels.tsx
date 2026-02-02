"use client";

import { useState } from "react";
import {
  Scale,
  GraduationCap,
  DollarSign,
  Shield,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Bot,
  Zap,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

// Card configuration (icons, status, links - these don't change with language)
const modelsConfig = [
  { icon: Scale, key: "nexora", status: "available", link: "/nexora" },
  { icon: Shield, key: "cybersecurity", status: "coming-soon", link: "#" },
  { icon: GraduationCap, key: "education", status: "coming-soon", link: "#" },
  { icon: DollarSign, key: "finance", status: "coming-soon", link: "#" },
];

const automationConfig = [
  { icon: Bot, key: "chatbots", status: "available", link: "/contact" },
  {
    icon: Zap,
    key: "processAutomation",
    status: "available",
    link: "/contact",
  },
  {
    icon: Settings,
    key: "customAutomation",
    status: "available",
    link: "/contact",
  },
];

export default function SectorModels() {
  const { t, dir } = useLanguage();
  const [activeSection, setActiveSection] = useState<"models" | "automation">(
    "models"
  );

  // Build cards from config and translations
  const models = modelsConfig.map((config) => ({
    ...config,
    ...t.cognerax.models.cards[
      config.key as keyof typeof t.cognerax.models.cards
    ],
  }));

  const automationServices = automationConfig.map((config) => ({
    ...config,
    ...t.cognerax.automation.cards[
      config.key as keyof typeof t.cognerax.automation.cards
    ],
  }));

  const currentCards = activeSection === "models" ? models : automationServices;
  const currentTitle =
    activeSection === "models"
      ? t.cognerax.models.title
      : t.cognerax.automation.title;
  const currentSubtitle =
    activeSection === "models"
      ? t.cognerax.models.subtitle
      : t.cognerax.automation.subtitle;

  const nextSection = () => {
    setActiveSection(activeSection === "models" ? "automation" : "models");
  };

  const prevSection = () => {
    setActiveSection(activeSection === "models" ? "automation" : "models");
  };

  return (
    <section
      id="models"
      className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300"
    >
      <div className="section-container">
        {/* Section Header with Navigation */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={prevSection}
              className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors ${
                dir === "rtl" ? "" : ""
              }`}
              aria-label="Previous section"
            >
              <ChevronLeft
                className={`text-legal-dark dark:text-white ${
                  dir === "rtl" ? "rotate-180" : ""
                }`}
                size={24}
              />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveSection("models")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeSection === "models"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-legal-gray dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {t.cognerax.models.title}
              </button>
              <button
                onClick={() => setActiveSection("automation")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeSection === "automation"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-legal-gray dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {t.cognerax.automation.title}
              </button>
            </div>

            <button
              onClick={nextSection}
              className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors ${
                dir === "rtl" ? "" : ""
              }`}
              aria-label="Next section"
            >
              <ChevronRight
                className={`text-legal-dark dark:text-white ${
                  dir === "rtl" ? "rotate-180" : ""
                }`}
                size={24}
              />
            </button>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-legal-dark dark:text-white">
            {currentTitle}
          </h2>
          <p className="text-xl text-legal-gray dark:text-gray-300 max-w-3xl mx-auto">
            {currentSubtitle}
          </p>
        </div>

        {/* Cards Grid - Shows 4 cards at a time */}
        <div
          className={`grid gap-8 justify-items-center ${
            activeSection === "automation"
              ? "md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
              : "md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
          }`}
        >
          {currentCards.map((item, index) => {
            const Icon = item.icon;
            const isAvailable = item.status === "available";

            return (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800 transition-all duration-300 flex flex-col h-full ${
                  isAvailable
                    ? "border-2 border-primary-200 dark:border-primary-800"
                    : "border border-gray-200 dark:border-gray-700"
                } ${dir === "rtl" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`flex items-center justify-between mb-4 ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon - appears on right in RTL, left in LTR */}
                  <div
                    className={`bg-primary-100 dark:bg-gray-700 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      dir === "rtl" ? "ml-4" : "mr-4"
                    }`}
                  >
                    <Icon
                      className="text-primary-600 dark:text-primary-400"
                      size={32}
                    />
                  </div>
                  {/* Status badge - appears on left in RTL, right in LTR */}
                  {isAvailable ? (
                    <span
                      className={`px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full flex-shrink-0 ${
                        dir === "rtl" ? "text-right" : ""
                      }`}
                    >
                      {activeSection === "models"
                        ? t.cognerax.models.available
                        : t.cognerax.automation.available}
                    </span>
                  ) : (
                    <span
                      className={`px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full flex-shrink-0 ${
                        dir === "rtl" ? "text-right" : ""
                      }`}
                    >
                      {activeSection === "models"
                        ? t.cognerax.models.comingSoon
                        : t.cognerax.automation.comingSoon}
                    </span>
                  )}
                </div>

                <h3
                  className={`text-2xl font-bold text-legal-dark dark:text-white mb-2 ${
                    !isAvailable ? "blur-sm select-none" : ""
                  }`}
                >
                  {item.title || item.sector}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                  {item.sector}
                </p>
                <p className="text-legal-gray dark:text-gray-300 mb-6">
                  {item.description}
                </p>

                <div
                  className={`space-y-2 mb-6 flex-grow ${
                    dir === "rtl" ? "text-right" : ""
                  }`}
                >
                  {item.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center ${
                        dir === "rtl" ? "flex-row-reverse justify-end" : ""
                      } gap-2`}
                    >
                      <CheckCircle
                        size={16}
                        className="text-primary-600 dark:text-primary-400 flex-shrink-0"
                      />
                      <span className="text-sm text-legal-gray dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {isAvailable ? (
                    <Link
                      href={item.link}
                      className={`btn-primary w-full text-center inline-flex items-center justify-center gap-2 ${
                        dir === "rtl" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {activeSection === "models"
                        ? `${t.cognerax.models.exploreButton} ${item.title}`
                        : t.cognerax.automation.learnMore}
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full px-4 py-2 text-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      {activeSection === "models"
                        ? t.cognerax.models.comingSoon
                        : t.cognerax.automation.comingSoon}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
