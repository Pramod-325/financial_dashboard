import React, { useMemo, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AnalyticsService } from '../../services/AnalyticsService';
import { AudioService } from '../../services/AudioService';
import { DashboardVisualizations } from './DashboardVisualizations';


export const DashboardOverview: React.FC = () => {
  const { user, timeFilter, setTimeFilter, dateRange, setDateRange } = useAppContext();
  const audio = AudioService.getInstance();

  // 1. Get filtered transactions based on the selected range
  const filteredTransactions = useMemo(() => {
    return AnalyticsService.filterTransactionsByDate(user.transactions, timeFilter, dateRange);
  }, [user.transactions, timeFilter, dateRange]);

  // 2. Calculate the dynamic summary
  const summary = useMemo(() => {
    return AnalyticsService.calculateSummary(filteredTransactions);
  }, [filteredTransactions]);

  // Optional: Play sound if the filtered balance goes negative
  useEffect(() => {
    if (summary.balance < 0) audio.play('loss');
  }, [summary.balance, audio]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header & Date Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Financial Summary</h2>
        
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          
          {/* Preset Filters */}
          <select 
            className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-zorvyn-teal cursor-pointer"
            value={timeFilter} 
            onChange={(e) => { 
              audio.play('click'); 
              setTimeFilter(e.target.value as any); 
            }}
          >
            <option value="Daily">Daily (Today)</option>
            <option value="Weekly">Last 7 Days</option>
            <option value="Monthly">Last 30 Days</option>
            <option value="Yearly">Last 365 Days</option>
            <option value="Custom">Custom Range</option>
          </select>

          {/* Custom Date Range Picker (Only shows if 'Custom' is selected) */}
          {timeFilter === 'Custom' && (
            <div className="flex items-center gap-2 animate-fade-in">
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-zorvyn-teal"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-zorvyn-teal"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Balance" amount={summary.balance} type={summary.balance >= 0 ? 'positive' : 'negative'} />
        <SummaryCard title="Income" amount={summary.income} type="positive" />
        <SummaryCard title="Expenses" amount={summary.expense} type="negative" />
        <SummaryCard title="Est. Savings" amount={summary.savings} type="neutral" />
      </div>

      {/* Pass the FILTERED transactions to your charts if you want them to update with the dates too! */}
      {/* Or leave as user.transactions if you want charts to always show all-time history */}
      <DashboardVisualizations transactions={filteredTransactions} />
    </div>
  );
};

const SummaryCard = ({ title, amount, type }: { title: string, amount: number, type: 'positive'|'negative'|'neutral' }) => {
  const color = type === 'positive' ? 'text-zorvyn-success' : type === 'negative' ? 'text-zorvyn-danger' : 'text-zorvyn-teal';
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 transition-transform hover:scale-105">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>
        {amount < 0 ? '-' : ''}₹{Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}