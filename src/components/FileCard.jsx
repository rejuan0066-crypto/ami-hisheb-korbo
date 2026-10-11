import React from 'react';
import { 
  Folder, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  TrendingUp,
  Receipt,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatDate, calculateFileSummary } from '../utils/formatters';

const COLOR_CLASSES = {
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cardHover: 'hover:border-emerald-300',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accent: 'bg-emerald-600'
  },
  blue: {
    bg: 'bg-blue-50 text-blue-600 border-blue-200',
    cardHover: 'hover:border-blue-300',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    accent: 'bg-blue-600'
  },
  purple: {
    bg: 'bg-purple-50 text-purple-600 border-purple-200',
    cardHover: 'hover:border-purple-300',
    gradient: 'from-purple-500/10 to-pink-500/10',
    accent: 'bg-purple-600'
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600 border-amber-200',
    cardHover: 'hover:border-amber-300',
    gradient: 'from-amber-500/10 to-orange-500/10',
    accent: 'bg-amber-600'
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600 border-rose-200',
    cardHover: 'hover:border-rose-300',
    gradient: 'from-rose-500/10 to-red-500/10',
    accent: 'bg-rose-600'
  }
};

export default function FileCard({ 
  file, 
  onSelectFile, 
  onEditFile, 
  onDeleteFile,
  useBengaliDigits 
}) {
  const summary = calculateFileSummary(file.transactions);
  const colorScheme = COLOR_CLASSES[file.color] || COLOR_CLASSES.emerald;

  return (
    <div 
      className={`group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 p-5 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer`}
      onClick={() => onSelectFile(file)}
    >
      {/* Top Background Ambient Glow */}
      <div className={`absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-gradient-to-br ${colorScheme.gradient} blur-xl group-hover:scale-125 transition-transform`} />

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorScheme.bg} shadow-xs font-bold text-xl`}>
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {file.description || 'কোনো বিবরণ নেই'}
              </p>
            </div>
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEditFile(file)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="ফাইলের নাম ও বিবরণ পরিবর্তন"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteFile(file.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="ফাইল মুছে ফেলুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date & Transactions count */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-100">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(file.createdAt)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5" />
            {summary.count} টি লেনদেন
          </span>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 mb-0.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>মোট আয়</span>
            </div>
            <p className="font-bold text-emerald-800 text-sm sm:text-base">
              {formatCurrency(summary.totalIncome, useBengaliDigits)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100">
            <div className="flex items-center gap-1 text-[11px] font-medium text-rose-700 mb-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
              <span>মোট ব্যয়</span>
            </div>
            <p className="font-bold text-rose-800 text-sm sm:text-base">
              {formatCurrency(summary.totalExpense, useBengaliDigits)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Net Balance & Open button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">বর্তমান ব্যালেন্স</span>
          <span className={`text-base font-bold ${summary.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            {formatCurrency(summary.balance, useBengaliDigits)}
          </span>
        </div>

        <button 
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 bg-emerald-50 group-hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
        >
          ড্যাশবোর্ড খুলুন
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
