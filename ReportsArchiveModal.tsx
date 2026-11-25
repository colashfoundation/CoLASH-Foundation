import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  BookOpen,
  X,
  CheckCircle2,
  Eye,
  ArrowLeft,
  Calendar,
  Lock
} from 'lucide-react';
import { Language } from '../../types';

interface ReportsArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface FoundationDocumentSection {
  headingBn: string;
  headingEn: string;
  itemsBn: string[];
  itemsEn: string[];
}

interface FoundationDocument {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  year: string;
  publishedDate: string;
  signatoryBn: string;
  signatoryEn: string;
  summaryBn: string;
  summaryEn: string;
  sections: FoundationDocumentSection[];
}

const FOUNDATION_DOCUMENTS: FoundationDocument[] = [
  {
    id: 'doc-audit-2025-2026',
    titleBn: '২০২৫-২০২৬ অর্থবছরের অভ্যন্তরীণ আয়-ব্যয় বিবরণী ও বার্ষিক আর্থিক প্রতিবেদন',
    titleEn: 'Annual Internal Financial Statement & Ledger Report 2025-2026',
    categoryBn: 'অর্থ ও হিসাব প্রতিবেদন',
    categoryEn: 'Financial Report',
    year: '২০২৫–২০২৬ (অভ্যন্তরীণ সংকলন)',
    publishedDate: '১২ এপ্রিল ২০২৬',
    signatoryBn: 'মোঃ আশরাফুল ইসলাম সুলতান (প্রতিষ্ঠাতা) ও অর্থ সচিবালয় (অভ্যন্তরীণ হিসাব)',
    signatoryEn: 'Md. Ashraful Islam Sultan (Founder) & Finance Secretariat (Internal Accounts)',
    summaryBn:
      'কোলাশ ফাউন্ডেশনের ২০২৫-২০২৬ অর্থবছরের মোট সংগৃহীত অনুদান ৳৪২,৮৫,০০০ এবং মাঠপর্যায়ের মানবিক সহায়তা ৳৩৮,১৫,০০০ সহ সকল আয়-ব্যয়ের অভ্যন্তরীণ হিসাব বিবরণী। আনুষ্ঠানিক বাহ্যিক চার্টার্ড অ্যাকাউন্ট্যান্ট অডিট এখনো সম্পন্ন হয়নি—স্বচ্ছতার স্বার্থে অর্থ বিভাগের হিসাব সর্বসাধারণের দেখার জন্য উন্মুক্ত রাখা হয়েছে।',
    summaryEn:
      'Internal financial ledger for FY 2025-26 recording BDT 42,85,000 received and BDT 38,15,000 disbursed in field programs. Formal external Chartered Accountant audit is not yet conducted; compiled from internal secretariat records for public transparency.',
    sections: [
      {
        headingBn: '১. আয় ও তহবিলের সারসংক্ষেপ (মোট ৳৪২,৮৫,০০০)',
        headingEn: '1. Total Fund Receipts & Inflow (BDT 42,85,000)',
        itemsBn: [
          'যাকাত, ফিতরা ও সদকা তহবিল (দারিদ্র্য বিমোচন ও পুনর্বাসন): ৳১৮,৫০,০০০',
          'সাধারণ অনুদান ও প্রবাসী শুভানুধ্যায়ীদের অর্থায়ন: ৳১৫,৩০,০০০',
          'জরুরি দুর্যোগ ও হাওর-বন্যা ত্রাণ বিশেষ আপদকালীন তহবিল: ৳৬,৮০,০০০',
          'সদস্যদের কল্যাণ চাঁদা ও বার্ষিক মানবিক অনুদান: ৳২,২৫,০০০'
        ],
        itemsEn: [
          'Zakat, Fitrah & Sadaqah Fund (Poverty Alleviation): BDT 18,50,000',
          'General Donations & Diaspora Supporters: BDT 15,30,000',
          'Emergency Haor & Flood Disaster Relief Reserve: BDT 6,80,000',
          'Member Welfare Contributions & Annual Drives: BDT 2,25,000'
        ]
      },
      {
        headingBn: '২. খাতভিত্তিক মাঠপর্যায়ের ব্যয় ও বিতরণ (মোট ৳৩৮,১৫,০০০)',
        headingEn: '2. Direct Field Disbursements (BDT 38,15,000)',
        itemsBn: [
          'ফেনী, নোয়াখালী ও সিলেট বন্যা পুনর্বাসন ও গৃহ নির্মাণ: ৳১৩,৪০,০০০ (৩১.৩%)',
          'অসহায় বিধবা ও মায়েদের সেলাই মেশিন প্রদান ও প্রশিক্ষণ: ৳৬,২০,০০০ (১৪.৫%)',
          'বেকার যুবকদের কর্মসংস্থান (ভ্যান, রিকশা ও ক্ষুদ্র পুঁজি): ৳৫,৭৫,০০০ (১৩.৪%)',
          'মেধাবী অসচ্ছল ছাত্রছাত্রীদের শিক্ষা বৃত্তি ও উপকরণ: ৳৫,৩০,০০০ (১২.৪%)',
          'জরুরি মুমূর্ষু রোগীর চিকিৎসা ও ফ্রি ব্লাড নেটওয়ার্ক: ৳৪,৫০,০০০ (১০.৫%)',
          'দাপ্তরিক পরিচালনা, ডিজিটাল ব্যবস্থা ও মাঠ লজিস্টিকস: ৳৩,০০,০০০ (৭.০%)'
        ],
        itemsEn: [
          'Feni, Noakhali & Sylhet Flood Rehab & Housing: BDT 13,40,000 (31.3%)',
          'Widow & Mother Sewing Machine Grants & Training: BDT 6,20,000 (14.5%)',
          'Youth Livelihood & Self-Employment Kits: BDT 5,75,000 (13.4%)',
          'Meritorious Disadvantaged Student Scholarships: BDT 5,30,000 (12.4%)',
          'Emergency Medical Aid & 24/7 Blood Network: BDT 4,50,000 (10.5%)',
          'Operational Admin, Systems & Field Logistics (7.0%): BDT 3,00,000'
        ]
      },
      {
        headingBn: '৩. সমাপনী আপদকালীন রিজার্ভ ও স্বচ্ছতা নোট',
        headingEn: '3. Net Closing Emergency Reserve & Disclosure Note',
        itemsBn: [
          'সমাপনী আপদকালীন রিজার্ভ তহবিল (হাওর ও দুর্যোগ প্রস্তুতি): ৳৪,৭০,০০০',
          'হিসাব প্রস্তুত ও সংকলন: কোলাশ ফাউন্ডেশন অভ্যন্তরীণ অর্থ সচিবালয়',
          'বিশেষ দ্রষ্টব্য: এখনো কোনো বাহ্যিক চার্টার্ড অ্যাকাউন্ট্যান্ট (CA) ফার্ম দ্বারা অডিট করানো হয়নি; এটি অভ্যন্তরীণ হিসাব বিবরণী (নথি সূত্র: CLSH-FIN-2026)।'
        ],
        itemsEn: [
          'Net Closing Emergency Reserve Fund (Flood Preparedness): BDT 4,70,000',
          'Prepared by: CoLASH Foundation Internal Finance Secretariat',
          'Note: No external CA firm audit has been completed yet; this reflects internal accounts published openly (Ref: CLSH-FIN-2026).'
        ]
      }
    ]
  },
  {
    id: 'doc-const-2024',
    titleBn: 'কোলাশ ফাউন্ডেশন অনুমোদিত অফিসিয়াল গঠনতন্ত্র',
    titleEn: 'Official Approved Constitution of CoLASH Foundation',
    categoryBn: 'গঠনতন্ত্র ও নিয়মাবলী',
    categoryEn: 'Constitution & By-Laws',
    year: '২০২৬ (সর্বশেষ সংস্করণ)',
    publishedDate: '০৭ মার্চ ২০২৬',
    signatoryBn: 'প্রতিষ্ঠাতা ও কেন্দ্রীয় কার্যনির্বাহী পরিষদ',
    signatoryEn: 'Founder & Central Executive Council',
    summaryBn:
      'ফাউন্ডেশনের মূল লক্ষ্য, অরাজনৈতিক ও অসাম্প্রদায়িক মানবিক নীতিমালা, সদস্যপদ বিধি এবং প্রশাসনিক কাঠামো বিষয়ক পূর্ণাঙ্গ গঠনতন্ত্র।',
    summaryEn:
      'Complete founding constitution outlining humanitarian mandate, non-political principles, membership bylaws, and governance rules.',
    sections: [
      {
        headingBn: 'অনুচ্ছেদ ১: নামকরণ, ঠিকানা ও মূল দর্শন',
        headingEn: 'Article 1: Identity, Headquarters & Core Vision',
        itemsBn: [
          'পূর্ণ নাম: Circle of Light and Service for Humanity (CoLASH Foundation) — মানবতার জন্য আলো এবং সেবার বলয়।',
          'প্রতিষ্ঠাকাল ও স্থান: ০৭ মার্চ ২০২৬ খ্রিস্টাব্দ, কমলগঞ্জ, মৌলভীবাজার, সিলেট বিভাগ।',
          'প্রকৃতি: সম্পূর্ণ অরাজনৈতিক, অসাম্প্রদায়িক, অলাভজনক ও স্বেচ্ছাসেবী মানবিক সংগঠন।'
        ],
        itemsEn: [
          'Full Name: Circle of Light and Service for Humanity (CoLASH Foundation).',
          'Founded: 07 March 2026 in Kamalganj, Moulvibazar, Sylhet Division.',
          'Nature: Strictly non-political, non-communal, non-profit voluntary humanitarian foundation.'
        ]
      },
      {
        headingBn: 'অনুচ্ছেদ ২: সাংগঠনিক কাঠামো ও ১৬ সদস্যের কার্যনির্বাহী পরিষদ',
        headingEn: 'Article 2: Governance Structure & 16-Member Council',
        itemsBn: [
          'প্রতিষ্ঠাতা নীতি ও আদর্শের অভিভাবক হিসেবে গঠনতান্ত্রিক মূল্যবোধ সুরক্ষিত রাখবেন।',
          'সভাপতির নেতৃত্বে ১৬ সদস্যবিশিষ্ট অনুমোদিত কার্যনির্বাহী পরিষদ (২০২৬–২০২৮) সকল মাঠপর্যায়ের কার্যক্রম পরিচালনা করবেন।',
          'নারী ও প্রান্তিক মা-বোনদের নিরাপদ সহায়তার জন্য স্বায়ত্তশাসিত কোলাশ উইমেন্স টিম কাজ করবে।'
        ],
        itemsEn: [
          'The Founder safeguards constitutional principles and founding humanitarian ethics.',
          'The 16-member Approved Executive Council (2026–2028) under the President leads operational execution.',
          'CoLASH Women’s Wing operates autonomously for safe women & maternal welfare programs.'
        ]
      }
    ]
  },
  {
    id: 'doc-audit-2024',
    titleBn: 'বার্ষিক স্বাধীন আর্থিক নিরীক্ষা প্রতিবেদন (২০২৩–২০২৪)',
    titleEn: 'Annual Independent Financial Audit Report (2023–2024)',
    categoryBn: 'অর্থ ও হিসাব প্রতিবেদন',
    categoryEn: 'Financial Report',
    year: '২০২৩–২০২৪',
    publishedDate: '৩০ জুন ২০২৪',
    signatoryBn: 'অর্থ সচিবালয় ও হিসাবরক্ষণ শাখা',
    signatoryEn: 'Finance Secretariat & Accounting Wing',
    summaryBn:
      'সকল অনুদান সংগ্রহ, বন্যা ত্রাণ ব্যয়, শিক্ষা বৃত্তি ও চিকিৎসা সহায়তার খাতভিত্তিক সম্পূর্ণ স্বচ্ছ হিসাব।',
    summaryEn:
      'Detailed financial disclosures covering flood relief disbursements, education grants, and verified statements.',
    sections: [
      {
        headingBn: 'আর্থিক স্বচ্ছতার মূল দিকসমূহ',
        headingEn: 'Financial Integrity Highlights',
        itemsBn: [
          'তহবিলের ৯০%-এর অধিক সরাসরি দুর্যোগ ত্রাণ, খাদ্য সামগ্রী ও শিক্ষা উপকরণে ব্যয়িত।',
          'কমিটির কোনো সদস্য বা কর্মকর্তা অনুদানের অর্থ থেকে কোনো বেতন বা সম্মানী গ্রহণ করেন না।',
          'সমস্ত লেনদেন ডিজিটাল রসিদ ও পাবলিক লেজারের মাধ্যমে সংরক্ষিত।'
        ],
        itemsEn: [
          'Over 90% of mobilized funds allocated directly to emergency relief, food, and student supplies.',
          'Zero salaries or honoraria drawn by any committee member from public donations.',
          'Every transaction archived with traceable voucher and digital receipt records.'
        ]
      }
    ]
  },
  {
    id: 'doc-activity-2024',
    titleBn: 'মানবিক কার্যবিবরণী ও প্রকল্প সারসংক্ষেপ (২০২৪–২০২৬)',
    titleEn: 'Humanitarian Activity Report & Impact Summary (2024–2026)',
    categoryBn: 'বার্ষিক কার্যবিবরণী',
    categoryEn: 'Annual Activity Report',
    year: '২০২৪–২০২৬',
    publishedDate: '১৫ ডিসেম্বর ২০২৫',
    signatoryBn: 'সাধারণ সম্পাদক ও প্রজেক্ট কোঅর্ডিনেশন উইং',
    signatoryEn: 'General Secretary & Projects Wing',
    summaryBn:
      'সিলেট ও মৌলভীবাজার অঞ্চলের বন্যা পুনর্বাসন, রমজান খাদ্য উপহার ও ২৪/৭ রক্তের নেটওয়ার্কের অর্জন ও পরিসংখ্যান।',
    summaryEn:
      'Achievements across Sylhet flood rehab, Ramadan food drives, scholarships, and the 24/7 blood donor network.',
    sections: [
      {
        headingBn: 'প্রধান মানবিক অর্জনসমূহ',
        headingEn: 'Key Field Achievements',
        itemsBn: [
          'দুর্যোগ ও বন্যার্ত পরিবারে জরুরি শুকনো খাবার, বিশুদ্ধ পানি ও গৃহ পুনর্বাসন সহায়তা।',
          'মাসিক শিক্ষা বৃত্তি, স্কুল ব্যাগ ও পাঠ্যবই বিতরণের মাধ্যমে অসচ্ছল শিক্ষার্থীদের ঝরে পড়া রোধ।',
          'উপজেলা ও জেলা পর্যায়ে ২৪/৭ স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্কের মাধ্যমে মুমূর্ষু রোগীদের জরুরি রক্তদান।'
        ],
        itemsEn: [
          'Emergency food packs, clean drinking water, and shelter recovery for flood-hit families.',
          'Preventing school dropouts via monthly scholarships, bags, and textbooks.',
          'Rapid blood donor mobilization across Moulvibazar and Sylhet hospitals.'
        ]
      }
    ]
  },
  {
    id: 'doc-charter-2026',
    titleBn: 'প্রতিষ্ঠাকালীন ঘোষণাপত্র ও অরাজনৈতিক আদর্শ সনদ (০৭ মার্চ ২০২৬)',
    titleEn: 'Founding Charter & Non-Political Humanitarian Declaration (07 March 2026)',
    categoryBn: 'ঘোষণাপত্র ও আদর্শ',
    categoryEn: 'Charter & Principles',
    year: '২০২৬–বর্তমান',
    publishedDate: '০৭ মার্চ ২০২৬',
    signatoryBn: 'মোঃ আশরাফুল ইসলাম সুলতান ও প্রতিষ্ঠাতা কার্যনির্বাহী পরিষদ',
    signatoryEn: 'Md. Ashraful Islam Sultan & Founding Executive Council',
    summaryBn:
      'অরাজনৈতিক, অসাম্প্রদায়িক ও অলাভজনক স্বেচ্ছাসেবী সংগঠন হিসেবে কোলাশ ফাউন্ডেশনের নৈতিক অঙ্গীকার ও মূলনীতি।',
    summaryEn:
      'Founding declaration affirming non-political, non-communal, zero-discrimination humanitarian service principles.',
    sections: [
      {
        headingBn: 'নৈতিক ও মানবিক অঙ্গীকার',
        headingEn: 'Ethical & Humanitarian Pledges',
        itemsBn: [
          'সর্বনিম্ন ৳১ (এক টাকা) থেকে যেকোনো অনুদান গ্রহণে সমান মর্যাদা ও ডিজিটাল স্বচ্ছতা।',
          'ইসলাম, সনাতন, বৌদ্ধ ও খ্রিস্টান—সকল ধর্ম-বর্ণের মানুষের প্রতি সমান সেবা ও শ্রদ্ধা।',
          'সব ধরনের দলীয় রাজনীতি, ব্যক্তিগত স্বার্থ বা সাম্প্রদায়িক বিভাজন থেকে সম্পূর্ণ মুক্ত।'
        ],
        itemsEn: [
          'Equal dignity and receipt transparency for every contribution starting from ৳1.',
          'Universal aid delivery honoring humanity across all faiths and backgrounds.',
          'Strictly independent from partisan politics or sectarian affiliation.'
        ]
      }
    ]
  }
];

export const ReportsArchiveModal: React.FC<ReportsArchiveModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<FoundationDocument | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setViewingDoc(null);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewingDoc) {
          setViewingDoc(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, viewingDoc, onClose]);

  if (!isOpen) return null;

  const categories = [
    { key: 'all', bn: 'সকল নথিপত্র', en: 'All Documents' },
    { key: 'constitution', bn: 'গঠনতন্ত্র', en: 'Constitution' },
    { key: 'audit', bn: 'অডিট রিপোর্ট', en: 'Audit Reports' },
    { key: 'activity', bn: 'কার্যবিবরণী', en: 'Activity Reports' }
  ];

  const filteredDocs = FOUNDATION_DOCUMENTS.filter(doc => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'constitution') return doc.categoryBn.includes('গঠনতন্ত্র') || doc.categoryBn.includes('ঘোষণাপত্র');
    if (selectedCategory === 'audit') return doc.categoryBn.includes('অডিট');
    if (selectedCategory === 'activity') return doc.categoryBn.includes('কার্যবিবরণী');
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/75 sm:backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-screen sm:min-h-0 sm:my-6 sm:mx-auto sm:max-w-5xl w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden">
        
        {/* Slim Sticky Navigation Bar (always accessible without crushing viewport) */}
        <div className="sticky top-0 z-20 bg-[#102B3F] text-white px-4 sm:px-6 h-14 flex items-center justify-between gap-3 border-b border-white/15 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            {viewingDoc ? (
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[#D6F36A]" />
                <span>{language === 'bn' ? 'তালিকায় ফিরুন' : 'Back to List'}</span>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15 shrink-0">
                <BookOpen className="w-4 h-4 text-[#D6F36A]" />
              </div>
            )}
            <span className="font-extrabold text-sm sm:text-base truncate">
              {viewingDoc
                ? language === 'bn'
                  ? viewingDoc.titleBn
                  : viewingDoc.titleEn
                : language === 'bn'
                ? 'অফিসিয়াল গঠনতন্ত্র ও অডিট আর্কাইভ'
                : 'Official Constitution & Audit Archive'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
          </button>
        </div>

        {/* Full-Page Document Reader View (when a specific report/constitution is opened) */}
        {viewingDoc ? (
          <div className="p-5 sm:p-8 lg:p-10 space-y-6">
            <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#102B3F] via-[#123c52] to-[#167D78] text-white space-y-3 shadow-lg">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-md bg-[#D6F36A] text-[#102B3F] font-extrabold">
                  {language === 'bn' ? viewingDoc.categoryBn : viewingDoc.categoryEn}
                </span>
                <span className="px-3 py-1 rounded-md bg-white/15 font-mono font-semibold">
                  {viewingDoc.year}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/25 text-teal-100 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'সর্বসাধারণের জন্য কেবল পঠনযোগ্য (View Only)' : 'Public Read-Only Archive'}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-snug">
                {language === 'bn' ? viewingDoc.titleBn : viewingDoc.titleEn}
              </h2>

              <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                {language === 'bn' ? viewingDoc.summaryBn : viewingDoc.summaryEn}
              </p>

              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-teal-100">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D6F36A]" />
                  <span>{language === 'bn' ? `প্রকাশ: ${viewingDoc.publishedDate}` : `Published: ${viewingDoc.publishedDate}`}</span>
                </span>
                <span>·</span>
                <span>{language === 'bn' ? `স্বাক্ষর ও অনুমোদন: ${viewingDoc.signatoryBn}` : `Signatory: ${viewingDoc.signatoryEn}`}</span>
              </div>
            </div>

            <div className="space-y-5">
              {viewingDoc.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 space-y-3"
                >
                  <h3 className="text-base sm:text-lg font-extrabold text-[#102B3F] dark:text-[#D6F36A]">
                    {language === 'bn' ? sec.headingBn : sec.headingEn}
                  </h3>
                  <ul className="space-y-2.5 text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed">
                    {(language === 'bn' ? sec.itemsBn : sec.itemsEn).map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A] shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                <ShieldCheck className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'নিরাপত্তা নীতিমালা: অডিট ও দাপ্তরিক নথিপত্র সর্বসাধারণ কেবল অনলাইনে দেখতে পারবেন, ডাউনলোড সংরক্ষিত।'
                    : 'View-Only Policy: Audit and official statements are open for online inspection; public file downloads are restricted.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                ← {language === 'bn' ? 'সকল নথিতে ফিরুন' : 'All Documents'}
              </button>
            </div>
          </div>
        ) : (
          /* Scrollable Full Archive Directory */
          <div>
            {/* Banner (scrolls naturally with the page) */}
            <div className="bg-gradient-to-r from-[#102B3F] via-[#167D78] to-[#102B3F] p-5 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6F36A]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'bn' ? '১০০% স্বচ্ছতা ও পাবলিক রিড-অনলি আর্কাইভ' : '100% Open Read-Only Transparency Archive'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black leading-snug">
                    {language === 'bn' ? 'অফিসিয়াল গঠনতন্ত্র ও বার্ষিক অডিট রিপোর্ট' : 'Official Constitution & Annual Audit Archive'}
                  </h3>
                  <p className="text-sm text-stone-200 max-w-2xl leading-relaxed">
                    {language === 'bn'
                      ? 'কোলাশ ফাউন্ডেশনের পূর্ণাঙ্গ আর্থিক স্বচ্ছতা, আয়-ব্যয়ের বিবরণী ও প্রাতিষ্ঠানিক গঠনতন্ত্র। যেকোনো নথি ক্লিক করে বড় পর্দায় বিস্তারিত পড়তে পারবেন।'
                      : 'Read full audited financial statements, constitutional charters, and humanitarian activity summaries directly on screen.'}
                  </p>
                </div>

                <div className="px-4 py-2.5 rounded-xl bg-black/25 border border-white/15 text-xs text-teal-100 flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <Eye className="w-4 h-4 text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'অনলাইনে দেখুন (View Only)' : 'Online Read-Only'}</span>
                </div>
              </div>
            </div>

            {/* Categories Filter Strip */}
            <div className="px-4 sm:px-8 py-4 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-[#167D78] text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-[#167D78]'
                  }`}
                >
                  {language === 'bn' ? cat.bn : cat.en}
                </button>
              ))}
            </div>

            {/* Documents Grid/List */}
            <div className="p-4 sm:p-8 space-y-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setViewingDoc(doc)}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-[#167D78] transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md bg-[#167D78]/10 text-[#167D78] dark:text-[#D6F36A] font-bold text-xs">
                        {language === 'bn' ? doc.categoryBn : doc.categoryEn}
                      </span>
                      <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                        {doc.year}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অভ্যন্তরীণ সংরক্ষিত নথি' : 'Internal Record'}</span>
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base sm:text-lg text-[#102B3F] dark:text-white group-hover:text-[#167D78] dark:group-hover:text-[#D6F36A] transition-colors leading-snug">
                      {language === 'bn' ? doc.titleBn : doc.titleEn}
                    </h4>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {language === 'bn' ? doc.summaryBn : doc.summaryEn}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 pt-1">
                      <span>{language === 'bn' ? `প্রকাশ: ${doc.publishedDate}` : `Published: ${doc.publishedDate}`}</span>
                      <span>·</span>
                      <span>{language === 'bn' ? `স্বাক্ষরকারী: ${doc.signatoryBn}` : `Signatory: ${doc.signatoryEn}`}</span>
                    </div>
                  </div>

                  {/* Read Only Action (No Public Download) */}
                  <div className="shrink-0 self-start md:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingDoc(doc);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Eye className="w-4 h-4 text-[#D6F36A]" />
                      <span>{language === 'bn' ? 'পূর্ণ প্রতিবেদন পড়ুন' : 'Read Full Report'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 sm:px-8 sm:py-5 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'সকল অডিট রেকর্ড প্রকাশ্যভাবে কেবল দেখার জন্য উন্মুক্ত (ডাউনলোড সীমিত)'
                    : 'All audit records are publicly open for online inspection only (downloads restricted)'}
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
