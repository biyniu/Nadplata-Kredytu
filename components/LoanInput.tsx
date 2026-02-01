import React from 'react';
import { LoanConfig } from '../types';
import { Settings, Calculator, Calendar, Link as LinkIcon } from 'lucide-react';

interface LoanInputProps {
  config: LoanConfig;
  onChange: (newConfig: LoanConfig) => void;
  googleSheetUrl: string;
  onUrlChange: (url: string) => void;
}

export const LoanInput: React.FC<LoanInputProps> = ({ config, onChange, googleSheetUrl, onUrlChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...config,
      [name]: name === 'startDate' ? value : parseFloat(value) || 0,
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4 text-slate-900">
        <Settings className="w-5 h-5" />
        <h2 className="font-semibold text-lg">Parametry Kredytu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs uppercase tracking-wide font-bold text-slate-500 mb-1">Kwota Kredytu</label>
          <div className="relative">
            <input
              type="number"
              name="amount"
              value={config.amount}
              onChange={handleChange}
              // Increased padding for touch targets
              className="w-full pl-3 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide font-bold text-slate-500 mb-1">Oprocentowanie (%)</label>
          <div className="relative">
            <input
              type="number"
              name="interestRate"
              step="0.01"
              value={config.interestRate}
              onChange={handleChange}
              className="w-full pl-3 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide font-bold text-slate-500 mb-1">Rata (PLN)</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calculator className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              name="installment"
              value={config.installment}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide font-bold text-slate-500 mb-1">Pierwsza Rata</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="date"
              name="startDate"
              value={config.startDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 font-bold"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100">
         <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Integracja Google Sheets</label>
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-emerald-500" />
            </div>
            <input
              type="text"
              value={googleSheetUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="Wklej URL Web App..."
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
         </div>
      </div>
    </div>
  );
};