import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Upload, TrendingUp, TrendingDown, DollarSign, Target, CreditCard, PiggyBank, Calendar, Settings, Moon, Sun, Download, Plus, Trash2, Edit2, Check, X, AlertCircle, CheckCircle, Tag, PieChart } from 'lucide-react';

// Modern color palette - sophisticated and vibrant
const COLORS = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  success: '#10b981',
  successLight: '#34d399',
  danger: '#ef4444',
  dangerLight: '#f87171',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  purple: '#8b5cf6',
  purpleLight: '#a78bfa',
  teal: '#14b8a6',
  pink: '#ec4899',
  orange: '#f97316',
  indigo: '#6366f1',
};

const CATEGORY_COLORS = {
  'Groceries': COLORS.success,
  'Dining Out': COLORS.orange,
  'Transport': COLORS.indigo,
  'Entertainment': COLORS.purple,
  'Shopping': COLORS.pink,
  'Bills': COLORS.danger,
  'Health': COLORS.teal,
  'Education': COLORS.primary,
  'Income': COLORS.successLight,
  'Other': '#64748b',
};

// Comprehensive merchant auto-categorization rules
const MERCHANT_RULES = {
  // *** TRANSFERS - MUST BE FIRST TO PREVENT DOUBLE COUNTING ***
  // These are internal transfers between your accounts that should NOT count as income/expense
  
  // Groceries
  'coles': 'Groceries',
  'woolworths': 'Groceries',
  'vitology': 'Groceries',
  'aldi': 'Groceries',
  'iga': 'Groceries',
  
  // Drinking/Dining Out
  'kent': 'Dining Out',
  'pub': 'Dining Out',
  'bar': 'Dining Out',
  'hotel': 'Dining Out',
  'king st': 'Dining Out',
  'uptowns': 'Dining Out',
  'kahunas': 'Dining Out',
  'george darby': 'Dining Out',
  'finnegans': 'Dining Out',
  'casino': 'Dining Out',
  'grill': 'Dining Out',
  'warners at the bay': 'Dining Out',
  'gunyah': 'Dining Out',
  'general roberts': 'Dining Out',
  'wests': 'Dining Out',
  'mcdonald': 'Dining Out',
  'hamilton station': 'Dining Out',
  'sydney junction': 'Dining Out',
  'bws': 'Dining Out',
  'liquorland': 'Dining Out',
  'celebrations': 'Dining Out',
  'hungry jack': 'Dining Out',
  'kfc': 'Dining Out',
  'burger': 'Dining Out',
  'grilld': 'Dining Out',
  'dominos': 'Dining Out',
  'tighes hill': 'Dining Out',
  'subway': 'Dining Out',
  'guzman': 'Dining Out',
  'gyg': 'Dining Out',
  'sushi': 'Dining Out',
  'harrys': 'Dining Out',
  'chiefly': 'Dining Out',
  'pippi': 'Dining Out',
  'cafe': 'Dining Out',
  'bistro': 'Dining Out',
  'alhgroup': 'Dining Out',
  'venues': 'Dining Out',
  'indian': 'Dining Out',
  'tandori': 'Dining Out',
  'raj': 'Dining Out',
  'signal box': 'Dining Out',
  'wharf': 'Dining Out',
  'bowling': 'Dining Out',
  'jcsr': 'Dining Out',
  'p and g food': 'Dining Out',
  'prince': 'Dining Out',
  'mary ellen': 'Dining Out',
  'antojitos': 'Dining Out',
  'haps': 'Dining Out',
  'king street newcastle': 'Dining Out',
  'lass': 'Dining Out',
  'merewether surf': 'Dining Out',
  'jams': 'Dining Out',
  'trailblazers': 'Dining Out',
  'charlies rooftop': 'Dining Out',
  'rooftop': 'Dining Out',
  'alh venues': 'Dining Out',
  'leda gallery': 'Dining Out',
  'charcoal': 'Dining Out',
  'foodpod': 'Dining Out',
  'yummy': 'Dining Out',
  'trustee for the g': 'Dining Out',
  'grain store': 'Dining Out',
  'cooks hill brown': 'Dining Out',
  'cooks hill': 'Dining Out',
  'maddyg': 'Dining Out',
  
  // Food Delivery
  'uber eats': 'Food Delivery',
  'uber *eats': 'Food Delivery',
  'ubereats': 'Food Delivery',
  'doordash': 'Food Delivery',
  
  // Transport
  'transport': 'Transport',
  'opal': 'Transport',
  'uber trip': 'Transport',
  'uber *trip': 'Transport',
  'didi': 'Transport',
  '13cabs': 'Transport',
  'cabcharge': 'Transport',
  'transportfornsw': 'Transport',
  
  // Gym & Health
  'balance collective': 'Gym',
  'balance collect': 'Gym',
  'ipy*balance': 'Gym',
  'fitness': 'Gym',
  'revo': 'Gym',
  'urth': 'Gym',
  'chemist': 'Health',
  'pharmacy': 'Health',
  'appletree': 'Health',
  'doctor': 'Health',
  'hospital': 'Health',
  'nurse': 'Health',
  'physio': 'Health',
  'physiotherapy': 'Health',
  'regent': 'Health',
  'glasses': 'Health',
  'specsavers': 'Health',
  'aust hlth': 'Health',
  'medicare': 'Health',
  
  // Shopping
  'ucl co': 'Shopping',
  'kmart': 'Shopping',
  'afterpay': 'Shopping',
  'amazon': 'Shopping',
  'big w': 'Shopping',
  'temu': 'Shopping',
  'myer': 'Shopping',
  'rebelsport': 'Shopping',
  'bunnings': 'Shopping',
  'target': 'Shopping',
  'jb': 'Shopping',
  
  // Subscriptions
  'nba': 'Subscriptions',
  'prime': 'Subscriptions',
  'amazon prime': 'Subscriptions',
  'amznprimeau': 'Subscriptions',
  'youtube': 'Subscriptions',
  'netflix': 'Subscriptions',
  'binge': 'Subscriptions',
  'kayo': 'Subscriptions',
  'tennis': 'Subscriptions',
  'audible': 'Subscriptions',
  'real debrid': 'Subscriptions',
  'spotify': 'Subscriptions',
  'patreon': 'Subscriptions',
  
  // Betting
  'dablle': 'Betting',
  'dabble': 'Betting',
  'tatts': 'Betting',
  'tatts online': 'Betting',
  'sportsbet': 'Betting',
  'slaps': 'Betting',
  'hits': 'Betting',
  'slap': 'Betting',
  'bump': 'Betting',
  'atm': 'Betting',
  'finn': 'Betting',
  
  // Bills
  'prepaid': 'Bills',
  'aami': 'Bills',
  'ahm': 'Bills',
  'google': 'Bills',
  'apple.com': 'Bills',
  'rent': 'Bills',
  'felix': 'Bills',
  'circles': 'Bills',
  'prettygood': 'Bills',
  'pretty good': 'Bills',
  'qbe': 'Bills',
  'agl': 'Bills',
  'origin': 'Bills',
  'telstra': 'Bills',
  'optus': 'Bills',
  
  // Car
  'thompsons': 'Car',
  'automotive': 'Car',
  'nova': 'Car',
  '711': 'Car',
  '7-eleven': 'Car',
  'petrol': 'Car',
  
  // Sports
  'golf': 'Sports',
  'shortland waters': 'Sports',
  'charelstown golf': 'Sports',
  'basketball': 'Sports',
  'newcastle basketball': 'Sports',
  'basketballconnect': 'Sports',
  'driving range': 'Sports',
  'golf club': 'Sports',
  
  // Education
  'uon': 'Education',
  
  // Repayments (specific people/items)
  'repayment': 'Repayments',
  'vw': 'Repayments',
  'owed': 'Repayments',
  'pay back': 'Repayments',
  'borrowed': 'Repayments',
  'borrow': 'Repayments',
  'lend': 'Repayments',
  'sax': 'Repayments',
  'iphone': 'Repayments',
  
  // Income/Salary
  'cordel': 'Income',
  'oneforma': 'Income',
  'amazon flex': 'Income',
  'jobseeker': 'Income',
  'salary': 'Income',
  'deposit-salary': 'Income',
};

// All available categories (for dropdowns)
const ALL_CATEGORIES = [
  'Income',
  'Transfer',
  'Grocery',
  'Dining Out',
  'Food Delivery',
  'Shopping',
  'Transport',
  'Bills',
  'Subscriptions',
  'Gym',
  'Health',
  'Sports',
  'Car',
  'Betting',
  'Repayments',
  'Education',
  'Other',
];

// Main App Component
export default function FinanceTracker() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [debts, setDebts] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [assets, setAssets] = useState({ super: 0, investments: 0, property: 0 });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [workSchedule, setWorkSchedule] = useState({});
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [imports, setImports] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  // Combined category list
  const allCategories = [...ALL_CATEGORIES, ...customCategories].sort();

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('financeTrackerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setTransactions(data.transactions || []);
      setBudgets(data.budgets || {});
      setDebts(data.debts || []);
      setSavingsGoals(data.savingsGoals || []);
      setAccounts(data.accounts || []);
      setAssets(data.assets || { super: 0, investments: 0, property: 0 });
      setJobs(data.jobs || []);
      setWorkSchedule(data.workSchedule || {});
      setRecurringTransactions(data.recurringTransactions || []);
      setImports(data.imports || []);
      setCustomCategories(data.customCategories || []);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const data = { transactions, budgets, debts, savingsGoals, accounts, assets, jobs, workSchedule, recurringTransactions, imports, customCategories };
    localStorage.setItem('financeTrackerData', JSON.stringify(data));
  }, [transactions, budgets, debts, savingsGoals, accounts, assets, jobs, workSchedule, recurringTransactions, imports, customCategories]);

  // Parse CSV from Westpac - proper CSV parsing with quoted field handling
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      
      // Proper CSV parser that handles quoted fields
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };
      
      const lines = text.split('\n').filter(line => line.trim());
      const headers = parseCSVLine(lines[0]);
      
      const newTransactions = lines.slice(1).map((line, index) => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });

        // Extract date - handle DD/MM/YYYY format
        let date = obj['Date'] || '';
        if (date && date.includes('/')) {
          const parts = date.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }
        if (!date || date === '--') {
          date = new Date().toISOString().split('T')[0];
        }
        
        const description = obj['Narrative'] || obj['Description'] || obj['NARRATIVE'] || 'Unknown';
        
        // Handle Westpac's separate Debit/Credit columns
        const debitStr = obj['Debit Amount'] || '';
        const creditStr = obj['Credit Amount'] || '';
        
        const debitAmount = debitStr ? parseFloat(debitStr.replace(/[^0-9.-]/g, '')) : 0;
        const creditAmount = creditStr ? parseFloat(creditStr.replace(/[^0-9.-]/g, '')) : 0;
        
        // Debit = negative (money out), Credit = positive (money in)
        let amount = 0;
        if (creditAmount > 0) {
          amount = creditAmount;
        } else if (debitAmount > 0) {
          amount = -debitAmount;
        }
        
        const balanceStr = obj['Balance'] || obj['CLOSING_BAL'] || '0';
        const balance = parseFloat(balanceStr.replace(/[^0-9.-]/g, '')) || 0;

        // Auto-categorize based on merchant
        let category = 'Other';
        const descLower = description.toLowerCase();
        
        // First, check if it's an internal transfer (to exclude from totals)
        const isTransfer = 
          descLower.includes('tfr westpac') ||
          descLower.includes('tfr card') ||
          descLower.includes('tfr living expe') ||
          descLower.includes('transfer') ||
          descLower.includes('trf') ||
          (descLower.includes('withdrawal') && descLower.includes('mobile') && (descLower.includes('tfr') || descLower.includes('trf'))) ||
          (descLower.includes('deposit') && descLower.includes('online') && (descLower.includes('tfr') || descLower.includes('trf')));
        
        if (isTransfer) {
          category = 'Transfer';
        }
        // Income detection
        else if (amount > 0) {
          if (descLower.includes('salary') || 
              descLower.includes('deposit-salary') || 
              descLower.includes('jobseeker') || 
              descLower.includes('interest paid')) {
            category = 'Income';
          } else if (descLower.includes('deposit') && !descLower.includes('withdrawal')) {
            category = 'Income';
          }
        }
        // Expense categorization
        else if (category === 'Other') {
          for (const [merchant, cat] of Object.entries(MERCHANT_RULES)) {
            if (descLower.includes(merchant)) {
              category = cat;
              break;
            }
          }
        }

        return {
          id: `trans-${Date.now()}-${index}-${Math.random()}`,
          date,
          description,
          amount,
          balance,
          category,
          notes: '',
          recurring: false,
          importId: `import-${Date.now()}`, // Track which import this came from
        };
      }).filter(t => t.amount !== 0); // Remove transactions with no amount

      // Track this import
      const importRecord = {
        id: `import-${Date.now()}`,
        filename: file.name,
        date: new Date().toISOString(),
        count: newTransactions.length,
        transactionIds: newTransactions.map(t => t.id),
      };

      setImports(prev => [importRecord, ...prev]);
      setTransactions(prev => [...newTransactions, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setShowUploadModal(false);
    };
    reader.readAsText(file);
  };

  // Detect recurring transactions (moved before metrics to avoid initialization error)
  const detectRecurring = (trans) => {
    const grouped = {};
    trans.forEach(t => {
      const key = `${t.description}-${Math.round(Math.abs(t.amount))}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    
    return Object.entries(grouped)
      .filter(([key, count]) => count >= 2)
      .map(([key, count]) => {
        const [description, amount] = key.split('-');
        return { description, amount: parseFloat(amount), count };
      });
  };

  // Calculate financial metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Exclude transfers from income/expense calculations
    const nonTransferTransactions = monthTransactions.filter(t => t.category !== 'Transfer');

    const income = nonTransferTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = nonTransferTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Category breakdown (excluding transfers)
    const categorySpending = {};
    nonTransferTransactions.filter(t => t.amount < 0).forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(t.amount);
    });

    // Total savings in accounts
    const totalSavings = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Total debt
    const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
    
    // Net worth
    const totalAssets = totalSavings + assets.super + assets.investments + assets.property;
    const netWorth = totalAssets - totalDebt;

    // Recurring transactions (appear multiple times with similar amounts)
    const recurring = detectRecurring(transactions);

    return {
      income,
      expenses,
      balance: income - expenses,
      categorySpending,
      totalSavings,
      totalDebt,
      netWorth,
      totalAssets,
      recurring,
    };
  }, [transactions, accounts, debts, assets]);

  // Theme classes
  const bg = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bg} ${textPrimary} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${cardBg} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform rotate-12">
                <DollarSign className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <Upload size={18} />
                <span>Import CSV</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:opacity-80 transition-all`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${cardBg} border-b ${borderColor} sticky top-16 z-40 backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'transactions', label: 'Transactions', icon: DollarSign },
              { id: 'budget', label: 'Budget', icon: Target },
              { id: 'breakdown', label: 'Spending Breakdown', icon: PieChart },
              { id: 'forecast', label: 'Cash Flow Forecast', icon: Calendar },
              { id: 'debts', label: 'Debts', icon: CreditCard },
              { id: 'savings', label: 'Savings Goals', icon: PiggyBank },
              { id: 'networth', label: 'Net Worth', icon: TrendingUp },
              { id: 'reports', label: 'Reports', icon: Download },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(nav => (
              <button
                key={nav.id}
                onClick={() => setCurrentView(nav.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  currentView === nav.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
              >
                <nav.icon size={18} />
                <span className="text-sm font-medium">{nav.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <DashboardView 
            metrics={metrics} 
            transactions={transactions}
            budgets={budgets}
            savingsGoals={savingsGoals}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            setTransactions={setTransactions}
            allCategories={allCategories}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'budget' && (
          <BudgetView
            transactions={transactions}
            budgets={budgets}
            setBudgets={setBudgets}
            metrics={metrics}
            allCategories={allCategories}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'breakdown' && (
          <SpendingBreakdownView
            transactions={transactions}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'forecast' && (
          <ForecastView
            transactions={transactions}
            accounts={accounts}
            setAccounts={setAccounts}
            jobs={jobs}
            setJobs={setJobs}
            workSchedule={workSchedule}
            setWorkSchedule={setWorkSchedule}
            recurringTransactions={recurringTransactions}
            setRecurringTransactions={setRecurringTransactions}
            debts={debts}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'debts' && (
          <DebtsView
            debts={debts}
            setDebts={setDebts}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'savings' && (
          <SavingsView
            savingsGoals={savingsGoals}
            setSavingsGoals={setSavingsGoals}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'networth' && (
          <NetWorthView
            metrics={metrics}
            accounts={accounts}
            setAccounts={setAccounts}
            assets={assets}
            setAssets={setAssets}
            debts={debts}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'reports' && (
          <ReportsView
            transactions={transactions}
            metrics={metrics}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
        
        {currentView === 'settings' && (
          <SettingsView
            transactions={transactions}
            setTransactions={setTransactions}
            imports={imports}
            setImports={setImports}
            customCategories={customCategories}
            setCustomCategories={setCustomCategories}
            allCategories={allCategories}
            setBudgets={setBudgets}
            setDebts={setDebts}
            setSavingsGoals={setSavingsGoals}
            setAccounts={setAccounts}
            setAssets={setAssets}
            setJobs={setJobs}
            setWorkSchedule={setWorkSchedule}
            setRecurringTransactions={setRecurringTransactions}
            darkMode={darkMode}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}
      </main>

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Import Westpac CSV</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X size={20} />
              </button>
            </div>
            
            <p className={`${textSecondary} mb-4`}>
              Export your transaction history from Westpac Online Banking as a CSV file, then upload it here.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">Choose file</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>
              <p className={`${textSecondary} text-sm mt-2`}>or drag and drop</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Dashboard View Component
function DashboardView({ metrics, transactions, budgets, savingsGoals, darkMode, cardBg, textSecondary, borderColor }) {
  // Spending by category for pie chart
  const categoryData = Object.entries(metrics.categorySpending)
    .filter(([cat]) => cat !== 'Income')
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Last 6 months trend
  const monthlyTrend = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      const monthTrans = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === year;
      });
      
      const income = monthTrans.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTrans.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      months.push({ month, income, expenses, savings: income - expenses });
    }
    return months;
  }, [transactions]);

  // Budget alerts
  const budgetAlerts = Object.entries(budgets).map(([category, budget]) => {
    const spent = metrics.categorySpending[category] || 0;
    const percentage = (spent / budget) * 100;
    return { category, budget, spent, percentage };
  }).filter(b => b.percentage >= 75);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Income This Month"
          value={metrics.income}
          icon={TrendingUp}
          color="success"
          darkMode={darkMode}
          cardBg={cardBg}
          textSecondary={textSecondary}
        />
        <StatCard
          title="Expenses This Month"
          value={metrics.expenses}
          icon={TrendingDown}
          color="danger"
          darkMode={darkMode}
          cardBg={cardBg}
          textSecondary={textSecondary}
        />
        <StatCard
          title="Net Worth"
          value={metrics.netWorth}
          icon={DollarSign}
          color="primary"
          darkMode={darkMode}
          cardBg={cardBg}
          textSecondary={textSecondary}
        />
        <StatCard
          title="Savings Goals Progress"
          value={savingsGoals.length > 0 ? 
            (savingsGoals.reduce((sum, g) => sum + g.current, 0) / savingsGoals.reduce((sum, g) => sum + g.target, 0)) * 100 : 0
          }
          icon={Target}
          color="purple"
          isPercentage
          darkMode={darkMode}
          cardBg={cardBg}
          textSecondary={textSecondary}
        />
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold">Budget Alerts</h2>
          </div>
          <div className="space-y-3">
            {budgetAlerts.map(alert => (
              <div key={alert.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{alert.category}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          alert.percentage >= 100 ? 'bg-red-500' : alert.percentage >= 90 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      alert.percentage >= 100 ? 'text-red-500' : alert.percentage >= 90 ? 'text-orange-500' : 'text-yellow-500'
                    }`}>
                      {alert.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={textSecondary}>${alert.spent.toFixed(0)} / ${alert.budget}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown */}
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h2 className="text-xl font-bold mb-4">Spending Breakdown</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || COLORS.primary} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No spending data yet
            </div>
          )}
        </div>

        {/* 6 Month Trend */}
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h2 className="text-xl font-bold mb-4">6 Month Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="income" stackId="1" stroke={COLORS.success} fill={COLORS.successLight} name="Income" />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke={COLORS.danger} fill={COLORS.dangerLight} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recurring Transactions */}
      {metrics.recurring.length > 0 && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold">Recurring Transactions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.recurring.slice(0, 6).map((rec, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${borderColor}`}>
                <p className="font-medium truncate">{rec.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={textSecondary}>${rec.amount.toFixed(2)}</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {rec.count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions.slice(0, 10).map(t => (
            <div key={t.id} className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
              <div className="flex-1">
                <p className="font-medium">{t.description}</p>
                <p className={`text-sm ${textSecondary}`}>{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs font-medium`} style={{ 
                  backgroundColor: `${CATEGORY_COLORS[t.category]}20`,
                  color: CATEGORY_COLORS[t.category]
                }}>
                  {t.category}
                </span>
                <span className={`font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount >= 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Transactions View Component
function TransactionsView({ transactions, setTransactions, allCategories, darkMode, cardBg, textSecondary, borderColor }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData(transaction);
  };

  const saveEdit = () => {
    setTransactions(prev => prev.map(t => t.id === editingId ? editData : t));
    setEditingId(null);
  };

  const deleteTransaction = (id) => {
    if (window.confirm('Delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2`}>Search</label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2`}>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            >
              <option>All</option>
              {allCategories.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`${cardBg} rounded-xl border ${borderColor} shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {editingId === t.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          value={editData.date}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                          className={`px-2 py-1 rounded border ${borderColor} ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          className={`w-full px-2 py-1 rounded border ${borderColor} ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({...editData, category: e.target.value})}
                          className={`px-2 py-1 rounded border ${borderColor} ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                        >
                          {allCategories.map(cat => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={editData.amount}
                          onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                          className={`w-24 px-2 py-1 rounded border ${borderColor} ${darkMode ? 'bg-gray-600' : 'bg-white'} text-right`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">{t.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium`} style={{ 
                          backgroundColor: `${CATEGORY_COLORS[t.category]}20`,
                          color: CATEGORY_COLORS[t.category]
                        }}>
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {t.amount >= 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => startEdit(t)} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Budget View Component
function BudgetView({ transactions, budgets, setBudgets, metrics, allCategories, darkMode, cardBg, textSecondary, borderColor }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  const saveBudget = (category) => {
    setBudgets(prev => ({ ...prev, [category]: parseFloat(budgetAmount) || 0 }));
    setEditingCategory(null);
    setBudgetAmount('');
  };

  const categories = allCategories.filter(c => c !== 'Income' && c !== 'Transfer');

  return (
    <div className="space-y-6">
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-2xl font-bold mb-6">Monthly Budgets</h2>
        
        <div className="space-y-4">
          {categories.map(category => {
            const budget = budgets[category] || 0;
            const spent = metrics.categorySpending[category] || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const remaining = budget - spent;

            return (
              <div key={category} className={`p-4 rounded-lg border ${borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
                    <h3 className="font-semibold text-lg">{category}</h3>
                  </div>
                  {editingCategory === category ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        placeholder="Budget"
                        className={`w-32 px-3 py-1 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
                        autoFocus
                      />
                      <button onClick={() => saveBudget(category)} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded">
                        <Check size={20} />
                      </button>
                      <button onClick={() => setEditingCategory(null)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setBudgetAmount(budget.toString());
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {budget > 0 ? `Edit ($${budget})` : 'Set Budget'}
                    </button>
                  )}
                </div>

                {budget > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={textSecondary}>
                        ${spent.toFixed(2)} of ${budget.toFixed(2)}
                      </span>
                      <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          percentage >= 100 ? 'bg-red-500' :
                          percentage >= 90 ? 'bg-orange-500' :
                          percentage >= 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs mt-1">
                      <span className={textSecondary}>{percentage.toFixed(1)}% used</span>
                      {percentage >= 75 && (
                        <span className={`font-medium ${
                          percentage >= 100 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {percentage >= 100 ? 'Budget exceeded!' : 'Approaching limit'}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Debts View Component
function DebtsView({ debts, setDebts, darkMode, cardBg, textSecondary, borderColor }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [newDebt, setNewDebt] = useState({
    name: '',
    amount: '',
    interestRate: '',
    minimumPayment: '',
    type: 'Personal Loan',
  });

  const addDebt = () => {
    if (!newDebt.name || !newDebt.amount) return;
    
    const debt = {
      id: `debt-${Date.now()}`,
      name: newDebt.name,
      amount: parseFloat(newDebt.amount),
      originalAmount: parseFloat(newDebt.amount),
      interestRate: parseFloat(newDebt.interestRate) || 0,
      minimumPayment: parseFloat(newDebt.minimumPayment) || 0,
      type: newDebt.type,
      payments: [],
    };
    
    setDebts(prev => [...prev, debt]);
    setNewDebt({ name: '', amount: '', interestRate: '', minimumPayment: '', type: 'Personal Loan' });
    setShowAddForm(false);
  };

  const makePayment = (debtId, amount) => {
    setDebts(prev => prev.map(debt => {
      if (debt.id === debtId) {
        const payment = {
          id: `payment-${Date.now()}`,
          amount: parseFloat(amount),
          date: new Date().toISOString().split('T')[0],
        };
        return {
          ...debt,
          amount: Math.max(0, debt.amount - parseFloat(amount)),
          payments: [...debt.payments, payment],
        };
      }
      return debt;
    }));
  };

  const deleteDebt = (id) => {
    if (window.confirm('Delete this debt?')) {
      setDebts(prev => prev.filter(d => d.id !== id));
    }
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + (d.originalAmount - d.amount), 0);

  // Calculate debt-free date based on minimum payments
  const calculateDebtFreeDate = () => {
    let remainingDebt = totalDebt;
    let months = 0;
    const monthlyPayment = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
    
    if (monthlyPayment <= 0) return null;
    
    while (remainingDebt > 0 && months < 600) { // Max 50 years
      const monthlyInterest = debts.reduce((sum, d) => sum + (d.amount * (d.interestRate / 100 / 12)), 0);
      remainingDebt = remainingDebt + monthlyInterest - monthlyPayment;
      months++;
    }
    
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const debtFreeDate = calculateDebtFreeDate();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Total Debt</h3>
          <p className="text-3xl font-bold text-red-600">${totalDebt.toFixed(2)}</p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Total Paid Off</h3>
          <p className="text-3xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Debt-Free Date</h3>
          <p className="text-2xl font-bold">
            {debtFreeDate ? debtFreeDate.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' }) : 'Set payments'}
          </p>
        </div>
      </div>

      {/* Add Debt Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        <Plus size={20} />
        <span>Add Debt</span>
      </button>

      {/* Add Debt Form */}
      {showAddForm && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className="text-lg font-bold mb-4">Add New Debt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Debt name (e.g., HECS-HELP, Mum, Dad)"
              value={newDebt.name}
              onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <select
              value={newDebt.type}
              onChange={(e) => setNewDebt({...newDebt, type: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            >
              <option>HECS-HELP</option>
              <option>Personal Loan</option>
              <option>Credit Card</option>
              <option>Family Loan</option>
              <option>Other</option>
            </select>
            <input
              type="number"
              placeholder="Amount owed"
              value={newDebt.amount}
              onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <input
              type="number"
              placeholder="Interest rate (% p.a.)"
              value={newDebt.interestRate}
              onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <input
              type="number"
              placeholder="Minimum monthly payment"
              value={newDebt.minimumPayment}
              onChange={(e) => setNewDebt({...newDebt, minimumPayment: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button onClick={addDebt} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Debt
            </button>
            <button onClick={() => setShowAddForm(false)} className={`px-4 py-2 rounded-lg border ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-700`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Debts List */}
      <div className="space-y-4">
        {debts.map(debt => {
          const progress = ((debt.originalAmount - debt.amount) / debt.originalAmount) * 100;
          const paymentAmount = paymentAmounts[debt.id] || '';

          return (
            <div key={debt.id} className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{debt.name}</h3>
                  <span className={`text-sm ${textSecondary}`}>{debt.type}</span>
                </div>
                <button onClick={() => deleteDebt(debt.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className={`text-sm ${textSecondary}`}>Remaining</p>
                  <p className="text-2xl font-bold text-red-600">${debt.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Original</p>
                  <p className="text-lg font-semibold">${debt.originalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Interest Rate</p>
                  <p className="text-lg font-semibold">{debt.interestRate}% p.a.</p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Min. Payment</p>
                  <p className="text-lg font-semibold">${debt.minimumPayment}/mo</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className={textSecondary}>Progress</span>
                  <span className="font-medium">{progress.toFixed(1)}% paid off</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Payment amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmounts(prev => ({...prev, [debt.id]: e.target.value}))}
                  className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  onClick={() => {
                    if (paymentAmount) {
                      makePayment(debt.id, paymentAmount);
                      setPaymentAmounts(prev => ({...prev, [debt.id]: ''}));
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Make Payment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {debts.length === 0 && (
        <div className={`${cardBg} rounded-xl p-12 border ${borderColor} shadow-lg text-center`}>
          <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
          <p className={`text-lg ${textSecondary}`}>No debts tracked yet. Add your HECS-HELP, personal loans, or family debts to get started!</p>
        </div>
      )}
    </div>
  );
}

// Savings View Component
function SavingsView({ savingsGoals, setSavingsGoals, darkMode, cardBg, textSecondary, borderColor }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [contributionAmounts, setContributionAmounts] = useState({});
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
  });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    
    const goal = {
      id: `goal-${Date.now()}`,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      deadline: newGoal.deadline,
      contributions: [],
    };
    
    setSavingsGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', target: '', current: '', deadline: '' });
    setShowAddForm(false);
  };

  const addContribution = (goalId, amount) => {
    setSavingsGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const contribution = {
          id: `contrib-${Date.now()}`,
          amount: parseFloat(amount),
          date: new Date().toISOString().split('T')[0],
        };
        return {
          ...goal,
          current: Math.min(goal.target, goal.current + parseFloat(amount)),
          contributions: [...goal.contributions, contribution],
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (id) => {
    if (window.confirm('Delete this savings goal?')) {
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Goal Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        <Plus size={20} />
        <span>Add Savings Goal</span>
      </button>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className="text-lg font-bold mb-4">Create New Savings Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal name (e.g., House Deposit, Emergency Fund)"
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <input
              type="number"
              placeholder="Target amount"
              value={newGoal.target}
              onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <input
              type="number"
              placeholder="Current amount (optional)"
              value={newGoal.current}
              onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <input
              type="date"
              placeholder="Target date (optional)"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button onClick={addGoal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Goal
            </button>
            <button onClick={() => setShowAddForm(false)} className={`px-4 py-2 rounded-lg border ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-700`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const daysUntilDeadline = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
          const contributionAmount = contributionAmounts[goal.id] || '';

          return (
            <div key={goal.id} className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{goal.name}</h3>
                  {goal.deadline && (
                    <p className={`text-sm ${textSecondary}`}>
                      Target: {new Date(goal.deadline).toLocaleDateString('en-AU')}
                      {daysUntilDeadline && (
                        <span className={`ml-2 ${daysUntilDeadline < 30 ? 'text-orange-500' : ''}`}>
                          ({daysUntilDeadline} days)
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-3xl font-bold text-green-600">${goal.current.toFixed(2)}</span>
                  <span className={`text-lg ${textSecondary}`}>/ ${goal.target.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                  <div
                    className="h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>{progress.toFixed(1)}% complete</span>
                  <span className="font-medium text-blue-600">${remaining.toFixed(2)} to go</span>
                </div>
              </div>

              {progress >= 100 && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg flex items-center space-x-2 text-green-700 dark:text-green-300">
                  <CheckCircle size={20} />
                  <span className="font-medium">Goal achieved! 🎉</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Contribution amount"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmounts(prev => ({...prev, [goal.id]: e.target.value}))}
                  className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  onClick={() => {
                    if (contributionAmount) {
                      addContribution(goal.id, contributionAmount);
                      setContributionAmounts(prev => ({...prev, [goal.id]: ''}));
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  Add $
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {savingsGoals.length === 0 && (
        <div className={`${cardBg} rounded-xl p-12 border ${borderColor} shadow-lg text-center`}>
          <PiggyBank size={48} className="mx-auto mb-4 text-gray-400" />
          <p className={`text-lg ${textSecondary}`}>No savings goals yet. Set your first goal to start tracking your progress!</p>
        </div>
      )}
    </div>
  );
}

// Net Worth View Component
function NetWorthView({ metrics, accounts, setAccounts, assets, setAssets, debts, darkMode, cardBg, textSecondary, borderColor }) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', balance: '', type: 'Savings' });

  const addAccount = () => {
    if (!newAccount.name || !newAccount.balance) return;
    setAccounts(prev => [...prev, { 
      id: `acc-${Date.now()}`,
      ...newAccount,
      balance: parseFloat(newAccount.balance)
    }]);
    setNewAccount({ name: '', balance: '', type: 'Savings' });
    setShowAddAccount(false);
  };

  const deleteAccount = (id) => {
    if (window.confirm('Delete this account?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const netWorthData = [
    { name: 'Accounts', value: metrics.totalSavings, color: COLORS.success },
    { name: 'Super', value: assets.super, color: COLORS.primary },
    { name: 'Investments', value: assets.investments, color: COLORS.purple },
    { name: 'Property', value: assets.property, color: COLORS.orange },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Net Worth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Total Assets</h3>
          <p className="text-3xl font-bold text-green-600">${metrics.totalAssets.toFixed(2)}</p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Total Liabilities</h3>
          <p className="text-3xl font-bold text-red-600">${metrics.totalDebt.toFixed(2)}</p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Net Worth</h3>
          <p className={`text-3xl font-bold ${metrics.netWorth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${metrics.netWorth.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Assets Breakdown Chart */}
      {netWorthData.length > 0 && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h2 className="text-xl font-bold mb-4">Assets Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={netWorthData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: $${value.toFixed(0)} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                dataKey="value"
              >
                {netWorthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bank Accounts */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Bank Accounts</h2>
          <button
            onClick={() => setShowAddAccount(!showAddAccount)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus size={18} />
            <span>Add Account</span>
          </button>
        </div>

        {showAddAccount && (
          <div className="mb-4 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900 bg-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Account name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <input
                type="number"
                placeholder="Balance"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <select
                value={newAccount.type}
                onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <option>Savings</option>
                <option>Everyday</option>
                <option>Term Deposit</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-3">
              <button onClick={addAccount} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Add
              </button>
              <button onClick={() => setShowAddAccount(false)} className={`px-4 py-2 rounded border ${borderColor} text-sm`}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {accounts.map(acc => (
            <div key={acc.id} className={`flex items-center justify-between p-4 rounded-lg border ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-700`}>
              <div>
                <p className="font-medium">{acc.name}</p>
                <p className={`text-sm ${textSecondary}`}>{acc.type}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-lg">${acc.balance.toFixed(2)}</span>
                <button onClick={() => deleteAccount(acc.id)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Assets */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Other Assets</h2>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2`}>Superannuation</label>
            <input
              type="number"
              value={assets.super}
              onChange={(e) => setAssets({...assets, super: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2`}>Investments (Stocks, ETFs, Crypto)</label>
            <input
              type="number"
              value={assets.investments}
              onChange={(e) => setAssets({...assets, investments: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2`}>Property Value</label>
            <input
              type="number"
              value={assets.property}
              onChange={(e) => setAssets({...assets, property: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              placeholder="$0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reports View Component
function ReportsView({ transactions, metrics, darkMode, cardBg, textSecondary, borderColor }) {
  const [reportType, setReportType] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get unique years from transactions
  const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort((a, b) => b - a);

  // Financial year data (July-June)
  const financialYearData = useMemo(() => {
    const fyStart = new Date(selectedYear - 1, 6, 1); // July 1
    const fyEnd = new Date(selectedYear, 5, 30); // June 30
    
    const fyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= fyStart && date <= fyEnd;
    });

    const income = fyTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = fyTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const categoryBreakdown = {};
    fyTransactions.filter(t => t.amount < 0).forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Math.abs(t.amount);
    });

    return { income, expenses, categoryBreakdown, transactions: fyTransactions };
  }, [transactions, selectedYear]);

  // HECS threshold calculator
  const hecsThresholds = [
    { income: 54435, rate: 0.0 },
    { income: 62850, rate: 0.01 },
    { income: 66620, rate: 0.02 },
    { income: 70618, rate: 0.025 },
    { income: 74855, rate: 0.03 },
    { income: 79346, rate: 0.035 },
    { income: 84107, rate: 0.04 },
    { income: 89154, rate: 0.045 },
    { income: 94503, rate: 0.05 },
    { income: 100174, rate: 0.055 },
    { income: 106184, rate: 0.06 },
    { income: 112556, rate: 0.065 },
    { income: 119309, rate: 0.07 },
    { income: 126468, rate: 0.075 },
    { income: 134056, rate: 0.08 },
    { income: 142100, rate: 0.085 },
    { income: 150626, rate: 0.09 },
    { income: 159663, rate: 0.095 },
    { income: Infinity, rate: 0.10 },
  ];

  const annualIncome = financialYearData.income;
  const hecsRate = hecsThresholds.find(t => annualIncome <= t.income)?.rate || 0;
  const hecsRepayment = annualIncome * hecsRate;

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
          >
            <option value="monthly">Monthly Report</option>
            <option value="financial">Financial Year (July-June)</option>
            <option value="hecs">HECS Calculator</option>
            <option value="comparison">Year Comparison</option>
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button className="ml-auto flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Financial Year Report */}
      {reportType === 'financial' && (
        <>
          <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
            <h2 className="text-2xl font-bold mb-4">Financial Year {selectedYear - 1}/{selectedYear}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Total Income</p>
                <p className="text-3xl font-bold text-green-600">${financialYearData.income.toFixed(2)}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">${financialYearData.expenses.toFixed(2)}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Net Savings</p>
                <p className={`text-3xl font-bold ${financialYearData.income - financialYearData.expenses >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ${(financialYearData.income - financialYearData.expenses).toFixed(2)}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-3">Expense Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(financialYearData.categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / financialYearData.expenses) * 100;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{category}</span>
                          <span className={textSecondary}>${amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: CATEGORY_COLORS[category] || COLORS.primary
                            }}
                          />
                        </div>
                      </div>
                      <span className={`ml-4 text-sm ${textSecondary}`}>{percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* HECS Calculator */}
      {reportType === 'hecs' && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4">HECS-HELP Repayment Calculator</h2>
          <p className={`${textSecondary} mb-6`}>Based on FY {selectedYear - 1}/{selectedYear} income</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-900 bg-opacity-20 rounded-lg">
              <p className="text-sm font-medium mb-2">Estimated Annual Income</p>
              <p className="text-4xl font-bold text-blue-600">${annualIncome.toFixed(2)}</p>
            </div>
            <div className="p-6 bg-purple-50 dark:bg-purple-900 bg-opacity-20 rounded-lg">
              <p className="text-sm font-medium mb-2">HECS Repayment ({(hecsRate * 100).toFixed(1)}%)</p>
              <p className="text-4xl font-bold text-purple-600">${hecsRepayment.toFixed(2)}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3">HECS Thresholds (2024-25)</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {hecsThresholds.slice(0, -1).map((threshold, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg ${annualIncome > threshold.income ? 'bg-green-50 dark:bg-green-900 bg-opacity-20' : 'bg-gray-50 dark:bg-gray-800'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    ${threshold.income.toLocaleString()} {idx < hecsThresholds.length - 2 ? `- $${hecsThresholds[idx + 1].income.toLocaleString()}` : '+'}
                  </span>
                  <span className="font-bold">{(threshold.rate * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Year Comparison */}
      {reportType === 'comparison' && years.length > 1 && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4">Year-over-Year Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={years.map(year => {
              const yearTrans = transactions.filter(t => new Date(t.date).getFullYear() === year);
              const income = yearTrans.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
              const expenses = yearTrans.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
              return { year, income, expenses };
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="year" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="income" fill={COLORS.success} name="Income" />
              <Bar dataKey="expenses" fill={COLORS.danger} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Settings View Component
function SettingsView({ 
  transactions, 
  setTransactions, 
  imports, 
  setImports,
  customCategories,
  setCustomCategories,
  allCategories,
  setBudgets,
  setDebts,
  setSavingsGoals,
  setAccounts,
  setAssets,
  setJobs,
  setWorkSchedule,
  setRecurringTransactions,
  darkMode, 
  cardBg, 
  textSecondary, 
  borderColor 
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Clear all data
  const clearAllData = () => {
    setTransactions([]);
    setBudgets({});
    setDebts([]);
    setSavingsGoals([]);
    setAccounts([]);
    setAssets({ super: 0, investments: 0, property: 0 });
    setJobs([]);
    setWorkSchedule({});
    setRecurringTransactions([]);
    setImports([]);
    setCustomCategories([]);
    setShowClearConfirm(false);
    alert('All data cleared successfully!');
  };

  // Add new category
  const addCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      alert('Please enter a category name');
      return;
    }
    if (allCategories.includes(trimmed)) {
      alert('Category already exists!');
      return;
    }
    setCustomCategories(prev => [...prev, trimmed].sort());
    setNewCategoryName('');
  };

  // Delete custom category
  const deleteCategory = (categoryName) => {
    if (window.confirm(`Delete category "${categoryName}"? Transactions with this category will be changed to "Other".`)) {
      setCustomCategories(prev => prev.filter(c => c !== categoryName));
      // Update transactions with this category to "Other"
      setTransactions(prev => prev.map(t => 
        t.category === categoryName ? { ...t, category: 'Other' } : t
      ));
    }
  };

  // Delete specific import
  const deleteImport = (importId) => {
    if (window.confirm('Delete this import? All associated transactions will be removed.')) {
      // Remove transactions from this import
      setTransactions(prev => prev.filter(t => t.importId !== importId));
      // Remove import record
      setImports(prev => prev.filter(imp => imp.id !== importId));
    }
  };

  // Export all data as JSON
  const exportData = () => {
    const data = {
      transactions,
      imports,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings & Data Management</h1>

      {/* Data Export */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center space-x-3 mb-4">
          <Download className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold">Export Data</h2>
        </div>
        <p className={`${textSecondary} mb-4`}>
          Download a backup of all your financial data as a JSON file.
        </p>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Download size={18} />
          <span>Export Backup</span>
        </button>
        {showExportSuccess && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Data exported successfully!</span>
          </div>
        )}
      </div>

      {/* Category Management */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center space-x-3 mb-4">
          <Tag className="text-indigo-500" size={24} />
          <h2 className="text-xl font-bold">Manage Categories</h2>
        </div>
        <p className={`${textSecondary} mb-4`}>
          Add custom categories for your transactions. These will appear in all category dropdowns.
        </p>

        {/* Add New Category */}
        <div className="flex space-x-3 mb-6">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Enter new category name..."
            className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          <button
            onClick={addCategory}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
          >
            Add Category
          </button>
        </div>

        {/* Built-in Categories */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <span>Built-in Categories</span>
            <span className={`text-sm ${textSecondary}`}>({ALL_CATEGORIES.length})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(cat => (
              <div
                key={cat}
                className={`px-3 py-1 rounded-full border ${borderColor} text-sm`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <span>Your Custom Categories</span>
              <span className={`text-sm ${textSecondary}`}>({customCategories.length})</span>
            </h3>
            <div className="space-y-2">
              {customCategories.map(cat => (
                <div
                  key={cat}
                  className={`flex items-center justify-between p-3 rounded-lg border ${borderColor}`}
                >
                  <span className="font-medium">{cat}</span>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {customCategories.length === 0 && (
          <div className="text-center py-6">
            <Tag size={48} className="mx-auto mb-4 text-gray-400" />
            <p className={textSecondary}>No custom categories yet. Add one above!</p>
          </div>
        )}
      </div>

      {/* Import Management */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="text-purple-500" size={24} />
          <h2 className="text-xl font-bold">Manage Imports</h2>
        </div>
        <p className={`${textSecondary} mb-4`}>
          View and manage your CSV imports. You can delete individual imports and their transactions.
        </p>

        {imports.length === 0 ? (
          <div className="text-center py-8">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className={textSecondary}>No imports yet. Upload a CSV file to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {imports.map(imp => (
              <div key={imp.id} className={`p-4 rounded-lg border ${borderColor} flex items-center justify-between`}>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-semibold">{imp.filename}</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {imp.count} transactions
                    </span>
                  </div>
                  <p className={`text-sm ${textSecondary}`}>
                    Imported: {new Date(imp.date).toLocaleString('en-AU')}
                  </p>
                </div>
                <button
                  onClick={() => deleteImport(imp.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                  title="Delete this import"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Statistics */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="text-green-500" size={24} />
          <h2 className="text-xl font-bold">Data Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${borderColor} text-center`}>
            <p className={`text-sm ${textSecondary} mb-1`}>Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
          <div className={`p-4 rounded-lg border ${borderColor} text-center`}>
            <p className={`text-sm ${textSecondary} mb-1`}>Total Imports</p>
            <p className="text-2xl font-bold">{imports.length}</p>
          </div>
          <div className={`p-4 rounded-lg border ${borderColor} text-center`}>
            <p className={`text-sm ${textSecondary} mb-1`}>Income Transactions</p>
            <p className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.amount > 0).length}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${borderColor} text-center`}>
            <p className={`text-sm ${textSecondary} mb-1`}>Expense Transactions</p>
            <p className="text-2xl font-bold text-red-600">
              {transactions.filter(t => t.amount < 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${cardBg} rounded-xl p-6 border-2 border-red-500 shadow-lg`}>
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="text-red-500" size={24} />
          <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
        </div>
        <p className={`${textSecondary} mb-4`}>
          <strong>Warning:</strong> This will permanently delete ALL your data including transactions, budgets, debts, savings goals, and settings. This action cannot be undone!
        </p>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Clear All Data
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="font-bold text-red-900 dark:text-red-100 mb-2">
                Are you absolutely sure?
              </p>
              <p className="text-sm text-red-800 dark:text-red-200">
                This will delete {transactions.length} transactions, {imports.length} imports, and all other data. Type "DELETE" to confirm.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`px-4 py-2 rounded-lg border ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-700 transition-all`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App Info */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">About FinanceFlow</h2>
        <div className="space-y-2 text-sm">
          <p className={textSecondary}>
            <strong>Version:</strong> 1.0.0
          </p>
          <p className={textSecondary}>
            <strong>Storage:</strong> All data is stored locally in your browser (localStorage)
          </p>
          <p className={textSecondary}>
            <strong>Privacy:</strong> No data is sent to any server. Your financial information stays on your device.
          </p>
          <p className={textSecondary}>
            <strong>Backup:</strong> Use the "Export Backup" feature regularly to save your data.
          </p>
        </div>
      </div>
    </div>
  );
}

// Spending Breakdown View Component
function SpendingBreakdownView({ transactions, darkMode, cardBg, textSecondary, borderColor }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState('1month'); // 1week, 2weeks, 1month, 3months, 6months, 1year, all

  // Get date range based on selection
  const getDateRange = () => {
    const now = new Date();
    const ranges = {
      '1week': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '2weeks': new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      '1month': new Date(now.getFullYear(), now.getMonth(), 1),
      '3months': new Date(now.getFullYear(), now.getMonth() - 2, 1),
      '6months': new Date(now.getFullYear(), now.getMonth() - 5, 1),
      '1year': new Date(now.getFullYear() - 1, now.getMonth(), 1),
      'all': new Date(2000, 0, 1),
    };
    return ranges[timeRange];
  };

  // Filter transactions excluding transfers
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= getDateRange() && t.category !== 'Transfer' && t.category !== 'Income';
  });

  // Calculate category totals
  const categoryTotals = {};
  const categoryMonthly = {};
  
  filteredTransactions.forEach(t => {
    if (t.amount < 0) {
      const cat = t.category;
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Total spending per category
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
      
      // Monthly spending per category
      if (!categoryMonthly[cat]) categoryMonthly[cat] = {};
      categoryMonthly[cat][monthKey] = (categoryMonthly[cat][monthKey] || 0) + Math.abs(t.amount);
    }
  });

  // Sort categories by total spending
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, total]) => ({
      name: cat,
      total,
      monthly: categoryMonthly[cat] || {},
      transactions: filteredTransactions.filter(t => t.category === cat && t.amount < 0),
    }));

  // Calculate total expenses
  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Get all unique months in range
  const allMonths = [...new Set(
    filteredTransactions.map(t => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })
  )].sort().reverse();

  // For Repayments category, extract recipient details
  const getRepaymentDetails = (transaction) => {
    const desc = transaction.description.toLowerCase();
    
    // Extract name patterns
    if (desc.includes('christopher') || desc.includes('christophe')) return 'Dad (Christopher)';
    if (desc.includes('nicole')) return 'Mum (Nicole)';
    if (desc.includes('den vw') || desc.includes('vw')) return 'Car (VW)';
    if (desc.includes('sax')) return 'Sax';
    if (desc.includes('iphone')) return 'iPhone';
    if (desc.includes('levi')) return 'Levi';
    
    return 'Other';
  };

  // Group repayments by recipient
  const repaymentsByRecipient = {};
  if (selectedCategory === 'Repayments') {
    sortedCategories.find(c => c.name === 'Repayments')?.transactions.forEach(t => {
      const recipient = getRepaymentDetails(t);
      if (!repaymentsByRecipient[recipient]) {
        repaymentsByRecipient[recipient] = { total: 0, count: 0, transactions: [] };
      }
      repaymentsByRecipient[recipient].total += Math.abs(t.amount);
      repaymentsByRecipient[recipient].count += 1;
      repaymentsByRecipient[recipient].transactions.push(t);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Spending Breakdown</h1>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        >
          <option value="1week">Last Week</option>
          <option value="2weeks">Last 2 Weeks</option>
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Total Expenses Card */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Total Expenses</h2>
        <div className="text-4xl font-bold text-red-600">
          ${totalExpenses.toFixed(2)}
        </div>
        <p className={`text-sm ${textSecondary} mt-2`}>
          Excluding transfers and income • {filteredTransactions.filter(t => t.amount < 0).length} transactions
        </p>
      </div>

      {/* Pie Chart */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
        {sortedCategories.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sortedCategories.map((cat, idx) => ({
                      name: cat.name,
                      value: cat.total,
                      fill: `hsl(${(idx * 360) / sortedCategories.length}, 70%, 50%)`
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `$${entry.value.toFixed(0)}`}
                  >
                    {sortedCategories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${(index * 360) / sortedCategories.length}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              {sortedCategories.slice(0, 8).map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(${(idx * 360) / sortedCategories.length}, 70%, 50%)` }}
                    />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold">${cat.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={`text-center ${textSecondary} py-8`}>No expenses in this time range</p>
        )}
      </div>

      {/* Category Summary */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Category Summary</h2>
        
        <div className="space-y-3">
          {sortedCategories.length === 0 ? (
            <p className={textSecondary}>No expenses in this time range</p>
          ) : (
            sortedCategories.map((category) => {
              const percentage = (category.total / totalExpenses) * 100;
              
              return (
                <div
                  key={category.name}
                  className={`p-4 rounded-lg border ${borderColor} cursor-pointer hover:shadow-md transition-all ${
                    selectedCategory === category.name ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{
                        backgroundColor: `hsl(${(sortedCategories.indexOf(category) * 360) / sortedCategories.length}, 70%, 50%)`
                      }} />
                      <span className="font-semibold">{category.name}</span>
                      <span className={`text-sm ${textSecondary}`}>
                        ({category.transactions.length} transactions)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">
                        ${category.total.toFixed(2)}
                      </div>
                      <div className={`text-sm ${textSecondary}`}>
                        {percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: `hsl(${(sortedCategories.indexOf(category) * 360) / sortedCategories.length}, 70%, 50%)`
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed Category View */}
      {selectedCategory && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedCategory} - Monthly Breakdown</h2>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Repayments Special View */}
          {selectedCategory === 'Repayments' && Object.keys(repaymentsByRecipient).length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">Repayments by Person/Loan</h3>
              <div className="space-y-2">
                {Object.entries(repaymentsByRecipient).map(([recipient, data]) => (
                  <div key={recipient} className={`p-3 rounded-lg border ${borderColor}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{recipient}</span>
                      <div className="text-right">
                        <div className="font-bold text-red-600">${data.total.toFixed(2)}</div>
                        <div className={`text-sm ${textSecondary}`}>{data.count} payments</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly breakdown table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${borderColor}`}>
                  <th className="text-left py-2 px-4">Month</th>
                  <th className="text-right py-2 px-4">Amount</th>
                  <th className="text-right py-2 px-4">Transactions</th>
                  <th className="text-right py-2 px-4">Avg per Transaction</th>
                </tr>
              </thead>
              <tbody>
                {allMonths.map(month => {
                  const categoryData = sortedCategories.find(c => c.name === selectedCategory);
                  const monthTotal = categoryData?.monthly[month] || 0;
                  const monthTransactions = categoryData?.transactions.filter(t => {
                    const date = new Date(t.date);
                    const tMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    return tMonth === month;
                  }) || [];
                  
                  if (monthTotal === 0) return null;
                  
                  const avgPerTransaction = monthTransactions.length > 0 ? monthTotal / monthTransactions.length : 0;
                  
                  return (
                    <tr key={month} className={`border-b ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                      <td className="py-2 px-4">
                        {new Date(month + '-01').toLocaleDateString('en-AU', { year: 'numeric', month: 'long' })}
                      </td>
                      <td className="text-right py-2 px-4 font-semibold text-red-600">
                        ${monthTotal.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-4">
                        {monthTransactions.length}
                      </td>
                      <td className="text-right py-2 px-4 text-gray-600">
                        ${avgPerTransaction.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spending by Category Chart */}
      {sortedCategories.length > 0 && (
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h2 className="text-xl font-bold mb-4">Spending Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedCategories.map((cat, idx) => ({
                    name: cat.name,
                    value: cat.total,
                    fill: `hsl(${(idx * 360) / sortedCategories.length}, 70%, 50%)`
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Forecast/Cash Flow View Component
function ForecastView({ 
  transactions, 
  accounts, 
  setAccounts, 
  jobs, 
  setJobs, 
  workSchedule, 
  setWorkSchedule, 
  recurringTransactions, 
  setRecurringTransactions,
  debts,
  darkMode, 
  cardBg, 
  textSecondary, 
  borderColor 
}) {
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [newJob, setNewJob] = useState({ name: '', dailyRate: '', color: '#3b82f6' });
  const [newRecurring, setNewRecurring] = useState({
    name: '',
    amount: '',
    frequency: 'weekly',
    nextDate: new Date().toISOString().split('T')[0],
    type: 'expense',
    accountId: '',
  });

  // Calculate Australian tax withholding (simplified PAYG)
  const calculateTaxWithholding = (annualIncome) => {
    if (annualIncome <= 18200) return 0;
    if (annualIncome <= 45000) return (annualIncome - 18200) * 0.19;
    if (annualIncome <= 120000) return 5092 + (annualIncome - 45000) * 0.325;
    if (annualIncome <= 180000) return 29467 + (annualIncome - 120000) * 0.37;
    return 51667 + (annualIncome - 180000) * 0.45;
  };

  // Add job
  const addJob = () => {
    if (!newJob.name || !newJob.dailyRate) return;
    setJobs(prev => [...prev, {
      id: `job-${Date.now()}`,
      name: newJob.name,
      dailyRate: parseFloat(newJob.dailyRate),
      color: newJob.color,
    }]);
    setNewJob({ name: '', dailyRate: '', color: '#3b82f6' });
    setShowAddJob(false);
  };

  // Add recurring transaction
  const addRecurring = () => {
    if (!newRecurring.name || !newRecurring.amount) return;
    setRecurringTransactions(prev => [...prev, {
      id: `recurring-${Date.now()}`,
      name: newRecurring.name,
      amount: parseFloat(newRecurring.amount),
      frequency: newRecurring.frequency,
      nextDate: newRecurring.nextDate,
      type: newRecurring.type,
      accountId: newRecurring.accountId,
    }]);
    setNewRecurring({
      name: '',
      amount: '',
      frequency: 'weekly',
      nextDate: new Date().toISOString().split('T')[0],
      type: 'expense',
      accountId: '',
    });
    setShowAddRecurring(false);
  };

  // Toggle work day
  const toggleWorkDay = (date, jobId) => {
    const dateKey = date.toISOString().split('T')[0];
    setWorkSchedule(prev => {
      const current = prev[dateKey] || [];
      const jobIndex = current.indexOf(jobId);
      
      if (jobIndex >= 0) {
        return { ...prev, [dateKey]: current.filter(id => id !== jobId) };
      } else {
        return { ...prev, [dateKey]: [...current, jobId] };
      }
    });
  };

  // Calculate earnings for a date range
  const calculateEarnings = useMemo(() => {
    return (startDate, endDate) => {
      let totalEarnings = 0;
      const current = new Date(startDate);
      
      while (current <= endDate) {
        const dateKey = current.toISOString().split('T')[0];
        const jobIds = workSchedule[dateKey] || [];
        
        // Calculate day earnings to avoid loop function warning
        let dayEarnings = 0;
        for (let i = 0; i < jobIds.length; i++) {
          const job = jobs.find(j => j.id === jobIds[i]);
          if (job) dayEarnings += job.dailyRate;
        }
        totalEarnings += dayEarnings;
        
        current.setDate(current.getDate() + 1);
      }
      
      return totalEarnings;
    };
  }, [workSchedule, jobs]);

  // Get current fortnight earnings
  const today = new Date();
  const fortnightStart = new Date(today);
  fortnightStart.setDate(today.getDate() - (today.getDay() + 7) % 14);
  const fortnightEnd = new Date(fortnightStart);
  fortnightEnd.setDate(fortnightStart.getDate() + 13);
  
  const fortnightEarnings = calculateEarnings(fortnightStart, fortnightEnd);
  const annualizedIncome = (fortnightEarnings / 14) * 365;
  const fortnightTax = (calculateTaxWithholding(annualizedIncome) / 26);
  const fortnightNetPay = fortnightEarnings - fortnightTax;

  // Generate 90-day forecast
  const forecast = useMemo(() => {
    const days = [];
    const startDate = new Date();
    let runningBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      let dailyChange = 0;
      const events = [];

      // Work income
      const jobIds = workSchedule[dateKey] || [];
      jobIds.forEach(jobId => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
          dailyChange += job.dailyRate;
          events.push({ type: 'income', name: job.name, amount: job.dailyRate });
        }
      });

      // Recurring transactions
      recurringTransactions.forEach(rt => {
        const nextDate = new Date(rt.nextDate);
        const daysDiff = Math.floor((date - nextDate) / (1000 * 60 * 60 * 24));
        
        let shouldOccur = false;
        if (rt.frequency === 'daily') shouldOccur = daysDiff >= 0;
        else if (rt.frequency === 'weekly' && daysDiff >= 0 && daysDiff % 7 === 0) shouldOccur = true;
        else if (rt.frequency === 'fortnightly' && daysDiff >= 0 && daysDiff % 14 === 0) shouldOccur = true;
        else if (rt.frequency === 'monthly' && daysDiff >= 0) {
          const monthsDiff = (date.getFullYear() - nextDate.getFullYear()) * 12 + (date.getMonth() - nextDate.getMonth());
          if (date.getDate() === nextDate.getDate() && monthsDiff >= 0) shouldOccur = true;
        }

        if (shouldOccur) {
          const amount = rt.type === 'income' ? rt.amount : -rt.amount;
          dailyChange += amount;
          events.push({ type: rt.type, name: rt.name, amount: Math.abs(amount) });
        }
      });

      // Debt minimum payments (monthly on 1st)
      if (date.getDate() === 1) {
        debts.forEach(debt => {
          if (debt.minimumPayment > 0) {
            dailyChange -= debt.minimumPayment;
            events.push({ type: 'expense', name: `${debt.name} Payment`, amount: debt.minimumPayment });
          }
        });
      }

      runningBalance += dailyChange;
      
      days.push({
        date: dateKey,
        balance: runningBalance,
        change: dailyChange,
        events,
      });
    }

    return days;
  }, [accounts, workSchedule, jobs, recurringTransactions, debts]);

  // Calendar rendering for current month
  const renderCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks = [];
    let currentWeek = [];
    let current = new Date(startDate);

    while (current <= lastDay || currentWeek.length > 0) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      const date = new Date(current);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === new Date().toDateString();
      const dateKey = date.toISOString().split('T')[0];
      const jobIds = workSchedule[dateKey] || [];
      const dayEarnings = jobIds.reduce((sum, jobId) => {
        const job = jobs.find(j => j.id === jobId);
        return sum + (job?.dailyRate || 0);
      }, 0);

      currentWeek.push({
        date,
        dateKey,
        isCurrentMonth,
        isToday,
        jobIds,
        dayEarnings,
      });

      current.setDate(current.getDate() + 1);
      if (current > lastDay && currentWeek.length === 7) {
        weeks.push(currentWeek);
        break;
      }
    }

    return weeks;
  };

  const calendarWeeks = renderCalendar();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Current Balance</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)}
          </p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Fortnight Gross Pay</h3>
          <p className="text-3xl font-bold text-green-600">${fortnightEarnings.toFixed(2)}</p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Fortnight Tax</h3>
          <p className="text-3xl font-bold text-orange-600">${fortnightTax.toFixed(2)}</p>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-2`}>Fortnight Net Pay</h3>
          <p className="text-3xl font-bold text-purple-600">${fortnightNetPay.toFixed(2)}</p>
        </div>
      </div>

      {/* 90-Day Balance Forecast Chart */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-2xl font-bold mb-4">90-Day Balance Forecast</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="date" 
              stroke={darkMode ? '#9ca3af' : '#6b7280'}
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            />
            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }}
              labelFormatter={(date) => new Date(date).toLocaleDateString('en-AU')}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke={COLORS.primary} 
              fill={COLORS.primaryLight}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Job Management */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Jobs</h2>
          <button
            onClick={() => setShowAddJob(!showAddJob)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus size={18} />
            <span>Add Job</span>
          </button>
        </div>

        {showAddJob && (
          <div className="mb-4 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900 bg-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Job name"
                value={newJob.name}
                onChange={(e) => setNewJob({...newJob, name: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <input
                type="number"
                placeholder="Daily rate ($)"
                value={newJob.dailyRate}
                onChange={(e) => setNewJob({...newJob, dailyRate: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <input
                type="color"
                value={newJob.color}
                onChange={(e) => setNewJob({...newJob, color: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'} h-10`}
              />
            </div>
            <div className="flex space-x-2 mt-3">
              <button onClick={addJob} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Add
              </button>
              <button onClick={() => setShowAddJob(false)} className={`px-4 py-2 rounded border ${borderColor} text-sm`}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job.id} className={`p-4 rounded-lg border ${borderColor} flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: job.color }} />
                <div>
                  <p className="font-semibold">{job.name}</p>
                  <p className={`text-sm ${textSecondary}`}>${job.dailyRate}/day</p>
                </div>
              </div>
              <button
                onClick={() => setJobs(prev => prev.filter(j => j.id !== job.id))}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Schedule Calendar */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Work Schedule</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
              className={`px-3 py-1 rounded border ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              ←
            </button>
            <span className="font-semibold min-w-[150px] text-center">
              {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
              className={`px-3 py-1 rounded border ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              →
            </button>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className={textSecondary}>Add your jobs first to start scheduling work days</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={`text-center text-sm font-semibold ${textSecondary} py-2`}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              {calendarWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`min-h-[80px] p-2 rounded-lg border transition-all ${
                        !day.isCurrentMonth 
                          ? 'bg-gray-50 dark:bg-gray-800 opacity-50' 
                          : day.isToday
                          ? 'border-blue-500 border-2 bg-blue-50 dark:bg-blue-900 bg-opacity-20'
                          : `${borderColor} hover:border-blue-300 dark:hover:border-blue-700`
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${day.isToday ? 'text-blue-600 font-bold' : ''}`}>
                          {day.date.getDate()}
                        </span>
                        {day.dayEarnings > 0 && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1 rounded">
                            ${day.dayEarnings}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {jobs.map(job => (
                          <button
                            key={job.id}
                            onClick={() => toggleWorkDay(day.date, job.id)}
                            className={`w-full text-xs py-1 px-2 rounded transition-all ${
                              day.jobIds.includes(job.id)
                                ? 'font-semibold shadow'
                                : 'opacity-40 hover:opacity-70'
                            }`}
                            style={{
                              backgroundColor: day.jobIds.includes(job.id) ? job.color : 'transparent',
                              color: day.jobIds.includes(job.id) ? 'white' : (darkMode ? '#9ca3af' : '#6b7280'),
                              border: `1px solid ${job.color}`,
                            }}
                          >
                            {job.name.slice(0, 8)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recurring Transactions */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recurring Income & Expenses</h2>
          <button
            onClick={() => setShowAddRecurring(!showAddRecurring)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus size={18} />
            <span>Add Recurring</span>
          </button>
        </div>

        {showAddRecurring && (
          <div className="mb-4 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900 bg-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name (e.g., Netflix, Rent)"
                value={newRecurring.name}
                onChange={(e) => setNewRecurring({...newRecurring, name: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newRecurring.amount}
                onChange={(e) => setNewRecurring({...newRecurring, amount: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <select
                value={newRecurring.type}
                onChange={(e) => setNewRecurring({...newRecurring, type: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={newRecurring.frequency}
                onChange={(e) => setNewRecurring({...newRecurring, frequency: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="date"
                value={newRecurring.nextDate}
                onChange={(e) => setNewRecurring({...newRecurring, nextDate: e.target.value})}
                className={`px-3 py-2 rounded border ${borderColor} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
            </div>
            <div className="flex space-x-2 mt-3">
              <button onClick={addRecurring} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Add
              </button>
              <button onClick={() => setShowAddRecurring(false)} className={`px-4 py-2 rounded border ${borderColor} text-sm`}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {recurringTransactions.map(rt => (
            <div key={rt.id} className={`flex items-center justify-between p-4 rounded-lg border ${borderColor}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{rt.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    rt.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {rt.type}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>
                    {rt.frequency}
                  </span>
                </div>
                <p className={`text-sm ${textSecondary} mt-1`}>
                  Next: {new Date(rt.nextDate).toLocaleDateString('en-AU')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`font-bold text-lg ${rt.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {rt.type === 'income' ? '+' : '-'}${rt.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => setRecurringTransactions(prev => prev.filter(r => r.id !== rt.id))}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events Timeline */}
      <div className={`${cardBg} rounded-xl p-6 border ${borderColor} shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">Next 14 Days - Upcoming Transactions</h2>
        <div className="space-y-3">
          {forecast.slice(0, 14).filter(day => day.events.length > 0).map(day => (
            <div key={day.date} className={`p-4 rounded-lg border ${borderColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  {new Date(day.date).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className={`font-bold ${day.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {day.change >= 0 ? '+' : ''}${day.change.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                {day.events.map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className={textSecondary}>{event.name}</span>
                    <span className={event.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {event.type === 'income' ? '+' : '-'}${event.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, isPercentage, darkMode, cardBg, textSecondary }) {
  const colors = {
    success: 'text-green-600',
    danger: 'text-red-600',
    primary: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`${cardBg} rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg transform hover:scale-105 transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${textSecondary}`}>{title}</h3>
        <Icon className={colors[color]} size={24} />
      </div>
      <p className={`text-3xl font-bold ${colors[color]}`}>
        {isPercentage ? `${value.toFixed(1)}%` : `$${value.toFixed(2)}`}
      </p>
    </div>
  );
}
