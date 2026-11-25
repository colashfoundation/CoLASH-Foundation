import React, { useState, useMemo } from 'react';
import {
  Heart,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  HeartPulse,
  Flower2,
  Briefcase,
  ShieldCheck,
  Droplets,
  Camera,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  UserPlus,
  Building2,
} from 'lucide-react';
import {
  Language,
  Project,
  NoticeItem,
  WebsiteCustomConfig,
  WomensTeamConfig,
  GeneralMember,
  PublicBloodDonor,
} from '../types';
import { AnimatedProgressBar } from './common/AnimatedProgressBar';

interface HomeHighlightsSectionProps {
  language: Language;
  projects: Project[];
  notices: NoticeItem[];
  generalMembers?: GeneralMember[];
  publicBloodDonors?: PublicBloodDonor[];
  websiteConfig?: WebsiteCustomConfig;
  womensTeamConfig?: WomensTeamConfig;
  onNavigate: (sectionId: string) => void;
  onOpenDonate: (project?: Project | null) => void;
  onOpenSponsorship?: (project?: Project | null) => void;
  onOpenBloodDonorModal?: () => void;
  onOpenVolunteer: () => void;
  onOpenPortal: () => void;
}

export const HomeHighlightsSection: React.FC<HomeHighlightsSectionProps> = ({
  language,
  projects,
  generalMembers = [],
  publicBloodDonors = [],
  websiteConfig,
  womensTeamConfig,
  onNavigate,
  onOpenDonate,
  onOpenSponsorship,
  onOpenBloodDonorModal,
  onOpenVolunteer,
  onOpenPortal,
}) => {
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [activeWingTab, setActiveWingTab] = useState<'womens' | 'livelihood' | 'audit'>('womens');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('O+');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 5 Interactive Mission Pillars
  const pillars = [
    {
      index: '01',
      icon: BookOpen,
      titleBn: websiteConfig?.pillar1TitleBn || 'মানসম্মত শিক্ষা ও মেধা বৃত্তি',
      titleEn: 'Quality Education & Scholarships',
      descBn:
        websiteConfig?.pillar1DescBn ||
        'অসচ্ছল ও মেধাবী শিক্ষার্থীদের পাঠ্যবই, শিক্ষাসামগ্রী ও শিক্ষা সহায়তা প্রদান।',
      descEn:
        'Educational supplies, textbooks, and merit stipends for underprivileged rural students.',
      metricBn: 'শিক্ষা সহায়তা কর্মসূচি',
      metricEn: 'Education Program',
      highlightsBn: [
        'বিনামূল্যে পাঠ্যবই ও খাতা-কলম বিতরণ',
        'অসচ্ছল মেধাবীদের শিক্ষা বৃত্তি সহায়তা',
        'প্রান্তিক ও চা-বাগান অঞ্চলের শিক্ষার্থী সহায়তা',
      ],
      highlightsEn: [
        'Free textbooks & school supply kits',
        'Study stipends for meritorious youth',
        'Remote & tea-estate student outreach',
      ],
      image: '/assets/images/education_support_project_1792170806647.jpg',
      linkTarget: 'activities',
    },
    {
      index: '02',
      icon: ShieldAlert,
      titleBn: websiteConfig?.pillar2TitleBn || 'জরুরি বন্যা ও দুর্যোগ ত্রাণ',
      titleEn: 'Emergency Flood & Disaster Relief',
      descBn:
        websiteConfig?.pillar2DescBn ||
        'মৌলভীবাজার ও সিলেট বিভাগসহ সারাদেশের দুর্যোগে তাৎক্ষণিক খাদ্য ও ত্রাণ সহায়তা।',
      descEn:
        'Rapid food, medical kits, clean drinking water, and emergency support in disaster zones.',
      metricBn: 'দুর্যোগ ও ত্রাণ সাড়া',
      metricEn: 'Emergency Relief',
      highlightsBn: [
        'প্লাবিত হাওরে শুকনো খাবার ও বিশুদ্ধ পানি',
        'শিশুখাদ্য, ওরস্যালাইন ও জরুরি ওষুধ প্যাক',
        'দুর্যোগ পরবর্তী পুনর্বাসন ও গৃহ মেরামত সহায়তা',
      ],
      highlightsEn: [
        'Dry rations & clean water in flooded haors',
        'Infant nutrition & emergency medical packs',
        'Post-flood family rehabilitation support',
      ],
      image: '/assets/images/emergency_flood_relief_1792170807173.jpg',
      linkTarget: 'emergency-notice',
    },
    {
      index: '03',
      icon: HeartPulse,
      titleBn: websiteConfig?.pillar3TitleBn || 'বিনামূল্যে চিকিৎসাসেবা ও রক্তদান',
      titleEn: 'Free Healthcare & 24/7 Blood Bank',
      descBn:
        websiteConfig?.pillar3DescBn ||
        'স্বাস্থ্য সচেতনতা, প্রাথমিক চিকিৎসা সহায়তা, জরুরি ওষুধ ও ২৪/৭ রক্তদাতা সমন্বয়।',
      descEn:
        'Community health outreach, free medicine aid, and an instant 24/7 blood donor network.',
      metricBn: 'স্বাস্থ্য ও রক্তদান',
      metricEn: 'Health & Blood Bank',
      highlightsBn: [
        'মা ও শিশুর বিনামূল্যে স্বাস্থ্য পরীক্ষা ও ওষুধ',
        'সারাদেশে বিরল গ্রুপের রক্তদাতা সমন্বয়',
        'জরুরি চিকিৎসায় অসহায় রোগীদের পাশে দাঁড়ানো',
      ],
      highlightsEn: [
        'Free maternal & pediatric health checkups',
        'Nationwide blood donor matching network',
        'Critical medical treatment support',
      ],
      image: '/assets/images/healthcare_medical_camp_1792170806394.jpg',
      linkTarget: 'members',
    },
    {
      index: '04',
      icon: Briefcase,
      titleBn: 'যুব কর্মসংস্থান ও স্বাবলম্বন',
      titleEn: 'Youth Livelihood & Trade Skills',
      descBn:
        'কর্মহীন যুবকদের কারিগরি দক্ষতা উন্নয়ন, ক্ষুদ্র উদ্যোগে পুঁজি ও আত্মনির্ভর হওয়ার সহায়তা।',
      descEn:
        'Vocational guidance, trade toolkits, and micro-enterprise seed support for sustainable dignity.',
      metricBn: 'স্বাবলম্বন উদ্যোগ',
      metricEn: 'Self-Reliance Skills',
      highlightsBn: [
        'ক্ষুদ্র ব্যবসা ও কর্মসংস্থান উপকরণ সহায়তা',
        'ইলেকট্রিক্যাল ও কারিগরি দক্ষতা উন্নয়ন',
        'স্থায়ী আয়ের মাধ্যমে বেকারত্ব নিরসনের প্রচেষ্টা',
      ],
      highlightsEn: [
        'Micro-enterprise & livelihood toolkits',
        'Vocational electrical & trade training',
        'Sustainable dignity over temporary aid',
      ],
      image: '/assets/images/hero_humanitarian_care_1792170805861.jpg',
      linkTarget: 'activities',
    },
    {
      index: '05',
      icon: Flower2,
      titleBn: websiteConfig?.pillar4TitleBn || 'নারী স্বাবলম্বীকরণ ও কারিগরি উইং',
      titleEn: 'Women Empowerment & Vocational Wing',
      descBn:
        websiteConfig?.pillar4DescBn ||
        'উইমেন্স টিমের তত্ত্বাবধানে প্রান্তিক নারীদের সেলাই, কুটির শিল্প ও আত্মনির্ভরতা।',
      descEn:
        'Autonomous Women’s wing fostering female leadership, tailoring micro-enterprises & welfare.',
      metricBn: 'উইমেন্স টিম উইং',
      metricEn: 'Women’s Wing',
      highlightsBn: [
        'সেলাই মেশিন বিতরণ ও কুটির শিল্প প্রশিক্ষণ',
        'প্রান্তিক কিশোরী ও মায়েদের স্বাস্থ্য সচেতনতা',
        'নারী নেতৃত্বাধীন স্বতন্ত্র সামাজিক প্রকল্প',
      ],
      highlightsEn: [
        'Tailoring machines & craft training',
        'Adolescent & maternal wellness sessions',
        'Female-led community welfare initiatives',
      ],
      image: '/assets/images/hero_humanitarian_care_1792170805861.jpg',
      linkTarget: 'womens-team',
    },
  ];

  const activePillar = pillars[activePillarIndex];

  // Dynamic Project Filter Categories
  const projectCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ['all', ...uniqueCats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const list =
      selectedProjectFilter === 'all'
        ? projects
        : projects.filter((p) => p.category === selectedProjectFilter);
    return list.slice(0, 3);
  }, [projects, selectedProjectFilter]);

  // Verified Blood Donor Quick-Finder using real member state + non-member voluntary blood donors
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const matchingBloodDonors = useMemo(() => {
    const memberDonors = generalMembers
      .filter((m) => (m.bloodGroup || '').toUpperCase().trim() === selectedBloodGroup)
      .map((m) => ({
        id: m.id,
        name: language === 'bn' ? m.nameBn || m.nameEn : m.nameEn || m.nameBn,
        district: m.district || (language === 'bn' ? 'মৌলভীবাজার' : 'Moulvibazar'),
        isNonMember: false,
      }));
    const publicDonors = publicBloodDonors
      .filter(
        (d) =>
          d.availabilityStatus !== 'unavailable' &&
          (d.bloodGroup || '').toUpperCase().trim() === selectedBloodGroup
      )
      .map((d) => ({
        id: d.id,
        name: d.fullName,
        district: d.upazilaOrArea ? `${d.upazilaOrArea}, ${d.district}` : d.district,
        isNonMember: true,
      }));
    return [...publicDonors, ...memberDonors];
  }, [generalMembers, publicBloodDonors, selectedBloodGroup, language]);

  // Documentary Strip Photos
  const documentaryPhotos = [
    {
      id: 'doc-1',
      url: '/assets/images/hero_humanitarian_care_1792170805861.jpg',
      titleBn: 'চরাঞ্চলের শিশু ও প্রবীণদের মাঝে পুষ্টি ও খাদ্য সহায়তা',
      titleEn: 'Nutritional & Food Aid in Remote River Islands',
      locationBn: 'উলিপুর, কুড়িগ্রাম',
      locationEn: 'Ulipur, Kurigram',
    },
    {
      id: 'doc-2',
      url: '/assets/images/emergency_flood_relief_1792170807173.jpg',
      titleBn: 'প্লাবিত হাওরে নৌকাযোগে জরুরি শুকনো খাবার বিতরণ',
      titleEn: 'Boat-Deployed Flood Relief Rations in Sylhet Haors',
      locationBn: 'দোয়ারাবাজার, সুনামগঞ্জ',
      locationEn: 'Dowarabazar, Sunamganj',
    },
    {
      id: 'doc-3',
      url: '/assets/images/healthcare_medical_camp_1792170806394.jpg',
      titleBn: 'ভ্রাম্যমাণ মা ও শিশু স্বাস্থ্য ক্যাম্প ও বিনামূল্যে ওষুধ',
      titleEn: 'Mobile Maternal & Pediatric Health Camp',
      locationBn: 'কমলগঞ্জ, মৌলভীবাজার',
      locationEn: 'Kamalganj, Moulvibazar',
    },
    {
      id: 'doc-4',
      url: '/assets/images/education_support_project_1792170806647.jpg',
      titleBn: 'প্রাথমিক বিদ্যালয়ের শিক্ষার্থীদের পাঠ্যবই ও শিক্ষা উপকরণ',
      titleEn: 'Free Textbooks & Stationery for Primary Students',
      locationBn: 'গাইবান্ধা চরাঞ্চল',
      locationEn: 'Gaibandha Chars',
    },
  ];

  const activeLightboxPhoto = lightboxIndex !== null ? documentaryPhotos[lightboxIndex] : null;

  return (
    <section className="py-14 sm:py-20 space-y-20 sm:space-y-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* ======================================================== */}
      {/* ACT 1: FEATURED HUMANITARIAN PROJECTS (Clean Editorial)  */}
      {/* ======================================================== */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A]">
              {language === 'bn' ? 'চলমান মানবিক উদ্যোগ' : 'Featured Humanitarian Drives'}
            </span>
            <h2 className="text-2xl sm:text-3xl stylish-title mt-1">
              {language === 'bn' ? 'সরাসরি সহায়তা ও প্রজেক্ট অগ্রগতি' : 'Featured Causes & Live Progress'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedProjectFilter(cat)}
                className={`py-1.5 border-b-2 transition-colors cursor-pointer capitalize ${
                  selectedProjectFilter === cat
                    ? 'border-[#167D78] text-[#102B3F] dark:border-[#D6F36A] dark:text-[#D6F36A]'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-[#102B3F] dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? (language === 'bn' ? 'সবগুলো' : 'All Causes') : cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onNavigate('activities')}
              className="inline-flex items-center gap-1 text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer pl-2"
            >
              <span>{language === 'bn' ? 'সকল কার্যক্রম' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((p, idx) => {
            const pct = Math.min(
              100,
              Math.round((Number(p.raisedAmount || 0) / Math.max(1, Number(p.targetAmount || 0))) * 100)
            );
            return (
              <article
                key={p.id}
                className="bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden flex flex-col justify-between group hover:border-[#167D78]/60 transition-colors"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                      src={p.image}
                      alt={language === 'bn' ? p.titleBn : p.titleEn}
                      className="w-full h-full object-cover img-zoom-hover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#167D78] dark:text-[#D6F36A] font-bold">
                      <span>{p.category}</span>
                      <span className="tabular-nums">{pct}% {language === 'bn' ? 'সংগৃহীত' : 'Funded'}</span>
                    </div>

                    <h3 className="font-bold text-[#102B3F] dark:text-white text-base sm:text-lg leading-snug line-clamp-1">
                      {language === 'bn' ? p.titleBn : p.titleEn}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {language === 'bn' ? p.descriptionBn : p.descriptionEn}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold tabular-nums">
                        <span className="text-[#102B3F] dark:text-white font-bold">
                          ৳{Number(p.raisedAmount || 0).toLocaleString()}
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">
                          {language === 'bn' ? 'লক্ষ্য:' : 'Goal:'} ৳{Number(p.targetAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <AnimatedProgressBar
                        targetPercent={pct}
                        delayMs={idx * 80}
                        trackClassName="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden"
                        fillClassName="h-full bg-[#167D78] dark:bg-[#D6F36A] rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenDonate(p)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#D6F36A]" />
                    <span>{language === 'bn' ? 'অনুদান দিন' : 'Donate'}</span>
                  </button>
                  {onOpenSponsorship && (
                    <button
                      type="button"
                      onClick={() => onOpenSponsorship(p)}
                      className="py-2.5 px-3.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-[#167D78] text-[#102B3F] dark:text-stone-200 font-bold text-xs cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                      <span>{language === 'bn' ? 'স্পনসর' : 'Sponsor'}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACT 2: SERENE 5-PILLAR MISSION EXPLORER                  */}
      {/* ======================================================== */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A]">
              {language === 'bn' ? 'আমাদের মূল লক্ষ্য' : 'Core Humanitarian Pillars'}
            </span>
            <h2 className="text-2xl sm:text-3xl stylish-title mt-1">
              {language === 'bn' ? 'মানবতার সেবায় ৫টি মৌলিক স্তম্ভ' : '5 Core Pillars Serving Humanity'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md">
            {websiteConfig
              ? language === 'bn'
                ? websiteConfig.founderVisionBn
                : websiteConfig.founderVisionEn
              : language === 'bn'
              ? 'যেকোনো স্তম্ভ নির্বাচন করে আমাদের বাস্তব কর্মপরিধি ও সেবার ধরন দেখুন।'
              : 'Select any pillar to inspect field impact and operational reach.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Minimal Index List */}
          <div className="lg:col-span-5 divide-y divide-stone-200/80 dark:divide-stone-800 border-y border-stone-200/80 dark:border-stone-800">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = idx === activePillarIndex;
              return (
                <button
                  key={pillar.index}
                  type="button"
                  onClick={() => setActivePillarIndex(idx)}
                  className={`w-full text-left py-4 px-3 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/90 dark:bg-[#0c1a24] text-[#102B3F] dark:text-white'
                      : 'hover:bg-white/50 dark:hover:bg-[#0c1a24]/50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold shrink-0 ${
                        isActive ? 'text-[#167D78] dark:text-[#D6F36A]' : 'text-stone-400'
                      }`}
                    >
                      {pillar.index}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#167D78] dark:text-[#D6F36A]' : 'text-stone-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className={`text-sm sm:text-[15px] leading-snug truncate ${isActive ? 'font-bold text-[#102B3F] dark:text-white' : 'font-medium'}`}>
                        {language === 'bn' ? pillar.titleBn : pillar.titleEn}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#167D78] dark:text-[#D6F36A] translate-x-0.5' : 'text-stone-300 dark:text-stone-700'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Serene Spotlight Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 relative min-h-[220px] bg-stone-100 dark:bg-stone-900">
                <img
                  key={activePillar.image}
                  src={activePillar.image}
                  alt={language === 'bn' ? activePillar.titleBn : activePillar.titleEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A] font-bold">
                    {activePillar.index} · {language === 'bn' ? activePillar.metricBn : activePillar.metricEn}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#102B3F] dark:text-white leading-snug">
                    {language === 'bn' ? activePillar.titleBn : activePillar.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {language === 'bn' ? activePillar.descBn : activePillar.descEn}
                  </p>
                  <ul className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                    {(language === 'bn' ? activePillar.highlightsBn : activePillar.highlightsEn).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
                        <span className="text-[#167D78] dark:text-[#D6F36A] font-bold">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => onNavigate(activePillar.linkTarget)}
                    className="inline-flex items-center gap-1.5 text-[#102B3F] dark:text-white hover:text-[#167D78] dark:hover:text-[#D6F36A] transition-colors cursor-pointer"
                  >
                    <span>{language === 'bn' ? 'সংশ্লিষ্ট বিভাগ দেখুন' : 'Explore Department'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <button
                    type="button"
                    onClick={() => onOpenDonate(null)}
                    className="inline-flex items-center gap-1 text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সহায়তা করুন' : 'Support Cause'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACT 3: WINGS OVERVIEW + 24/7 VOLUNTARY BLOOD FINDER      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (7 cols): Calm Editorial Navy Panel with Clean Tabs */}
        <div className="lg:col-span-7 rounded-2xl bg-[#102B3F] text-white p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D6F36A] block">
                  {language === 'bn' ? 'বিশেষ উইং ও স্বচ্ছতা' : 'Wings & Governance'}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {language === 'bn' ? 'নারী নেতৃত্ব, কর্মসংস্থান ও হিসাব' : 'Women’s Wing, Livelihood & Accounts'}
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveWingTab('womens')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeWingTab === 'womens' ? 'bg-rose-500 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'উইমেন্স টিম' : 'Women’s Wing'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveWingTab('livelihood')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeWingTab === 'livelihood' ? 'bg-[#D6F36A] text-[#102B3F]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'কর্মসংস্থান' : 'Livelihood'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveWingTab('audit')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeWingTab === 'audit' ? 'bg-emerald-400 text-[#102B3F]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'অডিট লেজার' : 'Open Audit'}
                </button>
              </div>
            </div>

            {activeWingTab === 'womens' && (
              <div className="space-y-3">
                <h4 className="text-lg font-extrabold text-white">
                  {womensTeamConfig
                    ? language === 'bn'
                      ? womensTeamConfig.nameBn
                      : womensTeamConfig.nameEn
                    : 'CoLASH Foundation Women’s Team'}
                </h4>
                <p className="text-sm text-stone-200 leading-relaxed max-w-xl">
                  {womensTeamConfig
                    ? language === 'bn'
                      ? womensTeamConfig.mottoBn
                      : womensTeamConfig.mottoEn
                    : '“নারীর মর্যাদা, শিক্ষা ও স্বাবলম্বনে আলোকিত সমাজ বিনির্মাণ” — সম্পূর্ণ নারী নেতৃত্বে পরিচালিত কারিগরি প্রশিক্ষণ ও মা-শিশু সুরক্ষা কার্যক্রম।'}
                </p>
                <p className="text-xs text-rose-200/90">
                  {language === 'bn'
                    ? 'সেলাই ও হস্তশিল্প প্রশিক্ষণ · মা ও শিশু স্বাস্থ্য সচেতনতা · নারী পোর্টাল'
                    : 'Tailoring & craft training · Maternal wellness camps · Dedicated Women’s Portal'}
                </p>
              </div>
            )}

            {activeWingTab === 'livelihood' && (
              <div className="space-y-3">
                <h4 className="text-lg font-extrabold text-white">
                  {language === 'bn'
                    ? 'পুরুষ ও যুব কর্মসংস্থান ও কারিগরি ট্রেড'
                    : 'Men & Youth Livelihood & Trade Skills'}
                </h4>
                <p className="text-sm text-stone-200 leading-relaxed max-w-xl">
                  {language === 'bn'
                    ? 'অসচ্ছল পরিবারের উপার্জনক্ষম সদস্যদের জন্য ভ্যান/রিকশা, কারিগরি দক্ষতা প্রশিক্ষণ ও ক্ষুদ্র ব্যবসার পুঁজি সহায়তা।'
                    : 'Empowering unemployed youth and breadwinners with battery vans, trade skill toolkits, and micro-enterprise seed capital.'}
                </p>
                <p className="text-xs text-[#D6F36A]/90">
                  {language === 'bn'
                    ? 'ভ্যান ও রিকশা সহায়তা · ইলেকট্রিক্যাল ও রিপেয়ার ট্রেড · বিনা সুদে ক্ষুদ্র পুঁজি'
                    : 'Van & rickshaw support · Electrical & repair trades · Zero-interest seed grants'}
                </p>
              </div>
            )}

            {activeWingTab === 'audit' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'অর্থ সচিবালয়ের উন্মুক্ত অভ্যন্তরীণ হিসাব বিবরণী'
                      : 'Open Internal Finance Secretariat Ledger'}
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-white">
                  {language === 'bn' ? '১০০% উন্মুক্ত অডিট ও হিসাব লেজার' : '100% Open Financial Ledger'}
                </h4>
                <p className="text-sm text-stone-200 leading-relaxed max-w-xl">
                  {language === 'bn'
                    ? 'প্রতিটি অনুদান ও মাঠপর্যায়ের ব্যয়ের হিসাব সর্বসাধারণের দেখার জন্য উন্মুক্ত। উল্লেখ্য, এখনো কোনো বাহ্যিক সিএ ফার্ম দ্বারা অডিট করানো হয়নি।'
                    : 'Every donation and field disbursement record is openly published. External CA firm audit is pending.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            {activeWingTab === 'womens' ? (
              <button
                type="button"
                onClick={() => onNavigate('womens-team')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{language === 'bn' ? 'উইমেন্স টিম পেজে যান' : 'Open Women’s Team'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : activeWingTab === 'audit' ? (
              <button
                type="button"
                onClick={() => onNavigate('transparency')}
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#102B3F] font-extrabold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{language === 'bn' ? 'পূর্ণ হিসাব লেজার দেখুন' : 'View Financial Ledger'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('activities')}
                className="px-4 py-2.5 rounded-xl bg-[#D6F36A] hover:bg-white text-[#102B3F] font-extrabold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{language === 'bn' ? 'কর্মসংস্থান প্রকল্প দেখুন' : 'Explore Livelihood'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenPortal}
              className="text-xs font-bold text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'সদস্য পোর্টাল →' : 'Member Portal →'}
            </button>
          </div>
        </div>

        {/* Right (5 cols): Serene Instant Blood Donor Finder */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200/80 dark:border-stone-800 p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Droplets className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 block">
                    {language === 'bn' ? '২৪/৭ জরুরি রক্ত সহায়তা' : '24/7 Blood Network'}
                  </span>
                  <h4 className="text-base font-extrabold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? 'তাৎক্ষণিক রক্তদাতা খুঁজুন' : 'Instant Blood Donor Finder'}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-stone-500 tabular-nums">
                {generalMembers.length + publicBloodDonors.length} {language === 'bn' ? 'জন' : 'Donors'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`py-2 rounded-lg text-xs font-black transition-all cursor-pointer tabular-nums border ${
                    selectedBloodGroup === bg
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-stone-50 dark:bg-stone-900 text-[#102B3F] dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-rose-400'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-2 min-h-[104px]">
              <div className="flex items-center justify-between text-xs border-b border-stone-100 dark:border-stone-800 pb-1.5">
                <span className="font-bold text-[#102B3F] dark:text-white">
                  {selectedBloodGroup} {language === 'bn' ? 'গ্রুপের সক্রিয় রক্তদাতা' : 'Verified Donors'}
                </span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 tabular-nums">
                  {matchingBloodDonors.length} {language === 'bn' ? 'জন' : 'Found'}
                </span>
              </div>

              {matchingBloodDonors.length > 0 ? (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {matchingBloodDonors.slice(0, 3).map((donor) => (
                    <div key={donor.id} className="py-1.5 flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                        {donor.name}
                        {donor.isNonMember ? (language === 'bn' ? ' · অ-সদস্য' : ' · Voluntary') : ''}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0 truncate max-w-[130px]">
                        {donor.district}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 dark:text-stone-400 py-2">
                  {language === 'bn'
                    ? 'সদস্য না হয়েও এই গ্রুপে রক্তদাতা হিসেবে নাম যুক্ত করতে নিচের বাটনে ক্লিক করুন।'
                    : 'Register as a voluntary blood donor without membership below.'}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
            {onOpenBloodDonorModal && (
              <button
                type="button"
                onClick={onOpenBloodDonorModal}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn'
                    ? 'সদস্য না হয়েই শুধুই রক্তদাতা হোন'
                    : 'Donate Blood (No Membership Needed)'}
                </span>
              </button>
            )}
            <div className="flex items-center justify-between gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => onNavigate('members')}
                className="text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer"
              >
                {language === 'bn' ? 'পূর্ণ রক্তদাতা ডিরেক্টরি →' : 'Full Blood Directory →'}
              </button>
              <button
                type="button"
                onClick={onOpenVolunteer}
                className="text-stone-600 dark:text-stone-300 hover:text-[#102B3F] dark:hover:text-white cursor-pointer inline-flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সদস্য হোন' : 'Join Us'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACT 4: VISUAL DOCUMENTARY GALLERY                        */}
      {/* ======================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A]">
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মাঠের বাস্তব চিত্র' : 'Visual Documentary'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl stylish-title mt-1">
              {language === 'bn' ? 'মাঠপর্যায়ের সাম্প্রতিক কার্যক্রম' : 'Recent Field Missions in Frames'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('activities')}
            className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ গ্যালারি' : 'Full Gallery'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {documentaryPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-800 text-left cursor-pointer"
            >
              <img
                src={photo.url}
                alt={language === 'bn' ? photo.titleBn : photo.titleEn}
                className="w-full h-full object-cover img-zoom-hover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent p-3.5 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between text-[10px] text-[#D6F36A] font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {language === 'bn' ? photo.locationBn : photo.locationEn}
                  </span>
                  <Maximize2 className="w-3 h-3 opacity-75" />
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2 mt-0.5">
                  {language === 'bn' ? photo.titleBn : photo.titleEn}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Inline Field Documentary Lightbox Modal */}
      {activeLightboxPhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-[#0c1a24] rounded-2xl overflow-hidden border border-stone-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={activeLightboxPhoto.url}
                alt={language === 'bn' ? activeLightboxPhoto.titleBn : activeLightboxPhoto.titleEn}
                className="max-h-[70vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex - 1 + documentaryPhotos.length) % documentaryPhotos.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-white hover:text-black text-white transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % documentaryPhotos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-white hover:text-black text-white transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-white flex items-center justify-between gap-4 border-t border-stone-800">
              <div>
                <div className="text-xs text-[#D6F36A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {language === 'bn' ? activeLightboxPhoto.locationBn : activeLightboxPhoto.locationEn}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold mt-1">
                  {language === 'bn' ? activeLightboxPhoto.titleBn : activeLightboxPhoto.titleEn}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer shrink-0"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
