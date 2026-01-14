
import React, { useState, useEffect } from 'react';
import { WasteAnalysis } from '../types';
import { getAdminInsights } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminDashboardProps {
  allWasteData: WasteAnalysis[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ allWasteData }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    if (allWasteData.length === 0) return;
    setLoadingInsights(true);
    try {
      const text = await getAdminInsights(allWasteData);
      setInsights(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const chartData = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 38 },
    { name: 'Thu', count: 65 },
    { name: 'Fri', count: 48 },
    { name: 'Sat', count: 82 },
    { name: 'Sun', count: 70 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Policy Intelligence Hub</h2>
          <p className="text-slate-500">AI-powered urban strategy recommendations based on real-time data</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loadingInsights || allWasteData.length === 0}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loadingInsights ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '🤖'}
          Generate Strategy Report
        </button>
      </div>

      {insights && (
        <div className="bg-emerald-900 text-emerald-50 p-8 rounded-3xl border border-emerald-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 text-9xl">🌿</div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-emerald-400">✦</span> AI Recommendations
          </h3>
          <p className="text-lg leading-relaxed relative z-10 font-light">{insights}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Scanning Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Community Heatmap</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Downtown (Recycling Rate)</span>
                <span className="text-sm font-bold text-slate-800">72%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">West End (Hazardous)</span>
                <span className="text-sm font-bold text-slate-800">12% Alert</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Green Heights</span>
                <span className="text-sm font-bold text-slate-800">89% Peak</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-1">Impact Tip</h4>
            <p className="text-xs text-blue-600 italic">Increasing pickup frequency in West End might reduce hazardous waste overflow by 15%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
