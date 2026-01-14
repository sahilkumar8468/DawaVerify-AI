
import React, { useState } from 'react';
import { MedScan } from '../types';
import { getInspectorSummary } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InspectorDashboardProps {
  reports: MedScan[];
}

const InspectorDashboard: React.FC<InspectorDashboardProps> = ({ reports }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Total Scans', value: reports.length, icon: '📈' },
    { label: 'Fake Alerts', value: reports.filter(r => r.isSuspectedFake).length, icon: '🚨' },
    { label: 'Active Cities', value: new Set(reports.map(r => r.location)).size, icon: '📍' },
  ];

  const cityData = reports.reduce((acc: any, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(cityData).map(city => ({ name: city, count: cityData[city] }));

  const generateReport = async () => {
    setLoading(true);
    try {
      const text = await getInspectorSummary(reports);
      setAiReport(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-slate-400 text-sm font-medium mt-2">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-800">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Regional Report Volume</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Inspector AI Analyst</h3>
            <button 
              onClick={generateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
            >
              {loading ? 'Synthesizing...' : 'Generate Enforcement Strategy'}
            </button>
            {aiReport && (
              <div className="mt-6 p-4 bg-white/10 rounded-2xl text-sm leading-relaxed border border-white/5 whitespace-pre-line">
                {aiReport}
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl">🏛️</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Field Alerts</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Real-time Feed</span>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${report.isSuspectedFake ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {report.isSuspectedFake ? '⚠️' : '💊'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{report.medName}</h4>
                  <p className="text-xs text-slate-400">{report.location} • {new Date(report.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                !report.isSuspectedFake ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {report.isSuspectedFake ? 'SUSPECT' : 'VERIFIED'}
              </span>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic text-sm">No recent reports found in the database.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
