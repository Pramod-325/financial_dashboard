import fs from "node:fs";

// --- Configuration & Constants ---
const START_DATE = new Date('2025-01-01T00:00:00Z');
const END_DATE = new Date(); // Current date (2026)

// The 10 Categories tailored for the Indian Context
const CATEGORIES = {
  INCOME: ['Salary', 'Freelance/Bonus'],
  EXPENSE: [
    'Housing & Utilities', // Rent, Electricity, Water, Maintenance
    'Groceries & Daily Needs', // Kirana, D-Mart, Blinkit
    'Food & Dining', // Swiggy, Zomato, Restaurants
    'Transportation', // Fuel, Metro, Ola/Uber
    'Investments & Savings', // SIP, PPF, FDs
    'Shopping & Lifestyle', // Amazon, Myntra, Malls
    'Entertainment & OTT', // Netflix, Movies
    'Miscellaneous' // UPI transfers, Gifts, Meds
  ]
};

// Helper: Generate random ID
const generateId = () => 'tx_' + Math.random().toString(36).substring(2, 11);

// Helper: Random integer between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Random element from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Generator Logic ---
function generateTransactions() {
  const transactions = [];
  let currentDate = new Date(START_DATE);

  while (currentDate <= END_DATE) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. FIXED MONTHLY INCOME (1st of every month)
    transactions.push({
      id: generateId(),
      date: new Date(year, month, 1, 9, 30).toISOString(),
      type: 'income',
      amount: 85000,
      category: 'Salary',
      description: 'Monthly In-hand Salary'
    });

    // 2. FIXED MONTHLY EXPENSES (Early in the month)
    // Rent
    transactions.push({
      id: generateId(),
      date: new Date(year, month, 2, 10, 0).toISOString(),
      type: 'expense',
      amount: 22000,
      category: 'Housing & Utilities',
      description: 'Apartment Rent'
    });

    // SIP / Investments (5th of the month)
    transactions.push({
      id: generateId(),
      date: new Date(year, month, 5, 10, 0).toISOString(),
      type: 'expense',
      amount: 15000,
      category: 'Investments & Savings',
      description: 'Zerodha Mutual Fund SIP'
    });

    // Electricity (Varies: Higher in Summer - Apr to Jul)
    const isSummer = month >= 3 && month <= 6;
    const electricityBill = isSummer ? randomInt(2500, 4500) : randomInt(800, 1500);
    transactions.push({
      id: generateId(),
      date: new Date(year, month, 7, 14, 0).toISOString(),
      type: 'expense',
      amount: electricityBill,
      category: 'Housing & Utilities',
      description: 'Electricity Bill (Bescom/Tata Power)'
    });

    // Wifi / Mobile Recharge
    transactions.push({
      id: generateId(),
      date: new Date(year, month, 10, 11, 0).toISOString(),
      type: 'expense',
      amount: 1200,
      category: 'Housing & Utilities',
      description: 'JioFiber & Mobile Recharge'
    });

    // 3. VARIABLE WEEKLY/DAILY EXPENSES
    for (let day = 1; day <= daysInMonth; day++) {
      const loopDate = new Date(year, month, day);
      if (loopDate > END_DATE) break;
      
      const isWeekend = loopDate.getDay() === 0 || loopDate.getDay() === 6;

      // Groceries (1-2 times a week)
      if (Math.random() > 0.75) {
        transactions.push({
          id: generateId(),
          date: new Date(year, month, day, randomInt(10, 20), randomInt(0, 59)).toISOString(),
          type: 'expense',
          amount: randomInt(300, 2500),
          category: 'Groceries & Daily Needs',
          description: randomItem(['Blinkit Order', 'D-Mart Run', 'Local Kirana Store', 'Zepto Groceries'])
        });
      }

      // Food & Dining (Higher probability on weekends)
      const foodProb = isWeekend ? 0.6 : 0.2;
      if (Math.random() < foodProb) {
        transactions.push({
          id: generateId(),
          date: new Date(year, month, day, randomInt(19, 23), randomInt(0, 59)).toISOString(),
          type: 'expense',
          amount: randomInt(250, 1500),
          category: 'Food & Dining',
          description: randomItem(['Swiggy Order', 'Zomato Delivery', 'Weekend Dinner Out', 'Office Lunch'])
        });
      }

      // Transportation (Daily commute or weekend cabs)
      if (Math.random() > 0.6) {
        transactions.push({
          id: generateId(),
          date: new Date(year, month, day, randomInt(8, 18), randomInt(0, 59)).toISOString(),
          type: 'expense',
          amount: randomInt(100, 800),
          category: 'Transportation',
          description: randomItem(['Uber/Ola Auto', 'Metro Recharge', 'Petrol Pump', 'Namma Yatri'])
        });
      }

      // Shopping & Lifestyle (Randomly during the month, higher near Diwali/Oct-Nov)
      const isFestive = month === 9 || month === 10;
      const shoppingProb = isFestive ? 0.15 : 0.05;
      if (Math.random() < shoppingProb) {
        transactions.push({
          id: generateId(),
          date: new Date(year, month, day, randomInt(12, 22), randomInt(0, 59)).toISOString(),
          type: 'expense',
          amount: randomInt(1000, 5000),
          category: 'Shopping & Lifestyle',
          description: randomItem(['Amazon Order', 'Myntra Clothes', 'Offline Mall Shopping'])
        });
      }
    }

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Sort chronologically (descending for typical dashboard view)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const mockData = {
  user: [
    {
      id: "usr_zrvn_ind_001",
      name: "Rohan Sharma",
      email: "rohan.sharma@zorvyn.in",
      role: "admin",
      transactions: generateTransactions()
    }
  ]
};

// Write to public folder for frontend consumption
fs.writeFileSync('./public/data.json', JSON.stringify(mockData, null, 2));
console.log(`✅ Successfully generated ${mockData.user[0].transactions.length} transactions for 2025-2026 in data.json!`);