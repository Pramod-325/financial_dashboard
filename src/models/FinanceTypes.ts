export type TransactionType = 'income' | 'expense';
export type TimeFilter = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface User {
  name: string;
  email: string;
  transactions: Transaction[];
  role: 'admin' | 'viewer';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savings: number;
  debt: number; // Simulated based on negative balance or specific categories
}