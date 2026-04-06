# 💸 Zorvyn Finance Dashboard

A clean, interactive, and responsive personal finance tracking dashboard built to evaluate frontend architecture, UI/UX design, and state management. Designed with a custom **"Zorvyn"** fintech aesthetic.

---

## 🎯 Objective

To provide users with an intuitive interface to track their financial activity, view overall summaries, explore transactions, and understand basic spending patterns through visual data and smart insights.

---

## ✨ Core Features

### 📊 Dashboard Overview

- **Financial Summary Cards:** Quick-glance cards displaying Total Balance, Income, and Expenses.
- **Visualizations:**
  - *Time-Based Trend:* Line/Area charts showing balance and income/expense trends over time.
  - *Categorical Breakdown:* Pie/Donut charts illustrating spending habits by category.
- **Smart Insights:** Auto-generated observations such as the highest spending category and monthly comparisons.

### 💳 Transaction Management

- **Detailed List:** View transactions with Date, Amount, Category, and Type (Income/Expense).
- **Data Controls:** Integrated search and simple filtering/sorting to easily navigate financial history.
- **Empty States:** Graceful handling of edge cases when no data or search results are found.

### 🔐 Simulated Role-Based Access Control (RBAC)

Toggle between simulated user roles directly from the UI:

| Role       | Access Level                                                         |
|------------|----------------------------------------------------------------------|
| **Viewer** | Read-only access to dashboard data and transaction history.          |
| **Admin**  | Full access, including the ability to add and edit mock transactions. |

### 🎵 Auditory UX *(Unique Feature)*

- **Interactive Sounds:** Custom audio feedback for UI clicks and interactions.
- **Contextual Alerts:** Distinct sounds for specific financial scenarios:
  - 🎉 Celebratory laugh for high profits.
  - 🔔 Dull/alert sound for negative balances or heavy losses.
  - 💵 Satisfying cash sound when adding income.

---

## 🛠️ Technical Stack

| Layer                | Technology                                                                 |
|----------------------|----------------------------------------------------------------------------|
| **Framework**        | React.js with TypeScript *(Strict mode enabled)*                           |
| **Styling**          | Tailwind CSS — Custom "Zorvyn" dark/light fintech palette, `Sora` font     |
| **Data Visualization** | MUI Charts / ApexCharts *(based on Syncfusion financial chart best practices)* |
| **State Management** | React Context API / Custom Hooks                                           |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Pramod-325/financial_dashboard.git
   cd finance-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

---

## 📐 Architecture & Best Practices

- **Modularity:** UI components are broken down into small, reusable pieces (e.g., `SummaryCard`, `TransactionRow`, `ChartWidget`).
- **Responsiveness:** Fluid layouts that adapt beautifully across mobile, tablet, and desktop viewports using CSS Grid and Flexbox.
- **Abstraction:** Business logic, state management, and audio handling are decoupled from presentation components for easier scaling and maintenance.

---

## 📁 Project Structure

```
zorvyn-finance-dashboard/
├── public/
│   └── sounds/              # Auditory UX assets
├── src/
│   ├── components/
│   │   ├── SummaryCard/     # Financial summary cards
│   │   ├── TransactionRow/  # Individual transaction items
│   │   └── ChartWidget/     # Chart visualizations
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/
│   │   ├── Dashboard/       # Main overview page
│   │   └── Transactions/    # Transaction history page
│   ├── utils/               # Helpers & mock data generators
│   └── App.tsx
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌟 Feature Checklist

| Feature                              | Status |
|--------------------------------------|--------|
| Highly Responsive Design            | ✅ Done |
| Dark / Light Mode Toggle             | ✅ Done |
| Mock API Integration / Simulated Data | ✅ Done |
| UI Animations & Transitions          | ✅ Done |
| Data Persistence (Local Storage)     | 🔲 Planned |
| Export Functionality (CSV / JSON)    | 🔲 Planned |

---

## 📸 Screenshots

<img src="https://github.com/Pramod-325/financial_dashboard/blob/main/screenshots/Screenshot-1.png"/>
<img src="https://github.com/Pramod-325/financial_dashboard/blob/main/screenshots/Screenshot-2.png"/>
<img src="https://github.com/Pramod-325/financial_dashboard/blob/main/screenshots/Screenshot-3.png"/>

---


## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
