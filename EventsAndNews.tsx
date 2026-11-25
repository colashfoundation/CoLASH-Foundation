import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Bell, FileText, X, Eye, ShieldCheck, BookOpen, Lock } from 'lucide-react';
import { EventItem, NoticeItem, Language, SocialNewsFeedItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ReportsArchiveModal } from './common/ReportsArchiveModal';
import { SocialAndNewsFeedSection } from './SocialAndNewsFeedSection';

interface EventsAndNewsProps {
  events: EventItem[];
  notices: NoticeItem[];
  language: Language;
  socialNewsFeed?: SocialNewsFeedItem[];
  onOpenLinkImporter?: () => void;
}

export const EventsAndNews: React.FC<EventsAndNewsProps> = ({
  events,
  notices,
  language,
  socialNewsFeed = [],
  onOpenLinkImporter,
}) => {
  const [activeRsvpEvent, setActiveRsvpEvent] = useState<EventItem | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [isReportsArchiveOpen, setIsReportsArchiveOpen] = useState(false);

  const t = TRANSLATIONS[language];

  const renderPersonInfo = (p?: any, fallback = language === 'bn' ? 'দপ্তর ও প্রশাসন সচিব' : 'Secretariat Office') => {
    if (!p) return fallback;
    if (typeof p === 'string') return p;
    return `${p.nameBn || p.nameEn || ''} (${p.designationBn || p.designationEn || ''})`.trim() || fallback;
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    if (activeRsvpEvent) {
      activeRsvpEvent.rsvpsCount += parseInt(rsvpGuests, 10) || 1;
    }
  };

  const closeRsvp = () => {
    setActiveRsvpEvent(null);
    setRsvpSuccess(false);
    setRsvpName('');
    setRsvpPhone('');
    setRsvpGuests('1');
  };

  return (
    <section id="events" className="py-12 sm:py-16 bg-transparent transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Upcoming Events (7 cols) */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-widest font-bold text-[#167D78] dark:text-[#D6F36A] mb-1.5">
                {language === 'bn' ? 'মাঠপর্যায়ের কার্যক্রম' : 'Community Mobilization'}
              </div>
              <h2 className="text-2xl sm:text-3xl stylish-title">
                {t.eventsTitle}
              </h2>
              <span className="stylish-title-rule" aria-hidden="true" />
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                {t.eventsSubtitle}
              </p>
            </div>

            <div className="space-y-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 hover:border-[#167D78] transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Date badge */}
                    <div className="w-14 h-14 rounded-xl bg-[#102B3F] text-[#D6F36A] flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-semibold uppercase">{String(ev.date || '2026-03-07').split('-')[1] || '03'}</span>
                      <span className="text-base font-extrabold tabular-nums leading-none">{String(ev.date || '2026-03-07').split('-')[2] || '07'}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#102B3F] dark:text-white leading-snug">
                        {language === 'bn' ? ev.titleBn : ev.titleEn}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#167D78]" />
                          <span>{language === 'bn' ? ev.timeBn : ev.timeEn}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E6A15B]" />
                          <span className="truncate max-w-[200px]">{language === 'bn' ? ev.locationBn : ev.locationEn}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                    <span className="text-xs text-stone-400 tabular-nums">
                      {ev.rsvpsCount} {language === 'bn' ? 'অংশগ্রহণকারী' : 'RSVPed'}
                    </span>
                    <button
                      onClick={() => setActiveRsvpEvent(ev)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-lg transition-colors cursor-pointer"
                    >
                      {t.rsvpBtn}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Notices & Circulars (5 cols) */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold text-[#E6A15B] mb-1.5 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'জরুরি ঘোষণা ও অডিট' : 'Official Bulletins & Audit'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl stylish-title">
                  {t.noticesTitle}
                </h2>
                <span className="stylish-title-rule" aria-hidden="true" />
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                  {language === 'bn' ? 'ফাউন্ডেশনের সকল দাপ্তরিক পরিপত্র, বিধিবদ্ধ অডিট ও বিজ্ঞপ্তি' : 'Statutory notices, annual audit & official directives'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsReportsArchiveOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-700 hover:text-white text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs self-start sm:self-end"
                title={language === 'bn' ? 'সম্পূর্ণ অডিট ও গঠনতন্ত্র আর্কাইভ দেখুন' : 'View Complete Reports Archive'}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অডিট ও গঠনতন্ত্র আর্কাইভ' : 'Reports Archive'}</span>
              </button>
            </div>

            {/* Spotlight Banner: FY 2025-2026 Financial Statement */}
            <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-[#102B3F] via-[#12384e] to-[#167D78] text-white border border-teal-500/40 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D6F36A] text-[#102B3F] shadow-2xs">
                  {language === 'bn' ? 'অভ্যন্তরীণ আর্থিক বিবরণী ২০২৫–২৬' : 'Internal Financial Statement 2025-26'}
                </span>
                <span className="text-[11px] text-teal-200 font-mono">১২ এপ্রিল ২০২৬</span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                {language === 'bn' ? '২০২৫-২০২৬ অর্থবছরের অভ্যন্তরীণ আয়-ব্যয় বিবরণী ও বার্ষিক প্রতিবেদন' : 'Internal Financial Ledger & Annual Activity Report 2025-26'}
              </h3>

              <p className="text-xs text-stone-200 mt-1.5 leading-relaxed">
                {language === 'bn'
                  ? 'কোলাশ ফাউন্ডেশনের অর্থ সচিবালয়ের অভ্যন্তরীণ হিসাব অনুযায়ী আয়-ব্যয়ের বিবরণী। (আনুষ্ঠানিক বাহ্যিক সিএ অডিট এখনো সম্পন্ন হয়নি।)'
                  : 'Compiled from CoLASH Finance Secretariat internal accounts for public review. (Formal external CA audit not yet completed.)'}
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 my-3 text-center">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-teal-200 block">{language === 'bn' ? 'মোট অনুদান' : 'Total Raised'}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#D6F36A]">৳৪২,৮৫,০০০</span>
                </div>
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-teal-200 block">{language === 'bn' ? 'মাঠপর্যায়ে ব্যয়' : 'Direct Relief'}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white">৳৩৮,১৫,০০০</span>
                </div>
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-teal-200 block">{language === 'bn' ? 'আপদকালীন রিজার্ভ' : 'Reserve'}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-300">৳৪,৭০,০০০</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const auditNotice = notices.find(n => n.id === 'not-1' || n.category === 'audit') || notices[0];
                    setActiveNotice(auditNotice);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white text-white hover:text-[#102B3F] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সম্পূর্ণ রিপোর্ট পড়ুন' : 'Read Notice'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportsArchiveOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#D6F36A] hover:bg-white text-[#102B3F] text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title={language === 'bn' ? 'আর্থিক বিবরণী ও গঠনতন্ত্র আর্কাইভ দেখুন' : 'Inspect Financial & Constitution Archive'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'হিসাব আর্কাইভ দেখুন' : 'View Ledger Archive'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => {
                const isAudit = notice.id === 'not-1' || notice.category === 'audit';
                return (
                  <div
                    key={notice.id}
                    onClick={() => setActiveNotice(notice)}
                    className={`p-4 rounded-xl bg-white dark:bg-[#0c1a24] border transition-all cursor-pointer group shadow-xs ${
                      isAudit
                        ? 'border-purple-300 dark:border-purple-800 hover:border-purple-500 bg-purple-50/20 dark:bg-purple-950/10'
                        : 'border-stone-200 dark:border-stone-800 hover:border-[#167D78]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold uppercase tracking-wider ${
                          isAudit ? 'text-purple-700 dark:text-purple-300' : 'text-[#167D78] dark:text-[#D6F36A]'
                        }`}>
                          {notice.category}
                        </span>
                        {isAudit && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                            {language === 'bn' ? 'আর্থিক প্রতিবেদন' : 'Financial Statement'}
                          </span>
                        )}
                      </div>
                      <span>{notice.date}</span>
                    </div>

                    <h3 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 transition-colors ${
                      isAudit
                        ? 'text-[#102B3F] dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300'
                        : 'text-[#102B3F] dark:text-white group-hover:text-[#167D78] dark:group-hover:text-[#D6F36A]'
                    }`}>
                      {language === 'bn' ? notice.titleBn : notice.titleEn}
                    </h3>
                    
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                      {language === 'bn' ? notice.bodyBn : notice.bodyEn}
                    </p>

                    {/* Published By Info (Requirement 4) & Quick Download Action */}
                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <span>{language === 'bn' ? 'জারি / প্রকাশনা:' : 'Issued By:'}</span>
                        <span className="font-semibold text-[#167D78] dark:text-[#D6F36A] truncate">
                          {renderPersonInfo(notice.publishedBy)}
                        </span>
                      </div>

                      {isAudit ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNotice(notice);
                          }}
                          className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-700 hover:text-white text-purple-700 dark:text-purple-300 text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{language === 'bn' ? 'বিবরণ পড়ুন' : 'Read Audit'}</span>
                        </button>
                      ) : (
                        <span className="text-stone-400 font-semibold group-hover:text-[#167D78] transition-colors">
                          {language === 'bn' ? 'বিস্তারিত পড়ুন →' : 'Read more →'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* RSVP Modal (Full-Page Spacious on Mobile) */}
      {activeRsvpEvent && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/70 sm:backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRsvp();
          }}
        >
          <div className="min-h-screen sm:min-h-0 sm:my-10 sm:mx-auto sm:max-w-lg w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden">
            <div className="sticky top-0 z-10 p-4 sm:p-5 bg-gradient-to-r from-[#102B3F] to-[#167D78] text-white flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6F36A] block">
                  {language === 'bn' ? 'ইভেন্ট অংশগ্রহণ তালিকাভুক্তি' : 'Event Registration'}
                </span>
                <h3 className="text-base font-bold truncate">
                  {language === 'bn' ? activeRsvpEvent.titleBn : activeRsvpEvent.titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeRsvp}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-stone-900 dark:text-white">
                    {language === 'bn' ? 'নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!' : 'RSVP Successfully Confirmed!'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {language === 'bn'
                      ? 'আপনার প্রদত্ত নম্বরে একটি নিশ্চিতকরণ বার্তা পাঠানো হবে। অনুষ্ঠানে আপনার উপস্থিতি আমাদের প্রেরণা জোগাবে।'
                      : 'We have reserved your spot. We look forward to seeing you at the event.'}
                  </p>
                </div>
                <button
                  onClick={closeRsvp}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#167D78] rounded-xl cursor-pointer"
                >
                  {language === 'bn' ? 'ঠিক আছে' : 'Got it'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ আশরাফ' : 'John Doe'}
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    {language === 'bn' ? 'অংশগ্রহণকারীর সংখ্যা' : 'Number of Attendees'}
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#167D78]"
                  >
                    <option value="1">১ জন (1 Person)</option>
                    <option value="2">২ জন (2 Persons)</option>
                    <option value="3">৩ জন (3 Persons)</option>
                    <option value="5">৫ জন বা ততোধিক (5+ Team)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeRsvp}
                    className="px-4 py-2 text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-[#167D78] hover:bg-[#102B3F] rounded-lg transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'নিবন্ধন নিশ্চিত করুন' : 'Confirm Attendance'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Notice View Modal (Full-Page Spacious Readable Layout) */}
      {activeNotice && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/75 sm:backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveNotice(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-screen sm:min-h-0 sm:my-6 sm:mx-auto sm:max-w-3xl w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden">
            {/* Slim Sticky Bar */}
            <div className="sticky top-0 z-20 bg-[#102B3F] text-white px-4 sm:px-6 h-14 flex items-center justify-between gap-3 border-b border-white/15">
              <div className="flex items-center gap-2 min-w-0">
                <Bell className="w-4 h-4 text-[#D6F36A] shrink-0" />
                <span className="font-bold text-sm sm:text-base truncate">
                  {language === 'bn' ? 'দাপ্তরিক বিজ্ঞপ্তি ও বিবরণী' : 'Official Circular & Notice'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveNotice(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
              </button>
            </div>

            <div className="p-5 sm:p-8 text-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#167D78] dark:text-[#D6F36A] px-2.5 py-0.5 rounded-md bg-[#167D78]/10 dark:bg-[#D6F36A]/10">
                    {activeNotice.category}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400 font-mono text-xs">{activeNotice.date}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-2 leading-snug">
                  {language === 'bn' ? activeNotice.titleBn : activeNotice.titleEn}
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <p className="text-stone-700 dark:text-stone-200 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {language === 'bn' ? activeNotice.bodyBn : activeNotice.bodyEn}
                </p>
              </div>

            {/* If Audit Notice: Display Comprehensive Internal Financial Breakdown */}
            {(activeNotice.id === 'not-1' || activeNotice.category === 'audit') && (
              <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-stone-900/40 to-[#102B3F]/30 border border-emerald-500/30">
                <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D6F36A]" />
                    <span className="font-bold text-xs text-[#102B3F] dark:text-white">
                      {language === 'bn' ? '২০২৫-২০২৬ অভ্যন্তরীণ আর্থিক বিবরণী সারসংক্ষেপ' : 'FY 2025-26 Internal Financial Summary'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    CLSH-FIN-2026
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{language === 'bn' ? 'মোট প্রাপ্ত অনুদান' : 'Total Income'}</span>
                    <span className="text-sm font-extrabold text-[#167D78] dark:text-[#D6F36A]">৳৪২,৮৫,০০০</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block font-medium">অভ্যন্তরীণ হিসাবে সংরক্ষিত</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{language === 'bn' ? 'মাঠপর্যায়ে সেবা ব্যয়' : 'Direct Relief'}</span>
                    <span className="text-sm font-extrabold text-stone-900 dark:text-white">৳৩৮,১৫,০০০</span>
                    <span className="text-[9px] text-stone-500 block font-medium">৮৯.০% সরাসরি বিতরণ</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{language === 'bn' ? 'আপদকালীন তহবিল' : 'Reserve Fund'}</span>
                    <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">৳৪,৭০,০০০</span>
                    <span className="text-[9px] text-teal-600 dark:text-teal-400 block font-medium">হাওর ও দুর্যোগে সংরক্ষিত</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span>{language === 'bn' ? 'হিসাব সংকলন:' : 'Compiled By:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white">অর্থ সচিবালয় ও কার্যনির্বাহী পরিষদ</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>{language === 'bn' ? 'অডিট অবস্থান:' : 'External Audit:'}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-300">অভ্যন্তরীণ হিসাব (বাহ্যিক সিএ অডিট এখনো সম্পন্ন হয়নি)</span>
                  </div>
                </div>

                {/* Audit View-Only Notice & Archive Reader */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                    <Lock className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
                    <span>{language === 'bn' ? 'সর্বসাধারণের জন্য কেবল পঠনযোগ্য (ডাউনলোড সংরক্ষিত)' : 'View-Only Online Inspection (Download Restricted)'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveNotice(null);
                      setIsReportsArchiveOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-700 hover:text-white text-purple-700 dark:text-purple-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সম্পূর্ণ অডিট আর্কাইভ পড়ুন' : 'Read Full Archive'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Published / Issued By Governance Box */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold uppercase">{language === 'bn' ? 'বিজ্ঞপ্তি জারিকারী কর্মকর্তা:' : 'Published / Issued By:'}</span>
                <span className="font-bold text-[#167D78] dark:text-[#D6F36A]">
                  {renderPersonInfo(activeNotice.publishedBy)}
                </span>
              </div>
              {activeNotice.department && (
                <div className="flex items-center justify-between text-stone-500">
                  <span>{language === 'bn' ? 'সংশ্লিষ্ট দপ্তর / বিভাগ:' : 'Department:'}</span>
                  <span className="font-medium text-stone-700 dark:text-stone-300">{activeNotice.department}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-400">
                কোলাশ ফাউন্ডেশন সেন্ট্রাল সেক্রেটারিয়েট · হটলাইন: 01646-475348
              </span>
              <button
                onClick={() => setActiveNotice(null)}
                className="px-5 py-2 font-bold text-white bg-stone-700 hover:bg-stone-800 rounded-xl cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Approved Social Platforms & News Coverage Feed */}
      <div className="mt-10">
        <SocialAndNewsFeedSection
          items={socialNewsFeed}
          language={language}
          onOpenLinkImporter={onOpenLinkImporter}
        />
      </div>

      {/* Official Constitution & Audit Reports Archive Modal */}
      <ReportsArchiveModal
        isOpen={isReportsArchiveOpen}
        onClose={() => setIsReportsArchiveOpen(false)}
        language={language}
      />

    </section>
  );
};
