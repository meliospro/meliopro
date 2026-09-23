import React, { useState } from 'react';

interface SamaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'light' | 'dark' | 'yellow';
  showSlogan?: boolean;
  showText?: boolean;
  className?: string;
  useImage?: boolean;
}

export const SamaLogo: React.FC<SamaLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSlogan = false,
  showText = true,
  className = '',
  useImage = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
  };

  const sloganSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
    '2xl': 'text-base',
  };

  const textColor = variant === 'dark' ? 'text-white' : 'text-neutral-900';
  const sloganColor = variant === 'dark' ? 'text-neutral-300' : 'text-neutral-600';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* SamaTaxi Official Logo / Emblem */}
        <div
          className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-neutral-900 shadow-md overflow-hidden flex-shrink-0 border border-neutral-800`}
        >
          {useImage && !imageError ? (
            <img
              src="/logo.png"
              alt="SamaTaxi Logo"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/icon.svg"
              alt="SamaTaxi Icon"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Brand Name */}
        {showText && (
          <div className="flex flex-col text-left">
            <div className={`font-black tracking-tight leading-none ${textSizes[size]} ${textColor} font-display flex items-baseline`}>
              <span>SAMA</span>
              <span className="text-[#F5B800] ml-1">TAXI</span>
            </div>
            {showSlogan && (
              <span className={`mt-0.5 font-medium italic tracking-wide ${sloganSizes[size]} ${sloganColor}`}>
                Votre trajet, notre priorité
              </span>
            )}
          </div>
        )}
      </div>

      {showSlogan && !showText && (
        <span className={`mt-1 font-medium italic tracking-wide ${sloganSizes[size]} ${sloganColor}`}>
          Votre trajet, notre priorité
        </span>
      )}
    </div>
  );
};
