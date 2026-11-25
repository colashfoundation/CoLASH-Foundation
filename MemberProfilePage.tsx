import React, { useEffect, useState, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  ArrowLeft,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  Droplet,
  Mail,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Printer,
  QrCode,
  UserCheck,
  HeartHandshake,
  Download,
  Lock,
  LogIn,
  Edit3
} from 'lucide-react';
import { AdminUser, GeneralMember, Language, MemberPositionHistory, WomensTeamMember } from '../types';
import { MemberVerificationModal } from './common/MemberVerificationModal';
import { SharePageButton } from './common/SharePageButton';
import { printMemberIdCard, downloadMemberIdCardPNG } from '../utils/idCardPrintUtils';
import { canAccessMemberIdCard, isMemberCardOwner } from '../utils/idCardAccess';

export interface UnifiedMemberData {
  id?: string | number;
  memberId?: string;
  nameBn: string;
  nameEn: string;
  roleBn?: string;
  roleEn?: string;
  designationBn?: string;
  designationEn?: string;
  organizationBn?: string;
  organizationEn?: string;
  category?: string;
  image?: string;
  photoUrl?: string;
  avatar?: string;
  membershipId?: string;
  joinedDate?: string;
  bioBn?: string;
  bioEn?: string;
  bio?: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  district?: string;
  upazila?: string;
  joinDate?: string;
  isFounder?: boolean;
  joiningYear?: number | string;
  serviceYears?: number | string;
  previousPositions?: MemberPositionHistory[] | Array<{ id?: string; positionBn?: string; positionEn?: string; fromYear?: number | string; toYear?: number | string; [key: string]: any }>;
  facebook?: string;
  linkedin?: string;
  dateOfBirth?: string;
  birthMonth?: number;
  birthDay?: number;
  profileMode?: 'founder' | 'president' | 'member';
}

interface MemberProfilePageProps {
  member: UnifiedMemberData;
  onClose: () => void;
  language: Language;
  currentAdmin?: AdminUser | null;
  loggedInMember?: GeneralMember | null;
  currentWomensUser?: WomensTeamMember | null;
  onOpenPortal?: () => void;
  onOpenAdmin?: () => void;
  onEditOwnProfile?: () => void;
  onOpenScanner?: () => void;
}

const FALLBACK_PORTRAIT =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000';

export function buildMemberProfileSlug(member: UnifiedMemberData): string {
  if (member.profileMode === 'founder') return 'founder';
  if (member.profileMode === 'president') return 'president';
  const raw = String(
    member.memberId ||
      member.membershipId ||
      member.id ||
      (member.nameEn ? member.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '') ||
      'member'
  ).trim();
  return encodeURIComponent(raw);
}

export const MemberProfilePage: React.FC<MemberProfilePageProps> = ({
  member,
  onClose,
  language,
  currentAdmin,
  loggedInMember,
  currentWomensUser,
  onOpenPortal,
  onOpenAdmin,
  onEditOwnProfile,
  onOpenScanner,
}) => {
  const isFounderProfile = member.profileMode === 'founder';
  const isPresidentProfile = member.profileMode === 'president';
  const name = language === 'bn' ? (member.nameBn || member.nameEn) : (member.nameEn || member.nameBn);
  const secondaryName = language === 'bn' ? member.nameEn : member.nameBn;
  const role = isFounderProfile
    ? (language === 'bn' ? 'প্রতিষ্ঠাতা · কোলাশ ফাউন্ডেশন' : 'Founder · CoLASH Foundation')
    : isPresidentProfile
      ? (language === 'bn' ? 'সভাপতি · অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮' : 'President · Approved Executive Council 2026–2028')
      : (language === 'bn'
          ? (member.roleBn || member.designationBn || 'সদস্য')
          : (member.roleEn || member.designationEn || 'Member'));
  const initialPhoto = member.image || member.photoUrl || member.avatar || FALLBACK_PORTRAIT;
  const memberId = member.memberId || member.membershipId || (member.id ? `COLASH-M-${member.id}` : 'COLASH-MEMBER');
  const bloodGroup = member.bloodGroup || 'B+';
  const district = member.district || 'মৌলভীবাজার';
  const joinDate = isFounderProfile ? (language === 'bn' ? '০৭ মার্চ ২০২৬ (প্রতিষ্ঠা)' : '07 March 2026 (Founded)') : (member.joinDate || member.joinedDate || '২০২৬');
  const email = member.email || 'info@colashfoundation.org';
  const phone = member.phone || '+880 1646-475348';
  const bio = isFounderProfile
    ? (language === 'bn'
        ? (member.bioBn || 'মোঃ আশরাফুল ইসলাম সুলতান ০৭-০৩-২০২৬ খ্রিস্টাব্দে কমলগঞ্জ, মৌলভীবাজারে সম্পূর্ণ অসাম্প্রদায়িক ও অরাজনৈতিক মানবিক সংগঠন কোলাশ ফাউন্ডেশন প্রতিষ্ঠা করেন। তরুণ নেতৃত্ব, স্বচ্ছ অডিট এবং প্রান্তিক মানুষের মর্যাদা রক্ষাই তাঁর প্রতিষ্ঠাতা দর্শন।')
        : (member.bioEn || 'Md. Ashraful Islam Sultan founded CoLASH Foundation on 07 March 2026 in Kamalganj, Moulvibazar as an independent, non-political humanitarian trust dedicated to open accountability and youth-driven social welfare.'))
    : isPresidentProfile
      ? (language === 'bn'
          ? 'সভাপতি হিসেবে মোঃ আশরাফুল ইসলাম সুলতান অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮-এর প্রধান নির্বাহী দায়িত্ব পালন করছেন—যেখানে ১৬ সদস্যবিশিষ্ট কমিটির সমন্বয়, প্রকল্প ও বাজেট অনুমোদন, মাঠপর্যায়ের জরুরি ত্রাণ পরিচালনা এবং শতভাগ অডিট স্বচ্ছতা নিশ্চিত করা হয়।'
          : 'Serving as President of the Approved Executive Council 2026–2028, overseeing 16-member governance coordination, annual budget and project approvals, field relief oversight, and chartered audit transparency.')
      : (language === 'bn'
          ? (member.bioBn || member.bio || `${member.nameBn} কোলাশ ফাউন্ডেশনের একজন নিবেদিতপ্রাণ মানবিক দায়িত্বশীল সদস্য। তিনি অসহায় ও সুবিধাবঞ্চিত মানুষের জীবনমান উন্নয়নে সার্বক্ষণিক অবদান রেখে চলেছেন।`)
          : (member.bioEn || member.bio || `${member.nameEn} is a dedicated humanitarian official of CoLASH Foundation, serving underprivileged communities with dignity and integrity.`));

  const [bgPhoto, setBgPhoto] = useState<string>(initialPhoto);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const profileSlug = useMemo(() => buildMemberProfileSlug(member), [member]);
  const shareableProfileUrl = useMemo(
    () => `${window.location.origin}${window.location.pathname}#profile/${profileSlug}`,
    [profileSlug]
  );
  const profileShareText = useMemo(() => {
    if (isFounderProfile) {
      return language === 'bn'
        ? `কোলাশ ফাউন্ডেশনের প্রতিষ্ঠাতা ${name}-এর পরিচিতি ও মানবিক দর্শন দেখুন।`
        : `Read the profile and humanitarian vision of ${name}, Founder of CoLASH Foundation.`;
    }
    if (isPresidentProfile) {
      return language === 'bn'
        ? `অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮-এর সভাপতি ${name}-এর প্রোফাইল দেখুন।`
        : `View the profile of ${name}, President of CoLASH Foundation Executive Council 2026–2028.`;
    }
    return language === 'bn'
      ? `কোলাশ ফাউন্ডেশনের ${role} — ${name}-এর অফিসিয়াল প্রোফাইল দেখুন।`
      : `View the official CoLASH Foundation profile of ${name} (${role}).`;
  }, [isFounderProfile, isPresidentProfile, language, name, role]);

  const profileOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBgPhoto(initialPhoto);
  }, [initialPhoto]);

  // Update URL hash to dedicated profile link while open without disturbing underlying window scroll
  useEffect(() => {
    profileOverlayRef.current?.scrollTo({ top: 0 });
    const targetHash = `#profile/${profileSlug}`;
    if (window.location.hash !== targetHash) {
      const prevState = window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
      window.history.replaceState({ ...prevState, scrollY: window.scrollY }, '');
      window.history.pushState({ profileSlug, returnScrollY: window.scrollY }, '', targetHash);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, profileSlug]);

  useEffect(() => {
    const verifyUrl = `${window.location.origin}${window.location.pathname}#verify-member-${memberId}`;
    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: { dark: '#102B3F', light: '#FFFFFF' }
    })
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [memberId]);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(memberId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareableProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const buildPrintablePayload = () => ({
    nameBn: member.nameBn || member.nameEn,
    nameEn: member.nameEn || member.nameBn,
    roleBn: member.roleBn || member.designationBn || 'সদস্য',
    roleEn: member.roleEn || member.designationEn || 'Member',
    membershipId: memberId,
    bloodGroup,
    district,
    joiningYear: member.joiningYear,
    joinedDate: joinDate,
    avatar: bgPhoto
  });

  const canPrintOrDownloadCard = canAccessMemberIdCard({
    targetMembershipId: memberId,
    targetMemberId: member.id,
    currentAdmin,
    loggedInMember,
    currentWomensUser,
  });

  const isOwner = isMemberCardOwner({
    targetMembershipId: memberId,
    targetMemberId: member.id,
    loggedInMember,
    currentWomensUser,
  });

  const handlePrint = async () => {
    if (!canPrintOrDownloadCard) return;
    const ok = await printMemberIdCard(buildPrintablePayload());
    if (!ok) {
      await downloadMemberIdCardPNG(buildPrintablePayload());
    }
  };

  const handleDownloadIdCard = async () => {
    if (!canPrintOrDownloadCard) return;
    await downloadMemberIdCardPNG(buildPrintablePayload());
  };

  return (
    <div
      ref={profileOverlayRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#06111a] text-white flex flex-col animate-in fade-in duration-300"
    >
      
      {/* ===================================================================== */}
      {/* FULL-PAGE PORTRAIT PHOTOGRAPH BACKDROP WITH MEASURED EDITORIAL SCRIM */}
      {/* ===================================================================== */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <img
          src={bgPhoto}
          alt={name}
          onError={() => {
            if (bgPhoto !== FALLBACK_PORTRAIT) {
              setBgPhoto(FALLBACK_PORTRAIT);
            }
          }}
          className="w-full h-full object-cover object-top sm:object-[center_18%] scale-[1.02] transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Multi-stop gradient scrim: keeps full portrait visible while ensuring high floating text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#051018]/95 via-[#051018]/65 to-[#051018]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#051018]/88 via-[#051018]/50 to-transparent" />
      </div>

      {/* ===================================================================== */}
      {/* TOP FLOATING TRANSLUCENT NAVIGATION & LINK BAR */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#051018]/65 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          type="button"
          aria-label="Back"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer border border-white/15 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#D6F36A]" />
          <span>{language === 'bn' ? 'পেছনে ফিরে যান' : 'Back'}</span>
        </button>

        {/* Shareable Dedicated Page URL & Copy Link */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-200 font-mono">
          <span className="text-[#D6F36A] font-bold">
            {isFounderProfile
              ? (language === 'bn' ? 'প্রতিষ্ঠাতা প্রোফাইল' : 'FOUNDER PROFILE')
              : isPresidentProfile
                ? (language === 'bn' ? 'সভাপতি প্রোফাইল · ২০২৬–২০২৮' : 'PRESIDENT PROFILE · 2026–2028')
                : (member.category || (language === 'bn' ? 'সদস্য প্রোফাইল' : 'MEMBER PROFILE'))}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-stone-300">#{profileSlug}</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#D6F36A] hover:text-[#102B3F] text-white font-sans text-[11px] font-bold transition-colors cursor-pointer"
            title={language === 'bn' ? 'প্রোফাইল লিংক কপি করুন' : 'Copy Direct Profile Link'}
          >
            {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLink ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'লিংক কপি' : 'Copy Link')}</span>
          </button>
          <a
            href={`#profile/${profileSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D6F36A] transition-colors"
            title={language === 'bn' ? 'নতুন ট্যাবে এই প্রোফাইল লিংক খুলুন' : 'Open Profile Link in New Tab'}
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right Actions: Web Share + Mobile Copy Link + Protected ID Tools + Close */}
        <div className="flex items-center gap-2">
          <SharePageButton
            language={language}
            title={`${name} — CoLASH Foundation`}
            text={profileShareText}
            url={shareableProfileUrl}
            variant="dark-glass"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer"
            title={language === 'bn' ? 'প্রোফাইল লিংক কপি করুন' : 'Copy Profile Link'}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#D6F36A]" /> : <Copy className="w-3.5 h-3.5 text-[#D6F36A]" />}
            <span className="hidden xs:inline">{copiedLink ? (language === 'bn' ? 'কপি' : 'Copied') : (language === 'bn' ? 'লিংক' : 'Link')}</span>
          </button>

          {canPrintOrDownloadCard ? (
            <>
              {isOwner && onEditOwnProfile && (
                <button
                  onClick={onEditOwnProfile}
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#167D78]/80 hover:bg-[#167D78] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#D6F36A]" />
                  <span>{language === 'bn' ? 'তথ্য এডিট' : 'Edit Info'}</span>
                </button>
              )}
              <button
                onClick={handleDownloadIdCard}
                type="button"
                title={language === 'bn' ? 'আইডি কার্ড PNG ডাউনলোড' : 'Download ID Card PNG'}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-[#D6F36A] hover:text-[#102B3F] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ID সেভ' : 'Save ID'}</span>
              </button>
              <button
                onClick={handlePrint}
                type="button"
                title={language === 'bn' ? 'আইডি কার্ড প্রিন্ট করুন' : 'Print ID Card'}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/15 text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#D6F36A]" />
                <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onOpenPortal) {
                  onClose();
                  onOpenPortal();
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/35 text-amber-200 text-xs font-bold cursor-pointer hover:bg-amber-500/30 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ID কার্ড লকড' : 'ID Locked'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">{language === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* FLOATING EDITORIAL FOREGROUND OVER FULL-BLEED PORTRAIT BACKDROP */}
      {/* ===================================================================== */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-16">
        <div className="max-w-3xl space-y-10">

          {/* 1. Floating Identity Typography Hero */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#D6F36A] font-bold">
              {isFounderProfile && (
                <span>{language === 'bn' ? 'প্রতিষ্ঠাতা · FOUNDER · স্থাপিত ০৭-০৩-২০২৬' : 'FOUNDER · EST. 07-03-2026'}</span>
              )}
              {isPresidentProfile && (
                <span>{language === 'bn' ? 'সভাপতি · অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮' : 'PRESIDENT · EXECUTIVE COUNCIL 2026–2028'}</span>
              )}
              {!isFounderProfile && !isPresidentProfile && member.isFounder && (
                <span>{language === 'bn' ? 'কার্যনির্বাহী পরিষদ ২০২৬–২০২৮' : 'EXECUTIVE COUNCIL 2026–2028'}</span>
              )}
              {(isFounderProfile || isPresidentProfile || member.isFounder) && <span className="text-white/30">·</span>}
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'bn' ? 'অফিসিয়াল ভেরিফাইড প্রোফাইল' : 'Verified Official Profile'}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-stone-200">{memberId}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance drop-shadow-md">
              {name}
            </h1>

            {secondaryName && secondaryName !== name && (
              <p className="text-base sm:text-xl font-semibold text-stone-200 tracking-wide drop-shadow-xs">
                {secondaryName}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3 text-sm sm:text-base font-bold text-[#D6F36A]">
              <span>{role}</span>
              {member.organizationBn && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-stone-200 font-medium">
                    {language === 'bn' ? member.organizationBn : member.organizationEn}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 2. Floating Unboxed Hairline Key Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 py-5 border-y border-white/20">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">
                {language === 'bn' ? 'সদস্য আইডি' : 'Member ID'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono font-black text-sm text-[#D6F36A]">
                <span>{memberId}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy ID"
                  className="p-1 text-stone-300 hover:text-white cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">
                {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
              </div>
              <div className="mt-1 font-black text-sm text-rose-300 flex items-center gap-1.5 tabular-nums">
                <Droplet className="w-4 h-4 fill-rose-400 text-rose-400" />
                <span>{bloodGroup}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">
                {language === 'bn' ? 'জেলা / এলাকা' : 'District'}
              </div>
              <div className="mt-1 font-bold text-sm text-white flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-[#D6F36A] shrink-0" />
                <span className="truncate">{district}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">
                {language === 'bn' ? 'কার্যকাল / যোগদান' : 'Tenure / Joined'}
              </div>
              <div className="mt-1 font-bold text-sm text-white flex items-center gap-1.5 tabular-nums">
                <Calendar className="w-4 h-4 text-[#E6A15B] shrink-0" />
                <span>
                  {member.joiningYear
                    ? `${member.joiningYear} (${Math.max(1, new Date().getFullYear() - Number(member.joiningYear))} বছর)`
                    : joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Floating Biography Prose (Transparent editorial column directly over the dimmed portrait) */}
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D6F36A] font-bold flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>{language === 'bn' ? 'পরিচিতি ও মানবিক অবদান' : 'Biography & Humanitarian Journey'}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-[17px] leading-[1.85] text-stone-100 whitespace-pre-line font-normal drop-shadow-xs">
              {bio}
            </p>
          </div>

          {/* 4. Historical Organizational Positions (if any) */}
          {member.previousPositions && member.previousPositions.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/15 max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-widest text-[#D6F36A] font-bold">
                {language === 'bn' ? 'পূর্ববর্তী সাংগঠনিক দায়িত্বসমূহ' : 'Organizational Lineage'}
              </div>
              <div className="space-y-2">
                {member.previousPositions.map((pos, idx) => (
                  <div key={pos.id || idx} className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-white/10">
                    <span className="font-bold text-white">
                      {language === 'bn' ? pos.positionBn : (pos.positionEn || pos.positionBn)}
                    </span>
                    <span className="font-mono text-stone-300 tabular-nums">
                      {pos.fromYear} – {pos.toYear}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Floating Institutional Responsibilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-white/15">
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-[#D6F36A] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isFounderProfile
                    ? (language === 'bn' ? 'সাংবিধানিক আদর্শ ও অভিভাবকত্ব' : 'Founding Charter & Moral Stewardship')
                    : isPresidentProfile
                      ? (language === 'bn' ? 'পরিষদ সমন্বয় ও বাজেট অনুমোদন' : 'Executive Coordination & Budget Approval')
                      : (language === 'bn' ? 'নীতিনির্ধারণ ও সিদ্ধান্ত বাস্তবায়ন' : 'Strategic Governance')}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {isFounderProfile
                    ? (language === 'bn' ? 'অসাম্প্রদায়িক ও অরাজনৈতিক মূলনীতি এবং আজীবন মানবিক দর্শন সংরক্ষণ।' : 'Protecting the non-communal, non-political charter and lifelong humanitarian vision.')
                    : isPresidentProfile
                      ? (language === 'bn' ? 'অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮-এর ১৬ সদস্যের কার্যক্রম ও তহবিল অনুমোদন।' : 'Leading the 16-member 2026–2028 Executive Council and signing off audited funds.')
                      : (language === 'bn' ? 'কোলাশ ফাউন্ডেশনের আদর্শ রক্ষা ও কার্যক্রম পরিচালনা।' : 'Implementing organizational values and council mandates.')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-[#E6A15B] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isFounderProfile
                    ? (language === 'bn' ? 'প্রতিষ্ঠাতা স্বপ্ন ও প্রাতিষ্ঠানিক প্রসার' : 'Visionary Guidance & Social Impact')
                    : (language === 'bn' ? 'মানবিক সেবা ও জরুরি ত্রাণ তদারকি' : 'Relief & Field Supervision')}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {isFounderProfile
                    ? (language === 'bn' ? 'শিক্ষা, রক্তদান নেটওয়ার্ক ও নারীর স্বাবলম্বনে নতুন প্রজন্মকে দিকনির্দেশনা।' : 'Inspiring youth leadership across education, blood aid, and women’s empowerment.')
                    : (language === 'bn' ? 'বন্যা ও সংকটে সরাসরি মাঠে তদারকি ও সহায়তা।' : 'Direct field response and underprivileged assistance.')}
                </p>
              </div>
            </div>
          </div>

          {/* 6. Floating Contact & Digital Verification Glass Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-4">
            {/* Contact Translucent Panel */}
            <div className="sm:col-span-7 p-5 rounded-2xl bg-[#051018]/65 backdrop-blur-md border border-white/15 space-y-3">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#D6F36A]">
                {language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Contact'}
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-100">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D6F36A] shrink-0" />
                  <a href={`mailto:${email}`} className="font-mono hover:text-[#D6F36A] transition-colors truncate">{email}</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D6F36A] shrink-0" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="font-mono hover:text-[#D6F36A] transition-colors">{phone}</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D6F36A] shrink-0" />
                  <span>{district}, বাংলাদেশ</span>
                </div>
              </div>
            </div>

            {/* Digital QR Verification Panel */}
            {canPrintOrDownloadCard ? (
              <div className="sm:col-span-5 p-5 rounded-2xl bg-[#0b2735]/75 backdrop-blur-md border border-[#167D78]/60 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D6F36A]">
                    {language === 'bn' ? 'অফিসিয়াল সদস্য কার্ড' : 'Digital ID Seal'}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#D6F36A]" />
                </div>
                <div className="my-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono font-extrabold text-[#D6F36A]">{memberId}</div>
                    <button
                      type="button"
                      onClick={() => setIsVerifyModalOpen(true)}
                      className="mt-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#D6F36A] hover:bg-white text-[#102B3F] text-[10px] font-black transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{language === 'bn' ? 'অনলাইনে যাচাই' : 'Verify Online'}</span>
                    </button>
                  </div>
                  <div className="bg-white p-1 rounded-lg shrink-0">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Member QR" className="w-14 h-14" />
                    ) : (
                      <div className="w-14 h-14 bg-stone-100 flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-stone-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-5 p-5 rounded-2xl bg-[#051018]/65 backdrop-blur-md border border-white/15 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                    {language === 'bn' ? 'আইডি কার্ড সুরক্ষিত' : 'ID Card Protected'}
                  </span>
                  <Lock className="w-4 h-4 text-amber-300" />
                </div>
                <p className="text-[11px] text-stone-200 leading-relaxed my-2">
                  {language === 'bn'
                    ? 'অপব্যবহার রোধে আইডি কার্ড ডাউনলোড শুধু লগইনকৃত সদস্য বা এডমিনের জন্য উন্মুক্ত।'
                    : 'Card download is restricted to logged-in owner or Admin.'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsVerifyModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#167D78] hover:bg-[#19918b] text-white text-[10px] font-bold cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{language === 'bn' ? 'সত্যতা যাচাই' : 'Verify Status'}</span>
                  </button>
                  {onOpenPortal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPortal();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[#D6F36A] text-[10px] font-bold cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>{language === 'bn' ? 'সদস্য লগইন' : 'Login'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 7. Bottom Floating Back Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D6F36A]" />
              <span>{language === 'bn' ? 'তালিকায় ফিরে যান' : 'Return to Directory'}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Member Verification Modal */}
      <MemberVerificationModal
        member={{
          id: String(member.id || memberId),
          membershipId: memberId,
          slNo: 1,
          nameBn: member.nameBn,
          nameEn: member.nameEn,
          bloodGroup: bloodGroup,
          district: district,
          roleBn: role,
          roleEn: role,
          joinedDate: joinDate,
          joiningYear: member.joiningYear ? Number(member.joiningYear) : 2026,
          avatar: bgPhoto,
          dateOfBirth: member.dateOfBirth,
          status: 'active'
        }}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        language={language}
        currentAdmin={currentAdmin}
        loggedInMember={loggedInMember}
        currentWomensUser={currentWomensUser}
        onOpenPortal={onOpenPortal}
        onOpenAdmin={onOpenAdmin}
        onOpenScanner={onOpenScanner}
      />
    </div>
  );
};
