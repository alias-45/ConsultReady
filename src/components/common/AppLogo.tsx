import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  /** If true, renders a subtle white rounded container behind the logo */
  withContainer?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = 'h-10 w-10',
  size,
  withContainer = false
}) => {
  const svgContent = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Medical Consultation Headset Logo"
    >
      <defs>
        {/* Headband Gradient: Blue on bottom-left to mint green on top-right */}
        <linearGradient id="headbandGradient" x1="15%" y1="90%" x2="85%" y2="10%">
          <stop offset="0%" stopColor="#0095FF" />
          <stop offset="35%" stopColor="#00B4D8" />
          <stop offset="70%" stopColor="#00D28E" />
          <stop offset="100%" stopColor="#00E676" />
        </linearGradient>

        {/* Right Earmuff Gradient */}
        <linearGradient id="rightEarmuffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D28E" />
          <stop offset="100%" stopColor="#00E676" />
        </linearGradient>

        {/* Mic Boom Gradient */}
        <linearGradient id="micBoomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0095FF" />
          <stop offset="100%" stopColor="#00AAFF" />
        </linearGradient>
      </defs>

      {/* 1. Headset Headband (Top Arc) */}
      <path
        d="M 24 45 C 24 29 35.5 16 50 16 C 64.5 16 76 29 76 45"
        stroke="url(#headbandGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* 2. Left Earmuff (Blue Capsule) */}
      <rect
        x="18"
        y="35"
        width="9"
        height="23"
        rx="4.5"
        fill="#0095FF"
      />

      {/* 3. Right Earmuff (Mint Green Capsule) */}
      <rect
        x="73"
        y="35"
        width="9"
        height="23"
        rx="4.5"
        fill="url(#rightEarmuffGrad)"
      />

      {/* 4. Microphone Boom and Mouthpiece */}
      {/* Curved Boom Arm */}
      <path
        d="M 23 54 C 23 72.5 34.5 86 52 86"
        stroke="url(#micBoomGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Microphone Capsule */}
      <rect
        x="47"
        y="83"
        width="13"
        height="6.5"
        rx="3.25"
        fill="#0095FF"
      />

      {/* 5. Speech Bubble (Central Body) */}
      {/* Outer speech bubble shape with bottom-right tail */}
      <path
        d="
          M 50 20.5
          C 36.2 20.5 25 31.7 25 45.5
          C 25 54.8 30.2 62.9 38 67.2
          C 41.5 69.1 45.6 70.3 50 70.3
          C 54.8 70.3 59.3 69 63.2 66.8
          L 73.5 71.5
          L 70.8 61.2
          C 73.4 56.7 75 51.3 75 45.5
          C 75 31.7 63.8 20.5 50 20.5
          Z
        "
        fill="#FFFFFF"
        stroke="#00B4D8"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />

      {/* Subtle light-grey inner depth crescent along upper-right rim */}
      <path
        d="M 45 23.5 C 57.5 24.2 68.5 33 71.2 46.5 C 71.8 49.5 71.2 53 70 56"
        stroke="#E2E8F0"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* 6. ECG / Heartbeat Waveform in vibrant cyan */}
      <path
        d="M 33 46 H 42 L 46 58 L 52 26 L 57 52 L 61 41 L 64 46 H 71"
        stroke="#00B4D8"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  if (withContainer) {
    return (
      <div className="flex items-center justify-center rounded-3xl bg-white p-3 shadow-xl shadow-slate-200/60 border border-slate-100">
        {svgContent}
      </div>
    );
  }

  return svgContent;
};
