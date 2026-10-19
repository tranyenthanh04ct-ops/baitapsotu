import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { APPLIED_SCENARIOS } from '../data/appliedScenarios';
import { ChibiMascot, MascotMood } from './ChibiMascot';
import { sound } from '../utils/sound';
import { Check, X, Sparkles, CheckCircle2, RotateCcw, Lightbulb, Compass } from 'lucide-react';

interface AppliedSectionProps {
  onAddXp: (amount: number) => void;
  onScenarioCompleted: (scenarioId: string) => void;
}

export const AppliedSection: React.FC<AppliedSectionProps> = ({
  onAddXp,
  onScenarioCompleted,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(APPLIED_SCENARIOS[0].id);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({}); // paragraphId -> option
  const [checkedParagraphs, setCheckedParagraphs] = useState<Record<string, boolean>>({}); // paragraphId -> isSubmitted

  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Hãy chọn số từ thích hợp nhất với văn cảnh đời sống và văn học nhé!'
  );

  const scenario = APPLIED_SCENARIOS.find((s) => s.id === activeScenarioId) || APPLIED_SCENARIOS[0];

  const handleSelectOption = (paragraphId: string, option: string) => {
    if (checkedParagraphs[paragraphId]) return;
    sound.playClick();
    setUserChoices((prev) => ({ ...prev, [paragraphId]: option }));
  };

  const handleCheckParagraph = (paragraphId: string, correctAnswer: string) => {
    const choice = userChoices[paragraphId];
    if (!choice) return;

    const isCorrect = choice === correctAnswer;
    setCheckedParagraphs((prev) => ({ ...prev, [paragraphId]: true }));

    if (isCorrect) {
      sound.playCorrect();
      onAddXp(20);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      setMascotMood('happy');
      setMascotSpeech('Xuất sắc! Lựa chọn của bạn rất tự nhiên và chuẩn xác về ngữ nghĩa! +20 XP ✨');
    } else {
      sound.playWrong();
      setMascotMood('encouraging');
      setMascotSpeech('Xem lại lời giải thích ở khung xanh nhé, số từ trong ngữ cảnh này có quy tắc đặc biệt đấy!');
    }

    // Check if whole scenario is now completed
    const allChecked = scenario.paragraphs.every(
      (p) => p.id === paragraphId || checkedParagraphs[p.id]
    );
    if (allChecked) {
      onScenarioCompleted(scenario.id);
    }
  };

  const handleResetScenario = () => {
    sound.playClick();
    setUserChoices({});
    setCheckedParagraphs({});
    setMascotMood('idle');
    setMascotSpeech('Hãy thử lại tình huống này để ghi nhớ bài học lâu hơn nhé!');
  };

  return (
    <div className="space-y-6 animate-pop">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-teal-200/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Thực Hành Đời Sống & Văn Học</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
            Vận Dụng Số Từ Trong Thực Tế
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Học số từ không chỉ để làm bài kiểm tra, mà còn giúp em diễn đạt câu từ tinh tế, mua sắm chính xác và cảm thụ vẻ đẹp của văn chương Việt Nam!
          </p>
        </div>

        <ChibiMascot mood={mascotMood} size="md" speechText={mascotSpeech} />
      </div>

      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {APPLIED_SCENARIOS.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                sound.playClick();
                setActiveScenarioId(sc.id);
                setUserChoices({});
                setCheckedParagraphs({});
                setMascotMood('idle');
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md scale-102 ring-2 ring-teal-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-teal-50'
              }`}
            >
              <span className="text-lg">{sc.icon}</span>
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Card */}
      <div className="bg-white rounded-3xl border border-teal-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{scenario.icon}</span>
              <h2 className="text-xl font-bold text-slate-800 font-display">
                {scenario.title}
              </h2>
            </div>
            <button
              onClick={handleResetScenario}
              className="text-xs font-bold text-slate-500 hover:text-teal-700 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại
            </button>
          </div>
          <p className="text-xs sm:text-sm text-teal-800 font-semibold mt-1">
            {scenario.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {scenario.description}
          </p>
        </div>

        {/* Paragraph Items */}
        <div className="space-y-6">
          {scenario.paragraphs.map((para, idx) => {
            const isChecked = checkedParagraphs[para.id];
            const currentChoice = userChoices[para.id];
            const isCorrect = currentChoice === para.correctAnswer;

            return (
              <div
                key={para.id}
                className={`p-5 rounded-2xl border-2 transition-all space-y-4 ${
                  isChecked
                    ? isCorrect
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-rose-50/60 border-rose-300'
                    : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Đoạn văn {idx + 1}
                  </span>
                </div>

                {/* Sentence with blank slot */}
                <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  <span>{para.textBefore} </span>
                  <span
                    className={`inline-block mx-1 px-3 py-1 rounded-xl border-2 font-bold transition-all ${
                      isChecked
                        ? isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                          : 'bg-rose-100 border-rose-400 text-rose-900'
                        : currentChoice
                        ? 'bg-teal-100 border-teal-400 text-teal-900'
                        : 'bg-white border-dashed border-teal-400 text-teal-600'
                    }`}
                  >
                    {currentChoice || para.targetSlotPlaceholder}
                  </span>
                  <span> {para.textAfter}</span>
                </div>

                {/* Options selector */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-semibold text-slate-500">Chọn từ điền:</span>
                  {para.options.map((opt) => {
                    const isSelected = currentChoice === opt;
                    return (
                      <button
                        key={opt}
                        disabled={isChecked}
                        onClick={() => handleSelectOption(para.id, opt)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs scale-102'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}

                  {!isChecked && (
                    <button
                      disabled={!currentChoice}
                      onClick={() => handleCheckParagraph(para.id, para.correctAnswer)}
                      className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                        currentChoice
                          ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Kiểm Tra
                    </button>
                  )}
                </div>

                {/* Feedback with full explanation */}
                {isChecked && (
                  <div
                    className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-300'
                        : 'bg-rose-100/70 text-rose-950 border border-rose-300'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">
                        {isCorrect
                          ? 'Chính xác! Lựa chọn hoàn hảo.'
                          : `Đáp án chuẩn phải là: "${para.correctAnswer}"`}
                      </p>
                      <p className="mt-1 leading-relaxed opacity-90">{para.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
