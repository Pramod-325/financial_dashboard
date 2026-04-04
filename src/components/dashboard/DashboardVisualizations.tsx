// src/components/dashboard/DashboardVisualizations.tsx
import React, { useMemo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAppContext } from '../../context/AppContext';
import { AnalyticsService } from '../../services/AnalyticsService';
import type { Transaction } from '../../models/FinanceTypes';
import type {} from '@mui/x-charts/themeAugmentation';

interface DashboardVisualizationsProps {
  transactions: Transaction[];
}

export const DashboardVisualizations: React.FC<DashboardVisualizationsProps> = ({ transactions }) => {
  const { theme } = useAppContext();

  const pieData = useMemo(() => AnalyticsService.getExpensePieData(transactions), [transactions]);
  const trendData = useMemo(() => AnalyticsService.getMonthlyTrends(transactions), [transactions]);
  const insights = useMemo(() => AnalyticsService.generateInsights(transactions), [transactions]);

  // NATIVE MUI THEME BRIDGE: 
  // This tells MUI to switch its entire internal rendering engine to match our Tailwind state.
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: theme, // Tells MUI if it's 'light' or 'dark' natively
      text: {
        primary: theme === 'dark' ? '#ffffff' : '#334155', // Pure white in dark mode
        secondary: theme === 'dark' ? '#cbd5e1' : '#64748b', // Lighter gray for axes
      },
      background: {
        paper: 'transparent', // Prevents MUI from overriding your Tailwind card backgrounds
      }
    },
    typography: {
      fontFamily: 'Sora, sans-serif', // Forces the Zorvyn branding into all chart text
    },
    components: {
      MuiChartsLegend: {
        styleOverrides: {
          root: {
            // Ensures the legend text explicitly uses the primary text color
            '& text': { fill: theme === 'dark' ? '#ffffff !important' : '#334155 !important' }
          }
        }
      }
    }
  }), [theme]);

  return (
    <div className="flex flex-col gap-6 mt-6 animate-fade-in w-full">
      
      {/* Dynamic AI-Style Insights Section */}
      <div className="bg-zorvyn-light/30 dark:bg-zorvyn-teal/10 p-6 rounded-xl border border-zorvyn-teal/20">
        <h3 className="text-lg font-semibold mb-3 text-zorvyn-teal dark:text-zorvyn-accent flex items-center gap-2">
          <span>✨</span> Financial Insights
        </h3>
        <ul className="space-y-2">
          {insights.map((text, idx) => (
             <li key={idx} className="text-gray-700 dark:text-gray-300">
               <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
             </li>
          ))}
        </ul>
      </div>

      {/* Wrap the charts in the MUI ThemeProvider */}
      <ThemeProvider theme={muiTheme}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          
          {/* Expense Breakdown - Pie Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Expense Breakdown</h3>
              <span className="md:hidden flex items-center gap-1 text-xs font-medium text-zorvyn-accent animate-pulse bg-zorvyn-light/50 dark:bg-slate-700 px-2 py-1 rounded-full">
                ↔ Swipe
              </span>
            </div>
            <div className="overflow-x-auto custom-scrollbar w-full pb-4">
              <div className="h-[300px] min-w-[400px] w-full">
                {pieData.length > 0 ? (
                  <PieChart
                    series={[{ data: pieData, innerRadius: 40, paddingAngle: 2, cornerRadius: 4 }]}
                    colors={['#2C7A7B', '#38B2AC', '#E53E3E', '#F6AD55', '#4299E1', '#805AD5', '#D53F8C']}
                    margin={{ right: 5, bottom: 20 }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No expense data in this range</div>
                )}
              </div>
            </div>
          </div>

          {/* Income vs Expense Trend - Line Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Income vs Expense Trend</h3>
              <span className="md:hidden flex items-center gap-1 text-xs font-medium text-zorvyn-accent animate-pulse bg-zorvyn-light/50 dark:bg-slate-700 px-2 py-1 rounded-full">
                ↔ Swipe
              </span>
            </div>
            <div className="overflow-x-auto custom-scrollbar w-full pb-4">
              <div className="h-[300px] min-w-[500px] w-full">
                {trendData.labels.length > 0 ? (
                   <LineChart
                     xAxis={[{ scaleType: 'point', data: trendData.labels }]}
                     yAxis={[{}]}
                     series={[
                       { data: trendData.incomes, label: 'Income', color: '#38A169', area: true, showMark: false },
                       { data: trendData.expenses, label: 'Expense', color: '#E53E3E', showMark: false },
                     ]}
                     margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
                   />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No trend data in this range</div>
                )}
              </div>
            </div>
          </div>

          {/* Budget & Savings Analysis - Bar Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 lg:col-span-2 flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Savings & Budget Comparison</h3>
              <span className="md:hidden flex items-center gap-1 text-xs font-medium text-zorvyn-accent animate-pulse bg-zorvyn-light/50 dark:bg-slate-700 px-2 py-1 rounded-full">
                ↔ Swipe
              </span>
            </div>
            <div className="overflow-x-auto custom-scrollbar w-full pb-4">
              <div className="h-[300px] min-w-[700px] w-full">
                {trendData.labels.length > 0 ? (
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: trendData.labels }]}
                    yAxis={[{}]}
                    series={[
                      { data: trendData.incomes, label: 'Total Budget (Income)', color: '#2C7A7B' },
                      { data: trendData.expenses, label: 'Total Spent', color: '#E53E3E' },
                    ]}
                    margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
                    borderRadius={4}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No budget data in this range</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </ThemeProvider>
    </div>
  );
};