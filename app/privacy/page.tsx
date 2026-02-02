"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageThemeToggle from "@/components/LanguageThemeToggle";
import Link from "next/link";

const tableOfContents = [
  { id: "introduction", title: "Introduction" },
  { id: "summary", title: "Summary of Key Points" },
  { id: "information-collect", title: "1. What Information Do We Collect?" },
  { id: "process-information", title: "2. How Do We Process Your Information?" },
  { id: "share-information", title: "3. When and With Whom Do We Share Information?" },
  { id: "cookies", title: "4. Do We Use Cookies and Tracking Technologies?" },
  { id: "keep-information", title: "5. How Long Do We Keep Your Information?" },
  { id: "keep-safe", title: "6. How Do We Keep Your Information Safe?" },
  { id: "minors", title: "7. Do We Collect Information From Minors?" },
  { id: "privacy-rights", title: "8. What Are Your Privacy Rights?" },
  { id: "do-not-track", title: "9. Controls for Do-Not-Track Features" },
  { id: "other-regions", title: "10. Do Other Regions Have Specific Privacy Rights?" },
  { id: "updates", title: "11. Do We Make Updates to This Notice?" },
  { id: "contact", title: "12. How Can You Contact Us?" },
  { id: "review-data", title: "13. How Can You Review, Update, or Delete Data?" },
];

export default function PrivacyPolicyPage() {
  const { t, dir } = useLanguage();
  const positionClass = dir === "rtl" ? "bottom-6 left-6" : "bottom-6 right-6";
  const [activeSection, setActiveSection] = useState("");
  const tocContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents
        .map((item) => {
          const element = document.getElementById(item.id);
          if (element) {
            return {
              id: item.id,
              top: element.getBoundingClientRect().top,
            };
          }
          return null;
        })
        .filter(Boolean) as { id: string; top: number }[];

      const current = sections.find(
        (section) => section.top <= 100 && section.top >= -200
      );
      if (current && current.id !== activeSection) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Auto-scroll TOC to keep active section visible
  useEffect(() => {
    if (activeSection && tocContainerRef.current) {
      const activeButton = tocContainerRef.current.querySelector(
        `button[data-section-id="${activeSection}"]`
      ) as HTMLElement;
      
      if (activeButton) {
        const container = tocContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        // Check if button is outside visible area
        const isAboveView = buttonRect.top < containerRect.top;
        const isBelowView = buttonRect.bottom > containerRect.bottom;
        
        if (isAboveView || isBelowView) {
          // Scroll only within the TOC container, not the page
          const scrollTop = activeButton.offsetTop - container.offsetTop - (container.clientHeight / 2) + (activeButton.clientHeight / 2);
          container.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-legal-dark dark:text-white mb-4">
              {t.footer.privacyPolicy}
            </h1>
            <p className="text-xl text-legal-gray dark:text-gray-300">
              {t.privacy.lastUpdated}
            </p>
          </div>

          {/* Content Layout: TOC on left, Terms in center */}
          <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr_256px] gap-8 items-start">
            {/* Table of Contents Sidebar */}
            <aside
              className={`hidden lg:block self-start lg:row-start-1 h-fit ${
                dir === "rtl" ? "lg:col-start-3" : "lg:col-start-1"
              }`}
            >
              <div 
                ref={tocContainerRef}
                className="toc-scrollable sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto"
                style={{ alignSelf: 'flex-start' }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className={`text-sm font-semibold text-legal-dark dark:text-white mb-4 uppercase tracking-wide ${
                      dir === "rtl" ? "text-right" : ""
                    }`}
                  >
                    Table of Contents
                  </h3>
                  <nav
                    className={`space-y-1 ${dir === "rtl" ? "text-right" : ""}`}
                  >
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        data-section-id={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeSection === item.id
                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } ${dir === "rtl" ? "text-right" : ""}`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content - Centered */}
            <div className="lg:col-start-2 lg:row-start-1 w-full self-start m-0">
              <div
                dir="ltr"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 lg:p-10 space-y-8 text-left m-0"
              >
                {/* Introduction */}
                <section id="introduction">
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      This Privacy Notice for <strong>COGNERAX ARTIFICIAL INTELLIGENCE DEVELOPING SERVICES L.L.C</strong> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Visit our website at <strong>https://cogneraxai.com/</strong> or any website of ours that links to this Privacy Notice</li>
                      <li>Engage with us in other related ways, including any sales, marketing, or events</li>
                    </ul>
                    <p>
                      Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <strong>contact@cogneraxai.com</strong>.
                    </p>
                  </div>
                </section>

                {/* Summary of Key Points */}
                <section id="summary">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    SUMMARY OF KEY POINTS
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</li>
                      <li><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
                      <li><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</li>
                      <li><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.</li>
                      <li><strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</li>
                      <li><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</li>
                      <li><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</li>
                      <li><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</li>
                    </ul>
                    <p>
                      Want to learn more about what we do with any information we collect? Review the Privacy Notice in full.
                    </p>
                  </div>
                </section>

                {/* Section 1 */}
                <section id="information-collect">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    1. WHAT INFORMATION DO WE COLLECT?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <div>
                      <h3 className="font-semibold mb-2">Personal information you disclose to us</h3>
                      <p>
                        <strong>In Short:</strong> We collect personal information that you provide to us.
                      </p>
                      <p className="mt-4">
                        We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                      </p>
                      <p className="mt-4">
                        <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>names</li>
                        <li>phone numbers</li>
                        <li>email addresses</li>
                        <li>mailing addresses</li>
                        <li>contact preferences</li>
                      </ul>
                      <p className="mt-4">
                        <strong>Sensitive Information.</strong> We do not process sensitive information.
                      </p>
                      <p className="mt-4">
                        <strong>Google API</strong> Our use of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements.
                      </p>
                      <p className="mt-4">
                        All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="process-information">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    2. HOW DO WE PROCESS YOUR INFORMATION?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
                    </p>
                    <p>
                      We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
                      <li><strong>To send administrative information to you.</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
                      <li><strong>To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="share-information">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties.
                    </p>
                    <p>
                      We may need to share your personal information in the following situations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                      <li><strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). Google Maps uses GPS, Wi-Fi, and cell towers to estimate your location. GPS is accurate to about 20 meters, while Wi-Fi and cell towers help improve accuracy when GPS signals are weak, like indoors. This data helps Google Maps provide directions, but it is not always perfectly precise.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="cookies">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.
                    </p>
                    <p>
                      We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
                    </p>
                    <p>
                      We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.
                    </p>
                    <p>
                      Specific information about how we use such technologies and how you can refuse certain cookies is set out in our <Link href="/how-cognerax-uses-cookies" className="text-primary-600 dark:text-primary-400 hover:underline">Cookie Notice</Link>.
                    </p>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="keep-information">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    5. HOW LONG DO WE KEEP YOUR INFORMATION?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
                    </p>
                    <p>
                      We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
                    </p>
                    <p>
                      When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                    </p>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="keep-safe">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    6. HOW DO WE KEEP YOUR INFORMATION SAFE?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.
                    </p>
                    <p>
                      We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
                    </p>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="minors">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    7. DO WE COLLECT INFORMATION FROM MINORS?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.
                    </p>
                    <p>
                      We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at <strong>contact@cogneraxai.com</strong>.
                    </p>
                  </div>
                </section>

                {/* Section 8 */}
                <section id="privacy-rights">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    8. WHAT ARE YOUR PRIVACY RIGHTS?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
                    </p>
                    <p>
                      <strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
                    </p>
                    <p>
                      However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
                    </p>
                    <p>
                      <strong>Cookies and similar technologies:</strong> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.
                    </p>
                    <p>
                      If you have questions or comments about your privacy rights, you may email us at <strong>contact@cogneraxai.com</strong>.
                    </p>
                  </div>
                </section>

                {/* Section 9 */}
                <section id="do-not-track">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    9. CONTROLS FOR DO-NOT-TRACK FEATURES
                  </h2>
                  <p
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="other-regions">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    10. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> You may have additional rights based on the country you reside in.
                    </p>
                    <div>
                      <h3 className="font-semibold mb-2">Republic of South Africa</h3>
                      <p>
                        At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
                      </p>
                      <p className="mt-4">
                        If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:
                      </p>
                      <p className="mt-2">
                        The Information Regulator (South Africa)<br />
                        General enquiries: <a href="mailto:enquiries@inforegulator.org.za" className="text-primary-600 dark:text-primary-400 hover:underline">enquiries@inforegulator.org.za</a><br />
                        Complaints (complete POPIA/PAIA form 5): <a href="mailto:PAIAComplaints@inforegulator.org.za" className="text-primary-600 dark:text-primary-400 hover:underline">PAIAComplaints@inforegulator.org.za</a> & <a href="mailto:POPIAComplaints@inforegulator.org.za" className="text-primary-600 dark:text-primary-400 hover:underline">POPIAComplaints@inforegulator.org.za</a>
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 11 */}
                <section id="updates">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    11. DO WE MAKE UPDATES TO THIS NOTICE?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  >
                    <p>
                      <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.
                    </p>
                    <p>
                      We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
                    </p>
                  </div>
                </section>

                {/* Section 12 */}
                <section id="contact">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2"
                  >
                    <p>
                      If you have questions or comments about this notice, you may email us at <a href="mailto:contact@cogneraxai.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@cogneraxai.com</a> or contact us by post at:
                    </p>
                    <div className="mt-4">
                      <p><strong>COGNERAX ARTIFICIAL INTELLIGENCE DEVELOPING SERVICES L.L.C</strong></p>
                      <p>Dubai</p>
                      <p>United Arab Emirates</p>
                    </div>
                  </div>
                </section>

                {/* Section 13 */}
                <section id="review-data">
                  <h2
                    className="text-2xl font-bold text-legal-dark dark:text-white mb-4"
                  >
                    13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
                  </h2>
                  <p
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.
                  </p>
                </section>
              </div>

              <div className="mt-8">
                <Link
                  href="/"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <div className={`fixed ${positionClass} z-50`}>
        <LanguageThemeToggle />
      </div>
    </main>
  );
}
