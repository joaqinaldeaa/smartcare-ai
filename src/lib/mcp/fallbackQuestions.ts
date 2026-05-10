// Fallback screening questions for AI interview
// Each key is a TranslationKeys entry in en.ts/id.ts/fil.ts

export interface AssessmentQuestion {
  id: number;
  text: string; // i18n key
  followUps: string[];
}

export const FALLBACK_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    text: 'assessment.q1',
    followUps: ['Does this vary depending on the setting?'],
  },
  {
    id: 2,
    text: 'assessment.q2',
    followUps: ['Is eye contact avoided more in unfamiliar settings?'],
  },
  {
    id: 3,
    text: 'assessment.q3',
    followUps: ['Do transitions between activities cause distress?'],
  },
  {
    id: 4,
    text: 'assessment.q4',
    followUps: ['How often do these behaviors occur daily?'],
  },
  {
    id: 5,
    text: 'assessment.q5',
    followUps: ['Does your child prefer parallel play over joint play?'],
  },
  {
    id: 6,
    text: 'assessment.q6',
    followUps: ['Does this focus interfere with other activities?'],
  },
  {
    id: 7,
    text: 'assessment.q7',
    followUps: ['Are distractions frequent? What activities hold attention longest?'],
  },
  {
    id: 8,
    text: 'assessment.q8',
    followUps: ['Has this been observed in school or social settings?'],
  },
  {
    id: 9,
    text: 'assessment.q9',
    followUps: ['Are gestures, words, or both used consistently?'],
  },
  {
    id: 10,
    text: 'assessment.q10',
    followUps: ['What specific behaviors were noted?'],
  },
];

export function getQuestionByIndex(index: number): AssessmentQuestion | null {
  return FALLBACK_QUESTIONS[index] ?? null;
}

export function getNextQuestionText(currentIndex: number): string {
  const q = getQuestionByIndex(currentIndex);
  return q?.text ?? 'Thank you for your response. We will move to the next topic.';
}