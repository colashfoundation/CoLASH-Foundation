import React from 'react';
import {
  Users,
  Sparkles,
  Calendar,
  FileText,
  Droplets,
  MapPin,
  Search,
  ScanLine,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import { Language, PortalCategoryKey } from '../../types';

interface CategoryPortalSectionProps {
  language: Language;
  activeCategory: PortalCategoryKey;
  onSelectCategory: (category: PortalCategoryKey) => void;
  onOpenPortal: () => void;
  onOpenSearch: () => void;
  onOpenScanner?: () => void;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const CategoryPortalSection: React.FC<CategoryPortalSectionProps> = ({
  language,
  onSelectCategory,
  onOpenPortal,
  onOpenSearch,
  onOpenScanner,
}) => {
  const departments: Array<{
    num: string;
    key?: PortalCategoryKey;
    onClick?: () => void;
    icon: React.ComponentType<{ className?: string }>;
    titleBn: string;
    titleEn: string;
    descBn: string;
    descEn: string;
    accentClass: string;
  }> = [
    {
      num: '01',
      key: 'activities',
      icon: Calendar,
      titleBn: 'কার্যক্রম, প্রজেক্ট ও অডিট',
      titleEn: 'Projects, Relief & Audit',
      descBn: 'মাঠপর্যায়ের চলমান উদ্যোগ, ছবির গ্যালারি ও উন্মুক্ত হিসাব লেজার',
      descEn: 'Ongoing relief drives, field gallery & open accounting records',
      accentClass: 'text-[#167D78] dark:text-[#D6F36A]',
    },
    {
      num: '02',
      key: 'committee',
      icon: Users,
      titleBn: 'কমিটি, প্রতিষ্ঠাতা ও উপদেষ্টা',
      titleEn: 'Committee, Founder & Advisors',
      descBn: 'কার্যনির্বাহী পরিষদ (২০২৬–২৮), প্রতিষ্ঠাতা দর্শন ও উপদেষ্টামণ্ডলী',
      descEn: 'Executive council (2026–28), founder profile & advisory board',
      accentClass: 'text-[#167D78] dark:text-[#D6F36A]',
    },
    {
      num: '03',
      key: 'womens_team',
      icon: Sparkles,
      titleBn: 'উইমেন্স টিম উইং',
      titleEn: "Women's Team Wing",
      descBn: 'স্বায়ত্তশাসিত নারী নেতৃত্ব, সেলাই-কারিগরি প্রশিক্ষণ ও মা-শিশু সুরক্ষা',
      descEn: 'Female leadership, vocational training & maternal initiatives',
      accentClass: 'text-rose-600 dark:text-rose-400',
    },
    {
      num: '04',
      key: 'members',
      icon: Droplets,
      titleBn: '২৪/৭ রক্তদাতা ও সদস্য তালিকা',
      titleEn: '24/7 Blood Bank & Members',
      descBn: 'গ্রুপ অনুযায়ী রক্তদাতা অনুসন্ধান ও অনুমোদিত সাধারণ সদস্যবৃন্দ',
      descEn: 'Blood group matching directory & verified general members',
      accentClass: 'text-rose-600 dark:text-rose-400',
    },
    {
      num: '05',
      key: 'notices_applications',
      icon: FileText,
      titleBn: 'বিজ্ঞপ্তি ও নাগরিক আবেদন',
      titleEn: 'Notices & Public Applications',
      descBn: 'সাহায্য বা শিক্ষাবৃত্তির আবেদন, নোটিশ ও ট্র্যাকিং আইডি যাচাই',
      descEn: 'Apply for aid without login & track status via Tracking ID',
      accentClass: 'text-[#167D78] dark:text-[#D6F36A]',
    },
    {
      num: '06',
      key: 'branches',
      icon: MapPin,
      titleBn: '৬৪ জেলা শাখা ও যোগাযোগ',
      titleEn: '64-District Branches & Map',
      descBn: 'সারাদেশে শাখা নেটওয়ার্ক, প্রস্তাবনা ও কমলগঞ্জ কেন্দ্রীয় কার্যালয়',
      descEn: 'Nationwide division network, Kamalganj HQ & Google Maps',
      accentClass: 'text-[#167D78] dark:text-[#D6F36A]',
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white/50 dark:bg-[#09151e]/50 border-y border-stone-200/70 dark:border-stone-800/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-7">
        {/* Serene Editorial Directory Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A]">
              {language === 'bn' ? 'বিভাগভিত্তিক নির্দেশিকা' : 'Foundation Directory'}
            </span>
            <h2 className="text-2xl sm:text-3xl stylish-title mt-1 text-balance">
              {language === 'bn' ? 'এক ক্লিকে প্রয়োজনীয় বিভাগে প্রবেশ' : 'Explore Departments Directly'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={onOpenPortal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#102B3F] hover:bg-[#167D78] text-white transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#D6F36A]" />
              <span>{language === 'bn' ? 'সদস্য পোর্টাল' : 'Member Portal'}</span>
            </button>

            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-700 text-[#102B3F] dark:text-stone-200 hover:border-[#167D78] transition-colors cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                <span>{language === 'bn' ? 'ID স্ক্যান' : 'Scan ID'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-700 text-[#102B3F] dark:text-stone-200 hover:border-[#167D78] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
              <span>{language === 'bn' ? 'অনুসন্ধান' : 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Clean Unified 6-Card Architectural Index Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.num}
                type="button"
                onClick={() => (dept.onClick ? dept.onClick() : dept.key && onSelectCategory(dept.key))}
                className="group text-left p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200/80 dark:border-stone-800 hover:border-[#167D78] dark:hover:border-[#D6F36A]/60 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-stone-400 dark:text-stone-500 tracking-widest">
                      {dept.num}
                    </span>
                    <Icon className={`w-4 h-4 ${dept.accentClass}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#102B3F] dark:text-white group-hover:text-[#167D78] dark:group-hover:text-[#D6F36A] transition-colors leading-snug">
                    {language === 'bn' ? dept.titleBn : dept.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
                    {language === 'bn' ? dept.descBn : dept.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-bold text-[#167D78] dark:text-[#D6F36A]">
                  <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Open Section'}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
