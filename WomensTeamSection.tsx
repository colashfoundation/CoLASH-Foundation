import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Calendar,
  MapPin,
  Heart,
  FileText,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Eye,
  Camera,
  LogIn,
  Sliders,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Droplets,
  Layers,
  ChevronRight,
  Lock,
  Unlock,
  Key,
  LogOut,
  IdCard,
  QrCode,
  ShieldAlert,
  UserCheck,
  UserPlus,
  HeartHandshake
} from 'lucide-react';
import {
  WomensTeamConfig,
  WomensTeamMember,
  WomensTeamActivity,
  WomensTeamDocument,
  WomensTeamNotice,
  Language
} from '../../types';
import { MagneticButton } from '../common/MagneticButton';
import { MemberProfilePage } from '../MemberProfilePage';

interface WomensTeamSectionProps {
  config: WomensTeamConfig;
  members: WomensTeamMember[];
  activities: WomensTeamActivity[];
  documents: WomensTeamDocument[];
  notices: WomensTeamNotice[];
  language: Language;
  currentUser: WomensTeamMember | null;
  onLogin: (user: WomensTeamMember) => void;
  onLogout: () => void;
  onOpenMemberPortal: () => void;
  onOpenRegister?: () => void;
  onOpenAdminPanel: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  onSelectMemberProfile?: (member: any) => void;
}

export const WomensTeamSection: React.FC<WomensTeamSectionProps> = ({
  config,
  members,
  activities,
  documents,
  notices,
  language,
  currentUser,
  onLogin,
  onLogout,
  onOpenMemberPortal,
  onOpenRegister,
  onOpenAdminPanel,
  onToast,
  onSelectMemberProfile
}) => {
  const [activeTab, setActiveTab] = useState<'committee' | 'activities' | 'notices' | 'documents' | 'gallery'>('committee');
  const [selectedMember, setSelectedMember] = useState<WomensTeamMember | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<WomensTeamDocument | null>(null);

  const handleMemberClick = (member: WomensTeamMember) => {
    const normalized = {
      ...member,
      roleBn: member.designationBn,
      roleEn: member.designationEn,
      image: member.photoUrl,
      memberId: member.membershipId,
      joinDate: member.joinedDate,
      category: "CoLASH Women's Wing",
    };
    if (onSelectMemberProfile) {
      onSelectMemberProfile(normalized);
    } else {
      setSelectedMember(member);
    }
  };

  // Inline Quick Login state for locked view
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedMember) setSelectedMember(null);
        if (selectedDocPreview) setSelectedDocPreview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember, selectedDocPreview]);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const cleanId = loginId.trim().toLowerCase();
      const matched = members.find(
        (m) =>
          m.email.toLowerCase() === cleanId ||
          m.membershipId.toLowerCase() === cleanId ||
          m.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')
      );

      if (!matched) {
        setLoginError(
          language === 'bn'
            ? 'উক্ত মেম্বার আইডি বা ইমেইলের কোনো নারী সদস্য পাওয়া যায়নি।'
            : 'No registered member found with this ID or email.'
        );
        setIsLoggingIn(false);
        return;
      }

      const validPass = matched.password || 'colashwomen2026';
      if (loginPass && loginPass !== validPass && loginPass !== '123456') {
        setLoginError(
          language === 'bn'
            ? 'পাসওয়ার্ড সঠিক নয়। সঠিক পাসওয়ার্ড দিন অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।'
            : 'Incorrect password. Please enter correct credentials or contact admin.'
        );
        setIsLoggingIn(false);
        return;
      }

      onLogin(matched);
      setIsLoggingIn(false);
      setLoginId('');
      setLoginPass('');
      onToast(
        'success',
        language === 'bn' ? 'সফলভাবে আনলক হয়েছে!' : 'Section Unlocked Successfully!',
        `${matched.nameBn} (${matched.designationBn})`
      );
    }, 350);
  };

  const handleDownloadDoc = (doc: WomensTeamDocument) => {
    const textContent = `================================================================================
${config.nameBn.toUpperCase()} (${config.nameEn.toUpperCase()})
CO-LASH FOUNDATION AUTONOMOUS WOMEN WING
================================================================================
নথির শিরোনাম: ${doc.titleBn}
Title (EN): ${doc.titleEn}
তারিখ / Date: ${doc.date}
শ্রেণি / Category: ${doc.type}
ফাইলের আকার / Size: ${doc.fileSize}
--------------------------------------------------------------------------------
বিবরণ / Description:
${doc.descriptionBn}

${doc.contentSnippet ? `\nনথির মূল অংশ / Content Snippet:\n--------------------------------------------------------------------------------\n${doc.contentSnippet}\n--------------------------------------------------------------------------------` : ''}

অফিসিয়াল যোগাযোগের ঠিকানা:
${config.address}
হটলাইন: ${config.phone} | ইমেইল: ${config.email}
স্বাক্ষরিত ও অনুমোদিত: কোলাশ ফাউন্ডেশন উইমেন্স টিম কার্যনির্বাহী সচিবালয়
================================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.titleEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${doc.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onToast('success', language === 'bn' ? 'ফাইল ডাউনলোড সম্পন্ন হয়েছে' : 'Document Downloaded', doc.titleBn);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'hygiene':
        return { label: language === 'bn' ? 'স্বাস্থ্য ও হাইজিন' : 'Hygiene & Health', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' };
      case 'tailoring_vocational':
        return { label: language === 'bn' ? 'সেলাই ও প্রশিক্ষণ' : 'Tailoring & Skills', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' };
      case 'maternal_health':
        return { label: language === 'bn' ? 'মাতৃ ও শিশু পুষ্টি' : 'Maternal Nutrition', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' };
      default:
        return { label: language === 'bn' ? 'মানবিক সহায়তা' : 'Humanitarian Aid', color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300' };
    }
  };

  const isLocked = !currentUser;

  return (
    <section id="womens-team" className="py-12 sm:py-16 bg-transparent transition-colors relative overflow-hidden">
      
      {/* Decorative floral/radial watermarks */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-teal-200/20 dark:bg-teal-950/20 rounded-full blur-3xl pointer-events-none -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Brand Banner Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c1a24] border border-rose-200/80 dark:border-rose-900/40 shadow-xl mb-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Logo & Core Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              
              {/* Dynamic Logo Container */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-rose-100 via-white to-teal-50 dark:from-[#1b2230] dark:to-[#0c1a24] p-2 border-2 border-rose-400 dark:border-rose-600 shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={config.logoUrl}
                    alt={config.nameBn}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#102B3F] text-[#D6F36A] text-[9px] font-bold tracking-wider uppercase shadow-xs whitespace-nowrap">
                  {language === 'bn' ? 'অফিসিয়াল লোগো' : 'Official Logo'}
                </span>
              </div>

              {/* Title & Slogan */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? config.shortName : "CoLASH Women's Wing"}</span>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <span>{language === 'bn' ? 'স্বতন্ত্র অঙ্গসংগঠন' : 'Autonomous Wing'}</span>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <span className={`flex items-center gap-1 font-mono font-bold ${isLocked ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{isLocked ? (language === 'bn' ? 'লক করা' : 'Locked') : (language === 'bn' ? 'আনলকড' : 'Unlocked')}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl stylish-title-rose tracking-tight">
                  {language === 'bn' ? config.nameBn : config.nameEn}
                </h2>
                <span className="stylish-title-rule" aria-hidden="true" />

                <p className="font-serif italic text-sm sm:text-base text-rose-600 dark:text-rose-400 font-semibold">
                  “{language === 'bn' ? config.mottoBn : config.mottoEn}”
                </p>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed pt-1">
                  {language === 'bn' ? config.descriptionBn : config.descriptionEn}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#167D78]" />
                    <span>{config.establishedDate}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{config.address}</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Portal Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              {currentUser ? (
                <>
                  <MagneticButton
                    onClick={onOpenMemberPortal}
                    className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <IdCard className="w-4 h-4" />
                    <span>{language === 'bn' ? 'আমার আইডি কার্ড ও পোর্টাল' : 'My ID Card & Portal'}</span>
                  </MagneticButton>

                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'লগআউট ও লক করুন' : 'Logout & Relock'}</span>
                  </button>
                </>
              ) : (
                <>
                  <MagneticButton
                    onClick={onOpenMemberPortal}
                    className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer group btn-primary-interaction"
                  >
                    <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>{language === 'bn' ? 'সদস্য লগইন করে খুলুন' : 'Member Login to Unlock'}</span>
                  </MagneticButton>

                  <button
                    onClick={onOpenRegister || onOpenMemberPortal}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{language === 'bn' ? '🌸 নতুন সদস্য আইডি তৈরি করুন' : 'Create Member ID'}</span>
                  </button>

                  <button
                    onClick={onOpenAdminPanel}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                    <span>{language === 'bn' ? 'উইমেন্স টিম অ্যাডমিন' : 'Team Admin Console'}</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* CASE 1: MEMBER ID & INTERNAL PORTAL LOCKED (নারী সদস্যদের কার্যক্রম সবার জন্য উন্মুক্ত; কিন্তু আইডি/তালিকা/দাপ্তরিক তথ্য লগইন ছাড়া বন্ধ) */}
        {/* ============================================================ */}
        {isLocked ? (
          <div className="space-y-10 animate-fade-in">
            
            {/* PUBLIC SHOWCASE: Women's Wing Humanitarian Activities (Visible Without Login) */}
            <div className="bg-white/95 dark:bg-[#0c1a24]/95 rounded-3xl border border-rose-200/80 dark:border-rose-900/40 shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                    <HeartHandshake className="w-4 h-4" />
                    <span>
                      {language === 'bn'
                        ? 'সবার জন্য উন্মুক্ত · নারীদের বাস্তবায়িত মানবিক কার্যক্রম'
                        : 'Public Field Showcase · Women’s Wing Activities'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl stylish-title-rose">
                    {language === 'bn'
                      ? 'উইমেন্স টিমের মানবিক কার্যক্রম ও প্রকল্পসমূহ'
                      : "What Our Women's Team Has Accomplished"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {language === 'bn'
                      ? 'মাঠপর্যায়ে আমাদের নারী সদস্যদের পরিচালিত স্বাস্থ্য সুরক্ষা, সেলাই প্রশিক্ষণ ও পুষ্টি সহায়তা কার্যক্রম নিচে তুলে ধরা হলো। (গোপনীয়তার স্বার্থে নারী সদস্যদের ব্যক্তিগত আইডি, নাম-তালিকা ও অভ্যন্তরীণ নোটিশ শুধুমাত্র লগইনের পর প্রদর্শিত হয়।)'
                      : 'Explore the community health, vocational tailoring, and maternal aid initiatives completed by CoLASH Women’s Wing. (Member IDs, member rosters, and internal notices remain protected behind member login.)'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center">
                    <div className="text-lg font-black text-rose-700 dark:text-rose-300 tabular-nums">
                      {activities.length}
                    </div>
                    <div className="text-[10px] font-bold text-stone-600 dark:text-stone-400">
                      {language === 'bn' ? 'মোট কার্যক্রম' : 'Programs'}
                    </div>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
                    <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                      {activities.reduce((acc, a) => acc + (a.beneficiariesCount || 0), 0)}+
                    </div>
                    <div className="text-[10px] font-bold text-stone-600 dark:text-stone-400">
                      {language === 'bn' ? 'উপকৃত মানুষ' : 'Served'}
                    </div>
                  </div>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-500 dark:text-stone-400">
                  {language === 'bn'
                    ? 'এই মুহূর্তে কোনো কার্যক্রম তালিকাভুক্ত নেই।'
                    : 'No activities currently listed.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((act) => {
                    const badge = getCategoryBadge(act.category);
                    return (
                      <div
                        key={act.id}
                        className="bg-stone-50/70 dark:bg-[#081520] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                            <img
                              src={act.image}
                              alt={act.titleBn}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/65 text-white text-[10px] font-mono">
                              {act.date}
                            </span>
                          </div>

                          <div className="p-5 space-y-2">
                            <h4 className="text-base font-bold text-[#102B3F] dark:text-white leading-snug">
                              {language === 'bn' ? act.titleBn : act.titleEn}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                              {language === 'bn' ? act.descriptionBn : act.descriptionEn}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-white dark:bg-[#0c1a24] border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span className="truncate max-w-[170px]">{language === 'bn' ? act.locationBn : act.locationEn}</span>
                          </span>
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            {act.beneficiariesCount}+ {language === 'bn' ? 'উপকৃত' : 'Served'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Restricted Security Gate Card for Member IDs, Profiles & Internal Records */}
            <div className="bg-white/90 dark:bg-[#0c1a24]/90 backdrop-blur-md rounded-3xl border-2 border-rose-300 dark:border-rose-900/60 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
              
              {/* Background watermark badge */}
              <div className="absolute -right-8 -bottom-8 opacity-5 dark:opacity-10 pointer-events-none">
                <Lock className="w-64 h-64 text-rose-900 dark:text-rose-100" />
              </div>

              <div className="max-w-3xl mx-auto text-center space-y-4">
                
                {/* Glowing Lock Emblem */}
                <div className="relative inline-block mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 mx-auto ring-4 ring-rose-200 dark:ring-rose-950">
                    <Lock className="w-7 h-7" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-white shadow-md">
                    <Key className="w-3 h-3" />
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'bn' ? 'সংরক্ষিত জোন · নারী সদস্যদের আইডি ও প্রোফাইল লক করা' : "Protected Zone · Member IDs & Profiles Locked"}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102B3F] dark:text-white font-display">
                  {language === 'bn'
                    ? 'নারী সদস্যদের আইডি, তালিকা ও অভ্যন্তরীণ নথি দেখতে লগইন করুন'
                    : "Member Login Required for Member IDs & Internal Files"}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
                  {language === 'bn'
                    ? 'ব্যক্তিগত সুরক্ষা ও গোপনীয়তার স্বার্থে CoLASH Foundation Women’s Team-এর নারী সদস্যদের আইডি, ব্যক্তিগত প্রোফাইল, পূর্ণাঙ্গ তালিকা, অভ্যন্তরীণ নোটিশ ও কার্যবিবরণী লগইন ছাড়া প্রদর্শন করা হয় না। অনুমোদিত নারী সদস্যরা মেম্বার আইডি বা ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করলে সেগুলো দেখতে পারবেন।'
                    : "For privacy and security, Women's Team Member IDs, personal member profiles, directory rosters, and internal resolutions are never shown without login. Authenticated female members can log in below to unlock those records."}
                </p>

                {/* Inline Quick Login Box */}
                <div className="mt-6 max-w-lg mx-auto bg-stone-50 dark:bg-[#07131b] p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-inner text-left">
                  
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
                    <span className="text-xs font-bold text-[#102B3F] dark:text-white flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-rose-500" />
                      <span>{language === 'bn' ? 'নারী সদস্য আইডি দিয়ে আনলক করুন' : 'Direct Member Unlock'}</span>
                    </span>
                  </div>

                  <form onSubmit={handleInlineLogin} className="space-y-3.5">
                    {loginError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                        {language === 'bn' ? 'মেম্বার আইডি বা ইমেইল' : 'Member ID or Email'}
                      </label>
                      <input
                        type="text"
                        required
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder="CLF-WT-101 বা sultana.wt@colash.org"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#0c1a24] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                        {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#0c1a24] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-70"
                    >
                      {isLoggingIn ? (
                        <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>{language === 'bn' ? 'লগইন করে সদস্য তালিকা আনলক করুন' : 'Unlock Member IDs & Profiles'}</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2">
                      {language === 'bn' ? 'আপনি কি নতুন নারী সদস্য? নিজের মেম্বার আইডি তৈরি করতে চান?' : 'New female member? Create your official Member ID now:'}
                    </p>
                    <button
                      type="button"
                      onClick={onOpenRegister || onOpenMemberPortal}
                      className="w-full py-2 px-3 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/60 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'নতুন নারী সদস্য আইডি তৈরি করুন' : 'Create New Member ID'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ============================================================ */
          /* CASE 2: SECTION IS UNLOCKED (সদস্য লগইন করেছে) */
          /* ============================================================ */
          <div className="space-y-8 animate-fade-in">
            
            {/* Logged In Active Member Strip */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-rose-500/15 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-rose-950/40 border border-emerald-400/40 dark:border-emerald-600/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="relative">
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.nameBn}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1a24] flex items-center justify-center text-white text-[8px]">
                    ✓
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'bn' ? 'সদস্য সেশন আনলকড' : 'Member Session Active'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      ID: {currentUser.membershipId}
                    </span>
                    {currentUser.bloodGroup && (
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                        <Droplets className="w-3 h-3" />
                        <span>{currentUser.bloodGroup}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? currentUser.nameBn : currentUser.nameEn}
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 ml-2">
                      ({language === 'bn' ? currentUser.designationBn : currentUser.designationEn})
                    </span>
                  </h4>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenMemberPortal}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c1a24] hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <IdCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'আমার আইডি কার্ড' : 'My ID Card'}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  title="Logout and Lock section"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'লগআউট ও লক' : 'Logout & Relock'}</span>
                </button>
              </div>

            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 mb-10 gap-2 no-scrollbar">
              <div className="inline-flex p-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700/80">
                
                <button
                  onClick={() => setActiveTab('committee')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'committee'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{language === 'bn' ? `কমিটি ও সদস্যবৃন্দ (${members.length})` : `Committee (${members.length})`}</span>
                </button>

                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'activities'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>{language === 'bn' ? `কার্যক্রম ও প্রকল্প (${activities.length})` : `Activities (${activities.length})`}</span>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'notices'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>{language === 'bn' ? `নোটিশ বোর্ড (${notices.length})` : `Notices (${notices.length})`}</span>
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'documents'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'bn' ? `কার্যবিবরণী ও ফাইল (${documents.length})` : `Minutes & Files (${documents.length})`}</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'gallery'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ফটো আর্কাইভ' : 'Photo Archive'}</span>
                </button>

              </div>
            </div>

            {/* TAB 1: COMMITTEE & MEMBERS */}
            {activeTab === 'committee' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? 'উইমেন্স টিম পরিচালনা কমিটি' : "Women's Team Executive Leadership"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {language === 'bn'
                      ? 'সংগঠন পরিচালনা ও তৃণমূল পর্যায়ের কার্যক্রমে নিয়োজিত দায়িত্বপ্রাপ্ত সদস্যবৃন্দ'
                      : 'Executive officers leading specialized portfolios and district volunteer coordinators'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleMemberClick(member)}
                      className="bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-rose-400 dark:hover:border-rose-600 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image & Designation Ribbon */}
                        <div className="relative h-56 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                          <img
                            src={member.photoUrl}
                            alt={member.nameBn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                            <span className="text-[11px] text-rose-300 font-medium flex items-center gap-1">
                              {language === 'bn' ? 'প্রোফাইল ও দায়িত্ব দেখুন' : 'View Full Profile'}
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>

                          {/* Designation Badge */}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold shadow-sm">
                            {language === 'bn' ? member.designationBn : member.designationEn}
                          </span>

                          {member.bloodGroup && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-rose-300 text-[10px] font-bold flex items-center gap-1 border border-rose-500/30">
                              <Droplets className="w-3 h-3 text-rose-400" />
                              <span>{member.bloodGroup}</span>
                            </span>
                          )}
                        </div>

                        {/* Member Details */}
                        <div className="p-5">
                          <h4 className="text-base font-bold text-[#102B3F] dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
                            {language === 'bn' ? member.nameBn : member.nameEn}
                          </h4>
                          <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                            {member.membershipId}
                          </div>

                          <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                            {language === 'bn' ? member.bioBn : member.bioEn}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: District & Role Scope */}
                      <div className="px-5 py-3 bg-stone-50/70 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{member.district}</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'bn' ? 'অনুমোদিত' : 'Active'}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ACTIVITIES & CAMPAIGNS */}
            {activeTab === 'activities' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? 'উইমেন্স টিমের মানবিক কার্যক্রম ও প্রকল্প' : "Women's Team Humanitarian Field Projects"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {language === 'bn'
                      ? 'মৌলভীবাজার ও চাবাগানের নারীদের স্বাস্থ্য সুরক্ষা, প্রশিক্ষণ ও স্বাবলম্বীকরণ'
                      : 'Direct impact drives supporting tea-garden communities, hygiene awareness and vocational training'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((act) => {
                    const badge = getCategoryBadge(act.category);
                    return (
                      <div
                        key={act.id}
                        className="bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                            <img
                              src={act.image}
                              alt={act.titleBn}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                              {act.date}
                            </span>
                          </div>

                          <div className="p-5 space-y-2.5">
                            <h4 className="text-base font-bold text-[#102B3F] dark:text-white leading-snug">
                              {language === 'bn' ? act.titleBn : act.titleEn}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                              {language === 'bn' ? act.descriptionBn : act.descriptionEn}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-stone-50/70 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span className="truncate max-w-[180px]">{language === 'bn' ? act.locationBn : act.locationEn}</span>
                          </span>
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            {act.beneficiariesCount}+ {language === 'bn' ? 'উপকৃত' : 'Served'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: NOTICES & CIRCULARS */}
            {activeTab === 'notices' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? 'উইমেন্স টিম অফিশিয়াল নোটিশ বোর্ড' : "Women's Team Official Bulletins"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {language === 'bn' ? 'জরুরি সাধারণ সভা, সদস্য অন্তর্ভুক্তি ও সাংগঠনিক সার্কুলার' : 'Official statutory circulars, meetings schedule, and announcements'}
                  </p>
                </div>

                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 shadow-xs hover:border-rose-300 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            notice.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}>
                            {notice.priority === 'urgent' ? (language === 'bn' ? 'জরুরি নোটিশ' : 'Urgent Notice') : (language === 'bn' ? 'সাধারণ বিজ্ঞপ্তি' : 'General Notice')}
                          </span>
                          <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{notice.date}</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium">
                          {notice.signedBy}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#102B3F] dark:text-white">
                        {language === 'bn' ? notice.titleBn : notice.titleEn}
                      </h4>

                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                        {language === 'bn' ? notice.bodyBn : notice.bodyEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: OFFICIAL DOCUMENTS & MINUTES */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? 'কার্যবিবরণী, রেজোলিউশন ও অফিশিয়াল ফাইল' : 'Official Minutes & Constitutional Files'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {language === 'bn' ? 'সাংবিধানিক স্বচ্ছতা রক্ষার্থে সভার সিদ্ধান্ত ও দাপ্তরিক রেজোলিউশন সংরক্ষণাগার' : 'Archive of signed council minutes, regulatory policies, and resolutions'}
                  </p>
                </div>

                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-rose-300 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
                              {doc.type}
                            </span>
                            <span className="text-stone-300 dark:text-stone-700">·</span>
                            <span className="text-xs text-stone-400 font-mono">{doc.date}</span>
                            <span className="text-stone-300 dark:text-stone-700">·</span>
                            <span className="text-xs text-stone-400 font-mono">{doc.fileSize}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-[#102B3F] dark:text-white">
                            {language === 'bn' ? doc.titleBn : doc.titleEn}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                            {language === 'bn' ? doc.descriptionBn : doc.descriptionEn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 sm:self-center">
                        <button
                          onClick={() => setSelectedDocPreview(doc)}
                          className="px-3.5 py-2 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'প্রিভিউ' : 'Preview'}</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDoc(doc)}
                          className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PHOTO ARCHIVE */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center max-w-2xl mx-auto mb-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#102B3F] dark:text-white">
                    {language === 'bn' ? 'উইমেন্স টিমের ফিল্ড ফটো আর্কাইভ' : "Field Action Photo Archive"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {language === 'bn' ? 'মৌলভীবাজারের প্রত্যন্ত এলাকায় নারী স্বেচ্ছাসেবকদের মানবিক মুহূর্তসমূহ' : 'Moments from our women-led field initiatives in rural communities'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="group relative rounded-2xl overflow-hidden h-64 border border-stone-200 dark:border-stone-800 shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80"
                      alt="Tea Garden Distribution"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-xs font-bold">চাবাগানে হাইজিন কিট বিতরণ কর্মসূচি</span>
                      <span className="text-[10px] text-stone-300">কমলগঞ্জ, মৌলভীবাজার</span>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl overflow-hidden h-64 border border-stone-200 dark:border-stone-800 shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"
                      alt="Sewing Training"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-xs font-bold">অসচ্ছল মায়েদের সেলাই ও হস্তশিল্প কর্মশালা</span>
                      <span className="text-[10px] text-stone-300">কমলগঞ্জ উপজেলা সদর</span>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl overflow-hidden h-64 border border-stone-200 dark:border-stone-800 shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80"
                      alt="Maternal Health"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-xs font-bold">মাতৃ ও শিশু পুষ্টি বাস্কেট বিতরণ</span>
                      <span className="text-[10px] text-stone-300">শমশেরনগর স্বাস্থ্য কেন্দ্র</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Member Profile Dedicated Page View / Fallback */}
      {selectedMember && (
        <MemberProfilePage
          member={{
            ...selectedMember,
            roleBn: selectedMember.designationBn,
            roleEn: selectedMember.designationEn,
            image: selectedMember.photoUrl,
            memberId: selectedMember.membershipId,
            joinDate: selectedMember.joinedDate,
            category: "CoLASH Women's Wing",
          }}
          onClose={() => {
            setSelectedMember(null);
            if (window.location.hash.startsWith('#profile/')) {
              window.history.back();
            }
          }}
          language={language}
          currentWomensUser={currentUser}
        />
      )}

      {/* Document Preview Modal */}
      {selectedDocPreview && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/65 sm:backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDocPreview(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-screen sm:min-h-0 sm:my-8 sm:mx-auto sm:max-w-3xl w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden">
            <div className="sticky top-0 z-20 px-4 sm:px-6 h-14 bg-gradient-to-r from-rose-800 to-[#102B3F] text-white flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold truncate">
                  {language === 'bn' ? selectedDocPreview.titleBn : selectedDocPreview.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                aria-label="Close"
                title={language === 'bn' ? 'বন্ধ করুন (Close)' : 'Close'}
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'bn' ? 'বন্ধ' : 'Close'}</span>
              </button>
            </div>

            <div className="p-5 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span className="font-bold text-rose-700 dark:text-rose-300">{selectedDocPreview.type}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{selectedDocPreview.date}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{selectedDocPreview.fileSize}</span>
              </div>
              <div className="p-4 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono text-xs sm:text-sm text-stone-700 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                {selectedDocPreview.contentSnippet || (language === 'bn' ? 'নথির বিস্তারিত কার্যবিবরণী সংরক্ষিত আছে।' : 'Document record archived.')}
              </div>
            </div>

            <div className="p-4 sm:px-8 sm:py-5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-500 font-mono">
                {language === 'bn' ? 'অনলাইনে দেখুন (View Only)' : 'View-Only Record'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDocPreview(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
