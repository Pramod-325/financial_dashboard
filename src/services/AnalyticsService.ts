import type { Transaction } from '../models/FinanceTypes';

export class AnalyticsService {

  // 1. Core Filtering Logic
  public static filterTransactionsByDate(
    transactions: Transaction[], 
    filterType: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom',
    customRange: { start: string, end: string }
  ): Transaction[] {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (filterType === 'Custom') {
      startDate = new Date(customRange.start);
      endDate = new Date(customRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the selected day
    } else {
      startDate.setHours(0, 0, 0, 0); // Start of today
      
      if (filterType === 'Weekly') {
        startDate.setDate(now.getDate() - 7);
      } else if (filterType === 'Monthly') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (filterType === 'Yearly') {
        startDate.setFullYear(now.getFullYear() - 1);
      }
    }

    return transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= endDate;
    });
  }

  // 2. Summary Calculation Logic (Now takes the FILTERED array)
  public static calculateSummary(filteredTransactions: Transaction[]) {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    const balance = income - expense;
    // Assuming a simple 20% savings rule on income for the demonstration
    const savings = income * 0.20; 

    return { income, expense, balance, savings };
  }
  
  // 1. Generate Dynamic English Summary
  public static generateInsights(transactions: Transaction[]): string[] {
    if (transactions.length === 0) return ["You have no financial activity yet."];

    const insights: string[] = [];
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    // Income vs Expense Insight
    if (totalIncome > totalExpense) {
      insights.push(`Great job! Your income exceeds your expenses by $${(totalIncome - totalExpense).toLocaleString()}.`);
    } else if (totalExpense > totalIncome) {
      insights.push(`Watch out! You have spent $${(totalExpense - totalIncome).toLocaleString()} more than you earned.`);
    }

    // Top Expense Insight
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push(`Your highest expense is **${topCategory[0]}**, costing you $${topCategory[1].toLocaleString()}.`);
    }

    // Savings Insight
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    if (savingsRate > 20) {
      insights.push(`You are saving a healthy ${savingsRate.toFixed(1)}% of your income.`);
    } else if (savingsRate > 0) {
      insights.push(`You are saving ${savingsRate.toFixed(1)}% of your income. Consider aiming for the 20% rule.`);
    }

    return insights;
  }

  // 2. Format Data for MUI Pie Chart (Expense Breakdown)
  public static getExpensePieData(transactions: Transaction[]) {
    const categoryTotals: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([label, value], index) => ({
      id: index,
      value,
      label
    }));
  }

  // 3. Format Data for MUI Line/Bar Charts (Monthly Trend)
  public static getMonthlyTrends(transactions: Transaction[]) {
    // Group by a sortable key like "2025-01" to handle multi-year data accurately
    const monthlyData: Record<string, { label: string, income: number, expense: number }> = {};
    
    transactions.forEach(t => {
      const dateObj = new Date(t.date);
      // Create a key that naturally sorts chronologically (YYYY-MM)
      const sortKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      // Create a nice display label like "Jan '25"
      const label = dateObj.toLocaleString('en-IN', { month: 'short' }) + " '" + dateObj.toLocaleString('en-IN', { year: '2-digit' });

      if (!monthlyData[sortKey]) {
        monthlyData[sortKey] = { label, income: 0, expense: 0 };
      }
      
      if (t.type === 'income') monthlyData[sortKey].income += t.amount;
      else monthlyData[sortKey].expense += t.amount;
    });

    // Sort the keys from oldest to newest using string comparison (e.g., "2025-01" comes before "2025-02")
    const sortedKeys = Object.keys(monthlyData).sort((a, b) => a.localeCompare(b));

    // Map out the final arrays for the MUI charts based on the sorted order
    const labels = sortedKeys.map(key => monthlyData[key].label);
    const incomes = sortedKeys.map(key => monthlyData[key].income);
    const expenses = sortedKeys.map(key => monthlyData[key].expense);

    return { labels, incomes, expenses };
  }
}