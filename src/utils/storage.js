// LocalStorage Data Management for 'Amar Hisab Kori'

const STORAGE_KEY = 'amar_hisab_kori_data_v1';

export const DEFAULT_EXPENSE_CATEGORIES = [
  'বাজার-সদাই',
  'খাবার ও রেস্তোরাঁ',
  'বাসা ভাড়া',
  'যাতায়াত ও ভ্রমণ',
  'বিদ্যুৎ ও ইউটিলিটি বিল',
  'চিকিৎসা ও ওষুধ',
  'শিক্ষা ও বইপত্র',
  'পোশাক ও কেনাকাটা',
  'বিনোদন',
  'ব্যবসায়িক খরচ',
  'ঋণ পরিশোধ',
  'অন্যান্য খরচ',
];

export const DEFAULT_INCOME_CATEGORIES = [
  'বেতন',
  'ব্যবসার লাভ',
  'ফ্রিল্যান্সিং',
  'বাড়ি / দোকান ভাড়া আয়',
  'বোনাস বা ইনসেন্টিভ',
  'বিনিয়োগ মুনাফা',
  'ধার ফেরত পাওয়া',
  'উপহার / অনুদান',
  'অন্যান্য আয়',
];

export const PAYMENT_METHODS = [
  'ক্যাশ (নগদ)',
  'বিকাশ (bKash)',
  'নগদ (Nagad)',
  'রকেট (Rocket)',
  'ব্যাংক ট্রান্সফার',
  'কার্ড (ডেবিট/ক্রেডিট)',
  'অন্যান্য',
];

// Initial demo data so the user has an intuitive experience right away
const INITIAL_DATA = {
  files: [
    {
      id: 'file-demo-1',
      name: 'ব্যক্তিগত ও সংসার খরচ ২০২৬',
      description: 'দৈনন্দিন পারিবারিক বাজার, বিল ও আয়ের খাতা',
      color: 'emerald',
      icon: 'Home',
      createdAt: '2026-10-01T10:00:00.000Z',
      transactions: [
        {
          id: 'tx-1',
          type: 'income',
          amount: 65000,
          category: 'বেতন',
          paymentMethod: 'ব্যাংক ট্রান্সফার',
          date: '2026-10-01',
          note: 'অক্টোবর মাসের বেতন',
          voucherNo: 'SAL-OCT-01'
        },
        {
          id: 'tx-2',
          type: 'income',
          amount: 12000,
          category: 'ফ্রিল্যান্সিং',
          paymentMethod: 'বিকাশ (bKash)',
          date: '2026-10-04',
          note: 'ইউআই ডিজাইন প্রজেক্টের পেমেন্ট',
          voucherNo: ''
        },
        {
          id: 'tx-3',
          type: 'expense',
          amount: 18000,
          category: 'বাসা ভাড়া',
          paymentMethod: 'ব্যাংক ট্রান্সফার',
          date: '2026-10-02',
          note: 'অক্টোবর মাসের বাসা ভাড়া',
          voucherNo: 'RENT-10'
        },
        {
          id: 'tx-4',
          type: 'expense',
          amount: 6500,
          category: 'বাজার-সদাই',
          paymentMethod: 'ক্যাশ (নগদ)',
          date: '2026-10-05',
          note: 'সাপ্তাহিক মাছ, মাংস ও মুদি বাজার',
          voucherNo: ''
        },
        {
          id: 'tx-5',
          type: 'expense',
          amount: 2400,
          category: 'বিদ্যুৎ ও ইউটিলিটি বিল',
          paymentMethod: 'বিকাশ (bKash)',
          date: '2026-10-07',
          note: 'বিদ্যুৎ ও গ্যাস বিল পরিশোধ',
          voucherNo: 'DESCO-992'
        },
        {
          id: 'tx-6',
          type: 'expense',
          amount: 1500,
          category: 'চিকিৎসা ও ওষুধ',
          paymentMethod: 'ক্যাশ (নগদ)',
          date: '2026-10-09',
          note: 'মাসিক প্রেসক্রিপশনের ওষুধ',
          voucherNo: ''
        }
      ]
    },
    {
      id: 'file-demo-2',
      name: 'ব্যবসা ও প্রজেক্ট ফান্ড',
      description: 'অফিস সাপ্লাই, ক্লায়েন্ট পেমেন্ট ও প্রজেক্ট হিসাব',
      color: 'blue',
      icon: 'Briefcase',
      createdAt: '2026-10-05T14:30:00.000Z',
      transactions: [
        {
          id: 'tx-b1',
          type: 'income',
          amount: 45000,
          category: 'ব্যবসার লাভ',
          paymentMethod: 'ব্যাংক ট্রান্সফার',
          date: '2026-10-05',
          note: 'ওয়েবসাইট ডেভেলপমেন্ট অ্যাডভান্স',
          voucherNo: 'INV-401'
        },
        {
          id: 'tx-b2',
          type: 'expense',
          amount: 12000,
          category: 'ব্যবসায়িক খরচ',
          paymentMethod: 'কার্ড (ডেবিট/ক্রেডিট)',
          date: '2026-10-08',
          note: 'সার্ভার ও ক্লাউড হোস্টিং রিনিউয়াল',
          voucherNo: 'AWS-88'
        }
      ]
    }
  ]
};

export const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.files)) {
      return INITIAL_DATA;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load storage data:', e);
    return INITIAL_DATA;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export const exportDataAsJSON = () => {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `amar-hisab-kori-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.files)) {
      saveData(parsed);
      return true;
    }
  } catch (e) {
    console.error('Invalid JSON file format:', e);
  }
  return false;
};
