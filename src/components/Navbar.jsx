import React, { useRef } from 'react';
import { 
  FolderPlus, 
  ArrowLeft, 
  WalletCards, 
  Download, 
  Upload, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON } from '../utils/storage';

export default function Navbar({ 
  activeFile, 
  onBackToFiles, 
  onOpenNewFileModal,
  onDataRefresh,
  useBengaliDigits,
  setUseBengaliDigits
}) {
  const fileInputRef = useRef(null);

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content && typeof content === 'string') {
        const success = importDataFromJSON(content);
        if (success) {
          alert('ডেটা সফলভাবে ইমপোর্ট করা হয়েছে!');
          onDataRefresh();
        } else {
          alert('ভুল ফাইল ফরম্যাট! দয়া করে সঠিক JSON ব্যাকআপ ফাইল নির্বাচন করুন।');
        }
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-3">
            {activeFile && (
              <button
                onClick={onBackToFiles}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="সকল ফাইলের তালিকায় ফিরে যান"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">সব ফাইল</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <WalletCards className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  আমার হিসাব করি
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    ফাইল ভিত্তিক হিসাব
                  </span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {activeFile ? `বর্তমান ফাইল: ${activeFile.name}` : 'আলাদা আলাদা ফাইলে সহজ ও নিখুঁত আয়-ব্যয় ব্যবস্থাপনা'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Number format toggle */}
            <button
              onClick={() => setUseBengaliDigits(!useBengaliDigits)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="সংখ্যা বাংলায় বা ইংরেজিতে পরিবর্তন করুন"
            >
              সংখ্যা: {useBengaliDigits ? 'বাংলা (১২৩)' : 'ইংরেজি (123)'}
            </button>

            {/* Backup / Export */}
            <button
              onClick={exportDataAsJSON}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              title="সকল হিসাবের ব্যাকআপ ডাউনলোড করুন (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Restore / Import */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileImport} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              title="আগের ব্যাকআপ ফাইল রিস্টোর করুন"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Create New File Button */}
            <button
              onClick={onOpenNewFileModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-xs transition shadow-emerald-600/25 cursor-pointer active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span>নতুন ফাইল</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
