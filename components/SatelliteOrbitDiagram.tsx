'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Wifi } from 'lucide-react';

export default function SatelliteOrbitDiagram() {
  const [activeSatellite, setActiveSatellite] = useState(0);
  const [isHandoff, setIsHandoff] = useState(false);

  const satellites = [
    { id: 0, cx: 100, cy: 60, delay: 0 },
    { id: 1, cx: 300, cy: 40, delay: 2 },
    { id: 2, cx: 500, cy: 70, delay: 4 },
  ];

  const [stars, setStars] = useState<{w: number, h: number, t: number, l: number, o: number}[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars([...Array(20)].map(() => ({
      w: Math.random() * 3,
      h: Math.random() * 3,
      t: Math.random() * 100,
      l: Math.random() * 100,
      o: Math.random(),
    })));
  }, []);

  // Simulate satellite handoff
  useEffect(() => {
    const interval = setInterval(() => {
      setIsHandoff(true);
      setTimeout(() => {
        setActiveSatellite((prev) => (prev + 1) % satellites.length);
        setIsHandoff(false);
      }, 500); // Handoff duration
    }, 4000); // Trigger handoff every 4 seconds

    return () => clearInterval(interval);
  }, [satellites.length]);

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden flex flex-col items-center justify-end shadow-sm">
      {/* Background Stars/Space */}
      <div className="absolute inset-0 opacity-20">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: star.w + 'px',
              height: star.h + 'px',
              top: star.t + '%',
              left: star.l + '%',
              opacity: star.o,
            }}
          />
        ))}
      </div>

      {/* SVG Canvas for Orbits and Links */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {/* Orbit Path */}
        <path
          d="M -50 100 Q 300 0 650 100"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Dynamic Link Line */}
        <motion.line
          x1="50%"
          y1="220" // Ground terminal position
          x2={satellites[activeSatellite].cx}
          y2={satellites[activeSatellite].cy}
          stroke={isHandoff ? "#ef4444" : "#6366f1"} // Red during handoff, Indigo otherwise
          strokeWidth="2"
          strokeDasharray={isHandoff ? "2 4" : "0"}
          initial={false}
          animate={{
            x2: satellites[activeSatellite].cx,
            y2: satellites[activeSatellite].cy,
            stroke: isHandoff ? "#ef4444" : "#6366f1",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>

      {/* Satellites */}
      {satellites.map((sat, index) => (
        <motion.div
          key={sat.id}
          className="absolute"
          initial={{ x: -50, y: sat.cy }}
          animate={{
            x: ['0%', '100%'],
            y: [sat.cy + 20, sat.cy - 20, sat.cy + 20],
          }}
          transition={{
            x: { duration: 15, repeat: Infinity, ease: "linear", delay: sat.delay },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: sat.delay },
          }}
          style={{ left: sat.cx, top: sat.cy }}
        >
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border ${activeSatellite === index ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-slate-600'}`}>
            <Radio className={`w-4 h-4 ${activeSatellite === index ? 'text-indigo-400' : 'text-slate-400'}`} />
            {activeSatellite === index && !isHandoff && (
              <motion.div
                className="absolute inset-0 rounded-full border border-indigo-500"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Ground Terminal */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <div className="w-12 h-12 bg-slate-800 rounded-t-lg border-t border-l border-r border-slate-700 flex items-center justify-center">
          <Wifi className={`w-6 h-6 ${isHandoff ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
        </div>
        <div className="w-24 h-4 bg-slate-700 rounded-t-sm" />
      </div>

      {/* Coastline / Ground */}
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-t border-slate-800/50" />

      {/* Status Overlay */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-500">Status:</span>
          {isHandoff ? (
            <span className="text-red-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Handoff</span>
          ) : (
            <span className="text-emerald-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Connected</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Active Sat:</span>
          <span className="text-slate-900 font-medium">LEO-{satellites[activeSatellite].id + 1}</span>
        </div>
      </div>
    </div>
  );
}
