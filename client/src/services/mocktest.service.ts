import api from "../api/axiosInstance";

export interface SubmitAnswer {
  questionId: string;
  selectedOption: string;
}

export const generateMockTestAPI = (noteId: string) =>
  api.post(`/mocktests/generate/${noteId}`);

export const getMockTestsAPI = (noteId: string) =>
  api.get(`/mocktests/${noteId}`);

export const getMockTestByIdAPI = (testId: string) =>
  api.get(`/mocktests/test/${testId}`);

export const submitMockTestAPI = (testId: string, answers: SubmitAnswer[]) =>
  api.post(`/mocktests/test/${testId}/submit`, { answers });

export const deleteMockTestAPI = (testId: string) =>
  api.delete(`/mocktests/test/${testId}`);