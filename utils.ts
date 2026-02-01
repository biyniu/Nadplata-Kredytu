import { LoanConfig, Overpayment, ScheduleItem, SimulationResult } from './types';
import { addMonths, format, parseISO, differenceInMonths, startOfMonth } from 'date-fns';
import { pl } from 'date-fns/locale';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), 'dd.MM.yyyy', { locale: pl });
  } catch (e) {
    return dateStr;
  }
};

/**
 * Calculates the amortization schedule.
 * Logic: Constant Installment Amount (Rata Stała in terms of payment),
 * but calculates strictly based on Reducing Principal.
 * Overpayments reduce the principal, shortening the term.
 */
export const calculateSchedule = (
  config: LoanConfig,
  overpayments: Overpayment[],
  recurringMonthlyAmount: number = 0
): SimulationResult => {
  const schedule: ScheduleItem[] = [];
  
  let currentPrincipal = config.amount;
  let currentDate = parseISO(config.startDate);
  let totalInterest = 0;
  let monthIndex = 1;

  // 1. Calculate Baseline (No overpayments) to find original term and interest
  // Roughly estimating original logic for comparison
  let baselinePrincipal = config.amount;
  let baselineInterest = 0;
  let baselineMonths = 0;
  
  while (baselinePrincipal > 0 && baselineMonths < 1200) { // Safety break 100 years
    const interest = baselinePrincipal * (config.interestRate / 100) / 12;
    baselineInterest += interest;
    const principalPart = config.installment - interest;
    baselinePrincipal -= principalPart;
    baselineMonths++;
  }
  const originalEndDate = format(addMonths(parseISO(config.startDate), baselineMonths), 'yyyy-MM-dd');
  const originalTotalInterest = baselineInterest;


  // Prepare date comparison for recurring payments
  // We want recurring payments to start from the current real-world month onwards
  const now = new Date();
  const startOfCurrentRealMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // Set hours to 0 for accurate comparison
  startOfCurrentRealMonth.setHours(0, 0, 0, 0);


  // 2. Calculate Actual Schedule with Overpayments
  while (currentPrincipal > 0.01 && monthIndex < 1200) {
    const interest = currentPrincipal * (config.interestRate / 100) / 12;
    
    // Determine overpayment for this month
    let monthlyOverpayment = 0;

    // A) Recurring Overpayment (Only if the simulation date is >= current real month)
    // We normalize currentDate to ensure we are comparing apples to apples
    const currentSimulationDateCheck = new Date(currentDate);
    currentSimulationDateCheck.setHours(0, 0, 0, 0);

    if (currentSimulationDateCheck >= startOfCurrentRealMonth) {
      monthlyOverpayment += recurringMonthlyAmount;
    }
    
    // B) One-time Overpayments from list
    overpayments.forEach(ov => {
      if (ov.type === 'one-time' && ov.date) {
        // Simple check: same year and month
        const ovDate = parseISO(ov.date);
        if (ovDate.getFullYear() === currentDate.getFullYear() && ovDate.getMonth() === currentDate.getMonth()) {
          monthlyOverpayment += ov.amount;
        }
      }
    });

    let principalPart = config.installment - interest;
    
    // Safety: If interest is higher than installment (negative amortization), 
    // real banks capitalize it, but here we assume installment covers interest.
    if (principalPart < 0) principalPart = 0;

    // Last installment check
    let actualPayment = config.installment;
    if (currentPrincipal + interest < config.installment) {
      principalPart = currentPrincipal;
      actualPayment = currentPrincipal + interest;
    }

    const principalEnd = Math.max(0, currentPrincipal - principalPart - monthlyOverpayment);
    
    schedule.push({
      index: monthIndex,
      date: format(currentDate, 'yyyy-MM-dd'),
      principalStart: currentPrincipal,
      installment: actualPayment,
      interest: interest,
      principalPart: principalPart,
      overpayment: monthlyOverpayment,
      principalEnd: principalEnd,
      isOverpaid: monthlyOverpayment > 0
    });

    totalInterest += interest;
    currentPrincipal = principalEnd;
    
    // Advance to next month
    currentDate = addMonths(currentDate, 1);
    monthIndex++;
  }

  const lastItem = schedule[schedule.length - 1];
  
  return {
    schedule,
    totalInterest,
    totalCost: config.amount + totalInterest,
    endDate: lastItem ? lastItem.date : config.startDate,
    monthsSaved: Math.max(0, baselineMonths - schedule.length),
    interestSaved: Math.max(0, originalTotalInterest - totalInterest),
    originalEndDate
  };
};