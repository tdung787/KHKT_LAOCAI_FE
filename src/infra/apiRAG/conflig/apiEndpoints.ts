/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

import { IQuizFilters } from "../type/IQuiz";
import { ISubmissionFilters } from "../type/ISubmission";

export const API_ENDPOINTS = {
  // notification / RAG
  RAG: {
    CREATE_SESSIONS: (userId: string) => `/session/create?student_id=${userId}`,
    RAG_QUERY: "/rag/query",
    CHAT_STREAM: "/chat/stream",
    GET_SESSION_HISTORY: (student_id: string) =>
      `/session/list?student_id=${student_id}`,
    GET_SESSION_DETAIL: (session_id: string, student_id: string) =>
      `/session?student_id=${student_id}&session_id=${session_id}`,
    DELETE_SESSION: (session_id: string, student_id: string) =>
      `/session?student_id=${student_id}&session_id=${session_id}`,
  },

  EVAL: {
    GET_EVAL: (student_id: string, days?: number) => {
      const params: string[] = [];

      if (student_id) params.push(`student_id=${student_id}`);
      if (days) params.push(`days=${days}`);

      const queryString = params.length > 0 ? `?${params.join("&")}` : "";

      return `/stats/history${queryString}`;
    },
  },

  QUIZ: {
    GET_QUIZZES: (filters: IQuizFilters) => {
      // Build params array
      const params: string[] = [];

      if (filters.student_id) params.push(`student_id=${filters.student_id}`);
      if (filters.subject)
        params.push(`subject=${encodeURIComponent(filters.subject)}`);
      if (filters.difficulty)
        params.push(`difficulty=${encodeURIComponent(filters.difficulty)}`);
      if (filters.date_from) params.push(`date_from=${filters.date_from}`);
      if (filters.date_to) params.push(`date_to=${filters.date_to}`);

      const queryString = params.length > 0 ? `?${params.join("&")}` : "";
      return `/quiz/all${queryString}`;
    },
  },

  SUBMISSION: {
    GET_SUBMISSIONS: (filters: ISubmissionFilters) => {
      const params: string[] = [];

      if (filters.student_id) params.push(`student_id=${filters.student_id}`);
      if (filters.quiz_id) params.push(`quiz_id=${filters.quiz_id}`);
      if (filters.date_from) params.push(`date_from=${filters.date_from}`);
      if (filters.date_to) params.push(`date_to=${filters.date_to}`);

      const queryString = params.length > 0 ? `?${params.join("&")}` : "";
      return `/submission/all${queryString}`;
    },
  },
} as const;
