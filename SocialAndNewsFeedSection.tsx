import React, { useMemo, useState } from 'react';
import {
  Facebook,
  Instagram,
  Youtube,
  Newspaper,
  Globe,
  ExternalLink,
  Calendar,
  Link2,
  Play,
  ShieldCheck,
  X,
  Rss,
} from 'lucide-react';
import { Language, SocialFeedPlatform, SocialNewsFeedItem } from '../types';

interface SocialAndNewsFeedSectionProps {
  items: SocialNewsFeedItem[];
  language: Language;
  onOpenLinkImporter?: () => void;
  compactPreview?: boolean;
  onViewAll?: () => void;
}

export const SocialAndNewsFeedSection: React.FC<SocialAndNewsFeedSectionProps> = ({
  items,
  language,
  onOpenLinkImporter,
  compactPreview = false,
  onViewAll,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialFeedPlatform>('all');
  const [activeVideoItem, setActiveVideoItem] = useState<SocialNewsFeedItem | null>(null);

  // Strict Public Safety Gate: ONLY items approved by an authorized moderator appear publicly
  const approvedItems = useMemo(() => {
    return (items || [])
      .filter((item) => item && item.status === 'approved')
      .sort((a, b) => Date.parse(b.publishedAt || b.fetchedAt) - Date.parse(a.publishedAt || a.fetchedAt));
  }, [items]);

  const filteredItems = useMemo(() => {
    const base =
      selectedPlatform === 'all'
        ? approvedItems
        : approvedItems.filter((item) => item.platform === selectedPlatform);
    return compactPreview ? base.slice(0, 3) : base;
  }, [approvedItems, selectedPlatform, compactPreview]);

  const countsByPlatform = useMemo(() => {
    const counts: Record<'all' | SocialFeedPlatform, number> = {
      all: approvedItems.length,
      facebook: 0,
      instagram: 0,
      youtube: 0,
      news: 0,
      web: 0,
    };
    for (const item of approvedItems) {
      if (counts[item.platform] !== undefined) {
        counts[item.platform] += 1;
      }
    }
    return counts;
  }, [approvedItems]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso.slice(0, 10);
    }
  };

  const getPlatformMeta = (platform: SocialFeedPlatform) => {
    switch (platform) {
      case 'facebook':
        return {
          icon: Facebook,
          label: 'Facebook',
          badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        };
      case 'instagram':
        return {
          icon: Instagram,
          label: 'Instagram',
          badgeClass: 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
        };
      case 'youtube':
        return {
          icon: Youtube,
          label: 'YouTube',
          badgeClass: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        };
      case 'news':
        return {
          icon: Newspaper,
          label: language === 'bn' ? 'সংবাদ মাধ্যম' : 'News Media',
          badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      default:
        return {
          icon: Globe,
          label: language === 'bn' ? 'ওয়েব লিংক' : 'Web Link',
          badgeClass: 'bg-teal-50 dark:bg-teal-950/60 text-[#167D78] dark:text-[#D6F36A] border-teal-200 dark:border-teal-800',
        };
    }
  };

  const filterTabs: Array<{ id: 'all' | SocialFeedPlatform; labelBn: string; labelEn: string }> = [
    { id: 'all', labelBn: 'সকল আপডেট', labelEn: 'All Updates' },
    { id: 'facebook', labelBn: 'Facebook', labelEn: 'Facebook' },
    { id: 'instagram', labelBn: 'Instagram', labelEn: 'Instagram' },
    { id: 'youtube', labelBn: 'YouTube', labelEn: 'YouTube' },
    { id: 'news', labelBn: 'নিউজ চ্যানেল', labelEn: 'News Channels' },
  ];

  return (
    <section className="py-10 sm:py-12 border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#167D78] dark:text-[#D6F36A] mb-1.5">
              <Rss className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? 'সংযুক্ত সোশ্যাল ও মিডিয়া ফিড (অনুমোদিত)'
                  : 'Verified Social & Media Coverage Feed'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl stylish-title">
              {language === 'bn'
                ? 'সোশ্যাল মিডিয়া পোস্ট ও সংবাদমাধ্যমে কোলাশ'
                : 'CoLASH Across Social Media & News Channels'}
            </h2>
            <span className="stylish-title-rule" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              {language === 'bn'
                ? 'আমাদের অফিসিয়াল ফেসবুক, ইনস্টাগ্রাম, ইউটিউব, সংবাদমাধ্যম ও লিংক থেকে সংগৃহীত পোস্টসমূহ—দায়িত্বপ্রাপ্ত মডারেটরের অনুমোদনের পর এখানে প্রকাশিত হয়।'
                : 'Posts synced from connected social channels, news feeds, and pasted links—published here only after moderator verification.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenLinkImporter && (
              <button
                type="button"
                onClick={onOpenLinkImporter}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#102B3F] hover:bg-[#167D78] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5 text-[#D6F36A]" />
                <span>{language === 'bn' ? 'লিংক থেকে পোস্ট যুক্ত করুন' : 'Submit via Link'}</span>
              </button>
            )}
            {compactPreview && onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#167D78] text-[#167D78] dark:text-[#D6F36A] hover:bg-[#167D78] hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>{language === 'bn' ? 'সব পোস্ট ও নিউজ দেখুন' : 'View Full Feed'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {filterTabs.map((tab) => {
            const count = countsByPlatform[tab.id];
            const active = selectedPlatform === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPlatform(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#167D78] text-white border-[#167D78] shadow-xs'
                    : 'bg-white dark:bg-[#0c1a24] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#167D78]'
                }`}
              >
                <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feed Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c1a24] border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#167D78]/10 text-[#167D78] dark:text-[#D6F36A] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#102B3F] dark:text-white">
              {language === 'bn'
                ? 'এই ক্যাটাগরিতে অনুমোদিত কোনো পোস্ট এখনো প্রকাশিত হয়নি'
                : 'No Approved Social or News Items Published Yet'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              {language === 'bn'
                ? 'উপরের "লিংক" বাটনে ক্লিক করে যেকোনো পেইজ বা নিউজের লিংক পেস্ট করুন অথবা অ্যাডমিন প্যানেল থেকে সংযুক্ত ফেসবুক, ইনস্টাগ্রাম, ইউটিউব ও নিউজ চ্যানেলের অপেক্ষমাণ পোস্টগুলো অনুমোদন করুন।'
                : 'Click the "Link" option above to paste any social or news URL, or approve synced items inside the Admin Console.'}
            </p>
            {onOpenLinkImporter && (
              <button
                type="button"
                onClick={onOpenLinkImporter}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5 text-[#D6F36A]" />
                <span>{language === 'bn' ? 'প্রথম লিংক যুক্ত করুন' : 'Import a Link'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const pMeta = getPlatformMeta(item.platform);
              const PIcon = pMeta.icon;
              return (
                <article
                  key={item.id}
                  className="group rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 hover:border-[#167D78] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Visual Media Header */}
                  {item.imageUrl ? (
                    <div className="relative h-44 bg-stone-100 dark:bg-stone-900 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={language === 'bn' ? item.titleBn : item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {item.embedUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoItem(item)}
                          className="absolute inset-0 bg-black/35 hover:bg-black/50 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Play video preview"
                        >
                          <span className="w-12 h-12 rounded-full bg-[#D6F36A] text-[#102B3F] flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </span>
                        </button>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold backdrop-blur-xs ${pMeta.badgeClass}`}
                        >
                          <PIcon className="w-3 h-3" />
                          <span>{pMeta.label}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 pt-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${pMeta.badgeClass}`}
                      >
                        <PIcon className="w-3 h-3" />
                        <span>{pMeta.label}</span>
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {formatDate(item.publishedAt || item.fetchedAt)}
                      </span>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
                        <span className="font-bold text-[#167D78] dark:text-[#D6F36A] truncate">
                          {item.sourceName}
                        </span>
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.publishedAt || item.fetchedAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-[#102B3F] dark:text-white leading-snug line-clamp-2">
                        {language === 'bn' ? item.titleBn : item.titleEn}
                      </h3>

                      {(item.summaryBn || item.summaryEn) && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-3 leading-relaxed">
                          {language === 'bn' ? item.summaryBn : item.summaryEn}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অনুমোদিত' : 'Approved'}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {item.embedUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveVideoItem(item)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-[11px] font-bold hover:bg-red-100 cursor-pointer"
                          >
                            {language === 'bn' ? 'ভিডিও দেখুন' : 'Watch'}
                          </button>
                        )}
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#167D78] hover:text-white text-[#102B3F] dark:text-stone-200 text-[11px] font-bold transition-colors"
                        >
                          <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Open Source'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Embed Lightbox */}
      {activeVideoItem?.embedUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#102B3F] rounded-2xl overflow-hidden max-w-3xl w-full border border-white/15 shadow-2xl">
            <div className="px-4 py-3 flex items-center justify-between text-white border-b border-white/10">
              <span className="text-xs sm:text-sm font-bold truncate pr-4">
                {language === 'bn' ? activeVideoItem.titleBn : activeVideoItem.titleEn}
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoItem(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={activeVideoItem.embedUrl}
                title={activeVideoItem.titleEn}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
