import React, { useState, useMemo } from "react";
import { Skill } from "../types";
import { motion } from "motion/react";
import { 
  FaReact, FaJs, FaPython, FaJava, FaPhp, FaNodeJs, FaHtml5, FaCss3Alt, FaGithubSquare, FaGitAlt, FaDocker, FaVuejs, FaAngular, FaPuzzlePiece
} from "react-icons/fa";
import { 
  SiPostman, SiArduino, SiTailwindcss, SiScratch, SiAutocad, SiSketchup, SiMongodb, SiMysql, SiFirebase, SiNextdotjs, SiVite, SiExpress, SiRedux, SiNestjs, SiDjango, SiSpring, SiGo, SiRust, SiSwift, SiKotlin, SiDart, SiFlutter
} from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { FiFigma } from "react-icons/fi";
import { TbCode, TbApi } from "react-icons/tb";

interface SkillsProps {
  skills: Skill[];
}

const getReactIcon = (name: string) => {
  const raw = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s = 22; // decreased size significantly as requested
  
  if (raw.includes('ardublock')) return (
    <div 
      className="flex items-center justify-center font-bold text-white shadow-sm" 
      style={{ width: s, height: s, backgroundColor: '#1d8f95', borderRadius: '3px', fontSize: s * 0.7, fontFamily: 'Arial, sans-serif' }}
    >
      A
    </div>
  );
  if (raw.includes('react')) return <FaReact color="#61DAFB" size={s} />;
  if (raw === 'js' || raw.includes('javascript')) return <FaJs color="#F7DF1E" size={s} />;
  if (raw === 'ts' || raw.includes('typescript')) return <span className="text-[#3178C6] font-bold text-[18px]">TS</span>; 
  if (raw.includes('postman')) return <SiPostman color="#FF6C37" size={s} />;
  if (raw.includes('arduino')) return <SiArduino color="#00979D" size={s} />;
  if (raw.includes('postgres')) return <BiLogoPostgresql color="#4169E1" size={s} />;
  if (raw.includes('tailwind')) return <SiTailwindcss color="#06B6D4" size={s} />;
  if (raw.includes('scratch')) return <SiScratch color="#F4A21D" size={s} />;
  if (raw.includes('autocad') || raw.includes('cad')) return <SiAutocad color="#E2231A" size={s} />;
  if (raw.includes('sketchup')) return <SiSketchup color="#005F9E" size={s} />;
  if (raw.includes('github')) return <FaGithubSquare color="#181717" size={s} />;
  if (raw === 'git' || raw.includes('git')) return <FaGitAlt color="#F05032" size={s} />;
  if (raw.includes('rest') || raw.includes('api')) return <TbApi color="#0052CC" size={s} />;
  if (raw.includes('figma')) return <FiFigma color="#F24E1E" size={s} />;
  if (raw.includes('node')) return <FaNodeJs color="#339933" size={s} />;
  if (raw.includes('html')) return <FaHtml5 color="#E34F26" size={s} />;
  if (raw.includes('css')) return <FaCss3Alt color="#1572B6" size={s} />;
  if (raw.includes('python')) return <FaPython color="#3776AB" size={s} />;
  if (raw.includes('java') && !raw.includes('script')) return <FaJava color="#007396" size={s} />;
  if (raw === 'c') return <TbCode color="#A8B9CC" size={s} />;
  if (raw === 'cpp' || raw === 'cplusplus') return <TbCode color="#00599C" size={s} />;
  if (raw === 'cs' || raw === 'csharp') return <TbCode color="#239120" size={s} />;
  if (raw === 'php') return <FaPhp color="#777BB4" size={s} />;
  if (raw.includes('vue')) return <FaVuejs color="#4FC08D" size={s} />;
  if (raw.includes('angular')) return <FaAngular color="#DD0031" size={s} />;
  if (raw.includes('docker')) return <FaDocker color="#2496ED" size={s} />;
  if (raw.includes('mongo')) return <SiMongodb color="#47A248" size={s} />;
  if (raw.includes('mysql')) return <SiMysql color="#4479A1" size={s} />;
  if (raw.includes('firebase')) return <SiFirebase color="#FFCA28" size={s} />;
  if (raw.includes('next')) return <SiNextdotjs color="#000000" size={s} />;
  if (raw.includes('vite')) return <SiVite color="#646CFF" size={s} />;
  if (raw.includes('express')) return <SiExpress color="#000000" size={s} />;
  if (raw.includes('redux')) return <SiRedux color="#764ABC" size={s} />;
  if (raw.includes('nest')) return <SiNestjs color="#E0234E" size={s} />;
  if (raw.includes('django')) return <SiDjango color="#092E20" size={s} />;
  if (raw.includes('spring')) return <SiSpring color="#6DB33F" size={s} />;
  if (raw.includes('go') && !raw.includes('google')) return <SiGo color="#00ADD8" size={s} />;
  if (raw.includes('rust')) return <SiRust color="#000000" size={s} />;
  if (raw.includes('swift')) return <SiSwift color="#F05138" size={s} />;
  if (raw.includes('kotlin')) return <SiKotlin color="#7F52FF" size={s} />;
  if (raw.includes('dart')) return <SiDart color="#0175C2" size={s} />;
  if (raw.includes('flutter')) return <SiFlutter color="#02569B" size={s} />;

  // Default fallback for everything else
  return <TbCode color="#A39673" size={s} />;
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Skills Grid (Icons) */}
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => {
          return (
            <motion.div
              layout
              key={skill.id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#E5DEC9] hover:border-brand-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div className="transition-transform group-hover:scale-110 flex items-center justify-center">
                {getReactIcon(skill.name)}
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 flex flex-col items-center shadow-xl translate-y-2 group-hover:translate-y-0 min-w-[80px]">
                <span className="font-bold">{skill.name}</span>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: `${skill.level}%` }}></div>
                </div>
                <span className="text-brand-primary font-black text-[10px] mt-1">{skill.level}%</span>
                {/* Little triangle pointer */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45"></div>
              </div>
            </motion.div>
          );
        })}

        {skills.length === 0 && (
          <div className="text-center text-brand-muted italic text-xs py-4 w-full">
            Ko'nikmalar topilmadi.
          </div>
        )}
      </div>

    </div>
  );
}
