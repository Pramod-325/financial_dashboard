import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TransactionSection } from './components/transactions/TransactionSection';

const MainLayout: React.FC = () => {
  const { theme, toggleTheme, user, toggleRole } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sora text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo implementation based on theme */}
          <div className="font-bold text-2xl tracking-tighter text-zorvyn-teal">
            zorvyn <span className="text-sm font-normal text-gray-500">fintech</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm hidden sm:block">Role: <span className="font-bold text-zorvyn-accent">{user.role}</span></div>
          <button onClick={toggleRole} className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700">
            Switch Role
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardOverview />
        <TransactionSection />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;