import React from 'react';
import { SimulationResult } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface ScheduleTableProps {
  data: SimulationResult;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold text-lg text-slate-900">Szczegółowy Harmonogram</h3>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-900 font-bold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Nr</th>
              <th className="px-6 py-3 whitespace-nowrap">Data</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Rata</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Odsetki</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Kapitał</th>
              <th className="px-6 py-3 whitespace-nowrap text-right text-emerald-700 font-bold">Nadpłata</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Kapitał Końcowy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.schedule.map((row) => (
              <tr key={row.index} className={`hover:bg-slate-50 transition-colors ${row.isOverpaid ? 'bg-emerald-50/50' : ''}`}>
                <td className="px-6 py-3 text-slate-700 font-mono font-medium">{row.index}</td>
                <td className="px-6 py-3 text-slate-900 font-medium">{formatDate(row.date)}</td>
                <td className="px-6 py-3 text-right text-slate-900 font-bold">{formatCurrency(row.installment)}</td>
                <td className="px-6 py-3 text-right text-red-600 font-medium">{formatCurrency(row.interest)}</td>
                <td className="px-6 py-3 text-right text-blue-700 font-medium">{formatCurrency(row.principalPart)}</td>
                <td className="px-6 py-3 text-right text-emerald-700 font-bold">
                  {row.overpayment > 0 ? formatCurrency(row.overpayment) : '-'}
                </td>
                <td className="px-6 py-3 text-right text-slate-900 font-mono font-bold">{formatCurrency(row.principalEnd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};