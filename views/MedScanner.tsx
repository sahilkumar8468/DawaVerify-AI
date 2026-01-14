
import React, { useState, useRef } from 'react';
import { verifyMedicine } from '../services/geminiService';
import { MedScan } from '../types';
import { motion } from 'framer-motion';
// Fixed: Added missing ShieldCheck and Wallet imports from lucide-react
import { Camera, MapPin, Search, AlertCircle, ShieldCheck, Wallet } from 'lucide-react';

interface MedScannerProps {
  onScanComplete: (scan: MedScan) => void;
}

const MedScanner: React.FC<MedScannerProps> = ({ onScanComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [city, setCity] = useState('Karachi');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      setPreview(base64Data);
      setIsProcessing(true);
      
      const rawBase64 = base64Data.split(',')[1];
      try {
        const result = await verifyMedicine(rawBase64, city);
        // Artificial delay for futuristic UX effect
        setTimeout(() => {
          onScanComplete(result);
        }, 1500);
      } catch (err) {
        console.error(err);
        alert("Verification error. Check API key.");
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card p-10 rounded-[3rem] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldCircle size={200} />
        </div>

        <div className="mb-8">
          <motion.div 
            animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-emerald-600/10 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <Camera size={40} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">AI Vision Authenticator</h2>
          <p className="text-slate-500 font-medium mt-2">DawaVerify AI will analyze packaging for anomalies</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 bg-white/40 p-4 rounded-3xl flex items-center gap-3 border border-white/60">
            <MapPin size={20} className="text-emerald-600" />
            <div className="text-left flex-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Location</label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none w-full cursor-pointer"
              >
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Islamabad</option>
                <option>Peshawar</option>
              </select>
            </div>
          </div>
          <div className="flex-1 bg-white/40 p-4 rounded-3xl flex items-center gap-3 border border-white/60">
            <Search size={20} className="text-emerald-600" />
            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Regulatory Sync</label>
              <p className="font-bold text-slate-800">DRAP v4.22 (2024)</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative group h-80 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
            preview ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-emerald-400 hover:bg-white/50'
          }`}
        >
          {preview ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={preview} alt="Med" className="max-h-full object-contain p-8" />
              {isProcessing && <div className="scanning-line" />}
            </div>
          ) : (
            <>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-emerald-600 mb-4"
              >
                <Camera size={32} />
              </motion.div>
              <p className="font-black text-slate-800 uppercase tracking-widest text-sm">Upload Package Photo</p>
              <p className="text-xs text-slate-400 mt-2">Hold phone parallel to the label for best accuracy</p>
            </>
          )}
          
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCapture} />
        </div>

        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-center gap-3 text-emerald-700 font-bold"
          >
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="animate-pulse">Analyzing chemical signatures...</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: 'Authenticity', text: 'Packaging verification via Vision AI.' },
          { icon: AlertCircle, title: 'Safety Scan', text: 'Simplified usage & allergy warnings.' },
          { icon: Wallet, title: 'Price Lock', text: 'Official regulated pricing check.' }
        ].map((feat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] flex flex-col items-center text-center">
            <feat.icon size={24} className="text-emerald-600 mb-3" />
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-1">{feat.title}</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">{feat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple helper icon
const ShieldCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default MedScanner;
