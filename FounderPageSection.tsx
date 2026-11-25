import React, { useState } from 'react';
import {
  Crown,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Droplet,
  ShieldCheck,
  Compass,
  Scale,
  HeartHandshake,
  Users,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Language, PortalCategoryKey, TeamMember, WebsiteCustomConfig } from '../types';

interface FounderPageSectionProps {
  language: Language;
  founderMember?: TeamMember;
  websiteConfig?: WebsiteCustomConfig;
  onOpenFounderProfile: () => void;
  onSelectCategory: (cat: PortalCategoryKey) => void;
  onOpenDonate: () => void;
}

export const FounderPageSection: React.FC<FounderPageSectionProps> = ({
  language,
  founderMember,
  websiteConfig,
  onOpenFounderProfile,
  onSelectCategory,
  onOpenDonate,
}) => {
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(0);

  const founderName = language === 'bn'
    ? (founderMember?.nameBn || 'মোঃ আশরাফুল ইসলাম সুলতান')
    : (founderMember?.nameEn || 'Md. Ashraful Islam Sultan');

  const secondaryName = language === 'bn'
    ? (founderMember?.nameEn || 'Md. Ashraful Islam Sultan')
    : (founderMember?.nameBn || 'মোঃ আশরাফুল ইসলাম সুলতান');

  const portraitUrl =
    websiteConfig?.founderImageUrl ||
    founderMember?.image ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';

  const foundingDate = websiteConfig?.foundingDateBn || (language === 'bn' ? '০৭ মার্চ ২০২৬' : '07 March 2026');
  const foundingLocation = websiteConfig?.foundingLocationBn || (language === 'bn' ? 'কমলগঞ্জ, মৌলভীবাজার, সিলেট' : 'Kamalganj, Moulvibazar, Sylhet');
  const founderVision = language === 'bn'
    ? (websiteConfig?.founderVisionBn ||
      'মানবসেবা কোনো ক্ষণিকের প্রচারণা কিংবা বিশেষ ঋতুর উদ্যোগ নয়; এটি সমাজের সুবিধাবঞ্চিত প্রতিটি মানুষের মর্যাদা ও মৌলিক অধিকার রক্ষার একটি আজীবন পবিত্র অঙ্গীকার।')
    : (websiteConfig?.founderVisionEn ||
      'Humanitarian service is not an episodic campaign; it is a transparent, lifelong pledge to safeguard dignity and opportunity for every vulnerable neighbor.');

  const email = founderMember?.email || websiteConfig?.contactEmail || 'ashrafulis2007@gmail.com';
  const phone = founderMember?.phone || websiteConfig?.hotline || '01646-475348';
  const bloodGroup = founderMember?.bloodGroup || 'O+';

  const milestones = [
    {
      step: '01',
      periodBn: 'প্রাথমিক প্রেরণা ও ভাবনা',
      periodEn: 'Initial Spark & Vision',
      titleBn: 'মানবতার জন্য একটি স্বচ্ছ সেবার বলয় গড়ার স্বপ্ন',
      titleEn: 'Conceiving an Independent Circle of Light & Service',
      descBn:
        'দুর্যোগ, চিকিৎসা সংকট ও দারিদ্র্যের কারণে পিছিয়ে পড়া প্রান্তিক মানুষের পাশে স্বচ্ছ ও দলনিরপেক্ষভাবে দাঁড়ানোর তাগিদ থেকে কোলাশ ফাউন্ডেশন গঠনের প্রাথমিক রূপরেখা তৈরি করেন মোঃ আশরাফুল ইসলাম সুলতান।',
      descEn:
        'Driven by the urgency to stand beside flood-affected families, patients, and underprivileged students without political bias, Md. Ashraful Islam Sultan drafted the founding vision of CoLASH.',
    },
    {
      step: '02',
      periodBn: '০৭ মার্চ ২০২৬ · আনুষ্ঠানিক প্রতিষ্ঠা',
      periodEn: '07 March 2026 · Formal Establishment',
      titleBn: 'কমলগঞ্জে কোলাশ ফাউন্ডেশনের প্রাতিষ্ঠানিক সূচনা',
      titleEn: 'Official Founding in Kamalganj, Moulvibazar',
      descBn:
        'সিলেট বিভাগের মৌলভীবাজার জেলার কমলগঞ্জ উপজেলায় একদল নিবেদিত তরুণ ও শুভানুধ্যায়ীকে সাথে নিয়ে “Circle of Light and Service for Humanity (CoLASH Foundation)” আনুষ্ঠানিকভাবে আত্মপ্রকাশ করে।',
      descEn:
        'Alongside dedicated youths and community elders in Kamalganj, Moulvibazar, CoLASH Foundation officially launched as a non-communal, non-political humanitarian trust.',
    },
    {
      step: '03',
      periodBn: 'সাংবিধানিক নীতিমালা প্রণয়ন',
      periodEn: 'Constitutional Charter & Transparency',
      titleBn: 'শতভাগ অরাজনৈতিক শপথ ও উন্মুক্ত অডিট ব্যবস্থা',
      titleEn: 'Non-Political Charter & Public Ledger Mandate',
      descBn:
        'প্রতিষ্ঠালগ্নেই ফাউন্ডেশনের গঠনতন্ত্রে নিশ্চিত করা হয় যে—সংগঠনটি কখনোই কোনো রাজনৈতিক দল বা অঙ্গসংগঠনের অংশ হবে না এবং প্রতিটি ১ টাকার অনুদান ও ব্যয় উন্মুক্ত অডিট লেজারে প্রদর্শিত থাকবে।',
      descEn:
        'From day one, the Founder enshrined strict independence and 100% open voucher accountability in the organization charter—even micro-donations from ৳1 are tracked cleanly.',
    },
    {
      step: '04',
      periodBn: 'সমন্বিত মানবিক বিস্তার',
      periodEn: 'Unified Social Impact Wings',
      titleBn: 'যুব, রক্তদাতা নেটওয়ার্ক ও স্বায়ত্তশাসিত উইমেন্স টিম',
      titleEn: 'Blood Network, Youth Drives & Autonomous Women’s Wing',
      descBn:
        'জরুরি ২৪/৭ রক্তদান নেটওয়ার্ক, দুর্যোগ ত্রাণ, শিক্ষা বৃত্তি এবং নারীদের আত্মকর্মসংস্থান ও সুরক্ষায় স্বায়ত্তশাসিত উইমেন্স টিম গঠনের মাধ্যমে ফাউন্ডেশনের বহুমুখী সেবা কার্যক্রম প্রসারিত হয়।',
      descEn:
        'Expanded field capacity through 24/7 blood coordination, merit scholarships, emergency flood rescue, and an autonomous Women’s Wing empowering rural mothers and girls.',
    },
  ];

  const foundingPrinciples = [
    {
      num: '01',
      icon: Compass,
      titleBn: 'অসাম্প্রদায়িক মানবতা',
      titleEn: 'Non-Communal Humanity',
      descBn:
        'ধর্ম, বর্ণ, গোত্র ও শ্রেণি-বৈষম্যের ঊর্ধ্বে উঠে মানুষের বিপদে কেবল মানবিক পরিচয়ে পাশে দাঁড়ানো।',
      descEn:
        'Serving every human being with dignity regardless of religion, background, or social status.',
    },
    {
      num: '02',
      icon: ShieldCheck,
      titleBn: 'শতভাগ অরাজনৈতিক স্বাতন্ত্র্য',
      titleEn: 'Strict Non-Political Independence',
      descBn:
        'কোনো রাজনৈতিক দলের ছায়া বা অঙ্গসংগঠন ছাড়াই সম্পূর্ণ স্বাধীন ও জনকল্যাণমুখী সমাজসেবা নিশ্চিত করা।',
      descEn:
        'Operating as an autonomous non-profit entity free from partisan influence or external affiliations.',
    },
    {
      num: '03',
      icon: Scale,
      titleBn: 'স্বচ্ছ ও জবাবদিহিমূলক অডিট',
      titleEn: 'Transparent Financial Stewardship',
      descBn:
        '১ টাকা থেকে শুরু করে প্রতিটি অনুদানের রসিদ, প্রকল্প ব্যয় ও ভাউচার সর্বসাধারণের জন্য উন্মুক্ত রাখা।',
      descEn:
        'Ensuring every single Taka—starting from ৳1 contributions—is accounted for with open receipts.',
    },
    {
      num: '04',
      icon: HeartHandshake,
      titleBn: 'স্থায়ী আত্মনির্ভরশীলতা',
      titleEn: 'Sustainable Empowerment',
      descBn:
        'শুধু সাময়িক ত্রাণ নয়; শিক্ষা, দক্ষতা উন্নয়ন ও নারীর স্বাবলম্বনের মাধ্যমে পরিবারগুলোকে নিজের পায়ে দাঁড় করানো।',
      descEn:
        'Beyond immediate relief—investing in education, youth skills, and sustainable livelihoods.',
    },
  ];

  const currentMilestone = milestones[activeMilestoneIdx] || milestones[0];

  return (
    <section id="founder" className="py-10 sm:py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">

        {/* 1. Architectural Hero Profile of the Founder */}
        <div className="rounded-3xl bg-white/95 dark:bg-[#0c1a24]/95 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Portrait Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0F273A] via-[#102B3F] to-[#145855] text-white p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#D6F36A] font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    <span>{language === 'bn' ? 'প্রতিষ্ঠাতা · FOUNDER' : 'FOUNDER · CoLASH'}</span>
                  </span>
                  <span className="text-stone-300">EST. 07-03-2026</span>
                </div>

                {/* Clickable Portrait Frame */}
                <button
                  type="button"
                  onClick={onOpenFounderProfile}
                  className="group relative block w-full max-w-[300px] mx-auto lg:mx-0 aspect-[4/4.3] rounded-2xl overflow-hidden border-2 border-[#D6F36A]/75 shadow-2xl cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#D6F36A]"
                  title={language === 'bn' ? 'পূর্ণ পোর্ট্রেট প্রোফাইল দেখুন' : 'Open Full-Bleed Founder Profile'}
                >
                  <img
                    src={portraitUrl}
                    alt={founderName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06121B]/95 via-[#06121B]/50 to-transparent p-4 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#D6F36A] font-bold">
                        {language === 'bn' ? 'পূর্ণ ব্যাকগ্রাউন্ড প্রোফাইল' : 'Full Portrait View'}
                      </div>
                      <div className="text-xs text-stone-200 font-medium">
                        {language === 'bn' ? 'ক্লিক করে বড় পর্দায় দেখুন' : 'Click to open full screen'}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#D6F36A] shrink-0" />
                  </div>
                </button>
              </div>

              {/* Founding Origin Metadata */}
              <div className="mt-7 pt-6 border-t border-white/15 grid grid-cols-2 gap-4 text-xs relative z-10">
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase tracking-wider">
                    {language === 'bn' ? 'প্রতিষ্ঠাকাল' : 'Founded On'}
                  </span>
                  <span className="font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D6F36A]" />
                    <span>{foundingDate}</span>
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase tracking-wider">
                    {language === 'bn' ? 'জন্ম ও সূচনাস্থান' : 'Origin Location'}
                  </span>
                  <span className="font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D6F36A] shrink-0" />
                    <span className="truncate">{foundingLocation}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Biography & Philosophy Column */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'কোলাশ ফাউন্ডেশনের প্রতিষ্ঠাতা ও মূল স্বপ্নদ্রষ্টা'
                      : 'Founder & Visionary Architect of CoLASH Foundation'}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] stylish-title leading-tight">
                    {founderName}
                  </h1>
                  <span className="stylish-title-rule" aria-hidden="true" />
                  {secondaryName !== founderName && (
                    <p className="text-sm sm:text-base font-semibold text-stone-500 dark:text-stone-400 mt-1">
                      {secondaryName}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm font-bold text-[#167D78] dark:text-[#D6F36A] mt-2">
                    {language === 'bn'
                      ? 'প্রতিষ্ঠাতা · কোলাশ ফাউন্ডেশন (মানবতার জন্য আলো এবং সেবার বলয়)'
                      : 'Founder · CoLASH Foundation (Circle of Light and Service for Humanity)'}
                  </p>
                </div>

                {/* Founder's Core Philosophy Quote */}
                <blockquote className="p-5 rounded-2xl bg-[#F7F5F0] dark:bg-[#081521] border border-stone-200 dark:border-stone-800 font-serif italic text-base sm:text-lg text-[#102B3F] dark:text-stone-100 leading-relaxed">
                  “{founderVision}”
                </blockquote>

                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {language === 'bn'
                    ? (founderMember?.bioBn ||
                      'মোঃ আশরাফুল ইসলাম সুলতান কমলগঞ্জ, মৌলভীবাজার থেকে মানবতার সেবায় তরুণ সমাজকে ঐক্যবদ্ধ করতে ০৭-০৩-২০২৬ খ্রিস্টাব্দে কোলাশ ফাউন্ডেশন প্রতিষ্ঠা করেন। অসাম্প্রদায়িক মূল্যবোধ, অরাজনৈতিক স্বাতন্ত্র্য এবং শতভাগ স্বচ্ছ আর্থিক হিসাব ব্যবস্থার মাধ্যমে প্রান্তিক মানুষের শিক্ষাবৃত্তি, জরুরি ত্রাণ ও স্বাস্থ্যসেবায় নেতৃত্ব দিয়ে যাচ্ছেন।')
                    : (founderMember?.bioEn ||
                      'Md. Ashraful Islam Sultan founded CoLASH Foundation on 07 March 2026 in Kamalganj, Moulvibazar to unite youth leadership around transparent, non-political humanitarian action—championed by open audit trails, scholarships, 24/7 blood coordination, and women’s empowerment.')}
                </p>

                {/* Founder Direct Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#08141e] border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-xs font-mono font-bold text-[#102B3F] dark:text-white hover:text-[#167D78] dark:hover:text-[#D6F36A] flex items-center gap-1.5 mt-0.5 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
                      <span className="truncate">{email}</span>
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#08141e] border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      {language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Contact'}
                    </span>
                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="text-xs font-mono font-bold text-[#102B3F] dark:text-white hover:text-[#167D78] dark:hover:text-[#D6F36A] flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
                      <span>{phone}</span>
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#08141e] border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                    </span>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-0.5">
                      <Droplet className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>{bloodGroup}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenFounderProfile}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#102B3F] hover:bg-[#167D78] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'পূর্ণ পোর্ট্রেট প্রোফাইল দেখুন' : 'Open Full-Screen Portrait Profile'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCategory('committee')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#167D78]/15 text-[#102B3F] dark:text-white border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'কার্যনির্বাহী কমিটি (২০২৬–২০২৮)' : 'Executive Committee (2026–2028)'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenDonate}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#167D78]/10 hover:bg-[#167D78] text-[#167D78] dark:text-[#D6F36A] hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  <span>{language === 'bn' ? 'অনুদান (৳১ থেকে)' : 'Donate (From ৳1)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Founding Journey & Genesis Timeline */}
        <div className="rounded-3xl bg-white/95 dark:bg-[#0c1a24]/95 border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A] flex items-center gap-1.5 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রতিষ্ঠার ইতিহাস ও পথচলা' : 'Founding Chronicle & Genesis'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl stylish-title">
                {language === 'bn'
                  ? 'যেভাবে কোলাশ ফাউন্ডেশনের জন্ম হলো'
                  : 'How CoLASH Foundation Came to Life'}
              </h2>
              <span className="stylish-title-rule" aria-hidden="true" />
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md">
              {language === 'bn'
                ? 'প্রতিটি ধাপে ক্লিক করে প্রতিষ্ঠাতার স্বপ্ন থেকে প্রাতিষ্ঠানিক রূপ লাভের বিস্তারিত জানুন।'
                : 'Select each milestone below to explore the founding journey.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Step Selector List */}
            <div className="lg:col-span-5 space-y-2.5">
              {milestones.map((m, idx) => {
                const isActive = activeMilestoneIdx === idx;
                return (
                  <button
                    key={m.step}
                    type="button"
                    onClick={() => setActiveMilestoneIdx(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isActive
                        ? 'bg-[#102B3F] text-white border-[#102B3F] shadow-md'
                        : 'bg-stone-50 dark:bg-[#08141e] border-stone-200 dark:border-stone-800 text-[#102B3F] dark:text-white hover:border-[#167D78]'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-[#D6F36A] text-[#102B3F]'
                          : 'bg-[#167D78]/10 text-[#167D78] dark:text-[#D6F36A]'
                      }`}
                    >
                      {m.step}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-[11px] font-mono ${isActive ? 'text-[#D6F36A]' : 'text-stone-500 dark:text-stone-400'}`}>
                        {language === 'bn' ? m.periodBn : m.periodEn}
                      </div>
                      <div className="text-sm font-bold leading-snug mt-0.5">
                        {language === 'bn' ? m.titleBn : m.titleEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Detail Panel */}
            <div className="lg:col-span-7 rounded-2xl bg-[#F7F5F0] dark:bg-[#081521] border border-stone-200 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A]">
                    {language === 'bn' ? `ধাপ ${currentMilestone.step} · ${currentMilestone.periodBn}` : `STEP ${currentMilestone.step} · ${currentMilestone.periodEn}`}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#102B3F] dark:text-white leading-snug">
                  {language === 'bn' ? currentMilestone.titleBn : currentMilestone.titleEn}
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                  {language === 'bn' ? currentMilestone.descBn : currentMilestone.descEn}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>
                  {language === 'bn' ? `স্থান: ${foundingLocation}` : `Location: ${foundingLocation}`}
                </span>
                <span className="font-mono font-bold text-[#167D78] dark:text-[#D6F36A]">
                  CoLASH · Est. 07-03-2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Founder's 4 Founding Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A] mb-1">
              {language === 'bn' ? 'সাংবিধানিক মূলনীতি' : 'Foundational Creed'}
            </div>
            <h2 className="text-2xl sm:text-3xl stylish-title">
              {language === 'bn' ? 'প্রতিষ্ঠাতার নির্ধারিত ৪টি মূল আদর্শ' : 'Four Core Principles Laid by the Founder'}
            </h2>
            <div className="flex justify-center">
              <span className="stylish-title-rule" aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {foundingPrinciples.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="p-6 rounded-2xl bg-white/95 dark:bg-[#0c1a24]/95 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between hover:border-[#167D78] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#102B3F] dark:bg-[#167D78]/20 text-[#D6F36A] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-400">
                        {p.num}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#102B3F] dark:text-white mb-2">
                      {language === 'bn' ? p.titleBn : p.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {language === 'bn' ? p.descBn : p.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Clear Institutional Distinction: Founder vs Executive Committee */}
        <div className="rounded-3xl bg-gradient-to-r from-[#102B3F] to-[#145855] text-white p-6 sm:p-8 border border-[#167D78]/40 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D6F36A] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'সাংগঠনিক কাঠামোর স্পষ্টতা' : 'Governance Structure Clarity'}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              {language === 'bn'
                ? 'প্রতিষ্ঠাতার স্থায়ী আদর্শ বনাম অনুমোদিত কার্যনির্বাহী পরিষদ (২০২৬–২০২৮)'
                : 'Founder’s Permanent Stewardship vs. Executive Council (2026–2028)'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {language === 'bn'
                ? 'প্রতিষ্ঠাতা (মোঃ আশরাফুল ইসলাম সুলতান) সংগঠনের স্থায়ী নৈতিক অভিভাবক ও মূল দর্শনের ধারক। আর ফাউন্ডেশনের দৈনন্দিন প্রশাসনিক কার্যক্রম, প্রকল্প অনুমোদন ও অর্থব্যয় তদারকি পরিচালিত হয় সভাপতি ও অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮ এর মাধ্যমে।'
                : 'The Founder safeguards the permanent charter and founding values of CoLASH Foundation, whereas operational administration, budgets, and term projects are governed under the President and the Approved Executive Council 2026–2028.'}
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onSelectCategory('committee')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D6F36A] hover:bg-white text-[#102B3F] font-black text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <span>{language === 'bn' ? 'সভাপতি ও কার্যনির্বাহী কমিটি দেখুন' : 'View President & Executive Committee'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
