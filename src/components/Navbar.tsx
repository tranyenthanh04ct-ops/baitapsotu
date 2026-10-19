import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Award, BookOpen, Brain, Compass } from 'lucide-react';
import { sound } from '../utils/sound';

export type ActiveTab = 'theory' | 'practice' | 'applied' | 'achievements';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  xp: number;
  streak: number;
  isMuted: boolean;
  onToggleSound: () => void;
  unlockedBadgesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  xp,
  streak,
  isMuted,
  onToggleSound,
  unlockedBadgesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <div 
          onClick={() => {
            sound.playClick();
            onTabChange('practice');
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 p-0.5 shadow-xs flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-transform">
            <span className="text-xl">🐱</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent font-display">
              Vương Quốc Số Từ
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Ngữ văn 7
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onTabChange('theory');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'theory'
                ? 'bg-amber-100 text-amber-900 shadow-xs scale-102'
                : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/70'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Học</span> Lý Thuyết
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTabChange('practice');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'practice'
                ? 'bg-pink-100 text-pink-900 shadow-xs scale-102'
                : 'text-slate-600 hover:text-pink-800 hover:bg-pink-50/70'
            }`}
          >
            <Brain className="w-4 h-4 text-pink-600" />
            <span>Luyện Tập</span>
            <span className="text-[10px] bg-pink-200/80 text-pink-800 px-1.5 py-0.2 rounded-full font-bold">20</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTabChange('applied');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'applied'
                ? 'bg-teal-100 text-teal-900 shadow-xs scale-102'
                : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/70'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Vận Dụng</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTabChange('achievements');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'achievements'
                ? 'bg-purple-100 text-purple-900 shadow-xs scale-102'
                : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50/70'
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Huy Hiệu</span>
            {unlockedBadgesCount > 0 && (
              <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.2 rounded-full">
                {unlockedBadgesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak pill if > 1 */}
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>x{streak} Combo!</span>
            </div>
          )}

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-amber-900 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="tabular-nums">{xp}</span>
            <span className="text-[11px] font-medium text-amber-700">XP</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              if (isMuted) {
                // If unmuting, play a small confirmation pop
                setTimeout(() => sound.playClick(), 50);
              }
            }}
            aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200/70"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
