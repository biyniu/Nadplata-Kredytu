import React, { useState } from 'react';
import { Overpayment } from '../types';
import { Plus, Trash2, TrendingDown, Repeat, List, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils';

interface OverpaymentsListProps {
  overpayments: Overpayment[];
  onAdd: (overpayment: Overpayment) => void;
  onRemove: (id: string) => void;
  recurringAmount: number;
  onRecurringChange: (amount: number) => void;
  googleSheetUrl?: string;
}

export const OverpaymentsList: React.FC<OverpaymentsListProps> = ({ 
  overpayments, 
  onAdd, 
  onRemove,
  recurringAmount,
  onRecurringChange,
  googleSheetUrl
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'recurring'>('list');
  const [newDate, setNewDate] = useState('');
  const [newAmount, setNewAmount] = useState('1000');
  
  // Sending state
  const [isSending, setIsSending] = useState(false);
  const [lastSentStatus, setLastSentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleAdd = async () => {
    if (!newDate || !newAmount) return;

    const newItem: Overpayment = {
      id: Date.now().toString(),
      type: 'one-time',
      date: newDate,
      amount: parseFloat(newAmount)
    };
    
    // 1. Add locally immediately
    onAdd(newItem);
    
    // 2. Send to Google Sheets if URL is provided
    if (googleSheetUrl && googleSheetUrl.startsWith('http')) {
      setIsSending(true);
      setLastSentStatus('idle');
      
      try {
        // Use no-cors mode because Google Apps Script doesn't return standard CORS headers easily
        // We won't get a JSON response, but the data will be sent.
        await fetch(googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
        
        setLastSentStatus('success');
        // Clear success message after 3 seconds
        setTimeout(() => setLastSentStatus('idle'), 3000);
      } catch (error) {
        console.error("Failed to send to Google Sheets", error);
        setLastSentStatus('error');
      } finally {
        setIsSending(false);
      }
    }

    // Reset inputs
    setNewDate(''); 
  };

  const currentMonthName = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Header with Tabs */}
      <div className="border-b border-slate-100">
        <div className="p-4 pb-2">
           <div className="flex items-center gap-2 mb-3 text-slate-900">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-lg">Zarządzaj Nadpłatami</h2>
          </div>
        </div>
        
        <div className="flex px-4 gap-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'list' 
                ? 'border-emerald-500 text-emerald-700' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <List className="w-4 h-4" />
            Lista (Ręczne)
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'recurring' 
                ? 'border-emerald-500 text-emerald-700' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Repeat className="w-4 h-4" />
            Automat (Stałe)
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {activeTab === 'list' && (
          <>
            {/* Add Form */}
            <div className="flex flex-col gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Data</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kwota (PLN)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="np. 5000"
                />
              </div>
              <div className="pt-1">
                <button
                  onClick={handleAdd}
                  disabled={isSending}
                  className={`w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow ${
                    isSending ? 'bg-emerald-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Wysyłanie do Excela...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Dodaj Nadpłatę
                    </>
                  )}
                </button>
                {lastSentStatus === 'success' && (
                  <div className="text-center mt-2 text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Zapisano w arkuszu!
                  </div>
                )}
                {lastSentStatus === 'error' && (
                   <div className="text-center mt-2 text-xs font-bold text-red-500">
                    Błąd zapisu (sprawdź URL)
                  </div>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-2">
              {overpayments.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-sm font-medium bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Brak zaplanowanych ręcznych nadpłat.
                </div>
              ) : (
                overpayments.sort((a,b) => (a.date || '') > (b.date || '') ? 1 : -1).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-emerald-200 transition-colors group">
                    <div>
                      <div className="font-bold text-slate-900">{formatCurrency(item.amount)}</div>
                      <div className="text-xs text-slate-600 font-medium">{item.date ? formatDate(item.date) : 'Recurring'}</div>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Usuń"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'recurring' && (
          <div className="flex flex-col h-full">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Ta kwota będzie doliczana do raty <strong>od bieżącego miesiąca</strong> ({currentMonthName}) aż do końca kredytu.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Miesięczna nadpłata (PLN)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={recurringAmount}
                    onChange={(e) => onRecurringChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-lg text-slate-900 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">
                    PLN
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-1">
                  Wpisz 0, aby wyłączyć automatyczne nadpłaty.
                </p>
              </div>

              {recurringAmount > 0 && (
                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Dodatkowa kwota rocznie</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(recurringAmount * 12)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};