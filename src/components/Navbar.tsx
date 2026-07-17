import React, { useState, useRef } from "react";
import { User, Briefcase, Cpu, Folder, GraduationCap, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoggedIn: boolean;
}

export default function Navbar({
  activeSection,
  setActiveSection,
  isAdminOpen,
  setIsAdminOpen,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const menuItems = [
    { id: "services", label: "Xizmatlar", icon: Briefcase },
    { id: "projects", label: "Loyihalar", icon: Folder },
    { id: "education", label: "Ta'lim", icon: GraduationCap },
    { id: "contact", label: "Bog'lanish", icon: Mail },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsAdminOpen(false);
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 1500) {
      clickCountRef.current += 1;
      if (clickCountRef.current >= 3) {
        setIsAdminOpen(!isAdminOpen);
        clickCountRef.current = 0;
      }
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;

    if (isAdminOpen) {
      setIsAdminOpen(false);
    }
  };

  return (
    <nav className="w-full bg-brand-card border-b border-brand-border px-6 md:px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between w-full gap-4">
        
        {/* Logo / Admin Trigger */}
        <div 
          onClick={handleLogoClick}
          className="cursor-pointer font-black text-lg md:text-xl text-brand-text tracking-tight shrink-0 whitespace-nowrap"
          title="Admin panel: 3 marta bosing"
        >
          Muhiddin Karimjonov<span className="text-brand-primary">.</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-end flex-1 gap-2 xl:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id && !isAdminOpen;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? "text-brand-primary bg-brand-primary/10 shadow-sm" 
                    : "text-brand-muted hover:text-brand-text hover:bg-brand-bg"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : ""}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbarActiveIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-brand-bg text-brand-primary rounded-xl cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden mt-4 grid grid-cols-2 gap-2 overflow-hidden"
          >
            {menuItems.map((item) => {
              const isActive = activeSection === item.id && !isAdminOpen;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-bold shadow-inner border border-brand-primary/20"
                      : "bg-brand-bg text-brand-muted hover:text-brand-text"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
