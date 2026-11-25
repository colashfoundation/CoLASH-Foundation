import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, ArrowRight, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { Language, PortalCategoryKey } from '../types';
import { COLASH_FAQ_ITEMS, FAQ_CATEGORIES, FAQCategoryId, getFAQCategoryLabel } from '../data/faqData';

interface FAQSectionProps {
  language: Language;
  onSelectCategory?: (category: PortalCategoryKey) => void;
  onOpenDonate?: () => void;
  showDedicatedBanner?: boolean;
  compactPreview?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  language,
  onSelectCategory,
  onOpenDonate,
  showDedicatedBanner = false,
  compactPreview = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string>(COLASH_FAQ_ITEMS[0]?.id || '');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = COLASH_FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.questionBn.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answerBn.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q)
      );
    });
    return compactPreview && !q && selectedCategory === 'all' ? list.slice(0, 4) : list;
  }, [selectedCategory, searchQuery, compactPreview]);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="colash-faq-heading">
      <div className="space-y-7">
        {/* Institutional Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A]">
              {language === 'bn'
                ? 'সচরাচর জিজ্ঞাসা · স্বচ্ছ তথ্যকেন্দ্র'
                : 'Frequently Asked Questions'}
            </div>
            <h2
              id="colash-faq-heading"
              className="text-2xl sm:text-3xl stylish-title text-balance"
            >
              {language === 'bn'
                ? 'কোলাশ ফাউন্ডেশন নিয়ে সাধারণ জিজ্ঞাসা'
                : 'Clear Answers About CoLASH Foundation'}
            </h2>
            {!compactPreview && (
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl pt-1">
                {language === 'bn'
                  ? 'সংগঠনের আদর্শ, ৳১ থেকে অনুদান ব্যবস্থা, উন্মুক্ত অডিট স্বচ্ছতা, কমিটি কাঠামো ও নাগরিক সাহায্যের আবেদন প্রক্রিয়া সম্পর্কে প্রয়োজনীয় সব উত্তর।'
                  : 'Transparent answers covering our non-political charter, ৳1 minimum donations, accounts, governance structure, and how to apply for aid.'}
              </p>
            )}
          </div>

          {!compactPreview ? (
            <div className="w-full lg:w-80 shrink-0">
              <label htmlFor="faq-search-input" className="sr-only">
                {language === 'bn' ? 'প্রশ্ন খুঁজুন' : 'Search questions'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="faq-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'যেকোনো প্রশ্ন বা শব্দ লিখে খুঁজুন...' : 'Search questions or keywords...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-700 text-sm text-[#102B3F] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#167D78]"
                />
              </div>
            </div>
          ) : (
            onSelectCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory('faq')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer shrink-0"
              >
                <span>
                  {language === 'bn'
                    ? `সকল প্রশ্ন ও উত্তর দেখুন (${COLASH_FAQ_ITEMS.length})`
                    : `View All Questions (${COLASH_FAQ_ITEMS.length})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

        {/* Interactive Filter Tabs (shown on dedicated FAQ page) */}
        {!compactPreview && (
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-stone-100/90 dark:bg-[#0c1a24] border border-stone-200/80 dark:border-stone-800 w-fit max-w-full">
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#102B3F] text-[#D6F36A] shadow-2xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-[#102B3F] dark:hover:text-white hover:bg-white/70 dark:hover:bg-stone-800/60'
                  }`}
                >
                  {language === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              );
            })}
          </div>
        )}

        {/* Main 2-Column Editorial Layout: Left Accordion + Right Quick Help Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Accordion List */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200/80 dark:border-stone-800 divide-y divide-stone-200/80 dark:divide-stone-800 overflow-hidden">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <HelpCircle className="w-7 h-7 text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-[#102B3F] dark:text-white">
                  {language === 'bn' ? 'আপনার খোঁজা প্রশ্নের সাথে মিলে এমন কিছু পাওয়া যায়নি' : 'No matching questions found'}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {language === 'bn'
                    ? 'অন্য কোনো শব্দ দিয়ে খুঁজুন অথবা সব প্রশ্ন দেখতে ফিল্টার রিসেট করুন।'
                    : 'Try another keyword or reset the category filter.'}
                </p>
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isOpen = openId === item.id;
                const questionText = language === 'bn' ? item.questionBn : item.questionEn;
                const answerText = language === 'bn' ? item.answerBn : item.answerEn;
                const actionText = language === 'bn' ? item.actionLabelBn : item.actionLabelEn;
                const numLabel = String(idx + 1).padStart(2, '0');

                return (
                  <div key={item.id} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? '' : item.id)}
                      aria-expanded={isOpen}
                      className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-4 hover:bg-stone-50/80 dark:hover:bg-stone-900/40 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400">
                          <span className="tabular-nums font-bold text-[#167D78] dark:text-[#D6F36A]">
                            {numLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{getFAQCategoryLabel(item.category, language)}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#102B3F] dark:text-white leading-snug">
                          {questionText}
                        </h3>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-1 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#167D78] dark:text-[#D6F36A]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-0 space-y-3">
                        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-prose">
                          {answerText}
                        </p>
                        {item.actionCategory && actionText && onSelectCategory && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => onSelectCategory(item.actionCategory!)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer"
                            >
                              <span>{actionText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Summary & Direct Inquiry Column */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl bg-[#102B3F] text-white border border-stone-800 space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#D6F36A] font-bold">
                {language === 'bn' ? 'এক নজরে কোলাশ ফাউন্ডেশন' : 'CoLASH At A Glance'}
              </div>
              <dl className="divide-y divide-white/10 text-xs">
                <div className="py-2.5 flex justify-between gap-3">
                  <dt className="text-stone-300">{language === 'bn' ? 'প্রতিষ্ঠা তারিখ' : 'Founded'}</dt>
                  <dd className="font-bold text-white tabular-nums">০৭ মার্চ ২০২৬</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-3">
                  <dt className="text-stone-300">{language === 'bn' ? 'অবস্থান' : 'Headquarters'}</dt>
                  <dd className="font-bold text-white text-right">
                    {language === 'bn' ? 'কমলগঞ্জ, মৌলভীবাজার' : 'Kamalganj, Moulvibazar'}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between gap-3">
                  <dt className="text-stone-300">{language === 'bn' ? 'আদর্শ ও নীতি' : 'Charter'}</dt>
                  <dd className="font-bold text-[#D6F36A] text-right">
                    {language === 'bn' ? 'অরাজনৈতিক ও অসাম্প্রদায়িক' : 'Non-Political & Secular'}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between gap-3">
                  <dt className="text-stone-300">{language === 'bn' ? 'সর্বনিম্ন অনুদান' : 'Min. Donation'}</dt>
                  <dd className="font-bold text-white tabular-nums">
                    {language === 'bn' ? '৳১ (এক টাকা)' : '৳1 (1 BDT)'}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between gap-3">
                  <dt className="text-stone-300">{language === 'bn' ? 'কার্যনির্বাহী পরিষদ' : 'Executive Council'}</dt>
                  <dd className="font-bold text-white tabular-nums">২০২৬–২০২৮ (১৬ জন)</dd>
                </div>
              </dl>

              <div className="pt-2 flex flex-col gap-2">
                {onOpenDonate && (
                  <button
                    type="button"
                    onClick={onOpenDonate}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#D6F36A] hover:bg-white text-[#102B3F] font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'bn' ? '৳১ থেকে মানবিক অনুদান দিন' : 'Donate From ৳1 Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onSelectCategory && (
                  <button
                    type="button"
                    onClick={() => onSelectCategory('notices_applications')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-white/15"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-[#D6F36A]" />
                    <span>
                      {language === 'bn' ? 'নতুন প্রশ্ন বা সাহায্যের আবেদন পাঠান' : 'Ask Question / Apply for Aid'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {showDedicatedBanner && onSelectCategory && (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="text-xs font-bold text-[#102B3F] dark:text-white">
                  {language === 'bn' ? 'সরাসরি হটলাইন সহায়তা' : 'Direct Helpline'}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {language === 'bn'
                    ? 'জরুরি রক্তের প্রয়োজন বা সরাসরি যেকোনো তথ্যের জন্য কল করুন +880 1646-475348 নম্বরে।'
                    : 'Call +880 1646-475348 anytime for urgent blood matching or direct inquiries.'}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectCategory('contact_location')}
                  className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'কার্যালয়ের ঠিকানা ও ম্যাপ' : 'Office Address & Map'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};
