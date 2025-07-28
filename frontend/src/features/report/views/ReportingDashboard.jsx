import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const mockStats = {
  revenue: 12500,
  orders: 320,
  expenses: 4200,
  revenueTrends: [
    { date: '2024-06-01', revenue: 2000 },
    { date: '2024-06-02', revenue: 1800 },
    { date: '2024-06-03', revenue: 2200 },
    { date: '2024-06-04', revenue: 2500 },
    { date: '2024-06-05', revenue: 3000 },
  ],
  expensesTrends: [
    { date: '2024-06-01', expenses: 800 },
    { date: '2024-06-02', expenses: 600 },
    { date: '2024-06-03', expenses: 900 },
    { date: '2024-06-04', expenses: 700 },
    { date: '2024-06-05', expenses: 1200 },
  ],
  topProducts: [
    { name: 'LED Bulb', sales: 120 },
    { name: 'Wireless Charger', sales: 90 },
    { name: 'Smart Thermostat', sales: 60 },
  ],
  salesByCategory: [
    { category: 'Electronics', value: 200 },
    { category: 'Home Automation', value: 80 },
    { category: 'Lighting', value: 40 },
  ],
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const ReportingDashboard = () => {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // TODO: Fetch stats from backend using reportService
    // setStats(...)
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporting Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Business performance at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.revenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.orders}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.expenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stats.revenueTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expenses Trends */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Expenses Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stats.expensesTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales by Category */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stats.salesByCategory}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {stats.salesByCategory.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportingDashboard; 