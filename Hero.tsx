import React, { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MapPin,
} from 'lucide-react';
import {
  Donation,
  FinancialRecord,
  GeneralMember,
  Language,
  Project,
  TeamMember,
  Volunteer,
  WebsiteCustomConfig,
  WomensTeamActivity,
  WomensTeamMember,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MagneticButton } from './common/MagneticButton';
import { computeLiveFoundationStats } from '../utils/liveStats';

interface HeroProps {
  language: Language;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
  onOpenNoticePage?: (noticeId?: string) => void;
  websiteConfig?: WebsiteCustomConfig;
  projects?: Project[];
  womensTeamActivities?: WomensTeamActivity[];
  generalMembers?: GeneralMember[];
  volunteers?: Volunteer[];
  womensTeamMembers?: WomensTeamMember[];
  committeeMembers?: TeamMember[];
  donations?: Donation[];
  financialRecords?: FinancialRecord[];
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onOpenDonate,
  onOpenVolunteer,
  websiteConfig,
  projects = [],
  womensTeamActivities = [],
  generalMembers = [],
  volunteers = [],
  womensTeamMembers = [],
  committeeMembers = [],
  donations = [],
  financialRecords = [],
}) => {
  const t = TRANSLATIONS[language];
  const liveStats = React.useMemo(
    () =>
      computeLiveFoundationStats(
        {
          projects,
          womensTeamActivities,
          generalMembers,
          volunteers,
          womensTeamMembers,
          committeeMembers,
          donations,
          financialRecords,
        },
        language
      ),
    [
      projects,
      womensTeamActivities,
      generalMembers,
      volunteers,
      womensTeamMembers,
      committeeMembers,
      donations,
      financialRecords,
      language,
    ]
  );
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyAutoPlay, setStoryAutoPlay] = useState(true);

  const heroStories = [
    {
      indexLabel: '01',
      tagBn: 'শিক্ষা ও পুষ্টি সহায়তা',
      tagEn: 'Education & Nutrition',
      titleBn: 'কুড়িগ্রামের দুর্গম চরে শিক্ষা ও পুষ্টি উপকরণ বিতরণ',
      titleEn: 'Educational & Nutritional Aid in Kurigram Chars',
      locationBn: 'উলিপুর, কুড়িগ্রাম',
      locationEn: 'Ulipur, Kurigram',
      image: websiteConfig?.heroImageUrl || '/assets/images/hero_humanitarian_care_1792170805861.jpg',
    },
    {
      indexLabel: '02',
      tagBn: 'জরুরি বন্যাত্রাণ',
      tagEn: 'Emergency Flood Relief',
      titleBn: 'সিলেট ও সুনামগঞ্জের প্লাবিত হাওরে নৌকাযোগে খাদ্য ও বিশুদ্ধ পানি',
      titleEn: 'Boat-Deployed Dry Rations & Clean Water in Flooded Haors',
      locationBn: 'দোয়ারাবাজার, সুনামগঞ্জ',
      locationEn: 'Dowarabazar, Sunamganj',
      image: '/assets/images/emergency_flood_relief_1792170807173.jpg',
    },
    {
      indexLabel: '03',
      tagBn: 'বিনামূল্যে স্বাস্থ্যসেবা',
      tagEn: 'Mobile Medical Camp',
      titleBn: 'প্রান্তিক অঞ্চলে বিশেষজ্ঞ চিকিৎসকদের মা ও শিশু স্বাস্থ্য ক্যাম্প',
      titleEn: 'Maternal & Pediatric Checkups with Free Medicine',
      locationBn: 'কমলগঞ্জ, মৌলভীবাজার',
      locationEn: 'Kamalganj, Moulvibazar',
      image: '/assets/images/healthcare_medical_camp_1792170806394.jpg',
    },
    {
      indexLabel: '04',
      tagBn: 'আলো ও শিক্ষা মিশন',
      tagEn: 'Grassroots Education',
      titleBn: 'অসচ্ছল মেধাবী শিক্ষার্থীদের পাঠ্যবই, বৃত্তি ও স্কুল সামগ্রী সহায়তা',
      titleEn: 'Merit Scholarships & Learning Kits for Rural Youth',
      locationBn: 'গাইবান্ধা ও সিলেট বিভাগ',
      locationEn: 'Gaibandha & Sylhet Division',
      image: '/assets/images/education_support_project_1792170806647.jpg',
    },
  ];

  useEffect(() => {
    if (!storyAutoPlay) return;
    const timer = window.setInterval(() => {
      setActiveStoryIndex((prev) => (prev + 1) % heroStories.length);
    }, 5800);
    return () => window.clearInterval(timer);
  }, [storyAutoPlay, heroStories.length]);

  const activeStory = heroStories[activeStoryIndex];

  return (
    <section id="home" className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Serene Editorial Typography & Primary Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A] mb-3.5">
              {language === 'bn'
                ? `প্রতিষ্ঠা ${websiteConfig?.foundingDateBn || '০৭ মার্চ ২০২৬'} · ${websiteConfig?.foundingLocationBn || 'কমলগঞ্জ, মৌলভীবাজার'}`
                : 'Established 07 March 2026 · Kamalganj, Moulvibazar'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.05rem] stylish-title-hero text-balance mb-4">
              {websiteConfig ? (language === 'bn' ? websiteConfig.heroHeadingBn : websiteConfig.heroHeadingEn) : t.heroTitle}
            </h1>

            <p className="font-serif italic text-sm sm:text-base text-[#102B3F]/85 dark:text-[#D6F36A]/90 mb-4">
              “{websiteConfig ? (language === 'bn' ? websiteConfig.siteSloganBn : websiteConfig.siteSloganEn) : t.sloganBn}”
              <span className="ml-2 font-sans not-italic text-xs text-stone-500 dark:text-stone-400">
                — {websiteConfig?.siteSloganEn || t.sloganEn}
              </span>
            </p>

            <p className="text-sm sm:text-[15px] text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mb-7">
              {websiteConfig ? (language === 'bn' ? websiteConfig.heroSubheadingBn : websiteConfig.heroSubheadingEn) : t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              <MagneticButton
                onClick={onOpenDonate}
                className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#167D78] hover:bg-[#102B3F] dark:hover:bg-[#135955] rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group btn-primary-interaction"
              >
                <Heart className="w-4 h-4 fill-current text-[#D6F36A] group-hover:scale-110 transition-transform" />
                <span>{t.heroCtaDonate}</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <MagneticButton
                onClick={onOpenVolunteer}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-[#102B3F] dark:text-white bg-white/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-[#167D78] rounded-xl transition-all cursor-pointer btn-outline-interaction"
              >
                <Users className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A]" />
                <span>{t.heroCtaVolunteer}</span>
              </MagneticButton>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#167D78]" />
                <span>{language === 'bn' ? '১০০% স্বচ্ছ ব্যাংক ও বিকাশ তহবিল' : '100% Transparent Fund Flow'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#167D78]" />
                <span>{language === 'bn' ? 'তাৎক্ষণিক ডিজিটাল ই-রসিদ' : 'Instant E-Money Receipt'}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Clean Museum-Editorial Gallery Frame */}
          <div
            className="lg:col-span-6 flex flex-col gap-3"
            onMouseEnter={() => setStoryAutoPlay(false)}
            onMouseLeave={() => setStoryAutoPlay(true)}
          >
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-md border border-stone-200/80 dark:border-stone-800 bg-[#102B3F] group">
              <img
                key={activeStory.image}
                src={activeStory.image}
                alt={language === 'bn' ? activeStory.titleBn : activeStory.titleEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081722]/90 via-[#081722]/20 to-transparent" />

              {/* Subtle Top Navigation Arrows */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveStoryIndex((prev) => (prev - 1 + heroStories.length) % heroStories.length)}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  aria-label="Previous mission story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryIndex((prev) => (prev + 1) % heroStories.length)}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  aria-label="Next mission story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Clean Single Bottom Story Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-[#D6F36A] mb-1.5">
                  <span>{activeStory.indexLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{language === 'bn' ? activeStory.tagBn : activeStory.tagEn}</span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white leading-snug max-w-lg">
                  {language === 'bn' ? activeStory.titleBn : activeStory.titleEn}
                </h3>
                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-stone-300">
                    <MapPin className="w-3.5 h-3.5 text-[#D6F36A]" />
                    {language === 'bn' ? activeStory.locationBn : activeStory.locationEn}
                  </span>
                  <button
                    type="button"
                    onClick={onOpenDonate}
                    className="text-xs font-bold text-[#D6F36A] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'সহায়তা পাঠান' : 'Support Mission'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quiet Story Step Indicators Outside Image */}
            <div className="grid grid-cols-4 gap-2 px-1">
              {heroStories.map((story, idx) => (
                <button
                  key={story.indexLabel}
                  type="button"
                  onClick={() => {
                    setActiveStoryIndex(idx);
                    setStoryAutoPlay(false);
                  }}
                  className={`text-left py-1 transition-colors cursor-pointer ${
                    idx === activeStoryIndex
                      ? 'text-[#102B3F] dark:text-[#D6F36A]'
                      : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
                  }`}
                >
                  <div
                    className={`h-0.5 rounded-full mb-1.5 transition-all ${
                      idx === activeStoryIndex
                        ? 'bg-[#167D78] dark:bg-[#D6F36A]'
                        : 'bg-stone-200 dark:bg-stone-800'
                    }`}
                  />
                  <div className="text-[11px] font-semibold truncate">
                    {story.indexLabel} · {language === 'bn' ? story.tagBn : story.tagEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Architectural 4-Metric Impact Ledger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white/90 dark:bg-[#0c1a24] rounded-2xl border border-stone-200/80 dark:border-stone-800 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/80 dark:divide-stone-800 overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="text-2xl sm:text-3xl font-black text-[#102B3F] dark:text-white tabular-nums tracking-tight">
              {liveStats.beneficiaries.value}
            </div>
            <div className="text-xs font-bold text-stone-700 dark:text-stone-200 mt-1">
              {liveStats.beneficiaries.label}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {liveStats.beneficiaries.subtext}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="text-2xl sm:text-3xl font-black text-[#167D78] dark:text-[#D6F36A] tabular-nums tracking-tight">
              {liveStats.activeProjects.value}
            </div>
            <div className="text-xs font-bold text-stone-700 dark:text-stone-200 mt-1">
              {liveStats.activeProjects.label}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {liveStats.activeProjects.subtext}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="text-2xl sm:text-3xl font-black text-[#102B3F] dark:text-white tabular-nums tracking-tight">
              {liveStats.registeredTeam.value}
            </div>
            <div className="text-xs font-bold text-stone-700 dark:text-stone-200 mt-1">
              {liveStats.registeredTeam.label}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {liveStats.registeredTeam.subtext}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="text-2xl sm:text-3xl font-black text-[#E6A15B] tabular-nums tracking-tight">
              {liveStats.transparency.value}
            </div>
            <div className="text-xs font-bold text-stone-700 dark:text-stone-200 mt-1">
              {liveStats.transparency.label}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {liveStats.transparency.subtext}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
