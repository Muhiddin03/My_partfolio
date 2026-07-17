import React, { useState } from "react";
import { Profile } from "../types";
import { Send, Mail, ExternalLink, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AboutProps {
  profile: Profile;
  projectsCount: number;
  skillsCount: number;
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export default function About({
  profile,
  projectsCount,
  skillsCount,
  onContactClick,
  onProjectsClick,
}: AboutProps) {
  const [showBio, setShowBio] = useState(false);

  return (
    <section id="about" className="bento-card overflow-hidden group shrink-0">
      <div className="p-5 space-y-5">
        
        {/* Profile Image & Status */}
        <div className="flex flex-col items-center text-center gap-3">
          <AnimatePresence mode="wait">
            {!showBio && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden shadow-lg border-2 border-brand-primary/20 group-hover:shadow-brand-primary/30 transition-shadow duration-500"
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-bg flex items-center justify-center">
                    <span className="text-4xl font-bold text-brand-primary">
                      {(profile.name || "M").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className="flex flex-col items-center justify-center space-y-1 w-full cursor-pointer hover:bg-brand-bg/60 p-2 rounded-xl transition-colors select-none"
            onClick={() => setShowBio(!showBio)}
            title="Ma'lumotni o'qish uchun bosing"
          >
             <motion.h1
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-xl font-bold tracking-tight text-brand-text leading-tight"
             >
               {profile.name || "Ismingiz Familiyangiz"}
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-brand-primary font-medium text-xs text-center"
             >
               {profile.title || "Kasbingiz nomi"}
             </motion.p>
             <span className="text-[10px] text-brand-muted italic mt-1">{showBio ? "Yopish uchun bosing" : "Batafsil..."}</span>
          </div>
        </div>

        {/* Bio */}
        <AnimatePresence mode="wait">
          {showBio && (
            <motion.div
              initial={{ opacity: 0, y: 50, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mb-6"
            >
              <p className="text-brand-muted text-[13px] leading-relaxed text-center py-4 px-2">
                {profile.bio || "Qisqacha ma'lumot."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-brand-border">
          <div className="text-center group/stat cursor-pointer" onClick={onProjectsClick}>
            <p className="text-xl font-black text-brand-text group-hover/stat:text-brand-primary transition-colors">{projectsCount || 0}</p>
            <p className="text-[9px] uppercase font-bold text-brand-muted mt-1 tracking-wider">Loyiha</p>
          </div>
          <div className="text-center border-l border-brand-border group/stat cursor-pointer">
            <p className="text-xl font-black text-brand-text group-hover/stat:text-brand-primary transition-colors">{profile.experienceYears || 3}+</p>
            <p className="text-[9px] uppercase font-bold text-brand-muted mt-1 tracking-wider">Tajriba</p>
          </div>
          <div className="text-center border-l border-brand-border group/stat cursor-pointer">
            <p className="text-xl font-black text-brand-text group-hover/stat:text-brand-primary transition-colors">{skillsCount || 0}</p>
            <p className="text-[9px] uppercase font-bold text-brand-muted mt-1 tracking-wider">Ko'nikma</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onContactClick}
            className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-primary/25"
          >
            Bog'lanish <Send className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex gap-2">
            {profile.telegram && (
              <a href={profile.telegram} target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl bg-brand-bg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary flex items-center justify-center transition-colors border border-brand-border">
                <Send className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl bg-brand-bg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary flex items-center justify-center transition-colors border border-brand-border">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl bg-brand-bg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary flex items-center justify-center transition-colors border border-brand-border">
                <FileText className="w-4 h-4" />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex-1 py-2.5 rounded-xl bg-brand-bg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary flex items-center justify-center transition-colors border border-brand-border">
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
