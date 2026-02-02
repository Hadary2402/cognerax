"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, dir } = useLanguage();
  const pathname = usePathname();
  const isNexoraPage = pathname === "/nexora";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-800/90 backdrop-blur-md shadow-md shadow-gray-900 py-2"
          : "bg-gray-800/90 backdrop-blur-md py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`grid grid-cols-3 items-center transition-all duration-300 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Left side: Logo */}
          <div className="flex items-center">
            <Link href="/" className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <div className={`relative transition-all duration-300 flex items-center ${
                isScrolled ? "h-8 w-8" : "h-10 w-10"
              } flex-shrink-0`}>
                <Image
                  src="/CogneraX-Logo.png"
                  alt="CogneraXAI Logo"
                  width={isScrolled ? 32 : 40}
                  height={isScrolled ? 32 : 40}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <span
                className={`font-bold transition-all duration-300 text-white font-sans ${
                  isScrolled ? "text-xl" : "text-2xl"
                }`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                CogneraX
                <span
                  className={
                    isScrolled
                      ? "text-primary-400"
                      : "text-primary-300"
                  }
                >
                  AI
                </span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Menu Items */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className={`flex items-center ${
                dir === "rtl" ? "flex-row-reverse" : ""
              } ${isNexoraPage ? "gap-8" : "gap-10"}`}
            >
              {isNexoraPage ? (
                <>
                  {/* Order: FAQ first, Features second - will be reversed in RTL to show Features → FAQ */}
                  <Link
                    href="/nexora#faq"
                    className={`nav-link transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-300 hover:text-primary-400 text-sm"
                        : "text-white hover:text-primary-400 text-base"
                    }`}
                  >
                    {t.nav.faq}
                  </Link>
                  <Link
                    href="/nexora#features"
                    className={`nav-link transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-300 hover:text-primary-400 text-sm"
                        : "text-white hover:text-primary-400 text-base"
                    }`}
                  >
                    {t.nav.features}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/contact"
                    className={`nav-link transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-300 hover:text-primary-400 text-sm"
                        : "text-white hover:text-primary-400 text-base"
                    }`}
                  >
                    {t.nav.contactUs}
                  </Link>
                  <Link
                    href="/#about"
                    className={`nav-link transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-300 hover:text-primary-400 text-sm"
                        : "text-white hover:text-primary-400 text-base"
                    }`}
                  >
                    {t.nav.whyUs}
                  </Link>
                  <Link
                    href="/about-us"
                    className={`nav-link transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-300 hover:text-primary-400 text-sm"
                        : "text-white hover:text-primary-400 text-base"
                    }`}
                  >
                    {t.nav.aboutUs}
                  </Link>
                  <Link
                    href="/#models"
                    className={`nav-link transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-300 hover:text-primary-400 text-sm"
                        : "text-white hover:text-primary-400 text-base"
                    }`}
                  >
                    {t.nav.ourAIModels}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right side: Request Demo Button */}
          <div className="hidden md:flex items-center justify-end">
            <Link
              href="/request-demo"
              className={`btn-primary transition-all duration-300 ${
                isScrolled ? "py-2 px-4 text-sm" : "py-3 px-6"
              }`}
            >
              {t.nav.requestDemo}
            </Link>
          </div>

          {/* Mobile Menu Button - far left in Arabic, far right in English */}
          <div className={`md:hidden absolute ${dir === "rtl" ? "left-4 sm:left-6" : "right-4 sm:right-6"} top-1/2 -translate-y-1/2`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden border-t border-gray-700 transition-all duration-300 ${
            isScrolled
              ? "bg-gray-800/90 backdrop-blur-md"
              : "bg-gray-800/80 backdrop-blur-sm"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {isNexoraPage ? (
              <>
                {/* Mobile menu: FAQ first, Features second - matches RTL order */}
                <Link
                  href="/nexora#faq"
                  className="block py-2 text-gray-300 hover:text-primary-400 text-center"
                >
                  {t.nav.faq}
                </Link>
                <Link
                  href="/nexora#features"
                  className="block py-2 text-gray-300 hover:text-primary-400 text-center"
                >
                  {t.nav.features}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/contact"
                  className="block py-2 text-gray-300 hover:text-primary-400 text-center"
                >
                  {t.nav.contactUs}
                </Link>
                <Link
                  href="/#about"
                  className="block py-2 text-gray-300 hover:text-primary-400 text-center"
                >
                  {t.nav.whyUs}
                </Link>
                <Link
                  href="/about-us"
                  className="block py-2 text-gray-300 hover:text-primary-400 text-center"
                >
                  {t.nav.aboutUs}
                </Link>
                <Link
                  href="/#models"
                  className="block py-2 text-gray-300 hover:text-primary-400 text-center"
                >
                  {t.nav.ourAIModels}
                </Link>
              </>
            )}
            <Link
              href="/request-demo"
              className="btn-primary w-full mt-4 text-center block"
            >
              {t.nav.requestDemo}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
