import React, { useState } from 'react';
import { BADGES_DATA } from '../data/badgesData';
import { UserStats } from '../types/game';
import { ChibiMascot } from './ChibiMascot';
import { sound } from '../utils/sound';
import { Award, Star, Flame, Trophy, CheckCircle, Lock, Printer, Share2 } from 'lucide-react';

interface AchievementsModalProps {
  stats: UserStats;
  onClose: () => void;
  onResetStats?: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  stats,
  onClose,
  onResetStats,
}) => {
  const [studentName, setStudentName] = useState<string>('Học Sinh Chăm Ngoan');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const getRankTitle = (xp: number) => {
    if (xp >= 300) return 'Đại Hiệp Sĩ Số Từ 👑';
    if (xp >= 200) return 'Bậc Thầy Ngôn Ngữ 🌟';
    if (xp >= 100) return 'Chiến Binh Tinh Anh 🛡️';
    return 'Tập Sự Khởi Đầu 🌱';
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-8 animate-pop">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-purple-200 text-xs font-bold text-purple-800">
            <Trophy className="w-3.5 h-3.5" />
            <span>Bảng Vinh Danh Thành Tích</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
            Huy Hiệu & Giấy Chứng Nhận
          </h1>
          <p className="text-sm text-slate-600">
            Xem lại những cột mốc đáng nhớ và mở khóa giấy khen danh dự có chữ ký của bé mèo Mimi!
          </p>
        </div>

        <ChibiMascot
          mood={stats.xp >= 100 ? 'cheering' : 'happy'}
          size="md"
          speechText={`Tuyệt quá! Bạn đã tích lũy được ${stats.xp} XP và danh hiệu "${getRankTitle(stats.xp)}"!`}
        />
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Tổng Điểm XP</span>
          <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-amber-600">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span className="tabular-nums">{stats.xp}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Combo Cao Nhất</span>
          <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-orange-600">
            <Flame className="w-5 h-5 fill-orange-400 text-orange-500" />
            <span>x{stats.maxStreak}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Đã Trả Lời</span>
          <div className="text-2xl font-black text-emerald-600">
            {stats.correctCount} / {stats.totalAnswered}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Huy Hiệu Đạt Được</span>
          <div className="text-2xl font-black text-purple-600">
            {stats.unlockedBadges.length} / {BADGES_DATA.length}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-800 font-display">
              Bộ Sưu Tập Huy Hiệu Vinh Dự
            </h2>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {stats.unlockedBadges.length}/{BADGES_DATA.length} Đã Mở Khóa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = stats.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-300 shadow-xs scale-101'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                    isUnlocked ? 'bg-amber-100 border border-amber-300' : 'bg-slate-200'
                  }`}>
                    {badge.icon}
                  </div>
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Đạt
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Khóa
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-800 font-display">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate of Achievement Section */}
      <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Giấy Chứng Nhận Học Sinh Xuất Sắc
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Điền tên của bạn để tạo Giấy chứng nhận danh dự có thể in hoặc lưu lại kỷ niệm!
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nhập họ và tên học sinh..."
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Certificate Canvas / Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 border-4 border-double border-amber-400 rounded-3xl p-6 sm:p-10 shadow-md text-center space-y-6 max-w-2xl mx-auto">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-400 text-xl font-serif">❦</div>
          <div className="absolute top-2 right-2 text-amber-400 text-xl font-serif">❦</div>
          <div className="absolute bottom-2 left-2 text-amber-400 text-xl font-serif">❦</div>
          <div className="absolute bottom-2 right-2 text-amber-400 text-xl font-serif">❦</div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700">
              VƯƠNG QUỐC SỐ TỪ · NGỮ VĂN 7 (KẾT NỐI TRI THỨC)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              GIẤY CHỨNG NHẬN VINH DANH
            </h3>
            <p className="text-xs text-slate-600">Trao tặng danh hiệu xuất sắc cho:</p>
          </div>

          <div className="py-2">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-orange-600 underline decoration-amber-400 font-display">
              {studentName || 'Học Sinh Chăm Ngoan'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-2">
              Đã hoàn thành xuất sắc các thử thách phân biệt và vận dụng <strong>Số Từ</strong> môn Ngữ văn 7.
            </p>
          </div>

          <div className="flex items-center justify-around border-t border-b border-amber-300/80 py-3 text-xs sm:text-sm font-bold text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">ĐIỂM XP</span>
              <span className="text-amber-700 text-base">{stats.xp} XP</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DANH HIỆU</span>
              <span className="text-purple-700 text-base">{getRankTitle(stats.xp)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TỶ LỆ ĐÚNG</span>
              <span className="text-emerald-700 text-base">
                {stats.totalAnswered > 0 ? Math.round((stats.correctCount / stats.totalAnswered) * 100) : 100}%
              </span>
            </div>
          </div>

          {/* Signature and Seal */}
          <div className="flex items-end justify-between pt-4 px-4 text-left">
            <div>
              <span className="text-[11px] text-slate-500 block">Thời gian:</span>
              <span className="text-xs font-bold text-slate-700">Năm học 2024 - 2025</span>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-red-500 bg-red-50 flex items-center justify-center text-red-600 font-bold text-[10px] leading-tight rotate-12 shadow-xs">
                CHUẨN<br />KNTT 7
              </div>
              <span className="text-[11px] font-bold text-slate-600 block mt-1">Mimi & Bạn Học</span>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            In / Lưu Giấy Chứng Nhận
          </button>
        </div>
      </div>
    </div>
  );
};
