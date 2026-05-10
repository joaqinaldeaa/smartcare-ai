/**
 * SmartCareAI v2 — Scoring Engine
 * Rule-based calculation from parent/teacher answers
 */

import { QUESTIONS, ANSWER_LABELS } from './questions';

// ─── Domain config ─────────────────────────────────────────────────────────────

interface DomainConfig {
  id: 'A' | 'B' | 'C' | 'D';
  name: Record<string, string>;
  questionIds: number[];     // 1-based question IDs in this domain
  maxScore: number;
  lowThreshold: number;
  moderateThreshold: number;
  /** If "Often" (value=3) appears this many times → auto-flag High regardless of sum */
  oftenFloor?: number;
  /** Strict mode: all questions in this domain must score ≥ this to flag High */
  minPerQuestion?: number;
}

const DOMAIN_CONFIGS: DomainConfig[] = [
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
    lowThreshold: 6,
    moderateThreshold: 11,
    oftenFloor: 4, // 4 or more "Often" answers → High
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
    lowThreshold: 7,
    moderateThreshold: 13,
    oftenFloor: 4,
  },
  {
    id: 'C',
    name: {
      id: 'Komunikasi Sosial & Deria',
      en: 'Social Communication & Sensory',
      ms: 'Komunikasi Sosial & Deria',
      th: 'การสื่อสารทางสังคมและประสาทสัมผัส',
      vi: 'Giao tiếp xã hội & Giác quan',
      fil: 'Panlipunang Komunikasyon at Sensory',
    },
    // Q14-16 only (3 questions, max=9) — per spec: all 3 ≥2 → High
  questionIds: [14, 15, 16],
  maxScore: 9,
  lowThreshold: 3,
  moderateThreshold: 6,
  // "all 3 scored ≥2" override
  minPerQuestion: 2,
  },
  {
    id: 'D',
    name: {
      id: 'Perkembangan Umum',
      en: 'General Development',
      ms: 'Perkembangan Umum',
      th: 'การพัฒนาทั่วไป',
      vi: 'Phát triển chung',
      fil: 'Pangkalahatang Pag-unlad',
    },
    // Q17-19 (sensory/repetitive) + Q20 (learning delay); Q20 handled standalone in overall risk
    questionIds: [17, 18, 19],
    maxScore: 9,
    lowThreshold: 3,
    moderateThreshold: 6,
  },
];

// ─── Output types ─────────────────────────────────────────────────────────────

export type DomainLevel = 'low' | 'moderate' | 'high';

export interface DomainScore {
  domain: 'A' | 'B' | 'C' | 'D';
  domainName: string;
  score: number;
  maxScore: number;
  level: DomainLevel;
  /** Indices into the answers array (0-based) — corresponds to question IDs */
  questionIndices: number[];
}

export type OverallRisk =
  | 'low_overall'
  | 'adhd_learning'
  | 'asd_spectrum'
  | 'mixed_both'
  | 'high_concern';

export interface ScoreResult {
  domainScores: DomainScore[];
  overallRisk: OverallRisk;
  recommendationKey: string;
  recommendationText: string;
  /** Q20 answer value */
  devScore: number;
}

// ─── Recommendation copy ───────────────────────────────────────────────────────

const RECOMMENDATIONS: Record<OverallRisk, Record<string, string>> = {
  low_overall: {
    id: 'Tumbuhan anak berkembang baik dalam semua domain. Lanjutkan pemantauan berkala.',
    en: 'Child is developing well across all domains. Continue routine monitoring.',
    ms: 'Kanak-kanak berkembang dengan baik dalam semua domain. Teruskan pemantauan berkala.',
    th: 'เด็กพัฒนาได้ดีในทุกด้าน ควรติดตามตามปกติต่อไป',
    vi: 'Trẻ phát triển tốt trong tất cả các lĩnh vực. Tiếp tục theo dõi định kỳ.',
    fil: 'Ang bata ay umuunlad nang maayos sa lahat ng domain. Ipagpatuloy ang regular na pagmamatyag.',
  },
  adhd_learning: {
    id: 'Terdeteksi corak perhatian dan/atau hyperactivity. Pertimbangkan penilaian ADHD lanjut dan sokongan pembelajaran.',
    en: 'Attention and/or hyperactivity patterns detected. Consider further ADHD assessment and learning support.',
    ms: 'Corak perhatian dan/atau hiperaktiviti dikesan. Pertimbangkan penilaian ADHD lanjut dan sokongan pembelajaran.',
    th: 'พบรูปแบบด้านความสนใจและ/หรือ hyperactivity ควรพิจารณาการประเมิน ADHD เพิ่มเติมและการสนับสนุนการเรียนรู้',
    vi: 'Phát hiện các mẫu về chú ý và/hoặc tăng động. Cân nhắc đánh giá ADHD thêm và hỗ trợ học tập.',
    fil: 'Nakita ang mga pattern ng pansin at/o hyperaktibidad. Isaalang-alang ang karagdagang pagtatasa sa ADHD at suporta sa pag-aaral.',
  },
  asd_spectrum: {
    id: 'Terdeteksi corak sosial dan/atau deria. Pertimbangkan penilaianASD lanjut dan sokongan perkembangan.',
    en: 'Social and/or sensory patterns detected. Consider further ASD assessment and developmental support.',
    ms: 'Corak sosial dan/atau deria dikesan. Pertimbangkan penilaian ASD lanjut dan sokongan perkembangan.',
    th: 'พบรูปแบบทางสังคมและ/หรือประสาทสัมผัส ควรพิจารณาการประเมิน ASD เพิ่มเติมและการสนับสนุนการพัฒนา',
    vi: 'Phát hiện các mẫu về xã hội và/hoặc giác quan. Cân nhắc đánh giá ASD thêm và hỗ trợ phát triển.',
    fil: 'Nakita ang mga panlipunang at/o sensory na pattern. Isaalang-alang ang karagdagang pagtatasa sa ASD at suporta sa pag-unlad.',
  },
  mixed_both: {
    id: 'Corak ADHD dan ASD kedua-duanya dikenal pasti. Penilaian komprehensif oleh profesional disyorkan.',
    en: 'Both ADHD and ASD patterns identified. Comprehensive assessment by a professional is recommended.',
    ms: 'Kedua-dua corak ADHD dan ASD dikenal pasti. Penilaian komprehensif oleh profesional disyorkan.',
    th: 'พบทั้งรูปแบบ ADHD และ ASD ควรได้รับการประเมินอย่างครอบคลุมโดยผู้เชี่ยวชาญ',
    vi: 'Cả hai mẫu ADHD và ASD đều được xác định. Đánh giá toàn diện bởi chuyên gia được khuyến nghị.',
    fil: 'Nakita ang parehong ADHD at ASD pattern. Inirerekomenda ang komprehensibong pagtatasa ng propesyonal.',
  },
  high_concern: {
    id: 'Skor tinggi dalam satu atau lebih domain bersama-sama dengan masalah pembelajaran dikesan. Penilaian segera oleh profesional disyorkan.',
    en: 'High scores in one or more domains alongside learning difficulties detected. Immediate professional assessment recommended.',
    ms: 'Skor tinggi dalam satu atau lebih domain bersama-sama dengan masalah pembelajaran dikesan. Penilaian segera oleh profesional disyorkan.',
    th: 'พบคะแนนสูงในหนึ่งหรือหลายโดเมนร่วมกับความยากลำบากในการเรียนรู้ ควรได้รับการประเมินโดยผู้เชี่ยวชาญทันที',
    vi: 'Điểm cao trong một hoặc nhiều lĩnh vực cùng với khó khăn học tập được phát hiện. Đánh giá ngay lập tức bởi chuyên gia được khuyến nghị.',
    fil: 'Mataas na mga score sa isa o higit pang mga domain kasama ng mga paghihirap sa pag-aaral. Inirerekomenda ang agarang pagtatasa ng propesyonal.',
  },
};

// ─── Helper: level from score + config ───────────────────────────────────────

function computeLevel(
  score: number,
  cfg: DomainConfig,
  answers: number[],
  questionIndices: number[]
): DomainLevel {
  // "Often floor": 4+ answers of value 3 in this domain → High (ADHD auto-flag)
  if (cfg.oftenFloor !== undefined) {
    const oftenCount = questionIndices.filter(
      (idx) => answers[idx] === 3
    ).length;
    if (oftenCount >= cfg.oftenFloor) return 'high';
  }

  // "all N questions scored ≥2" override (e.g. Domain C: all 3 ≥2 → High)
  if (cfg.minPerQuestion !== undefined) {
    const allMin = questionIndices.every((idx) => answers[idx] >= cfg.minPerQuestion!);
    if (allMin) return 'high';
  }

  // Score-based thresholds: High if > moderateThreshold, Moderate if > lowThreshold
  if (score > cfg.moderateThreshold) return 'high';
  if (score > cfg.lowThreshold) return 'moderate';
  return 'low';
}

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculate domain scores and overall risk from an array of 20 answers.
 *
 * @param answers  Array of 20 values, index 0 = Q1, index 19 = Q20.
 *                 Each value must be 0 (Never), 1 (Rarely), 2 (Sometimes), or 3 (Often).
 * @param lang     Language key for returned text (default 'en').
 * @returns ScoreResult with domainScores, overallRisk, and recommendation.
 */
export function calculateScores(
  answers: number[],
  lang: string = 'en'
): ScoreResult {
  if (answers.length !== 20) {
    throw new Error(
      `Expected 20 answers, got ${answers.length}. ` +
        'Provide an array of exactly 20 numeric values (0-3).'
    );
  }

  const langKey = lang in RECOMMENDATIONS.low_overall ? lang : 'en';

  const domainScores: DomainScore[] = DOMAIN_CONFIGS.map((cfg) => {
    const questionIndices = cfg.questionIds.map((id) => id - 1); // convert to 0-based
    const score = questionIndices.reduce((sum, idx) => sum + (answers[idx] ?? 0), 0);
    const level = computeLevel(score, cfg, answers, questionIndices);

    return {
      domain: cfg.id,
      domainName: cfg.name[langKey] ?? cfg.name['en'],
      score,
      maxScore: cfg.maxScore,
      level,
      questionIndices,
    };
  });

  const domainA = domainScores.find((d) => d.domain === 'A')!;
  const domainB = domainScores.find((d) => d.domain === 'B')!;
  const domainC = domainScores.find((d) => d.domain === 'C')!;
  const domainD = domainScores.find((d) => d.domain === 'D')!;

  const adhdElevated =
    domainA.level === 'high' || domainA.level === 'moderate' ||
    domainB.level === 'high' || domainB.level === 'moderate';

  const asdElevated =
    domainC.level === 'high' || domainC.level === 'moderate';

  const devScore = answers[19]; // Q20

  // High score in any domain + developmental delay → highest-priority concern
  const highWithDev =
    (domainA.level === 'high' || domainB.level === 'high' || domainC.level === 'high') &&
    devScore >= 2;

  let overallRisk: OverallRisk;
  let recommendationKey: string;

  // Rule 1 — all domains low
  if (
    domainA.level === 'low' &&
    domainB.level === 'low' &&
    domainC.level === 'low' &&
    domainD.level === 'low'
  ) {
    overallRisk = 'low_overall';
    recommendationKey = 'low_overall';
  }
  // Rule 2 — ADHD/learning elevated, ASD absent (but not high_concern)
  else if (
    (domainA.level !== 'low' || domainB.level !== 'low') &&
    domainC.level === 'low' &&
    !highWithDev
  ) {
    overallRisk = 'adhd_learning';
    recommendationKey = 'adhd_learning';
  }
  // Rule 3 — ASD elevated, ADHD absent (and not captured by high_concern)
  else if (
    domainC.level !== 'low' &&
    domainA.level === 'low' &&
    domainB.level === 'low' &&
    !(domainC.level === 'high' && devScore >= 2)
  ) {
    overallRisk = 'asd_spectrum';
    recommendationKey = 'asd_spectrum';
  }
  // Rule 4 — high score anywhere + developmental delay → high_concern (HIGHEST priority)
  else if (
    (domainA.level === 'high' || domainB.level === 'high' || domainC.level === 'high') &&
    devScore >= 2
  ) {
    overallRisk = 'high_concern';
    recommendationKey = 'high_concern';
  }
  // Rule 5 — both ADHD and ASD elevated (but not high_concern)
  else if (adhdElevated && asdElevated) {
    overallRisk = 'mixed_both';
    recommendationKey = 'mixed_both';
  }
  else {
    // Fallback: classify by dominant elevated domain
    if (asdElevated && !adhdElevated) {
      overallRisk = 'asd_spectrum';
      recommendationKey = 'asd_spectrum';
    } else if (adhdElevated && !asdElevated) {
      overallRisk = 'adhd_learning';
      recommendationKey = 'adhd_learning';
    } else {
      overallRisk = 'low_overall';
      recommendationKey = 'low_overall';
    }
  }

  const recommendationText =
    RECOMMENDATIONS[overallRisk][langKey] ?? RECOMMENDATIONS[overallRisk]['en'];

  return {
    domainScores,
    overallRisk,
    recommendationKey,
    recommendationText,
    devScore,
  };
}

// ─── Utility: interpret a single answer ──────────────────────────────────────

/** Convert a raw answer value (0-3) to its label string */
export function answerLabel(value: number, lang: string = 'en'): string {
  return ANSWER_LABELS[value] ?? 'Unknown';
}

/** Returns the point value for a given answer label */
export function answerValue(label: string): number {
  const idx = ANSWER_LABELS.indexOf(label as typeof ANSWER_LABELS[number]);
  return idx === -1 ? -1 : idx;
}