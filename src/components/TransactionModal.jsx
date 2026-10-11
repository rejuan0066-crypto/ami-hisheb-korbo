import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Tag, 
  CreditCard, 
  FileText, 
  Hash, 
  CheckCircle2 
} from 'lucide-react';
import { 
  DEFAULT_EXPENSE_CATEGORIES, 
  DEFAULT_INCOME_CATEGORIES, 
  PAYMENT_METHODS 
} from '../utils/storage';

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialType = 'expense',
  editTransaction = null 
}) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ক্যাশ (নগদ)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [voucherNo, setVoucherNo] = useState('');

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setPaymentMethod(editTransaction.paymentMethod || 'ক্যাশ (নগদ)');
      setDate(editTransaction.date || new Date().toISOString().split('T')[0]);
      setNote(editTransaction.note || '');
      setVoucherNo(editTransaction.voucherNo || '');

      const currentCats = editTransaction.type === 'income' 
        ? DEFAULT_INCOME_CATEGORIES 
        : DEFAULT_EXPENSE_CATEGORIES;

      if (currentCats.includes(editTransaction.category)) {
        setCategory(editTransaction.category);
        setCustomCategory('');
      } else {
        setCategory('কাস্টম');
        setCustomCategory(editTransaction.category || '');
      }
    } else {
      setType(initialType);
      setAmount('');
      const defaultCats = initialType === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
      setCategory(defaultCats[0] || '');
      setCustomCategory('');
      setPaymentMethod('ক্যাশ (নগদ)');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setVoucherNo('');
    }
  }, [editTransaction, initialType, isOpen]);

  // When type changes, adjust category
  const handleTypeChange = (newType) => {
    setType(newType);
    const newCats = newType === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
    setCategory(newCats[0] || '');
    setCustomCategory('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন!');
      return;
    }

    const finalCategory = category === 'কাস্টম' ? (customCategory.trim() || 'অন্যান্য') : category;

    const transactionData = {
      id: editTransaction ? editTransaction.id : 'tx-' + Date.now(),
      type,
      amount: parsedAmount,
      category: finalCategory,
      paymentMethod,
      date,
      note: note.trim(),
      voucherNo: voucherNo.trim()
    };

    onSave(transactionData);
    onClose();
  };

  if (!isOpen) return null;

  const activeCategories = type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editTransaction ? 'লেনদেন এডিট করুন' : (type === 'income' ? 'নতুন আয় যোগ করুন' : 'নতুন ব্যয় যোগ করুন')}
              </h3>
              <p className="text-xs text-slate-500">
                {type === 'income' ? 'টাকা জমা বা আয়ের এন্ট্রি' : 'টাকা খরচ বা ব্যয়ের এন্ট্রি'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Type Switcher Pills */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>আয় (Income)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>ব্যয় (Expense)</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              টাকার পরিমাণ (৳) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ৳
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className={`w-full pl-10 pr-4 py-3 text-2xl font-black bg-slate-50 border rounded-2xl focus:outline-none focus:ring-3 focus:bg-white transition ${
                  type === 'income'
                    ? 'border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-700'
                    : 'border-rose-200 focus:ring-rose-500/20 focus:border-rose-500 text-rose-700'
                }`}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>ক্যাটেগরি / খাত <span className="text-rose-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">ক্লিক করে নির্বাচন করুন</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 max-h-32 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {activeCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => { setCategory(cat); setCustomCategory(''); }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                    category === cat
                      ? (type === 'income' ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' : 'bg-rose-600 text-white border-rose-600 shadow-2xs')
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCategory('কাস্টম')}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                  category === 'কাস্টম'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-dashed border-slate-300 hover:border-slate-400'
                }`}
              >
                + অন্যান্য / কাস্টম
              </button>
            </div>

            {category === 'কাস্টম' && (
              <input
                type="text"
                placeholder="কাস্টম ক্যাটেগরির নাম লিখুন..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                তারিখ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                পেমেন্ট মাধ্যম
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Note / Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              বিবরণ / নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: মাসিক বাজার, বিদ্যুৎ বিল পরিশোধ, বোনাস ইত্যাদি..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Voucher / Receipt No */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              রসিদ / ভাউচার / মেমো নম্বর (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: INV-1002, MEMO-45"
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition cursor-pointer active:scale-95 ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editTransaction ? 'হালনাগাদ সংরক্ষণ করুন' : 'এন্ট্রি সংরক্ষণ করুন'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
