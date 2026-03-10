'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Radio, Lock, AlertTriangle, ChevronRight } from 'lucide-react';

const risks = [
  {
    id: 'spoofing',
    title: 'Signal Spoofing',
    icon: <Radio className="w-5 h-5 text-rose-400" />,
    description: 'Adversaries transmit counterfeit satellite signals to deceive the maritime receiver.',
    impact: 'Can cause the vessel to miscalculate its position (GPS spoofing) or connect to a malicious ground station, leading to misrouted traffic and potential data interception.',
    mitigation: 'Implement cryptographic authentication of satellite signals and cross-validate telemetry with inertial navigation systems.'
  },
  {
    id: 'jamming',
    title: 'RF Jamming',
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    description: 'Intentional emission of high-power radio frequency noise to overpower legitimate satellite signals.',
    impact: 'Results in severe throughput drops, increased latency, and complete denial of service (DoS) for critical maritime communications.',
    mitigation: 'Utilize adaptive beamforming, frequency hopping spread spectrum (FHSS), and predictive routing to switch to unaffected links during an attack.'
  },
  {
    id: 'integrity',
    title: 'Data Integrity Threats',
    icon: <Lock className="w-5 h-5 text-emerald-400" />,
    description: 'Manipulation of data packets in transit, particularly targeting unencrypted IoT sensor data on the vessel.',
    impact: 'Compromises operational decisions, such as cargo monitoring or engine telemetry, potentially leading to physical damage or safety hazards.',
    mitigation: 'Enforce end-to-end encryption (e.g., IPsec/TLS) for all maritime traffic and deploy intrusion detection systems (IDS) at the edge.'
  }
];

export default function CybersecurityPanel() {
  const [activeRisk, setActiveRisk] = useState(risks[0].id);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Threat Vectors
        </h3>
        <div className="space-y-2">
          {risks.map((risk) => (
            <button
              key={risk.id}
              onClick={() => setActiveRisk(risk.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                activeRisk === risk.id
                  ? 'bg-white border border-slate-200 shadow-sm'
                  : 'hover:bg-white/50 border border-transparent text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {risk.icon}
                <span className={`font-medium ${activeRisk === risk.id ? 'text-slate-900' : ''}`}>
                  {risk.title}
                </span>
              </div>
              {activeRisk === risk.id && (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full md:w-2/3 p-6 relative min-h-[250px]">
        <AnimatePresence mode="wait">
          {risks.map((risk) => 
            activeRisk === risk.id && (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {risk.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900">{risk.title}</h4>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {risk.description}
                </p>

                <div className="space-y-4 mt-auto">
                  <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">Impact</h5>
                    <p className="text-sm text-slate-700">{risk.impact}</p>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Mitigation Strategy</h5>
                    <p className="text-sm text-slate-700">{risk.mitigation}</p>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
