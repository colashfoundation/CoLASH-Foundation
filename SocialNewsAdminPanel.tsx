import React, { useState } from 'react';
import {
  Rss,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Newspaper,
  Globe,
  Plus,
  Link2,
  Save,
  ShieldCheck,
  Edit,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  Language,
  NewsChannelSourceConfig,
  SocialFeedSourcesConfig,
  SocialNewsFeedItem,
  SocialNewsModerationStatus,
} from '../../types';

interface SocialNewsAdminPanelProps {
  language: Language;
  feedItems: SocialNewsFeedItem[];
  sourcesConfig: SocialFeedSourcesConfig;
  currentAdminName: string;
  onModerateItem: (
    id: string,
    status: SocialNewsModerationStatus,
    edits?: { titleBn?: string; titleEn?: string; summaryBn?: string; summaryEn?: string }
  ) => Promise<void> | void;
  onDeleteItem: (id: string) => Promise<void> | void;
  onUpdateSourcesConfig: (nextConfig: SocialFeedSourcesConfig) => Promise<void> | void;
  onTriggerSync: (target: 'all' | 'social' | 'news') => Promise<{
    addedCount: number;
    reports: Array<{ id: string; label: string; status: string; found: number; message: string }>;
  } | null>;
  onOpenLinkImporter: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const SocialNewsAdminPanel: React.FC<SocialNewsAdminPanelProps> = ({
  language,
  feedItems,
  sourcesConfig,
  onModerateItem,
  onDeleteItem,
  onUpdateSourcesConfig,
  onTriggerSync,
  onOpenLinkImporter,
  onToast,
}) => {
  const [subTab, setSubTab] = useState<'pending' | 'approved' | 'rejected' | 'sources'>('pending');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncReports, setLastSyncReports] = useState<
    Array<{ id: string; label: string; status: string; found: number; message: string }>
  >([]);

  // Inline editing before approving
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleBn, setEditTitleBn] = useState('');
  const [editSummaryBn, setEditSummaryBn] = useState('');

  // Editable local draft of sources config
  const [draftSources, setDraftSources] = useState<SocialFeedSourcesConfig>(sourcesConfig);
  const [keywordsText, setKeywordsText] = useState((sourcesConfig.defaultNewsKeywords || []).join(', '));
  const [newNewsName, setNewNewsName] = useState('');
  const [newNewsRss, setNewNewsRss] = useState('');
  const [newNewsSite, setNewNewsSite] = useState('');

  const pendingItems = feedItems.filter((i) => i.status === 'pending');
  const approvedItems = feedItems.filter((i) => i.status === 'approved');
  const rejectedItems = feedItems.filter((i) => i.status === 'rejected');

  const handleSyncNow = async (target: 'all' | 'social' | 'news') => {
    setIsSyncing(true);
    try {
      const res = await onTriggerSync(target);
      if (res) {
        setLastSyncReports(res.reports || []);
        onToast(
          'success',
          language === 'bn'
            ? `সিঙ্ক সম্পন্ন: ${res.addedCount}টি নতুন আইটেম অপেক্ষমাণ`
            : `Sync Complete: ${res.addedCount} New Queued`,
          language === 'bn'
            ? 'নতুন প্রাপ্ত পোস্ট/নিউজগুলো অনুমোদনের অপেক্ষমাণ তালিকায় জমা হয়েছে।'
            : 'Newly discovered posts/news items are queued in Pending Moderation.'
        );
      }
    } catch (err) {
      onToast('error', language === 'bn' ? 'সিঙ্ক ব্যর্থ হয়েছে' : 'Sync Failed', String(err));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSources = async () => {
    const parsedKeywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const updated: SocialFeedSourcesConfig = {
      ...draftSources,
      defaultNewsKeywords: parsedKeywords,
    };
    await onUpdateSourcesConfig(updated);
    onToast(
      'success',
      language === 'bn' ? 'সোশ্যাল ও নিউজ চ্যানেল সেটিংস সংরক্ষিত হয়েছে' : 'Feed Sources Saved'
    );
  };

  const handleAddNewsChannel = () => {
    if (!newNewsName.trim() || !newNewsRss.trim()) return;
    const newChannel: NewsChannelSourceConfig = {
      id: `news-${Date.now()}`,
      nameBn: newNewsName.trim(),
      nameEn: newNewsName.trim(),
      siteUrl: newNewsSite.trim() || newNewsRss.trim(),
      rssUrl: newNewsRss.trim(),
      keywords: [],
      matchAllArticles: false,
      autoSyncEnabled: true,
    };
    const nextConfig: SocialFeedSourcesConfig = {
      ...draftSources,
      newsChannels: [...draftSources.newsChannels, newChannel],
    };
    setDraftSources(nextConfig);
    void onUpdateSourcesConfig(nextConfig);
    setNewNewsName('');
    setNewNewsRss('');
    setNewNewsSite('');
    onToast('success', language === 'bn' ? 'নতুন নিউজ চ্যানেল যুক্ত হয়েছে' : 'News Channel Added');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-amber-600" />;
      default:
        return <Globe className="w-4 h-4 text-[#167D78]" />;
    }
  };

  const activeList =
    subTab === 'pending' ? pendingItems : subTab === 'approved' ? approvedItems : rejectedItems;

  return (
    <div className="space-y-6 text-xs">
      {/* Top Action Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#102B3F] to-[#167D78] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
            <Rss className="w-4 h-4 text-[#D6F36A]" />
            <span>
              {language === 'bn'
                ? 'সংযুক্ত সোশ্যাল মিডিয়া, নিউজ অটো-সিঙ্ক ও লিংক অনুমোদন কেন্দ্র'
                : 'Connected Social, News Auto-Sync & Approval Hub'}
            </span>
          </h3>
          <p className="text-[11px] text-teal-100">
            {language === 'bn'
              ? 'ফেসবুক, ইনস্টাগ্রাম, ইউটিউব, নিউজ চ্যানেল ও লিংক ইম্পোর্টার থেকে প্রাপ্ত সকল পোস্ট দায়িত্বপ্রাপ্ত অ্যাডমিনের অনুমোদন সাপেক্ষে প্রকাশিত হবে।'
              : 'All auto-synced social posts, news RSS items, and pasted links stay pending until approved here.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenLinkImporter}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5 text-[#D6F36A]" />
            <span>{language === 'bn' ? 'লিংক যুক্ত করুন' : 'Paste Link'}</span>
          </button>

          <button
            type="button"
            disabled={isSyncing}
            onClick={() => void handleSyncNow('all')}
            className="px-3.5 py-2 rounded-xl bg-[#D6F36A] hover:bg-white text-[#102B3F] font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
          >
            {isSyncing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{language === 'bn' ? 'এখনই অটো-সিঙ্ক করুন' : 'Sync Social & News Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Diagnostics Alert if run */}
      {lastSyncReports.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
          <div className="font-bold text-[#102B3F] dark:text-white">
            {language === 'bn' ? 'সর্বশেষ অটো-সিঙ্ক ফলাফল:' : 'Latest Auto-Sync Diagnostics:'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lastSyncReports.map((rep) => (
              <div
                key={rep.id}
                className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-stone-800 dark:text-stone-100 truncate">{rep.label}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">{rep.message}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                    rep.status === 'ok'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : rep.status === 'needs_config'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {rep.found > 0 ? `+${rep.found}` : rep.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          type="button"
          onClick={() => setSubTab('pending')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
            subTab === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অপেক্ষমাণ অনুমোদন' : 'Pending Approval'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{pendingItems.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('approved')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
            subTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'প্রকাশিত (অনুমোদিত)' : 'Approved & Live'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{approvedItems.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('rejected')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
            subTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'বাতিলকৃত' : 'Rejected'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{rejectedItems.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('sources')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
            subTab === 'sources'
              ? 'bg-[#167D78] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          <Rss className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'প্ল্যাটফর্ম ও নিউজ চ্যানেল সেটিংস' : 'Connected Platforms & News Feeds'}</span>
        </button>
      </div>

      {/* Moderation Queue List */}
      {subTab !== 'sources' && (
        <div className="space-y-3">
          {activeList.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 text-center text-stone-500 dark:text-stone-400">
              {subTab === 'pending'
                ? language === 'bn'
                  ? 'অপেক্ষমাণ কোনো পোস্ট বা নিউজ নেই। উপরে "এখনই অটো-সিঙ্ক করুন" বাটনে ক্লিক করুন অথবা লিংক যুক্ত করুন।'
                  : 'No items awaiting approval. Click "Sync Social & News Now" or paste a link.'
                : language === 'bn'
                ? 'এই তালিকায় কোনো পোস্ট নেই।'
                : 'No items in this list.'}
            </div>
          ) : (
            activeList.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex flex-col md:flex-row gap-4 justify-between"
                >
                  <div className="flex flex-col sm:flex-row gap-3.5 flex-1 min-w-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.titleBn}
                        className="w-full sm:w-28 h-24 rounded-xl object-cover bg-stone-100 shrink-0"
                      />
                    )}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-[#102B3F] dark:text-white">
                          {getPlatformIcon(item.platform)}
                          <span>{item.sourceName}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-[#167D78] dark:text-[#D6F36A] text-[10px] font-bold">
                          {item.importMethod === 'auto_social'
                            ? language === 'bn'
                              ? 'সোশ্যাল অটো-সিঙ্ক'
                              : 'Auto Social'
                            : item.importMethod === 'auto_news'
                            ? language === 'bn'
                              ? 'নিউজ চ্যানেল'
                              : 'News Channel'
                            : language === 'bn'
                            ? 'লিংক পেস্ট'
                            : 'Link Importer'}
                        </span>
                        {item.submittedBy && (
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">
                            {language === 'bn' ? 'প্রেরক:' : 'By:'} {item.submittedBy}
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={editTitleBn}
                            onChange={(e) => setEditTitleBn(e.target.value)}
                            className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 font-bold"
                          />
                          <textarea
                            rows={2}
                            value={editSummaryBn}
                            onChange={(e) => setEditSummaryBn(e.target.value)}
                            className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-sm text-[#102B3F] dark:text-white leading-snug">
                            {language === 'bn' ? item.titleBn : item.titleEn}
                          </h4>
                          <p className="text-stone-600 dark:text-stone-300 line-clamp-2">{item.summaryBn}</p>
                        </>
                      )}

                      {item.submitterNote && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg inline-block">
                          {language === 'bn' ? 'নোট:' : 'Note:'} {item.submitterNote}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#167D78] dark:text-[#D6F36A] hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{item.sourceUrl}</span>
                        </a>
                        {item.moderatedBy && (
                          <span>
                            · {language === 'bn' ? 'মডারেটর:' : 'Reviewed by:'} {item.moderatedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-end gap-2 shrink-0">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditTitleBn(item.titleBn);
                          setEditSummaryBn(item.summaryBn);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          await onModerateItem(item.id, item.status, {
                            titleBn: editTitleBn,
                            titleEn: editTitleBn,
                            summaryBn: editSummaryBn,
                            summaryEn: editSummaryBn,
                          });
                          setEditingId(null);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#102B3F] text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                        <span>{language === 'bn' ? 'সেভ' : 'Save'}</span>
                      </button>
                    )}

                    {item.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={async () => {
                          await onModerateItem(
                            item.id,
                            'approved',
                            isEditing
                              ? {
                                  titleBn: editTitleBn,
                                  titleEn: editTitleBn,
                                  summaryBn: editSummaryBn,
                                  summaryEn: editSummaryBn,
                                }
                              : undefined
                          );
                          setEditingId(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অনুমোদন ও প্রকাশ' : 'Approve & Publish'}</span>
                      </button>
                    )}

                    {item.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => void onModerateItem(item.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-600 hover:text-white text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'স্থগিত/বাতিল' : 'Reject'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void onDeleteItem(item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Connected Social Accounts & News Channels Settings */}
      {subTab === 'sources' && (
        <div className="space-y-6">
          {/* 1. Social Platforms */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#102B3F] dark:text-white">
                  {language === 'bn'
                    ? 'সংযুক্ত সোশ্যাল প্ল্যাটফর্মসমূহ (Facebook, Instagram, YouTube)'
                    : 'Connected Social Platforms (Facebook, Instagram, YouTube)'}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'bn'
                    ? 'YouTube লিংক স্বয়ংক্রিয়ভাবে চ্যানেলের ভিডিও ফিড সংগ্রহ করে। Facebook/Instagram-এর জন্য Meta Graph Page Token অথবা RSS/JSON Bridge URL যুক্ত করুন।'
                    : 'YouTube auto-discovers channel feeds. Facebook & Instagram support Meta Graph Page Tokens or RSS/JSON Bridge URLs.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleSyncNow('social')}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-[#167D78] text-white font-bold flex items-center gap-1.5 cursor-pointer self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{language === 'bn' ? 'সোশ্যাল সিঙ্ক করুন' : 'Sync Socials'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {draftSources.socialAccounts.map((acc, idx) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-[#102B3F] dark:text-white">
                      {getPlatformIcon(acc.platform)}
                      <span>{acc.label}</span>
                    </div>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acc.autoSyncEnabled}
                        onChange={(e) => {
                          const next = [...draftSources.socialAccounts];
                          next[idx] = { ...acc, autoSyncEnabled: e.target.checked };
                          setDraftSources({ ...draftSources, socialAccounts: next });
                        }}
                      />
                      <span className="font-semibold">
                        {language === 'bn' ? 'অটো-সিঙ্ক চালু' : 'Auto-Sync Active'}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                        {language === 'bn' ? 'পেইজ / চ্যানেল লিংক (URL)' : 'Page / Channel URL'}
                      </label>
                      <input
                        type="url"
                        value={acc.pageUrl}
                        onChange={(e) => {
                          const next = [...draftSources.socialAccounts];
                          next[idx] = { ...acc, pageUrl: e.target.value };
                          setDraftSources({ ...draftSources, socialAccounts: next });
                        }}
                        className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                        {language === 'bn'
                          ? 'RSS / Atom / JSON Bridge URL (ঐচ্ছিক)'
                          : 'RSS / Atom / JSON Bridge URL (Optional)'}
                      </label>
                      <input
                        type="url"
                        value={acc.rssOrBridgeUrl || ''}
                        onChange={(e) => {
                          const next = [...draftSources.socialAccounts];
                          next[idx] = { ...acc, rssOrBridgeUrl: e.target.value };
                          setDraftSources({ ...draftSources, socialAccounts: next });
                        }}
                        placeholder="https://rss.app/feeds/..."
                        className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                        {acc.platform === 'youtube'
                          ? 'YouTube Channel ID (UC...)'
                          : acc.platform === 'instagram'
                          ? 'Instagram Business User ID'
                          : 'Facebook Page ID'}
                      </label>
                      <input
                        type="text"
                        value={acc.channelOrPageId || ''}
                        onChange={(e) => {
                          const next = [...draftSources.socialAccounts];
                          next[idx] = { ...acc, channelOrPageId: e.target.value };
                          setDraftSources({ ...draftSources, socialAccounts: next });
                        }}
                        placeholder={acc.platform === 'youtube' ? 'UC...' : 'Numeric ID'}
                        className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                      />
                    </div>
                    {acc.platform !== 'youtube' && (
                      <div>
                        <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                          {language === 'bn' ? 'Meta Graph API Access Token' : 'Meta Graph API Token'}
                        </label>
                        <input
                          type="password"
                          value={acc.accessToken || ''}
                          onChange={(e) => {
                            const next = [...draftSources.socialAccounts];
                            next[idx] = { ...acc, accessToken: e.target.value };
                            setDraftSources({ ...draftSources, socialAccounts: next });
                          }}
                          placeholder="EAAG..."
                          className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                        />
                      </div>
                    )}
                  </div>

                  {acc.lastMessage && (
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#167D78]" />
                      <span>{acc.lastMessage}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. News Channels Auto-Sync & Keyword Matcher */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#102B3F] dark:text-white">
                  {language === 'bn'
                    ? 'সংবাদ চ্যানেল ও নিউজ পোর্টাল অটো-সিঙ্ক (RSS)'
                    : 'Automated News Channels (RSS Feeds)'}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'bn'
                    ? 'নিচের কীওয়ার্ড অনুযায়ী নিউজ চ্যানেল থেকে স্বয়ংক্রিয়ভাবে সংবাদ এনে অপেক্ষমাণ তালিকায় রাখা হবে।'
                    : 'Automatically scans connected news feeds for your keywords and queues matches for approval.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleSyncNow('news')}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-1.5 cursor-pointer self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{language === 'bn' ? 'নিউজ সিঙ্ক করুন' : 'Sync News'}</span>
              </button>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {language === 'bn'
                  ? 'স্বয়ংক্রিয় ম্যাচিং কীওয়ার্ড (কমা দিয়ে লিখুন)'
                  : 'Auto-Match Keywords (Comma-separated)'}
              </label>
              <input
                type="text"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>

            <div className="space-y-2.5">
              {draftSources.newsChannels.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#102B3F] dark:text-white flex items-center gap-2">
                      <Newspaper className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{language === 'bn' ? ch.nameBn : ch.nameEn}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">{ch.rssUrl}</div>
                    {ch.lastMessage && (
                      <div className="text-[11px] text-[#167D78] dark:text-[#D6F36A] mt-0.5">{ch.lastMessage}</div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(ch.matchAllArticles)}
                        onChange={(e) => {
                          const next = [...draftSources.newsChannels];
                          next[idx] = { ...ch, matchAllArticles: e.target.checked };
                          setDraftSources({ ...draftSources, newsChannels: next });
                        }}
                      />
                      <span>{language === 'bn' ? 'সব সংবাদ আনুন' : 'Match All'}</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ch.autoSyncEnabled}
                        onChange={(e) => {
                          const next = [...draftSources.newsChannels];
                          next[idx] = { ...ch, autoSyncEnabled: e.target.checked };
                          setDraftSources({ ...draftSources, newsChannels: next });
                        }}
                      />
                      <span>{language === 'bn' ? 'সক্রিয়' : 'Enabled'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = draftSources.newsChannels.filter((c) => c.id !== ch.id);
                        setDraftSources({ ...draftSources, newsChannels: next });
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      aria-label="Remove channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New News RSS Channel */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-600 space-y-2.5">
              <div className="font-bold text-[#102B3F] dark:text-white flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#167D78]" />
                <span>{language === 'bn' ? 'নতুন নিউজ চ্যানেল RSS যুক্ত করুন' : 'Add Custom News RSS Feed'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newNewsName}
                  onChange={(e) => setNewNewsName(e.target.value)}
                  placeholder={language === 'bn' ? 'চ্যানেলের নাম (যেমন: সময় টিভি)' : 'Channel Name'}
                  className="p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                />
                <input
                  type="url"
                  value={newNewsRss}
                  onChange={(e) => setNewNewsRss(e.target.value)}
                  placeholder="RSS Feed URL (https://.../rss.xml)"
                  className="p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                />
                <button
                  type="button"
                  onClick={handleAddNewsChannel}
                  className="px-3 py-2 rounded-lg bg-[#102B3F] hover:bg-[#167D78] text-white font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'চ্যানেল যুক্ত করুন' : 'Add Channel'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void handleSaveSources()}
                className="px-5 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#D6F36A]" />
                <span>{language === 'bn' ? 'সব সেটিংস সংরক্ষণ করুন' : 'Save Source Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
