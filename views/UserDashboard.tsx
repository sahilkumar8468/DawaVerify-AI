
import React from 'react';
import { MedScan } from '../types';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// Fixed: Added missing Package import from lucide-react
import { ShieldAlert, CheckCircle2, TrendingUp, Wallet, Package } from 'lucide-react';

interface UserDashboardProps {
  history: MedScan[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ history }) => {
  const stats = [
    { label: 'Verified Meds', value: history.length, icon: CheckCircle2, color: 'bg-emerald-500', trend: '+12%' },
    { label: 'Safety Index', value: 'High', icon: ShieldAlert, color: 'bg-blue-500', trend: 'Stable' },
    { label: 'PKR Saved', value: history.length * 15, icon: Wallet, color: 'bg-amber-500', trend: 'vs MRP' },
    { label: 'Health Points', value: history.length * 100, icon: TrendingUp, color: 'bg-purple-500', trend: 'Level 2' },
  ];

  const pieData = [
    { name: 'Authentic', value: history.filter(h => !h.isSuspectedFake).length || 1 },
    { name: 'Suspected', value: history.filter(h => h.isSuspectedFake).length || 0 }
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-[2rem] border-white relative overflow-hidden group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/5`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              <span className="text-[10px] font-bold text-emerald-600">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Distribution */}
        <div className="lg:col-span-1 glass-card p-8 rounded-[2.5rem] flex flex-col items-center justify-center">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Safety Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Valid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Alerts</span>
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Recent Verifications</h3>
          <div className="space-y-3">
            {history.slice(0, 4).map((item, idx) => (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={item.id} 
                className="flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white/80 transition-all border border-transparent hover:border-emerald-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.isSuspectedFake ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {item.isSuspectedFake ? '⚠️' : '💊'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.medName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.location} • {new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-800">{item.officialPrice}</p>
                  <span className={`text-[10px] font-black uppercase ${item.isSuspectedFake ? 'text-red-500' : 'text-emerald-600'}`}>
                    {item.isSuspectedFake ? 'Suspect' : 'Authentic'}
                  </span>
                </div>
              </motion.div>
            ))}
            {history.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <Package size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm font-bold">No recent scans</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
