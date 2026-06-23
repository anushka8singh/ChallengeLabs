import api from '../api/axios';

// ─── Session Types ────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  challengeId: string;
  containerId: string;
  status: string;
  startedAt: string;
  expiresAt: string;
}

export interface StartSessionResponse {
  success: boolean;
  data: {
    session: Session;
    containerId: string;
    expiresAt: string;
  };
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export interface CurrentTask {
  id: string;
  title: string;
  description: string;
  hint: string | null;
  order: number;
}

export interface ProgressData {
  sessionId: string;
  challengeId: string;
  challengeTitle: string;
  completedTasks: number;
  totalTasks: number;
  percentage: number;
  currentTask: CurrentTask | null;
  lastValidatedAt?: string | null;
}

export interface CurrentProgressResponse {
  success: boolean;
  data: ProgressData;
}

export interface CurrentSessionResponse {
  success: boolean;
  data: Session | null;
}

export interface SessionDetailsResponse {
  success: boolean;
  data: Session;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export const startSession = async (challengeId: string): Promise<StartSessionResponse> => {
  const res = await api.post<StartSessionResponse>('/api/sessions/start', { challengeId });
  return res.data;
};

export const getCurrentProgress = async (): Promise<CurrentProgressResponse> => {
  const res = await api.get<CurrentProgressResponse>('/api/progress/current');
  return res.data;
};

export const getCurrentSession = async (): Promise<CurrentSessionResponse> => {
  const res = await api.get<CurrentSessionResponse>('/api/sessions/current');
  return res.data;
};

export const getSessionById = async (
  sessionId: string
): Promise<SessionDetailsResponse> => {
  const res = await api.get<SessionDetailsResponse>(
    `/api/sessions/${sessionId}`
  );

  return res.data;
};


export const stopSession = async () => {
  const res = await api.post('/api/sessions/stop');

  return res.data;
};

// ─── Terminal & Validation Types ───────────────────────────────────────────────

export interface TaskValidationResponse {
  success: boolean;
  data: {
    passed: boolean;
    feedback: string;
    validationResult?: {
      id: string;
      sessionId: string;
      taskId: string;
      passed: boolean;
      feedback: string;
    };
  };
}

// ─── Terminal & Validation Functions ───────────────────────────────────────────

export const validateTask = async (taskId: string, sessionId: string): Promise<TaskValidationResponse> => {
  const res = await api.post<TaskValidationResponse>(`/api/tasks/${taskId}/validate`, { sessionId });
  return res.data;
};
