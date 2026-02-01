import React, { useState, useMemo } from 'react';
import { LoanConfig, Overpayment } from './types';
import { calculateSchedule, formatDate, formatCurrency } from './utils';
import { LoanInput } from './components/LoanInput';
import { OverpaymentsList } from './components/OverpaymentsList';
import { InfoCard } from './components/InfoCard';
import { ScheduleTable } from './components/ScheduleTable';
import { ResultsChart } from './components/ResultsChart';
import { Wallet } from 'lucide-react';

const App: React.FC = () => {
  // Initial state matches user's CSV data roughly
  const [config, setConfig] = useState<LoanConfig>({
    amount: 65000,
    interestRate: 12.5,
    installment: 1005.06,
    startDate: '2024-08-21',
  });

  // Stores the Google Apps Script Web App URL
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');

  const [recurringAmount, setRecurringAmount] = useState<number>(0);

  const [overpayments, setOverpayments] = useState<Overpayment[]>([
      { id: '1', date: '2025-04-21', amount: 10500, type: 'one-time' },
      { id: '2', date: '2025-05-21', amount: 1500, type: 'one-time' },
      { id: '3', date: '2025-10-21', amount: 1500, type: 'one-time' },
      { id: '4', date: '2025-11-21', amount: 5500, type: 'one-time' },
  ]);

  const handleAddOverpayment = (newOverpayment: Overpayment) => {
    setOverpayments([...overpayments, newOverpayment]);
  };

  const handleRemoveOverpayment = (id: string) => {
    setOverpayments(overpayments.filter(o => o.id !== id));
  };

  const simulation = useMemo(() => {
    return calculateSchedule(config, overpayments, recurringAmount);
  }, [config, overpayments, recurringAmount]);

  return (
    <div className="min-h-screen pb-safe-bottom bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-blue-200">
              <Wallet className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Kalkulator</h1>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            Symulacja
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        
        {/* Top Input Section */}
        <section>
          <LoanInput 
            config={config} 
            onChange={setConfig} 
            googleSheetUrl={googleSheetUrl}
            onUrlChange={setGoogleSheetUrl}
          />
        </section>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column: Stats & Charts */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Summary Cards - Grid for mobile optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InfoCard 
                title="Suma Odsetek" 
                value={formatCurrency(simulation.totalInterest)} 
                subtitle={`Koszt: ${formatCurrency(simulation.totalCost)}`}
                color="blue"
              />
              <InfoCard 
                title="Koniec Kredytu" 
                value={formatDate(simulation.endDate)}
                subtitle={`Szybciej o ${simulation.monthsSaved} msc`}
                color="slate"
              />
              <InfoCard 
                title="Zyskujesz" 
                value={formatCurrency(simulation.interestSaved)}
                subtitle="Oszczędność na odsetkach"
                color="green"
                highlight
              />
            </div>

            <ResultsChart data={simulation} />
          </div>

          {/* Right Column: Overpayments */}
          <div className="lg:col-span-1">
            <OverpaymentsList 
              overpayments={overpayments} 
              onAdd={handleAddOverpayment} 
              onRemove={handleRemoveOverpayment} 
              recurringAmount={recurringAmount}
              onRecurringChange={setRecurringAmount}
              googleSheetUrl={googleSheetUrl}
            />
          </div>
        </section>

        {/* Bottom Section: Table */}
        <section className="pb-8">
          <ScheduleTable data={simulation} />
        </section>

      </main>
    </div>
  );
};

export default App;