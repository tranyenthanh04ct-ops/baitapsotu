import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'cheering' | 'thinking' | 'encouraging';

interface ChibiMascotProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onBubbleClick?: () => void;
}

export const ChibiMascot: React.FC<ChibiMascotProps> = ({
  mood = 'idle',
  speechText,
  size = 'md',
  className = '',
  onBubbleClick,
}) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
  };

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Mascot Animated Character (SVG Art) */}
      <div className={`relative shrink-0 ${sizeMap[size]} transition-transform duration-300`}>
        <div className={`w-full h-full ${mood === 'happy' || mood === 'cheering' ? 'animate-bounce' : mood === 'thinking' ? 'animate-wiggle' : 'animate-float'}`}>
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="furGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>
              <linearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFF7ED" />
              </linearGradient>
              <linearGradient id="hatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
            </defs>

            {/* Cat Ears */}
            <path d="M 40 45 L 25 15 L 60 30 Z" fill="#F97316" />
            <path d="M 40 42 L 30 22 L 54 32 Z" fill="#FECDD3" />
            <path d="M 120 45 L 135 15 L 100 30 Z" fill="#F97316" />
            <path d="M 120 42 L 130 22 L 106 32 Z" fill="#FECDD3" />

            {/* Body */}
            <ellipse cx="80" cy="115" rx="42" ry="34" fill="url(#furGradient)" />
            {/* Belly */}
            <ellipse cx="80" cy="120" rx="26" ry="22" fill="url(#bellyGradient)" />

            {/* Little paws */}
            {mood === 'cheering' ? (
              <>
                {/* Cheering paws raised up */}
                <ellipse cx="45" cy="85" rx="10" ry="14" fill="#FDBA74" transform="rotate(-35 45 85)" />
                <ellipse cx="115" cy="85" rx="10" ry="14" fill="#FDBA74" transform="rotate(35 115 85)" />
              </>
            ) : mood === 'thinking' ? (
              <>
                {/* Thinking paw on chin */}
                <ellipse cx="50" cy="120" rx="9" ry="12" fill="#FDBA74" />
                <ellipse cx="98" cy="95" rx="10" ry="13" fill="#FDBA74" transform="rotate(-20 98 95)" />
              </>
            ) : (
              <>
                {/* Normal resting paws */}
                <ellipse cx="56" cy="122" rx="9" ry="11" fill="#FDBA74" />
                <ellipse cx="104" cy="122" rx="9" ry="11" fill="#FDBA74" />
              </>
            )}

            {/* Feet */}
            <ellipse cx="60" cy="144" rx="12" ry="8" fill="#F97316" />
            <ellipse cx="100" cy="144" rx="12" ry="8" fill="#F97316" />

            {/* Head */}
            <ellipse cx="80" cy="70" rx="46" ry="38" fill="url(#furGradient)" />

            {/* Scholar Cap / Cute Hat */}
            <g transform="translate(80, 32) rotate(-8) translate(-80, -32)">
              <polygon points="80,18 120,28 80,38 40,28" fill="url(#hatGradient)" />
              <rect x="74" y="32" width="12" height="10" fill="#3730A3" rx="2" />
              {/* Golden tassel */}
              <path d="M 80 28 Q 115 28 120 48" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
              <circle cx="120" cy="50" r="3" fill="#F59E0B" />
            </g>

            {/* Eyes & Expressions */}
            {mood === 'happy' || mood === 'cheering' ? (
              // Joyful curved arc eyes ^ _ ^
              <>
                <path d="M 54 68 Q 63 56 72 68" stroke="#431407" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 88 68 Q 97 56 106 68" stroke="#431407" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Blushing cheeks */}
                <circle cx="50" cy="78" r="8" fill="#FB7185" opacity="0.6" />
                <circle cx="110" cy="78" r="8" fill="#FB7185" opacity="0.6" />
                {/* Happy open mouth */}
                <path d="M 72 79 Q 80 92 88 79 Z" fill="#E11D48" />
              </>
            ) : mood === 'thinking' ? (
              // Thoughtful eyes looking up-right
              <>
                <circle cx="64" cy="68" r="7" fill="#431407" />
                <circle cx="66" cy="66" r="2.5" fill="#FFFFFF" />
                <circle cx="96" cy="68" r="7" fill="#431407" />
                <circle cx="98" cy="66" r="2.5" fill="#FFFFFF" />
                {/* Curious small 'o' mouth */}
                <ellipse cx="80" cy="80" rx="3.5" ry="4.5" fill="#7C2D12" />
                {/* Blushing */}
                <circle cx="50" cy="77" r="6" fill="#FB7185" opacity="0.4" />
                <circle cx="110" cy="77" r="6" fill="#FB7185" opacity="0.4" />
                {/* Thinking spark / tiny lightbulb floating */}
                <g transform="translate(118, 30)">
                  <circle cx="8" cy="8" r="8" fill="#FDE047" />
                  <path d="M 5 8 L 11 8 M 8 5 L 8 11" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                </g>
              </>
            ) : mood === 'encouraging' ? (
              // Gentle encouraging eyes with soft smile
              <>
                <circle cx="62" cy="70" r="6" fill="#431407" />
                <circle cx="64" cy="68" r="2.5" fill="#FFFFFF" />
                <circle cx="98" cy="70" r="6" fill="#431407" />
                <circle cx="100" cy="68" r="2.5" fill="#FFFFFF" />
                {/* Gentle smile */}
                <path d="M 74 79 Q 80 84 86 79" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Soft blush */}
                <circle cx="52" cy="78" r="7" fill="#FB7185" opacity="0.45" />
                <circle cx="108" cy="78" r="7" fill="#FB7185" opacity="0.45" />
              </>
            ) : (
              // Idle cute big shiny eyes
              <>
                <ellipse cx="62" cy="69" rx="6.5" ry="8" fill="#431407" />
                <circle cx="64" cy="66" r="2.8" fill="#FFFFFF" />
                <circle cx="60" cy="72" r="1.5" fill="#FFFFFF" />

                <ellipse cx="98" cy="69" rx="6.5" ry="8" fill="#431407" />
                <circle cx="100" cy="66" r="2.8" fill="#FFFFFF" />
                <circle cx="96" cy="72" r="1.5" fill="#FFFFFF" />

                {/* Cute 'w' mouth */}
                <path d="M 74 78 Q 77 82 80 78 Q 83 82 86 78" stroke="#7C2D12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                {/* Cheeks */}
                <circle cx="50" cy="77" r="7" fill="#FB7185" opacity="0.5" />
                <circle cx="110" cy="77" r="7" fill="#FB7185" opacity="0.5" />
              </>
            )}

            {/* Tiny cute nose */}
            <polygon points="78,74 82,74 80,76" fill="#F43F5E" />

            {/* Cute Whiskers */}
            <line x1="32" y1="74" x2="44" y2="76" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="33" y1="80" x2="45" y2="79" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="128" y1="74" x2="116" y2="76" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="127" y1="80" x2="115" y2="79" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Small book or star in hand if cheerful */}
            {(mood === 'happy' || mood === 'cheering') && (
              <g transform="translate(130, 20) scale(0.8)">
                <polygon points="12,0 15,9 24,9 17,15 19,24 12,18 5,24 7,15 0,9 9,9" fill="#FBBF24" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Speech Bubble */}
      {speechText && (
        <div 
          onClick={onBubbleClick}
          className="relative max-w-sm bg-white/95 backdrop-blur-xs border border-orange-100 rounded-2xl px-4 py-3 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
        >
          {/* Bubble tail pointer */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-white" />
          
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Mimi Đồng Hành
            </span>
            <span className="text-xs">✨</span>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {speechText}
          </p>
        </div>
      )}
    </div>
  );
};
