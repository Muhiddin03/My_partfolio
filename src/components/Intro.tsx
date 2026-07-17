import React from "react";
import { motion } from "motion/react";
import { Profile } from "../types";

interface IntroProps {
  profile?: Profile;
  onComplete: () => void;
}

export default function Intro({ profile, onComplete }: IntroProps) {
  const name = profile?.name || "Muhiddin Karimjonov";
  const letters = Array.from(name);

  const nameContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.5 },
    },
  };

  const letterAnim = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween", ease: "easeOut", duration: 0.4 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      {/* Dynamic Background with Glowing Orbs - Optimized without heavy blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.4)_0%,transparent_70%)]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[50rem] h-[50rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.3)_0%,transparent_70%)]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-12">
        
        {/* Larger, Enhanced Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.8, delay: 0.2 }}
          className="relative group flex items-center justify-center"
        >
          {/* Smooth Rotating Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 md:-inset-4 rounded-full border border-brand-primary/40 border-t-brand-primary border-b-transparent shadow-[0_0_15px_rgba(79,70,229,0.2)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-5 md:-inset-7 rounded-full border border-blue-500/30 border-l-blue-500 border-r-transparent"
          />

          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border border-white/10 shadow-xl relative bg-[#0a0a0a] z-10">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-black text-brand-primary bg-clip-text text-transparent bg-gradient-to-br from-brand-primary to-blue-600">
                  {(profile?.name || "M").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Typing Name Effect */}
        <div className="text-center space-y-5 md:space-y-6">
          <motion.h1
            variants={nameContainer}
            initial="hidden"
            animate="visible"
            className="text-[clamp(2rem,7vw,4.5rem)] md:text-7xl font-black text-white tracking-tighter text-center drop-shadow-xl px-4 leading-tight"
          >
            {name.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {Array.from(word).map((char, charIndex) => (
                  <motion.span key={charIndex} variants={letterAnim} className="inline-block">
                    {char}
                  </motion.span>
                ))}
                {wordIndex !== name.split(" ").length - 1 && (
                  <span className="inline-block w-3 md:w-4">&nbsp;</span>
                )}
              </span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block text-brand-primary ml-1 md:ml-2 font-light"
            >
              |
            </motion.span>
          </motion.h1>

          {/* Dynamic Sleek Subtitle from Admin Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
          >
            {(profile?.title ? profile.title.split(/\||,/).map(t => t.trim()) : ["Fullstack Web Developer", "Robotics & IT Teacher"]).map((text, index, array) => (
              <React.Fragment key={index}>
                <span className="text-brand-muted font-mono text-xs sm:text-sm md:text-base tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/5 text-center">
                  {text}
                </span>
                {index < array.length - 1 && (
                  <span className="text-brand-primary hidden md:block">✦</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Cinematic Loading Progress */}
        <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-48 md:w-64">
          <div className="w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              onAnimationComplete={() => {
                setTimeout(onComplete, 300);
              }}
              className="w-full h-full bg-brand-primary"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
