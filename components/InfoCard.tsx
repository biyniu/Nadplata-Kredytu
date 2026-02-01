import React from 'react';

interface InfoCardProps {
  title: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
  color?: 'blue' | 'green' | 'amber' | 'slate';
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, subtitle, highlight, color = 'slate' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    slate: 'bg-white text-slate-900 border-slate-200',
  };

  const textColors = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    amber: 'text-amber-700',
    slate: 'text-slate-900',
  }

  return (
    <div className={`p-4 rounded-xl border shadow-sm ${colorClasses[color]}`}>
      <h3 className={`text-sm font-bold mb-1 ${color === 'slate' ? 'text-slate-600' : 'opacity-90'}`}>{title}</h3>
      <p className={`text-2xl font-black ${textColors[color]}`}>{value}</p>
      {subtitle && <p className={`text-xs mt-1 font-medium ${color === 'slate' ? 'text-slate-500' : 'opacity-80'}`}>{subtitle}</p>}
    </div>
  );
};