import React from 'react';
import { Language, PortalCategoryKey } from '../types';

export interface PageThemeConfig {
  slug: string;
  titleBn: string;
  titleEn: string;
  accentColor: string;
  lightContainerStyle: React.CSSProperties;
  darkContainerStyle: React.CSSProperties;
}

export function getCanonicalCategorySlug(category: PortalCategoryKey): string {
  switch (category) {
    case 'all':
    case 'home':
      return 'home';
    case 'founder':
      return 'founder';
    case 'committee_history':
      return 'committee';
    case 'womens_team':
      return 'womens-team';
    case 'emergency_notice':
      return 'emergency-notice';
    case 'notices_applications':
      return 'notices-applications';
    case 'contact_location':
      return 'contact';
    default:
      return category;
  }
}

export function resolveCategoryFromSlug(rawSlug: string): PortalCategoryKey | null {
  const s = rawSlug.trim().toLowerCase();
  if (!s || s === 'home' || s === 'all') return 'home';
  if (s === 'founder' || s === 'protishthata') return 'founder';
  if (s === 'about') return 'about';
  if (s === 'donate' || s === 'donation' || s === 'onudan') return 'donate';
  if (s === 'committee' || s === 'committee-history' || s === 'committee_history') return 'committee';
  if (s === 'advisors' || s === 'advisory') return 'advisors';
  if (s === 'members') return 'members';
  if (s === 'womens-team' || s === 'womens_team') return 'womens_team';
  if (s === 'activities' || s === 'projects' || s === 'events' || s === 'gallery') return 'activities';
  if (s === 'transparency') return 'transparency';
  if (s === 'notices') return 'notices';
  if (s === 'emergency-notice' || s === 'emergency_notice') return 'emergency_notice';
  if (s === 'applications') return 'applications';
  if (s === 'notices-applications' || s === 'notices_applications') return 'notices_applications';
  if (s === 'faq' || s === 'faqs' || s === 'questions') return 'faq';
  if (s === 'branches' || s === 'bangladesh-branches' || s === 'shakha') return 'branches';
  if (s === 'contact' || s === 'contact_location' || s === 'location-map') return 'contact_location';
  return null;
}

const LIGHT_ARCH_GRID =
  'linear-gradient(to right, rgba(16, 43, 63, 0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 43, 63, 0.028) 1px, transparent 1px)';
const DARK_ARCH_GRID =
  'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)';
const GRID_SIZE = '44px 44px, 44px 44px, 100% 100%, 100% 100%';

const THEMES: Record<string, PageThemeConfig> = {
  home: {
    slug: 'home',
    titleBn: 'হোম পেজ',
    titleEn: 'Home Page',
    accentColor: '#167D78',
    lightContainerStyle: {
      backgroundColor: '#F7F8F6',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 80% 45% at 50% -5%, rgba(22, 125, 120, 0.11), transparent 72%), linear-gradient(180deg, #FAFBF9 0%, #F3F6F4 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#07131C',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 80% 45% at 50% -5%, rgba(22, 125, 120, 0.22), transparent 72%), linear-gradient(180deg, #071520 0%, #061018 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  founder: {
    slug: 'founder',
    titleBn: 'প্রতিষ্ঠাতা পরিচিতি ও দর্শন',
    titleEn: 'Founder Profile & Vision',
    accentColor: '#102B3F',
    lightContainerStyle: {
      backgroundColor: '#F7F5F0',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 20% 0%, rgba(16, 43, 63, 0.09), transparent 70%), linear-gradient(180deg, #FAF8F3 0%, #F2EFE8 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#06101B',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 20% 0%, rgba(22, 125, 120, 0.20), transparent 70%), linear-gradient(180deg, #081523 0%, #050E17 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  about: {
    slug: 'about',
    titleBn: 'পরিচিতি ও লক্ষ্য',
    titleEn: 'About Us',
    accentColor: '#0F766E',
    lightContainerStyle: {
      backgroundColor: '#F3F7F6',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 80% 0%, rgba(15, 118, 110, 0.11), transparent 70%), linear-gradient(180deg, #F7FAF9 0%, #EDF4F2 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#061514',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 80% 0%, rgba(15, 118, 110, 0.22), transparent 70%), linear-gradient(180deg, #071917 0%, #051110 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  donate: {
    slug: 'donate',
    titleBn: 'অনলাইন অনুদান ও সর্বজনীন ধর্মীয় বাণী',
    titleEn: 'Donate Now & Interfaith Charity Teachings',
    accentColor: '#B45309',
    lightContainerStyle: {
      backgroundColor: '#FAF7F1',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(180, 83, 9, 0.08), transparent 72%), linear-gradient(180deg, #FCF9F4 0%, #F4EFE4 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#0C1219',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(217, 119, 6, 0.15), transparent 72%), linear-gradient(180deg, #0F151E 0%, #080E14 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  committee: {
    slug: 'committee',
    titleBn: 'কার্যনির্বাহী পরিষদ ২০২৬–২০২৮',
    titleEn: 'Executive Committee 2026–2028',
    accentColor: '#102B3F',
    lightContainerStyle: {
      backgroundColor: '#F2F5F8',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 80% 45% at 50% 0%, rgba(16, 43, 63, 0.10), transparent 72%), linear-gradient(180deg, #F6F8FB 0%, #EAEFF5 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#07131E',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 80% 45% at 50% 0%, rgba(22, 125, 120, 0.18), transparent 72%), linear-gradient(180deg, #091724 0%, #050E17 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  advisors: {
    slug: 'advisors',
    titleBn: 'উপদেষ্টামণ্ডলী পরিষদ',
    titleEn: 'Advisory Council',
    accentColor: '#1D4ED8',
    lightContainerStyle: {
      backgroundColor: '#F3F6FB',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(29, 78, 216, 0.09), transparent 72%), linear-gradient(180deg, #F7F9FD 0%, #ECF1F9 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#071021',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(37, 99, 235, 0.20), transparent 72%), linear-gradient(180deg, #091429 0%, #050B18 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  members: {
    slug: 'members',
    titleBn: 'সাধারণ সদস্যবৃন্দ ও রক্তদাতা ডিরেক্টরি',
    titleEn: 'General Members & Blood Directory',
    accentColor: '#E11D48',
    lightContainerStyle: {
      backgroundColor: '#FAF4F5',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(225, 29, 72, 0.08), transparent 72%), linear-gradient(180deg, #FDF8F9 0%, #F5ECEE 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#110B10',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(225, 29, 72, 0.16), transparent 72%), linear-gradient(180deg, #160D14 0%, #0C070B 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  womens_team: {
    slug: 'womens-team',
    titleBn: 'উইমেন্স টিম উইং',
    titleEn: "Women's Team Wing",
    accentColor: '#BE185D',
    lightContainerStyle: {
      backgroundColor: '#FAF3F7',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(190, 24, 93, 0.09), transparent 72%), linear-gradient(180deg, #FCF7FA 0%, #F4EAF0 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#130912',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(219, 39, 119, 0.18), transparent 72%), linear-gradient(180deg, #180C17 0%, #0D060D 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  activities: {
    slug: 'activities',
    titleBn: 'কার্যক্রম, প্রকল্প ও গ্যালারি',
    titleEn: 'Activities, Projects & Gallery',
    accentColor: '#059669',
    lightContainerStyle: {
      backgroundColor: '#F3F7F4',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(5, 150, 105, 0.09), transparent 72%), linear-gradient(180deg, #F7FAF8 0%, #ECF3EE 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#061511',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(5, 150, 105, 0.18), transparent 72%), linear-gradient(180deg, #081A15 0%, #05100D 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  transparency: {
    slug: 'transparency',
    titleBn: 'আর্থিক স্বচ্ছতা ও অডিট লেজার',
    titleEn: 'Financial Transparency & Audit',
    accentColor: '#0D9488',
    lightContainerStyle: {
      backgroundColor: '#F2F6F7',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(13, 148, 136, 0.10), transparent 72%), linear-gradient(180deg, #F6FAFB 0%, #EBF2F4 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#061317',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(13, 148, 136, 0.18), transparent 72%), linear-gradient(180deg, #08181D 0%, #050F12 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  notices: {
    slug: 'notices',
    titleBn: 'অফিসিয়াল বিজ্ঞপ্তি ও ইভেন্টস',
    titleEn: 'Official Notices & Events',
    accentColor: '#6D28D9',
    lightContainerStyle: {
      backgroundColor: '#F4F3F9',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(109, 40, 217, 0.08), transparent 72%), linear-gradient(180deg, #F8F7FC 0%, #ECEAF5 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#0B0B19',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(124, 58, 237, 0.18), transparent 72%), linear-gradient(180deg, #0E0E21 0%, #070712 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  emergency_notice: {
    slug: 'emergency-notice',
    titleBn: 'জরুরি মানবিক বিজ্ঞপ্তি ও ত্রাণ তহবিল',
    titleEn: 'Emergency Relief Notice',
    accentColor: '#DC2626',
    lightContainerStyle: {
      backgroundColor: '#FBF5F2',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(220, 38, 38, 0.09), transparent 72%), linear-gradient(180deg, #FDF9F7 0%, #F5ECE7 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#150B0C',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(225, 29, 72, 0.18), transparent 72%), linear-gradient(180deg, #1B0E10 0%, #0F0708 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  applications: {
    slug: 'applications',
    titleBn: 'নাগরিক আবেদন ও ট্র্যাকিং ডেস্ক',
    titleEn: 'Citizen Applications & Tracking',
    accentColor: '#0284C7',
    lightContainerStyle: {
      backgroundColor: '#F2F7FA',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(2, 132, 199, 0.09), transparent 72%), linear-gradient(180deg, #F6FAFD 0%, #EAF2F7 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#06131D',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(2, 132, 199, 0.18), transparent 72%), linear-gradient(180deg, #081825 0%, #040E16 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  notices_applications: {
    slug: 'notices-applications',
    titleBn: 'বিজ্ঞপ্তি, অডিট ও নাগরিক আবেদন',
    titleEn: 'Notices, Audit & Public Desk',
    accentColor: '#6D28D9',
    lightContainerStyle: {
      backgroundColor: '#F4F3FA',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(109, 40, 217, 0.08), transparent 72%), linear-gradient(180deg, #F8F7FC 0%, #ECEAF6 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#0A0B1B',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(109, 40, 217, 0.18), transparent 72%), linear-gradient(180deg, #0D0E24 0%, #060713 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  faq: {
    slug: 'faq',
    titleBn: 'সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)',
    titleEn: 'Frequently Asked Questions (FAQ)',
    accentColor: '#167D78',
    lightContainerStyle: {
      backgroundColor: '#F4F7F6',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(22, 125, 120, 0.10), transparent 72%), linear-gradient(180deg, #F8FBFA 0%, #ECF2F0 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#071318',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(22, 125, 120, 0.20), transparent 72%), linear-gradient(180deg, #09181F 0%, #050E13 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  branches: {
    slug: 'branches',
    titleBn: 'সারা বাংলাদেশে কোলাশ শাখা (৮ বিভাগ · ৬৪ জেলা)',
    titleEn: 'Nationwide Bangladesh Branches (64 Districts)',
    accentColor: '#167D78',
    lightContainerStyle: {
      backgroundColor: '#F3F7F6',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(22, 125, 120, 0.11), transparent 72%), linear-gradient(180deg, #F7FAF9 0%, #EBF2F0 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#06141A',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(22, 125, 120, 0.22), transparent 72%), linear-gradient(180deg, #081A22 0%, #050F14 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
  contact_location: {
    slug: 'contact',
    titleBn: 'যোগাযোগ, বাংলাদেশ শাখা ও অবস্থান ম্যাপ',
    titleEn: 'Contact, Branches & Location Map',
    accentColor: '#0369A1',
    lightContainerStyle: {
      backgroundColor: '#F3F6F9',
      backgroundImage: `${LIGHT_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(3, 105, 161, 0.09), transparent 72%), linear-gradient(180deg, #F7F9FC 0%, #EAEFF4 100%)`,
      backgroundSize: GRID_SIZE,
    },
    darkContainerStyle: {
      backgroundColor: '#07121C',
      backgroundImage: `${DARK_ARCH_GRID}, radial-gradient(ellipse 75% 45% at 50% 0%, rgba(3, 105, 161, 0.18), transparent 72%), linear-gradient(180deg, #091724 0%, #050D15 100%)`,
      backgroundSize: GRID_SIZE,
    },
  },
};

export function getPageTheme(category: PortalCategoryKey): PageThemeConfig {
  if (category === 'all' || category === 'home') return THEMES.home;
  if (category === 'committee_history') return THEMES.committee;
  return THEMES[category] || THEMES.home;
}

export function getPageShareContent(
  category: PortalCategoryKey,
  language: Language
): { title: string; text: string } {
  const theme = getPageTheme(category);
  const baseTitle = language === 'bn' ? `${theme.titleBn} — কোলাশ ফাউন্ডেশন` : `${theme.titleEn} — CoLASH Foundation`;

  switch (category) {
    case 'founder':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'মানবতার জন্য আলো এবং সেবার বলয়—কোলাশ ফাউন্ডেশনের প্রতিষ্ঠাতা পরিচিতি, প্রতিষ্ঠার গল্প ও আদর্শ সম্পর্কে জানুন।'
            : 'Discover the Founder profile, genesis story, and humanitarian vision of CoLASH Foundation.',
      };
    case 'committee':
    case 'committee_history':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'কোলাশ ফাউন্ডেশনের অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮ ও দায়িত্বশীল নেতৃত্বের তালিকা দেখুন।'
            : 'Meet the Approved Executive Council 2026–2028 leading CoLASH Foundation.',
      };
    case 'donate':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'মাত্র ৳১ থেকে শুরু করে যেকোনো অঙ্কের অনুদান দিন মানবতার কল্যাণে—কোলাশ ফাউন্ডেশনের স্বচ্ছ অনলাইন অনুদান পেজ ও সর্বজনীন ধর্মীয় বাণী।'
            : 'Support humanitarian relief starting from ৳1 with 100% open audit transparency at CoLASH Foundation.',
      };
    case 'members':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'কোলাশ ফাউন্ডেশনের ২৪/৭ রক্তদাতা ডিরেক্টরি ও যাচাইকৃত সাধারণ সদস্যদের তালিকা দেখুন অথবা স্বেচ্ছাসেবক হিসেবে যুক্ত হোন।'
            : 'Search verified 24/7 blood donors and general members of CoLASH Foundation.',
      };
    case 'womens_team':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'নারী নেতৃত্ব, স্বাবলম্বীকরণ ও মা-শিশু সুরক্ষায় নিবেদিত কোলাশ ফাউন্ডেশন উইমেন্স টিম উইং সম্পর্কে জানুন।'
            : 'Explore the autonomous Women’s Team Wing of CoLASH Foundation empowering women across communities.',
      };
    case 'activities':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'শিক্ষা, বন্যাত্রাণ, বিনামূল্যে স্বাস্থ্য ক্যাম্প ও কর্মসংস্থান—কোলাশ ফাউন্ডেশনের চলমান মানবিক কার্যক্রম দেখুন।'
            : 'Explore active education, flood relief, healthcare, and livelihood initiatives by CoLASH Foundation.',
      };
    case 'transparency':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'প্রতিটি টাকার ১০০% উন্মুক্ত হিসাব ও ভাউচার-ভিত্তিক অডিট লেজার—কোলাশ ফাউন্ডেশনের আর্থিক স্বচ্ছতা প্রতিবেদন দেখুন।'
            : 'Inspect 100% open financial ledger and voucher-verified audit records of CoLASH Foundation.',
      };
    case 'notices':
    case 'emergency_notice':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'কোলাশ ফাউন্ডেশনের জরুরি মানবিক বিজ্ঞপ্তি, ত্রাণ তহবিল আপডেট ও অফিসিয়াল নোটিশ দেখুন এবং শেয়ার করুন।'
            : 'Read and share urgent humanitarian relief bulletins and official notices from CoLASH Foundation.',
      };
    case 'applications':
    case 'notices_applications':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'লগইন ছাড়াই সাহায্য, শিক্ষাবৃত্তি বা পরামর্শের আবেদন করুন এবং ট্র্যাকিং আইডি দিয়ে লাইভ অবস্থা জানুন—কোলাশ ফাউন্ডেশন নাগরিক ডেস্ক।'
            : 'Submit humanitarian aid requests or feedback without login and track live status at CoLASH Foundation.',
      };
    case 'advisors':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'কোলাশ ফাউন্ডেশনের সম্মানিত উপদেষ্টামণ্ডলী ও দিকনির্দেশক ব্যক্তিত্বদের সম্পর্কে জানুন।'
            : 'Meet the Advisory Council and patrons guiding CoLASH Foundation.',
      };
    case 'faq':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'কোলাশ (CoLASH) ফাউন্ডেশন সম্পর্কে মানুষের মনে জাগা সব প্রশ্ন ও তার স্বচ্ছ উত্তর একসাথে দেখুন।'
            : 'Read clear answers to common questions about CoLASH Foundation, donations, transparency & membership.',
      };
    case 'branches':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'বাংলাদেশের ৮টি বিভাগ ও ৬৪ জেলায় কোলাশ ফাউন্ডেশনের আঞ্চলিক ও জেলা শাখা নেটওয়ার্ক দেখুন এবং আপনার এলাকায় শাখা গঠনে যুক্ত হোন।'
            : 'Explore CoLASH Foundation branches across all 8 divisions & 64 districts of Bangladesh and apply to coordinate a branch in your district.',
      };
    case 'contact_location':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'কমলগঞ্জ প্রধান কার্যালয়, সারা বাংলাদেশের শাখা নেটওয়ার্ক, গুগল ম্যাপ লোকেশন ও ২৪/৭ জরুরি হটলাইন—কোলাশ ফাউন্ডেশনের সাথে যোগাযোগ করুন।'
            : 'Find CoLASH Foundation central office, nationwide branches, Google Maps location, and 24/7 hotline.',
      };
    case 'about':
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? '০৭ মার্চ ২০২৬-এ প্রতিষ্ঠিত অরাজনৈতিক ও অসাম্প্রদায়িক মানবিক সংগঠন কোলাশ ফাউন্ডেশনের লক্ষ্য, আদর্শ ও গঠনতন্ত্র সম্পর্কে জানুন।'
            : 'Learn about the mission, charter, and non-political humanitarian ideals of CoLASH Foundation.',
      };
    default:
      return {
        title: baseTitle,
        text:
          language === 'bn'
            ? 'মানবতার জন্য আলো এবং সেবার বলয়—কোলাশ (CoLASH) ফাউন্ডেশন। শিক্ষা, ত্রাণ, চিকিৎসা ও রক্তদান সেবায় আমাদের সাথে যুক্ত হোন।'
            : 'Circle of Light and Service for Humanity — Join CoLASH Foundation in education, relief, healthcare, and blood support.',
      };
  }
}
