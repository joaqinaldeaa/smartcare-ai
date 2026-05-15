/**
 * SmartCareAI v3 — Scoring Engine (per spec doc)
 * 5 domains, percentage scoring, combined ADHD+ASD, 7-level classification
 */

import type { ChildProfile } from '@/contexts/AssessmentContext';

// ─── Domain config ─────────────────────────────────────────────────────────────

export interface DomainConfig {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  name: Record<string, string>;
  questionIds: number[]; // 1-based
  maxScore: number;
}

export const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    id: 'A',
    name: {
      id: 'Perhatian & Organisasi',
      en: 'Attention & Organization',
      ms: 'Perhatian & Organisasi',
      th: 'ความสนใจและการจัดระเบียบ',
      vi: 'Chú ý & Tổ chức',
      fil: 'Pansin at Organisasyon',
    },
    questionIds: [1, 2, 3, 4, 5, 6],
    maxScore: 18,
  },
  {
    id: 'B',
    name: {
      id: 'Hiperaktiviti & Impulsiviti',
      en: 'Hyperactivity & Impulsivity',
      ms: 'Hiperaktiviti & Impulsiviti',
      th: 'ภาวะ hyperactivity และ impulsivity',
      vi: 'Tăng động & Impulsivity',
      fil: 'Hiperaktibidad at Impulsibidad',
    },
    questionIds: [7, 8, 9, 10, 11, 12, 13],
    maxScore: 21,
  },
  {
    id: 'C',
    name: {
      id: 'Komunikasi Sosial',
      en: 'Social Communication',
      ms: 'Komunikasi Sosial',
      th: 'การสื่อสารทางสังคม',
      vi: 'Giao tiếp xã hội',
      fil: 'Panlipunang Komunikasyon',
    },
    questionIds: [14, 15, 16],
    maxScore: 9,
  },
  {
    id: 'D',
    name: {
      id: 'Sensori & Perilaku Berulang',
      en: 'Sensory & Repetitive Behavior',
      ms: 'Sensori & Perilaku Berulang',
      th: 'ประสาทสัมผัสและพฤติกรรมซ้ำ',
      vi: 'Giác quan & Hành vi lặp lại',
      fil: 'Sensory at Paulit-ulit na Pag-uugali',
    },
    questionIds: [17, 18, 19],
    maxScore: 9,
  },
  {
    id: 'E',
    name: {
      id: 'Perkembangan Umum',
      en: 'General Development',
      ms: 'Perkembangan Umum',
      th: 'การพัฒนาทั่วไป',
      vi: 'Phát triển chung',
      fil: 'Pangkalahatang Pag-unlad',
    },
    questionIds: [20],
    maxScore: 3,
  },
];

// ─── Output types ─────────────────────────────────────────────────────────────

export type DomainLevel = 'low' | 'moderate' | 'high';

export interface DomainScore {
  domain: 'A' | 'B' | 'C' | 'D' | 'E';
  domainName: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: DomainLevel;
  questionIndices: number[];
}

export type OverallClassification =
  | 'low_overall'
  | 'moderate_adhd'
  | 'moderate_asd'
  | 'mixed_moderate'
  | 'high_adhd'
  | 'high_asd'
  | 'mixed_high'
  | 'urgent_concern';

export interface VideoAnalysisResult {
  adhdScore: number;       // 0-100
  asdScore: number;        // 0-100
  adhdObservations: string[];
  asdObservations: string[];
}

export interface AIObservation {
  category: string;
  icon: string;
  observation: string;
}

export interface ScoreResult {
  domainScores: DomainScore[];
  adhdInattentionPct: number;
  adhdHyperactivityPct: number;
  asdSocialPct: number;
  asdSensoryPct: number;
  generalDevPct: number;
  overallAdhdPct: number;
  overallAsdPct: number;
  finalAdhdPct: number;
  finalAsdPct: number;
  overallClassification: OverallClassification;
  recommendationKey: string;
  recommendationText: string;
  specialistsText: string;
  aiObservations: AIObservation[];
  devScore: number;
  childProfile: ChildProfile | null;
  videoAnalysis: VideoAnalysisResult | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pct(score: number, max: number): number {
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

function levelFromPct(p: number): DomainLevel {
  if (p >= 70) return 'high';
  if (p >= 40) return 'moderate';
  return 'low';
}

// ─── Recommendations ──────────────────────────────────────────────────────────

const REC: Record<OverallClassification, Record<string, string>> = {
  low_overall: {
    id: 'Anak berkembang dengan baik. Teruskan pemantauan berkala dan rangsangan perkembangan di rumah.',
    en: 'Child is developing well. Continue routine monitoring and provide stimulating home activities.',
    ms: 'Kanak-kanak berkembang dengan baik. Teruskan pemantauan berkala.',
    th: 'เด็กพัฒนาได้ดี ควรติดตามตามปกติและให้กิจกรรมกระตุ้นพัฒนาการที่บ้าน',
    vi: 'Trẻ phát triển tốt. Tiếp tục theo dõi định kỳ.',
    fil: 'Ang bata ay umuunlad nang maayos. Ipagpatuloy ang regular na pagmamatyag.',
  },
  moderate_adhd: {
    id: 'Terdeteksi corak attention dan hyperactivity. Berkonsultasilah dengan pediatrician dan pertimbangkan penilaian ADHD lanjut.',
    en: 'Attention and hyperactivity patterns detected. Please consult a pediatrician and consider further ADHD assessment.',
    ms: 'Corak perhatian dan hiperaktiviti dikesan. Sila berjumpa pediatrician.',
    th: 'พบรูปแบบด้านความสนใจและ hyperactivity กรุณาปรึกษาแพทย์เด็ก',
    vi: 'Phát hiện các mẫu về chú ý và tăng động. Vui lòng tham khảo ý kiến bác sĩ nhi.',
    fil: 'Nakita ang mga pattern ng pansin at hyperaktibidad. Mangyaring kumonsulta sa pediatrician.',
  },
  moderate_asd: {
    id: 'Terdeteksi corak sosial dan/atau sensori. Berkonsultasilah dengan developmental pediatrician atau psikolog.',
    en: 'Social and/or sensory patterns detected. Please consult a developmental pediatrician or psychologist.',
    ms: 'Corak sosial dan/atau deria dikesan. Sila berjumpa pediatrician perkembangan atau psikolog.',
    th: 'พบรูปแบบทางสังคมและ/หรือประสาทสัมผัส กรุณาปรึกษาแพทย์เด็กเฉพาะทาง',
    vi: 'Phát hiện các mẫu về xã hội và/hoặc giác quan. Vui lòng tham khảo bác sĩ nhi khoa phát triển.',
    fil: 'Nakita ang mga panlipunan at/o sensory na pattern. Mangyaring kumonsulta sa developmental pediatrician.',
  },
  mixed_moderate: {
    id: 'Terdeteksi corak ADHD dan ASD. Penilaian komprehensif oleh profesional disyorkan.',
    en: 'Both ADHD and ASD patterns identified. Comprehensive professional assessment is recommended.',
    ms: 'Kedua-dua corak ADHD dan ASD dikenal pasti. Penilaian komprehensif disyorkan.',
    th: 'พบทั้งรูปแบบ ADHD และ ASD ควรได้รับการประเมินอย่างครอบคลามโดยผู้เชี่ยวชาญ',
    vi: 'Cả hai mẫu ADHD và ASD đều được xác định. Đánh giá toàn diện được khuyến nghị.',
    fil: 'Nakita ang parehong ADHD at ASD pattern. Inirerekomenda ang komprehensibong pagtatasa.',
  },
  high_adhd: {
    id: 'Skor tinggi dalam domain ADHD dikesan. Penilaian segera oleh spesialis perkembangan anak disyorkan.',
    en: 'High ADHD domain scores detected. Prompt assessment by a child development specialist is recommended.',
    ms: 'Skor tinggi dalam domain ADHD dikesan. Penilaian segera disyorkan.',
    th: 'พบคะแนนสูงใน domain ADHD ควรได้รับการประเมินโดยเร็ว',
    vi: 'Phát hiện điểm cao trong domain ADHD. Đánh giá ngay lập tức được khuyến nghị.',
    fil: 'Nakita ang mataas na score sa ADHD domain. Inirerekomenda ang agarang pagtatasa.',
  },
  high_asd: {
    id: 'Skor tinggi dalam domain ASD dikesan. Penilaian segera oleh spesialis perkembangan anak disyorkan.',
    en: 'High ASD domain scores detected. Prompt assessment by a child development specialist is recommended.',
    ms: 'Skor tinggi dalam domain ASD dikesan. Penilaian segera disyorkan.',
    th: 'พบคะแนนสูงใน domain ASD ควรได้รับการประเมินโดยเร็ว',
    vi: 'Phát hiện điểm cao trong domain ASD. Đánh giá ngay lập tức được khuyến nghị.',
    fil: 'Nakita ang mataas na score sa ASD domain. Inirerekomenda ang agarang pagtatasa.',
  },
  mixed_high: {
    id: 'Skor tinggi dalam domain ADHD dan ASD dikesan. Penilaian segera dan menyeluruh disyorkan.',
    en: 'High scores in both ADHD and ASD domains detected. Prompt and comprehensive assessment is recommended.',
    ms: 'Skor tinggi dalam domain ADHD dan ASD dikesan. Penilaian segera disyorkan.',
    th: 'พบคะแนนสูงใน domain ADHD dan ASD ควรได้รับการประเมินโดยเร็ว',
    vi: 'Phát hiện điểm cao trong cả domain ADHD và ASD. Đánh giá ngay lập tức được khuyến nghị.',
    fil: 'Nakita ang mataas na score sa parehong ADHD at ASD domain. Inirerekomenda ang agarang pagtatasa.',
  },
  urgent_concern: {
    id: 'Terdapat petunjuk perkembangan yang serius. Penilaian segera oleh spesialis perkembangan anak adalah sangat disyorkan.',
    en: 'Significant developmental indicators detected. Immediate evaluation by a child development specialist is strongly recommended.',
    ms: 'Penunjuk perkembangan yang signifikan dikesan. Penilaian segera sangat disyorkan.',
    th: 'พบตัวบ่งชี้พัฒนาการที่สำคัญ การประเมินโดยผู้เชี่ยวชาญเป็นสิ่งจำเป็นอย่างยิ่ง',
    vi: 'Phát hiện các chỉ dấu phát triển đáng kể. Đánh giá ngay lập tức là rất cần thiết.',
    fil: 'Nakita ang mga importante sa pag-unlad na indicator. Ang agarang pagtatasa ay lubos na inirerekomenda.',
  },
};

const SPEC: Record<OverallClassification, Record<string, string>> = {
  low_overall: { id: 'Pediatrician umum', en: 'General pediatrician', ms: 'Pediatrician umum', th: 'แพทย์เด็กทั่วไป', vi: 'Bác sĩ nhi khoa tổng quát', fil: 'General pediatrician' },
  moderate_adhd: { id: 'Spesialis ADHD anak, Psikolog klinis', en: 'Child ADHD specialist, Clinical psychologist', ms: 'Spesialis ADHD, Psikolog klinikal', th: 'ผู้เชี่ยวชาญ ADHD เด็ก, นักจิตวิทยาคลินิก', vi: 'Chuyên gia ADHD trẻ em, Nhà tâm lý lâm sàng', fil: 'Child ADHD specialist, Clinical psychologist' },
  moderate_asd: { id: 'Spesialis perkembangan anak, Psikolog klinis', en: 'Developmental pediatrician, Clinical psychologist', ms: 'Pediatrician perkembangan, Psikolog klinikal', th: 'แพทย์เด็กเฉพาะทางพัฒนาการ, นักจิตวิทยาคลินิก', vi: 'Bác sĩ nhi khoa phát triển, Nhà tâm lý lâm sàng', fil: 'Developmental pediatrician, Clinical psychologist' },
  mixed_moderate: { id: 'Spesialis perkembangan anak, Psikolog klinis, Terapis okupasi', en: 'Developmental pediatrician, Clinical psychologist, Occupational therapist', ms: 'Pediatrician perkembangan, Psikolog klinikal, Terapis okupasi', th: 'แพทย์เด็กเฉพาะทาง, นักจิตวิทยาคลินิก, นักกิจวรรยะ', vi: 'Bác sĩ nhi khoa phát triển, Nhà tâm lý lâm sàng, Chuyên gia trị liệu nghề nghiệp', fil: 'Developmental pediatrician, Clinical psychologist, Occupational therapist' },
  high_adhd: { id: 'Spesialis ADHD anak, Psikolog klinis, Terapis perilaku', en: 'Child ADHD specialist, Clinical psychologist, Behavior therapist', ms: 'Spesialis ADHD, Psikolog klinikal, Terapis perilaku', th: 'ผู้เชี่ยวชาญ ADHD เด็ก, นักจิตวิทยาคลินิก, นักบำบัดพฤติกรรม', vi: 'Chuyên gia ADHD trẻ em, Nhà tâm lý lâm sàng, Chuyên gia trị liệu hành vi', fil: 'Child ADHD specialist, Clinical psychologist, Behavior therapist' },
  high_asd: { id: 'Spesialis perkembangan anak, Psikolog klinis, Terapis okupasi', en: 'Developmental pediatrician, Clinical psychologist, Occupational therapist', ms: 'Pediatrician perkembangan, Psikolog klinikal, Terapis okupasi', th: 'แพทย์เด็กเฉพาะทางพัฒนาการ, นักจิตวิทยาคลินิก, นักกิจวรรยะ', vi: 'Bác sĩ nhi khoa phát triển, Nhà tâm lý lâm sàng, Chuyên gia trị liệu nghề nghiệp', fil: 'Developmental pediatrician, Clinical psychologist, Occupational therapist' },
  mixed_high: { id: 'Spesialis perkembangan anak, Psikolog klinis, Terapis perilaku, Terapis okupasi', en: 'Developmental pediatrician, Clinical psychologist, Behavior therapist, Occupational therapist', ms: 'Pediatrician perkembangan, Psikolog klinikal, Terapis perilaku, Terapis okupasi', th: 'แพทย์เด็กเฉพาะทาง, นักจิตวิทยาคลินิก, นักบำบัดพฤติกรรม, นักกิจวรรยะ', vi: 'Bác sĩ nhi khoa phát triển, Nhà tâm lý lâm sàng, Chuyên gia trị liệu hành vi, Chuyên gia trị liệu nghề nghiệp', fil: 'Developmental pediatrician, Clinical psychologist, Behavior therapist, Occupational therapist' },
  urgent_concern: { id: 'Klinik perkembangan anak (RSUD/RSUP), Psikolog klinis, Terapis perilaku', en: 'Child development clinic (hospital), Clinical psychologist, Behavior therapist', ms: 'Klinik perkembangan anak, Psikolog klinikal, Terapis perilaku', th: 'คลินิกพัฒนาการเด็ก, นักจิตวิทยาคลินิก, นักบำบัดพฤติกรรม', vi: 'Phòng khám phát triển trẻ em, Nhà tâm lý lâm sàng, Chuyên gia trị liệu hành vi', fil: 'Child development clinic, Clinical psychologist, Behavior therapist' },
};

// ─── AI Observation generator ──────────────────────────────────────────────────

const OBS: Record<string, Record<string, string>> = {
  eyeEngagement: { id: 'Penglibatan mata semasa interaksi sosial memerlukan perhatian lanjut.', en: 'Eye engagement during social interactions requires further observation.', ms: 'Penglibatan mata semasa interaksi sosial memerlukan perhatian.', th: 'การมีส่วนร่วมของดวงตาในการโต้ตอบทางสังคมต้องการความสนใจ.', vi: 'Sự tham gia của mắt trong các tương tác xã hội cần được theo dõi.', fil: 'Ang pakikilahok ng mata sa sosyal na interaksiyon ay nangangailangan ng karagdagang obserbasyon.' },
  repetitiveBehavior: { id: 'Corak perilaku berulang dikesan — ini mungkin sebahagian perkembangan biasa tetapi wajar dipantau.', en: 'Repetitive behavior patterns detected — may be part of typical development but warrants monitoring.', ms: 'Corak perilaku berulang dikesan — mungkin perkembangan biasa.', th: 'พบรูปแบบพฤติกรรมซ้ำ — อาจเป็นส่วนหนึ่งของการพัฒนาปกติ.', vi: 'Phát hiện các mẫu hành vi lặp lại — có thể là một phần của sự phát triển điển hình.', fil: 'Nakita ang mga repetitive na pattern ng pag-uugali — maaaring bahagi ng typical na pag-unlad.' },
  movement: { id: 'Perilaku pergerakan menunjukkan aktiviti yang tinggi dalam beberapa situasi.', en: 'Movement patterns show elevated activity levels in several observed situations.', ms: 'Pergerakan menunjukkan aktiviti tinggi dalam beberapa situasi.', th: 'รูปแบบการเคลื่อนไหวแสดงระดับกิจกรรมที่สูงในบางสถานการณ์.', vi: 'Các mẫu chuyển động cho thấy mức hoạt động cao trong một số tình huống.', fil: 'Ang mga pattern ng paggalaw ay nagpapakita ng mataas na antas ng aktibidad sa ilang sitwasyon.' },
  attentionInstability: { id: 'Ketidakstabilan perhatian diperhatikan — ini perlu dipantau dari masa ke masa.', en: 'Attention instability was observed — this warrants ongoing monitoring over time.', ms: 'Ketidakstabilan perhatian diperhatikan.', th: 'พบความแปรปรวนของความสนใจ.', vi: 'Phát hiện sự không ổn định của sự tập trung.', fil: 'May namamagitan na pagbabago sa pansin na nararapat na obserbahan.' },
  socialResponse: { id: 'Tindak balas sosial menunjukkan perkembangan yang bersesuaian dengan usia.', en: 'Social response appears age-appropriate in observed interactions.', ms: 'Tindak balas sosial kelihatan bersesuaian usia.', th: 'การตอบสนองทางสังคมดูเหมาะสมกับวัย.', vi: 'Phản ứng xã hội dường như phù hợp với độ tuổi.', fil: 'Ang sosyal na pagtugon ay tila naaangkop sa edad.' },
  speechDelay: { id: 'Sejarah kelembapan pertuturan dikenal pasti — ini adalah faktor yang wajar dipantau.', en: 'Speech delay history noted — this is a factor worth monitoring.', ms: 'Sejarah kelembapan pertuturan dikenal pasti.', th: 'มีประวัติความล่าช้าทางภาษา.', vi: 'Tiền sử chậm nói được ghi nhận.', fil: 'Ang kasaysayan ng speech delay ay na-note.' },
  familyHistory: { id: 'Sejarah keluarga ADHD/ASD dikenal pasti — pemerhatian lanjut disyorkan.', en: 'Family history of ADHD/ASD noted — further observation is recommended.', ms: 'Sejarah keluarga ADHD/ASD dicatatkan.', th: 'มีประวัติครอบครัว ADHD/ASD.', vi: 'Tiền sử gia đình ADHD/ASD được ghi nhận.', fil: 'May na-note na kasaysayan ng pamilya sa ADHD/ASD.' },
  learningDev: { id: 'Perkembangan pembelajaran berada dalam lingkungan biasa.', en: 'Learning development appears within typical range.', ms: 'Perkembangan pembelajaran dalam lingkungan biasa.', th: 'การพัฒนาการเรียนรู้อยู่ในระดับปกติ.', vi: 'Sự phát triển học tập có vẻ trong phạm vi điển hình.', fil: 'Ang pag-unlad sa pag-aaral ay tila nasa loob ng typical na saklaw.' },
  eyeEngagementOk: { id: 'Kekerapan kontak mata kelihatan bersesuaian dengan usia dalam interaksi yang diperhatikan.', en: 'Eye contact frequency appears age-appropriate during observed interactions.', ms: 'Kontak mata kelihatan bersesuaian usia.', th: 'ความถี่การสบตาดูเหมาะสมกับวัย.', vi: 'Tần suất liên lạc bằng mắt có vẻ phù hợp với độ tuổi.', fil: 'Ang frequency ng contact sa mata ay tila naaangkop sa edad.' },
  activityModulation: { id: 'Transisi aktiviti diperhatikan dengan modulasi yang bersesuaian.', en: 'Activity transitions observed with appropriate modulation.', ms: 'Transisi aktiviti dengan modulasi bersesuaian.', th: 'การเปลี่ยนถ่ายกิจกรรมด้วยการปรับตัวที่เหมาะสม.', vi: 'Các chuyển đổi hoạt động được quan sát với sự điều biến phù hợp.', fil: 'Ang mga transisyon ng aktibidad ay na-obserbahan na may angkop na modulation.' },
};

function tObs(key: string, lang: string): string {
  const lk = lang in OBS.eyeEngagement ? lang : 'en';
  return OBS[key]?.[lk] ?? OBS[key]?.['en'] ?? OBS[key]?.['id'] ?? '';
}

// ─── Video simulation ──────────────────────────────────────────────────────────

export function simulateVideoAnalysis(
  adhdQuestionnairePct: number,
  asdQuestionnairePct: number
): VideoAnalysisResult {
  const seed = (adhdQuestionnairePct * 7 + asdQuestionnairePct * 13) % 100;
  const seededRandom = (n: number) => ((seed * 9301 + 49297) % 233280) / 233280 * n;
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  const baseAdhd = adhdQuestionnairePct > 39 ? clamp(adhdQuestionnairePct + seededRandom(15)) : clamp(adhdQuestionnairePct * 0.4);
  const baseAsd = asdQuestionnairePct > 39 ? clamp(asdQuestionnairePct + seededRandom(15)) : clamp(asdQuestionnairePct * 0.4);

  const adhdObs: string[] = baseAdhd >= 40
    ? [tObs('movement', 'en'), tObs('attentionInstability', 'en')]
    : [tObs('activityModulation', 'en')];

  const asdObs: string[] = baseAsd >= 40
    ? [tObs('eyeEngagement', 'en'), tObs('repetitiveBehavior', 'en')]
    : [tObs('eyeEngagementOk', 'en')];

  return { adhdScore: baseAdhd, asdScore: baseAsd, adhdObservations: adhdObs, asdObservations: asdObs };
}

// ─── Core calculation ──────────────────────────────────────────────────────────

export function calculateScores(
  answers: number[],
  lang: string = 'en',
  childProfile: ChildProfile | null = null
): ScoreResult {
  if (answers.length !== 20) {
    throw new Error(`Expected 20 answers, got ${answers.length}.`);
  }

  const lk = lang in REC.low_overall ? lang : 'en';

  // Domain scores
  const domainScores: DomainScore[] = DOMAIN_CONFIGS.map((cfg) => {
    const qi = cfg.questionIds.map(id => id - 1);
    const score = qi.reduce((s, i) => s + (answers[i] ?? 0), 0);
    const percentage = pct(score, cfg.maxScore);
    return {
      domain: cfg.id,
      domainName: cfg.name[lk] ?? cfg.name['en'],
      score,
      maxScore: cfg.maxScore,
      percentage,
      level: levelFromPct(percentage),
      questionIndices: qi,
    };
  });

  const dA = domainScores.find(d => d.domain === 'A')!;
  const dB = domainScores.find(d => d.domain === 'B')!;
  const dC = domainScores.find(d => d.domain === 'C')!;
  const dD = domainScores.find(d => d.domain === 'D')!;
  const dE = domainScores.find(d => d.domain === 'E')!;

  const overallAdhdPct = Math.round((dA.percentage + dB.percentage) / 2);
  const overallAsdPct = Math.round((dC.percentage + dD.percentage) / 2);

  // Video simulation
  const video = simulateVideoAnalysis(overallAdhdPct, overallAsdPct);

  // Final combined scores
  const finalAdhdPct = Math.round(overallAdhdPct * 0.8 + video.adhdScore * 0.2);
  const finalAsdPct = Math.round(overallAsdPct * 0.8 + video.asdScore * 0.2);

  const devScore = answers[19]; // Q20

  // Classification (per spec)
  let overallClassification: OverallClassification;
  if (devScore >= 2 && (finalAdhdPct >= 70 || finalAsdPct >= 70)) {
    overallClassification = 'urgent_concern';
  } else if (finalAdhdPct >= 70 && finalAsdPct >= 70) {
    overallClassification = 'mixed_high';
  } else if (finalAdhdPct >= 70) {
    overallClassification = 'high_adhd';
  } else if (finalAsdPct >= 70) {
    overallClassification = 'high_asd';
  } else if (finalAdhdPct >= 40 && finalAsdPct >= 40) {
    overallClassification = 'mixed_moderate';
  } else if (finalAdhdPct >= 40) {
    overallClassification = 'moderate_adhd';
  } else if (finalAsdPct >= 40) {
    overallClassification = 'moderate_asd';
  } else {
    overallClassification = 'low_overall';
  }

  // AI Observations
  const aiObservations: AIObservation[] = [];

  if (dC.percentage >= 40) aiObservations.push({ category: 'Eye Engagement', icon: '👁️', observation: tObs('eyeEngagement', lk) });
  if (dD.percentage >= 40) aiObservations.push({ category: 'Repetitive Behavior', icon: '🔄', observation: tObs('repetitiveBehavior', lk) });
  if (dB.percentage >= 40) aiObservations.push({ category: 'Movement Patterns', icon: '🏃', observation: tObs('movement', lk) });
  if (dA.percentage >= 40) aiObservations.push({ category: 'Attention Stability', icon: '🎯', observation: tObs('attentionInstability', lk) });
  if (dC.percentage < 40) aiObservations.push({ category: 'Social Response', icon: '💬', observation: tObs('socialResponse', lk) });
  if (childProfile?.speechDelay === 'yes' || childProfile?.speechDelay === 'unsure') aiObservations.push({ category: 'Speech Development', icon: '🗣️', observation: tObs('speechDelay', lk) });
  if (childProfile?.familyHistory === 'yes' || childProfile?.familyHistory === 'unsure') aiObservations.push({ category: 'Family History', icon: '👨‍👩‍👧', observation: tObs('familyHistory', lk) });
  if (dE.percentage < 67) aiObservations.push({ category: 'Learning Development', icon: '📚', observation: tObs('learningDev', lk) });

  return {
    domainScores,
    adhdInattentionPct: dA.percentage,
    adhdHyperactivityPct: dB.percentage,
    asdSocialPct: dC.percentage,
    asdSensoryPct: dD.percentage,
    generalDevPct: dE.percentage,
    overallAdhdPct,
    overallAsdPct,
    finalAdhdPct,
    finalAsdPct,
    overallClassification,
    recommendationKey: overallClassification,
    recommendationText: REC[overallClassification][lk] ?? REC[overallClassification]['en'],
    specialistsText: SPEC[overallClassification][lk] ?? SPEC[overallClassification]['en'],
    aiObservations,
    devScore,
    childProfile,
    videoAnalysis: video,
  };
}