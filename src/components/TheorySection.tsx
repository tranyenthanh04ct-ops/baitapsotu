import React, { useState } from 'react';
import { THEORY_DATA } from '../data/theoryData';
import { ChibiMascot } from './ChibiMascot';
import { sound } from '../utils/sound';
import { ArrowRight, Lightbulb, CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';

interface TheorySectionProps {
  onStartPractice: () => void;
  onReadTopic?: (topicId: string) => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({ onStartPractice, onReadTopic }) => {
  const [activeTabId, setActiveTabId] = useState<string>('so-luong');
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null);

  // Interactive Position Simulator State
  const [simMode, setSimMode] = useState<'so_luong' | 'thu_tu'>('so_luong');

  const currentTopic = THEORY_DATA.find((t) => t.id === activeTabId) || THEORY_DATA[0];

  const handleTabChange = (id: string) => {
    sound.playClick();
    setActiveTabId(id);
    setSelectedExampleIndex(null);
    if (onReadTopic) onReadTopic(id);
  };

  return (
    <div className="space-y-8 animate-pop">
      {/* Header Banner with Mascot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-pink-100 p-6 sm:p-8 border border-orange-200/60 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-orange-200 text-xs font-bold text-orange-700">
              <span>🌟 Kiến Thức Trọng Tâm</span>
              <span>·</span>
              <span>Ngữ Văn 7 (KNTT)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
              Bí Kíp Chinh Phục <span className="text-orange-600 underline decoration-wavy decoration-orange-400">Số Từ</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Chào bạn nhỏ! Mình là <strong>Mimi</strong>. Hãy cùng khám phá thế giới Số từ đầy kỳ diệu để làm chủ bài thi và sử dụng tiếng Việt thật chuẩn xác nhé!
            </p>
          </div>

          <ChibiMascot
            mood="happy"
            size="md"
            speechText="Bấm vào từng thẻ lý thuyết và thử nghiệm công thức vị trí ở bên dưới nhé!"
          />
        </div>
      </div>

      {/* Interactive Simulator Card: Thí nghiệm vị trí Số từ */}
      <div className="bg-white rounded-3xl border border-pink-100 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🧪</span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-display">
            Máy Thí Nghiệm: Quy Tắc Vị Trí Vàng Của Số Từ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              sound.playClick();
              setSimMode('so_luong');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              simMode === 'so_luong'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200 scale-101'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Vị trí 1: Đứng TRƯỚC danh từ
              </span>
              <span className="text-base">🍎</span>
            </div>
            <div className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600 underline decoration-2">[Ba]</span>
              <span>+</span>
              <span className="text-slate-700">[bạn học sinh]</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              👉 Biểu thị <strong>SỐ LƯỢNG</strong> (chỉ số lượng đếm được gồm có 3 người bạn).
            </p>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSimMode('thu_tu');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              simMode === 'thu_tu'
                ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-200 scale-101'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                Vị trí 2: Đứng SAU danh từ
              </span>
              <span className="text-base">🥇</span>
            </div>
            <div className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span className="text-slate-700">[Bạn học sinh]</span>
              <span>+</span>
              <span className="text-sky-600 underline decoration-2">[thứ ba]</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              👉 Biểu thị <strong>THỨ TỰ</strong> (chỉ đúng 1 bạn xếp ở vị trí thứ ba trong hàng ngũ).
            </p>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {THEORY_DATA.map((topic) => {
          const isActive = topic.id === activeTabId;
          return (
            <button
              key={topic.id}
              onClick={() => handleTabChange(topic.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md scale-102 ring-2 ring-pink-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50/60'
              }`}
            >
              <span className="text-lg">{topic.icon}</span>
              <span>{topic.title}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {topic.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Topic Detailed View */}
      <div className="bg-white rounded-3xl border border-orange-100/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title & Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentTopic.icon}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">
                {currentTopic.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              {currentTopic.summary}
            </p>
          </div>
        </div>

        {/* Details and breakdown */}
        <div className="grid grid-cols-1 gap-6">
          {currentTopic.details.map((detail, idx) => (
            <div key={idx} className="bg-amber-50/40 rounded-2xl p-5 border border-amber-200/50 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 font-display flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                {detail.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {detail.description}
              </p>

              {/* Interactive Examples Carousel / Cards */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ví dụ minh họa thực tế (Bấm vào xem phân tích ngữ pháp):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {detail.examples.map((eg, eIdx) => {
                    const isSelected = selectedExampleIndex === eIdx;
                    return (
                      <div
                        key={eIdx}
                        onClick={() => {
                          sound.playClick();
                          setSelectedExampleIndex(isSelected ? null : eIdx);
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-orange-400 shadow-md ring-2 ring-orange-200 scale-102'
                            : 'bg-white/80 border-amber-100 hover:bg-white hover:border-amber-300'
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-800 mb-2">
                          "{eg.sentence}"
                        </p>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                            {eg.highlight}
                          </span>
                          <span className="text-slate-500 font-medium">{eg.type}</span>
                        </div>
                        <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 leading-relaxed">
                          💡 <strong>Phân tích:</strong> {eg.analysis}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips / Ghi nhớ vàng */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200/60 space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm sm:text-base">
            <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Mẹo Ghi Nhớ Nhanh Từ Mimi:</span>
          </div>
          <ul className="space-y-2">
            {currentTopic.proTips.map((tip, tIdx) => (
              <li key={tIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="text-purple-500 font-bold">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA to Practice */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Đã nắm chắc lý thuyết? Hãy thử sức ngay với 20 câu hỏi thú vị!</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onStartPractice();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <span>Vào Luyện Tập Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
