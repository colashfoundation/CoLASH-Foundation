/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { TransparencySection } from './components/TransparencySection';
import { AboutSection } from './components/AboutSection';
import { EventsAndNews } from './components/EventsAndNews';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { DonationPageSection } from './components/DonationPageSection';
import { FounderPageSection } from './components/FounderPageSection';
import { MemberPortalModal } from './components/MemberPortalModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SearchModal } from './components/SearchModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { GoogleMapsSection } from './components/GoogleMapsSection';
import { ScrollReveal } from './components/common/ScrollReveal';

import { WomensTeamSection } from './components/WomensTeam/WomensTeamSection';
import { WomensTeamMemberModal } from './components/WomensTeam/WomensTeamMemberModal';
import { WomensTeamAdminModal } from './components/WomensTeam/WomensTeamAdminModal';

import { PublicApplicationSection } from './components/PublicApplication/PublicApplicationSection';
import { CategoryPortalSection } from './components/CategoryPortal/CategoryPortalSection';
import { HomeHighlightsSection } from './components/HomeHighlightsSection';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { MemberProfilePage } from './components/MemberProfilePage';
import { MemberCelebrationsBanner } from './components/MemberCelebrationsBanner';
import { MemberVerificationModal } from './components/common/MemberVerificationModal';
import { QRScannerModal } from './components/common/QRScannerModal';
import { EmergencyNoticePage } from './components/EmergencyNoticePage';
import { ReportsArchiveModal } from './components/common/ReportsArchiveModal';
import { SharePageButton } from './components/common/SharePageButton';
import { FAQSection } from './components/FAQSection';
import { ProjectContributionsSection } from './components/ProjectContributionsSection';
import { SponsorshipModal } from './components/common/SponsorshipModal';
import { BloodDonorRegistrationModal } from './components/common/BloodDonorRegistrationModal';
import { LinkImportModal } from './components/common/LinkImportModal';
import { SocialAndNewsFeedSection } from './components/SocialAndNewsFeedSection';
import { BangladeshBranchesSection } from './components/BangladeshBranchesSection';
import { TopAnnouncementRunner } from './components/TopAnnouncementRunner';
import {
  StateKey,
  STORAGE_KEY_MAP,
  loadLocalState,
  hasLocalState,
  persistState,
  syncBulkStateToServer,
  fetchServerState,
  writeLocalStorageSafely,
  setFirestoreAdminSyncEnabled,
  setFirestoreSyncListener,
} from './utils/statePersistence';
import { normalizeAssetUrlsDeep } from './utils/imageUtils';
import { useFirebase } from './contexts/FirebaseContext';
import {
  PUBLIC_SECTION_IDS,
  ADMIN_VAULT_SECTION_IDS,
  fetchPublicContentFromFirestore,
  fetchAdminVaultFromFirestore,
  subscribePublicContentFirestore,
  subscribeAuthenticatedFirestore,
  syncBulkCollectionsDetailed,
  primeWomensPublicCache,
  submitDonationRecordToFirestore,
  submitPublicApplicationToFirestore,
  submitLinkSubmissionToFirestore,
  type BulkSyncResult,
} from './utils/firestoreSync';
import { getCanonicalCategorySlug, resolveCategoryFromSlug, getPageTheme, getPageShareContent } from './utils/pageThemes';
import { sanitizeWebsiteConfig } from './utils/configSanitizer';
import { Flower2, Sparkles, Send, Layers, FileText, Eye, ShieldCheck, BookOpen, ExternalLink, ArrowRight, Copy, Check } from 'lucide-react';

import {
  INITIAL_PROJECTS,
  TEAM_MEMBERS,
  EVENTS_DATA,
  FINANCIAL_RECORDS,
  INITIAL_NOTICES,
  INITIAL_VOLUNTEERS,
  INITIAL_DONATIONS,
  GENERAL_MEMBERS,
  INITIAL_COMMITTEE_TERMS,
  INITIAL_ADVISORY_COUNCIL,
  INITIAL_ADMIN_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MAP_CONFIG,
  INITIAL_AI_KNOWLEDGE,
  INITIAL_PUBLIC_APPLICATIONS,
  INITIAL_AI_CONVERSATION_LOGS,
  INITIAL_WEBSITE_CUSTOM_CONFIG
} from './data/mockData';

import {
  INITIAL_WOMENS_TEAM_CONFIG,
  INITIAL_WOMENS_TEAM_MEMBERS,
  INITIAL_WOMENS_ACTIVITIES,
  INITIAL_WOMENS_DOCUMENTS,
  INITIAL_WOMENS_NOTICES
} from './data/womensTeamData';

import {
  Project,
  Donation,
  Volunteer,
  NoticeItem,
  Language,
  ThemeMode,
  WomensTeamConfig,
  WomensTeamMember,
  WomensTeamActivity,
  WomensTeamDocument,
  WomensTeamNotice,
  AdminUser,
  AdminAuditLog,
  AIKnowledgeItem,
  MapConfig,
  PublicApplication,
  AIConversationLog,
  PortalCategoryKey,
  WebsiteCustomConfig,
  CommitteeTerm,
  AdvisoryCouncilMember,
  GeneralMember,
  PaymentChannel,
  SponsorshipProposal,
  PublicBloodDonor,
  SocialNewsFeedItem,
  SocialFeedSourcesConfig,
  SocialNewsModerationStatus
} from './types';
import { INITIAL_PAYMENT_CHANNELS, PAYMENT_CHANNELS_STORAGE_KEY } from './data/paymentChannels';

const DEFAULT_CLIENT_SOCIAL_SOURCES: SocialFeedSourcesConfig = {
  autoSyncIntervalMinutes: 15,
  defaultNewsKeywords: [
    'CoLASH',
    'কোলাশ',
    'CoLASH Foundation',
    'কোলাশ ফাউন্ডেশন',
    'কমলগঞ্জ',
    'Kamalganj',
    'মৌলভীবাজার',
    'Moulvibazar',
    'সিলেট',
    'বন্যা',
    'ত্রাণ',
    'রক্তদান',
    'মানবিক',
  ],
  socialAccounts: [
    {
      id: 'social-fb-colash',
      platform: 'facebook',
      label: 'CoLASH Official Facebook Page',
      pageUrl: 'https://www.facebook.com/CoLASHFoundation',
      rssOrBridgeUrl: '',
      channelOrPageId: '',
      accessToken: '',
      autoSyncEnabled: true,
    },
    {
      id: 'social-ig-colash',
      platform: 'instagram',
      label: 'CoLASH Official Instagram',
      pageUrl: 'https://www.instagram.com/colashfoundation',
      rssOrBridgeUrl: '',
      channelOrPageId: '',
      accessToken: '',
      autoSyncEnabled: true,
    },
    {
      id: 'social-yt-colash',
      platform: 'youtube',
      label: 'CoLASH Foundation YouTube',
      pageUrl: 'https://www.youtube.com/@CoLASHFoundation',
      rssOrBridgeUrl: '',
      channelOrPageId: '',
      accessToken: '',
      autoSyncEnabled: true,
    },
  ],
  newsChannels: [
    {
      id: 'news-prothomalo',
      nameBn: 'প্রথম আলো (Prothom Alo)',
      nameEn: 'Prothom Alo',
      siteUrl: 'https://www.prothomalo.com',
      rssUrl: 'https://www.prothomalo.com/feed',
      keywords: ['CoLASH', 'কোলাশ', 'কমলগঞ্জ', 'মৌলভীবাজার', 'বন্যা', 'ত্রাণ', 'রক্তদান'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
    {
      id: 'news-dailystar',
      nameBn: 'দ্য ডেইলি স্টার (The Daily Star)',
      nameEn: 'The Daily Star',
      siteUrl: 'https://www.thedailystar.net',
      rssUrl: 'https://www.thedailystar.net/frontpage/rss.xml',
      keywords: ['CoLASH', 'Kamalganj', 'Moulvibazar', 'Sylhet', 'flood', 'relief', 'blood'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
    {
      id: 'news-jagonews24',
      nameBn: 'জাগোনিউজ২৪ (Jagonews24)',
      nameEn: 'Jagonews24',
      siteUrl: 'https://www.jagonews24.com',
      rssUrl: 'https://www.jagonews24.com/rss/rss.xml',
      keywords: ['CoLASH', 'কোলাশ', 'কমলগঞ্জ', 'মৌলভীবাজার', 'সিলেট', 'মানবিক', 'রক্তদান'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
    {
      id: 'news-dhakatribune',
      nameBn: 'ঢাকা ট্রিবিউন (Dhaka Tribune)',
      nameEn: 'Dhaka Tribune',
      siteUrl: 'https://www.dhakatribune.com',
      rssUrl: 'https://www.dhakatribune.com/feed',
      keywords: ['CoLASH', 'Kamalganj', 'Moulvibazar', 'Sylhet', 'relief', 'charity'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
  ],
};

export default function App() {
  const {
    firebaseUser,
    authReady,
    isFirebaseAdmin,
    isSuperAdmin,
    setCloudStatus,
    markCloudSynced,
    refreshCloudInventory,
  } = useFirebase();
  const isFirebaseAdminRef = useRef(isFirebaseAdmin || isSuperAdmin);
  useEffect(() => {
    isFirebaseAdminRef.current = isFirebaseAdmin || isSuperAdmin;
  }, [isFirebaseAdmin, isSuperAdmin]);
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Application Data States (Persisted in LocalStorage & synced to server DB)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = loadLocalState<Project[]>('projects', INITIAL_PROJECTS);
    if (Array.isArray(saved)) {
      return saved;
    }
    return INITIAL_PROJECTS;
  });
  const [donations, setDonations] = useState<Donation[]>(() =>
    loadLocalState<Donation[]>('donations', INITIAL_DONATIONS)
  );
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() =>
    loadLocalState<Volunteer[]>('volunteers', INITIAL_VOLUNTEERS)
  );
  const [notices, setNotices] = useState<NoticeItem[]>(() =>
    loadLocalState<NoticeItem[]>('notices', INITIAL_NOTICES)
  );
  const [financialRecords, setFinancialRecords] = useState(() =>
    loadLocalState('financialRecords', FINANCIAL_RECORDS)
  );

  // Dynamic bKash and Nagad Payment Channels (Persisted in LocalStorage & server)
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>(() =>
    loadLocalState<PaymentChannel[]>('paymentChannels', INITIAL_PAYMENT_CHANNELS)
  );

  const handleUpdatePaymentChannels = (newChannels: PaymentChannel[]) => {
    setPaymentChannels(newChannels);
    persistState('paymentChannels', newChannels);
  };

  // Modals
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [selectedDonationProject, setSelectedDonationProject] = useState<Project | null>(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [portalDefaultTab, setPortalDefaultTab] = useState<'login' | 'register'>('login');
  const [portalDefaultViewTab, setPortalDefaultViewTab] = useState<'card' | 'impact' | 'edit'>('card');
  const [loggedInMember, setLoggedInMember] = useState<GeneralMember | null>(() => {
    try {
      const saved = localStorage.getItem('colash_active_member_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGlobalScannerOpen, setIsGlobalScannerOpen] = useState(false);
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<any | null>(null);
  const [isReportsArchiveOpen, setIsReportsArchiveOpen] = useState(false);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [sponsorshipTargetProject, setSponsorshipTargetProject] = useState<Project | null>(null);
  const [isBloodDonorModalOpen, setIsBloodDonorModalOpen] = useState(false);
  const [isLinkImporterOpen, setIsLinkImporterOpen] = useState(false);

  // Category Portal Selection & Scroll Position History
  const [activeCategory, setActiveCategory] = useState<PortalCategoryKey>('all');
  const [copiedPageLink, setCopiedPageLink] = useState(false);
  const activeCategoryRef = useRef<PortalCategoryKey>('all');
  const navigationStackRef = useRef<Array<{ category: PortalCategoryKey; scrollY: number }>>([]);
  const scrollByCategoryRef = useRef<Partial<Record<PortalCategoryKey, number>>>({});
  const pendingScrollRestoreRef = useRef<number | null>(null);
  const wasProfileHashRef = useRef<boolean>(false);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  // Restore exact scroll position after page switch completes
  useEffect(() => {
    const targetY = pendingScrollRestoreRef.current;
    if (targetY === null) return;
    pendingScrollRestoreRef.current = null;
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' });
      });
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [activeCategory]);


  // Public Applications (Persisted in LocalStorage & synced with server)
  const [publicApplications, setPublicApplications] = useState<PublicApplication[]>(() =>
    loadLocalState<PublicApplication[]>('publicApplications', INITIAL_PUBLIC_APPLICATIONS)
  );

  // Individual & Organizational Sponsorship Proposals (Persisted locally & synced with server)
  const [sponsorships, setSponsorships] = useState<SponsorshipProposal[]>(() =>
    loadLocalState<SponsorshipProposal[]>('sponsorships', [])
  );

  // Non-Member Voluntary Blood Donors Registry (Persisted locally & synced with server)
  const [publicBloodDonors, setPublicBloodDonors] = useState<PublicBloodDonor[]>(() =>
    loadLocalState<PublicBloodDonor[]>('publicBloodDonors', [])
  );

  // Connected Social Platforms, News Auto-Sync & Pasted Links Moderation Feed
  const [socialNewsFeed, setSocialNewsFeed] = useState<SocialNewsFeedItem[]>(() =>
    loadLocalState<SocialNewsFeedItem[]>('socialNewsFeed', [])
  );
  const [socialFeedSources, setSocialFeedSources] = useState<SocialFeedSourcesConfig>(() =>
    loadLocalState<SocialFeedSourcesConfig>('socialFeedSources', DEFAULT_CLIENT_SOCIAL_SOURCES)
  );

  // AI Conversation Logs (Persisted in LocalStorage & synced with server)
  const [aiConversationLogs, setAiConversationLogs] = useState<AIConversationLog[]>(() =>
    loadLocalState<AIConversationLog[]>('aiConversationLogs', INITIAL_AI_CONVERSATION_LOGS)
  );

  // Map & Address Configuration (Persisted in LocalStorage & server)
  const [mapConfig, setMapConfig] = useState<MapConfig>(() =>
    loadLocalState<MapConfig>('mapConfig', INITIAL_MAP_CONFIG)
  );
  const [isMapsQuotaExceeded, setIsMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setIsMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Custom Website Editor Configuration (Persisted in LocalStorage & server)
  const [websiteCustomConfig, setWebsiteCustomConfig] = useState<WebsiteCustomConfig>(() => {
    const parsed = loadLocalState<WebsiteCustomConfig>('websiteCustomConfig', INITIAL_WEBSITE_CUSTOM_CONFIG);
    return sanitizeWebsiteConfig({
      ...INITIAL_WEBSITE_CUSTOM_CONFIG,
      ...parsed,
      logoUrl: parsed.logoUrl || INITIAL_WEBSITE_CUSTOM_CONFIG.logoUrl,
    });
  });

  const appendAuditLog = (entry: AdminAuditLog) => {
    setAuditLogs(prev => {
      const next = [entry, ...prev].slice(0, 500);
      persistState('auditLogs', next);
      return next;
    });
  };

  const handlePublishWebsiteConfig = (newConfig: WebsiteCustomConfig) => {
    const cleanedConfig = sanitizeWebsiteConfig(newConfig);
    setWebsiteCustomConfig(cleanedConfig);
    const { localOk, quotaExceeded } = persistState('websiteCustomConfig', cleanedConfig);
    if (!localOk && quotaExceeded) {
      addToast(
        'info',
        language === 'bn' ? 'সার্ভারে সংরক্ষিত হয়েছে' : 'Saved to Server',
        language === 'bn'
          ? 'ব্রাউজার স্টোরেজ পূর্ণ হওয়ায় পরিবর্তনটি মূল সার্ভার ডাটাবেসে সংরক্ষিত হয়েছে।'
          : 'Browser storage was full; changes were safely persisted to the server.'
      );
    }
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `কাস্টম ওয়েবসাইট এডিটরে নতুন কনফিগারেশন সফলভাবে পাবলিশ করেছেন`,
      actionEn: 'Published new live website custom configuration via editor',
      category: 'website_editor'
    });
  };

  const sanitizeCommitteeTerms = (terms: CommitteeTerm[]): CommitteeTerm[] => {
    if (!Array.isArray(terms)) return INITIAL_COMMITTEE_TERMS;
    const validTerms = terms.filter((t): t is CommitteeTerm => Boolean(t && typeof t === 'object'));
    const withoutLegacyPast = validTerms.filter((t) => t.id !== 'term-2022-2024');
    if (withoutLegacyPast.length === 0) return INITIAL_COMMITTEE_TERMS;
    return withoutLegacyPast.map((t) => {
      const safeMembers = Array.isArray(t.members) ? t.members.filter(Boolean) : [];
      return t.isCurrent && t.id === 'term-2025-2027'
        ? {
            ...t,
            members: safeMembers,
            termTitleBn: 'প্রতিষ্ঠাতা ও বর্তমান কার্যনির্বাহী পরিষদ (২০২৬–বর্তমান)',
            termTitleEn: 'Founding & Current Executive Council (2026–Present)',
            descriptionBn:
              'কোলাশ ফাউন্ডেশনের প্রতিষ্ঠাতা ও বর্তমান কেন্দ্রীয় কার্যনির্বাহী পরিষদ। আলাদা কোনো অতীত কমিটি নেই—বর্তমান কমিটিই প্রতিষ্ঠাতা কমিটি।',
          }
        : { ...t, members: safeMembers };
    });
  };

  // Committee Terms State (Persisted in LocalStorage & server)
  const [committeeTerms, setCommitteeTerms] = useState<CommitteeTerm[]>(() =>
    sanitizeCommitteeTerms(loadLocalState<CommitteeTerm[]>('committeeTerms', INITIAL_COMMITTEE_TERMS))
  );

  const handleUpdateCommitteeTerms = (updatedTerms: CommitteeTerm[]) => {
    setCommitteeTerms(updatedTerms);
    persistState('committeeTerms', updatedTerms);
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: 'কমিটি ও মেয়াদের তথ্য এবং সদস্য তালিকা হালনাগাদ করেছেন',
      actionEn: 'Updated committee terms and member rosters',
      category: 'committee'
    });
  };

  // Advisory Council State (Persisted in LocalStorage & server)
  const [advisors, setAdvisors] = useState<AdvisoryCouncilMember[]>(() =>
    loadLocalState<AdvisoryCouncilMember[]>('advisors', INITIAL_ADVISORY_COUNCIL)
  );

  const handleUpdateAdvisors = (updatedAdvisors: AdvisoryCouncilMember[]) => {
    setAdvisors(updatedAdvisors);
    persistState('advisors', updatedAdvisors);
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: 'উপদেষ্টামণ্ডলীর তালিকা ও সদস্য বিবরণী হালনাগাদ করেছেন',
      actionEn: 'Updated advisory council member records and terms',
      category: 'advisors'
    });
  };

  const normalizeGeneralMembersList = (list: unknown[]): GeneralMember[] => {
    if (!Array.isArray(list)) return GENERAL_MEMBERS;
    return list
      .filter((item): item is Partial<GeneralMember> => Boolean(item && typeof item === 'object'))
      .map((p, idx) => {
        const original = GENERAL_MEMBERS.find((m) => m.id === p.id || (p.membershipId && m.membershipId === p.membershipId));
        const parsedSl = Number(p.slNo);
        const safeSlNo =
          Number.isFinite(parsedSl) && parsedSl > 0
            ? parsedSl
            : original?.slNo ?? idx + 1;
        return {
          ...(original || {}),
          ...p,
          id: p.id || original?.id || `gm-${idx + 1}`,
          slNo: safeSlNo,
          membershipId: p.membershipId || original?.membershipId || `CLF-M-2026-${101 + idx}`,
          nameBn: p.nameBn || p.nameEn || original?.nameBn || 'সদস্য',
          nameEn: p.nameEn || p.nameBn || original?.nameEn || 'Member',
          bloodGroup: p.bloodGroup || original?.bloodGroup || 'O+',
          joinedDate: p.joinedDate || original?.joinedDate || '2026-03-07',
          district: p.district || original?.district || 'মৌলভীবাজার',
          status: p.status || original?.status || 'active',
          roleBn: p.roleBn || original?.roleBn || 'সাধারণ সদস্য',
          roleEn: p.roleEn || original?.roleEn || 'General Member',
          dateOfBirth: p.dateOfBirth || original?.dateOfBirth,
          birthMonth: p.birthMonth || original?.birthMonth,
          birthDay: p.birthDay || original?.birthDay,
        } as GeneralMember;
      });
  };

  // General Members Directory State (Persisted in LocalStorage)
  const [generalMembers, setGeneralMembers] = useState<GeneralMember[]>(() => {
    try {
      const saved = localStorage.getItem('colash_general_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return normalizeGeneralMembersList(parsed);
        }
      }
      return GENERAL_MEMBERS;
    } catch {
      return GENERAL_MEMBERS;
    }
  });

  // Member Celebrations: Identify members whose birthday falls in the current month (November / month 11)
  const currentMonthBirthdayMembers = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    return generalMembers.filter(member => {
      if (member.birthMonth) {
        return member.birthMonth === currentMonth;
      }
      if (member.dateOfBirth) {
        const parts = member.dateOfBirth.split('-');
        if (parts.length >= 2) {
          return parseInt(parts[1], 10) === currentMonth;
        }
      }
      return false;
    });
  }, [generalMembers]);

  const handleUpdateGeneralMembers = (updatedMembers: GeneralMember[]) => {
    setGeneralMembers(updatedMembers);
    persistState('generalMembers', updatedMembers);
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: 'সাধারণ সদস্য ডিরেক্টরি ও তথ্যাবলি সফলভাবে আপডেট করেছেন',
      actionEn: 'Updated general members registry and unique IDs',
      category: 'member'
    });
  };

  // AI Content Management Knowledge Base (Persisted in LocalStorage & server)
  const [aiKnowledgeBase, setAiKnowledgeBase] = useState<AIKnowledgeItem[]>(() =>
    loadLocalState<AIKnowledgeItem[]>('aiKnowledgeBase', INITIAL_AI_KNOWLEDGE)
  );

  // Women's Team Autonomous Wing States (Persisted in LocalStorage & server)
  const [womensTeamConfig, setWomensTeamConfig] = useState<WomensTeamConfig>(() =>
    loadLocalState<WomensTeamConfig>('womensTeamConfig', INITIAL_WOMENS_TEAM_CONFIG)
  );

  const [womensTeamMembers, setWomensTeamMembers] = useState<WomensTeamMember[]>(() =>
    loadLocalState<WomensTeamMember[]>('womensTeamMembers', INITIAL_WOMENS_TEAM_MEMBERS)
  );

  const [womensTeamActivities, setWomensTeamActivities] = useState<WomensTeamActivity[]>(() =>
    loadLocalState<WomensTeamActivity[]>('womensTeamActivities', INITIAL_WOMENS_ACTIVITIES)
  );

  const [womensTeamDocuments, setWomensTeamDocuments] = useState<WomensTeamDocument[]>(() =>
    loadLocalState<WomensTeamDocument[]>('womensTeamDocuments', INITIAL_WOMENS_DOCUMENTS)
  );

  const [womensTeamNotices, setWomensTeamNotices] = useState<WomensTeamNotice[]>(() =>
    loadLocalState<WomensTeamNotice[]>('womensTeamNotices', INITIAL_WOMENS_NOTICES)
  );

  // Women's Team Modals & Member Session
  const [isWomensMemberModalOpen, setIsWomensMemberModalOpen] = useState(false);
  const [womensMemberModalInitialTab, setWomensMemberModalInitialTab] = useState<'login' | 'register'>('login');
  const [isWomensAdminModalOpen, setIsWomensAdminModalOpen] = useState(false);

  // Active Women's Team Member Session (for Lock / Unlock of details)
  const [currentWomensUser, setCurrentWomensUser] = useState<WomensTeamMember | null>(() => {
    try {
      const saved = localStorage.getItem('colash_womens_team_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleWomensLogin = (user: WomensTeamMember) => {
    setCurrentWomensUser(user);
    writeLocalStorageSafely('colash_womens_team_session', user);
    // Launch full dedicated Women's Team Dashboard immediately
    setIsWomensMemberModalOpen(true);
  };

  const handleRegisterWomensMember = (newMember: WomensTeamMember) => {
    setWomensTeamMembers(prev => {
      const updated = [newMember, ...prev];
      persistState('womensTeamMembers', updated);
      return updated;
    });
    setCurrentWomensUser(newMember);
    writeLocalStorageSafely('colash_womens_team_session', newMember);
    addToast(
      'success',
      language === 'bn' ? 'সদস্য আইডি তৈরি সফল হয়েছে!' : 'Member ID Created!',
      language === 'bn' ? `আপনার অফিসিয়াল মেম্বার আইডি: ${newMember.membershipId}` : `Your ID: ${newMember.membershipId}`
    );
  };

  const handleUpdateWomensMemberSelf = (updatedMember: WomensTeamMember) => {
    setWomensTeamMembers(prev => {
      const updated = prev.map(m => m.id === updatedMember.id ? updatedMember : m);
      persistState('womensTeamMembers', updated);
      return updated;
    });
    setCurrentWomensUser(updatedMember);
    writeLocalStorageSafely('colash_womens_team_session', updatedMember);
    addToast(
      'success',
      language === 'bn' ? 'প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ করা হয়েছে' : 'Profile Updated'
    );
  };

  const handleWomensLogout = () => {
    setCurrentWomensUser(null);
    try {
      localStorage.removeItem('colash_womens_team_session');
    } catch (e) {
      console.error(e);
    }
    addToast(
      'info',
      language === 'bn' ? 'লগআউট সম্পন্ন হয়েছে' : 'Logged Out',
      language === 'bn' ? 'উইমেন্স টিম সেকশন পুনরায় সুরক্ষিতভাবে লক করা হয়েছে।' : 'Women’s Team section locked securely.'
    );
  };

  const handleUpdateWomensConfig = (newConfig: WomensTeamConfig) => {
    setWomensTeamConfig(newConfig);
    persistState('womensTeamConfig', newConfig);
  };

  const handleUpdateWomensMembers = (newMembers: WomensTeamMember[]) => {
    setWomensTeamMembers(newMembers);
    persistState('womensTeamMembers', newMembers);
  };

  const handleUpdateWomensActivities = (newActivities: WomensTeamActivity[]) => {
    setWomensTeamActivities(newActivities);
    persistState('womensTeamActivities', newActivities);
  };

  const handleUpdateWomensDocuments = (newDocs: WomensTeamDocument[]) => {
    setWomensTeamDocuments(newDocs);
    persistState('womensTeamDocuments', newDocs);
  };

  const handleUpdateWomensNotices = (newNotices: WomensTeamNotice[]) => {
    setWomensTeamNotices(newNotices);
    persistState('womensTeamNotices', newNotices);
  };

  const sanitizeAdminName = (text: unknown) =>
    String(text ?? '')
      .replace(/ইঞ্জি\.\s*আশরাফুল ইসলাম/g, 'Md. Ashraful Islam Sultan')
      .replace(/Engr\.\s*Ashraful Islam/g, 'Md. Ashraful Islam Sultan');

  const normalizeAdminUsers = (list: AdminUser[]): AdminUser[] => {
    if (!Array.isArray(list)) return INITIAL_ADMIN_USERS;
    const cleaned = list
      .filter((u): u is AdminUser => Boolean(u && typeof u === 'object'))
      .map((u) =>
        u.id === 'adm-super-1' || u.id === 'adm-super-2'
          ? {
              ...u,
              email: String(u.email || ''),
              name: sanitizeAdminName(u.name),
              roleTitleBn: u.roleTitleBn?.includes('প্রধান অ্যাডমিন') ? 'প্রতিষ্ঠাতা, সভাপতি ও সুপার অ্যাডমিন' : u.roleTitleBn,
              roleTitleEn: u.roleTitleEn === 'Super Admin & Founder' ? 'Founder, President & Super Admin' : u.roleTitleEn,
            }
          : { ...u, email: String(u.email || '') }
      );
    const hasConfiguredPrimary = cleaned.some(
      (u) => String(u.email || '').trim().toLowerCase() === 'ashrafulis2007@gmail.com'
    );
    if (!hasConfiguredPrimary) {
      const primaryAdmin = INITIAL_ADMIN_USERS.find(
        (u) => String(u.email || '').trim().toLowerCase() === 'ashrafulis2007@gmail.com'
      );
      if (primaryAdmin) {
        return [primaryAdmin, ...cleaned];
      }
    }
    return cleaned;
  };

  // Admin & Permission Management States (Persisted in LocalStorage & server)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const parsed = loadLocalState<AdminUser[]>('adminUsers', INITIAL_ADMIN_USERS);
    if (Array.isArray(parsed)) {
      return normalizeAdminUsers(parsed);
    }
    return INITIAL_ADMIN_USERS;
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('colash_current_admin');
      if (saved) {
        const parsed: AdminUser = JSON.parse(saved);
        return parsed.id === 'adm-super-1'
          ? { ...parsed, name: sanitizeAdminName(parsed.name) }
          : parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const parsed = loadLocalState<AdminAuditLog[]>('auditLogs', INITIAL_AUDIT_LOGS);
    if (Array.isArray(parsed)) {
      return parsed.map((l) => ({
        ...l,
        adminName: sanitizeAdminName(l.adminName),
      }));
    }
    return INITIAL_AUDIT_LOGS;
  });

  const handleAdminLogin = (user: AdminUser) => {
    setCurrentAdmin(user);
    writeLocalStorageSafely('colash_current_admin', user);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setAdminUsers(prev => {
      const updatedList = prev.map(u => u.id === user.id ? { ...u, lastLogin: nowStr } : u);
      persistState('adminUsers', updatedList);
      return updatedList;
    });

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      adminId: user.id,
      adminName: `${user.name} (${user.roleTitleBn})`,
      adminRole: user.role,
      actionBn: 'সিস্টেমে লগইন করেছেন এবং অ্যাডমিন ড্যাশবোর্ড অ্যাক্সেস করেছেন',
      actionEn: 'Admin logged in and accessed dashboard',
      category: 'auth'
    });
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    try {
      localStorage.removeItem('colash_current_admin');
    } catch (e) {
      console.error(e);
    }
    addToast(
      'info',
      language === 'bn' ? 'অ্যাডমিন লগআউট সম্পন্ন' : 'Admin Logged Out',
      language === 'bn' ? 'অ্যাডমিন সেশন সমাপ্ত হয়েছে।' : 'Admin session ended.'
    );
  };

  const handleCreateAdmin = (newAdmin: AdminUser) => {
    setAdminUsers(prev => {
      const updated = [newAdmin, ...prev];
      persistState('adminUsers', updated);
      return updated;
    });

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super',
      adminName: currentAdmin ? `${currentAdmin.name} (${currentAdmin.roleTitleBn})` : 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `নতুন অ্যাডমিন ${newAdmin.name} (${newAdmin.roleTitleBn})-কে পারমিশনসহ নিয়োগ দিয়েছেন`,
      actionEn: `Created new admin ${newAdmin.name} (${newAdmin.roleTitleEn})`,
      category: 'admin_manage'
    });
  };

  const handleUpdateAdmin = (updatedAdmin: AdminUser) => {
    setAdminUsers(prev => {
      const updated = prev.map(u => u.id === updatedAdmin.id ? updatedAdmin : u);
      persistState('adminUsers', updated);
      return updated;
    });
    if (currentAdmin?.id === updatedAdmin.id) {
      setCurrentAdmin(updatedAdmin);
      writeLocalStorageSafely('colash_current_admin', updatedAdmin);
    }

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super',
      adminName: currentAdmin ? `${currentAdmin.name} (${currentAdmin.roleTitleBn})` : 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `অ্যাডমিন ${updatedAdmin.name}-এর পারমিশন ও তথ্য হালনাগাদ করেছেন`,
      actionEn: `Updated details and permissions for ${updatedAdmin.name}`,
      category: 'admin_manage'
    });
  };

  const handleDeleteAdmin = (id: string) => {
    const target = adminUsers.find(u => u.id === id);
    setAdminUsers(prev => {
      const updated = prev.filter(u => u.id !== id);
      persistState('adminUsers', updated);
      return updated;
    });

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super',
      adminName: currentAdmin ? `${currentAdmin.name} (${currentAdmin.roleTitleBn})` : 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `অ্যাডমিন ${target?.name || id}-এর অ্যাক্সেস বাতিল করেছেন`,
      actionEn: `Revoked access for admin ${target?.name || id}`,
      category: 'admin_manage'
    });

    addToast('info', language === 'bn' ? 'অ্যাডমিন অ্যাক্সেস বাতিল' : 'Admin Access Revoked');
  };

  const handleToggleAdminStatus = (id: string) => {
    const target = adminUsers.find(u => u.id === id);
    if (!target) return;
    const newStatus = !target.isActive;
    setAdminUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, isActive: newStatus } : u);
      persistState('adminUsers', updated);
      return updated;
    });

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super',
      adminName: currentAdmin ? `${currentAdmin.name} (${currentAdmin.roleTitleBn})` : 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `অ্যাডমিন ${target.name}-কে ${newStatus ? 'সক্রিয়' : 'সাময়িকভাবে নিষ্ক্রিয়'} করেছেন`,
      actionEn: `${newStatus ? 'Activated' : 'Suspended'} admin ${target.name}`,
      category: 'admin_manage'
    });

    addToast(
      'info',
      newStatus
        ? (language === 'bn' ? 'অ্যাকাউন্ট সক্রিয় করা হয়েছে' : 'Account Activated')
        : (language === 'bn' ? 'অ্যাকাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে' : 'Account Suspended')
    );
  };

  const handleChangeAdminPassword = (id: string, newPass: string) => {
    const target = adminUsers.find(u => u.id === id);
    setAdminUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, password: newPass } : u);
      persistState('adminUsers', updated);
      return updated;
    });
    if (currentAdmin?.id === id) {
      const updatedCurrent = { ...currentAdmin, password: newPass };
      setCurrentAdmin(updatedCurrent);
      writeLocalStorageSafely('colash_current_admin', updatedCurrent);
    }

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || id,
      adminName: currentAdmin?.name || target?.name || 'Admin',
      adminRole: currentAdmin?.role || 'custom_admin',
      actionBn: `অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে`,
      actionEn: 'Password updated successfully',
      category: 'security'
    });
  };

  const handleUpdateMapConfig = (newConfig: MapConfig) => {
    setMapConfig(newConfig);
    persistState('mapConfig', newConfig);
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `অফিস ঠিকানা ও গুগল ম্যাপ কনফিগারেশন আপডেট করা হয়েছে`,
      actionEn: 'Office address and Google Maps configuration updated',
      category: 'settings'
    });
  };

  const handleUpdateAIKnowledgeBase = (newKB: AIKnowledgeItem[]) => {
    setAiKnowledgeBase(newKB);
    persistState('aiKnowledgeBase', newKB);
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `AI Content Management নলেজ বেস আপডেট করা হয়েছে`,
      actionEn: 'AI Content Management knowledge base updated',
      category: 'ai_content'
    });
  };

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [qrVerifiedMember, setQrVerifiedMember] = useState<GeneralMember | null>(null);
  const [qrVerifiedFromScan, setQrVerifiedFromScan] = useState<boolean>(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync dark mode class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply Website Customizer Colors & Typography dynamically to CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    if (websiteCustomConfig.primaryColor) {
      root.style.setProperty('--brand-teal', websiteCustomConfig.primaryColor);
    }
    if (websiteCustomConfig.secondaryColor) {
      root.style.setProperty('--brand-navy', websiteCustomConfig.secondaryColor);
    }
    if (websiteCustomConfig.accentColor) {
      root.style.setProperty('--brand-lime', websiteCustomConfig.accentColor);
    }
    if (websiteCustomConfig.bgTone) {
      root.style.setProperty('--brand-ivory', websiteCustomConfig.bgTone);
    }
    if (websiteCustomConfig.fontFamily) {
      document.body.style.fontFamily = `'${websiteCustomConfig.fontFamily}', 'Plus Jakarta Sans', 'Hind Siliguri', system-ui, sans-serif`;
    }
  }, [
    websiteCustomConfig.primaryColor,
    websiteCustomConfig.secondaryColor,
    websiteCustomConfig.accentColor,
    websiteCustomConfig.bgTone,
    websiteCustomConfig.fontFamily,
  ]);

  // Helper to apply any collection update (used by mount hydration & live Firestore onSnapshot)
  const applyHydratedKey = (key: StateKey, inputRawValue: unknown) => {
    if (inputRawValue === undefined || inputRawValue === null) return;
    const rawValue = normalizeAssetUrlsDeep(inputRawValue);
    switch (key) {
      case 'projects':
        if (Array.isArray(rawValue)) {
          const safeProjects = (rawValue as Project[]).filter(Boolean).map((p, idx) => ({
            ...p,
            id: p.id || `proj-${idx + 1}`,
            targetAmount: Number(p.targetAmount) > 0 ? Number(p.targetAmount) : 1000,
            raisedAmount: Number(p.raisedAmount) >= 0 ? Number(p.raisedAmount) : 0,
            donorsCount: Number(p.donorsCount) >= 0 ? Number(p.donorsCount) : 0,
            beneficiariesCount: Number(p.beneficiariesCount) >= 0 ? Number(p.beneficiariesCount) : 0,
            impactUpdates: Array.isArray(p.impactUpdates) ? p.impactUpdates : [],
          }));
          setProjects(safeProjects);
          writeLocalStorageSafely(STORAGE_KEY_MAP.projects, safeProjects);
        }
        break;
      case 'donations':
        if (Array.isArray(rawValue)) {
          const safeDonations = (rawValue as Donation[]).filter(Boolean);
          setDonations(safeDonations);
          writeLocalStorageSafely(STORAGE_KEY_MAP.donations, safeDonations);
        }
        break;
      case 'volunteers':
        if (Array.isArray(rawValue)) {
          const safeVols = (rawValue as Volunteer[]).filter(Boolean);
          setVolunteers(safeVols);
          writeLocalStorageSafely(STORAGE_KEY_MAP.volunteers, safeVols);
        }
        break;
      case 'notices':
        if (Array.isArray(rawValue)) {
          const safeNotices = (rawValue as NoticeItem[]).filter(Boolean);
          setNotices(safeNotices);
          writeLocalStorageSafely(STORAGE_KEY_MAP.notices, safeNotices);
        }
        break;
      case 'financialRecords':
        if (Array.isArray(rawValue)) {
          const safeRecords = (rawValue as typeof FINANCIAL_RECORDS).filter(Boolean);
          setFinancialRecords(safeRecords);
          writeLocalStorageSafely(STORAGE_KEY_MAP.financialRecords, safeRecords);
        }
        break;
      case 'paymentChannels':
        if (Array.isArray(rawValue)) {
          const safeChannels = (rawValue as PaymentChannel[]).filter(Boolean);
          setPaymentChannels(safeChannels);
          writeLocalStorageSafely(STORAGE_KEY_MAP.paymentChannels, safeChannels);
        }
        break;
      case 'publicApplications':
        if (Array.isArray(rawValue)) {
          const safeApps = (rawValue as PublicApplication[]).filter(Boolean);
          setPublicApplications(safeApps);
          writeLocalStorageSafely(STORAGE_KEY_MAP.publicApplications, safeApps);
        }
        break;
      case 'sponsorships':
        if (Array.isArray(rawValue)) {
          const safeSponsorships = (rawValue as SponsorshipProposal[]).filter(Boolean);
          setSponsorships(safeSponsorships);
          writeLocalStorageSafely(STORAGE_KEY_MAP.sponsorships, safeSponsorships);
        }
        break;
      case 'publicBloodDonors':
        if (Array.isArray(rawValue)) {
          const safeBloodDonors = (rawValue as PublicBloodDonor[]).filter(Boolean);
          setPublicBloodDonors(safeBloodDonors);
          writeLocalStorageSafely(STORAGE_KEY_MAP.publicBloodDonors, safeBloodDonors);
        }
        break;
      case 'aiConversationLogs':
        if (Array.isArray(rawValue)) {
          const safeLogs = (rawValue as AIConversationLog[]).filter(Boolean);
          setAiConversationLogs(safeLogs);
          writeLocalStorageSafely(STORAGE_KEY_MAP.aiConversationLogs, safeLogs);
        }
        break;
      case 'mapConfig':
        if (rawValue && typeof rawValue === 'object') {
          const mergedMap = { ...INITIAL_MAP_CONFIG, ...(rawValue as Partial<MapConfig>) };
          setMapConfig(mergedMap);
          writeLocalStorageSafely(STORAGE_KEY_MAP.mapConfig, mergedMap);
        }
        break;
      case 'websiteCustomConfig':
        if (rawValue && typeof rawValue === 'object') {
          const merged = sanitizeWebsiteConfig({
            ...INITIAL_WEBSITE_CUSTOM_CONFIG,
            ...(rawValue as Partial<WebsiteCustomConfig>),
            logoUrl: (rawValue as Partial<WebsiteCustomConfig>)?.logoUrl || INITIAL_WEBSITE_CUSTOM_CONFIG.logoUrl,
          });
          setWebsiteCustomConfig(merged);
          writeLocalStorageSafely(STORAGE_KEY_MAP.websiteCustomConfig, merged);
        }
        break;
      case 'committeeTerms':
        if (Array.isArray(rawValue)) {
          const cleanedTerms = sanitizeCommitteeTerms(rawValue as CommitteeTerm[]);
          setCommitteeTerms(cleanedTerms);
          writeLocalStorageSafely(STORAGE_KEY_MAP.committeeTerms, cleanedTerms);
        }
        break;
      case 'advisors':
        if (Array.isArray(rawValue)) {
          const safeAdvisors = (rawValue as AdvisoryCouncilMember[]).filter(Boolean);
          setAdvisors(safeAdvisors);
          writeLocalStorageSafely(STORAGE_KEY_MAP.advisors, safeAdvisors);
        }
        break;
      case 'generalMembers':
        if (Array.isArray(rawValue)) {
          const normalized = normalizeGeneralMembersList(rawValue);
          setGeneralMembers(normalized);
          writeLocalStorageSafely(STORAGE_KEY_MAP.generalMembers, normalized);
        }
        break;
      case 'aiKnowledgeBase':
        if (Array.isArray(rawValue)) {
          const safeKB = (rawValue as AIKnowledgeItem[]).filter(Boolean);
          setAiKnowledgeBase(safeKB);
          writeLocalStorageSafely(STORAGE_KEY_MAP.aiKnowledgeBase, safeKB);
        }
        break;
      case 'womensTeamConfig':
        if (rawValue && typeof rawValue === 'object') {
          const mergedWConfig = { ...INITIAL_WOMENS_TEAM_CONFIG, ...(rawValue as Partial<WomensTeamConfig>) };
          setWomensTeamConfig(mergedWConfig);
          writeLocalStorageSafely(STORAGE_KEY_MAP.womensTeamConfig, mergedWConfig);
        }
        break;
      case 'womensTeamMembers':
        if (Array.isArray(rawValue)) {
          const safeWMembers = (rawValue as WomensTeamMember[]).filter(Boolean);
          setWomensTeamMembers(safeWMembers);
          writeLocalStorageSafely(STORAGE_KEY_MAP.womensTeamMembers, safeWMembers);
        }
        break;
      case 'womensTeamActivities':
        if (Array.isArray(rawValue)) {
          const safeWAct = (rawValue as WomensTeamActivity[]).filter(Boolean);
          setWomensTeamActivities(safeWAct);
          writeLocalStorageSafely(STORAGE_KEY_MAP.womensTeamActivities, safeWAct);
        }
        break;
      case 'womensTeamDocuments':
        if (Array.isArray(rawValue)) {
          const safeWDocs = (rawValue as WomensTeamDocument[]).filter(Boolean);
          setWomensTeamDocuments(safeWDocs);
          writeLocalStorageSafely(STORAGE_KEY_MAP.womensTeamDocuments, safeWDocs);
        }
        break;
      case 'womensTeamNotices':
        if (Array.isArray(rawValue)) {
          const safeWNotices = (rawValue as WomensTeamNotice[]).filter(Boolean);
          setWomensTeamNotices(safeWNotices);
          writeLocalStorageSafely(STORAGE_KEY_MAP.womensTeamNotices, safeWNotices);
        }
        break;
      case 'adminUsers':
        if (Array.isArray(rawValue)) {
          const normalizedAdmins = normalizeAdminUsers(rawValue as AdminUser[]);
          setAdminUsers(normalizedAdmins);
          writeLocalStorageSafely(STORAGE_KEY_MAP.adminUsers, normalizedAdmins);
        }
        break;
      case 'auditLogs':
        if (Array.isArray(rawValue)) {
          const normalizedLogs = (rawValue as AdminAuditLog[])
            .filter(Boolean)
            .map((l) => ({
              ...l,
              adminName: sanitizeAdminName(l.adminName),
            }));
          setAuditLogs(normalizedLogs);
          writeLocalStorageSafely(STORAGE_KEY_MAP.auditLogs, normalizedLogs);
        }
        break;
      case 'socialNewsFeed':
        if (Array.isArray(rawValue)) {
          const safeFeed = (rawValue as SocialNewsFeedItem[]).filter(Boolean);
          setSocialNewsFeed(safeFeed);
          writeLocalStorageSafely(STORAGE_KEY_MAP.socialNewsFeed, safeFeed);
        }
        break;
      case 'socialFeedSources':
        if (rawValue && typeof rawValue === 'object') {
          const mergedSources: SocialFeedSourcesConfig = {
            ...DEFAULT_CLIENT_SOCIAL_SOURCES,
            ...(rawValue as Partial<SocialFeedSourcesConfig>),
          };
          setSocialFeedSources(mergedSources);
          writeLocalStorageSafely(STORAGE_KEY_MAP.socialFeedSources, mergedSources);
        }
        break;
    }
  };

  // Keep Firestore sync permission flag & womensPublic cache updated
  useEffect(() => {
    setFirestoreAdminSyncEnabled(authReady && (isFirebaseAdmin || isSuperAdmin));
    setFirestoreSyncListener((status) => {
      if (status === 'synced') markCloudSynced();
      else setCloudStatus(status);
    });
    return () => setFirestoreSyncListener(null);
  }, [authReady, isFirebaseAdmin, isSuperAdmin, markCloudSynced, setCloudStatus]);

  useEffect(() => {
    primeWomensPublicCache({
      womensTeamConfig,
      womensTeamActivities,
      womensTeamNotices,
    });
  }, [womensTeamConfig, womensTeamActivities, womensTeamNotices]);

  const buildFullCollectionsSnapshot = (): Partial<Record<StateKey, unknown>> => ({
    projects,
    donations,
    volunteers,
    notices,
    financialRecords,
    paymentChannels,
    publicApplications,
    sponsorships,
    publicBloodDonors,
    aiConversationLogs,
    mapConfig,
    websiteCustomConfig,
    committeeTerms,
    advisors,
    generalMembers,
    aiKnowledgeBase,
    womensTeamConfig,
    womensTeamMembers,
    womensTeamActivities,
    womensTeamDocuments,
    womensTeamNotices,
    adminUsers,
    auditLogs,
    socialNewsFeed,
    socialFeedSources,
  });

  const handleSubmitLinkItem = async (
    item: SocialNewsFeedItem
  ): Promise<{ ok: boolean; alreadyQueued?: boolean; error?: string }> => {
    const safeItem: SocialNewsFeedItem = {
      ...item,
      status: 'pending',
      importMethod: 'link_paste',
    };

    try {
      const res = await fetch('/api/social-feed/submit-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safeItem),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setSocialNewsFeed(data.items);
          writeLocalStorageSafely(STORAGE_KEY_MAP.socialNewsFeed, data.items);
        }
        if (firebaseUser?.emailVerified) {
          void submitLinkSubmissionToFirestore(firebaseUser, safeItem).catch(() => {});
        }
        return { ok: true, alreadyQueued: Boolean(data.alreadyQueued) };
      }
    } catch {
      // Static fallback below if Express API unreachable
    }

    const exists = socialNewsFeed.some((x) => x.sourceUrl.trim().toLowerCase() === safeItem.sourceUrl.trim().toLowerCase());
    if (exists) {
      return { ok: true, alreadyQueued: true };
    }
    const nextFeed = [safeItem, ...socialNewsFeed].slice(0, 400);
    setSocialNewsFeed(nextFeed);
    persistState('socialNewsFeed', nextFeed);
    if (firebaseUser?.emailVerified) {
      void submitLinkSubmissionToFirestore(firebaseUser, safeItem).catch(() => {});
    }
    return { ok: true, alreadyQueued: false };
  };

  const handleModerateSocialNewsItem = async (
    id: string,
    status: SocialNewsModerationStatus,
    edits?: { titleBn?: string; titleEn?: string; summaryBn?: string; summaryEn?: string }
  ) => {
    const moderatorLabel = currentAdmin?.name || 'Admin Moderator';
    const nowIso = new Date().toISOString();

    let nextFeed = socialNewsFeed.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            moderatedBy: moderatorLabel,
            moderatedAt: nowIso,
            ...(edits?.titleBn ? { titleBn: edits.titleBn } : {}),
            ...(edits?.titleEn ? { titleEn: edits.titleEn } : {}),
            ...(edits?.summaryBn !== undefined ? { summaryBn: edits.summaryBn } : {}),
            ...(edits?.summaryEn !== undefined ? { summaryEn: edits.summaryEn } : {}),
          }
        : item
    );

    try {
      const res = await fetch(`/api/social-feed/${encodeURIComponent(id)}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          moderatedBy: moderatorLabel,
          ...edits,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          nextFeed = data.items;
        }
      }
    } catch {
      // Offline / static fallback
    }

    setSocialNewsFeed(nextFeed);
    persistState('socialNewsFeed', nextFeed);
    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: nowIso.replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: moderatorLabel,
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `সোশ্যাল/নিউজ আইটেম (${id}) স্ট্যাটাস "${status}" হিসেবে অনুমোদন/আপডেট করেছেন`,
      actionEn: `Moderated social/news feed item (${id}) to "${status}"`,
      category: 'social_news',
    });
    addToast(
      status === 'approved' ? 'success' : 'info',
      status === 'approved'
        ? language === 'bn'
          ? 'পোস্ট অনুমোদিত ও ওয়েবসাইটে প্রকাশিত হয়েছে!'
          : 'Approved & Published!'
        : language === 'bn'
        ? 'পোস্টের স্ট্যাটাস হালনাগাদ হয়েছে'
        : 'Feed Item Updated'
    );
  };

  const handleDeleteSocialNewsItem = async (id: string) => {
    let nextFeed = socialNewsFeed.filter((item) => item.id !== id);
    try {
      const res = await fetch(`/api/social-feed/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) nextFeed = data.items;
      }
    } catch {
      // ignore static fallback
    }
    setSocialNewsFeed(nextFeed);
    persistState('socialNewsFeed', nextFeed);
    addToast('info', language === 'bn' ? 'আইটেমটি তালিকা থেকে মুছে ফেলা হয়েছে' : 'Feed Item Deleted');
  };

  const handleUpdateSocialFeedSources = async (nextConfig: SocialFeedSourcesConfig) => {
    setSocialFeedSources(nextConfig);
    persistState('socialFeedSources', nextConfig);
  };

  const handleTriggerSocialNewsSync = async (target: 'all' | 'social' | 'news') => {
    try {
      const res = await fetch('/api/social-feed/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, sources: socialFeedSources }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.items)) {
        setSocialNewsFeed(data.items);
        persistState('socialNewsFeed', data.items);
      }
      if (data.sources) {
        setSocialFeedSources(data.sources);
        persistState('socialFeedSources', data.sources);
      }
      return {
        addedCount: Number(data.addedCount || 0),
        reports: Array.isArray(data.reports) ? data.reports : [],
      };
    } catch (err) {
      addToast(
        'error',
        language === 'bn' ? 'অটো-সিঙ্ক সমস্যা হয়েছে' : 'Auto-Sync Error',
        err instanceof Error ? err.message : undefined
      );
      return null;
    }
  };

  const handleSyncAllToCloud = async (): Promise<BulkSyncResult> => {
    setCloudStatus('syncing');
    try {
      const result = await syncBulkCollectionsDetailed(
        buildFullCollectionsSnapshot(),
        firebaseUser
      );
      if (result.ok) {
        markCloudSynced();
      } else {
        setCloudStatus('error');
      }
      await refreshCloudInventory(isFirebaseAdmin);
      return result;
    } catch (err) {
      setCloudStatus('error');
      console.warn('Manual cloud sync error:', err);
      return {
        ok: false,
        writtenCount: 0,
        failedKeys: [],
        errorMessage: err instanceof Error ? err.message : String(err),
      };
    }
  };

  // Hydrate all persisted application data from Firebase Firestore & optional backend API on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [firestoreRes, serverCollections] = await Promise.all([
        fetchPublicContentFromFirestore().catch(() => ({
          publicState: {},
          foundPublicCount: 0,
          presentPublicIds: [],
          missingPublicIds: [...PUBLIC_SECTION_IDS],
        })),
        fetchServerState().catch(() => null),
      ]);
      if (cancelled) return;

      // 1. First apply optional Express server state if present
      if (serverCollections) {
        const toSeed: Partial<Record<StateKey, unknown>> = {};
        const applyOrSeed = <T,>(
          key: StateKey,
          localCurrent: T,
          transform?: (val: any) => T
        ) => {
          const entry = serverCollections[key];
          if (entry && entry.value !== undefined && entry.value !== null) {
            const val = transform ? transform(entry.value) : (entry.value as T);
            applyHydratedKey(key, val);
          } else if (hasLocalState(key)) {
            toSeed[key] = localCurrent;
          }
        };

        applyOrSeed('projects', projects);
        applyOrSeed('donations', donations);
        applyOrSeed('volunteers', volunteers);
        applyOrSeed('notices', notices);
        applyOrSeed('financialRecords', financialRecords);
        applyOrSeed('paymentChannels', paymentChannels);
        applyOrSeed('publicApplications', publicApplications);
        applyOrSeed('sponsorships', sponsorships);
        applyOrSeed('publicBloodDonors', publicBloodDonors);
        applyOrSeed('aiConversationLogs', aiConversationLogs);
        applyOrSeed('mapConfig', mapConfig);
        applyOrSeed('websiteCustomConfig', websiteCustomConfig);
        applyOrSeed('committeeTerms', committeeTerms);
        applyOrSeed('advisors', advisors);
        applyOrSeed('generalMembers', generalMembers);
        applyOrSeed('aiKnowledgeBase', aiKnowledgeBase);
        applyOrSeed('womensTeamConfig', womensTeamConfig);
        applyOrSeed('womensTeamMembers', womensTeamMembers);
        applyOrSeed('womensTeamActivities', womensTeamActivities);
        applyOrSeed('womensTeamDocuments', womensTeamDocuments);
        applyOrSeed('womensTeamNotices', womensTeamNotices);
        applyOrSeed('adminUsers', adminUsers);
        applyOrSeed('auditLogs', auditLogs);
        applyOrSeed('socialNewsFeed', socialNewsFeed);
        applyOrSeed('socialFeedSources', socialFeedSources);

        if (Object.keys(toSeed).length > 0) {
          void syncBulkStateToServer(toSeed);
        }
      }

      // 2. Overlay authoritative Firebase Firestore public content (works everywhere, including Cloudflare Pages)
      if (firestoreRes.foundPublicCount > 0) {
        for (const [k, v] of Object.entries(firestoreRes.publicState)) {
          applyHydratedKey(k as StateKey, v);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // Run once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Universal Real-Time Multi-Device Sync (All phones, tablets & laptops auto-update instantaneously)
  useEffect(() => {
    const unsubscribePublic = subscribePublicContentFirestore(
      (key, value) => {
        applyHydratedKey(key, value);
        markCloudSynced();
      },
      () => isFirebaseAdminRef.current
    );

    let lastRefreshAt = Date.now();
    const resyncLatestFromCloud = async () => {
      if (Date.now() - lastRefreshAt < 10_000) return;
      lastRefreshAt = Date.now();
      try {
        const pubRes = await fetchPublicContentFromFirestore({ forceServer: true });
        if (pubRes.foundPublicCount > 0) {
          for (const [k, v] of Object.entries(pubRes.publicState)) {
            if (isFirebaseAdminRef.current && (k === 'generalMembers' || k === 'donations')) {
              continue;
            }
            applyHydratedKey(k as StateKey, v);
          }
          markCloudSynced();
        }
      } catch {
        // Ignore transient offline errors
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void resyncLatestFromCloud();
      }
    };

    const handleOnline = () => {
      void resyncLatestFromCloud();
    };

    // Instant cross-tab sync within the same browser
    const storageToStateKey = Object.fromEntries(
      Object.entries(STORAGE_KEY_MAP).map(([stateKey, lsKey]) => [lsKey, stateKey as StateKey])
    );
    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      const mappedKey = storageToStateKey[e.key];
      if (!mappedKey) return;
      try {
        const parsed = JSON.parse(e.newValue);
        applyHydratedKey(mappedKey, parsed);
      } catch {
        // Ignore malformed cross-tab value
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      unsubscribePublic();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('storage', handleStorageEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach authenticated Firestore listeners & seed all missing Firestore sections on Admin connection
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    let cancelled = false;
    (async () => {
      if (isFirebaseAdmin) {
        // Auto-match Firebase Google Admin into AdminDashboard session if not already logged in
        const userEmail = firebaseUser.email?.toLowerCase();
        if (userEmail && !currentAdmin) {
          const matchedAdmin = adminUsers.find(
            (u) => String(u.email || '').toLowerCase() === userEmail && u.isActive
          );
          if (matchedAdmin) {
            setCurrentAdmin(matchedAdmin);
            writeLocalStorageSafely('colash_current_admin', matchedAdmin);
          }
        }

        // Load existing cloud state first, then seed EVERY missing public_content & admin_vault doc
        try {
          const [pubRes, vaultRes] = await Promise.all([
            fetchPublicContentFromFirestore(),
            fetchAdminVaultFromFirestore(),
          ]);
          if (cancelled) return;

          if (pubRes.foundPublicCount > 0) {
            for (const [k, v] of Object.entries(pubRes.publicState)) {
              applyHydratedKey(k as StateKey, v);
            }
          }
          if (vaultRes.foundVaultCount > 0) {
            for (const [k, v] of Object.entries(vaultRes.adminState)) {
              applyHydratedKey(k as StateKey, v);
            }
          }

          const needsSeed =
            pubRes.foundPublicCount < PUBLIC_SECTION_IDS.length ||
            vaultRes.foundVaultCount < ADMIN_VAULT_SECTION_IDS.length;

          if (needsSeed) {
            const fullSnapshot = buildFullCollectionsSnapshot();
            const missingSnapshot: Partial<Record<StateKey, unknown>> = {};

            for (const pubId of pubRes.missingPublicIds) {
              if (pubId === 'publicMembers') {
                missingSnapshot.generalMembers =
                  vaultRes.adminState.generalMembers ?? fullSnapshot.generalMembers;
              } else if (pubId === 'publicDonations') {
                missingSnapshot.donations =
                  vaultRes.adminState.donations ?? fullSnapshot.donations;
              } else if (pubId === 'womensPublic') {
                missingSnapshot.womensTeamConfig = fullSnapshot.womensTeamConfig;
                missingSnapshot.womensTeamActivities = fullSnapshot.womensTeamActivities;
                missingSnapshot.womensTeamNotices = fullSnapshot.womensTeamNotices;
              } else {
                missingSnapshot[pubId as StateKey] = fullSnapshot[pubId as StateKey];
              }
            }

            for (const vaultId of vaultRes.missingVaultIds) {
              if (vaultId === 'generalMembersPrivate') {
                missingSnapshot.generalMembers =
                  vaultRes.adminState.generalMembers ?? fullSnapshot.generalMembers;
              } else if (vaultId === 'donationsFull') {
                missingSnapshot.donations =
                  vaultRes.adminState.donations ?? fullSnapshot.donations;
              } else if (vaultId === 'volunteersFull') {
                missingSnapshot.volunteers = fullSnapshot.volunteers;
              } else if (vaultId === 'publicApplicationsFull') {
                missingSnapshot.publicApplications = fullSnapshot.publicApplications;
              } else {
                missingSnapshot[vaultId as StateKey] = fullSnapshot[vaultId as StateKey];
              }
            }

            if (Object.keys(missingSnapshot).length > 0) {
              setCloudStatus('syncing');
              const seedResult = await syncBulkCollectionsDetailed(
                missingSnapshot,
                firebaseUser
              );
              if (!cancelled) {
                if (seedResult.ok) markCloudSynced();
                else setCloudStatus('error');
              }
            } else {
              markCloudSynced();
            }
          } else {
            markCloudSynced();
          }

          if (!cancelled) {
            await refreshCloudInventory(true);
          }
        } catch (err) {
          console.warn('Initial admin Firestore sync warning:', err);
          setCloudStatus('error');
        }
      }
    })();

    const unsubscribe = subscribeAuthenticatedFirestore(
      firebaseUser,
      isFirebaseAdmin,
      (key, value) => {
        applyHydratedKey(key, value);
        markCloudSynced();
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, firebaseUser, isFirebaseAdmin]);

  // Persistent Authentication Guard & Rehydration Hook
  useEffect(() => {
    try {
      // 1. Rehydrate & Guard Admin Session
      const savedAdminStr = localStorage.getItem('colash_current_admin');
      if (savedAdminStr) {
        const savedAdmin: AdminUser = JSON.parse(savedAdminStr);
        const matchedAdmin = adminUsers.find(u => u.id === savedAdmin.id);
        if (matchedAdmin && matchedAdmin.isActive) {
          setCurrentAdmin(matchedAdmin);
        } else if (!matchedAdmin) {
          setCurrentAdmin(savedAdmin);
        } else {
          // Account was deactivated
          setCurrentAdmin(null);
          localStorage.removeItem('colash_current_admin');
        }
      }

      // 2. Rehydrate & Guard Women's Team Member Session
      const savedWomensStr = localStorage.getItem('colash_womens_team_session');
      if (savedWomensStr) {
        const savedWomensUser: WomensTeamMember = JSON.parse(savedWomensStr);
        const matchedWomens = womensTeamMembers.find(m => m.id === savedWomensUser.id);
        if (matchedWomens) {
          setCurrentWomensUser(matchedWomens);
        } else {
          setCurrentWomensUser(savedWomensUser);
        }
      }

      // 3. Rehydrate General Member Session
      const savedMemberStr = localStorage.getItem('colash_active_member_session');
      if (savedMemberStr) {
        const savedMember: GeneralMember = JSON.parse(savedMemberStr);
        const matchedMember = generalMembers.find(
          m => m.id === savedMember.id || m.membershipId === savedMember.membershipId
        );
        if (matchedMember) {
          setLoggedInMember(matchedMember);
        } else {
          setLoggedInMember(savedMember);
        }
      } else {
        setLoggedInMember(null);
      }
    } catch (err) {
      console.error('Authentication guard rehydration error:', err);
    }
  }, [adminUsers, womensTeamMembers, generalMembers]);

  const latestRouteDataRef = useRef({
    generalMembers,
    committeeTerms,
    advisors,
    womensTeamMembers,
    language,
    founderImageUrl: websiteCustomConfig.founderImageUrl,
  });
  latestRouteDataRef.current = {
    generalMembers,
    committeeTerms,
    advisors,
    womensTeamMembers,
    language,
    founderImageUrl: websiteCustomConfig.founderImageUrl,
  };

  // Section 5.2: Browser Back/Forward navigation via popstate, hashchange & initial hash parse with exact scroll restoration
  useEffect(() => {
    const handleHashChange = (evt?: Event) => {
      try {
        const {
          generalMembers: gmList,
          committeeTerms: termList,
          advisors: advList,
          womensTeamMembers: womensList,
          language: lang,
          founderImageUrl,
        } = latestRouteDataRef.current;

        const urlParams = new URLSearchParams(window.location.search);
        const queryPage = urlParams.get('page');
        const pathSlug = window.location.pathname.replace(/^\/+|\/+$/g, '');
        const rawHash = window.location.hash.replace('#', '');
        const hash = rawHash || queryPage || (resolveCategoryFromSlug(pathSlug) ? pathSlug : 'home');
        const isPopState = evt?.type === 'popstate';
        const isHashChange = evt?.type === 'hashchange';
        const popState = isPopState ? (evt as PopStateEvent).state : null;
        const wasProfile = wasProfileHashRef.current;
        wasProfileHashRef.current = hash.startsWith('profile/');

        setActiveSection(hash);

        // Handle direct QR Code Member Verification URL: #verify-member-[id]
        if (hash.startsWith('verify-member-')) {
          const rawTargetId = hash.replace('verify-member-', '');
          let targetId = rawTargetId;
          try {
            targetId = decodeURIComponent(rawTargetId);
          } catch {
            // use rawTargetId
          }
          const normalizedTarget = targetId.trim().toLowerCase();
          const matched = gmList.find(
            (m) =>
              String(m.membershipId || '').toLowerCase() === normalizedTarget ||
              String(m.id || '').toLowerCase() === normalizedTarget
          );
          if (matched) {
            setQrVerifiedMember(matched);
            setActiveCategory('members');
          } else {
            const currentCommittee = termList.find(t => t.isCurrent)?.members || TEAM_MEMBERS;
            const ecIndex = currentCommittee.findIndex(
              (c, idx) =>
                `clf-ec-${(idx + 1).toString().padStart(2, '0')}` === normalizedTarget ||
                String(c.id || '').toLowerCase() === normalizedTarget
            );
            if (ecIndex !== -1) {
              const c = currentCommittee[ecIndex];
              const ecId = `CLF-EC-${(ecIndex + 1).toString().padStart(2, '0')}`;
              setQrVerifiedMember({
                id: c.id,
                slNo: ecIndex + 1,
                membershipId: ecId,
                nameBn: c.nameBn,
                nameEn: c.nameEn,
                roleBn: c.roleBn,
                roleEn: c.roleEn,
                bloodGroup: c.bloodGroup || 'O+',
                district: c.district || (lang === 'bn' ? 'মৌলভীবাজার' : 'Moulvibazar'),
                joinedDate: c.joiningYear ? `${c.joiningYear}-01-01` : '2026-03-07',
                joiningYear: c.joiningYear || 2026,
                status: 'active',
                approvalStatus: 'approved',
                avatar: c.image,
                email: c.email,
              });
              setActiveCategory('committee');
            }
          }
          return;
        }

        // Handle direct shareable Member/Founder Profile URL: #profile/<slug>
        if (hash.startsWith('profile/')) {
          const rawSlug = hash.slice('profile/'.length);
          let decodedSlug = rawSlug;
          try {
            decodedSlug = decodeURIComponent(rawSlug);
          } catch {
            // fallback to rawSlug
          }
          const normalizedSlug = decodedSlug.trim().toLowerCase();
          const toSlug = (val?: string) =>
            (val || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

          const allCommitteeMembers = [
            ...(termList.find(t => t.isCurrent)?.members || TEAM_MEMBERS),
            ...termList.flatMap(t => t.members || []),
          ];
          const matchedCommittee = allCommitteeMembers.find(
            (m) =>
              ((normalizedSlug === 'founder' || normalizedSlug === 'president') && m.isFounder) ||
              String((m as { memberId?: string }).memberId || '').toLowerCase() === normalizedSlug ||
              String(m.id || '').toLowerCase() === normalizedSlug ||
              toSlug(m.nameEn) === normalizedSlug
          );
          if (matchedCommittee) {
            if (normalizedSlug === 'founder') {
              setSelectedMemberProfile({
                ...matchedCommittee,
                profileMode: 'founder',
                image: founderImageUrl || matchedCommittee.image,
                roleBn: 'প্রতিষ্ঠাতা · কোলাশ ফাউন্ডেশন',
                roleEn: 'Founder · CoLASH Foundation',
                category: 'প্রতিষ্ঠাতা পরিচিতি',
              });
            } else if (normalizedSlug === 'president') {
              setSelectedMemberProfile({
                ...matchedCommittee,
                profileMode: 'president',
                roleBn: 'সভাপতি · কোলাশ ফাউন্ডেশন',
                roleEn: 'President · CoLASH Foundation',
                category: 'অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮',
              });
            } else {
              setSelectedMemberProfile(matchedCommittee);
            }
            return;
          }

          const matchedGeneral = gmList.find(
            (m) =>
              String(m.membershipId || '').toLowerCase() === normalizedSlug ||
              String(m.id || '').toLowerCase() === normalizedSlug ||
              toSlug(m.nameEn) === normalizedSlug
          );
          if (matchedGeneral) {
            setSelectedMemberProfile({
              ...matchedGeneral,
              roleBn: matchedGeneral.roleBn,
              roleEn: matchedGeneral.roleEn,
              image: matchedGeneral.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              memberId: matchedGeneral.membershipId,
              joinDate: matchedGeneral.joinedDate,
              joiningYear: matchedGeneral.joiningYear || 2024,
              serviceYears: matchedGeneral.serviceYears ? Number(matchedGeneral.serviceYears) : (new Date().getFullYear() - Number(matchedGeneral.joiningYear || 2024)),
              previousPositions: matchedGeneral.previousPositions || [],
              category: 'সাধারণ পরিষদ',
            });
            return;
          }

          const matchedAdvisor = advList.find(
            (a) =>
              `colash-adv-${a.id}`.toLowerCase() === normalizedSlug ||
              String(a.id || '').toLowerCase() === normalizedSlug ||
              toSlug(a.nameEn) === normalizedSlug
          );
          if (matchedAdvisor) {
            setSelectedMemberProfile({
              ...matchedAdvisor,
              roleBn: matchedAdvisor.roleBn,
              roleEn: matchedAdvisor.roleEn,
              image: matchedAdvisor.image,
              memberId: `COLASH-ADV-${matchedAdvisor.id}`,
              joinDate: matchedAdvisor.joinedDate,
              category: matchedAdvisor.status === 'current' ? 'বর্তমান উপদেষ্টা' : 'সাবেক উপদেষ্টা',
            });
            return;
          }

          const matchedWomens = womensList.find(
            (w) =>
              String(w.membershipId || '').toLowerCase() === normalizedSlug ||
              String(w.id || '').toLowerCase() === normalizedSlug ||
              toSlug(w.nameEn) === normalizedSlug
          );
          if (matchedWomens) {
            setSelectedMemberProfile({
              ...matchedWomens,
              roleBn: matchedWomens.designationBn,
              roleEn: matchedWomens.designationEn,
              image: matchedWomens.photoUrl,
              memberId: matchedWomens.membershipId,
              joinDate: matchedWomens.joinedDate,
              category: "CoLASH Women's Wing",
            });
            return;
          }
        } else {
          // Closing profile automatically when user navigates back via browser history
          setSelectedMemberProfile(null);
        }

        // Map hash / query / path directly to separate page view
        const resolvedPage = resolveCategoryFromSlug(hash);
        if (['member-login', 'member_login', 'portal', 'login'].includes(hash)) {
          setPortalDefaultTab('login');
          setIsPortalOpen(true);
          return;
        }

        const nextCategory: PortalCategoryKey =
          resolvedPage || (hash === 'home' || hash === '' || hash === 'all' ? 'home' : activeCategoryRef.current);
        const currentCategory = activeCategoryRef.current;

        if (isPopState) {
          const stackTop = navigationStackRef.current[navigationStackRef.current.length - 1];
          if (!wasProfile && stackTop && stackTop.category === nextCategory) {
            navigationStackRef.current.pop();
          }
          const stateScrollY =
            popState && typeof popState === 'object' && typeof (popState as { scrollY?: unknown }).scrollY === 'number'
              ? (popState as { scrollY: number }).scrollY
              : null;
          const restoredY = stateScrollY !== null
            ? stateScrollY
            : (scrollByCategoryRef.current[nextCategory] ?? (wasProfile ? window.scrollY : 0));

          if (nextCategory !== currentCategory) {
            pendingScrollRestoreRef.current = restoredY;
            setActiveCategory(nextCategory);
          } else {
            window.requestAnimationFrame(() => {
              window.scrollTo({ top: Math.max(0, restoredY), behavior: 'auto' });
            });
          }
          return;
        }

        if (isHashChange) {
          if (nextCategory !== currentCategory) {
            const outgoingY = window.scrollY;
            scrollByCategoryRef.current[currentCategory] = outgoingY;
            navigationStackRef.current.push({ category: currentCategory, scrollY: outgoingY });
            pendingScrollRestoreRef.current = 0;
            setActiveCategory(nextCategory);
          }
          return;
        }

        // Initial page load from direct link/hash
        if (resolvedPage) {
          setActiveCategory(resolvedPage);
        } else if (hash === 'home' || hash === '' || hash === 'all') {
          setActiveCategory('home');
        }
      } catch (err) {
        console.error('Route/hash handling error:', err);
        setActiveCategory('home');
      }
    };

    // Run on initial mount so direct URL with hash works cleanly
    handleHashChange();

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update document title dynamically when navigating between dedicated shareable pages
  useEffect(() => {
    const themeCfg = getPageTheme(activeCategory);
    if (activeCategory === 'all' || activeCategory === 'home') {
      document.title = 'COLASH | মানবতার জন্য আলো এবং সেবার বলয় - Circle of Light and Service for Humanity';
    } else {
      document.title = `${language === 'bn' ? themeCfg.titleBn : themeCfg.titleEn} | COLASH Foundation`;
    }
  }, [activeCategory, language]);

  // Unified page navigation preserving outgoing scroll position for Back restoration
  const navigateToCategory = (cat: PortalCategoryKey) => {
    const effectiveCat: PortalCategoryKey = cat === 'committee_history' ? 'committee' : cat;
    const currentCat = activeCategoryRef.current;
    const currentY = window.scrollY;
    const canonicalSlug = getCanonicalCategorySlug(effectiveCat);

    scrollByCategoryRef.current[currentCat] = currentY;
    setActiveSection(canonicalSlug);

    if (effectiveCat === currentCat) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsTransitioning(false);
      return;
    }

    try {
      const existingState = (window.history.state && typeof window.history.state === 'object') ? window.history.state : {};
      window.history.replaceState({ ...existingState, category: currentCat, scrollY: currentY }, '');
    } catch {
      // ignore history errors
    }
    navigationStackRef.current.push({ category: currentCat, scrollY: currentY });

    pendingScrollRestoreRef.current = 0;
    setActiveCategory(effectiveCat);
    try {
      window.history.pushState({ category: effectiveCat, scrollY: 0 }, '', `#${canonicalSlug}`);
    } catch {
      // ignore history errors
    }
    setIsTransitioning(false);
  };

  // Restore exact previous page & exact scroll position when clicking Back
  const handleGoBack = () => {
    const prevEntry = navigationStackRef.current.pop();
    const targetCat: PortalCategoryKey = prevEntry?.category || 'home';
    const targetY = typeof prevEntry?.scrollY === 'number'
      ? prevEntry.scrollY
      : (scrollByCategoryRef.current[targetCat] ?? 0);
    const canonicalSlug = getCanonicalCategorySlug(targetCat);

    setActiveSection(canonicalSlug);
    if (targetCat === activeCategoryRef.current) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' });
      });
    } else {
      pendingScrollRestoreRef.current = targetY;
      setActiveCategory(targetCat);
    }

    try {
      window.history.replaceState({ category: targetCat, scrollY: targetY }, '', `#${canonicalSlug}`);
    } catch {
      // ignore history errors
    }
    setIsTransitioning(false);
  };

  // Section 5.2: Smooth and responsive navigation across all dedicated shareable pages
  const handleNavigateSection = (sectionId: string) => {
    if (['member-login', 'member_login', 'login', 'portal'].includes(sectionId)) {
      setPortalDefaultTab('login');
      setIsPortalOpen(true);
      return;
    }
    const targetCategory = resolveCategoryFromSlug(sectionId) || 'home';
    navigateToCategory(targetCategory);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    addToast(
      'info',
      newTheme === 'dark' ? 'ডার্ক মোড সক্রিয় করা হয়েছে' : 'লাইট মোড সক্রিয় করা হয়েছে',
      newTheme === 'dark' ? 'Switched to Dark Theme' : 'Switched to Light Theme'
    );
  };

  const handleOpenDonate = (project?: Project | null) => {
    setSelectedDonationProject(project || null);
    setIsDonationOpen(false);
    handleSelectCategory('donate');
  };

  const handleOpenSponsorship = (project?: Project | null) => {
    setSponsorshipTargetProject(project || null);
    setIsSponsorshipModalOpen(true);
  };

  const handleOpenVolunteer = () => {
    setPortalDefaultTab('register');
    setPortalDefaultViewTab('card');
    setIsPortalOpen(true);
  };

  const handleOpenPortal = () => {
    setPortalDefaultTab('login');
    setPortalDefaultViewTab('card');
    setIsPortalOpen(true);
  };

  const handleEditOwnProfile = () => {
    setSelectedMemberProfile(null);
    setPortalDefaultTab('login');
    setPortalDefaultViewTab('edit');
    setIsPortalOpen(true);
  };

  // When a donation is submitted
  const handleDonationSuccess = (newDonation: Donation) => {
    setDonations(prev => {
      const next = [newDonation, ...prev];
      persistState('donations', next);
      return next;
    });
    if (firebaseUser?.emailVerified) {
      void submitDonationRecordToFirestore(firebaseUser, newDonation);
    }

    // Update matching project target if applicable
    if (newDonation.purpose && newDonation.purpose !== 'general') {
      setProjects(prevProjects => {
        const nextProjects = prevProjects.map(p => {
          if (p.id === newDonation.purpose) {
            return {
              ...p,
              raisedAmount: p.raisedAmount + newDonation.amount,
              donorsCount: p.donorsCount + 1
            };
          }
          return p;
        });
        persistState('projects', nextProjects);
        return nextProjects;
      });
    }

    // Add to public financial audit ledger
    const newRecord = {
      id: `fn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'income' as const,
      category: 'Public Online Contribution',
      amount: newDonation.amount,
      project: newDonation.purpose,
      voucherNumber: newDonation.receiptNumber,
      descriptionBn: `${newDonation.purposeNameBn} প্রকল্পে অনলাইন অনুদান (${newDonation.donorName})`,
      descriptionEn: `Online donation for ${newDonation.purposeNameEn} (${newDonation.donorName})`
    };
    setFinancialRecords(prev => {
      const next = [newRecord, ...prev];
      persistState('financialRecords', next);
      return next;
    });

    addToast(
      'success',
      language === 'bn' ? 'অনুদান সফলভাবে গৃহীত হয়েছে!' : 'Donation Successfully Verified!',
      `${newDonation.receiptNumber} - BDT ${newDonation.amount.toLocaleString()}`
    );
  };

  const handleRegisterVolunteer = (newVol: Volunteer) => {
    setVolunteers(prev => {
      const next = [newVol, ...prev];
      persistState('volunteers', next);
      return next;
    });
  };

  const handleToggleDonationVerify = (id: string) => {
    setDonations(prev => {
      const next = prev.map(d => {
        if (d.id === id) {
          const updated = !d.isVerified;
          addToast(
            'info',
            updated ? 'অনুদান ভেরিফাইড হিসেবে চিহ্নিত' : 'অনুদান পেন্ডিং হিসেবে চিহ্নিত',
            `Receipt: ${d.receiptNumber}`
          );
          return { ...d, isVerified: updated };
        }
        return d;
      });
      persistState('donations', next);
      return next;
    });
  };

  const handleDeleteDonation = (id: string) => {
    setDonations(prev => {
      const updated = prev.filter(d => d.id !== id);
      persistState('donations', updated);
      return updated;
    });
    addToast('info', language === 'bn' ? 'অনুদান রেকর্ড মুছে ফেলা হয়েছে' : 'Donation record deleted');
  };

  const handleApproveVolunteer = (id: string) => {
    setVolunteers(prev => {
      const updated = prev.map(v => {
        if (v.id === id) {
          addToast(
            'success',
            'স্বেচ্ছাসেবক অনুমোদন সম্পন্ন',
            `${v.fullName} (ID: ${v.id})`
          );
          return { ...v, status: 'active' as const, volunteerHours: v.volunteerHours + 5 };
        }
        return v;
      });
      persistState('volunteers', updated);
      return updated;
    });
  };

  const handleAddVolunteer = (newVol: Volunteer) => {
    setVolunteers(prev => {
      const updated = [newVol, ...prev];
      persistState('volunteers', updated);
      return updated;
    });
    addToast('success', language === 'bn' ? 'নতুন স্বেচ্ছাসেবী সফলভাবে যুক্ত হয়েছে' : 'Volunteer Added', newVol.fullName);
  };

  const handleUpdateVolunteer = (updatedVol: Volunteer) => {
    setVolunteers(prev => {
      const updated = prev.map(v => v.id === updatedVol.id ? updatedVol : v);
      persistState('volunteers', updated);
      return updated;
    });
    addToast('success', language === 'bn' ? 'স্বেচ্ছাসেবী তথ্য আপডেট হয়েছে' : 'Volunteer Updated', updatedVol.fullName);
  };

  const handleDeleteVolunteer = (id: string) => {
    const target = volunteers.find(v => v.id === id);
    setVolunteers(prev => {
      const updated = prev.filter(v => v.id !== id);
      persistState('volunteers', updated);
      return updated;
    });
    addToast('info', language === 'bn' ? 'স্বেচ্ছাসেবী মুছে ফেলা হয়েছে' : 'Volunteer Deleted', target?.fullName);
  };

  const handleDeleteAuditLog = (id: string) => {
    setAuditLogs(prev => {
      const updated = prev.filter(l => l.id !== id);
      persistState('auditLogs', updated);
      return updated;
    });
    addToast('info', language === 'bn' ? 'অডিট রেকর্ড মুছে ফেলা হয়েছে' : 'Audit record deleted');
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    persistState('auditLogs', []);
    addToast('info', language === 'bn' ? 'সকল অডিট রেকর্ড মুছে ফেলা হয়েছে' : 'All audit records cleared');
  };

  const handleAddNewProject = (project: Project) => {
    setProjects(prev => {
      const updated = [project, ...prev];
      persistState('projects', updated);
      return updated;
    });
    addToast(
      'success',
      language === 'bn' ? 'নতুন মানবিক প্রকল্প যুক্ত করা হয়েছে' : 'New Project Created',
      project.titleBn
    );
  };

  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === updatedProj.id ? updatedProj : p);
      persistState('projects', updated);
      return updated;
    });
    addToast(
      'success',
      language === 'bn' ? 'প্রকল্প সফলভাবে সম্পাদনা করা হয়েছে' : 'Project Updated Successfully',
      updatedProj.titleBn
    );
  };

  const handleDeleteProject = (projId: string) => {
    const target = projects.find(p => p.id === projId);
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== projId);
      persistState('projects', updated);
      return updated;
    });
    addToast(
      'info',
      language === 'bn' ? 'প্রকল্প মুছে ফেলা হয়েছে' : 'Project Deleted',
      target?.titleBn
    );
  };

  const handleAddNewNotice = (notice: NoticeItem) => {
    setNotices(prev => {
      const updated = [notice, ...prev];
      persistState('notices', updated);
      return updated;
    });
    addToast(
      'success',
      'নতুন বিজ্ঞপ্তি প্রকাশিত হয়েছে',
      notice.titleBn
    );
  };

  const handleDeleteNotice = (noticeId: string) => {
    setNotices(prev => {
      const updated = prev.filter(n => n.id !== noticeId);
      persistState('notices', updated);
      return updated;
    });
    addToast('info', language === 'bn' ? 'বিজ্ঞপ্তি মুছে ফেলা হয়েছে' : 'Notice Deleted');
  };

  // Public Applications Handlers
  const handleAddNewApplication = (newApp: PublicApplication) => {
    setPublicApplications(prev => {
      const updated = [newApp, ...prev];
      persistState('publicApplications', updated);
      return updated;
    });
    if (firebaseUser?.emailVerified) {
      void submitPublicApplicationToFirestore(firebaseUser, newApp);
    }
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).catch(() => {});
  };

  const handleUpdateApplication = (updatedApp: PublicApplication) => {
    setPublicApplications(prev => {
      const updatedList = prev.map(a => a.id === updatedApp.id ? updatedApp : a);
      persistState('publicApplications', updatedList);
      return updatedList;
    });
    fetch(`/api/applications/${updatedApp.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedApp)
    }).catch(err => console.warn(err));
  };

  // Sponsorship Handlers (Individual & Organizational)
  const handleSubmitSponsorship = (proposal: SponsorshipProposal) => {
    setSponsorships(prev => {
      const next = [proposal, ...prev];
      persistState('sponsorships', next);
      return next;
    });
    fetch('/api/sponsorships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal)
    }).catch(err => console.warn(err));

    const sponsorDisplayName =
      proposal.sponsorType === 'organization' && proposal.organizationName
        ? `${proposal.organizationName} (${proposal.sponsorName})`
        : proposal.sponsorName;

    handleAddNewApplication({
      id: `app-${Date.now()}`,
      trackingId: proposal.trackingId,
      category: 'sponsorship',
      name: sponsorDisplayName,
      phone: proposal.phone,
      email: proposal.email,
      district: proposal.district,
      subject: `স্পনসরশিপ প্রস্তাব: ${proposal.targetProjectTitleBn}`,
      message: `${proposal.howToHelpBn}${proposal.estimatedAmount ? ` | সম্ভাব্য বাজেট: ৳${proposal.estimatedAmount.toLocaleString('en-IN')}` : ''}`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  };

  const handleUpdateSponsorshipStatus = (id: string, status: SponsorshipProposal['status']) => {
    const target = sponsorships.find(s => s.id === id);
    setSponsorships(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, status } : s));
      persistState('sponsorships', next);
      return next;
    });
    fetch(`/api/sponsorships/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.warn(err));

    appendAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminId: currentAdmin?.id || 'adm-super-1',
      adminName: currentAdmin?.name || 'Super Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      actionBn: `স্পনসরশিপ প্রস্তাব (${target?.trackingId || id}) স্ট্যাটাস "${status}"-এ পরিবর্তন করেছেন`,
      actionEn: `Updated sponsorship proposal ${target?.trackingId || id} to ${status}`,
      category: 'donation'
    });

    addToast(
      'success',
      language === 'bn' ? 'স্পনসরশিপ স্ট্যাটাস হালনাগাদ হয়েছে' : 'Sponsorship Status Updated',
      status === 'approved'
        ? (language === 'bn' ? 'এখন এটি হোমপেজের প্রকল্প অবদানে দেখা যাবে।' : 'Now live in Project Contributions.')
        : undefined
    );
  };

  // Non-Member Voluntary Blood Donor Handlers
  const handleRegisterPublicBloodDonor = (donor: PublicBloodDonor) => {
    setPublicBloodDonors(prev => {
      const next = [donor, ...prev];
      persistState('publicBloodDonors', next);
      return next;
    });
    fetch('/api/blood-donors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donor)
    }).catch(err => console.warn(err));
  };

  const handleDeletePublicBloodDonor = (id: string) => {
    setPublicBloodDonors(prev => {
      const next = prev.filter(d => d.id !== id);
      persistState('publicBloodDonors', next);
      return next;
    });
    fetch(`/api/blood-donors/${id}`, {
      method: 'DELETE'
    }).catch(err => console.warn(err));
    addToast('info', language === 'bn' ? 'রক্তদাতার এন্ট্রি মুছে ফেলা হয়েছে' : 'Blood donor entry removed');
  };

  // AI Conversation Logs Handler
  const handleLogAIConversation = (newLog: AIConversationLog) => {
    setAiConversationLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 500);
      persistState('aiConversationLogs', updated);
      return updated;
    });
  };

  // Full JSON Backup Restore Handler
  const handleRestoreBackup = (parsed: any) => {
    const bulk: Partial<Record<StateKey, unknown>> = {};
    if (Array.isArray(parsed.projects)) {
      setProjects(parsed.projects);
      writeLocalStorageSafely(STORAGE_KEY_MAP.projects, parsed.projects);
      bulk.projects = parsed.projects;
    }
    if (Array.isArray(parsed.notices)) {
      setNotices(parsed.notices);
      writeLocalStorageSafely(STORAGE_KEY_MAP.notices, parsed.notices);
      bulk.notices = parsed.notices;
    }
    if (Array.isArray(parsed.donations)) {
      setDonations(parsed.donations);
      writeLocalStorageSafely(STORAGE_KEY_MAP.donations, parsed.donations);
      bulk.donations = parsed.donations;
    }
    if (Array.isArray(parsed.volunteers)) {
      setVolunteers(parsed.volunteers);
      writeLocalStorageSafely(STORAGE_KEY_MAP.volunteers, parsed.volunteers);
      bulk.volunteers = parsed.volunteers;
    }
    if (Array.isArray(parsed.financialRecords)) {
      setFinancialRecords(parsed.financialRecords);
      writeLocalStorageSafely(STORAGE_KEY_MAP.financialRecords, parsed.financialRecords);
      bulk.financialRecords = parsed.financialRecords;
    }
    if (Array.isArray(parsed.generalMembers)) {
      setGeneralMembers(parsed.generalMembers);
      writeLocalStorageSafely(STORAGE_KEY_MAP.generalMembers, parsed.generalMembers);
      bulk.generalMembers = parsed.generalMembers;
    }
    if (Array.isArray(parsed.committeeTerms)) {
      setCommitteeTerms(parsed.committeeTerms);
      writeLocalStorageSafely(STORAGE_KEY_MAP.committeeTerms, parsed.committeeTerms);
      bulk.committeeTerms = parsed.committeeTerms;
    }
    if (Array.isArray(parsed.advisors)) {
      setAdvisors(parsed.advisors);
      writeLocalStorageSafely(STORAGE_KEY_MAP.advisors, parsed.advisors);
      bulk.advisors = parsed.advisors;
    }
    if (Array.isArray(parsed.paymentChannels)) {
      setPaymentChannels(parsed.paymentChannels);
      writeLocalStorageSafely(STORAGE_KEY_MAP.paymentChannels, parsed.paymentChannels);
      bulk.paymentChannels = parsed.paymentChannels;
    }
    if (parsed.websiteConfig) {
      const cleanedCfg = sanitizeWebsiteConfig(parsed.websiteConfig);
      setWebsiteCustomConfig(cleanedCfg);
      writeLocalStorageSafely(STORAGE_KEY_MAP.websiteCustomConfig, cleanedCfg);
      bulk.websiteCustomConfig = cleanedCfg;
    }
    if (Array.isArray(parsed.womensTeamMembers)) {
      setWomensTeamMembers(parsed.womensTeamMembers);
      writeLocalStorageSafely(STORAGE_KEY_MAP.womensTeamMembers, parsed.womensTeamMembers);
      bulk.womensTeamMembers = parsed.womensTeamMembers;
    }
    if (parsed.mapConfig) {
      setMapConfig(parsed.mapConfig);
      writeLocalStorageSafely(STORAGE_KEY_MAP.mapConfig, parsed.mapConfig);
      bulk.mapConfig = parsed.mapConfig;
    }
    if (Array.isArray(parsed.aiKnowledgeBase)) {
      setAiKnowledgeBase(parsed.aiKnowledgeBase);
      writeLocalStorageSafely(STORAGE_KEY_MAP.aiKnowledgeBase, parsed.aiKnowledgeBase);
      bulk.aiKnowledgeBase = parsed.aiKnowledgeBase;
    }
    if (Object.keys(bulk).length > 0) {
      void syncBulkStateToServer(bulk);
    }
  };

  // Category & Separate Page Selection
  const handleSelectCategory = (cat: PortalCategoryKey) => {
    navigateToCategory(cat);
  };

  const getCategoryTitle = (cat: PortalCategoryKey) => {
    switch (cat) {
      case 'home':
      case 'all': return language === 'bn' ? 'হোম পেজ' : 'Home Page';
      case 'founder': return language === 'bn' ? 'প্রতিষ্ঠাতা পরিচিতি ও দর্শন (Founder)' : 'Founder Profile & Vision';
      case 'about': return language === 'bn' ? 'পরিচিতি ও লক্ষ্য (About Us)' : 'About Us';
      case 'donate': return language === 'bn' ? 'অনুদান ও ধর্মীয় বাণী (৳১ থেকে)' : 'Donate & Interfaith Teachings';
      case 'committee':
      case 'committee_history':
        return language === 'bn' ? 'কার্যনির্বাহী পরিষদ ২০২৬–২০২৮ (Executive Committee)' : 'Executive Committee 2026–2028';
      case 'advisors': return language === 'bn' ? 'উপদেষ্টামণ্ডলী পরিষদ (Advisory Council)' : 'Advisory Council';
      case 'members': return language === 'bn' ? 'সাধারণ সদস্যবৃন্দ তালিকা (General Members Directory)' : 'General Members Directory';
      case 'womens_team': return language === 'bn' ? 'উইমেন্স টিম উইং (Women’s Team Autonomous Wing)' : "Women's Team Wing";
      case 'activities': return language === 'bn' ? 'কার্যক্রম ও প্রকল্পসমূহ (Activities & Projects)' : 'Activities & Projects';
      case 'transparency': return language === 'bn' ? 'আর্থিক স্বচ্ছতা ও অডিট লেজার (Financial Transparency)' : 'Financial Transparency';
      case 'notices': return language === 'bn' ? 'বিজ্ঞপ্তি ও বুলেটিন (Notices & Bulletins)' : 'Notices & Bulletins';
      case 'emergency_notice': return language === 'bn' ? 'জরুরি মানবিক বিজ্ঞপ্তি ও ত্রাণ তহবিল (Emergency Relief)' : 'Emergency Relief Notice';
      case 'applications': return language === 'bn' ? 'নাগরিক আবেদন ও ট্র্যাকিং (Public Applications)' : 'Public Applications & Tracking';
      case 'notices_applications': return language === 'bn' ? 'বিজ্ঞপ্তি, অডিট রিপোর্ট ও নাগরিক আবেদন' : 'Notices, Audit Reports & Public Applications';
      case 'faq': return language === 'bn' ? 'সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)' : 'Frequently Asked Questions (FAQ)';
      case 'branches': return language === 'bn' ? 'সারা বাংলাদেশে কোলাশ শাখা (৬৪ জেলা)' : 'Bangladesh Branches (64 Districts)';
      case 'contact_location': return language === 'bn' ? 'যোগাযোগ, বাংলাদেশ শাখা ও ম্যাপ' : 'Contact, Branches & Location';
      default: return language === 'bn' ? 'বিভাগীয় পেজ' : 'Department Page';
    }
  };

  const currentPageTheme = getPageTheme(activeCategory);
  const currentShareContent = getPageShareContent(activeCategory, language);
  const currentShareablePageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#${currentPageTheme.slug}`
      : `#${currentPageTheme.slug}`;

  const handleCopyPageLink = () => {
    navigator.clipboard?.writeText(currentShareablePageUrl)?.catch(() => {});
    setCopiedPageLink(true);
    addToast(
      'success',
      language === 'bn' ? 'এই পেজের সরাসরি লিংক কপি হয়েছে' : 'Direct Page Link Copied',
      currentShareablePageUrl
    );
    setTimeout(() => setCopiedPageLink(false), 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col text-[#102B3F] dark:text-stone-100 transition-all duration-300"
      style={
        theme === 'dark'
          ? currentPageTheme.darkContainerStyle
          : {
              ...currentPageTheme.lightContainerStyle,
              ...(activeCategory === 'all' || activeCategory === 'home'
                ? websiteCustomConfig.bgTone && websiteCustomConfig.bgTone !== '#F5F3ED'
                  ? { backgroundColor: websiteCustomConfig.bgTone }
                  : {}
                : {}),
            }
      }
    >
      {isMapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navbar with Active Section Sync */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenDonate={() => handleOpenDonate(null)}
        onOpenPortal={handleOpenPortal}
        onOpenAdmin={() => {
          if (socialNewsFeed.some((i) => i.status === 'pending')) {
            setAdminInitialTab('social_news_hub');
          } else {
            setAdminInitialTab('overview');
          }
          setIsAdminOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenScanner={() => setIsGlobalScannerOpen(true)}
        onOpenLinkImporter={() => setIsLinkImporterOpen(true)}
        pendingSocialNewsCount={socialNewsFeed.filter((i) => i.status === 'pending').length}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        websiteConfig={websiteCustomConfig}
      />

      {/* Sequential Live Notices, Programs & Nation-Builder Welcome Runner */}
      <TopAnnouncementRunner
        language={language}
        notices={notices}
        events={EVENTS_DATA}
        projects={projects}
        websiteConfig={websiteCustomConfig}
        onSelectCategory={handleSelectCategory}
        onOpenDonate={() => handleOpenDonate(null)}
        onOpenVolunteer={handleOpenVolunteer}
      />

      {/* Main Page Layout with transition container */}
      <main className={`flex-1 transition-opacity duration-200 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
        
        {/* ======================================================== */}
        {/* SEPARATE PAGE VIEWS (When a specific page is selected) */}
        {/* ======================================================== */}
        {activeCategory !== 'all' && activeCategory !== 'home' ? (
          <div id="category-content-view" className="pt-1.5 pb-5 space-y-3">

            {/* Slim Non-Sticky Single-Row Top Bar (leaves full viewport open on phones & desktops) */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6">
              <div className="flex items-center justify-between gap-2 py-1.5 border-b border-stone-200/70 dark:border-stone-800/70">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-[#0c1a24]/80 hover:bg-[#167D78] hover:text-white dark:hover:bg-[#167D78] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    ← {language === 'bn' ? 'ফিরে যান' : 'Back'}
                  </button>
                  <span className="text-stone-400 text-xs shrink-0">/</span>
                  <span className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] truncate">
                    {getCategoryTitle(activeCategory)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                  <SharePageButton
                    language={language}
                    title={currentShareContent.title}
                    text={currentShareContent.text}
                    url={currentShareablePageUrl}
                    onSharedToast={(title, subtitle) => addToast('success', title, subtitle)}
                  />
                  <button
                    type="button"
                    onClick={handleCopyPageLink}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#102B3F] hover:bg-[#167D78] text-white font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    title={language === 'bn' ? 'এই পেজের সরাসরি লিংক কপি করুন' : 'Copy Direct Page Link'}
                  >
                    {copiedPageLink ? <Check className="w-3 h-3 text-[#D6F36A]" /> : <Copy className="w-3 h-3 text-[#D6F36A]" />}
                    <span className="hidden sm:inline">{copiedPageLink ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'লিংক কপি' : 'Copy Link')}</span>
                  </button>
                  <a
                    href={`#${currentPageTheme.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/80 dark:bg-[#0c1a24]/80 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 text-[#167D78] dark:text-[#D6F36A] transition-colors shrink-0"
                    title={language === 'bn' ? 'নতুন ট্যাবে এই পেজ খুলুন' : 'Open This Page in New Tab'}
                    aria-label="Open page in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 0. Dedicated Founder Page (#founder) */}
            {activeCategory === 'founder' && (
              <ScrollReveal direction="up">
                <FounderPageSection
                  language={language}
                  founderMember={(committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS).find(m => m.isFounder) || TEAM_MEMBERS[0]}
                  websiteConfig={websiteCustomConfig}
                  onOpenFounderProfile={() => {
                    const f = (committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS).find(m => m.isFounder) || TEAM_MEMBERS[0];
                    setSelectedMemberProfile({
                      ...f,
                      profileMode: 'founder',
                      image: websiteCustomConfig.founderImageUrl || f.image,
                      roleBn: 'প্রতিষ্ঠাতা · কোলাশ ফাউন্ডেশন',
                      roleEn: 'Founder · CoLASH Foundation',
                      category: 'প্রতিষ্ঠাতা পরিচিতি',
                    });
                  }}
                  onSelectCategory={handleSelectCategory}
                  onOpenDonate={() => handleOpenDonate(null)}
                />
              </ScrollReveal>
            )}

            {/* 1. About Us View */}
            {activeCategory === 'about' && (
              <ScrollReveal direction="up">
                <div className="space-y-4">
                  <AboutSection
                    displayMode="about_only"
                    team={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
                    generalMembers={generalMembers}
                    committeeTerms={committeeTerms}
                    advisors={advisors}
                    language={language}
                    initialTab="central"
                    hidePillars={false}
                    onSelectMemberProfile={setSelectedMemberProfile}
                    onSelectCategory={handleSelectCategory}
                    onVerifyMember={(member, fromScan) => {
                      setQrVerifiedFromScan(Boolean(fromScan));
                      setQrVerifiedMember(member);
                    }}
                    websiteConfig={websiteCustomConfig}
                    currentAdmin={currentAdmin}
                    loggedInMember={loggedInMember}
                    currentWomensUser={currentWomensUser}
                    onOpenPortal={handleOpenPortal}
                    onOpenAdmin={() => setIsAdminOpen(true)}
                    onEditOwnProfile={handleEditOwnProfile}
                    publicBloodDonors={publicBloodDonors}
                    onOpenBloodDonorModal={() => setIsBloodDonorModalOpen(true)}
                  />
                  <FAQSection
                    language={language}
                    onSelectCategory={handleSelectCategory}
                    onOpenDonate={() => handleOpenDonate(null)}
                    showDedicatedBanner={true}
                  />
                </div>
              </ScrollReveal>
            )}

            {/* 1b. Dedicated Donate Page (#donate) */}
            {activeCategory === 'donate' && (
              <ScrollReveal direction="up">
                <DonationPageSection
                  language={language}
                  projects={projects}
                  preselectedProject={selectedDonationProject}
                  websiteConfig={websiteCustomConfig}
                  paymentChannels={paymentChannels}
                  onDonationSuccess={handleDonationSuccess}
                  onToast={addToast}
                />
              </ScrollReveal>
            )}

            {/* 2. Current Committee View (Executive Committee only) */}
            {activeCategory === 'committee' && (
              <ScrollReveal direction="up">
                <AboutSection
                  displayMode="committee_only"
                  team={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
                  generalMembers={generalMembers}
                  committeeTerms={committeeTerms}
                  advisors={advisors}
                  language={language}
                  initialTab="central"
                  hidePillars={true}
                  onSelectMemberProfile={setSelectedMemberProfile}
                  onSelectCategory={handleSelectCategory}
                  websiteConfig={websiteCustomConfig}
                  currentAdmin={currentAdmin}
                  loggedInMember={loggedInMember}
                  currentWomensUser={currentWomensUser}
                  onOpenPortal={handleOpenPortal}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                  onEditOwnProfile={handleEditOwnProfile}
                />
              </ScrollReveal>
            )}

            {/* 2b. Committee History View (Archived Past Committees) */}
            {activeCategory === 'committee_history' && (
              <ScrollReveal direction="up">
                <AboutSection
                  displayMode="history_only"
                  team={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
                  generalMembers={generalMembers}
                  committeeTerms={committeeTerms}
                  advisors={advisors}
                  language={language}
                  initialTab="history"
                  hidePillars={true}
                  onSelectMemberProfile={setSelectedMemberProfile}
                  websiteConfig={websiteCustomConfig}
                  currentAdmin={currentAdmin}
                  loggedInMember={loggedInMember}
                  currentWomensUser={currentWomensUser}
                  onOpenPortal={handleOpenPortal}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                  onEditOwnProfile={handleEditOwnProfile}
                />
              </ScrollReveal>
            )}

            {/* 2c. Advisory Council View (Current & Former Advisors) */}
            {activeCategory === 'advisors' && (
              <ScrollReveal direction="up">
                <AboutSection
                  displayMode="advisory_only"
                  team={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
                  generalMembers={generalMembers}
                  committeeTerms={committeeTerms}
                  advisors={advisors}
                  language={language}
                  initialTab="advisory"
                  hidePillars={true}
                  onSelectMemberProfile={setSelectedMemberProfile}
                  websiteConfig={websiteCustomConfig}
                  currentAdmin={currentAdmin}
                  loggedInMember={loggedInMember}
                  currentWomensUser={currentWomensUser}
                  onOpenPortal={handleOpenPortal}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                  onEditOwnProfile={handleEditOwnProfile}
                />
              </ScrollReveal>
            )}

            {/* 3. General Members View (Directory with Blood Group & District Filter) */}
            {activeCategory === 'members' && (
              <ScrollReveal direction="up">
                <AboutSection
                  displayMode="members_only"
                  team={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
                  generalMembers={generalMembers}
                  committeeTerms={committeeTerms}
                  advisors={advisors}
                  language={language}
                  initialTab="general"
                  hidePillars={true}
                  onSelectMemberProfile={setSelectedMemberProfile}
                  onVerifyMember={(member, fromScan) => {
                    setQrVerifiedFromScan(Boolean(fromScan));
                    setQrVerifiedMember(member);
                  }}
                  websiteConfig={websiteCustomConfig}
                  birthdayMembers={currentMonthBirthdayMembers}
                  currentAdmin={currentAdmin}
                  loggedInMember={loggedInMember}
                  currentWomensUser={currentWomensUser}
                  onOpenPortal={handleOpenPortal}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                  onEditOwnProfile={handleEditOwnProfile}
                  publicBloodDonors={publicBloodDonors}
                  onOpenBloodDonorModal={() => setIsBloodDonorModalOpen(true)}
                  onToast={addToast}
                />
              </ScrollReveal>
            )}

            {/* 4. Women's Team Autonomous Wing View */}
            {activeCategory === 'womens_team' && (
              <ScrollReveal direction="up">
                <WomensTeamSection
                  config={womensTeamConfig}
                  members={womensTeamMembers}
                  activities={womensTeamActivities}
                  documents={womensTeamDocuments}
                  notices={womensTeamNotices}
                  language={language}
                  currentUser={currentWomensUser}
                  onLogin={handleWomensLogin}
                  onLogout={handleWomensLogout}
                  onOpenMemberPortal={() => {
                    setWomensMemberModalInitialTab('login');
                    setIsWomensMemberModalOpen(true);
                  }}
                  onOpenRegister={() => {
                    setWomensMemberModalInitialTab('register');
                    setIsWomensMemberModalOpen(true);
                  }}
                  onOpenAdminPanel={() => setIsWomensAdminModalOpen(true)}
                  onToast={addToast}
                  onSelectMemberProfile={setSelectedMemberProfile}
                />
              </ScrollReveal>
            )}

            {/* 5. Activities View (Projects, Transparency, Events & Field Gallery) */}
            {activeCategory === 'activities' && (
              <div className="space-y-6">
                <ProjectsSection
                  projects={projects}
                  language={language}
                  onSelectProjectForDonation={(proj) => handleOpenDonate(proj)}
                  onSelectProjectForSponsorship={(proj) => handleOpenSponsorship(proj)}
                />
                <TransparencySection
                  records={financialRecords}
                  projects={projects}
                  donations={donations}
                  mapConfig={mapConfig}
                  language={language}
                  onToast={addToast}
                />
                <EventsAndNews
                  events={EVENTS_DATA}
                  notices={notices}
                  language={language}
                  socialNewsFeed={socialNewsFeed}
                  onOpenLinkImporter={() => setIsLinkImporterOpen(true)}
                />
                <GallerySection
                  language={language}
                />
              </div>
            )}

            {/* 6. Transparency View */}
            {activeCategory === 'transparency' && (
              <div className="space-y-6">
                <TransparencySection
                  records={financialRecords}
                  projects={projects}
                  donations={donations}
                  mapConfig={mapConfig}
                  language={language}
                  onToast={addToast}
                />
              </div>
            )}

            {/* 7. Notices View */}
            {activeCategory === 'notices' && (
              <div className="space-y-6">
                <EventsAndNews
                  events={EVENTS_DATA}
                  notices={notices}
                  language={language}
                  socialNewsFeed={socialNewsFeed}
                  onOpenLinkImporter={() => setIsLinkImporterOpen(true)}
                />
              </div>
            )}

            {/* Emergency Notice Dedicated Page View */}
            {activeCategory === 'emergency_notice' && (
              <div className="space-y-6">
                <EmergencyNoticePage
                  language={language}
                  onBackToHome={handleGoBack}
                  onOpenDonate={(purpose) => {
                    const matchedProj = projects.find(p => p.id === purpose || p.id === 'proj-flood-rehab') || null;
                    handleOpenDonate(matchedProj);
                  }}
                  onNavigateSection={handleNavigateSection}
                  websiteConfig={websiteCustomConfig}
                  paymentChannels={paymentChannels}
                  onToast={addToast}
                />
              </div>
            )}

            {/* 8. Applications & Tracking View */}
            {activeCategory === 'applications' && (
              <div className="space-y-6">
                <PublicApplicationSection
                  language={language}
                  applications={publicApplications}
                  onSubmitApplication={handleAddNewApplication}
                  onToast={addToast}
                />
              </div>
            )}

            {/* Dedicated Notices, Audit Reports & Public Applications View */}
            {activeCategory === 'notices_applications' && (
              <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Dedicated Top Audit & Portal Showcase Header */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#102B3F] via-[#0e2738] to-[#167D78] text-white border border-teal-500/30 shadow-xl">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-3xl">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D6F36A] text-[#102B3F] shadow-sm">
                          {language === 'bn' ? 'আর্থিক বিবরণী ও প্রকাশনা' : 'Financial Statement 2025-26'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/15">
                          {language === 'bn' ? 'অভ্যন্তরীণ হিসাব ও উন্মুক্ত নথি' : 'Internal Ledger & Transparency'}
                        </span>
                        <span className="text-xs text-stone-300 font-mono">
                          নথি সূত্র: CLSH-FIN-2026
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-3xl stylish-title-on-dark leading-tight">
                        {language === 'bn'
                          ? '২০২৫-২০২৬ অর্থবছরের অভ্যন্তরীণ আয়-ব্যয় বিবরণী ও বার্ষিক প্রতিবেদন'
                          : 'Annual Internal Financial Statement & Public Applications'}
                      </h2>

                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                        {language === 'bn'
                          ? 'কোলাশ ফাউন্ডেশনের ২০২৫-২০২৬ অর্থবছরের আয়-ব্যয়ের প্রাথমিক হিসাব অর্থ সচিবালয়ের অভ্যন্তরীণ নথির ভিত্তিতে সর্বসাধারণের দেখার জন্য উন্মুক্ত করা হলো। উল্লেখ্য, এখনো কোনো বাহ্যিক চার্টার্ড অ্যাকাউন্ট্যান্ট (CA) ফার্ম দ্বারা আনুষ্ঠানিক অডিট করানো হয়নি।'
                          : 'Internal secretariat financial ledger and public bulletins of CoLASH Foundation for FY 2025-26. Note: Independent external Chartered Accountant audit has not yet been conducted.'}
                      </p>
                    </div>

                    {/* Direct Action Buttons (View-Only Financial Inspection) */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsReportsArchiveOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-[#D6F36A] hover:bg-white text-[#102B3F] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Eye className="w-4 h-4 text-[#102B3F]" />
                        <span>{language === 'bn' ? 'আর্থিক বিবরণী পড়ুন' : 'View Financial Statement'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsReportsArchiveOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-[#D6F36A]" />
                        <span>{language === 'bn' ? 'গঠনতন্ত্র ও নথিপত্র আর্কাইভ' : 'Reports & By-Laws Archive'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Key Internal Financial Metrics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/15 text-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[11px] text-teal-200 font-medium block">
                        {language === 'bn' ? 'মোট প্রাপ্ত অনুদান' : 'Total Donations'}
                      </span>
                      <span className="text-lg sm:text-2xl font-black text-[#D6F36A] mt-0.5 block">
                        ৳৪২,৮৫,০০০
                      </span>
                      <span className="text-[10px] text-stone-300 mt-0.5 block">
                        {language === 'bn' ? 'অর্থ সচিবালয়ের অভ্যন্তরীণ হিসাব' : 'Internal Secretariat Record'}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[11px] text-teal-200 font-medium block">
                        {language === 'bn' ? 'মাঠপর্যায়ে সেবা বিতরণ' : 'Direct Field Relief'}
                      </span>
                      <span className="text-lg sm:text-2xl font-black text-white mt-0.5 block">
                        ৳৩৮,১৫,০০০
                      </span>
                      <span className="text-[10px] text-stone-300 mt-0.5 block">
                        {language === 'bn' ? '৮৯.০% সরাসরি মানুষের কল্যাণে' : '89.0% Direct Field Aid'}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[11px] text-teal-200 font-medium block">
                        {language === 'bn' ? 'আপদকালীন রিজার্ভ' : 'Surplus & Reserve'}
                      </span>
                      <span className="text-lg sm:text-2xl font-black text-emerald-300 mt-0.5 block">
                        ৳৪,৭০,০০০
                      </span>
                      <span className="text-[10px] text-stone-300 mt-0.5 block">
                        {language === 'bn' ? 'হাওর ও বন্যা প্রস্তুতি তহবিল' : 'Reserved for Flood Crisis'}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[11px] text-teal-200 font-medium block">
                        {language === 'bn' ? 'হিসাব সংকলন ও তত্ত্বাবধান' : 'Compiled & Maintained By'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white mt-1 block line-clamp-1">
                        {language === 'bn' ? 'অর্থ সচিবালয় (অভ্যন্তরীণ)' : 'Finance Secretariat'}
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold mt-0.5 block">
                        {language === 'bn' ? 'বাহ্যিক CA অডিট এখনো বাকি' : 'External CA Audit Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section A: Notices, Circulars and Events */}
                <div>
                  <EventsAndNews
                    events={EVENTS_DATA}
                    notices={notices}
                    language={language}
                    socialNewsFeed={socialNewsFeed}
                    onOpenLinkImporter={() => setIsLinkImporterOpen(true)}
                  />
                </div>

                {/* Section B: Citizen Applications & Public Tracking Desk */}
                <div>
                  <PublicApplicationSection
                    language={language}
                    applications={publicApplications}
                    onSubmitApplication={handleAddNewApplication}
                    onToast={addToast}
                  />
                </div>

              </div>
            )}

            {/* Dedicated FAQ Page View (#faq) */}
            {activeCategory === 'faq' && (
              <ScrollReveal direction="up">
                <FAQSection
                  language={language}
                  onSelectCategory={handleSelectCategory}
                  onOpenDonate={() => handleOpenDonate(null)}
                  showDedicatedBanner={true}
                />
              </ScrollReveal>
            )}

            {/* 8b. Nationwide Bangladesh Branches Dedicated View (#branches) */}
            {activeCategory === 'branches' && (
              <div className="space-y-6">
                <BangladeshBranchesSection
                  language={language}
                  branches={mapConfig.branches}
                  onSubmitBranchProposal={handleAddNewApplication}
                  onToast={addToast}
                />
                <GoogleMapsSection
                  mapConfig={mapConfig}
                  language={language}
                  onOpenAdminLocation={() => {
                    setAdminInitialTab('location_map');
                    setIsAdminOpen(true);
                  }}
                  onToast={addToast}
                />
              </div>
            )}

            {/* 9. Contact, Branches & Maps View */}
            {activeCategory === 'contact_location' && (
              <div className="space-y-6">
                <ContactSection
                  language={language}
                  websiteConfig={websiteCustomConfig}
                  onToast={addToast}
                />
                <BangladeshBranchesSection
                  language={language}
                  branches={mapConfig.branches}
                  onSubmitBranchProposal={handleAddNewApplication}
                  onToast={addToast}
                />
                <GoogleMapsSection
                  mapConfig={mapConfig}
                  language={language}
                  onOpenAdminLocation={() => {
                    setAdminInitialTab('location_map');
                    setIsAdminOpen(true);
                  }}
                  onToast={addToast}
                />
              </div>
            )}

          </div>
        ) : (
          /* ======================================================== */
          /* CLEAN AND ATTRACTIVE HOME PAGE EXPERIENCE */
          /* ======================================================== */
          <>
            {/* Hero Section */}
            <ScrollReveal direction="up">
              <Hero
                language={language}
                onOpenDonate={() => handleOpenDonate(null)}
                onOpenVolunteer={handleOpenVolunteer}
                onOpenNoticePage={(noticeId) => handleSelectCategory('emergency_notice')}
                websiteConfig={websiteCustomConfig}
                projects={projects}
                womensTeamActivities={womensTeamActivities}
                generalMembers={generalMembers}
                volunteers={volunteers}
                womensTeamMembers={womensTeamMembers}
                committeeMembers={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
                donations={donations}
                financialRecords={financialRecords}
              />
            </ScrollReveal>

            {/* Distinct Category Portal Hub */}
            <ScrollReveal direction="up" delay={20}>
              <CategoryPortalSection
                language={language}
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
                onOpenPortal={handleOpenPortal}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenScanner={() => setIsGlobalScannerOpen(true)}
                onOpenDonate={() => handleOpenDonate(null)}
                onOpenVolunteer={handleOpenVolunteer}
              />
            </ScrollReveal>

            {/* Home Highlights Section (Interactive 5-Pillar Explorer, Filterable Causes, 3-Wing Switcher & Live Blood Bank) */}
            <ScrollReveal direction="up" delay={40}>
              <HomeHighlightsSection
                language={language}
                projects={projects}
                notices={notices}
                generalMembers={generalMembers}
                publicBloodDonors={publicBloodDonors}
                websiteConfig={websiteCustomConfig}
                womensTeamConfig={womensTeamConfig}
                onNavigate={handleNavigateSection}
                onOpenDonate={handleOpenDonate}
                onOpenSponsorship={handleOpenSponsorship}
                onOpenBloodDonorModal={() => setIsBloodDonorModalOpen(true)}
                onOpenVolunteer={handleOpenVolunteer}
                onOpenPortal={handleOpenPortal}
              />
            </ScrollReveal>

            {/* Transparent Project Contributions Attribution ("কে কোন প্রকল্পে কীভাবে সাহায্য করেছেন") */}
            <ScrollReveal direction="up" delay={45}>
              <ProjectContributionsSection
                language={language}
                projects={projects}
                donations={donations}
                sponsorships={sponsorships}
                onOpenSponsorship={handleOpenSponsorship}
                onOpenBloodDonorModal={() => setIsBloodDonorModalOpen(true)}
                onOpenDonate={handleOpenDonate}
              />
            </ScrollReveal>

            {/* Approved Social Media & News Coverage Preview */}
            <ScrollReveal direction="up" delay={48}>
              <SocialAndNewsFeedSection
                items={socialNewsFeed}
                language={language}
                onOpenLinkImporter={() => setIsLinkImporterOpen(true)}
                compactPreview={true}
                onViewAll={() => handleSelectCategory('notices')}
              />
            </ScrollReveal>

            {/* Frequently Asked Questions About CoLASH Foundation (Clean Preview on Home) */}
            <ScrollReveal direction="up" delay={50}>
              <FAQSection
                language={language}
                onSelectCategory={handleSelectCategory}
                onOpenDonate={() => handleOpenDonate(null)}
                showDedicatedBanner={false}
                compactPreview={true}
              />
            </ScrollReveal>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenDonate={() => handleOpenDonate(null)}
        onOpenVolunteer={handleOpenVolunteer}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={handleNavigateSection}
        websiteConfig={websiteCustomConfig}
      />

      {/* Interactive Modals */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        preselectedProject={selectedDonationProject}
        projects={projects}
        language={language}
        websiteConfig={websiteCustomConfig}
        paymentChannels={paymentChannels}
        onDonationSuccess={handleDonationSuccess}
      />

      <MemberPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        language={language}
        generalMembers={generalMembers}
        onUpdateGeneralMembers={handleUpdateGeneralMembers}
        volunteers={volunteers}
        donations={donations}
        projects={projects}
        onRegisterVolunteer={handleRegisterVolunteer}
        onOpenDonate={() => handleOpenDonate(null)}
        notices={notices}
        defaultTab={portalDefaultTab}
        defaultViewTab={portalDefaultViewTab}
        onMemberSessionChange={setLoggedInMember}
        onToast={addToast}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
        publishedWebsiteConfig={websiteCustomConfig}
        onPublishWebsiteConfig={handlePublishWebsiteConfig}
        committeeTerms={committeeTerms}
        onUpdateCommitteeTerms={handleUpdateCommitteeTerms}
        advisors={advisors}
        onUpdateAdvisors={handleUpdateAdvisors}
        generalMembers={generalMembers}
        onUpdateGeneralMembers={handleUpdateGeneralMembers}
        donations={donations}
        volunteers={volunteers}
        projects={projects}
        notices={notices}
        adminUsers={adminUsers}
        currentAdmin={currentAdmin}
        auditLogs={auditLogs}
        onLoginAdmin={handleAdminLogin}
        onLogoutAdmin={handleAdminLogout}
        onCreateAdmin={handleCreateAdmin}
        onUpdateAdmin={handleUpdateAdmin}
        onDeleteAdmin={handleDeleteAdmin}
        onToggleAdminStatus={handleToggleAdminStatus}
        onChangeAdminPassword={handleChangeAdminPassword}
        onToggleDonationVerify={handleToggleDonationVerify}
        onApproveVolunteer={handleApproveVolunteer}
        onAddVolunteer={handleAddVolunteer}
        onUpdateVolunteer={handleUpdateVolunteer}
        onDeleteVolunteer={handleDeleteVolunteer}
        onDeleteAuditLog={handleDeleteAuditLog}
        onClearAuditLogs={handleClearAuditLogs}
        onAddNewProject={handleAddNewProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onAddNewNotice={handleAddNewNotice}
        onDeleteNotice={handleDeleteNotice}
        onOpenWomensAdmin={() => {
          setIsAdminOpen(false);
          setIsWomensAdminModalOpen(true);
        }}
        womensMembersCount={womensTeamMembers.length}
        womensTeamMembers={womensTeamMembers}
        onUpdateWomensMembers={handleUpdateWomensMembers}
        paymentChannels={paymentChannels}
        onUpdatePaymentChannels={handleUpdatePaymentChannels}
        onDeleteDonation={handleDeleteDonation}
        aiKnowledgeBase={aiKnowledgeBase}
        onUpdateAIKnowledgeBase={handleUpdateAIKnowledgeBase}
        mapConfig={mapConfig}
        onUpdateMapConfig={handleUpdateMapConfig}
        publicApplications={publicApplications}
        onUpdatePublicApplication={handleUpdateApplication}
        sponsorships={sponsorships}
        onUpdateSponsorshipStatus={handleUpdateSponsorshipStatus}
        publicBloodDonors={publicBloodDonors}
        onDeletePublicBloodDonor={handleDeletePublicBloodDonor}
        aiConversationLogs={aiConversationLogs}
        onRestoreBackup={handleRestoreBackup}
        onSyncAllToCloud={handleSyncAllToCloud}
        socialNewsFeed={socialNewsFeed}
        socialFeedSources={socialFeedSources}
        onModerateSocialNewsItem={handleModerateSocialNewsItem}
        onDeleteSocialNewsItem={handleDeleteSocialNewsItem}
        onUpdateSocialFeedSources={handleUpdateSocialFeedSources}
        onTriggerSocialNewsSync={handleTriggerSocialNewsSync}
        onOpenLinkImporter={() => setIsLinkImporterOpen(true)}
        initialTab={adminInitialTab}
        onToast={addToast}
      />

      <LinkImportModal
        isOpen={isLinkImporterOpen}
        onClose={() => setIsLinkImporterOpen(false)}
        language={language}
        defaultSubmitterName={currentAdmin?.name || loggedInMember?.nameBn || ''}
        onSubmitLinkItem={handleSubmitLinkItem}
        onToast={addToast}
      />

      <SponsorshipModal
        isOpen={isSponsorshipModalOpen}
        onClose={() => setIsSponsorshipModalOpen(false)}
        language={language}
        projects={projects}
        initialProject={sponsorshipTargetProject}
        onSubmitSponsorship={handleSubmitSponsorship}
        onToast={addToast}
      />

      <BloodDonorRegistrationModal
        isOpen={isBloodDonorModalOpen}
        onClose={() => setIsBloodDonorModalOpen(false)}
        language={language}
        onRegisterDonor={handleRegisterPublicBloodDonor}
        onToast={addToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        projects={projects}
        notices={notices}
        team={TEAM_MEMBERS}
        generalMembers={generalMembers}
        advisors={advisors}
        onSelectProject={(proj) => handleOpenDonate(proj)}
        onSelectMember={(m) => setSelectedMemberProfile(m)}
        onSelectNotice={() => handleSelectCategory('notices_applications')}
      />

      {/* CoLASH Women's Team Autonomous Wing Modals */}
      <WomensTeamMemberModal
        isOpen={isWomensMemberModalOpen}
        onClose={() => setIsWomensMemberModalOpen(false)}
        config={womensTeamConfig}
        members={womensTeamMembers}
        documents={womensTeamDocuments}
        notices={womensTeamNotices}
        activities={womensTeamActivities}
        language={language}
        currentUser={currentWomensUser}
        initialTab={womensMemberModalInitialTab}
        onLoginSuccess={handleWomensLogin}
        onRegisterMember={handleRegisterWomensMember}
        onUpdateMember={handleUpdateWomensMemberSelf}
        onLogout={handleWomensLogout}
        onOpenAdminPanel={() => setIsWomensAdminModalOpen(true)}
        onUpdateConfig={handleUpdateWomensConfig}
        onUpdateMembers={handleUpdateWomensMembers}
        onSelectMemberProfile={setSelectedMemberProfile}
        onToast={addToast}
      />

      <WomensTeamAdminModal
        isOpen={isWomensAdminModalOpen}
        onClose={() => setIsWomensAdminModalOpen(false)}
        config={womensTeamConfig}
        onUpdateConfig={handleUpdateWomensConfig}
        members={womensTeamMembers}
        onUpdateMembers={handleUpdateWomensMembers}
        activities={womensTeamActivities}
        onUpdateActivities={handleUpdateWomensActivities}
        documents={womensTeamDocuments}
        onUpdateDocuments={handleUpdateWomensDocuments}
        notices={womensTeamNotices}
        onUpdateNotices={handleUpdateWomensNotices}
        adminUsers={adminUsers}
        onUpdateAdminPassword={handleChangeAdminPassword}
        onUpdateAdmin={handleUpdateAdmin}
        onCreateAdmin={handleCreateAdmin}
        language={language}
        onToast={addToast}
      />

      {/* Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

      {/* Dedicated Single Member Profile View / Dedicated Page View */}
      {selectedMemberProfile && (
        <MemberProfilePage
          member={selectedMemberProfile}
          onClose={() => {
            const savedReturnY =
              window.history.state && typeof window.history.state === 'object' && typeof (window.history.state as { returnScrollY?: unknown }).returnScrollY === 'number'
                ? (window.history.state as { returnScrollY: number }).returnScrollY
                : null;
            setSelectedMemberProfile(null);
            if (window.location.hash.startsWith('#profile/')) {
              if (savedReturnY !== null && window.history.length > 1) {
                window.history.back();
                return;
              }
              const backHash = getCanonicalCategorySlug(activeCategory);
              const fallbackY = scrollByCategoryRef.current[activeCategory] ?? window.scrollY;
              setActiveSection(backHash);
              window.history.replaceState({ category: activeCategory, scrollY: fallbackY }, '', `#${backHash}`);
            }
          }}
          language={language}
          currentAdmin={currentAdmin}
          loggedInMember={loggedInMember}
          currentWomensUser={currentWomensUser}
          onOpenPortal={handleOpenPortal}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onEditOwnProfile={handleEditOwnProfile}
          onOpenScanner={() => setIsGlobalScannerOpen(true)}
        />
      )}

      {/* Official Constitution & Reports Archive Modal */}
      <ReportsArchiveModal
        isOpen={isReportsArchiveOpen}
        onClose={() => setIsReportsArchiveOpen(false)}
        language={language}
      />

      {/* Global QR Code Member Verification Modal */}
      <MemberVerificationModal
        member={qrVerifiedMember}
        isOpen={Boolean(qrVerifiedMember)}
        onClose={() => {
          setQrVerifiedMember(null);
          setQrVerifiedFromScan(false);
          if (window.location.hash.startsWith('#verify-member-')) {
            window.history.replaceState({ category: activeCategory, scrollY: window.scrollY }, '', '#members');
          }
        }}
        language={language}
        currentAdmin={currentAdmin}
        loggedInMember={loggedInMember}
        currentWomensUser={currentWomensUser}
        onOpenPortal={handleOpenPortal}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenScanner={() => setIsGlobalScannerOpen(true)}
        isQrScanSuccess={qrVerifiedFromScan}
      />

      {/* Global Camera QR Code ID Verification Scanner */}
      <QRScannerModal
        isOpen={isGlobalScannerOpen}
        onClose={() => setIsGlobalScannerOpen(false)}
        language={language}
        generalMembers={generalMembers}
        committee={committeeTerms.find(t => t.isCurrent)?.members || TEAM_MEMBERS}
        onToast={addToast}
        onOpenVerificationModal={(member) => {
          setQrVerifiedFromScan(true);
          setQrVerifiedMember(member);
        }}
        onVerifiedMemberOpen={(member) => setSelectedMemberProfile({
          ...member,
          image: member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          memberId: member.membershipId,
          joinDate: member.joinedDate,
          joiningYear: member.joiningYear || 2024,
          serviceYears: member.serviceYears ? Number(member.serviceYears) : (new Date().getFullYear() - Number(member.joiningYear || 2024)),
          previousPositions: member.previousPositions || [],
          category: 'সাধারণ পরিষদ',
        })}
      />

      {/* Interactive AI Assistant Widget */}
      <AIAssistantWidget
        language={language}
        knowledgeBase={aiKnowledgeBase}
        onNavigateSection={handleNavigateSection}
        onOpenDonate={() => handleOpenDonate(null)}
        onOpenVolunteer={handleOpenVolunteer}
        onOpenPortal={handleOpenPortal}
        onOpenWomensTeam={() => handleSelectCategory('womens_team')}
      />

    </div>
  );
}
