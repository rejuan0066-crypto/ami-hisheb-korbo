import React from 'react';
import { Printer, X } from 'lucide-react';
import { formatCurrency, formatDate, calculateFileSummary } from '../utils/formatters';

export default function PrintStatement({ file, onClose, useBengaliDigits }) {
  if (!file) return null;

  const summary = calculateFileSummary(file.transactions);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 relative max-h-[95vh] overflow-y-auto">
        
        {/* Controls - not printed */}
        <div className="flex items-center justify-between border-b pb-4 no-print">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">প্রিন্ট / PDF স্টেটমেন্ট ভিউ</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="print-content space-y-6 text-slate-800">
          
          {/* Header */}
          <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">
                আমার হিসাব খাতা (Amar Hisab Kori)
              </h1>
              <h2 className="text-lg font-bold text-emerald-700">
                ফাইল: {file.name}
              </h2>
              {file.description && (
                <p className="text-xs text-slate-500 mt-0.5">{file.description}</p>
              )}
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>তৈরির তারিখ: {formatDate(file.createdAt)}</p>
              <p>রিপোর্ট জেনারেট: {formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          {/* Financial Summary Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">মোট জমা / আয়</span>
              <span className="text-lg font-black text-emerald-700">
                {formatCurrency(summary.totalIncome, useBengaliDigits)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">মোট খরচ / ব্যয়</span>
              <span className="text-lg font-black text-rose-700">
                {formatCurrency(summary.totalExpense, useBengaliDigits)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">অবশিষ্ট ব্যালেন্স</span>
              <span className={`text-lg font-black ${summary.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                {formatCurrency(summary.balance, useBengaliDigits)}
              </span>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-100">
                <th className="py-2 px-2">তারিখ</th>
                <th className="py-2 px-2">ধরণ</th>
                <th className="py-2 px-2">খাত / বিবরণ</th>
                <th className="py-2 px-2">পেমেন্ট মাধ্যম</th>
                <th className="py-2 px-2 text-right">পরিমাণ (টাকা)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {file.transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-2 px-2 whitespace-nowrap">{t.date}</td>
                  <td className="py-2 px-2 font-bold whitespace-nowrap">
                    {t.type === 'income' ? 'আয় (+)' : 'ব্যয় (-)'}
                  </td>
                  <td className="py-2 px-2">
                    <span className="font-semibold">{t.category}</span>
                    {t.note && <span className="text-slate-500 block">{t.note}</span>}
                  </td>
                  <td className="py-2 px-2">{t.paymentMethod || 'ক্যাশ'}</td>
                  <td className={`py-2 px-2 text-right font-bold whitespace-nowrap ${
                    t.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {formatCurrency(t.amount, useBengaliDigits)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature Footer */}
          <div className="pt-10 flex justify-between text-xs text-slate-400">
            <div>
              <div className="border-t border-slate-300 w-36 pt-1 text-center">
                প্রস্তুতকারক
              </div>
            </div>
            <div>
              <div className="border-t border-slate-300 w-36 pt-1 text-center">
                অনুমোদনকারী
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
