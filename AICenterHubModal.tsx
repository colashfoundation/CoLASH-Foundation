import React from 'react';
import {
  Bot,
  Shirt,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Language } from '../../types';

interface AICenterHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenMainChatbot: () => void;
  onOpenMensAdvisor: () => void;
  onOpenWomensAdvisor?: () => void;
  onOpenSearch: () => void;
}

export const AICenterHubModal: React.FC<AICenterHubModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenMainChatbot,
  onOpenMensAdvisor,
  onOpenSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/65 sm:backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-screen sm:min-h-0 sm:my-8 sm:mx-auto sm:max-w-2xl w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden flex flex-col">

        {/* Slim Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#102B3F] text-white px-4 sm:px-6 h-14 flex items-center justify-between gap-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#167D78] flex items-center justify-center text-[#D6F36A] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold truncate">
              {language === 'bn' ? 'CoLASH Foundation AI Hub' : 'CoLASH Foundation AI Hub'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-stone-100 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'bn' ? 'বন্ধ' : 'Close'}</span>
          </button>
        </div>

        {/* Body with Public & Member AI Options */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">

          {/* AI Option 1: Main AI Chatbot */}
          <div
            onClick={() => {
              onClose();
              onOpenMainChatbot();
            }}
            className="p-5 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/50 dark:hover:bg-teal-950/40 transition-all cursor-pointer group flex items-start gap-4 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-[#167D78] text-[#D6F36A] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-[#102B3F] dark:text-white group-hover:text-[#167D78] dark:group-hover:text-[#D6F36A] transition-colors">
                    ১. Main AI Chatbot
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {language === 'bn' ? 'সবার জন্য উন্মুক্ত' : 'Public Access'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] flex items-center gap-1">
                  চালু করুন <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                {language === 'bn'
                  ? 'ফাউন্ডেশনের সকল কার্যক্রম, প্রকল্প ও সাধারণ তথ্য সহায়তায় তাৎক্ষণিক উত্তর।'
                  : 'Public assistant for all foundation activities, projects and general inquiries.'}
              </p>
            </div>
          </div>

          {/* AI Option 2: Men’s Dress & Style Advisor */}
          <div
            onClick={() => {
              onClose();
              onOpenMensAdvisor();
            }}
            className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 transition-all cursor-pointer group flex items-start gap-4 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-[#102B3F] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Shirt className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-[#102B3F] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ২. Men’s Dress & Style Advisor
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                    {language === 'bn' ? 'CoLASH সদস্যের জন্য সংরক্ষিত' : 'Members Only'}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  চালু করুন <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                {language === 'bn'
                  ? 'রেজিস্টার্ড সদস্যদের জন্য ব্যক্তিগত পোশাক সমন্বয় ও গ্রুমিং গাইড।'
                  : 'Personal attire coordination and grooming guide for registered members.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#167D78]" />
            <span>{language === 'bn' ? 'সব টুল ১০০% ফ্রি ও নিরাপদ' : 'All tools 100% free & private'}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="text-stone-600 dark:text-stone-300 hover:text-stone-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অথবা ওয়েবসাইট সার্চ করুন' : 'Or Search Site'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
