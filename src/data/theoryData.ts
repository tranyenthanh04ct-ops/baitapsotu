export interface TheorySectionData {
  id: string;
  title: string;
  tag: string;
  color: string;
  icon: string;
  summary: string;
  details: {
    title: string;
    description: string;
    examples: {
      sentence: string;
      highlight: string;
      type: string;
      analysis: string;
    }[];
  }[];
  proTips: string[];
}

export const THEORY_DATA: TheorySectionData[] = [
  {
    id: 'so-luong',
    title: 'Số từ chỉ số lượng',
    tag: 'Đứng TRƯỚC danh từ',
    color: 'emerald',
    icon: '🔢',
    summary: 'Biểu thị số lượng cụ thể hoặc ước chừng của sự vật. Luôn đứng TRƯỚC danh từ trong cụm danh từ.',
    details: [
      {
        title: '1. Số từ chỉ số lượng XÁC ĐỊNH',
        description: 'Chỉ số lượng chính xác, cụ thể, có thể đếm được rõ ràng bằng các con số tự nhiên.',
        examples: [
          {
            sentence: 'Hai anh em Mên và Mon đi cứu bầy chim chìa vôi.',
            highlight: 'Hai',
            type: 'Số từ xác định',
            analysis: 'Đứng trước danh từ "anh em", chỉ chính xác số lượng là 2 người.',
          },
          {
            sentence: 'Năm mươi người con theo mẹ lên núi, năm mươi người con theo cha xuống biển.',
            highlight: 'Năm mươi',
            type: 'Số từ xác định',
            analysis: 'Đứng trước danh từ "người con", xác định rõ số lượng là 50.',
          },
          {
            sentence: 'Lớp 7A có ba mươi lăm học sinh chăm ngoan.',
            highlight: 'ba mươi lăm',
            type: 'Số từ xác định',
            analysis: 'Đứng trước danh từ "học sinh", chỉ chính xác số lượng 35.',
          },
        ],
      },
      {
        title: '2. Số từ chỉ số lượng ƯỚC CHỪNG',
        description: 'Chỉ số lượng phỏng đoán, không thể đo đếm chính xác tuyệt đối. Thường dùng các từ: vài, dăm, mươi, dăm bảy, vài ba, mấy,...',
        examples: [
          {
            sentence: 'Dăm ba chú chim én lượn quanh vòm trời xanh ngát.',
            highlight: 'Dăm ba',
            type: 'Số từ ước chừng',
            analysis: 'Đứng trước danh từ "chú chim", phỏng đoán số lượng khoảng 2-3 con, không đo đếm cứng nhắc.',
          },
          {
            sentence: 'Mẹ đi chợ mua vài quả cam tươi về cho cả nhà.',
            highlight: 'vài',
            type: 'Số từ ước chừng',
            analysis: 'Đứng trước danh từ "quả cam", chỉ số lượng ít nhưng không xác định cụ thể là bao nhiêu quả.',
          },
          {
            sentence: 'Đã dăm năm rồi, bác An mới trở lại thăm quê hương.',
            highlight: 'dăm',
            type: 'Số từ ước chừng',
            analysis: 'Đứng trước danh từ chỉ thời gian "năm", mang nghĩa khoảng 5 năm (ước chừng).',
          },
        ],
      },
    ],
    proTips: [
      'Công thức nhớ nhanh: [Số từ chỉ số lượng] + [Danh từ] (Ví dụ: Ba chú mèo, vài quyển vở).',
      'Các từ ước chừng hay gặp: vài, dăm, mươi, vài ba, dăm bảy, mươi lăm, mấy.',
    ],
  },
  {
    id: 'thu-tu',
    title: 'Số từ chỉ thứ tự',
    tag: 'Đứng SAU danh từ',
    color: 'sky',
    icon: '🥇',
    summary: 'Biểu thị thứ tự, vị trí, cấp bậc hoặc lần lượt xuất hiện của sự vật. Luôn đứng SAU danh từ.',
    details: [
      {
        title: 'Đặc điểm và Vị trí của Số từ chỉ thứ tự',
        description: 'Khi đứng sau danh từ, số từ không còn chỉ số lượng đếm được nữa, mà biểu thị thứ bậc xếp hạng hoặc lượt thời gian.',
        examples: [
          {
            sentence: 'Nam là học sinh đứng thứ nhất trong kỳ thi học sinh giỏi.',
            highlight: 'nhất',
            type: 'Số từ chỉ thứ tự',
            analysis: 'Đứng sau danh từ/từ chỉ vị trí "thứ", xác định xếp hạng cao nhất (hạng 1).',
          },
          {
            sentence: 'Chúng em đang học bài số hai trong sách Ngữ văn 7.',
            highlight: 'hai',
            type: 'Số từ chỉ thứ tự',
            analysis: 'Đứng sau danh từ "bài", chỉ thứ tự bài học (không phải có 2 bài).',
          },
          {
            sentence: 'Canh bốn dồn dập, tiếng gà gáy sáng vang vọng khắp thôn.',
            highlight: 'bốn',
            type: 'Số từ chỉ thứ tự',
            analysis: 'Đứng sau danh từ "canh" (đơn vị chia thời gian ban đêm thời xưa), chỉ khoảng canh giờ thứ 4.',
          },
          {
            sentence: 'Gia đình bạn Mai sống ở tầng năm của khu chung cư.',
            highlight: 'năm',
            type: 'Số từ chỉ thứ tự',
            analysis: 'Đứng sau danh từ "tầng", chỉ vị trí tầng thứ 5 trong tòa nhà.',
          },
        ],
      },
    ],
    proTips: [
      'So sánh thần thánh: "Hai học sinh" (chỉ số lượng 2 người) >< "Học sinh thứ hai" (chỉ 1 người đứng vị trí thứ 2).',
      'Các từ thường gặp: thứ nhất, thứ nhì/thứ hai, hạng ba, giải tư, mồng một, canh năm,...',
    ],
  },
  {
    id: 'phan-biet',
    title: 'Phân biệt & Tránh Bẫy',
    tag: 'Kiến thức cốt lõi',
    color: 'purple',
    icon: '🎯',
    summary: 'Tuyệt chiêu nhận diện để không bị nhầm lẫn giữa Số từ với Lượng từ hoặc Danh từ chỉ đơn vị.',
    details: [
      {
        title: '1. Phân biệt Số từ và Lượng từ',
        description: 'Lượng từ là những từ chỉ lượng ít hay nhiều một cách khái quát (toàn thể hoặc tập hợp), KHÔNG chỉ số đếm.',
        examples: [
          {
            sentence: 'Mỗi học sinh đều có một ước mơ riêng.',
            highlight: 'Mỗi (Lượng từ) vs một (Số từ)',
            type: 'So sánh',
            analysis: '"Mỗi" là lượng từ chỉ sự phân phối từng cá thể. "Một" mới là số từ chỉ số lượng xác định.',
          },
          {
            sentence: 'Tất cả các bạn đều thích học môn Ngữ văn.',
            highlight: 'Tất cả, các (Lượng từ)',
            type: 'Lượng từ',
            analysis: '"Tất cả" chỉ lượng toàn thể, "các" chỉ lượng tập hợp số nhiều; đều KHÔNG phải là số từ.',
          },
        ],
      },
      {
        title: '2. Phân biệt Số từ và Danh từ chỉ đơn vị',
        description: 'Những từ như "đôi, cặp, tá, chục, thúng, tạ, yến" là DANH TỪ chỉ đơn vị, bởi vì chúng có thể đi kèm một số từ ở đằng trước.',
        examples: [
          {
            sentence: 'Mẹ mua hai chục quả trứng gà tươi.',
            highlight: 'hai (Số từ) - chục (Danh từ chỉ đơn vị)',
            type: 'So sánh',
            analysis: '"hai" là số từ bổ nghĩa cho "chục". "chục" là danh từ đơn vị (1 chục = 10 quả).',
          },
          {
            sentence: 'Bé có một đôi giày màu hồng xinh xắn.',
            highlight: 'một (Số từ) - đôi (Danh từ đơn vị)',
            type: 'So sánh',
            analysis: '"một" là số từ chỉ số lượng. "đôi" là danh từ chỉ đơn vị gồm 2 vật đi liền nhau.',
          },
        ],
      },
    ],
    proTips: [
      'Bí kíp thử nghiệm: Hãy thử thêm số từ "một, hai" vào trước từ đó. Nếu thêm được (VD: hai đôi, một tá, ba chục) thì từ đó là DANH TỪ chỉ đơn vị, không phải số từ!',
      'Ghi nhớ: "những, các, mọi, từng, mỗi, tất cả" -> LƯỢNG TỪ, không phải số từ.',
    ],
  },
];
