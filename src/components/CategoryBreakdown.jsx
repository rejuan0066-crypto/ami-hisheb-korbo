import React, { useState } from 'react';
import { PieChart, ArrowDownLeft, ArrowUpRight, Percent } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const PALETTE = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-fuchsia-500'
];

export default function CategoryBreakdown({ transactions = [], useBengaliDigits }) {
  const [activeTab, setActiveTab] = useState('expense'); // 'expense' or 'income'

  const filtered = transactions.filter(t => t.type === activeTab);
  const total = filtered.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  // Group by category
  const categoryMap = {};
  filtered.forEach((t) => {
    const cat = t.category || 'অন্যান্য';
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(t.amount) || 0);
  });

  // Sort descending
  const sortedCategories = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ক্যাটেগরিভিত্তিক হিসাব বিশ্লেষণ
            </h3>
            <p className="text-xs text-slate-500">কোন খাতে কত আয় বা ব্যয় হয়েছে</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'expense'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>ব্যয় বিশ্লেষণ</span>
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'income'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>আয় বিশ্লেষণ</span>
          </button>
        </div>
      </div>

      {/* Progress Multi-Bar */}
      {sortedCategories.length > 0 ? (
        <div className="space-y-4">
          
          {/* Segmented bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
            {sortedCategories.map((item, index) => (
              <div
                key={item.category}
                style={{ width: `${item.percentage}%` }}
                className={`${PALETTE[index % PALETTE.length]} transition-all duration-300`}
                title={`${item.category}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Category List with Progress and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {sortedCategories.map((item, index) => {
              const colorDot = PALETTE[index % PALETTE.length];
              return (
                <div 
                  key={item.category}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${colorDot}`} />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.amount, useBengaliDigits)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-xs">
          এই ফাইলে এখনও কোনো {activeTab === 'expense' ? 'ব্যয়' : 'আয়'} এন্ট্রি নেই।
        </div>
      )}

    </div>
  );
}
