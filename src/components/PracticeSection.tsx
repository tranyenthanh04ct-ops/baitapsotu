import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question, QuestionLevel } from '../types/game';
import { QUESTIONS_DATA } from '../data/questionsData';
import { ChibiMascot, MascotMood } from './ChibiMascot';
import { sound } from '../utils/sound';
import { 
  Check, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  Zap,
  BookmarkCheck
} from 'lucide-react';

interface PracticeSectionProps {
  onAddXp: (amount: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
  onQuestionCompleted: (questionId: number, isCorrect: boolean, level: QuestionLevel) => void;
  onLevelComplete: (level: QuestionLevel) => void;
  onSwitchToTheory: () => void;
  streak: number;
}

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  onAddXp,
  onUpdateStreak,
  onQuestionCompleted,
  onLevelComplete,
  onSwitchToTheory,
  streak,
}) => {
  // Level filter: 'all', 'easy', 'medium', 'hard'
  const [selectedLevel, setSelectedLevel] = useState<QuestionLevel | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Answer state
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null);
  const [userTrueFalse, setUserTrueFalse] = useState<boolean | null>(null);
  const [userFillBlank, setUserFillBlank] = useState<string | null>(null);
  const [userClassify, setUserClassify] = useState<Record<string, string>>({}); // itemId -> categoryId
  const [userSelectedWordId, setUserSelectedWordId] = useState<string | null>(null);

  // Submission & Feedback
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [shakeWrong, setShakeWrong] = useState<boolean>(false);
  const [xpGainedThisTurn, setXpGainedThisTurn] = useState<number>(0);

  // Mascot dynamic reaction
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Hãy đọc kỹ câu hỏi và chọn đáp án chính xác nhất nhé!'
  );

  // Completed questions tracker
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isLevelFinished, setIsLevelFinished] = useState<boolean>(false);

  // Filter questions according to level
  const activeQuestions: Question[] = React.useMemo(() => {
    if (selectedLevel === 'all') return QUESTIONS_DATA;
    return QUESTIONS_DATA.filter((q) => q.level === selectedLevel);
  }, [selectedLevel]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  // Reset inputs when question changes
  useEffect(() => {
    setUserSelectedOption(null);
    setUserTrueFalse(null);
    setUserFillBlank(null);
    setUserClassify({});
    setUserSelectedWordId(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setShakeWrong(false);
    setXpGainedThisTurn(0);
    setMascotMood('idle');
    setMascotSpeech('Đọc kỹ câu hỏi và làm theo gợi ý của Mimi nhé!');
  }, [currentIndex, selectedLevel]);

  // Fire celebratory confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#EC4899', '#10B981', '#6366F1', '#38BDF8'],
      });
    } catch {
      // Ignore
    }
  };

  // Submission handler
  const handleCheckAnswer = () => {
    if (isSubmitted) return;
    let correct = false;

    if (currentQ.type === 'multiple_choice') {
      if (!userSelectedOption) return;
      correct = userSelectedOption === currentQ.correctAnswerId;
    } else if (currentQ.type === 'true_false') {
      if (userTrueFalse === null) return;
      correct = userTrueFalse === currentQ.isCorrect;
    } else if (currentQ.type === 'fill_blank') {
      if (!userFillBlank) return;
      correct = userFillBlank === currentQ.correctAnswer;
    } else if (currentQ.type === 'classify') {
      // Check if all items are correctly categorized
      const allDone = currentQ.items.every((it) => userClassify[it.id] !== undefined);
      if (!allDone) return;
      correct = currentQ.items.every((it) => userClassify[it.id] === it.correctCategoryId);
    } else if (currentQ.type === 'find_error') {
      if (!userSelectedWordId) return;
      const targetWord = currentQ.words.find((w) => w.id === userSelectedWordId);
      correct = !!targetWord && targetWord.isError;
    }

    setIsSubmitted(true);
    setIsCorrect(correct);
    onUpdateStreak(correct);
    onQuestionCompleted(currentQ.id, correct, currentQ.level);

    if (correct) {
      sound.playCorrect();
      triggerConfetti();
      const bonusStreak = streak >= 2 ? streak * 2 : 0;
      const totalXp = currentQ.points + bonusStreak;
      setXpGainedThisTurn(totalXp);
      onAddXp(totalXp);
      setCorrectCount((prev) => prev + 1);

      if (streak >= 3) {
        sound.playStreak();
      }

      setMascotMood('cheering');
      setMascotSpeech(
        streak >= 3
          ? `Đỉnh quá! Chuỗi ${streak + 1} câu đúng liên tiếp! +${totalXp} XP! 🎉`
          : `Chính xác 100%! Bạn hiểu bài rất tốt! +${totalXp} XP 🌟`
      );
    } else {
      sound.playWrong();
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
      setMascotMood('encouraging');
      setMascotSpeech('Không sao đâu bạn ơi! Hãy xem giải thích bên dưới để hiểu sâu hơn nhé 💖');
    }
  };

  // Next question handler
  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Level or set completed!
      setIsLevelFinished(true);
      sound.playLevelUp();
      triggerConfetti();
      if (selectedLevel !== 'all') {
        onLevelComplete(selectedLevel);
      }
    }
  };

  // Restart questions in this stage
  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsLevelFinished(false);
  };

  // Check if current form is valid to submit
  const canSubmit = () => {
    if (isSubmitted) return false;
    if (currentQ.type === 'multiple_choice') return userSelectedOption !== null;
    if (currentQ.type === 'true_false') return userTrueFalse !== null;
    if (currentQ.type === 'fill_blank') return userFillBlank !== null;
    if (currentQ.type === 'classify') {
      return currentQ.items.every((it) => userClassify[it.id] !== undefined);
    }
    if (currentQ.type === 'find_error') return userSelectedWordId !== null;
    return false;
  };

  const progressPercent = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);

  return (
    <div className="space-y-6 animate-pop">
      {/* Level Selection Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-orange-100 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="text-xs sm:text-sm font-bold text-slate-800">Cấp Độ Thử Thách:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: 'Tất Cả (20 Câu)', badge: 'Trọn Gói' },
            { id: 'easy', label: 'Cấp 1: Tập Sự', badge: '6 Câu Dễ' },
            { id: 'medium', label: 'Cấp 2: Tinh Anh', badge: '7 Câu Vừa' },
            { id: 'hard', label: 'Cấp 3: Chinh Phục', badge: '7 Câu Khó' },
          ].map((lvl) => {
            const isActive = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedLevel(lvl.id as QuestionLevel | 'all');
                  setCurrentIndex(0);
                  setIsLevelFinished(false);
                  setCorrectCount(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs scale-102'
                    : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* When current stage is finished */}
      {isLevelFinished ? (
        <div className="bg-white rounded-3xl p-8 border border-pink-100 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-4xl shadow-md">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
              Chúc Mừng Bạn Đã Hoàn Thành Thử Thách!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
              Bạn đã hoàn thành toàn bộ câu hỏi trong chặng này. Hãy xem bảng tổng kết thành tích bên dưới:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-semibold text-amber-700">Điểm Đúng</span>
              <p className="text-2xl font-extrabold text-amber-900 mt-1">
                {correctCount} / {activeQuestions.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-700">Độ Chính Xác</span>
              <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                {Math.round((correctCount / activeQuestions.length) * 100)}%
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-xs font-semibold text-purple-700">Trạng Thái</span>
              <p className="text-lg font-extrabold text-purple-900 mt-1">
                {correctCount >= activeQuestions.length * 0.7 ? 'Đạt Chuẩn ⭐' : 'Cố Lên Nhé 💪'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Làm Lại Lượt Này
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSwitchToTheory();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-sm transition-all cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              Ôn Lại Lý Thuyết
            </button>
          </div>
        </div>
      ) : (
        /* Question Card */
        <div className={`bg-white rounded-3xl border border-orange-100/90 p-5 sm:p-7 shadow-xs space-y-6 ${shakeWrong ? 'animate-shake' : ''}`}>
          
          {/* Progress & Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full text-xs font-extrabold">
                  Câu {currentIndex + 1} / {activeQuestions.length}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                  currentQ.level === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                  currentQ.level === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {currentQ.level === 'easy' ? 'Dễ' : currentQ.level === 'medium' ? 'Trung Bình' : 'Nâng Cao'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-amber-600">+{currentQ.points} XP</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-400 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-xl font-bold text-slate-800 font-display leading-relaxed">
              {currentQ.prompt}
            </h2>

            {currentQ.contextText && (
              <div className="p-3.5 bg-amber-50/70 border-l-4 border-amber-400 rounded-r-xl text-slate-700 italic text-sm">
                {currentQ.contextText}
              </div>
            )}
          </div>

          {/* DYNAMIC QUESTION RENDERING */}

          {/* 1. Multiple Choice */}
          {currentQ.type === 'multiple_choice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = userSelectedOption === opt.id;
                const isThisCorrect = isSubmitted && opt.id === currentQ.correctAnswerId;
                const isThisWrong = isSubmitted && isSelected && opt.id !== currentQ.correctAnswerId;

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => {
                      sound.playClick();
                      setUserSelectedOption(opt.id);
                    }}
                    className={`relative p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isThisCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : isThisWrong
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : isSelected
                        ? 'bg-amber-50 border-orange-400 text-slate-900 shadow-xs scale-101'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-orange-300 hover:bg-orange-50/40'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                      isThisCorrect
                        ? 'bg-emerald-500 text-white'
                        : isThisWrong
                        ? 'bg-rose-500 text-white'
                        : isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed pt-0.5">
                      {opt.text}
                    </span>
                    {isThisCorrect && (
                      <Check className="w-5 h-5 text-emerald-600 ml-auto shrink-0" />
                    )}
                    {isThisWrong && (
                      <X className="w-5 h-5 text-rose-600 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. True / False */}
          {currentQ.type === 'true_false' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 text-center font-bold text-base text-slate-800">
                "{currentQ.statement}"
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  disabled={isSubmitted}
                  onClick={() => {
                    sound.playClick();
                    setUserTrueFalse(true);
                  }}
                  className={`p-4 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitted && currentQ.isCorrect === true
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : isSubmitted && userTrueFalse === true && !currentQ.isCorrect
                      ? 'bg-rose-100 border-rose-400 text-rose-900'
                      : userTrueFalse === true
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 scale-102 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-emerald-50/50 text-slate-700'
                  }`}
                >
                  <Check className="w-5 h-5 text-emerald-600" />
                  ĐÚNG
                </button>

                <button
                  disabled={isSubmitted}
                  onClick={() => {
                    sound.playClick();
                    setUserTrueFalse(false);
                  }}
                  className={`p-4 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitted && currentQ.isCorrect === false
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : isSubmitted && userTrueFalse === false && currentQ.isCorrect
                      ? 'bg-rose-100 border-rose-400 text-rose-900'
                      : userTrueFalse === false
                      ? 'bg-rose-50 border-rose-500 text-rose-800 scale-102 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-rose-50/50 text-slate-700'
                  }`}
                >
                  <X className="w-5 h-5 text-rose-600" />
                  SAI
                </button>
              </div>
            </div>
          )}

          {/* 3. Fill in the Blank */}
          {currentQ.type === 'fill_blank' && (
            <div className="space-y-4 pt-2">
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 text-center text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                {currentQ.sentenceWithBlank.split('[...]').map((part, pIdx, arr) => (
                  <React.Fragment key={pIdx}>
                    <span>{part}</span>
                    {pIdx < arr.length - 1 && (
                      <span className={`inline-block mx-1.5 px-3 py-1 rounded-xl border-2 font-bold transition-all ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                            : 'bg-rose-100 border-rose-400 text-rose-900'
                          : userFillBlank
                          ? 'bg-orange-100 border-orange-400 text-orange-900'
                          : 'bg-white border-dashed border-slate-400 text-slate-400 min-w-20'
                      }`}>
                        {userFillBlank || '...'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chọn từ thích hợp điền vào chỗ trống:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
                  {currentQ.blankOptions.map((word) => {
                    const isSelected = userFillBlank === word;
                    return (
                      <button
                        key={word}
                        disabled={isSubmitted}
                        onClick={() => {
                          sound.playClick();
                          setUserFillBlank(word);
                        }}
                        className={`px-4 py-2.5 rounded-2xl font-bold text-sm border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500 border-orange-500 text-white shadow-xs scale-105'
                            : 'bg-white border-slate-200 hover:border-orange-300 text-slate-700 hover:bg-orange-50'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. Categorization / Classification */}
          {currentQ.type === 'classify' && (
            <div className="space-y-5 pt-2">
              {/* Unassigned items or current items */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Danh sách từ cần phân loại (Bấm vào từ rồi chọn giỏ tương ứng):
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentQ.items.map((it) => {
                    const assignedCategoryId = userClassify[it.id];
                    const assignedCat = currentQ.categories.find((c) => c.id === assignedCategoryId);

                    return (
                      <div
                        key={it.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                          assignedCategoryId
                            ? 'bg-white border-orange-300 text-slate-800'
                            : 'bg-amber-100/70 border-amber-300 text-amber-900 animate-pulse'
                        }`}
                      >
                        <span>{it.word}</span>
                        {assignedCat && (
                          <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-md">
                            → {assignedCat.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Baskets */}
              <div className={`grid grid-cols-1 md:grid-cols-${currentQ.categories.length} gap-4`}>
                {currentQ.categories.map((cat) => {
                  const itemsInThisCat = currentQ.items.filter((it) => userClassify[it.id] === cat.id);

                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm text-slate-800 font-display">
                            {cat.label}
                          </h4>
                          <span className="text-xs bg-white px-2 py-0.5 rounded-full font-bold text-orange-700 border border-orange-200">
                            {itemsInThisCat.length}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[11px] text-slate-500 mb-2">{cat.description}</p>
                        )}

                        <div className="flex flex-wrap gap-1.5 min-h-12 p-2 bg-white/70 rounded-xl">
                          {itemsInThisCat.map((it) => (
                            <span
                              key={it.id}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-900 border border-orange-200 flex items-center gap-1"
                            >
                              {it.word}
                              {!isSubmitted && (
                                <button
                                  onClick={() => {
                                    sound.playClick();
                                    const next = { ...userClassify };
                                    delete next[it.id];
                                    setUserClassify(next);
                                  }}
                                  className="text-orange-500 hover:text-orange-800 font-bold ml-1"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Drop choices into this category */}
                      {!isSubmitted && (
                        <div className="pt-2 border-t border-orange-100">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">Thêm vào nhóm này:</span>
                          <div className="flex flex-wrap gap-1">
                            {currentQ.items
                              .filter((it) => userClassify[it.id] !== cat.id)
                              .map((it) => (
                                <button
                                  key={it.id}
                                  onClick={() => {
                                    sound.playClick();
                                    setUserClassify((prev) => ({
                                      ...prev,
                                      [it.id]: cat.id,
                                    }));
                                  }}
                                  className="px-2 py-1 bg-white hover:bg-orange-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                                >
                                  + {it.word}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Find Error (Spot the wrong word) */}
          {currentQ.type === 'find_error' && (
            <div className="space-y-4 pt-2">
              <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-200 text-center">
                <span className="text-xs text-slate-500 block mb-2 font-medium">
                  Bấm trực tiếp vào từ mà bạn cho rằng dùng sai quy tắc:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {currentQ.words.map((w) => {
                    const isSelected = userSelectedWordId === w.id;
                    const isThisErrorWord = isSubmitted && w.isError;
                    const isWrongSelection = isSubmitted && isSelected && !w.isError;

                    return (
                      <button
                        key={w.id}
                        disabled={isSubmitted}
                        onClick={() => {
                          sound.playClick();
                          setUserSelectedWordId(w.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
                          isThisErrorWord
                            ? 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-300'
                            : isWrongSelection
                            ? 'bg-slate-200 border-slate-400 text-slate-600 line-through'
                            : isSelected
                            ? 'bg-orange-500 border-orange-500 text-white shadow-xs scale-105'
                            : 'bg-white border-slate-200 hover:border-orange-300 text-slate-800'
                        }`}
                      >
                        {w.word}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Feedback & Detailed Explanation */}
          {isSubmitted && (
            <div
              className={`p-5 rounded-2xl border-2 transition-all animate-pop ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base">
                      {isCorrect ? 'Tuyệt Vời! Bạn Đã Trả Lời Đúng' : 'Rất Tiếc, Chưa Chính Xác!'}
                    </span>
                    {isCorrect && (
                      <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{xpGainedThisTurn} XP
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer (Check answer or Next question) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            {/* Mascot advice */}
            <div className="w-full sm:w-auto">
              <ChibiMascot
                mood={mascotMood}
                size="sm"
                speechText={mascotSpeech}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {!isSubmitted ? (
                <button
                  disabled={!canSubmit()}
                  onClick={handleCheckAnswer}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                    canSubmit()
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Kiểm Tra Đáp Án
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < activeQuestions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
