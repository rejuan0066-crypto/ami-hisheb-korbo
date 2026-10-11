import React, { useState } from 'react';
import { 
  FolderPlus, 
  Search, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Files, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import FileCard from './FileCard';
import { formatCurrency, calculateGlobalSummary } from '../utils/formatters';

export default function FileList({ 
  files = [], 
  onSelectFile, 
  onOpenNewFileModal, 
  onEditFile, 
  onDeleteFile,
  useBengaliDigits 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const globalSummary = calculateGlobalSummary(files);

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero & Global Overview Cards */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium mb-3 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                স্মার্ট হিসাব খাতা ও ড্যাশবোর্ড
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                আপনার সকল হিসাব ফাইলের সংক্ষিপ্তসার
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                প্রতিটি কাজের জন্য আলাদা ফাইল খুলুন, আয়-ব্যয় যোগ করুন এবং ফাইল অনুযায়ী সম্পূর্ণ হিসাব ও বিশ্লেষণ ড্যাশবোর্ডে দেখুন।
              </p>
            </div>

            <button
              onClick={onOpenNewFileModal}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition cursor-pointer active:scale-95 whitespace-nowrap self-start md:self-auto"
            >
              <FolderPlus className="w-5 h-5" />
              <span>নতুন হিসাব ফাইল খুলুন</span>
            </button>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total Balance */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1.5">
                <span>সর্বমোট স্থিতি (ব্যালেন্স)</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {formatCurrency(globalSummary.balance, useBengaliDigits)}
              </div>
              <div className="text-[11px] text-emerald-300 mt-1 font-medium">
                সব ফাইল মিলিয়ে নীট তহবিল
              </div>
            </div>

            {/* Total Income */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1.5">
                <span>সর্বমোট মোট আয়</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                {formatCurrency(globalSummary.totalIncome, useBengaliDigits)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1 font-medium">
                জমা ও উপার্জনের সমষ্টি
              </div>
            </div>

            {/* Total Expense */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1.5">
                <span>সর্বমোট মোট ব্যয়</span>
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-300">
                {formatCurrency(globalSummary.totalExpense, useBengaliDigits)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1 font-medium">
                সকল খরচের সমষ্টি
              </div>
            </div>

            {/* Total Files & Transactions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1.5">
                <span>মোট ফাইল ও এন্ট্রি</span>
                <Files className="w-4 h-4 text-teal-300" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {globalSummary.totalFiles} টি ফাইল
              </div>
              <div className="text-[11px] text-slate-300 mt-1 font-medium">
                মোট {globalSummary.totalTransactions} টি লেনদেন নথিভুক্ত
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* File Search & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            হিসাব ফাইলের তালিকা
            <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {files.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            যেকোনো ফাইলে ক্লিক করে তার নিজস্ব আয়-ব্যয় ড্যাশবোর্ডে প্রবেশ করুন
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ফাইলের নাম লিখে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onSelectFile={onSelectFile}
              onEditFile={onEditFile}
              onDeleteFile={onDeleteFile}
              useBengaliDigits={useBengaliDigits}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <FolderPlus className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-1">
            {searchQuery ? 'কোনো ফাইল খুঁজে পাওয়া যায়নি' : 'এখনও কোনো হিসাব ফাইল তৈরি করা হয়নি'}
          </h4>
          <p className="text-sm text-slate-500 mb-6">
            {searchQuery 
              ? 'অনুগ্রহ করে অন্য কোনো নাম দিয়ে চেষ্টা করুন।' 
              : 'একটি নতুন ফাইল খুলে ব্যক্তিগত খরচ, ব্যবসা বা প্রজেক্টের আয়-ব্যয় হিসাব শুরু করুন।'}
          </p>
          <button
            onClick={onOpenNewFileModal}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>নতুন ফাইল তৈরি করুন</span>
          </button>
        </div>
      )}

    </div>
  );
}
