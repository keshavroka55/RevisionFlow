import { create } from "zustand";
import type { Flashcard } from "../types/flashcard.types";
import {
  generateFlashcardsAPI,
  getFlashcardsAPI,
} from "../services/flashcard.service";

type FlashcardState = {
  flashcards: Flashcard[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  currentNoteId: string | null;

  fetchFlashcards: (noteId: string) => Promise<void>;
  generateFlashcards: (noteId: string) => Promise<void>;
  clearFlashcards: () => void;
  clearError: () => void;
};

export const useFlashcardStore = create<FlashcardState>((set) => ({
  flashcards: [],
  isLoading: false,
  isGenerating: false,
  error: null,
  currentNoteId: null,

  fetchFlashcards: async (noteId) => {
    set({ isLoading: true, error: null, currentNoteId: noteId });
    try {
      const res = await getFlashcardsAPI(noteId);
      set({ flashcards: res.data.flashcards, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  generateFlashcards: async (noteId) => {
    set({ isGenerating: true, error: null });
    try {
      const res = await generateFlashcardsAPI(noteId);
      set({ flashcards: res.data.flashcards, isGenerating: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isGenerating: false });
    }
  },

  clearFlashcards: () => set({ flashcards: [], currentNoteId: null }),

  clearError: () => set({ error: null }),
}));