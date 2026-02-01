export interface LoanConfig {
  amount: number;
  interestRate: number;
  installment: number;
  startDate: string;
}

export interface Overpayment {
  id: string;
  monthIndex?: number; // Specific installment number (1-based)
  date?: string; // Specific date (YYYY-MM-DD)
  amount: number;
  type: 'one-time' | 'recurring';
  intervalMonths?: number; // If recurring, every X months
}

export interface ScheduleItem {
  index: number;
  date: string;
  principalStart: number;
  installment: number;
  interest: number;
  principalPart: number;
  overpayment: number;
  principalEnd: number;
  isOverpaid: boolean;
}

export interface SimulationResult {
  schedule: ScheduleItem[];
  totalInterest: number;
  totalCost: number;
  endDate: string;
  monthsSaved: number;
  interestSaved: number;
  originalEndDate: string; // To compare
}