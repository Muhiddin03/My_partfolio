import React, { useState } from "react";
import { Education, Workplace, Achievement } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Calendar, Briefcase, Trophy, Image as ImageIcon } from "lucide-react";

interface EducationProps {
  education: Education[];
  workplaces?: Workplace[];
  achievements?: Achievement[];
}

export default function EducationComponent({ education, workplaces = [], achievements = [] }: EducationProps) {
  const [activeTab, setActiveTab] = useState<"tajriba" | "talim" | "yutuqlar">("tajriba");
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  const sortedEdu = [...education].sort((a, b) => parseInt(b.startYear) - parseInt(a.startYear));

  return (
    <section id="education" className="w-full">
      <div className='p-6 md:p-8'>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            TA'LIM VA TAJRIBA
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-text">
            Faoliyat Yo'li
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-brand-bg rounded-xl p-1 border border-brand-border self-start">
          <button
            onClick={() => setActiveTab("tajriba")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "tajriba" ? "bg-white shadow-sm text-brand-primary" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Tajriba
          </button>
          <button
            onClick={() => setActiveTab("talim")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "talim" ? "bg-white shadow-sm text-brand-primary" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Ta'lim
          </button>
          <button
            onClick={() => setActiveTab("yutuqlar")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "yutuqlar" ? "bg-white shadow-sm text-brand-primary" : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Yutuqlar
          </button>
        </div>
      </div>

      {/* Tab content view */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* WORK EXPERIENCES TAB */}
          {activeTab === "tajriba" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workplaces.length > 0 ? (
                workplaces.map((work, idx) => (
                  <motion.div
                    key={work.id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-brand-bg rounded-2xl border border-brand-border p-5 flex flex-col sm:flex-row gap-4 items-start hover:border-brand-primary/50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white border border-brand-border overflow-hidden shrink-0 flex items-center justify-center">
                      {work.imageUrl ? (
                        <img src={work.imageUrl} alt={work.company} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-6 h-6 text-brand-muted" />
                      )}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mb-2">
                        <Calendar className="w-2.5 h-2.5" />
                        {work.duration}
                      </div>
                      <h3 className="text-lg font-bold text-brand-text">{work.company}</h3>
                      <p className="text-brand-primary font-medium text-sm mb-2">{work.role}</p>
                      <p className="text-brand-muted text-xs leading-relaxed">{work.description}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-brand-muted italic bg-brand-bg rounded-xl border border-brand-border">
                  Ish tajribasi ma'lumotlari kiritilmagan.
                </div>
              )}
            </div>
          )}

          {/* EDUCATION TIMELINE TAB */}
          {activeTab === "talim" && (
            <div className="grid grid-cols-1 gap-4">
              {sortedEdu.length > 0 ? (
                sortedEdu.map((edu, idx) => (
                  <div key={edu.id || idx} className="bg-brand-bg rounded-2xl border border-brand-border p-5 flex gap-4 hover:border-brand-primary/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white border border-brand-border flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary mb-2">
                        <Calendar className="w-2.5 h-2.5" />
                        {edu.startYear} — {edu.current ? "Hozirgacha" : edu.endYear}
                      </div>
                      <h3 className="text-lg font-bold text-brand-text">{edu.institution}</h3>
                      <p className="text-brand-primary font-medium text-sm mb-2">{edu.degree}</p>
                      {edu.description && (
                        <p className="text-brand-muted text-xs leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-brand-muted italic bg-brand-bg rounded-xl border border-brand-border">
                  Ta'lim ma'lumotlari kiritilmagan.
                </div>
              )}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "yutuqlar" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.length > 0 ? (
                achievements.map((ach, idx) => (
                  <div key={ach.id || idx} className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden group hover:border-brand-primary/50 transition-colors">
                    {ach.imageUrl && (
                      <div 
                        onClick={() => setSelectedCertificate(ach.imageUrl || null)}
                        className="aspect-video w-full border-b border-brand-border bg-stone-100 relative cursor-pointer overflow-hidden"
                      >
                        <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            Kattalashtirish
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-brand-primary" />
                        {ach.date && <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md">{ach.date}</span>}
                      </div>
                      <h4 className="text-lg font-bold text-brand-text">{ach.title}</h4>
                      <p className="text-brand-muted text-xs mt-2 leading-relaxed">{ach.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-brand-muted italic bg-brand-bg rounded-xl border border-brand-border">
                  Yutuqlar ma'lumotlari kiritilmagan.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedCertificate}
                alt="Certificate"
                className="w-full max-h-[85vh] object-contain rounded-3xl"
              />
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center font-bold transition-colors"
              >
                ×
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
