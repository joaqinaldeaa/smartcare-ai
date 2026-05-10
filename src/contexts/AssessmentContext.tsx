'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AssessmentStep = 1 | 2 | 3 | 4;
export type RiskLevel = 'low' | 'medium' | 'high';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dob: string; // ISO date string YYYY-MM-DD
  speechDelay?: 'yes' | 'no' | 'unsure'; // NEW
  familyHistory?: 'yes' | 'no' | 'unsure'; // NEW
}

export interface QAPair {
  questionId: number;
  question: string; // i18n key
  answer: string;
}

export interface VideoUpload {
  file: File | null;
  progress: number; // 0–100
  previewUrl: string | null;
}

export interface Insight {
  id: string;
  category: 'interview' | 'video';
  icon: string; // lucide icon name
  titleKey: string; // i18n key
  bodyKey: string;
  score: number; // 0–100
}

export interface AssessmentState {
  currentStep: AssessmentStep;
  selectedChild: ChildProfile | null;
  qaPairs: QAPair[];
  video: VideoUpload;
  riskLevel: RiskLevel;
  insights: Insight[];
  isComplete: boolean;
  answers: number[]; // 20-questionnaire answers, index 0=Q1
}

interface AssessmentContextValue extends AssessmentState {
  setStep: (step: AssessmentStep) => void;
  selectChild: (child: ChildProfile) => void;
  addQAPair: (pair: QAPair) => void;
  setVideo: (video: VideoUpload) => void;
  setAnswers: (answers: number[]) => void;
  completeAssessment: (insights: Insight[], riskLevel: RiskLevel) => void;
  reset: () => void;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: AssessmentState = {
  currentStep: 1,
  selectedChild: null,
  qaPairs: [],
  video: { file: null, progress: 0, previewUrl: null },
  riskLevel: 'medium',
  insights: [],
  isComplete: false,
  answers: [],
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AssessmentCtx = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);

  const setStep = useCallback((step: AssessmentStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const selectChild = useCallback((child: ChildProfile) => {
    setState((prev) => ({ ...prev, selectedChild: child }));
  }, []);

  const addQAPair = useCallback((pair: QAPair) => {
    setState((prev) => ({ ...prev, qaPairs: [...prev.qaPairs, pair] }));
  }, []);

  const setVideo = useCallback((video: VideoUpload) => {
    setState((prev) => ({ ...prev, video }));
  }, []);

  const completeAssessment = useCallback(
    (insights: Insight[], riskLevel: RiskLevel) => {
      setState((prev) => ({ ...prev, insights, riskLevel, isComplete: true }));
    },
    []
  );

  const setAnswers = useCallback((answers: number[]) => {
    setState((prev) => ({ ...prev, answers }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return (
    <AssessmentCtx.Provider
      value={{ ...state, setStep, selectChild, addQAPair, setVideo, completeAssessment, reset, setAnswers }}
    >
      {children}
    </AssessmentCtx.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentCtx);
  if (!ctx) throw new Error('useAssessment must be used inside <AssessmentProvider>');
  return ctx;
}