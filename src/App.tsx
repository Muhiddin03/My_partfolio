import React, { useState, useEffect } from "react";
import { PortfolioData } from "./types";
import { fetchPortfolio } from "./lib/api";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Services from "./components/Services";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import EducationComponent from "./components/Education";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import Intro from "./components/Intro";
import { motion, AnimatePresence } from "motion/react";
import { Settings } from "lucide-react";

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  // Removed auto-login logic per user request

  // Fetch portfolio details from the custom server backend
  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPortfolio();
      setPortfolioData(data);
    } catch (error) {
      console.error("Portfolio ma'lumotlarini yuklashda xatolik:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-spy scroll for navbar highlight
  useEffect(() => {
    const handleScroll = () => {
      if (isAdminOpen) return;

      const sections = ["about", "services", "skills", "projects", "education", "contact"];
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdminOpen]);

  // Loading animation state view
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-brand-text">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-black/5"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="font-sans text-xs text-brand-primary animate-pulse tracking-[0.2em] font-bold">
            PORTFOLIO YUKLANMOQDA...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-brand-text p-4">
        <div className="text-center space-y-4 max-w-md p-8 bento-card">
          <p className="text-brand-primary font-serif italic text-lg font-bold">Ma'lumotlarni yuklab bo'lmadi.</p>
          <p className="text-xs text-brand-muted leading-relaxed font-normal">
            Kechirasiz, portfolio ma'lumotlarini serverdan olishda muammo yuz berdi. Iltimos sahifani yangilab qayta urinib ko'ring.
          </p>
          <button
            onClick={loadPortfolio}
            className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-light text-white rounded-full font-bold transition-all text-xs uppercase tracking-widest cursor-pointer shadow-md"
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  const handleContactClick = () => {
    setActiveSection("contact");
    const contactSec = document.getElementById("contact");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProjectsClick = () => {
    setActiveSection("projects");
    const projSec = document.getElementById("projects");
    if (projSec) {
      projSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/20 selection:text-brand-primary antialiased relative flex flex-col lg:overflow-hidden">
      
      <AnimatePresence>
        {showIntro && !isLoading && (
          <Intro 
            profile={portfolioData?.profile} 
            onComplete={() => setShowIntro(false)} 
          />
        )}
      </AnimatePresence>

      {/* Animated Ambient Background for Vibrant SaaS Style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-primary/10 blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -60, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-pink-500/10 blur-[150px]"
        />
      </div>

      <AnimatePresence mode="wait">
        {isAdminOpen ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full p-4 md:p-8 z-10 overflow-y-auto relative"
          >
            <div className="w-full h-full">
              <AdminPanel
                portfolioData={portfolioData}
                setPortfolioData={setPortfolioData}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                token={token}
                setToken={setToken}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row w-full h-full lg:h-screen z-10 p-3 md:p-6 gap-4 md:gap-6 min-h-0 relative"
          >
            {/* LEFT COLUMN - Sticky Profile Hero & Skills */}
            <aside className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col gap-4 min-h-0 overflow-y-auto lg:overflow-hidden hide-scrollbar">
              <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-4 pb-4 lg:pb-0">
                <About
                  profile={portfolioData.profile}
                  projectsCount={portfolioData.projects.length}
                  skillsCount={portfolioData.skills.length}
                  onContactClick={() => setActiveSection("contact")}
                  onProjectsClick={() => setActiveSection("projects")}
                />
                
                <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-sm shrink-0">
                  <h3 className="text-xs font-bold text-brand-text mb-3 uppercase tracking-wider">Texnik Ko'nikmalar</h3>
                  <Skills skills={portfolioData.skills} />
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN - Main Content Area */}
            <main className="flex-1 flex flex-col bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-sm min-h-0 min-w-0">
              {/* Top Navbar */}
              <Navbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isAdminOpen={isAdminOpen}
                setIsAdminOpen={setIsAdminOpen}
                isLoggedIn={isLoggedIn}
              />

              {/* Dynamic Content Rendering */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    {activeSection === "services" && <Services services={portfolioData.services} />}
                    {activeSection === "projects" && <Projects projects={portfolioData.projects} />}
                    {activeSection === "education" && (
                      <EducationComponent 
                        education={portfolioData.education} 
                        workplaces={portfolioData.workplaces}
                        achievements={portfolioData.achievements}
                      />
                    )}
                    {activeSection === "contact" && <Contact profile={portfolioData.profile} />}
                    {activeSection === "about" && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                          <span className="text-3xl">👋</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Xush kelibsiz!</h2>
                        <p className="text-brand-muted max-w-sm mx-auto text-sm">
                          Bu yerda mening faoliyatim va loyihalarim bilan tanishishingiz mumkin. Yuqoridagi menyudan o'zingizga kerakli bo'limni tanlang.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}
