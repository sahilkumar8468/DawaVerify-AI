
export enum UserRole {
  CITIZEN = 'citizen',
  INSPECTOR = 'inspector'
}

export interface MedScan {
  id: string;
  timestamp: number;
  medName: string;
  manufacturer: string;
  officialPrice: string;
  userPrice?: number;
  isSuspectedFake: boolean;
  urduInstructions: string;
  englishSummary: string;
  location: string;
}

export interface MarketInsight {
  city: string;
  reportsCount: number;
  overchargeAlerts: number;
}

// Added to fix missing export errors in views/WasteScanner.tsx and views/AdminDashboard.tsx
export interface WasteAnalysis {
  item: string;
  category: string;
  recyclable: boolean;
  instructions: string;
  confidence: number;
}
