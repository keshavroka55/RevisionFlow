import { create } from "zustand";
import type { MockTest, SubmitAnswer, TestResult } from "../types/flashcard.types";
import {
  generateMockTestAPI,
  getMockTestByIdAPI,
  submitMockTestAPI,
} from "../services/mocktest.service";

type MockTestState = {
  currentTest: MockTest | null;
  result: TestResult | null;
  isGenerating: boolean;
  isSubmitting: boolean;
  error: string | null;

  generateTest: (noteId: string) => Promise<void>;
  loadTest: (testId: string) => Promise<void>;
  submitTest: (testId: string, answers: SubmitAnswer[]) => Promise<void>;
  reset: () => void;
  clearError: () => void;
};

export const useMockTestStore = create<MockTestState>((set) => ({
  currentTest: null,
  result: null,
  isGenerating: false,
  isSubmitting: false,
  error: null,

  generateTest: async (noteId) => {
    set({ isGenerating: true, error: null, result: null, currentTest: null });
    try {
      const res = await generateMockTestAPI(noteId);
      set({ currentTest: res.data.test, isGenerating: false });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
    }
  },

  loadTest: async (testId) => {
    set({ isGenerating: true, error: null });
    try {
      const res = await getMockTestByIdAPI(testId);
      set({ currentTest: res.data.test, isGenerating: false });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
    }
  },

  submitTest: async (testId, answers) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await submitMockTestAPI(testId, answers);
      set({ result: res.data, isSubmitting: false });
    } catch (err: any) {
      set({ error: err.message, isSubmitting: false });
    }
  },

  reset: () => set({ currentTest: null, result: null, error: null }),
  clearError: () => set({ error: null }),
}));