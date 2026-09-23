import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-2xl bg-amber-500/95 backdrop-blur-xs px-3 py-2 text-xs font-bold text-neutral-950 shadow-xl border border-amber-400">
      <WifiOff size={15} />
      <span>Mode hors-ligne — Les données locales sont utilisées</span>
    </div>
  );
};
