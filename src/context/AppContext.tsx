import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Transaction, TimeFilter, DateRange } from '../models/FinanceTypes';
import { AudioService } from '../services/AudioService';
import { DataService } from '../services/DataService';

interface AppState {
  user: User;
  theme: 'light' | 'dark';
  timeFilter: TimeFilter;
  dateRange: DateRange;
  toggleTheme: () => void;
  toggleRole: () => void;
  setTimeFilter: (filter: TimeFilter) => void;
  setDateRange: (range: DateRange) => void;
  addTransaction: (t: Transaction) => void;
}

const defaultUser: User = {
  name: "Zorvyn User",
  email: "user@zorvyn.com",
  role: 'viewer',
  transactions: [
    { id: '1', date: new Date().toISOString(), type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary' },
    { id: '2', date: new Date().toISOString(), type: 'expense', amount: 1500, category: 'Rent', description: 'Apartment Rent' }
  ]
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [theme, setTheme] = useState<'light'|'dark'>('dark');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Monthly');
  const audio = AudioService.getInstance();
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const loadData = async () => {
        try {
        // Simulate network delay for UI loading states
        const fetchedUser = await DataService.fetchUserData(0); 
        setUser(fetchedUser);
        } catch (e) {
        // Fallback or error handling
        }
    };
    loadData();
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    audio.play('click');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleRole = () => {
    audio.play('pageFlip');
    setUser(prev => ({ ...prev, role: prev.role === 'admin' ? 'viewer' : 'admin' }));
  };

  const addTransaction = (t: Transaction) => {
    if (t.type === 'income') audio.play('addMoney');
    else audio.play('expense');
    
    setUser(prev => ({ ...prev, transactions: [t, ...prev.transactions] }));
  };

  return (
    <AppContext.Provider value={{ user, theme, timeFilter, toggleTheme, toggleRole, setTimeFilter, addTransaction, dateRange, setDateRange }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};