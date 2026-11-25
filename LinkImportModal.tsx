import React, { useState } from 'react';
import {
  X,
  Link2,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
  Youtube,
  Facebook,
  Instagram,
  Newspaper,
  Globe,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Language, SocialFeedPlatform, SocialNewsFeedItem } from '../../types';

interface LinkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  defaultSubmitterName?: string;
  onSubmitLinkItem: (item: SocialNewsFeedItem) => Promise<{ ok: boolean; alreadyQueued?: boolean; error?: string }>;
  onToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const LinkImportModal: React.FC<LinkImportModalProps> = ({
  isOpen,
  onClose,
  language,
  defaultSubmitterName = '',
  onSubmitLinkItem,
  onToast,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchNote, setFetchNote] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<SocialNewsFeedItem | null>(null);
  const [submitterName, setSubmitterName] = useState(defaultSubmitterName);
  const [submitterNote, setSubmitterNote] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<{ title: string; alreadyQueued?: boolean } | null>(null);

  if (!isOpen) return null;

  const detectClientPlatform = (urlStr: string): SocialFeedPlatform => {
    const lower = urlStr.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
    if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
    if (/prothomalo|thedailystar|bdnews24|jagonews24|dhakatribune|somoynews|jamuna|jugantor|kalerkantho|samakal|tbsnews|\/news\//i.test(lower)) {
      return 'news';
    }
    return 'web';
  };

  const handleFetchMetadata = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = urlInput.trim();
    if (!raw) return;
    const normalizedInput = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    setIsFetching(true);
    setFetchError(null);
    setFetchNote(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/social-feed/parse-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: normalizedInput,
          previewOnly: true,
          submittedBy: submitterName.trim() || undefined,
          submitterNote: submitterNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not inspect URL');
      }
      if (data.item) {
        setPreviewItem({
          ...data.item,
          status: 'pending',
        });
        if (data.fetchNote) {
          setFetchNote(data.fetchNote);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to auto-fetch metadata';
      // Provide graceful editable fallback if URL syntax is valid so user can still submit manually
      try {
        const u = new URL(normalizedInput);
        const host = u.hostname.replace(/^www\./, '');
        const plat = detectClientPlatform(normalizedInput);
        setPreviewItem({
          id: `lnk-${Date.now()}`,
          titleBn: `${host} থেকে শেয়ার করা পোস্ট/নিউজ`,
          titleEn: `Shared Update from ${host}`,
          summaryBn: '',
          summaryEn: '',
          sourceUrl: normalizedInput,
          platform: plat,
          sourceName: host,
          importMethod: 'link_paste',
          status: 'pending',
          submittedBy: submitterName.trim() || 'Website Link Importer',
          publishedAt: new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
        });
        setFetchNote(
          language === 'bn'
            ? `স্বয়ংক্রিয় প্রিভিউ পাওয়া যায়নি (${msg})। নিচে শিরোনাম ও সারসংক্ষেপ লিখে অনুমোদনের জন্য পাঠান।`
            : `Auto-preview unavailable (${msg}). Fill in the title & summary below and submit for approval.`
        );
      } catch {
        setFetchError(
          language === 'bn'
            ? 'দয়া করে একটি সঠিক https:// লিংক প্রদান করুন।'
            : 'Please enter a valid http:// or https:// URL.'
        );
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!previewItem) return;
    if (!previewItem.titleBn.trim() && !previewItem.titleEn.trim()) {
      setFetchError(language === 'bn' ? 'অনুগ্রহ করে একটি শিরোনাম লিখুন।' : 'Please enter a title.');
      return;
    }

    setIsSubmitting(true);
    setFetchError(null);
    try {
      const finalItem: SocialNewsFeedItem = {
        ...previewItem,
        titleBn: previewItem.titleBn.trim() || previewItem.titleEn.trim(),
        titleEn: previewItem.titleEn.trim() || previewItem.titleBn.trim(),
        summaryBn: previewItem.summaryBn.trim() || previewItem.summaryEn.trim(),
        summaryEn: previewItem.summaryEn.trim() || previewItem.summaryBn.trim(),
        submittedBy: submitterName.trim() || previewItem.submittedBy || 'Website Link Submission',
        submitterNote: submitterNote.trim() || previewItem.submitterNote,
        importMethod: 'link_paste',
        // Guarantee pending gate before moderator approval
        status: 'pending',
      };

      const res = await onSubmitLinkItem(finalItem);
      if (!res.ok) {
        throw new Error(res.error || 'Failed to queue link submission');
      }

      setSubmitSuccess({
        title: language === 'bn' ? finalItem.titleBn : finalItem.titleEn,
        alreadyQueued: res.alreadyQueued,
      });

      onToast?.(
        res.alreadyQueued ? 'info' : 'success',
        res.alreadyQueued
          ? language === 'bn'
            ? 'এই লিংকটি ইতিমধ্যে তালিকায় রয়েছে'
            : 'Link Already Queued'
          : language === 'bn'
          ? 'অনুমোদনের জন্য পাঠানো হয়েছে!'
          : 'Submitted for Moderator Approval!',
        language === 'bn'
          ? 'দায়িত্বপ্রাপ্ত অনুমোদনকারী রিভিউ করে অনুমোদন দিলেই এটি ওয়েবসাইটে প্রকাশিত হবে।'
          : 'It will appear publicly once approved by a designated CoLASH moderator.'
      );
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUrlInput('');
    setPreviewItem(null);
    setFetchError(null);
    setFetchNote(null);
    setSubmitterNote('');
    setSubmitSuccess(null);
  };

  const renderPlatformBadge = (platform: SocialFeedPlatform) => {
    switch (platform) {
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
            <Facebook className="w-3.5 h-3.5" /> Facebook
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[11px] font-bold">
            <Instagram className="w-3.5 h-3.5" /> Instagram
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-bold">
            <Youtube className="w-3.5 h-3.5" /> YouTube
          </span>
        );
      case 'news':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
            <Newspaper className="w-3.5 h-3.5" /> {language === 'bn' ? 'নিউজ পোর্টাল' : 'News Portal'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-[#167D78] dark:text-[#D6F36A] text-[11px] font-bold">
            <Globe className="w-3.5 h-3.5" /> Web Link
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-start sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#0c1a24] w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:rounded-3xl border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#102B3F] text-white px-5 py-4 flex items-center justify-between border-b border-[#167D78]/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#167D78] text-[#D6F36A] flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">
                {language === 'bn'
                  ? 'যেকোনো পেইজ বা নিউজ লিংক থেকে পোস্ট যুক্ত করুন'
                  : 'Import Post or News via Link'}
              </h3>
              <p className="text-[11px] text-teal-200 truncate">
                {language === 'bn'
                  ? 'Facebook, Instagram, YouTube বা যেকোনো নিউজ চ্যানেলের লিংক পেস্ট করুন'
                  : 'Paste any Facebook, Instagram, YouTube, or News Portal link'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[85vh]">
          {/* Approval Workflow Notice */}
          <div className="p-3.5 rounded-2xl bg-[#167D78]/10 dark:bg-[#167D78]/20 border border-[#167D78]/30 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#167D78] dark:text-[#D6F36A] shrink-0 mt-0.5" />
            <div className="text-stone-700 dark:text-stone-200 leading-relaxed">
              <strong className="text-[#102B3F] dark:text-[#D6F36A]">
                {language === 'bn' ? 'নিরাপদ অনুমোদন নীতি:' : 'Moderator Approval Gate:'}
              </strong>{' '}
              {language === 'bn'
                ? 'আপনি লিংক পেস্ট করে পাঠানোর পর স্বয়ংক্রিয়ভাবে তথ্য সংগ্রহ হবে এবং সেটি অপেক্ষমাণ তালিকায় জমা থাকবে। দায়িত্বপ্রাপ্ত অ্যাডমিন/মডারেটর অনুমোদন দিলে তবেই ওয়েবসাইটে প্রদর্শিত হবে।'
                : 'Metadata is extracted automatically and held in the Pending Moderation Queue. It goes live on the website only after an authorized moderator approves it.'}
            </div>
          </div>

          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-[#102B3F] dark:text-white">
                {submitSuccess.alreadyQueued
                  ? language === 'bn'
                    ? 'এই লিংকটি ইতিপূর্বেই পাঠানো হয়েছে'
                    : 'This Link Is Already in Queue'
                  : language === 'bn'
                  ? 'সফলভাবে অনুমোদনের জন্য পাঠানো হয়েছে!'
                  : 'Submitted for Approval Successfully!'}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                <span className="font-bold">"{submitSuccess.title}"</span> —{' '}
                {language === 'bn'
                  ? 'দায়িত্বপ্রাপ্ত মডারেটর/অ্যাডমিন অনুমোদন দিলে পোস্টটি ওয়েবসাইটের সোশ্যাল ও নিউজ ফিডে প্রদর্শিত হবে।'
                  : 'Once an authorized coordinator reviews and approves it, it will appear on the public Social & News Feed.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'আরেকটি লিংক যুক্ত করুন' : 'Add Another Link'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Paste URL */}
              <form onSubmit={handleFetchMetadata} className="space-y-3">
                <label className="block text-xs font-bold text-[#102B3F] dark:text-stone-200">
                  {language === 'bn'
                    ? 'পোস্ট, ভিডিও বা নিউজের লিংক (URL) এখানে পেস্ট করুন'
                    : 'Paste Social Post, Video, or News Article URL'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... বা https://www.prothomalo.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs sm:text-sm text-[#102B3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                  />
                  <button
                    type="submit"
                    disabled={isFetching || !urlInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'bn' ? 'তথ্য আনছে...' : 'Fetching...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#D6F36A]" />
                        <span>{language === 'bn' ? 'স্বয়ংক্রিয় তথ্য আনুন' : 'Fetch Link Info'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {fetchError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{fetchError}</span>
                </div>
              )}

              {fetchNote && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{fetchNote}</span>
                </div>
              )}

              {/* Step 2: Extracted Metadata Review & Edit */}
              {previewItem && (
                <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-3">
                    <div className="flex items-center gap-2">
                      {renderPlatformBadge(previewItem.platform)}
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                        {previewItem.sourceName}
                      </span>
                    </div>
                    <a
                      href={previewItem.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#167D78] dark:text-[#D6F36A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{language === 'bn' ? 'মূল লিংক দেখুন' : 'Open URL'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {previewItem.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 h-44">
                      <img
                        src={previewItem.imageUrl}
                        alt={previewItem.titleBn}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {language === 'bn' ? 'শিরোনাম (বাংলা / প্রদর্শিত টাইটেল) *' : 'Headline / Title *'}
                      </label>
                      <input
                        type="text"
                        value={previewItem.titleBn}
                        onChange={(e) =>
                          setPreviewItem({ ...previewItem, titleBn: e.target.value, titleEn: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#102B3F] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ (Summary)' : 'Summary / Description'}
                      </label>
                      <textarea
                        rows={3}
                        value={previewItem.summaryBn}
                        onChange={(e) =>
                          setPreviewItem({ ...previewItem, summaryBn: e.target.value, summaryEn: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#102B3F] dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {language === 'bn' ? 'উৎস / চ্যানেল / পেইজের নাম' : 'Source / Page Name'}
                        </label>
                        <input
                          type="text"
                          value={previewItem.sourceName}
                          onChange={(e) => setPreviewItem({ ...previewItem, sourceName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#102B3F] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          {language === 'bn' ? 'আপনার নাম / পদবি (ঐচ্ছিক)' : 'Submitted By (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={submitterName}
                          onChange={(e) => setSubmitterName(e.target.value)}
                          placeholder={language === 'bn' ? 'যেমন: মো. করিম (সদস্য)' : 'e.g. Coordinator Name'}
                          className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#102B3F] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {language === 'bn' ? 'অনুমোদনকারীর জন্য নোট (ঐচ্ছিক)' : 'Note for Moderator (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={submitterNote}
                        onChange={(e) => setSubmitterNote(e.target.value)}
                        placeholder={language === 'bn' ? 'কেন এটি গুরুত্বপূর্ণ তা সংক্ষেপে লিখতে পারেন' : 'Optional context for reviewer'}
                        className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#102B3F] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold cursor-pointer"
                    >
                      {language === 'bn' ? 'পুনরায় লিখুন' : 'Reset'}
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleSubmitForApproval()}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#D6F36A]" />
                          <span>{language === 'bn' ? 'অনুমোদনের জন্য পাঠান' : 'Submit for Approval'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
