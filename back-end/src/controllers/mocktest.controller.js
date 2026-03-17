import { sendSuccess } from "../utils/response.js";
import * as mocktestService from "../services/mocktest.service.js";

export const generateMockTest = async (req, res) => {
  try {
    const test = await mocktestService.generateMockTest(req.params.noteId, req.user.id, req.body);
    return sendSuccess(res, { test }, "Mock test generated", 201);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getMockTests = async (req, res) => {
  try {
    const tests = await mocktestService.getMockTests(req.params.noteId, req.user.id);
    return sendSuccess(res, { tests, total: tests.length });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getMockTestById = async (req, res) => {
  try {
    const test = await mocktestService.getMockTestById(req.params.testId, req.user.id);
    return sendSuccess(res, { test });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const submitMockTest = async (req, res) => {
  try {
    const result = await mocktestService.submitMockTest(req.params.testId, req.user.id, req.body.answers);
    return sendSuccess(res, result, "Test submitted");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const deleteMockTest = async (req, res) => {
  try {
    const result = await mocktestService.deleteMockTest(req.params.testId, req.user.id);
    return sendSuccess(res, result, "Test deleted");
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};