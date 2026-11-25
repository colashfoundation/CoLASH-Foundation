import React, { useMemo } from 'react';
import {
  Bell,
  Calendar,
  Heart,
  Megaphone,
  Sparkles,
  Users,
  ArrowRight,
} from 'lucide-react';
import {
  EventItem,
  Language,
  NoticeItem,
  PortalCategoryKey,
  Project,
  WebsiteCustomConfig,
} from '../types';

export interface TopAnnouncementItem {
  id: string;
  kind: 'welcome' | 'emergency' | 'notice' | 'program' | 'project' | 'spirit';
  badgeBn: string;
  badgeEn: string;
  accentClass: string;
  textBn: string;
  textEn: string;
  metaBn?: string;
  metaEn?: string;
  targetCategory?: PortalCategoryKey;
  actionType?: 'category' | 'volunteer' | 'donate';
}

interface TopAnnouncementRunnerProps {
  language: Language;
  notices: NoticeItem[];
  events: EventItem[];
  projects: Project[];
  websiteConfig?: WebsiteCustomConfig;
  onSelectCategory: (cat: PortalCategoryKey) => void;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const TopAnnouncementRunner: React.FC<TopAnnouncementRunnerProps> = ({
  language,
  notices,
  events,
  projects,
  websiteConfig,
  onSelectCategory,
  onOpenDonate,
  onOpenVolunteer,
}) => {
  const items = useMemo<TopAnnouncementItem[]>(() => {
    const list: TopAnnouncementItem[] = [];

    // 1. Live Urgent / Custom Admin Bulletin (if set)
    if (websiteConfig?.noticeTickerBn?.trim()) {
      list.push({
        id: 'custom-ticker',
        kind: 'emergency',
        badgeBn: websiteConfig?.urgentBannerTitleBn || 'জরুরি বিজ্ঞপ্তি',
        badgeEn: 'Live Notice',
        accentClass: 'text-[#E6A15B]',
        textBn: websiteConfig.noticeTickerBn.trim(),
        textEn:
          websiteConfig.noticeTickerEn?.trim() ||
          websiteConfig.noticeTickerBn.trim(),
        targetCategory: 'emergency_notice',
        actionType: 'category',
      });
    }

    // 2. Active Admin Notices / বিজ্ঞপ্তি
    notices.forEach((notice) => {
      const isEmergency = notice.category === 'emergency';
      const isAudit = notice.category === 'audit';
      list.push({
        id: `notice-${notice.id}`,
        kind: isEmergency ? 'emergency' : 'notice',
        badgeBn: isEmergency
          ? 'জরুরি নোটিশ'
          : isAudit
          ? 'আর্থিক হিসাব'
          : 'বিজ্ঞপ্তি',
        badgeEn: isEmergency
          ? 'Urgent'
          : isAudit
          ? 'Finance'
          : 'Notice',
        accentClass: isEmergency ? 'text-rose-300' : 'text-[#D6F36A]',
        textBn: notice.titleBn,
        textEn: notice.titleEn || notice.titleBn,
        metaBn: notice.date,
        metaEn: notice.date,
        targetCategory: isEmergency ? 'emergency_notice' : 'notices_applications',
        actionType: 'category',
      });
    });

    // 3. Upcoming Programs / কর্মসূচি
    events
      .filter((ev) => !ev.isPast)
      .forEach((ev) => {
        list.push({
          id: `event-${ev.id}`,
          kind: 'program',
          badgeBn: 'কর্মসূচি',
          badgeEn: 'Program',
          accentClass: 'text-teal-300',
          textBn: `${ev.titleBn}${ev.locationBn ? ` — ${ev.locationBn}` : ''}`,
          textEn: `${ev.titleEn || ev.titleBn}${ev.locationEn ? ` — ${ev.locationEn}` : ''}`,
          metaBn: ev.date,
          metaEn: ev.date,
          targetCategory: 'notices_applications',
          actionType: 'category',
        });
      });

    // 4. Active Field Projects / চলমান উদ্যোগ (up to 3 latest)
    projects
      .filter((p) => p.status === 'active')
      .slice(0, 3)
      .forEach((proj) => {
        list.push({
          id: `proj-${proj.id}`,
          kind: 'project',
          badgeBn: 'চলমান কার্যক্রম',
          badgeEn: 'Active Drive',
          accentClass: 'text-sky-300',
          textBn: `${proj.titleBn}${proj.locationBn ? ` (${proj.locationBn})` : ''}`,
          textEn: `${proj.titleEn || proj.titleBn}${proj.locationEn || proj.locationBn ? ` (${proj.locationEn || proj.locationBn})` : ''}`,
          targetCategory: 'activities',
          actionType: 'category',
        });
      });

    // 5. Inspiring Nation-Builder Welcome & Spirit
    const welcomeItem: TopAnnouncementItem = {
      id: 'welcome-nation-builder',
      kind: 'welcome',
      badgeBn: 'স্বাগতম',
      badgeEn: 'Welcome',
      accentClass: 'text-[#D6F36A]',
      textBn:
        'সুন্দর ও মানবিক জাতি গড়ার কারিগর হিসেবে কোলাশ ফাউন্ডেশনে আপনাকে স্বাগতম — জীবন আলোকিত করুন, মানবতার সেবা করুন।',
      textEn:
        'Welcome to CoLASH Foundation as a builder of a compassionate nation — Illuminate Lives, Serve Humanity.',
      targetCategory: 'about',
      actionType: 'category',
    };

    const spiritItem: TopAnnouncementItem = {
      id: 'welcome-volunteer-spirit',
      kind: 'spirit',
      badgeBn: 'মানবতার বলয়',
      badgeEn: 'CoLASH Spirit',
      accentClass: 'text-amber-300',
      textBn:
        'আপনার একটি মানবিক উদ্যোগ বদলে দিতে পারে একটি অসহায় পরিবারের জীবন — স্বেচ্ছাসেবক হিসেবে যুক্ত হোন।',
      textEn:
        'One compassionate step can uplift an entire family — join our transparent volunteer community.',
      actionType: 'volunteer',
    };

    if (list.length === 0) {
      return [welcomeItem, spiritItem];
    }

    const insertPos = Math.min(1, list.length);
    list.splice(insertPos, 0, welcomeItem);
    list.push(spiritItem);

    return list;
  }, [notices, events, projects, websiteConfig]);

  const handleActivateItem = (item: TopAnnouncementItem) => {
    if (item.actionType === 'volunteer') {
      onOpenVolunteer();
      return;
    }
    if (item.actionType === 'donate') {
      onOpenDonate();
      return;
    }
    if (item.targetCategory) {
      onSelectCategory(item.targetCategory);
    }
  };

  const renderKindIcon = (kind: TopAnnouncementItem['kind']) => {
    switch (kind) {
      case 'welcome':
        return <Sparkles className="w-3 h-3 shrink-0" />;
      case 'emergency':
        return <Megaphone className="w-3 h-3 shrink-0" />;
      case 'program':
        return <Calendar className="w-3 h-3 shrink-0" />;
      case 'project':
        return <Heart className="w-3 h-3 shrink-0" />;
      case 'spirit':
        return <Users className="w-3 h-3 shrink-0" />;
      default:
        return <Bell className="w-3 h-3 shrink-0" />;
    }
  };

  if (items.length === 0) return null;

  // Calibrate CSS keyframe duration smoothly by total characters for steady reading pace
  const totalChars = items.reduce(
    (sum, item) => sum + (language === 'bn' ? item.textBn.length : item.textEn.length),
    0
  );
  const durationSeconds = Math.max(30, Math.min(85, Math.round(totalChars * 0.14)));

  return (
    <div
      className="no-print relative bg-[#0B2236] text-white border-b border-white/10 overflow-hidden select-none"
      role="region"
      aria-label={language === 'bn' ? 'সর্বশেষ জরুরি ও কর্মসূচি সংবাদ' : 'Live Emergency & Notice Ticker'}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-9 sm:h-10 flex items-center gap-3">
        {/* Left Calm Institutional Label */}
        <button
          type="button"
          onClick={() => onSelectCategory('emergency_notice')}
          className="inline-flex items-center gap-1.5 shrink-0 text-[11px] font-bold tracking-wide text-[#D6F36A] hover:text-white transition-colors cursor-pointer pr-2.5 border-r border-white/15"
        >
          <Megaphone className="w-3.5 h-3.5 text-[#E6A15B] shrink-0" />
          <span>{language === 'bn' ? 'জরুরি ও বিজ্ঞপ্তি' : 'Live Ticker'}</span>
        </button>

        {/* Continuous Smooth CSS Keyframe Marquee Track (Never Pauses on Hover or Touch) */}
        <div className="ticker-marquee-viewport flex-1 min-w-0">
          <div
            className="ticker-marquee-track"
            style={{
              animationDuration: `${durationSeconds}s`,
              WebkitAnimationDuration: `${durationSeconds}s`,
            }}
          >
            {[0, 1].map((dupIndex) => (
              <div
                key={`marquee-seq-${dupIndex}`}
                className="flex items-center shrink-0"
                aria-hidden={dupIndex === 1 ? 'true' : undefined}
              >
                {items.map((item) => (
                  <button
                    key={`${dupIndex}-${item.id}`}
                    type="button"
                    tabIndex={dupIndex === 1 ? -1 : 0}
                    onClick={() => handleActivateItem(item)}
                    className="inline-flex items-center gap-2 px-4 py-1 text-xs font-medium text-stone-100 hover:text-[#D6F36A] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] ${item.accentClass}`}>
                      {renderKindIcon(item.kind)}
                      <span>{language === 'bn' ? item.badgeBn : item.badgeEn}:</span>
                    </span>
                    <span>{language === 'bn' ? item.textBn : item.textEn}</span>
                    {(item.metaBn || item.metaEn) && (
                      <span className="text-[10px] font-mono text-stone-400 tabular-nums">
                        ({language === 'bn' ? item.metaBn : item.metaEn})
                      </span>
                    )}
                    <span className="ml-3 text-white/25" aria-hidden="true">•</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Minimal Quick Fund Action */}
        <button
          type="button"
          onClick={onOpenDonate}
          className="hidden md:inline-flex items-center gap-1 shrink-0 pl-2.5 border-l border-white/15 text-[11px] font-bold text-[#E6A15B] hover:text-[#D6F36A] transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>{websiteConfig?.urgentBannerBtnBn || (language === 'bn' ? 'ত্রাণ তহবিল' : 'Relief Fund')}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
