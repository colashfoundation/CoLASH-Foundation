import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  X,
  User,
  Search,
  ScanLine,
  ChevronDown,
  Users,
  Award,
  Droplets,
  FileCheck2,
  Crown,
  HelpCircle,
  MapPin,
  Link2
} from 'lucide-react';
import { Language, ThemeMode, WebsiteCustomConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MagneticButton } from './common/MagneticButton';
import { containsRegistrationClaim } from '../utils/configSanitizer';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  onOpenDonate: () => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
  onOpenScanner?: () => void;
  onOpenLinkImporter?: () => void;
  pendingSocialNewsCount?: number;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  websiteConfig?: WebsiteCustomConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  theme,
  toggleTheme,
  onOpenDonate,
  onOpenPortal,
  onOpenAdmin,
  onOpenSearch,
  onOpenScanner,
  onOpenLinkImporter,
  pendingSocialNewsCount = 0,
  activeSection,
  onNavigateSection,
  websiteConfig
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [directoryMenuOpen, setDirectoryMenuOpen] = useState(false);
  const directoryRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Primary streamlined links visible directly in top bar
  const primaryNavLinks = [
    { id: 'home', label: language === 'bn' ? 'হোম' : 'Home' },
    { id: 'about', label: language === 'bn' ? 'পরিচিতি' : 'About' },
    { id: 'activities', label: language === 'bn' ? 'কার্যক্রম' : 'Activities' },
    { id: 'womens-team', label: language === 'bn' ? 'উইমেন্স টিম' : "Women's Team" },
    { id: 'notices_applications', label: language === 'bn' ? 'বিজ্ঞপ্তি ও আবেদন' : 'Notices & Desk' },
    { id: 'contact', label: language === 'bn' ? 'যোগাযোগ' : 'Contact' },
  ];

  // Organized leadership & governance submenu items
  const directoryLinks = [
    {
      id: 'founder',
      label: language === 'bn' ? 'প্রতিষ্ঠাতা পরিচিতি ও দর্শন' : 'Founder Profile & Vision',
      subBn: 'কোলাশ ফাউন্ডেশনের স্বপ্নদ্রষ্টা ও ইতিহাস',
      subEn: 'Founder Story & Founding Charter',
      icon: Crown,
    },
    {
      id: 'committee',
      label: language === 'bn' ? 'কার্যনির্বাহী কমিটি (২০২৬–২০২৮)' : 'Executive Committee (2026–2028)',
      subBn: 'সভাপতি ও অনুমোদিত কেন্দ্রীয় পরিষদ',
      subEn: 'President & Approved Executive Council',
      icon: Users,
    },
    {
      id: 'members',
      label: language === 'bn' ? 'সাধারণ সদস্য ও রক্তদাতা' : 'Members & Blood Bank',
      subBn: 'রক্তের গ্রুপ ভিত্তিক অনুসন্ধান',
      subEn: 'Blood Group Directory',
      icon: Droplets,
    },
    {
      id: 'advisors',
      label: language === 'bn' ? 'উপদেষ্টামণ্ডলী' : 'Advisory Council',
      subBn: 'সম্মানিত উপদেষ্টা ও পৃষ্ঠপোষক',
      subEn: 'Patrons & Advisors',
      icon: Award,
    },
    {
      id: 'transparency',
      label: language === 'bn' ? 'আর্থিক স্বচ্ছতা ও অডিট' : 'Financial Audit Ledger',
      subBn: '১০০% উন্মুক্ত আয়-ব্যয় হিসাব',
      subEn: '100% Open Audit Ledger',
      icon: FileCheck2,
    },
    {
      id: 'branches',
      label: language === 'bn' ? 'সারা বাংলাদেশে শাখা (৬৪ জেলা)' : 'Bangladesh Branches (64 Districts)',
      subBn: '৮টি বিভাগ ও ৬৪ জেলায় শাখা নেটওয়ার্ক',
      subEn: 'Nationwide Division & District Network',
      icon: MapPin,
    },
    {
      id: 'faq',
      label: language === 'bn' ? 'সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)' : 'Frequently Asked Questions',
      subBn: 'কোলাশ সম্পর্কে মানুষের সকল প্রশ্নের উত্তর',
      subEn: 'Clear answers about CoLASH Foundation',
      icon: HelpCircle,
    },
  ];

  // Full flat list for mobile drawer
  const allMobileLinks = [
    { id: 'home', label: language === 'bn' ? 'হোম' : 'Home' },
    { id: 'donate', label: language === 'bn' ? 'অনুদান (৳১ থেকে)' : 'Donate (From ৳1)' },
    { id: 'founder', label: language === 'bn' ? 'প্রতিষ্ঠাতা পরিচিতি' : 'Founder' },
    { id: 'committee', label: language === 'bn' ? 'কমিটি (২০২৬–২০২৮)' : 'Committee (2026–28)' },
    { id: 'about', label: language === 'bn' ? 'পরিচিতি' : 'About' },
    { id: 'advisors', label: language === 'bn' ? 'উপদেষ্টামণ্ডলী' : 'Advisors' },
    { id: 'members', label: language === 'bn' ? 'সদস্যবৃন্দ ও রক্তদাতা' : 'Members & Blood' },
    { id: 'womens-team', label: language === 'bn' ? 'উইমেন্স টিম' : "Women's Team" },
    { id: 'activities', label: language === 'bn' ? 'কার্যক্রম ও প্রজেক্ট' : 'Activities' },
    { id: 'transparency', label: language === 'bn' ? 'স্বচ্ছতা ও অডিট' : 'Transparency' },
    { id: 'notices', label: language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notices' },
    { id: 'applications', label: language === 'bn' ? 'নাগরিক আবেদন' : 'Applications' },
    { id: 'branches', label: language === 'bn' ? 'সারাদেশে শাখা (৬৪ জেলা)' : 'Branches (64 Dist.)' },
    { id: 'faq', label: language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'FAQ & Answers' },
    { id: 'contact', label: language === 'bn' ? 'যোগাযোগ ও ম্যাপ' : 'Contact & Map' },
  ];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (directoryRef.current && !directoryRef.current.contains(e.target as Node)) {
        setDirectoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isLinkActive = (id: string) => {
    if (activeSection === id) return true;
    if (id === 'committee-history' && (activeSection === 'committee_history' || activeSection === 'committee-history')) return true;
    if (id === 'womens-team' && (activeSection === 'womens_team' || activeSection === 'womens-team')) return true;
    if (id === 'contact' && (activeSection === 'contact_location' || activeSection === 'contact')) return true;
    if (id === 'notices_applications' && (activeSection === 'notices_applications' || activeSection === 'notices-applications')) return true;
    return false;
  };

  const isDirectoryActive = ['founder', 'committee', 'committee_history', 'committee-history', 'advisors', 'members', 'transparency', 'branches', 'faq'].includes(activeSection);

  const topUtilityBadge = (() => {
    const raw = websiteConfig
      ? language === 'bn'
        ? websiteConfig.heroBadgeBn
        : websiteConfig.heroBadgeEn
      : t.heroBadge;
    if (!raw || containsRegistrationClaim(raw)) {
      return t.heroBadge;
    }
    return raw;
  })();

  return (
    <>
      {/* Top Institutional Utility Bar (Compact single strip) */}
      <div className="no-print bg-[#102B3F] text-[#F5F3ED] text-[10px] sm:text-[11px] py-1 px-3 sm:px-6 border-b border-[#167D78]/30 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="font-medium truncate text-stone-200">
              {topUtilityBadge}
            </span>
            <span className="hidden md:inline text-white/25">·</span>
            <a
              href={`tel:${(websiteConfig?.hotline || '01646-475348').replace(/[^0-9+]/g, '')}`}
              className="hidden md:inline-flex items-center gap-1 font-mono text-[#D6F36A] hover:underline shrink-0"
            >
              <span>{language === 'bn' ? 'জরুরি হটলাইন:' : 'Hotline:'} {websiteConfig?.hotline || '01646-475348'}</span>
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[10px] sm:text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 pr-1 border-r border-white/20">
              <a
                href={websiteConfig?.facebookUrl || "https://www.facebook.com/CoLASHFoundation"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-[#1877F2] transition-colors p-0.5"
                title="Facebook: CoLASHFoundation"
                aria-label="Facebook"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={websiteConfig?.instagramUrl || "https://www.instagram.com/colashfoundation"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-[#E4405F] transition-colors p-0.5"
                title="Instagram: colashfoundation"
                aria-label="Instagram"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <button
              onClick={onOpenAdmin}
              className="hover:text-[#D6F36A] transition-colors flex items-center gap-1 cursor-pointer btn-icon-interaction"
              title="Foundation Governance"
            >
              <ShieldCheck className="w-3 h-3 text-[#D6F36A]" />
              <span className="hidden sm:inline">{t.btnAdmin}</span>
              {pendingSocialNewsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold leading-tight">
                  {pendingSocialNewsCount}
                </span>
              )}
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 hover:text-[#D6F36A] transition-colors cursor-pointer font-medium btn-icon-interaction"
              aria-label="Switch language"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={toggleTheme}
              className="hover:text-[#D6F36A] transition-colors cursor-pointer p-0.5 btn-icon-interaction"
              aria-label="Toggle dark/light theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header: Sleek, High-Contrast & Space-Efficient */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#081520]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-700/80 shadow-xs transition-colors w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-11 sm:h-14 flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Zone 1: Stylish High-Contrast Editorial Brand Lockup */}
          <button
            onClick={() => onNavigateSection('home')}
            className="flex items-center gap-2.5 min-w-0 shrink-0 group text-left cursor-pointer"
          >
            <img
              src={websiteConfig?.logoUrl || '/assets/images/colash_official_logo_1792483287868.jpg'}
              alt="CoLASH Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg shrink-0 group-hover:scale-105 transition-transform bg-white p-0.5 border border-[#167D78]/30 dark:border-stone-600 shadow-xs"
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-brand text-[16px] sm:text-[18px] xl:text-[20px] font-extrabold tracking-tight text-[#0B2236] dark:text-white whitespace-nowrap leading-tight"
                style={{
                  textShadow:
                    theme === 'dark'
                      ? '0 1px 4px rgba(0, 0, 0, 0.75)'
                      : 'none',
                }}
              >
                {websiteConfig ? (language === 'bn' ? websiteConfig.siteTitleBn : websiteConfig.siteTitleEn) : 'CoLASH Foundation'}
              </span>
              <span className="hidden sm:block text-[9px] font-bold tracking-[0.14em] uppercase text-[#167D78] dark:text-[#D6F36A]/90 mt-0.5">
                {language === 'bn' ? 'মানবতার জন্য আলো ও সেবার বলয়' : 'Light & Service for Humanity'}
              </span>
            </div>
          </button>

          {/* Zone 2: Clean Streamlined Desktop Navigation + Organized Directory Dropdown */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13px] font-bold text-stone-700 dark:text-stone-200">
            {primaryNavLinks.slice(0, 2).map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigateSection(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative cursor-pointer ${
                  isLinkActive(link.id)
                    ? 'text-[#167D78] dark:text-[#D6F36A]'
                    : 'text-stone-600 dark:text-stone-300 hover:text-[#167D78] dark:hover:text-[#D6F36A]'
                }`}
              >
                <span>{link.label}</span>
                {isLinkActive(link.id) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#167D78] dark:bg-[#D6F36A] rounded-full" />
                )}
              </button>
            ))}

            {/* Committee & Directory Popover Menu */}
            <div ref={directoryRef} className="relative">
              <button
                type="button"
                onClick={() => setDirectoryMenuOpen(!directoryMenuOpen)}
                className={`flex items-center gap-1 whitespace-nowrap shrink-0 py-1.5 relative cursor-pointer transition-colors ${
                  isDirectoryActive || directoryMenuOpen
                    ? 'text-[#167D78] dark:text-[#D6F36A]'
                    : 'text-stone-600 dark:text-stone-300 hover:text-[#167D78] dark:hover:text-[#D6F36A]'
                }`}
              >
                <span>{language === 'bn' ? 'কমিটি ও ডিরেক্টরি' : 'Governance & People'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${directoryMenuOpen ? 'rotate-180' : ''}`} />
                {isDirectoryActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#167D78] dark:bg-[#D6F36A] rounded-full" />
                )}
              </button>

              {directoryMenuOpen && (
                <div className="absolute left-0 top-full mt-2.5 w-72 rounded-2xl bg-white dark:bg-[#0e1f2b] border border-stone-200 dark:border-stone-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {directoryLinks.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setDirectoryMenuOpen(false);
                          onNavigateSection(item.id);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#167D78]/10 dark:bg-[#167D78]/25 text-[#167D78] dark:text-[#D6F36A]'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800/70 text-[#102B3F] dark:text-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 text-[#167D78] dark:text-[#D6F36A] mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-snug">{item.label}</div>
                          <div className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                            {language === 'bn' ? item.subBn : item.subEn}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {primaryNavLinks.slice(2).map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigateSection(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1.5 relative cursor-pointer ${
                  isLinkActive(link.id)
                    ? 'text-[#167D78] dark:text-[#D6F36A]'
                    : 'text-stone-600 dark:text-stone-300 hover:text-[#167D78] dark:hover:text-[#D6F36A]'
                }`}
              >
                <span>{link.label}</span>
                {isLinkActive(link.id) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#167D78] dark:bg-[#D6F36A] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Focused Functional Utilities & Primary CTA */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onOpenSearch}
              className="hidden sm:inline-flex p-1.5 text-stone-600 dark:text-stone-300 hover:text-[#167D78] dark:hover:text-[#D6F36A] hover:bg-stone-100 dark:hover:bg-stone-800/60 rounded-lg transition-colors cursor-pointer btn-icon-interaction"
              aria-label="Search causes and reports"
              title={language === 'bn' ? 'তথ্য অনুসন্ধান করুন' : 'Search causes and members'}
            >
              <Search className="w-4 h-4" />
            </button>

            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#102B3F] dark:text-[#D6F36A] hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label={language === 'bn' ? 'ক্যামেরা দিয়ে আইডি স্ক্যান' : 'Scan ID with Camera'}
                title={language === 'bn' ? 'ক্যামেরা দিয়ে সদস্য আইডি স্ক্যান ও যাচাই করুন' : 'Scan member ID QR with camera'}
              >
                <ScanLine className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                <span className="hidden md:inline">{language === 'bn' ? 'ID স্ক্যান' : 'Scan ID'}</span>
              </button>
            )}

            {onOpenLinkImporter && (
              <button
                type="button"
                onClick={onOpenLinkImporter}
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#102B3F] dark:text-[#D6F36A] hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label={language === 'bn' ? 'লিংক থেকে পোস্ট বা নিউজ যুক্ত করুন' : 'Add Post or News via Link'}
                title={language === 'bn' ? 'পেইজ বা নিউজের লিংক পেস্ট করে পোস্ট যুক্ত করুন' : 'Paste any social or news link to submit'}
              >
                <Link2 className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                <span className="hidden xl:inline">{language === 'bn' ? 'লিংক' : 'Link'}</span>
              </button>
            )}

            <button
              onClick={onOpenPortal}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#102B3F] dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-[#167D78] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 btn-outline-interaction"
            >
              <User className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
              <span>{t.navPortal}</span>
            </button>

            <MagneticButton
              onClick={onOpenDonate}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-white bg-[#167D78] hover:bg-[#102B3F] dark:hover:bg-[#135955] rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap shrink-0 btn-primary-interaction"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#D6F36A]" />
              <span className="hidden sm:inline">{t.btnDonate}</span>
            </MagneticButton>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer btn-icon-interaction"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#0c1a24] border-b border-stone-200 dark:border-stone-800 px-4 py-4 shadow-xl transition-all w-full">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700 dark:text-stone-200">
              {allMobileLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateSection(link.id);
                  }}
                  className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isLinkActive(link.id)
                      ? 'bg-[#167D78]/10 text-[#167D78] dark:text-[#D6F36A] font-bold'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="pt-3 mt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#102B3F] dark:text-stone-100 bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'স্মার্ট সার্চ' : 'Search'}</span>
                </button>
                {onOpenScanner && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenScanner();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#102B3F] dark:text-[#D6F36A] bg-[#D6F36A]/35 dark:bg-[#167D78]/25 border border-[#167D78]/30 rounded-lg cursor-pointer"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'QR / ID স্ক্যান' : 'Scan ID'}</span>
                  </button>
                )}
              </div>
              {onOpenLinkImporter && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLinkImporter();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#102B3F] dark:text-[#D6F36A] bg-[#167D78]/10 dark:bg-[#167D78]/25 border border-[#167D78]/30 rounded-lg cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'লিংক দিয়ে পোস্ট / নিউজ যুক্ত করুন' : 'Add Post / News via Link'}</span>
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPortal();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#102B3F] dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-lg"
                >
                  <User className="w-4 h-4 text-[#167D78]" />
                  <span>{t.navPortal}</span>
                </button>
                <MagneticButton
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDonate();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-[#167D78] rounded-lg shadow btn-primary-interaction"
                >
                  <Heart className="w-4 h-4 fill-current text-[#D6F36A]" />
                  <span>{t.btnDonate}</span>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
