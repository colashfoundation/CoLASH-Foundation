import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/common/ErrorBoundary';
import {FirebaseErrorBoundary} from './components/common/FirebaseErrorBoundary';
import {FirebaseProvider} from './contexts/FirebaseContext';
import './index.css';

// Global Google Maps Platform quota & auth failure detection (Tier 1)
(window as unknown as {gm_authFailure?: () => void}).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  originalConsoleError.apply(console, args);
  const message = args.map((arg) => String(arg)).join(' ');
  if (message.includes('OverQuotaMapError') || message.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

createRoot(document.getElementById('root')!).render(
  <FirebaseErrorBoundary>
    <ErrorBoundary>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </ErrorBoundary>
  </FirebaseErrorBoundary>
);
