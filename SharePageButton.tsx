import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface SharePageButtonProps {
  language: Language;
  title: string;
  text: string;
  url: string;
  variant?: 'default' | 'dark-glass';
  onSharedToast?: (title: string, subtitle?: string) => void;
}

export const SharePageButton: React.FC<SharePageButtonProps> = ({
  language,
  title,
  text,
  url,
  variant = 'default',
  onSharedToast,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const handleShareClick = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        onSharedToast?.(
          language === 'bn' ? 'পেজটি সফলভাবে শেয়ার হয়েছে' : 'Shared successfully',
          title
        );
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          return;
        }
      }
    }
    setMenuOpen((prev) => !prev);
  };

  const handleCopyWithMessage = () => {
    const payload = `${title}\n${text}\n\n${url}`;
    navigator.clipboard?.writeText(payload)?.catch(() => {});
    setCopiedFull(true);
    onSharedToast?.(
      language === 'bn' ? 'বার্তাসহ শেয়ার লিংক কপি হয়েছে' : 'Share message & link copied',
      url
    );
    setTimeout(() => {
      setCopiedFull(false);
      setMenuOpen(false);
    }, 1200);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTextWithUrl = encodeURIComponent(`${text}\n\n${url}`);
  const encodedQuote = encodeURIComponent(text);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}`;
  const whatsappHref = `https://wa.me/?text=${encodedTextWithUrl}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodedQuote}&url=${encodedUrl}`;

  const buttonClasses =
    variant === 'dark-glass'
      ? 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#167D78] hover:bg-[#19918b] text-white font-sans text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0'
      : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#167D78] hover:bg-[#102B3F] text-white font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0';

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleShareClick}
        className={buttonClasses}
        title={language === 'bn' ? 'সোশ্যাল মিডিয়ায় শেয়ার করুন' : 'Share this page on social media'}
        aria-label={language === 'bn' ? 'পেজ শেয়ার করুন' : 'Share page'}
        aria-expanded={menuOpen}
      >
        <Share2 className="w-3.5 h-3.5 text-[#D6F36A]" />
        <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
      </button>

      {menuOpen && (
        <div
          role="dialog"
          aria-label={language === 'bn' ? 'সোশ্যাল মিডিয়া শেয়ার' : 'Social Media Share'}
          className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white dark:bg-[#0e1f2b] border border-stone-200 dark:border-stone-700 shadow-2xl p-3 z-50 text-left"
        >
          <div className="pb-2 mb-2 border-b border-stone-200 dark:border-stone-800">
            <div className="text-xs font-bold text-[#102B3F] dark:text-white">
              {language === 'bn' ? 'সোশ্যাল মিডিয়ায় শেয়ার করুন' : 'Share via Social Media'}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
              {text}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-xs font-semibold">
            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/70 hover:bg-[#1877F2] hover:text-white text-[#102B3F] dark:text-stone-100 transition-colors"
            >
              <span>Facebook</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/70 hover:bg-emerald-600 hover:text-white text-[#102B3F] dark:text-stone-100 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                WhatsApp
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={xHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/70 hover:bg-stone-900 hover:text-white text-[#102B3F] dark:text-stone-100 transition-colors"
            >
              <span>X (Twitter)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              type="button"
              onClick={handleCopyWithMessage}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#102B3F] hover:bg-[#167D78] text-white transition-colors cursor-pointer mt-0.5"
            >
              <span>
                {copiedFull
                  ? (language === 'bn' ? 'বার্তাসহ কপি হয়েছে!' : 'Copied Message & Link!')
                  : (language === 'bn' ? 'বার্তাসহ লিংক কপি করুন' : 'Copy Custom Message & Link')}
              </span>
              {copiedFull ? (
                <Check className="w-3.5 h-3.5 text-[#D6F36A]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#D6F36A]" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
