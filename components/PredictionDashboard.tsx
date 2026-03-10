'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Clock } from 'lucide-react';

// Mock data based on the paper's findings
const generateData = (horizon: '15m' | '30m', metric: 'throughput' | 'latency') => {
  const data = [];
  let currentVal = metric === 'throughput' ? 280 : 35;
  
  for (let i = 0; i < 20; i++) {
    const time = new Date();
    time.setMinutes(time.getMinutes() + i * (horizon === '15m' ? 1 : 2));
    
    // Add some random walk noise
    const noise = (Math.random() - 0.5) * (metric === 'throughput' ? 40 : 10);
    currentVal = Math.max(metric === 'throughput' ? 50 : 20, currentVal + noise);
    
    // Simulate a sudden drop/spike (e.g., handoff or weather event)
    if (i === 10) {
      currentVal = metric === 'throughput' ? currentVal - 100 : currentVal + 40;
    }

    // Baseline (persistence) is just a delayed or flat version
    const baseline = currentVal + (Math.random() - 0.5) * (horizon === '15m' ? 30 : 50);

    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: Math.round(currentVal),
      predicted: Math.round(currentVal + (Math.random() - 0.5) * (horizon === '15m' ? 15 : 35)),
      baseline: Math.round(baseline),
    });
  }
  return data;
};

export default function PredictionDashboard() {
  const [horizon, setHorizon] = useState<'15m' | '30m'>('15m');
  const [metric, setMetric] = useState<'throughput' | 'latency'>('throughput');

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateData(horizon, metric));
  }, [horizon, metric]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Performance Prediction Model
          </h3>
          <p className="text-sm text-slate-500">RandomForest Multi-Horizon Regression</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Toggle */}
          <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setMetric('throughput')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                metric === 'throughput' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Throughput
            </button>
            <button
              onClick={() => setMetric('latency')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                metric === 'latency' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Latency
            </button>
          </div>

          {/* Horizon Toggle */}
          <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setHorizon('15m')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                horizon === '15m' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Clock className="w-3 h-3" /> 15 Min
            </button>
            <button
              onClick={() => setHorizon('30m')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                horizon === '30m' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Clock className="w-3 h-3" /> 30 Min
            </button>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              domain={['auto', 'auto']}
              unit={metric === 'throughput' ? ' Mbps' : ' ms'}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px', color: '#0f172a' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Measured" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="RF Predicted" 
              stroke="#6366f1" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              type="monotone" 
              dataKey="baseline" 
              name="Baseline" 
              stroke="#ef4444" 
              strokeWidth={1} 
              strokeDasharray="4 4" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Model MAE</div>
          <div className="text-lg font-mono text-slate-900">
            {horizon === '15m' ? (metric === 'throughput' ? '19.1 Mbps' : '10.4 ms') : (metric === 'throughput' ? '24.6 Mbps' : '14.2 ms')}
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Baseline MAE</div>
          <div className="text-lg font-mono text-slate-500">
            {horizon === '15m' ? (metric === 'throughput' ? '27.7 Mbps' : '11.8 ms') : (metric === 'throughput' ? '26.0 Mbps' : '15.1 ms')}
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Improvement</div>
          <div className="text-lg font-mono text-emerald-600">
            {horizon === '15m' ? '31%' : '5%'}
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Horizon</div>
          <div className="text-lg font-mono text-indigo-600">
            {horizon === '15m' ? 'Short-term' : 'Mid-term'}
          </div>
        </div>
      </div>
    </div>
  );
}
