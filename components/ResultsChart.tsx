import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SimulationResult } from '../types';
import { formatCurrency } from '../utils';

interface ResultsChartProps {
  data: SimulationResult;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  // Downsample data for better chart performance if too many months
  const chartData = data.schedule.filter((_, index) => index % Math.ceil(data.schedule.length / 50) === 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="font-semibold text-lg text-slate-900 mb-6">Harmonogram Spłaty Kapitału</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => val.split('-')[0]} 
              tick={{fontSize: 12, fill: '#475569', fontWeight: 500}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
              tick={{fontSize: 12, fill: '#475569', fontWeight: 500}}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Kapitał']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0f172a' }}
              itemStyle={{ color: '#0f172a', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="principalEnd" 
              stroke="#3b82f6" 
              fill="#eff6ff" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Struktura Kosztów</h3>
        <div className="h-[60px] flex rounded-full overflow-hidden w-full">
            <div style={{ width: `${(data.schedule[0].principalStart / data.totalCost) * 100}%` }} className="bg-blue-600 h-full flex items-center justify-center text-white text-xs font-bold relative group">
                <span className="z-10 drop-shadow-md text-sm">Kapitał</span>
                <div className="absolute top-full mt-1 bg-slate-800 text-white text-xs rounded px-2 py-1 hidden group-hover:block whitespace-nowrap z-20">
                   {formatCurrency(data.schedule[0].principalStart)}
                </div>
            </div>
            <div style={{ width: `${(data.totalInterest / data.totalCost) * 100}%` }} className="bg-slate-300 h-full flex items-center justify-center text-slate-800 text-xs font-bold relative group">
                <span className="z-10 text-sm">Odsetki</span>
                <div className="absolute top-full mt-1 bg-slate-800 text-white text-xs rounded px-2 py-1 hidden group-hover:block whitespace-nowrap z-20">
                   {formatCurrency(data.totalInterest)}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};