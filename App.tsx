
import React, { useState, useEffect } from 'react';
import { UserRole, MedScan } from './types';
import Layout from './components/Layout';
import UserDashboard from './views/UserDashboard';
import MedScanner from './views/MedScanner';
import InspectorDashboard from './views/InspectorDashboard';
import { motion } from 'framer-motion';
// Fixed: Added missing FileText, Camera, and Package imports from lucide-react
import { ShieldAlert, CheckCircle2, Info, ChevronRight, FileText, Camera, Package } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [history, setHistory] = useState<MedScan[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<MedScan | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dawaverify_history_v2');
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      const seed: MedScan[] = [
        { 
          id: '1', 
          timestamp: Date.now() - 86400000, 
          medName: 'Panadol CF', 
          manufacturer: 'GSK Pakistan', 
          officialPrice: 'PKR 380', 
          isSuspectedFake: false, 
          urduInstructions: 'یہ زکام اور بخار کے لیے ہے۔ بڑوں کے لیے دن میں دو بار ایک گولی۔', 
          englishSummary: 'Effective for flu and fever. Adults: 1 tab twice daily.', 
          location: 'Islamabad' 
        }
      ];
      setHistory(seed);
      localStorage.setItem('dawaverify_history_v2', JSON.stringify(seed));
    }
  }, []);

  const handleScanComplete = (analysis: MedScan) => {
    const newHistory = [analysis, ...history];
    setHistory(newHistory);
    setLastAnalysis(analysis);
    setActiveTab('analysis-result');
    localStorage.setItem('dawaverify_history_v2', JSON.stringify(newHistory));
  };

  const renderContent = () => {
    if (role === UserRole.CITIZEN) {
      switch (activeTab) {
        case 'dashboard': return <UserDashboard history={history} />;
        case 'scan': return <MedScanner onScanComplete={handleScanComplete} />;
        case 'analysis-result': return (
          <div className="max-w-4xl mx-auto pb-12">
            <motion.div 
              layoutId="resultCard"
              className={`glass-card p-12 rounded-[3.5rem] border-2 shadow-2xl relative overflow-hidden ${
                lastAnalysis?.isSuspectedFake ? 'border-red-500/30' : 'border-emerald-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div className="flex-1">
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl font-black text-slate-800 mb-2"
                  >
                    {lastAnalysis?.medName}
                  </motion.h3>
                  <p className="text-xl text-slate-400 font-bold mb-6">{lastAnalysis?.manufacturer}</p>
                  
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-lg ${
                    !lastAnalysis?.isSuspectedFake 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : 'bg-red-600 text-white shadow-red-200'
                  }`}>
                    {lastAnalysis?.isSuspectedFake ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
                    {lastAnalysis?.isSuspectedFake ? 'High Risk Cluster Alert' : 'Authenticity Verified'}
                  </div>
                </div>

                <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-white/50 backdrop-blur-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DRAP Regulated Price</p>
                  <p className="text-4xl font-black text-emerald-600">{lastAnalysis?.officialPrice}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">Maximum Retail Price (MRP)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-emerald-900/5 p-10 rounded-[2.5rem] border border-emerald-100 text-right group hover:bg-emerald-900/10 transition-colors"
                >
                  <h4 className="text-sm font-black text-emerald-800 mb-6 flex items-center justify-end gap-2 uppercase tracking-widest">
                    طریقہ استعمال <Info size={16} />
                  </h4>
                  <p className="text-2xl text-emerald-900 urdu-text leading-relaxed font-bold">
                    {lastAnalysis?.urduInstructions}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/60 p-10 rounded-[2.5rem] border border-slate-100"
                >
                  <h4 className="text-sm font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    Medical Summary <FileText size={16} />
                  </h4>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    {lastAnalysis?.englishSummary}
                  </p>
                </motion.div>
              </div>

              {lastAnalysis?.isSuspectedFake && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-8 bg-red-600 p-6 rounded-3xl text-white flex items-center gap-6 shadow-xl shadow-red-200"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
                    <ShieldAlert size={28} />
                  </div>
                  <p className="font-bold text-sm">
                    CRITICAL: This packaging displays visual deviations from official DRAP samples. Our AI suggests high probability of tampering. Please report to the nearest pharmacy inspector immediately.
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <button 
                  onClick={() => setActiveTab('scan')}
                  className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  Verify Another <Camera size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="flex-1 glass-card text-slate-800 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 border-slate-200"
                >
                  My Cabinet <Package size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        );
        case 'history': return (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-black text-slate-800">Your Cabinet</h3>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{history.length} ITEMS SAVED</span>
            </div>
            {history.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={item.id} 
                className="glass-card p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${item.isSuspectedFake ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {item.isSuspectedFake ? '⚠️' : '💊'}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{item.medName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.location} • {new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Official Price</p>
                    <p className="font-black text-slate-700">{item.officialPrice}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        );
        default: return <UserDashboard history={history} />;
      }
    } else {
      return <InspectorDashboard reports={history} />;
    }
  };

  const toggleRole = () => {
    const newRole = role === UserRole.CITIZEN ? UserRole.INSPECTOR : UserRole.CITIZEN;
    setRole(newRole);
    setActiveTab(newRole === UserRole.CITIZEN ? 'dashboard' : 'admin-dashboard');
  };

  return (
    <Layout 
      role={role} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      toggleRole={toggleRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
