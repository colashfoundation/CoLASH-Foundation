import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

const RECOVERY_ATTEMPT_KEY = 'colash_eb_recovery_once';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('CoLASH Application ErrorBoundary caught:', error, info);

    // One-time silent auto-recovery if corrupted localStorage keys caused the crash
    try {
      const alreadyTried = window.sessionStorage.getItem(RECOVERY_ATTEMPT_KEY);
      if (!alreadyTried) {
        window.sessionStorage.setItem(RECOVERY_ATTEMPT_KEY, '1');
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith('colash_')) {
            window.localStorage.removeItem(key);
          }
        });
      }
    } catch {
      // ignore storage access issues
    }
  }

  handleResetCache = () => {
    try {
      window.sessionStorage.removeItem(RECOVERY_ATTEMPT_KEY);
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith('colash_')) {
          window.localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
    window.location.hash = '#home';
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = '#home';
    this.setState({ hasError: false, errorMessage: '' });
  };

  handleSimpleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F3ED] text-[#102B3F] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-[#102B3F]">
                ওয়েবসাইট রিকভারি মোড / Page Recovery
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                ব্রাউজারের লোকাল ক্যাশ বা সাময়িক ত্রুটির কারণে পেজটি লোড হতে সমস্যা হয়েছে। পুনরায় রিলোড অথবা হোম পেজ থেকে শুরু করতে পারেন।
              </p>
              {this.state.errorMessage && (
                <details className="text-left pt-2">
                  <summary className="text-[11px] font-semibold text-stone-500 cursor-pointer hover:text-[#167D78]">
                    ত্রুটির বিবরণ দেখুন (Technical Detail)
                  </summary>
                  <pre className="mt-1.5 p-2.5 rounded-xl bg-stone-100 text-[10px] font-mono text-rose-700 overflow-x-auto whitespace-pre-wrap break-words">
                    {this.state.errorMessage}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>হোম পেজে ফিরে যান (Return to Home)</span>
              </button>
              <button
                type="button"
                onClick={this.handleSimpleReload}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer transition-colors border border-stone-300"
              >
                <RotateCcw className="w-4 h-4 text-[#167D78]" />
                <span>পুনরায় রিলোড করুন (Reload Page)</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold cursor-pointer transition-colors border border-stone-200"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>লোকাল ক্যাশ রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
