import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit2, 
  Trash2, 
  FileSpreadsheet, 
  Printer, 
  Receipt,
  Calendar,
  CreditCard
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionList({ 
  transactions = [], 
  fileName = '',
  onEditTransaction, 
  onDeleteTransaction,
  onPrint,
  useBengaliDigits 
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount_high'

  // Filter
  const filtered = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const query = search.toLowerCase();
    const matchesSearch = 
      (t.category && t.category.toLowerCase().includes(query)) ||
      (t.note && t.note.toLowerCase().includes(query)) ||
      (t.paymentMethod && t.paymentMethod.toLowerCase().includes(query)) ||
      (t.voucherNo && t.voucherNo.toLowerCase().includes(query)) ||
      (t.amount && t.amount.toString().includes(query));
    return matchesType && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount_high') return (b.amount || 0) - (a.amount || 0);
    return 0;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('এক্সপোর্ট করার মতো কোনো লেনদেন নেই!');
      return;
    }

    const headers = ['তারিখ', 'ধরণ', 'ক্যাটেগরি', 'পরিমাণ (টাকা)', 'পেমেন্ট মাধ্যম', 'বিবরণ', 'ভাউচার নং'];
    const rows = sorted.map(t => [
      t.date,
      t.type === 'income' ? 'আয়' : 'ব্যয়',
      `"${t.category || ''}"`,
      t.amount,
      `"${t.paymentMethod || ''}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      `"${t.voucherNo || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}-লেনদেন-তালিকা.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            লেনদেনের বিস্তারিত খতিয়ান
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {sorted.length} টি
            </span>
          </h3>
          <p className="text-xs text-slate-500">এই ফাইলে এন্ট্রি করা সকল আয় ও খরচের রেকর্ড</p>
        </div>

        {/* Buttons: CSV & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="এক্সেল বা সিএসভি (CSV) ফাইল হিসেবে ডাউনলোড করুন"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel/CSV এক্সপোর্ট</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="হিসাবের খতিয়ান প্রিন্ট বা পিডিএফ সেভ করুন"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="খাত, বিবরণ, মাধ্যম বা ভাউচার খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pills */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'income' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              আয়
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'expense' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              ব্যয়
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="newest">নতুন তারিখ আগে</option>
            <option value="oldest">পুরাতন তারিখ আগে</option>
            <option value="amount_high">বেশি টাকার পরিমাণ আগে</option>
          </select>
        </div>

      </div>

      {/* Transactions Table (Desktop & Tablet) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">তারিখ</th>
              <th className="px-4 py-3">ধরণ</th>
              <th className="px-4 py-3">খাত / ক্যাটেগরি</th>
              <th className="px-4 py-3">বিবরণ ও নোট</th>
              <th className="px-4 py-3">পেমেন্ট মাধ্যম</th>
              <th className="px-4 py-3 text-right">পরিমাণ (টাকা)</th>
              <th className="px-4 py-3 text-center">একশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((t) => {
              const isIncome = t.type === 'income';
              return (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Date */}
                  <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>

                  {/* Type Badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isIncome 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}>
                      {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      {isIncome ? 'আয়' : 'ব্যয়'}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {t.category}
                  </td>

                  {/* Note & Voucher */}
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                    <span>{t.note || '—'}</span>
                    {t.voucherNo && (
                      <span className="block text-[11px] text-slate-400">
                        ভাউচার: #{t.voucherNo}
                      </span>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {t.paymentMethod || 'ক্যাশ'}
                  </td>

                  {/* Amount */}
                  <td className={`px-4 py-3 text-right font-black text-sm sm:text-base whitespace-nowrap ${
                    isIncome ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, useBengaliDigits)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="এন্ট্রি এডিট করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="এন্ট্রি মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-2.5">
        {sorted.map((t) => {
          const isIncome = t.type === 'income';
          return (
            <div 
              key={t.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t.category}</h5>
                    <span className="text-[11px] text-slate-400">{formatDate(t.date)}</span>
                  </div>
                </div>

                <div className={`font-black text-sm ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(t.amount, useBengaliDigits)}
                </div>
              </div>

              {t.note && (
                <p className="text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                  {t.note}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
                <span>মাধ্যম: {t.paymentMethod || 'ক্যাশ'}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onEditTransaction(t)}
                    className="text-blue-600 font-semibold p-1"
                  >
                    এডিট
                  </button>
                  <button 
                    onClick={() => onDeleteTransaction(t.id)}
                    className="text-rose-600 font-semibold p-1"
                  >
                    মুছুন
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs">
          {search 
            ? 'আপনার খোঁজের সাথে কোনো লেনদেন মেলেনি।' 
            : 'এই ফাইলে এখনও কোনো হিসাব লেনদেন যোগ করা হয়নি। উপরে বোতামে ক্লিক করে আয় বা ব্যয় যোগ করুন।'}
        </div>
      )}

    </div>
  );
}
