import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { TheorySection } from './components/TheorySection';
import { PracticeSection } from './components/PracticeSection';
import { AppliedSection } from './components/AppliedSection';
import { AchievementsModal } from './components/AchievementsModal';
import { UserStats, QuestionLevel } from './types/game';
import { BADGES_DATA } from './data/badgesData';
import { sound } from './utils/sound';
import { Sparkles, Trophy, BookOpen, Heart } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'vuong_quoc_so_tu_stats_v1';

const INITIAL_STATS: UserStats = {
  xp: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  totalAnswered: 0,
  completedLevels: {
    easy: false,
    medium: false,
    hard: false,
  },
  unlockedBadges: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STATS;
  });

  // Track read theory topics for badge
  const [readTheoryTopics, setReadTheoryTopics] = useState<Set<string>>(new Set());
  // Track completed scenarios for badge
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  // Recent badge toast
  const [newBadgeToast, setNewBadgeToast] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Badge unlock helper
  const unlockBadge = (badgeId: string) => {
    setStats((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      const badge = BADGES_DATA.find((b) => b.id === badgeId);
      if (badge) {
        sound.playLevelUp();
        setNewBadgeToast(`${badge.icon} Mở khóa huy hiệu mới: ${badge.title}!`);
        setTimeout(() => setNewBadgeToast(null), 4000);
      }
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      };
    });
  };

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleAddXp = (amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      if (newXp >= 300) {
        setTimeout(() => unlockBadge('master_scholar'), 500);
      }
      return {
        ...prev,
        xp: newXp,
      };
    });
  };

  const handleUpdateStreak = (isCorrect: boolean) => {
    setStats((prev) => {
      if (isCorrect) {
        const nextStreak = prev.streak + 1;
        const maxStreak = Math.max(prev.maxStreak, nextStreak);
        if (nextStreak >= 5) {
          setTimeout(() => unlockBadge('streak_fire'), 300);
        }
        return {
          ...prev,
          streak: nextStreak,
          maxStreak,
        };
      } else {
        return {
          ...prev,
          streak: 0,
        };
      }
    });
  };

  const handleQuestionCompleted = (
    _questionId: number,
    isCorrect: boolean,
    _level: QuestionLevel
  ) => {
    unlockBadge('first_step');
    setStats((prev) => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
    }));
  };

  const handleLevelComplete = (level: QuestionLevel) => {
    setStats((prev) => ({
      ...prev,
      completedLevels: {
        ...prev.completedLevels,
        [level]: true,
      },
    }));

    if (level === 'easy') unlockBadge('level_1_clear');
    if (level === 'medium') unlockBadge('level_2_clear');
    if (level === 'hard') unlockBadge('level_3_clear');
  };

  const handleReadTopic = (topicId: string) => {
    const updated = new Set(readTheoryTopics);
    updated.add(topicId);
    setReadTheoryTopics(updated);
    if (updated.size >= 3) {
      unlockBadge('theory_master');
    }
  };

  const handleScenarioCompleted = (scenarioId: string) => {
    const updated = new Set(completedScenarios);
    updated.add(scenarioId);
    setCompletedScenarios(updated);
    if (updated.size >= 3) {
      unlockBadge('applied_scholar');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between selection:bg-pink-200 selection:text-pink-900">
      {/* Toast Notification for Badge Unlocked */}
      {newBadgeToast && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-amber-500 to-pink-500 text-white px-5 py-3 rounded-2xl shadow-lg border border-white/40 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-200 fill-current" />
          <span className="text-sm font-bold">{newBadgeToast}</span>
        </div>
      )}

      <div>
        {/* Top Navigation */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          xp={stats.xp}
          streak={stats.streak}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          unlockedBadgesCount={stats.unlockedBadges.length}
        />

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'theory' && (
            <TheorySection
              onStartPractice={() => setActiveTab('practice')}
              onReadTopic={handleReadTopic}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeSection
              onAddXp={handleAddXp}
              onUpdateStreak={handleUpdateStreak}
              onQuestionCompleted={handleQuestionCompleted}
              onLevelComplete={handleLevelComplete}
              onSwitchToTheory={() => setActiveTab('theory')}
              streak={stats.streak}
            />
          )}

          {activeTab === 'applied' && (
            <AppliedSection
              onAddXp={handleAddXp}
              onScenarioCompleted={handleScenarioCompleted}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsModal
              stats={stats}
              onClose={() => setActiveTab('practice')}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 py-6 mt-12 text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold">
            <span>Vương Quốc Số Từ</span>
            <span>·</span>
            <span>Ngữ văn 7 (Bộ sách Kết nối tri thức với cuộc sống)</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span>Dành cho học sinh & giáo viên</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>Học vui · Nhớ lâu · Đạt điểm cao</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
