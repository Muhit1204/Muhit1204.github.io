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
    <div className="relative w-full h-64 md:h-[26rem] bg-bg overflow-hidden flex flex-col items-center justify-end">
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
          stroke={isHandoff ? "#ff4438" : "#00ff9c"} // Red during handoff, accent otherwise
          strokeWidth="2"
          strokeDasharray={isHandoff ? "2 4" : "0"}
          initial={false}
          animate={{
            x2: satellites[activeSatellite].cx,
            y2: satellites[activeSatellite].cy,
            stroke: isHandoff ? "#ff4438" : "#00ff9c",
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
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-surface-2 border ${activeSatellite === index ? 'border-accent shadow-[0_0_15px_rgba(0,255,156,0.45)]' : 'border-line'}`}>
            <Radio className={`w-4 h-4 ${activeSatellite === index ? 'text-accent' : 'text-muted'}`} />
            {activeSatellite === index && !isHandoff && (
              <motion.div
                className="absolute inset-0 rounded-full border border-accent"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Ground Terminal */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <div className="w-12 h-12 bg-surface-2 rounded-t-lg border-t border-l border-r border-line flex items-center justify-center">
          <Wifi className={`w-6 h-6 ${isHandoff ? 'text-danger animate-pulse' : 'text-accent'}`} />
        </div>
        <div className="w-24 h-4 bg-line rounded-t-sm" />
      </div>

      {/* Coastline / Ground */}
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-r from-accent-dim/30 to-accent/10 border-t border-line" />

      {/* Status Overlay */}
      <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur border border-line rounded-none px-3 py-2 text-xs font-mono">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted">Status:</span>
          {isHandoff ? (
            <span className="text-danger flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger animate-pulse" /> Handoff</span>
          ) : (
            <span className="text-accent flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Connected</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">Active Sat:</span>
          <span className="text-body font-medium">LEO-{satellites[activeSatellite].id + 1}</span>
        </div>
      </div>
    </div>
  );
}
