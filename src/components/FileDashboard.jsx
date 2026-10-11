import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Receipt, 
  Folder, 
  Edit3, 
  Printer, 
  SlidersHorizontal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, calculateFileSummary } from '../utils/formatters';
import TransactionList from './TransactionList';
import CategoryBreakdown from './CategoryBreakdown';
import TransactionModal from './TransactionModal';
import PrintStatement from './PrintStatement';

export default function FileDashboard({ 
  file, 
  onBack, 
  onUpdateFile, 
  onEditFileModalOpen,
  useBengaliDigits 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense'); // 'income' or 'expense'
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const summary = calculateFileSummary(file.transactions);

  // Add / Update Transaction
  const handleSaveTransaction = (transactionData) => {
    let updatedTransactions;
    if (editingTransaction) {
      updatedTransactions = file.transactions.map((t) => 
        t.id === transactionData.id ? transactionData : t
      );
    } else {
      updatedTransactions = [transactionData, ...file.transactions];
    }

    const updatedFile = {
      ...file,
      transactions: updatedTransactions
    };
    onUpdateFile(updatedFile);
    setEditingTransaction(null);
  };

  // Delete Transaction
  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই লেনদেনটি মুছে ফেলতে চান?')) {
      const updatedTransactions = file.transactions.filter(t => t.id !== transactionId);
      const updatedFile = {
        ...file,
        transactions: updatedTransactions
      };
      onUpdateFile(updatedFile);
    }
  };

  const openAddModal = (type) => {
    setEditingTransaction(null);
    setModalType(type);
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setModalType(tx.type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="সকল ফাইলের তালিকায় ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                হিসাব ফাইল
              </span>
              <span className="text-xs text-slate-400">
                তৈরি: {formatDate(file.createdAt)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              {file.name}
              <button
                onClick={() => onEditFileModalOpen(file)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                title="ফাইলের নাম ও বিবরণ পরিবর্তন"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </h2>
            {file.description && (
              <p className="text-xs text-slate-500 mt-0.5">{file.description}</p>
            )}
          </div>
        </div>

        {/* Quick Add Buttons: Income & Expense */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Add Income Button */}
          <button
            onClick={() => openAddModal('income')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95 text-xs sm:text-sm whitespace-nowrap"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ আয় এন্ট্রি</span>
          </button>

          {/* Add Expense Button */}
          <button
            onClick={() => openAddModal('expense')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer active:scale-95 text-xs sm:text-sm whitespace-nowrap"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ ব্যয় এন্ট্রি</span>
          </button>

          {/* Print Button */}
          <button
            onClick={() => setIsPrintOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="প্রিন্ট বা পিডিএফ ভিউ"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File's Own Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>বর্তমান অবশিষ্ট ব্যালেন্স</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">
            {formatCurrency(summary.balance, useBengaliDigits)}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {summary.balance >= 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">
                <CheckCircle className="w-3 h-3" />
                উদ্বৃত্ত তহবিল
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full font-bold">
                <AlertCircle className="w-3 h-3" />
                ঘাটতি রয়েছে
              </span>
            )}
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold text-emerald-700">মোট জমা / আয়</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {formatCurrency(summary.totalIncome, useBengaliDigits)}
            </div>
          </div>
          <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
            <span>উপার্জন ও প্রাপ্তি</span>
            <span className="font-bold text-emerald-600">
              {file.transactions.filter(t => t.type === 'income').length} টি এন্ট্রি
            </span>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold text-rose-700">মোট খরচ / ব্যয়</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-700">
              {formatCurrency(summary.totalExpense, useBengaliDigits)}
            </div>
          </div>
          <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
            <span>দৈনন্দিন ও অন্যান্য ব্যয়</span>
            <span className="font-bold text-rose-600">
              {file.transactions.filter(t => t.type === 'expense').length} টি এন্ট্রি
            </span>
          </div>
        </div>

        {/* Total Transactions & Burn Rate Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>মোট লেনদেন সংখ্যা</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {summary.count} টি
            </div>
          </div>
          <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
            <span>খরচ অনুপাত</span>
            <span className="font-bold text-slate-700">
              {summary.totalIncome > 0 
                ? `${((summary.totalExpense / summary.totalIncome) * 100).toFixed(0)}% খরচ` 
                : '—'}
            </span>
          </div>
        </div>

      </div>

      {/* Visual Analytics / Category Breakdown */}
      <CategoryBreakdown 
        transactions={file.transactions} 
        useBengaliDigits={useBengaliDigits} 
      />

      {/* Transaction List and History */}
      <TransactionList
        transactions={file.transactions}
        fileName={file.name}
        onEditTransaction={openEditModal}
        onDeleteTransaction={handleDeleteTransaction}
        onPrint={() => setIsPrintOpen(true)}
        useBengaliDigits={useBengaliDigits}
      />

      {/* Transaction Add/Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialType={modalType}
        editTransaction={editingTransaction}
      />

      {/* Print Statement Modal */}
      {isPrintOpen && (
        <PrintStatement
          file={file}
          onClose={() => setIsPrintOpen(false)}
          useBengaliDigits={useBengaliDigits}
        />
      )}

    </div>
  );
}
