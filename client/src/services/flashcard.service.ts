import api from "../api/axiosInstance";


export const generateFlashcardsAPI = (noteId: string) =>
  api.post(`/flashcards/generate/${noteId}`);

export const getFlashcardsAPI = (noteId: string) =>
  api.get(`/flashcards/${noteId}`);

export const createFlashcardAPI = (noteId: string, data: object) =>
  api.post(`/flashcards/${noteId}`, data);

export const updateFlashcardAPI = (cardId: string, data: object) =>
  api.patch(`/flashcards/${cardId}`, data);

export const deleteFlashcardAPI = (cardId: string) =>
  api.delete(`/flashcards/${cardId}`);