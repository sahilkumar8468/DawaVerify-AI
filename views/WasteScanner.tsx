
import React, { useState, useRef } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { WasteAnalysis } from '../types';

interface WasteScannerProps {
  onAnalysisComplete: (analysis: WasteAnalysis) => void;
}

const WasteScanner: React.FC<WasteScannerProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      setPreview(event.target?.result as string);
      setError(null);
      setIsAnalyzing(true);

      try {
        const result = await analyzeWasteImage(base64String);
        onAnalysisComplete(result);
      } catch (err: any) {
        console.error(err);
        setError("Failed to analyze image. Ensure your API key is valid.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            📸
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Identify Your Waste</h2>
          <p className="text-slate-500 mt-2">Upload a photo to see recycling instructions instantly</p>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer group ${
            preview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
          }`}
        >
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
              <p className="text-sm font-medium text-emerald-600">Image selected. Click to change.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400">JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />

          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-emerald-700 font-bold animate-pulse">EcoVision AI is analyzing...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
            <span>⚠️</span>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
          <span className="text-2xl mb-2">♻️</span>
          <h4 className="font-bold text-slate-800 text-sm">Recycle Right</h4>
          <p className="text-xs text-slate-500">Correct classification avoids contamination.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
          <span className="text-2xl mb-2">🌱</span>
          <h4 className="font-bold text-slate-800 text-sm">Grow Green</h4>
          <p className="text-xs text-slate-500">Earn points for every item properly disposed.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
          <span className="text-2xl mb-2">🏙️</span>
          <h4 className="font-bold text-slate-800 text-sm">City Impact</h4>
          <p className="text-xs text-slate-500">Data helps improve local infrastructure.</p>
        </div>
      </div>
    </div>
  );
};

export default WasteScanner;
