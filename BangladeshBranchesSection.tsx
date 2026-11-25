import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Search,
  Building2,
  Users,
  Phone,
  Send,
  CheckCircle2,
  Compass,
  Navigation,
  PlusCircle,
  X,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { BangladeshBranch, Language, PublicApplication } from '../types';
import {
  BANGLADESH_DIVISIONS_DISTRICTS,
  INITIAL_BANGLADESH_BRANCHES,
} from '../data/bangladeshBranches';

interface BangladeshBranchesSectionProps {
  language: Language;
  branches?: BangladeshBranch[];
  onSubmitBranchProposal?: (app: PublicApplication) => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const BangladeshBranchesSection: React.FC<BangladeshBranchesSectionProps> = ({
  language,
  branches,
  onSubmitBranchProposal,
  onToast,
}) => {
  const effectiveBranches =
    branches && branches.length > 0 ? branches : INITIAL_BANGLADESH_BRANCHES;

  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // Proposal Form State (All 8 Divisions -> 64 Districts)
  const [formDivisionId, setFormDivisionId] = useState<string>(BANGLADESH_DIVISIONS_DISTRICTS[0].id);
  const selectedDivObj =
    BANGLADESH_DIVISIONS_DISTRICTS.find((d) => d.id === formDivisionId) ||
    BANGLADESH_DIVISIONS_DISTRICTS[0];
  const [formDistrict, setFormDistrict] = useState<string>(selectedDivObj.districts[0].bn);
  const [formUpazila, setFormUpazila] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPlan, setFormPlan] = useState('');
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);

  const handleDivisionFormChange = (divId: string) => {
    setFormDivisionId(divId);
    const found = BANGLADESH_DIVISIONS_DISTRICTS.find((d) => d.id === divId);
    if (found && found.districts.length > 0) {
      setFormDistrict(found.districts[0].bn);
    }
  };

  // Coverage Stats across 8 Divisions & 64 Districts
  const coverageStats = useMemo(() => {
    const activeCount = effectiveBranches.filter(
      (b) => b.status === 'active_hq' || b.status === 'active_branch'
    ).length;
    const establishingCount = effectiveBranches.filter(
      (b) => b.status === 'establishing' || b.status === 'upcoming'
    ).length;
    const coveredDivisions = new Set(effectiveBranches.map((b) => b.divisionBn)).size;
    return {
      totalListed: effectiveBranches.length,
      activeCount,
      establishingCount,
      coveredDivisions,
    };
  }, [effectiveBranches]);

  const filteredBranches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return effectiveBranches.filter((b) => {
      const divMatch =
        selectedDivision === 'all' ||
        b.divisionBn === selectedDivision ||
        b.divisionEn === selectedDivision;
      if (!divMatch) return false;
      if (!q) return true;
      return (
        b.districtBn.toLowerCase().includes(q) ||
        b.districtEn.toLowerCase().includes(q) ||
        b.divisionBn.toLowerCase().includes(q) ||
        b.divisionEn.toLowerCase().includes(q) ||
        b.branchNameBn.toLowerCase().includes(q) ||
        b.branchNameEn.toLowerCase().includes(q) ||
        (b.upazilaOrAreaBn || '').toLowerCase().includes(q)
      );
    });
  }, [effectiveBranches, selectedDivision, searchQuery]);

  // All 64 districts status map for interactive visual matrix
  const branchDistrictMap = useMemo(() => {
    const map = new Map<string, BangladeshBranch>();
    effectiveBranches.forEach((b) => {
      map.set(b.districtBn, b);
    });
    return map;
  }, [effectiveBranches]);

  const getStatusMeta = (status: BangladeshBranch['status']) => {
    switch (status) {
      case 'active_hq':
        return {
          label: language === 'bn' ? 'কেন্দ্রীয় প্রধান কার্যালয়' : 'Central HQ',
          badgeClass:
            'bg-[#102B3F] text-[#D6F36A] border-[#102B3F] dark:bg-[#167D78] dark:text-white',
        };
      case 'active_branch':
        return {
          label: language === 'bn' ? 'সক্রিয় শাখা' : 'Active Branch',
          badgeClass:
            'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        };
      case 'establishing':
        return {
          label: language === 'bn' ? 'গঠন প্রক্রিয়াধীন' : 'Establishing',
          badgeClass:
            'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        };
      default:
        return {
          label: language === 'bn' ? 'আগামী শাখা · উন্মুক্ত' : 'Expansion Open',
          badgeClass:
            'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
        };
    }
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || formPhone.trim().length < 10) {
      onToast?.(
        'error',
        language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Details',
        language === 'bn'
          ? 'অনুগ্রহ করে সমন্বয়কের নাম এবং সঠিক মোবাইল নম্বর দিন।'
          : 'Please enter coordinator name and a valid 10+ digit phone number.'
      );
      return;
    }

    const trackingId = `COLASH-BR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const application: PublicApplication = {
      id: `branch-prop-${Date.now()}`,
      trackingId,
      category: 'application',
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || undefined,
      district: formDistrict,
      subject:
        language === 'bn'
          ? `নতুন জেলা/উপজেলা শাখা গঠনের আবেদন — ${formDistrict} (${selectedDivObj.nameBn})`
          : `New District/Upazila Branch Proposal — ${formDistrict}`,
      message: `বিভাগ: ${selectedDivObj.nameBn} (${selectedDivObj.nameEn}) | জেলা: ${formDistrict} | উপজেলা/এলাকা: ${formUpazila.trim() || 'উল্লেখ নেই'}\nপরিকল্পনা ও বিবরণ:\n${formPlan.trim() || 'এলাকায় কোলাশ ফাউন্ডেশনের মানবিক শাখা পরিচালনা ও স্বেচ্ছাসেবী দল গঠনে আগ্রহী।'}`,
      createdAt: nowStr,
      updatedAt: nowStr,
      status: 'pending',
    };

    onSubmitBranchProposal?.(application);
    setSubmittedTrackingId(trackingId);
    onToast?.(
      'success',
      language === 'bn' ? 'শাখা গঠনের আবেদন সফলভাবে জমা হয়েছে!' : 'Branch Proposal Submitted!',
      `${language === 'bn' ? 'ট্র্যাকিং আইডি:' : 'Tracking ID:'} ${trackingId}`
    );
  };

  return (
    <section id="branches" className="py-10 sm:py-14 bg-transparent transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Stylish Editorial Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A]">
              <Globe className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? '৮টি বিভাগ · ৬৪টি জেলা · দেশব্যাপী মানবিক নেটওয়ার্ক'
                  : '8 Divisions · 64 Districts · Nationwide Expansion'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl stylish-title text-balance">
              {language === 'bn'
                ? 'সারা বাংলাদেশে কোলাশ ফাউন্ডেশনের শাখা সমূহ'
                : 'CoLASH Foundation Branches Across Bangladesh'}
            </h2>
            <span className="stylish-title-rule" aria-hidden="true" />
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
              {language === 'bn'
                ? 'সিলেটের কমলগঞ্জ কেন্দ্রীয় কার্যালয় থেকে দেশের প্রতিটি বিভাগে ও জেলায় মানবিক সেবা পৌঁছে দেওয়ার লক্ষ্যে আঞ্চলিক ও জেলা শাখা সম্প্রসারণ কার্যক্রম চলমান রয়েছে। আপনার জেলা থেকেও শাখা সমন্বয়ক হিসেবে যুক্ত হতে পারেন।'
                : 'Expanding from our Kamalganj Central Headquarters to serve communities across every division and all 64 districts of Bangladesh.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSubmittedTrackingId(null);
                setIsProposalOpen((v) => !v);
              }}
              className="px-5 py-3 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#D6F36A]" />
              <span>
                {language === 'bn'
                  ? 'আপনার জেলায় শাখা খুলতে আবেদন করুন'
                  : 'Apply to Open a District Branch'}
              </span>
            </button>
          </div>
        </div>

        {/* Summary Metric Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div className="text-2xl font-black text-[#102B3F] dark:text-white tabular-nums">
              {language === 'bn' ? '৮ / ৮' : '8 / 8'}
            </div>
            <div className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] mt-0.5">
              {language === 'bn' ? 'বিভাগীয় কভারেজ' : 'Divisions Covered'}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'bn'
                ? `${coverageStats.coveredDivisions}টি বিভাগে শাখা তালিকাভুক্ত`
                : `${coverageStats.coveredDivisions} divisions active/listed`}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div className="text-2xl font-black text-[#167D78] dark:text-[#D6F36A] tabular-nums">
              {language === 'bn' ? '৬৪ জেলা' : '64 Districts'}
            </div>
            <div className="text-xs font-bold text-[#102B3F] dark:text-stone-200 mt-0.5">
              {language === 'bn' ? 'দেশব্যাপী শাখা পরিকল্পনা' : 'Nationwide Network'}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'bn' ? 'সকল জেলা ও উপজেলায় উন্মুক্ত' : 'Open across all districts'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
              {coverageStats.activeCount}
            </div>
            <div className="text-xs font-bold text-[#102B3F] dark:text-stone-200 mt-0.5">
              {language === 'bn' ? 'সক্রিয় কার্যালয় ও শাখা' : 'Active HQ & Branches'}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'bn' ? 'সরাসরি মাঠপর্যায়ে কার্যক্রম চলমান' : 'Operating direct relief & aid'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {coverageStats.establishingCount}
            </div>
            <div className="text-xs font-bold text-[#102B3F] dark:text-stone-200 mt-0.5">
              {language === 'bn' ? 'সম্প্রসারণ / প্রক্রিয়াধীন শাখা' : 'Expanding Hubs'}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'bn' ? 'স্বেচ্ছাসেবক সমন্বয় চলমান' : 'Coordinating local teams'}
            </div>
          </div>
        </div>

        {/* Inline Branch Proposal Form (Collapsible) */}
        {isProposalOpen && (
          <div className="rounded-3xl bg-white dark:bg-[#0c1a24] border-2 border-[#167D78]/40 shadow-xl p-6 sm:p-8 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#167D78] dark:text-[#D6F36A]">
                  {language === 'bn' ? 'সারা বাংলাদেশ সম্প্রসারণ উদ্যোগ' : 'Nationwide Branch Application'}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#102B3F] dark:text-white mt-0.5 font-display">
                  {language === 'bn'
                    ? 'আপনার জেলা বা উপজেলায় কোলাশ শাখা চালুর আবেদন'
                    : 'Apply to Coordinate a CoLASH Branch in Your District'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProposalOpen(false)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
                aria-label="Close proposal form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedTrackingId ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-extrabold text-[#102B3F] dark:text-white">
                  {language === 'bn'
                    ? 'শাখা গঠনের আবেদন সফলভাবে গৃহীত হয়েছে!'
                    : 'Branch Proposal Successfully Received!'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
                  {language === 'bn'
                    ? 'কেন্দ্রীয় কার্যনির্বাহী পরিষদ আপনার আবেদন পর্যালোচনা করে দ্রুত যোগাযোগ করবে। নাগরিক আবেদন পোর্টাল থেকে এই ট্র্যাকিং আইডি দিয়ে অবস্থা দেখতে পারবেন:'
                    : 'The Central Executive Council will review your proposal shortly. Track status anytime using your Tracking ID:'}
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-[#102B3F] text-[#D6F36A] font-mono font-bold text-sm">
                  {submittedTrackingId}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTrackingId(null);
                      setFormName('');
                      setFormPhone('');
                      setFormEmail('');
                      setFormUpazila('');
                      setFormPlan('');
                    }}
                    className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer mt-2"
                  >
                    {language === 'bn' ? 'আরেকটি আবেদন করুন' : 'Submit Another Proposal'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'বিভাগ নির্বাচন করুন *' : 'Division *'}
                  </label>
                  <select
                    value={formDivisionId}
                    onChange={(e) => handleDivisionFormChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  >
                    {BANGLADESH_DIVISIONS_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'bn' ? d.nameBn : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'জেলা নির্বাচন করুন (৬৪ জেলা) *' : 'District *'}
                  </label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  >
                    {selectedDivObj.districts.map((dist) => (
                      <option key={dist.en} value={dist.bn}>
                        {language === 'bn' ? `${dist.bn} (${dist.en})` : `${dist.en} (${dist.bn})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'উপজেলা / থানা / এলাকা' : 'Upazila / Area'}
                  </label>
                  <input
                    type="text"
                    value={formUpazila}
                    onChange={(e) => setFormUpazila(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: সদর উপজেলা / বিশ্ববিদ্যালয়' : 'e.g. Sadar Upazila / Campus'}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'আবেদনকারীর পূর্ণ নাম *' : 'Coordinator Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Full Name'}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="font-bold block mb-1.5 text-stone-700 dark:text-stone-300">
                    {language === 'bn'
                      ? 'এলাকায় শাখা পরিচালনা ও স্বেচ্ছাসেবী পরিকল্পনার সংক্ষিপ্ত বিবরণ'
                      : 'Brief Local Volunteer & Branch Plan'}
                  </label>
                  <textarea
                    rows={2}
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'আপনার জেলা/উপজেলায় কতজন স্বেচ্ছাসেবক যুক্ত আছেন এবং কীভাবে কার্যক্রম পরিচালনা করতে চান লিখুন...'
                        : 'Share your local team size and humanitarian initiatives planned...'
                    }
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#07131b] text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsProposalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white font-bold shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#D6F36A]" />
                    <span>{language === 'bn' ? 'শাখা আবেদন জমা দিন' : 'Submit Branch Proposal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Interactive Division Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedDivision('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedDivision === 'all'
                  ? 'bg-[#102B3F] text-[#D6F36A]'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {language === 'bn' ? 'সকল বিভাগ (৮টি)' : 'All 8 Divisions'}
            </button>
            {BANGLADESH_DIVISIONS_DISTRICTS.map((div) => {
              const active = selectedDivision === div.nameBn;
              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => setSelectedDivision(div.nameBn)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#167D78] text-white'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {language === 'bn' ? div.nameBn.replace(' বিভাগ', '') : div.nameEn.replace(' Division', '')}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'জেলা বা শাখার নাম লিখুন...' : 'Search district or branch...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
            />
          </div>
        </div>

        {/* Branch Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBranches.map((branch) => {
            const st = getStatusMeta(branch.status);
            const mapLink =
              branch.mapDirectionsUrl ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${branch.districtEn}, Bangladesh`
              )}`;
            return (
              <div
                key={branch.id}
                className="rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 p-5 shadow-2xs hover:border-[#167D78] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                      <span>
                        {language === 'bn'
                          ? `${branch.districtBn} · ${branch.divisionBn}`
                          : `${branch.districtEn} · ${branch.divisionEn}`}
                      </span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#102B3F] dark:text-white leading-snug">
                      {language === 'bn' ? branch.branchNameBn : branch.branchNameEn}
                    </h3>
                    {(branch.upazilaOrAreaBn || branch.upazilaOrAreaEn) && (
                      <div className="text-xs font-semibold text-[#167D78] dark:text-[#D6F36A] mt-0.5">
                        {language === 'bn' ? branch.upazilaOrAreaBn : branch.upazilaOrAreaEn}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5 pt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#E6A15B] shrink-0 mt-0.5" />
                      <span>{language === 'bn' ? branch.addressBn : branch.addressEn}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#167D78] shrink-0 mt-0.5" />
                      <span>
                        {language === 'bn'
                          ? branch.coordinatorNameBn
                          : branch.coordinatorNameEn}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${branch.coordinatorPhone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 font-mono font-bold text-[#102B3F] dark:text-white hover:text-[#167D78]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#167D78]" />
                      <span>{branch.coordinatorPhone}</span>
                    </a>
                    {typeof branch.volunteersCount === 'number' && branch.volunteersCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <Users className="w-3 h-3" />
                        <span>{branch.volunteersCount}+</span>
                      </span>
                    )}
                  </div>

                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#167D78] hover:text-white text-[#102B3F] dark:text-stone-200 font-bold text-[11px] transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{language === 'bn' ? 'ম্যাপ' : 'Map'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complete 64-District Interactive Network Directory */}
        <div className="rounded-3xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#102B3F] dark:text-white font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#167D78] dark:text-[#D6F36A]" />
                <span>
                  {language === 'bn'
                    ? 'দেশের ৬৪ জেলার শাখা সম্প্রসারণ তালিকা (যেকোনো জেলায় ক্লিক করে আবেদন করুন)'
                    : 'All 64 Districts Expansion Matrix (Click Any District to Apply)'}
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {language === 'bn'
                  ? 'সবুজ চিহ্নিত জেলায় শাখা সক্রিয়/প্রক্রিয়াধীন রয়েছে; অন্য যেকোনো জেলায় ক্লিক করলে সেই জেলার জন্য শাখা গঠনের ফর্ম চালু হবে।'
                  : 'Highlighted districts currently have HQ or expanding coordination hubs; click any district to initiate a local branch.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BANGLADESH_DIVISIONS_DISTRICTS.map((div) => (
              <div
                key={div.id}
                className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#07131b] border border-stone-200/80 dark:border-stone-800 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="text-xs font-black text-[#102B3F] dark:text-[#D6F36A]">
                    {language === 'bn' ? div.nameBn : div.nameEn}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">
                    {div.districts.length} {language === 'bn' ? 'জেলা' : 'Dist.'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {div.districts.map((dist) => {
                    const existing = branchDistrictMap.get(dist.bn);
                    const isActive =
                      existing?.status === 'active_hq' || existing?.status === 'active_branch';
                    const isEstablishing = existing?.status === 'establishing';
                    return (
                      <button
                        key={dist.en}
                        type="button"
                        onClick={() => {
                          setFormDivisionId(div.id);
                          setFormDistrict(dist.bn);
                          setSubmittedTrackingId(null);
                          setIsProposalOpen(true);
                        }}
                        title={
                          language === 'bn'
                            ? `${dist.bn} জেলায় শাখা আবেদন / তথ্য দেখুন`
                            : `Apply or view branch for ${dist.en}`
                        }
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border ${
                          isActive
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isEstablishing
                              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-white dark:bg-[#0c1a24] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#167D78] hover:text-[#167D78]'
                        }`}
                      >
                        {language === 'bn' ? dist.bn : dist.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
