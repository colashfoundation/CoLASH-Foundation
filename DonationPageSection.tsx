import React, { useState, useEffect } from 'react';
import {
  Heart,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Download,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Loader2,
  AlertCircle,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { Project, Language, Donation, WebsiteCustomConfig, PaymentChannel } from '../types';
import { INITIAL_PAYMENT_CHANNELS } from '../data/paymentChannels';
import { CHARITY_TEACHINGS, FaithKey } from '../data/charityTeachings';
import { DonationGoalProgress } from './common/DonationGoalProgress';
import { MagneticButton } from './common/MagneticButton';

interface DonationPageSectionProps {
  language: Language;
  projects: Project[];
  preselectedProject?: Project | null;
  websiteConfig?: WebsiteCustomConfig;
  paymentChannels?: PaymentChannel[];
  onDonationSuccess: (donation: Donation) => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const DonationPageSection: React.FC<DonationPageSectionProps> = ({
  language,
  projects,
  preselectedProject,
  paymentChannels = INITIAL_PAYMENT_CHANNELS,
  onDonationSuccess,
  onToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(preselectedProject?.id || 'general');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'onetime' | 'monthly'>('onetime');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');

  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');

  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorNotes, setDonorNotes] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createdReceipt, setCreatedReceipt] = useState<Donation | null>(null);
  const [copiedChannelId, setCopiedChannelId] = useState<string | null>(null);

  // Interfaith teachings filter
  const [selectedFaith, setSelectedFaith] = useState<'all' | FaithKey>('all');

  useEffect(() => {
    if (preselectedProject?.id) {
      setSelectedProjectId(preselectedProject.id);
    }
  }, [preselectedProject]);

  const activeChannels = (paymentChannels.length > 0 ? paymentChannels : INITIAL_PAYMENT_CHANNELS).filter(
    (c) => c.gateway === paymentMethod && c.isActive
  );

  useEffect(() => {
    if (
      activeChannels.length > 0 &&
      (!selectedChannelId || !activeChannels.some((c) => c.id === selectedChannelId))
    ) {
      setSelectedChannelId(activeChannels[0].id);
    }
  }, [paymentMethod, activeChannels, selectedChannelId]);

  const presetAmounts = [1, 50, 100, 500, 1000, 5000];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
    setValidationError(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setAmount(val ? Number(val) : 0);
    setValidationError(null);
  };

  const getSelectedProjectTitle = () => {
    if (selectedProjectId === 'general') {
      return language === 'bn'
        ? 'সাধারণ জরুরি ত্রাণ ও মানবকল্যাণ তহবিল'
        : 'General Emergency & Welfare Fund';
    }
    const found = projects.find((p) => p.id === selectedProjectId);
    return found ? (language === 'bn' ? found.titleBn : found.titleEn) : 'General Relief';
  };

  const handleStep1Next = () => {
    if (!Number.isFinite(amount) || amount < 1) {
      setValidationError(
        language === 'bn'
          ? 'অনুগ্রহ করে সর্বনিম্ন ১ টাকা (৳১) বা তার বেশি যেকোনো পরিমাণ অনুদান প্রদান করুন।'
          : 'Please enter an amount of at least BDT 1.'
      );
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!senderPhone.trim() || senderPhone.trim().length < 10) {
      setValidationError(
        language === 'bn'
          ? 'সঠিক প্রেরক মোবাইল নম্বর প্রদান করুন (কমপক্ষে ১০-১১ ডিজিট)'
          : 'Please enter a valid sender mobile number.'
      );
      return;
    }
    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setValidationError(
        language === 'bn'
          ? 'সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন'
          : 'Please provide a valid Transaction ID.'
      );
      return;
    }
    setValidationError(null);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnonymous && !donorName.trim()) {
      setValidationError(
        language === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম লিখুন অথবা পরিচয় গোপন (Anonymous) নির্বাচন করুন।'
          : 'Please enter your name or choose anonymous.'
      );
      return;
    }

    setValidationError(null);
    setIsProcessing(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const receiptNum = `CLF-2026-${randomSuffix}`;
      const generatedTrx =
        transactionId.trim() || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newDonation: Donation = {
        id: `dn-${Date.now()}`,
        receiptNumber: receiptNum,
        donorName: isAnonymous
          ? language === 'bn'
            ? 'শুভাকাঙ্ক্ষী (গোপন রাখা হয়েছে)'
            : 'Anonymous Well-wisher'
          : donorName.trim() || 'Valued Donor',
        donorEmail: donorEmail.trim() || 'donor@colash.org',
        donorPhone: donorPhone.trim() || senderPhone.trim() || 'N/A',
        amount: amount >= 1 ? amount : 1,
        purpose: selectedProjectId,
        purposeNameBn: getSelectedProjectTitle(),
        purposeNameEn: getSelectedProjectTitle(),
        paymentMethod,
        transactionId: generatedTrx,
        date: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isVerified: true,
        isAnonymous,
        notes: donorNotes,
      };

      setCreatedReceipt(newDonation);
      onDonationSuccess(newDonation);
      setIsProcessing(false);
      setStep(4);
    }, 650);
  };

  const copyToClipboard = (text: string, channelId: string) => {
    navigator.clipboard?.writeText(text)?.catch(() => {});
    setCopiedChannelId(channelId);
    onToast?.(
      'success',
      language === 'bn' ? 'নম্বর কপি হয়েছে' : 'Number Copied',
      text
    );
    setTimeout(() => setCopiedChannelId(null), 2500);
  };

  const handleDownloadReceipt = () => {
    if (!createdReceipt) return;
    const receiptHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Donation Receipt - ${createdReceipt.receiptNumber}</title>
  <style>
    body { font-family: sans-serif; background: #fdfdfd; color: #102B3F; padding: 40px; margin: 0; }
    .receipt-box { max-width: 650px; margin: 0 auto; border: 2px solid #167D78; border-radius: 12px; padding: 32px; background: white; }
    .header { border-bottom: 2px solid #eee; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: bold; color: #102B3F; margin: 0; }
    .meta { font-size: 13px; color: #666; margin-top: 4px; }
    .receipt-num { font-family: monospace; font-size: 16px; color: #167D78; font-weight: bold; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; margin-bottom: 24px; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .val { font-weight: bold; }
    .amount-box { background: #f4faf9; border: 1px solid #c2e5e1; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .amount { font-size: 28px; font-weight: 800; color: #167D78; }
    .footer { border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #888; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="receipt-box">
    <div class="header">
      <div>
        <h1 class="title">CoLASH Foundation</h1>
        <div class="meta">Circle of Light and Service for Humanity</div>
      </div>
      <div style="text-align: right;">
        <div class="receipt-num">${createdReceipt.receiptNumber}</div>
        <div class="meta">${createdReceipt.date}</div>
      </div>
    </div>
    <div class="grid">
      <div><div class="label">Donor Name</div><div class="val">${createdReceipt.donorName}</div></div>
      <div><div class="label">Allocated Purpose</div><div class="val">${createdReceipt.purposeNameBn}</div></div>
      <div><div class="label">Payment Method</div><div class="val">${createdReceipt.paymentMethod.toUpperCase()} (TrxID: ${createdReceipt.transactionId})</div></div>
      <div><div class="label">Phone / Reference</div><div class="val">${createdReceipt.donorPhone}</div></div>
    </div>
    <div class="amount-box">
      <div class="label">Total Amount Donated</div>
      <div class="amount">BDT ${createdReceipt.amount.toLocaleString()}</div>
    </div>
    <div class="footer">
      <div>Signed: Finance & Audit Committee</div>
      <div>Official Digitally Generated Receipt · 100% Transparent Philanthropy</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CoLASH-Receipt-${createdReceipt.receiptNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetForNewDonation = () => {
    setStep(1);
    setCreatedReceipt(null);
    setTransactionId('');
    setSenderPhone('');
    setDonorNotes('');
    setValidationError(null);
  };

  const faithTabs: Array<{ id: 'all' | FaithKey; labelBn: string; labelEn: string }> = [
    { id: 'all', labelBn: 'সকল ধর্মের বাণী', labelEn: 'All Faiths' },
    { id: 'islam', labelBn: 'ইসলাম (হাদীস ও কুরআন)', labelEn: 'Islam' },
    { id: 'hinduism', labelBn: 'হিন্দু ধর্ম (গীতা ও উপনিষদ)', labelEn: 'Hinduism' },
    { id: 'buddhism', labelBn: 'বৌদ্ধ ধর্ম (ধম্মপদ)', labelEn: 'Buddhism' },
    { id: 'christianity', labelBn: 'খৃষ্টান ধর্ম (পবিত্র বাইবেল)', labelEn: 'Christianity' },
  ];

  const visibleTeachings =
    selectedFaith === 'all'
      ? CHARITY_TEACHINGS
      : CHARITY_TEACHINGS.filter((item) => item.faith === selectedFaith);

  return (
    <section id="donate" className="py-8 sm:py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">

        {/* Editorial Page Header */}
        <header className="max-w-3xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            {language === 'bn'
              ? 'সর্বনিম্ন ১ টাকা থেকেই মানবতার তহবিল · অসাম্প্রদায়িক জনকল্যাণ'
              : 'Minimum BDT 1 Donation · Non-Communal Philanthropy'}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-[2.5rem] stylish-title text-balance">
            {language === 'bn'
              ? 'মাত্র ১ টাকা (৳১) হলেও মানবতার সেবায় দান করুন'
              : 'Donate From BDT 1 — Every Caring Hand Matters'}
          </h1>
          <span className="stylish-title-rule" aria-hidden="true" />
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {language === 'bn'
              ? 'অনুদানের পরিমাণ বড় কি ছোট তা মুখ্য নয়—আপনার সামর্থ্য অনুযায়ী মাত্র ৳১ টাকা বা তার বেশি যেকোনো অনুদানই বন্যার্তদের খাদ্য, দরিদ্র শিক্ষার্থীর বই ও জরুরি চিকিৎসায় সরাসরি ব্যয় হয়।'
              : 'Generosity is measured by compassion, not size. Any contribution starting from BDT 1 goes directly to flood relief, student scholarships, and community healthcare.'}
          </p>
        </header>

        {/* Primary Donation Workspace + Interfaith Summary Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left 7 Cols: Interactive Donation Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden">

            <div className="no-print bg-gradient-to-r from-[#102B3F] to-[#167D78] p-5 sm:p-6 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D6F36A] shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    {language === 'bn' ? 'অনলাইন অনুদান ফর্ম (সর্বনিম্ন ৳১)' : 'Online Donation Form (Min BDT 1)'}
                  </h2>
                  <p className="text-xs text-stone-200">
                    {language === 'bn'
                      ? '১০০% স্বচ্ছ হিসাব · তাৎক্ষণিক ডিজিটাল রসিদ'
                      : '100% Transparent Accounting · Instant Digital Receipt'}
                  </p>
                </div>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-stone-300 block">
                  {language === 'bn' ? 'নির্বাচিত অঙ্ক' : 'Selected'}
                </span>
                <span className="text-lg font-black text-[#D6F36A]">
                  ৳{Number(amount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {validationError && (
              <div className="mx-6 mt-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {step < 4 && (
              <div className="px-6 pt-4 pb-2 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                <div
                  className={`flex items-center gap-1.5 font-semibold ${
                    step >= 1 ? 'text-[#167D78] dark:text-[#D6F36A]' : 'text-stone-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>{language === 'bn' ? 'পরিমাণ ও খাত' : 'Amount & Cause'}</span>
                </div>
                <span className="text-stone-300 dark:text-stone-700">──</span>
                <div
                  className={`flex items-center gap-1.5 font-semibold ${
                    step >= 2 ? 'text-[#167D78] dark:text-[#D6F36A]' : 'text-stone-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>{language === 'bn' ? 'বিকাশ / নগদ' : 'bKash / Nagad'}</span>
                </div>
                <span className="text-stone-300 dark:text-stone-700">──</span>
                <div
                  className={`flex items-center gap-1.5 font-semibold ${
                    step >= 3 ? 'text-[#167D78] dark:text-[#D6F36A]' : 'text-stone-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>{language === 'bn' ? 'দাতার তথ্য' : 'Donor Info'}</span>
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                    {language === 'bn' ? 'অনুদানের ধরণ' : 'Donation Frequency'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFrequency('onetime')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        frequency === 'onetime'
                          ? 'bg-white dark:bg-[#102B3F] text-[#102B3F] dark:text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {language === 'bn' ? 'এককালীন অনুদান' : 'One-Time Donation'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        frequency === 'monthly'
                          ? 'bg-white dark:bg-[#102B3F] text-[#102B3F] dark:text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {language === 'bn' ? 'মাসিক স্পনসরশিপ' : 'Monthly Sponsorship'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                    {language === 'bn' ? 'অনুদানের খাত / প্রকল্প নির্বাচন' : 'Select Cause or Project'}
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full text-sm font-medium p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  >
                    <option value="general">
                      {language === 'bn'
                        ? 'সাধারণ জরুরি ত্রাণ ও মানবকল্যাণ তহবিল (সর্বাধিক অগ্রাধিকার)'
                        : 'General Relief & Humanitarian Fund (Highest Priority)'}
                    </option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {language === 'bn' ? proj.titleBn : proj.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <DonationGoalProgress
                  mode="compact"
                  language={language}
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  pendingContribution={amount}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {language === 'bn'
                        ? 'অনুদানের পরিমাণ (সর্বনিম্ন ৳১)'
                        : 'Select Amount (Min BDT 1)'}
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {language === 'bn'
                        ? 'যে কেউ ৳১ থেকে শুরু করতে পারবেন'
                        : 'Anyone can donate from ৳1'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer tabular-nums ${
                          amount === preset && !customAmount
                            ? 'bg-[#167D78] text-white border-[#167D78] shadow-sm'
                            : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-[#167D78]'
                        }`}
                      >
                        ৳{preset.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-500">
                      ৳
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={
                        language === 'bn'
                          ? 'নিজের পছন্দমতো পরিমাণ লিখুন (সর্বনিম্ন ১ টাকা, যেমন: ১, ১০, ৫০০)'
                          : 'Enter custom amount (minimum 1 BDT, e.g. 1, 10, 500)'
                      }
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full pl-8 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <MagneticButton
                    type="button"
                    onClick={handleStep1Next}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-xl shadow-md btn-primary-interaction group"
                  >
                    <span>
                      {language === 'bn'
                        ? 'পেমেন্ট মাধ্যমে যান (৳' + (amount || 0).toLocaleString() + ')'
                        : 'Proceed to Payment'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </MagneticButton>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-3">
                    {language === 'bn'
                      ? 'মোবাইল ব্যাংকিং মাধ্যম নির্বাচন করুন (বিকাশ / নগদ)'
                      : 'Select Mobile Banking (bKash / Nagad)'}
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('bkash');
                        setValidationError(null);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === 'bkash'
                          ? 'border-[#E2136E] bg-[#E2136E]/10 text-[#E2136E] font-bold shadow-sm ring-1 ring-[#E2136E]'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-[#E2136E]" />
                      <span className="text-sm font-bold">bKash (বিকাশ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('nagad');
                        setValidationError(null);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === 'nagad'
                          ? 'border-[#F7941D] bg-[#F7941D]/10 text-[#F7941D] font-bold shadow-sm ring-1 ring-[#F7941D]'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-[#F7941D]" />
                      <span className="text-sm font-bold">Nagad (নগদ)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700 dark:text-stone-300">
                      {language === 'bn'
                        ? `অনুমোদিত ${paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} একাউন্টসমূহ:`
                        : `Authorized ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Channels:`}
                    </span>
                    <span className="text-[11px] text-stone-500 tabular-nums">
                      {language === 'bn' ? 'পরিমাণ:' : 'Amount:'}{' '}
                      <strong className="text-[#167D78] dark:text-[#D6F36A]">৳{amount}</strong>
                    </span>
                  </div>

                  {activeChannels.map((channel) => {
                    const isCopied = copiedChannelId === channel.id;
                    const isSelected = selectedChannelId === channel.id;
                    return (
                      <div
                        key={channel.id}
                        onClick={() => setSelectedChannelId(channel.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? paymentMethod === 'bkash'
                              ? 'border-[#E2136E] bg-[#E2136E]/5 dark:bg-[#E2136E]/10'
                              : 'border-[#F7941D] bg-[#F7941D]/5 dark:bg-[#F7941D]/10'
                            : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                              {channel.accountType}
                            </span>
                            <span className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                              {channel.accountHolderName}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(channel.number.replace(/[^0-9]/g, ''), channel.id);
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-600'
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
                          </button>
                        </div>
                        <div className="font-mono text-base font-bold text-stone-900 dark:text-white tracking-wider">
                          {channel.number}
                        </div>
                        <p className="mt-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                          {language === 'bn' ? channel.instructionBn : channel.instructionEn || channel.instructionBn}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      {language === 'bn'
                        ? 'যে নম্বর থেকে পাঠিয়েছেন (১১ ডিজিট) *'
                        : 'Sender Mobile Number *'}
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => {
                        setSenderPhone(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      {language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) *' : 'Transaction ID (TrxID) *'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'bn' ? 'যেমন: BDF8932K1L' : 'e.g. BDF8932K1L'}
                      value={transactionId}
                      onChange={(e) => {
                        setTransactionId(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-white cursor-pointer"
                  >
                    ← {language === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Back'}
                  </button>
                  <MagneticButton
                    type="button"
                    onClick={handleStep2Next}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-xl shadow-md btn-primary-interaction group"
                  >
                    <span>{language === 'bn' ? 'দাতার তথ্যে যান' : 'Continue to Donor Info'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </MagneticButton>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                      {language === 'bn' ? 'পরিচয় গোপন রাখতে চান? (Anonymous)' : 'Donate anonymously?'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {language === 'bn'
                        ? 'পাবলিক অডিট লেজারে আপনার নাম প্রকাশ করা হবে না'
                        : 'Your name will remain private on public boards'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-[#167D78] cursor-pointer"
                  />
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      {language === 'bn' ? 'আপনার নাম / প্রতিষ্ঠানের নাম *' : 'Full Name / Organization *'}
                    </label>
                    <input
                      type="text"
                      required={!isAnonymous}
                      placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Your full name'}
                      value={donorName}
                      onChange={(e) => {
                        setDonorName(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      {language === 'bn' ? 'ইমেইল (রসিদ পাঠানোর জন্য)' : 'Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    {language === 'bn' ? 'দোয়া, শুভকামনা বা বার্তা (ঐচ্ছিক)' : 'Prayer or Goodwill Note (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={
                      language === 'bn'
                        ? 'মানুষের কল্যাণে আপনার অনুভূতি বা প্রার্থনা লিখতে পারেন...'
                        : 'Optional goodwill note...'
                    }
                    value={donorNotes}
                    onChange={(e) => setDonorNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                  />
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'bn' ? 'খাত:' : 'Cause:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-white truncate max-w-[260px]">
                      {getSelectedProjectTitle()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'bn' ? 'পরিমাণ:' : 'Amount:'}</span>
                    <span className="font-bold text-[#167D78] dark:text-[#D6F36A] tabular-nums">
                      ৳{amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'bn' ? 'মাধ্যম:' : 'Method:'}</span>
                    <span className="uppercase font-semibold text-stone-700 dark:text-stone-300">
                      {paymentMethod} (TrxID: {transactionId})
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isProcessing}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-white cursor-pointer disabled:opacity-50"
                  >
                    ← {language === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Back'}
                  </button>
                  <MagneticButton
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-xl shadow-md btn-primary-interaction disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#D6F36A]" />
                        <span>{language === 'bn' ? 'যাচাই চলছে...' : 'Verifying...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#D6F36A]" />
                        <span>
                          {language === 'bn'
                            ? 'অনুদান নিশ্চিত করুন ও রসিদ নিন'
                            : 'Confirm & Get Official Receipt'}
                        </span>
                      </>
                    )}
                  </MagneticButton>
                </div>
              </form>
            )}

            {/* STEP 4: RECEIPT */}
            {step === 4 && createdReceipt && (
              <div className="p-6 space-y-5">
                <div className="no-print text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#102B3F] dark:text-white">
                    {language === 'bn'
                      ? 'অশেষ ধন্যবাদ! আপনার অনুদান গৃহীত হয়েছে'
                      : 'Thank You! Donation Received'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'bn'
                      ? 'সৃষ্টিকর্তা আপনার এই দান কবুল করুন। নিচে অফিসিয়াল ডিজিটাল রসিদ দেওয়া হলো।'
                      : 'Your official verified donation receipt is ready below.'}
                  </p>
                </div>

                <div
                  id="official-receipt-print"
                  className="print-donation-receipt p-5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-4"
                >
                  <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#102B3F] dark:text-white">
                        {language === 'bn' ? 'কোলাশ ফাউন্ডেশন' : 'CoLASH Foundation'}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {language === 'bn' ? 'মানবতার জন্য আলো এবং সেবার বলয়' : 'Circle of Light and Service for Humanity'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] font-bold text-[#167D78] dark:text-[#D6F36A] block">
                        {createdReceipt.receiptNumber}
                      </span>
                      <span className="text-[10px] text-stone-400">{createdReceipt.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        {language === 'bn' ? 'দাতার নাম' : 'Donor Name'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white">
                        {createdReceipt.donorName}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        {language === 'bn' ? 'অনুদানের খাত' : 'Cause'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white block">
                        {createdReceipt.purposeNameBn}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        {language === 'bn' ? 'পেমেন্ট ও TrxID' : 'Method & TrxID'}
                      </span>
                      <span className="font-mono text-stone-800 dark:text-stone-200 uppercase">
                        {createdReceipt.paymentMethod} · {createdReceipt.transactionId}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        {language === 'bn' ? 'মোট অনুদান' : 'Total Amount'}
                      </span>
                      <span className="text-base font-extrabold text-[#167D78] dark:text-[#D6F36A] tabular-nums">
                        ৳{createdReceipt.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ডিজিটালভাবে সত্যায়িত' : 'Digitally Verified'}</span>
                    </span>
                    <span>{language === 'bn' ? 'অর্থ ও নিরীক্ষা বিভাগ' : 'Finance & Audit'}</span>
                  </div>
                </div>

                <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#167D78]" />
                    <span>{language === 'bn' ? 'রসিদ ডাউনলোড' : 'Download'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{language === 'bn' ? 'রসিদ প্রিন্ট' : 'Print'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForNewDonation}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'bn' ? 'আরও অনুদান দিন' : 'Donate Again'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Cols: Sacred Reminder & Why Even ৳1 Matters */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'bn' ? 'কেন মাত্র ১ টাকাও গুরুত্বপূর্ণ?' : 'Why Even BDT 1 Matters'}</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#102B3F] dark:text-white leading-snug">
                {language === 'bn'
                  ? 'বিন্দু বিন্দু জলকণা থেকেই গড়ে ওঠে বিশাল সমুদ্র'
                  : 'Small Drops of Mercy Build an Ocean of Relief'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {language === 'bn'
                  ? '১ লক্ষ মানুষ যদি দিনে মাত্র ৳১ টাকা করেও দান করেন, তবে ১টি গ্রাম্য স্কুল ও অসহায় মানুষের জীবন বদলে যায়। কোলাশ ফাউন্ডেশন প্রতিটি ধর্মের মানবিক শিক্ষাকে সম্মান জানিয়ে সর্বনিম্ন ১ টাকা থেকেই অনুদানের সুযোগ উন্মুক্ত রেখেছে।'
                  : 'When thousands share even BDT 1, communities recover from floods, students stay in school, and families receive life-saving care.'}
              </p>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-[#167D78] dark:text-[#D6F36A] shrink-0">01</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    <strong className="text-[#102B3F] dark:text-white">
                      {language === 'bn' ? 'ইসলাম ধর্ম:' : 'Islam:'}
                    </strong>{' '}
                    {language === 'bn'
                      ? 'আধখানা খেজুর দান করেও জাহান্নাম থেকে বাঁচো (সহীহ বুখারী ১৪১৭); সদকা সম্পদ কমায় না।'
                      : 'Protect yourself even with half a date given in charity (Bukhari 1417).'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0">02</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    <strong className="text-[#102B3F] dark:text-white">
                      {language === 'bn' ? 'হিন্দু ধর্ম:' : 'Hinduism:'}
                    </strong>{' '}
                    {language === 'bn'
                      ? 'নিঃস্বার্থ সাত্ত্বিক দান ও শ্রদ্ধাসহ জীবসেবাই শ্রেষ্ঠ ধর্ম (শ্রীমদ্ভগবদ্গীতা ১৭.২০)।'
                      : 'Selfless charity without expectation of return is pure Sattvic Dana (Gita 17.20).'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-sky-700 dark:text-sky-400 shrink-0">03</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    <strong className="text-[#102B3F] dark:text-white">
                      {language === 'bn' ? 'বৌদ্ধ ধর্ম:' : 'Buddhism:'}
                    </strong>{' '}
                    {language === 'bn'
                      ? 'উদার দান দিয়ে কৃপণতা জয় করো — সকল প্রাণের মঙ্গলে দান-পারমিতা (ধম্মপদ ২২৩)।'
                      : 'Conquer miserliness with generosity and loving-kindness (Dhammapada 223).'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-violet-700 dark:text-violet-400 shrink-0">04</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    <strong className="text-[#102B3F] dark:text-white">
                      {language === 'bn' ? 'খৃষ্টান ধর্ম:' : 'Christianity:'}
                    </strong>{' '}
                    {language === 'bn'
                      ? 'দরিদ্র বিধবার দুটি ক্ষুদ্র মুদ্রা — ভালোবাসাভরা ছোট দানই শ্রেষ্ঠ (মার্ক ১২:৪১–৪৪)।'
                      : 'The widow’s two small coins outweigh vast wealth given without love (Mark 12:41–44).'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#102B3F] text-white rounded-2xl p-6 space-y-3 border border-[#167D78]/40">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D6F36A]">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'bn' ? 'অসাম্প্রদায়িক ও অরাজনৈতিক অঙ্গীকার' : 'Non-Communal Commitment'}</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                {language === 'bn'
                  ? 'কোলাশ ফাউন্ডেশন জাতি, ধর্ম ও বর্ণ নির্বিশেষে সকল অসহায় মানুষের কল্যাণে কাজ করে। প্রতিটি অনুদান ডিজিটাল লেজার ও সিএ অডিটের মাধ্যমে শতভাগ স্বচ্ছতার সাথে সংরক্ষিত হয়।'
                  : 'CoLASH Foundation serves humanity regardless of race or religion, maintaining 100% transparent accounting and audited receipts.'}
              </p>
            </div>
          </aside>
        </div>

        {/* Full Interfaith Charity & Compassion Archive */}
        <section className="pt-8 border-t border-stone-200/80 dark:border-stone-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A]">
                {language === 'bn'
                  ? 'সর্বজনীন ধর্মীয় ও মানবিক শিক্ষা'
                  : 'Universal Interfaith Wisdom on Charity'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102B3F] dark:text-white tracking-tight">
                {language === 'bn'
                  ? 'সকল ধর্মের দৃষ্টিতে দান, সদকা ও মানবসেবা'
                  : 'Teachings on Charity Across Islam, Hinduism, Buddhism & Christianity'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
                {language === 'bn'
                  ? 'ইসলামের পবিত্র হাদীস ও কুরআন, হিন্দু ধর্মের গীতা ও উপনিষদ, বৌদ্ধ ধর্মের ধম্মপদ এবং খৃষ্টান ধর্মের পবিত্র বাইবেলে ক্ষুদ্র ও আন্তরিক দানকে সর্বোচ্চ মর্যাদা দেওয়া হয়েছে।'
                  : 'Scriptural verses from all four major faith traditions affirming that sincere generosity—even in the smallest amount—uplifts humanity.'}
              </p>
            </div>

            {/* Segmented Faith Filter */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/80 dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 rounded-xl">
              {faithTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFaith(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedFaith === tab.id
                      ? 'bg-[#102B3F] text-[#D6F36A] shadow-2xs'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {language === 'bn' ? tab.labelBn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleTeachings.map((item, idx) => (
              <article
                key={item.id}
                className="bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between gap-4 hover:border-[#167D78]/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div>
                      <span
                        className="text-xs font-extrabold uppercase tracking-wider block"
                        style={{ color: item.accentHex }}
                      >
                        {language === 'bn' ? item.faithNameBn : item.faithNameEn}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        {language === 'bn' ? item.traditionSubtitleBn : item.traditionSubtitleEn}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-400 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {item.originalLine && (
                    <p
                      className="text-sm font-semibold text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/60 px-3.5 py-2.5 rounded-xl border border-stone-200/70 dark:border-stone-800"
                      dir="auto"
                    >
                      {item.originalLine}
                    </p>
                  )}

                  <blockquote className="text-sm sm:text-base font-bold text-[#102B3F] dark:text-white leading-relaxed">
                    {language === 'bn' ? item.quoteBn : item.quoteEn}
                  </blockquote>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {language === 'bn' ? item.reflectionBn : item.reflectionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'তথ্যসূত্র:' : 'Reference:'}{' '}
                    {language === 'bn' ? item.sourceRefBn : item.sourceRefEn}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </section>
  );
};
