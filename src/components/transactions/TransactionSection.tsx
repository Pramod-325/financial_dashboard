// src/components/transactions/TransactionSection.tsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AudioService } from '../../services/AudioService';
import type { Transaction } from '../../models/FinanceTypes';

// Fixed categories tailored for the Indian context
const CATEGORY_OPTIONS = [
  'Housing & Utilities',
  'Groceries & Daily Needs',
  'Food & Dining',
  'Transportation',
  'Investments & Savings',
  'Shopping & Lifestyle',
  'Entertainment & OTT',
  'Miscellaneous'
];

const ITEMS_PER_PAGE = 7;

export const TransactionSection: React.FC = () => {
  const { user, addTransaction } = useAppContext();
  const audio = AudioService.getInstance();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpInput, setJumpInput] = useState('1');
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: '',
    category: CATEGORY_OPTIONS[0],
    description: ''
  });

  // Filter logic (All matched data)
  const filteredData = user.transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Math
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1; // Fallback to 1 if empty
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Keep the jump input visually synced if the user uses the Prev/Next buttons
  useEffect(() => {
    setJumpInput(currentPage.toString());
  }, [currentPage]);

  // Form handling
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) return;

    const newTx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      // Force 'Income' as category if it's an income, otherwise use selected expense category
      category: formData.type === 'income' ? 'Income' : formData.category,
      description: formData.description
    };

    addTransaction(newTx); // Context handles the add/expense audio
    
    // Reset form, close, and jump to first page to see the new transaction
    setFormData({ type: 'expense', amount: '', category: CATEGORY_OPTIONS[0], description: '' });
    setIsFormOpen(false);
    setCurrentPage(1);
  };

  // Pagination Handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      audio.play('pageFlip');
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      audio.play('pageFlip');
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleJumpToPage = (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpInput, 10);

    // Validate the input is within bounds
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      if (pageNumber !== currentPage) {
        audio.play('pageFlip');
        setCurrentPage(pageNumber);
      }
    } else {
      // If invalid, bounce the input back to whatever the current valid page is
      setJumpInput(currentPage.toString());
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-slate-700 transition-colors">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold dark:text-white">Recent Transactions</h3>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-zorvyn-teal transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {user.role === 'admin' && (
            <button 
              onClick={() => {
                audio.play('click');
                setIsFormOpen(!isFormOpen);
              }}
              className="px-4 py-2 bg-zorvyn-teal text-white rounded-lg hover:bg-zorvyn-accent transition-colors shrink-0 font-semibold"
            >
              {isFormOpen ? 'Cancel' : '+ Add'} 
            </button>
          )}
        </div>
      </div>

      {/* Add Transaction Form (Admin Only) */}
      {user.role === 'admin' && isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-slate-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-xl flex flex-col gap-4 animate-fade-in">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">New Transaction</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Toggle */}
            <div className="flex gap-4 items-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 w-full justify-center">
                <input 
                  type="radio" 
                  name="type" 
                  value="expense" 
                  checked={formData.type === 'expense'} 
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'expense'})} 
                  className="accent-zorvyn-danger w-4 h-4"
                /> 
                Expense
              </label>
              <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 w-full justify-center">
                <input 
                  type="radio" 
                  name="type" 
                  value="income" 
                  checked={formData.type === 'income'} 
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'income'})} 
                  className="accent-zorvyn-success w-4 h-4"
                /> 
                Income
              </label>
            </div>

            {/* Amount */}
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              required
              min="1"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zorvyn-teal"
            />

            {/* Category (Disabled visually if Income is selected) */}
            {formData.type === 'expense' ? (
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zorvyn-teal cursor-pointer"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            ) : (
              <div className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-400 flex items-center select-none">
                Income Category (Auto-assigned)
              </div>
            )}

            {/* Description */}
            <input 
              type="text" 
              placeholder="Description (e.g., Blinkit, Salary, Electricity)" 
              required
              maxLength={50}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zorvyn-teal"
            />
          </div>

          <button type="submit" className="mt-2 w-full md:w-auto self-end bg-zorvyn-teal text-white py-2 px-6 rounded-lg font-semibold hover:bg-zorvyn-accent transition-colors shadow-sm">
            Save Transaction
          </button>
        </form>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm">
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Description</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No transactions match your search." : "No transactions found."}
                </td>
              </tr>
            ) : (
              paginatedData.map(t => (
                <tr key={t.id} className="border-b border-gray-100 dark:border-slate-750 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {t.description}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-xs font-medium">
                      {t.category}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-right font-semibold ${t.type === 'income' ? 'text-zorvyn-success' : 'text-zorvyn-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-slate-700 pt-4 gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span> entries
          </p>
          
          <div className="flex items-center gap-4">
            
            {/* Skip to Page Form */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Page</span>
              <input 
                type="number" 
                min={1} 
                max={totalPages}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onBlur={handleJumpToPage} 
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zorvyn-teal transition-all"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">of {totalPages}</span>
            </form>

            {/* Prev/Next Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-600'
                }`}
              >
                Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};