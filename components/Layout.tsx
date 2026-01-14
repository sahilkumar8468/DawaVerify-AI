
import React from 'react';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Camera, Package, ShieldCheck, BarChart3, FileText, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  toggleRole: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, toggleRole }) => {
  const navItems = role === UserRole.CITIZEN 
    ? [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'scan', label: 'Verify Medicine', icon: Camera },
        { id: 'history', label: 'My Cabinet', icon: Package }
      ]
    : [
        { id: 'admin-dashboard', label: 'Markets', icon: ShieldCheck },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'policy', label: 'Policy AI', icon: FileText }
      ];

  return (
    <div className="flex h-screen p-4 gap-4 overflow-hidden">
      {/* Sidebar - Floating Capsule Design */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 lg:w-64 glass-card rounded-[2.5rem] flex flex-col p-6 z-20 border border-white/40"
      >
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 hidden lg:block">DawaVerify</h1>
        </div>
        
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative overflow-hidden group ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/10' 
                : 'text-slate-500 hover:bg-white/50 hover:text-emerald-600'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="font-bold text-sm hidden lg:block">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1" />
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200/50">
          <button 
            onClick={toggleRole}
            className="w-full text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest mb-6 lg:text-left text-center"
          >
            {role === UserRole.CITIZEN ? 'Enter Inspector Mode' : 'Exit to Citizen'}
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-white">
              <UserCircle size={24} />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-800">A. Khan</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">{role}</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 mb-2">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-emerald-600 font-bold">●</span>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              {navItems.find(i => i.id === activeTab)?.label || 'Verification'}
            </h2>
          </motion.div>
          <div className="flex items-center gap-3">
             <div className="glass-card px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-100/50">
               DRAP REGULATORY SYNC: ON
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + role}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
