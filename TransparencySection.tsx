import React, { useState } from 'react';
import { ShieldCheck, FileText, Search, ArrowDownRight, ArrowUpRight, CheckCircle2, Eye, X, BookOpen, Lock } from 'lucide-react';
import { FinancialRecord, Donation, Language, MapConfig, Project } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { INITIAL_MAP_CONFIG, INITIAL_PROJECTS } from '../data/mockData';
import { TransparencyAnalytics } from './TransparencyAnalytics';
import { DonationTrendChart } from './DonationTrendChart';
import { YearOverYearImpactChart } from './YearOverYearImpactChart';
import { DistrictBeneficiariesMap } from './DistrictBeneficiariesMap';
import { ReportsArchiveModal } from './common/ReportsArchiveModal';
import { DonationGoalProgress } from './common/DonationGoalProgress';

interface TransparencySectionProps {
  records: FinancialRecord[];
  projects?: Project[];
  donations?: Donation[];
  mapConfig?: MapConfig;
  language: Language;
  onToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({ records, projects = INITIAL_PROJECTS, donations = [], mapConfig = INITIAL_MAP_CONFIG, language, onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isReportsArchiveOpen, setIsReportsArchiveOpen] = useState(false);

  const t = TRANSLATIONS[language];

  const filteredRecords = records.filter((rec) => {
    if (!rec) return false;
    const matchesType = typeFilter === 'all' || rec.type === typeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      String(rec.voucherNumber || '').toLowerCase().includes(query) ||
      String(rec.category || '').toLowerCase().includes(query) ||
      String((language === 'bn' ? rec.descriptionBn : rec.descriptionEn) || '').toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  const formatCurrency = (val: number) => `৳${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <section id="transparency" className="py-12 sm:py-16 bg-transparent transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A] mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'শতভাগ জবাবদিহিতা' : 'Uncompromising Governance'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl stylish-title">
              {t.transparencyTitle}
            </h2>
            <span className="stylish-title-rule" aria-hidden="true" />
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-2 max-w-2xl">
              {t.transparencySubtitle}
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsReportsArchiveOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#102B3F] to-[#167D78] hover:from-[#167D78] hover:to-[#102B3F] rounded-xl transition-all cursor-pointer shadow-md"
              title="View Constitution & Annual Audit Archive"
            >
              <BookOpen className="w-4 h-4 text-[#D6F36A]" />
              <span>{language === 'bn' ? 'গঠনতন্ত্র ও অডিট আর্কাইভ' : 'Constitution & Audit Archive'}</span>
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#102B3F] dark:text-white bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-[#167D78] rounded-xl transition-colors cursor-pointer btn-outline-interaction"
            >
              <Eye className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A]" />
              <span>{language === 'bn' ? 'পূর্ণ অডিট প্রতিবেদন দেখুন' : 'View Audit Statement'}</span>
            </button>
          </div>
        </div>

        {/* Official Print Header for Hard-Copy Financial Audit Ledger */}
        <div className="print-only print-document-header">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-black text-[#102B3F]">
                CoLASH Foundation (কোলাশ ফাউন্ডেশন)
              </div>
              <div className="text-[9pt] text-stone-600">
                {language === 'bn'
                  ? 'প্রকাশ্য আর্থিক স্বচ্ছতা ও বার্ষিক অডিট লেজার (অর্থবছর ২০২৫–২০২৬)'
                  : 'Public Financial Transparency & Annual Statutory Audit Ledger (FY 2025–2026)'}
              </div>
            </div>
            <div className="text-right text-[8.5pt] font-mono text-stone-600">
              <div>কমলগঞ্জ, মৌলভীবাজার</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* 3 Overview KPI Cards */}
        <div className="print-audit-kpi-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="print-audit-kpi-card p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {t.totalRaised}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#167D78] dark:text-[#D6F36A] tabular-nums">
              ৳42,85,000
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {language === 'bn' ? '১,২৪০+ জন শুভানুধ্যায়ী ও প্রতিষ্ঠানের অনুদান' : 'From 1,240+ verified donors'}
            </div>
          </div>

          <div className="print-audit-kpi-card p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {t.totalSpent}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#102B3F] dark:text-white tabular-nums">
              ৳38,15,000
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {language === 'bn' ? 'সরাসরি ত্রাণ, চিকিৎসা সামগ্রী ও শিক্ষা উপকরণ' : 'Direct aid, relief kits & student supplies'}
            </div>
          </div>

          <div className="print-audit-kpi-card p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {t.emergencyFund}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E6A15B] tabular-nums">
              ৳4,70,000
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {language === 'bn' ? 'হঠাৎ জরুরি দুর্যোগ মোকাবেলায় সংরক্ষিত' : 'Instant reserve for rapid disaster response'}
            </div>
          </div>
        </div>

        {/* Live Donation Goal Progress Tracker */}
        <div className="mb-12">
          <DonationGoalProgress
            mode="campaign"
            language={language}
            projects={projects}
          />
        </div>

        {/* Year-over-Year 3-Year Impact Trend Visual Dashboard */}
        <YearOverYearImpactChart
          language={language}
          projects={projects}
          records={records}
          donations={donations}
          className="mb-12"
        />

        {/* District-Wise Beneficiaries & Branch Distribution Google Map */}
        <DistrictBeneficiariesMap
          mapConfig={mapConfig}
          projects={projects}
          language={language}
          className="mb-12"
        />

        {/* Visual Analytics Component: Historical Donation Trends & Category Impact */}
        <TransparencyAnalytics language={language} projects={projects} />

        {/* Detailed Category-wise Line Chart Component */}
        <DonationTrendChart language={language} className="mb-12" />

        {/* Expense Breakdown Visual Bar */}
        <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-sm font-bold text-[#102B3F] dark:text-white">
              {t.expenseBreakdown}
            </span>
            <span className="text-xs text-stone-500">
              {language === 'bn' ? 'আন্তর্জাতিক হিসাব মানদণ্ড অনুযায়ী পরিচালিত' : 'Statutory Non-Profit Expenditure Standard'}
            </span>
          </div>

          {/* Segmented multi-color bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex mb-4 bg-stone-200 dark:bg-stone-800">
            <div style={{ width: '88%' }} className="bg-[#167D78] h-full" title="88% Field Programs" />
            <div style={{ width: '7%' }} className="bg-[#E6A15B] h-full" title="7% Logistics" />
            <div style={{ width: '5%' }} className="bg-[#102B3F] dark:bg-stone-600 h-full" title="5% Administration" />
          </div>

          {/* Clean Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#167D78]" />
              <span className="text-stone-700 dark:text-stone-300 font-medium">{t.fieldPrograms}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#E6A15B]" />
              <span className="text-stone-700 dark:text-stone-300 font-medium">{t.logistics}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#102B3F] dark:bg-stone-600" />
              <span className="text-stone-700 dark:text-stone-300 font-medium">{t.adminOffice}</span>
            </div>
          </div>
        </div>

        {/* Public Live Ledger Search & Filter */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-stone-50/80 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#102B3F] dark:text-white">
                {t.recentTransactions}
              </span>
              <span className="text-xs text-stone-400">({filteredRecords.length} records)</span>
            </div>

            <div className="no-print flex items-center gap-3">
              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-stone-800 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${typeFilter === 'all' ? 'bg-white dark:bg-[#102B3F] text-stone-900 dark:text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  {language === 'bn' ? 'সকল' : 'All'}
                </button>
                <button
                  onClick={() => setTypeFilter('income')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${typeFilter === 'income' ? 'bg-white dark:bg-[#102B3F] text-stone-900 dark:text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  {language === 'bn' ? 'আয় (Income)' : 'Income'}
                </button>
                <button
                  onClick={() => setTypeFilter('expense')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${typeFilter === 'expense' ? 'bg-white dark:bg-[#102B3F] text-stone-900 dark:text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  {language === 'bn' ? 'ব্যয় (Expense)' : 'Expense'}
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchLedger}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78] w-48 sm:w-60"
                />
              </div>
            </div>

          </div>

          {/* Table Container */}
          <div className="print-audit-table-wrapper overflow-x-auto">
            <table className="print-audit-table w-full text-left text-xs">
              <thead className="bg-stone-100/70 dark:bg-stone-900/60 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'ভাউচার / রেফারেন্স' : 'Voucher'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'খাত ও বিবরণ' : 'Category & Description'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'ধরণ' : 'Type'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'পরিমাণ (টাকা)' : 'Amount (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 bg-white dark:bg-[#0c1a24]">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      {language === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি।' : 'No records found matching your search.'}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const isIncome = rec.type === 'income';
                    return (
                      <tr key={rec.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-medium">
                          {rec.date}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold text-stone-700 dark:text-stone-300">
                          {rec.voucherNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-900 dark:text-white">
                            {rec.category}
                          </div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">
                            {language === 'bn' ? rec.descriptionBn : rec.descriptionEn}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 font-semibold ${isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}>
                            {isIncome ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            <span>{isIncome ? (language === 'bn' ? 'অনুদান জমা' : 'Credit') : (language === 'bn' ? 'মাঠ খরচ' : 'Debit')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right font-bold tabular-nums text-stone-900 dark:text-white">
                          <span className={isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-800 dark:text-stone-200'}>
                            {isIncome ? '+' : '-'} {formatCurrency(rec.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Official Annual Audit Report Modal (Full-Page Readable View-Only) */}
      {showAuditModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/75 sm:backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuditModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-screen sm:min-h-0 sm:my-6 sm:mx-auto sm:max-w-4xl w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden">
            {/* Slim Sticky Top Bar */}
            <div className="sticky top-0 z-20 bg-[#102B3F] text-white px-4 sm:px-6 h-14 flex items-center justify-between gap-3 border-b border-white/15">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-[#D6F36A] shrink-0" />
                <h3 className="font-bold text-sm sm:text-base truncate">
                  {language === 'bn' ? 'বার্ষিক অভ্যন্তরীণ আর্থিক বিবরণী (FY 2025–2026)' : 'Annual Internal Financial Statement 2025–2026'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
              </button>
            </div>

            <div className="p-5 sm:p-8 space-y-6 text-sm text-stone-700 dark:text-stone-300">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs sm:text-sm text-[#102B3F] dark:text-teal-200">
                <span className="inline-flex items-center gap-2 font-bold">
                  <Lock className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
                  <span>
                    {language === 'bn'
                      ? 'জনসাধারণের জন্য কেবল অনলাইন পরিদর্শনযোগ্য (View Only — ডাউনলোড সংরক্ষিত)'
                      : 'Public View-Only Financial Inspection (Downloads Restricted)'}
                  </span>
                </span>
                <span className="font-mono text-xs text-[#167D78] dark:text-[#D6F36A] font-bold">CLSH-FIN-2026</span>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
                <div className="font-extrabold text-base text-[#102B3F] dark:text-white">
                  {language === 'bn'
                    ? 'অর্থ সচিবালয়ের অভ্যন্তরীণ হিসাব প্রত্যয়ন ও নোট (Internal Accounts Note)'
                    : 'Internal Finance Secretariat Disclosure & Note'}
                </div>
                <p className="leading-relaxed text-sm sm:text-base">
                  {language === 'bn'
                    ? 'কোলাশ ফাউন্ডেশনের ১ জুলাই ২০২৫ থেকে ৩০ জুন ২০২৬ পর্যন্ত সমাপ্ত অর্থবছরের আয়-ব্যয়ের এই বিবরণী অর্থ সচিবালয়ের অভ্যন্তরীণ হিসাব ও লেনদেনের নথির ভিত্তিতে সংকলিত। আনুষ্ঠানিক বাহ্যিক চার্টার্ড অ্যাকাউন্ট্যান্ট (CA) অডিট এখনো সম্পন্ন হয়নি; স্বচ্ছতার স্বার্থে প্রাথমিক হিসাব সর্বসাধারণের দেখার জন্য উন্মুক্ত রাখা হয়েছে।'
                    : 'This FY 2025–2026 financial statement is compiled from CoLASH Foundation internal secretariat ledgers for public transparency. An independent external Chartered Accountant audit has not yet been conducted.'}
                </p>
                <div className="text-xs text-stone-500 dark:text-stone-400 pt-1">
                  {language === 'bn'
                    ? 'প্রস্তুতকারী: কোলাশ ফাউন্ডেশন অভ্যন্তরীণ অর্থ সচিবালয় (বাহ্যিক সিএ অডিট এখনো সম্পন্ন হয়নি)'
                    : 'Prepared by: CoLASH Internal Finance Secretariat (External CA Audit Pending)'}
                </div>
              </div>

              {/* Financial Snapshot Table */}
              <div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-white mb-3">
                  {language === 'bn' ? 'আর্থিক সারসংক্ষেপ বিবরণী (FY 2025–2026)' : 'Financial Statement Summary (FY 2025–2026)'}
                </h4>
                <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="p-3.5">{language === 'bn' ? 'আর্থিক খাত / বিবরণ' : 'Account Line Item'}</th>
                        <th className="p-3.5 text-right">{language === 'bn' ? 'পরিমাণ (টাকা)' : 'Amount (BDT)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                      <tr className="bg-stone-50/70 dark:bg-stone-900/40 font-medium">
                        <td className="p-3.5">প্রাথমিক প্রারম্ভিক তহবিল (Opening Balance)</td>
                        <td className="p-3.5 text-right font-mono tabular-nums whitespace-nowrap">৳২,১৫,০০০</td>
                      </tr>
                      <tr>
                        <td className="p-3.5">মোট প্রাপ্ত সাধারণ ও জরুরি অনুদান (Donations Received)</td>
                        <td className="p-3.5 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">৳৪০,৭০,০০০</td>
                      </tr>
                      <tr>
                        <td className="p-3.5">মাঠপর্যায়ে সরাসরি কার্যক্রম ব্যয় (Direct Program Expenditure)</td>
                        <td className="p-3.5 text-right font-mono tabular-nums text-stone-800 dark:text-stone-200 whitespace-nowrap">(৳৩৫,৬০,০০০)</td>
                      </tr>
                      <tr>
                        <td className="p-3.5">পরিবহন, নৌকা ভাড়া ও মাঠ লজিস্টিকস (Field Logistics & Boats)</td>
                        <td className="p-3.5 text-right font-mono tabular-nums text-stone-800 dark:text-stone-200 whitespace-nowrap">(৳২,৫৫,০০০)</td>
                      </tr>
                      <tr>
                        <td className="p-3.5">দাপ্তরিক ও পরিচালনা ব্যয় (Administrative & Operations)</td>
                        <td className="p-3.5 text-right font-mono tabular-nums text-stone-800 dark:text-stone-200 whitespace-nowrap">(৳১,৮৫,০০০)</td>
                      </tr>
                      <tr className="bg-stone-100 dark:bg-stone-800 font-bold">
                        <td className="p-3.5">সমাপনী আপদকালীন উদ্বৃত্ত তহবিল (Net Closing Reserve)</td>
                        <td className="p-3.5 text-right font-mono tabular-nums text-[#167D78] dark:text-[#D6F36A] whitespace-nowrap">৳২,৮৫,০০০</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 sm:px-8 sm:py-5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAuditModal(false);
                  setIsReportsArchiveOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-[#102B3F] dark:text-white bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-[#167D78] rounded-xl cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A]" />
                <span>{language === 'bn' ? 'পূর্ণ অডিট আর্কাইভ পড়ুন' : 'Open Full Audit Archive'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-xl transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Constitution & Audit Reports Archive Modal */}
      <ReportsArchiveModal
        isOpen={isReportsArchiveOpen}
        onClose={() => setIsReportsArchiveOpen(false)}
        language={language}
      />

    </section>
  );
};
