// Formatting utilities for Bengali / English numbers and dates

export const toBengaliDigits = (num) => {
  if (num === null || num === undefined) return '';
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bengaliNumerals[parseInt(d, 10)]);
};

export const formatCurrency = (amount, useBengaliDigits = false) => {
  const num = Number(amount) || 0;
  const formattedEn = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);

  if (useBengaliDigits) {
    return `৳ ${toBengaliDigits(formattedEn)}`;
  }
  return `৳ ${formattedEn}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const day = d.getDate();
    const month = monthsBn[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
};

export const calculateFileSummary = (transactions = []) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
    } else if (tx.type === 'expense') {
      totalExpense += amt;
    }
  });

  const balance = totalIncome - totalExpense;
  const count = transactions.length;

  return {
    totalIncome,
    totalExpense,
    balance,
    count
  };
};

export const calculateGlobalSummary = (files = []) => {
  let totalIncome = 0;
  let totalExpense = 0;
  let totalFiles = files.length;
  let totalTransactions = 0;

  files.forEach((file) => {
    const sum = calculateFileSummary(file.transactions);
    totalIncome += sum.totalIncome;
    totalExpense += sum.totalExpense;
    totalTransactions += sum.count;
  });

  return {
    totalFiles,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    totalTransactions
  };
};
