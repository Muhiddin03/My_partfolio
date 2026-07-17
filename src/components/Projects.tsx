import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Play, Eye, Search, X, FileVideo, Image as ImageIcon, Folder } from "lucide-react";

interface ProjectsProps {
  projects: Project[];
}

function ProjectSlideshow({ urls, title }: { urls: string[]; title: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!urls || urls.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % urls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [urls]);

  if (!urls || urls.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-brand-bg text-brand-muted">
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={urls[index]}
          alt={`${title} - ${index + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      {urls.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
          {urls.map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                i === index ? "bg-white w-2" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const [activeMediaProject, setActiveMediaProject] = useState<Project | null>(null);

  // Show max 4 projects in Bento for cleaner look, they can view more in modal if needed.
  const displayProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="w-full">
      <div className='p-6 md:p-8'>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2">
              <Folder className="w-3.5 h-3.5" />
              PORTFOLIO
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-text">
              Amaliy Loyihalar
            </h2>
          </div>
        </div>

        {/* Bento Grid inside Bento block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayProjects.map((project, index) => {
            const hasMultipleImages = project.imageUrls && project.imageUrls.length > 0;
            const displayUrls = hasMultipleImages ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
            const isLarge = index === 0 || index === 3; // make 1st and 4th slightly bigger in span

            return (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-bg transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 ${isLarge ? 'sm:col-span-2 sm:row-span-2' : ''}`}
              >
                <div className={`relative ${isLarge ? 'h-64' : 'h-48'} w-full overflow-hidden`}>
                  {displayUrls && displayUrls.length > 0 ? (
                    <ProjectSlideshow urls={displayUrls} title={project.title} />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center bg-stone-100">
                       <ImageIcon className="w-10 h-10 text-stone-300" />
                     </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-1">{project.date}</p>
                    <h3 className="text-lg font-bold leading-tight">{project.title}</h3>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] uppercase font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                     onClick={() => setActiveMediaProject(project)}
                     className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-brand-primary"
                  >
                     <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {activeMediaProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-bg/50">
                <h4 className="font-bold text-brand-text flex items-center gap-2">
                  {activeMediaProject.title}
                </h4>
                <button
                  onClick={() => setActiveMediaProject(null)}
                  className="p-1.5 rounded-full bg-brand-border/50 hover:bg-brand-border text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-stone-900 flex items-center justify-center flex-grow overflow-hidden aspect-video">
                {activeMediaProject.videoUrl ? (
                  <video
                    src={activeMediaProject.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : activeMediaProject.imageUrls && activeMediaProject.imageUrls.length > 0 ? (
                  <div className="w-full h-full">
                    <ProjectSlideshow urls={activeMediaProject.imageUrls} title={activeMediaProject.title} />
                  </div>
                ) : activeMediaProject.imageUrl ? (
                  <img
                    src={activeMediaProject.imageUrl}
                    alt={activeMediaProject.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-brand-muted p-8 text-center flex flex-col items-center justify-center bg-brand-bg w-full h-full">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span>Media topilmadi</span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-brand-card space-y-4 overflow-y-auto">
                <p className="text-sm text-brand-muted leading-relaxed">
                  {activeMediaProject.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeMediaProject.tags.map(t => (
                    <span key={t} className="bg-brand-bg border border-brand-border px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-brand-muted">
                      {t}
                    </span>
                  ))}
                </div>
                {activeMediaProject.liveUrl && (
                  <div className="pt-2">
                    <a
                      href={activeMediaProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-[11px] uppercase tracking-wider transition-colors hover:bg-brand-primary-light"
                    >
                      Veb-saytga O'tish
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
