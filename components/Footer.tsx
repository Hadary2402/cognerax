"use client";

import { Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t, dir } = useLanguage();

  return (
    <footer className="bg-legal-dark dark:bg-gray-950 text-white dark:text-gray-100 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className={dir === "rtl" ? "text-right" : ""}>
            <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "flex-row-reverse justify-end" : ""}`}>
              <div className="relative h-10 flex items-center">
                <Image
                  src="/CogneraX-Logo.png"
                  alt="CogneraXAI Logo"
                  width={40}
                  height={40}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
              <h3 className="text-2xl font-bold">
                CogneraX<span className="text-primary-400">AI</span>
              </h3>
            </div>
            <p
              className={`text-gray-400 mb-4 ${
                dir === "rtl" ? "text-right" : ""
              }`}
            >
              {t.footer.tagline}
            </p>
            <div
              className={`flex ${
                dir === "rtl" ? "flex-row-reverse justify-end" : ""
              } gap-4`}
            >
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Sectors Links */}
          <div className={dir === "rtl" ? "text-right" : ""}>
            <h4 className="font-semibold mb-4">{t.footer.sectors}</h4>
            <ul className={`space-y-2 text-gray-400 list-none ${dir === "rtl" ? "text-right !pr-0" : ""}`} style={dir === "rtl" ? { paddingRight: 0 } : undefined}>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <Link
                  href="/nexora"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t.footer.law}
                </Link>
              </li>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <span className="text-gray-500 dark:text-gray-600 cursor-not-allowed">
                  {t.footer.cybersecurity}
                </span>
              </li>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <span className="text-gray-500 dark:text-gray-600 cursor-not-allowed">
                  {t.footer.education}
                </span>
              </li>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <span className="text-gray-500 dark:text-gray-600 cursor-not-allowed">
                  {t.footer.finance}
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className={dir === "rtl" ? "text-right" : ""}>
            <h4 className="font-semibold mb-4">{t.footer.company}</h4>
            <ul className={`space-y-2 text-gray-400 list-none ${dir === "rtl" ? "text-right !pr-0" : ""}`} style={dir === "rtl" ? { paddingRight: 0 } : undefined}>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <Link
                  href="/about-us"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <Link
                  href="/careers"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t.footer.careers}
                </Link>
              </li>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <Link
                  href="/contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className={dir === "rtl" ? "text-right" : ""}>
            <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
            <ul className={`space-y-2 text-gray-400 mb-4 list-none ${dir === "rtl" ? "text-right !pr-0" : ""}`} style={dir === "rtl" ? { paddingRight: 0 } : undefined}>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <Link
                  href="/privacy"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li className={dir === "rtl" ? "pr-0" : ""}>
                <Link
                  href="/terms"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
            <div className={`space-y-2 text-gray-400 text-sm mt-6 ${
              dir === "rtl" ? "text-right" : ""
            }`} style={dir === "rtl" ? { paddingRight: 0 } : undefined}>
              <div className={`flex items-center gap-2 ${
                dir === "rtl" ? "flex-row-reverse justify-end" : ""
              }`}>
                {dir === "rtl" ? (
                  <>
                    <a
                      href="mailto:contact@cogneraxai.com"
                      className="hover:text-primary-400 transition-colors"
                    >
                      contact@cogneraxai.com
                    </a>
                    <Mail size={16} />
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    <a
                      href="mailto:contact@cogneraxai.com"
                      className="hover:text-primary-400 transition-colors"
                    >
                      contact@cogneraxai.com
                    </a>
                  </>
                )}
              </div>
              <div className={`flex items-start gap-2 ${
                dir === "rtl" ? "flex-row-reverse justify-end" : ""
              }`}>
                {dir === "rtl" ? (
                  <>
                    <span>{t.footer.address}</span>
                    <MapPin size={16} className="mt-1" />
                  </>
                ) : (
                  <>
                    <MapPin size={16} className="mt-1" />
                    <span>{t.footer.address}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p className="text-center">
            {dir === "rtl" ? (
              <>
                {t.footer.copyright} &copy; {new Date().getFullYear()} CogneraXAI
              </>
            ) : (
              <>
                &copy; {new Date().getFullYear()} CogneraXAI. {t.footer.copyright}
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
