import React, { useState, useEffect } from 'react';
import { X, FolderPlus, FolderEdit, Check } from 'lucide-react';

const COLORS = [
  { id: 'emerald', name: 'পান্না সবুজ (Emerald)', bg: 'bg-emerald-500' },
  { id: 'blue', name: 'নীল (Blue)', bg: 'bg-blue-500' },
  { id: 'purple', name: 'বেগুনী (Purple)', bg: 'bg-purple-500' },
  { id: 'amber', name: 'হলুদ-সোনালী (Amber)', bg: 'bg-amber-500' },
  { id: 'rose', name: 'গোলাপি-লাল (Rose)', bg: 'bg-rose-500' },
];

export default function FileModal({ isOpen, onClose, onSave, editFile = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('emerald');

  useEffect(() => {
    if (editFile) {
      setName(editFile.name || '');
      setDescription(editFile.description || '');
      setColor(editFile.color || 'emerald');
    } else {
      setName('');
      setDescription('');
      setColor('emerald');
    }
  }, [editFile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('অনুগ্রহ করে ফাইলের নাম লিখুন!');
      return;
    }

    const fileData = {
      id: editFile ? editFile.id : 'file-' + Date.now(),
      name: name.trim(),
      description: description.trim(),
      color,
      createdAt: editFile ? editFile.createdAt : new Date().toISOString(),
      transactions: editFile ? editFile.transactions : []
    };

    onSave(fileData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {editFile ? <FolderEdit className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editFile ? 'ফাইলের তথ্য সংশোধন করুন' : 'নতুন হিসাব ফাইল খুলুন'}
              </h3>
              <p className="text-xs text-slate-500">
                {editFile ? 'ফাইলের নাম ও বিবরণ আপডেট করুন' : 'নতুন খাতা বা প্রজেক্টের জন্য ফাইল তৈরি করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ফাইলের নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: ব্যক্তিগত ২০২৬, দোকানের হিসাব, বাড়ি নির্মাণ ইত্যাদি..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ফাইলের বিবরণ (ঐচ্ছিক)
            </label>
            <textarea
              rows={2}
              placeholder="এই ফাইলের উদ্দেশ্য বা নোট লিখে রাখুন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ফাইলের থিম রঙ নির্বাচন করুন
            </label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center text-white transition-transform cursor-pointer ${
                    color === c.id ? 'scale-110 ring-3 ring-slate-900/20 shadow-md' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {color === c.id && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer active:scale-95"
            >
              {editFile ? 'সংরক্ষণ করুন' : 'ফাইল খুলুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
