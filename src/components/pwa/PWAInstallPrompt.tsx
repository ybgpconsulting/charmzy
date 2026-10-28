import React, { useEffect, useState } from 'react';
import { Download, PlusSquare, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const DISMISSED_KEY = 'charmzy-install-prompt-dismissed';

function wasDismissedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(wasDismissedThisSession);
  const [installError, setInstallError] = useState('');
  const canOfferInstall = !isInstalled && (isInstallable || isIOS);

  useEffect(() => {
    if (!canOfferInstall || isDismissed) return;

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', dismissOnEscape);
    return () => window.removeEventListener('keydown', dismissOnEscape);
  }, [canOfferInstall, isDismissed]);

  const dismiss = () => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // The prompt still closes if browser storage is unavailable.
    }
  };

  const handleInstall = async () => {
    setInstallError('');
    try {
      await install();
    } catch {
      setInstallError('The install prompt could not be opened. Please try again from your browser menu.');
    }
  };

  if (!canOfferInstall || isDismissed) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/55 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-prompt-title"
        aria-describedby="install-prompt-description"
        className="relative w-full max-w-sm rounded-3xl border border-pink-100 bg-white p-6 text-zinc-800 shadow-2xl shadow-zinc-950/25 sm:p-7"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close install prompt"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-pink-50 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-5 flex items-center gap-3 pr-7">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-1 shadow-lg shadow-pink-200">
            <img src="/favicon.svg" alt="" className="h-full w-full rounded-xl bg-white object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-700">Charmzy app</p>
            <h2 id="install-prompt-title" className="mt-1 font-outfit text-xl font-black text-zinc-900">
              Take Charmzy with you
            </h2>
          </div>
        </div>

        <p id="install-prompt-description" className="text-sm leading-6 text-zinc-600">
          Add our store to your home screen for a quick, full-screen shopping experience.
        </p>

        {isIOS ? (
          <div className="mt-5 space-y-3 rounded-2xl border border-pink-100 bg-pink-50/70 p-4 text-sm text-zinc-700">
            <p className="font-bold text-zinc-900">To install on iPhone or iPad:</p>
            <div className="flex items-start gap-3">
              <Share className="mt-0.5 h-5 w-5 shrink-0 text-pink-700" aria-hidden="true" />
              <span>Tap the Share button in your browser.</span>
            </div>
            <div className="flex items-start gap-3">
              <PlusSquare className="mt-0.5 h-5 w-5 shrink-0 text-pink-700" aria-hidden="true" />
              <span>Choose <strong>Add to Home Screen</strong>.</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-pink-50 px-3 py-2.5 text-xs font-medium text-pink-900">
            <Smartphone className="h-4 w-4 shrink-0 text-pink-700" aria-hidden="true" />
            <span>Install Charmzy on this device for easy access.</span>
          </div>
        )}

        {installError && <p role="alert" className="mt-4 text-sm text-rose-700">{installError}</p>}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {!isIOS && (
            <button
              type="button"
              onClick={handleInstall}
              autoFocus
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Install app
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            autoFocus={isIOS}
            className="min-h-11 flex-1 rounded-xl border border-pink-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
          >
            Maybe later
          </button>
        </div>
      </section>
    </div>
  );
};
