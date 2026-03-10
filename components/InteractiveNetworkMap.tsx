'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { User, Briefcase, Code, BookOpen, GraduationCap, Mail, Cloud } from 'lucide-react';

export default function InteractiveNetworkMap() {
  // Coordinates mapped to the NEW provided isometric city image
  const hotspots = [
    // Publications Building (Left side)
    { id: 'publications', label: 'Publications', icon: BookOpen, href: '/publications', top: '48%', left: '19%', color: 'text-rose-600' },
    // Research Projects (Satellite Dish Building)
    { id: 'projects', label: 'Projects', icon: Code, href: '/projects', top: '55%', left: '42%', color: 'text-indigo-600' },
    // Experience (Tall Grey Building, Back Right)
    { id: 'experience', label: 'Experience', icon: Briefcase, href: '/experience', top: '35%', left: '60%', color: 'text-amber-600' },
    // Contact (Cafe Contact, Right)
    { id: 'contact', label: 'Contact', icon: Mail, href: '/contact', top: '56%', left: '76%', color: 'text-cyan-600' },
    // Education (School at bottom)
    { id: 'education', label: 'Education', icon: GraduationCap, href: '/about#education', top: '80%', left: '55%', color: 'text-blue-600' },
  ];

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-[#fdfbf7] rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
      {/* Background Image - The NEW Isometric City */}
      <img
        src="/city-map.png"
        alt="Interactive City Map"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* --- DYNAMIC ANIMATIONS OVERLAY --- */}

      {/* 1. Animated Water Waves (Bottom Left) */}
      <div className="absolute bottom-[0%] left-[0%] w-[50%] h-[40%] pointer-events-none z-0 overflow-hidden" style={{ transform: 'rotate(-25deg) skewX(40deg)' }}>
        <motion.div
          animate={{ x: ['-20%', '20%', '-20%'], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[10%] w-[80%] h-[8px] bg-white/40 rounded-full blur-[1px]"
        />
        <motion.div
          animate={{ x: ['20%', '-20%', '20%'], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] left-[20%] w-[60%] h-[6px] bg-white/30 rounded-full blur-[1px]"
        />
        <motion.div
          animate={{ x: ['-10%', '30%', '-10%'], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[80%] left-[5%] w-[70%] h-[10px] bg-cyan-100/40 rounded-full blur-[2px]"
        />
      </div>

      {/* 2. Animated Clouds - Kept near the very top edge to reduce overlap with tall buildings */}
      <motion.div
        animate={{ x: ['-100%', '1000%'] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute top-[2%] left-0 opacity-60 text-white z-0 pointer-events-none drop-shadow-sm"
      >
        <Cloud className="w-12 h-12" fill="white" />
      </motion.div>
      <motion.div
        animate={{ x: ['-100%', '1000%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear", delay: 10 }}
        className="absolute top-[5%] left-0 opacity-40 text-white z-0 pointer-events-none drop-shadow-sm"
      >
        <Cloud className="w-20 h-20" fill="white" />
      </motion.div>

      {/* --- INTERACTIVE HOTSPOTS --- */}
      {hotspots.map((spot, index) => {
        const Icon = spot.icon;
        return (
          <Link key={spot.id} href={spot.href}>
            <motion.div
              className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group/spot"
              style={{ top: spot.top, left: spot.left }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              {/* Bouncing Marker */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                className="relative"
              >
                {/* Glowing Pulse Effect */}
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-60" />

                {/* Pin/Marker */}
                <div className="relative bg-white/95 backdrop-blur-md border-2 border-slate-200 p-3 rounded-full shadow-xl group-hover/spot:bg-slate-50 transition-colors cursor-pointer">
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${spot.color}`} />
                </div>
              </motion.div>

              {/* Label (Hidden by default, shows on hover to avoid clashing with image text) */}
              <div className="mt-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white px-4 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap shadow-xl opacity-0 group-hover/spot:opacity-100 transition-all transform group-hover/spot:translate-y-0 translate-y-2 pointer-events-none">
                {spot.label}
              </div>
            </motion.div>
          </Link>
        );
      })}

    </div>
  );
}
