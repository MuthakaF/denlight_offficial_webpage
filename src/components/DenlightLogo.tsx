import React from 'react';

interface DenlightLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DenlightLogo: React.FC<DenlightLogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
  size = 'md'
}) => {
  const isLightVariant = variant === 'light';

  // Responsive scale dimensions
  const dimensions = {
    sm: { width: 150, height: 38 },
    md: { width: 200, height: 48 },
    lg: { width: 260, height: 60 },
    xl: { width: 320, height: 74 }
  }[size];

  const primaryTextColor = isLightVariant ? '#FFFFFF' : '#0F172A';
  const subtitleColor = isLightVariant ? '#94A3B8' : '#64748B';
  const accentRed = '#DC2626'; // Vibrant Tech Red

  return (
    <div className={`inline-flex items-center select-none cursor-pointer group ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 280 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 group-hover:scale-[1.02]"
      >
        {/* --- GEOMETRIC TECH EMBLEM / LOGOMARK --- */}
        <g className="brand-emblem">
          {/* Outer Rounded Tech Square / Shield */}
          <rect
            x="4"
            y="6"
            width="52"
            height="52"
            rx="14"
            fill={isLightVariant ? '#1E293B' : '#0F172A'}
            stroke={isLightVariant ? '#334155' : '#E2E8F0'}
            strokeWidth="2"
          />

          {/* Stylized Futuristic 'D' Shape */}
          <path
            d="M 18 18 H 32 C 40.5 18 46 23.5 46 32 C 46 40.5 40.5 46 32 46 H 18 V 18 Z M 25 24 V 40 H 32 C 36.5 40 40 37 40 32 C 40 27 36.5 24 32 24 H 25 Z"
            fill={isLightVariant ? '#FFFFFF' : '#FFFFFF'}
          />

          {/* Dynamic Laser Beam Slash in Red */}
          <polygon
            points="14,44 48,16 52,22 18,50"
            fill={accentRed}
          />

          {/* Glowing Tech Circuit Node Dot */}
          <circle cx="48" cy="18" r="4" fill={accentRed} />
          <circle cx="48" cy="18" r="2" fill="#FFFFFF" />
        </g>

        {/* --- BRAND WORDMARK "DENLIGHT" --- */}
        <g className="brand-wordmark">
          {/* DEN - Primary Color */}
          <text
            x="68"
            y="38"
            fill={primaryTextColor}
            fontSize="26"
            fontWeight="900"
            fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
            letterSpacing="-0.04em"
          >
            DEN
          </text>

          {/* LIGHT - Red Accent Color */}
          <text
            x="126"
            y="38"
            fill={accentRed}
            fontSize="26"
            fontWeight="900"
            fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
            letterSpacing="-0.04em"
          >
            LIGHT
          </text>

          {/* Red Accent Beam Dot after DENLIGHT */}
          <circle cx="218" cy="32" r="3.5" fill={accentRed} />
        </g>

        {/* --- SUBTITLE "IT SOLUTIONS" --- */}
        {showSubtitle && (
          <g className="brand-subtitle">
            <text
              x="69"
              y="54"
              fill={subtitleColor}
              fontSize="9"
              fontWeight="800"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              letterSpacing="0.26em"
            >
              IT SOLUTIONS • NAIVASHA
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

