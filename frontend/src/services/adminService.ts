import api from '../api/axios';

export interface AdminChallenge {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  estimatedMinutes: number;
  isPublished: boolean;
  tasks: {
    id: string;
  }[];
}

interface AdminChallengesResponse {
  success: boolean;
  data: AdminChallenge[];
}

export const getAdminChallenges =
  async (): Promise<AdminChallengesResponse> => {
    const res = await api.get(
      '/api/admin/challenges'
    );

    return res.data;
  };

  export interface CreateChallengePayload {
  title: string;
  slug: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  dockerImage: string;
  setupScript?: string;
  estimatedMinutes: number;
  isPublished: boolean;
}

export const createChallenge = async (
  payload: CreateChallengePayload
) => {
  const res = await api.post(
    '/api/admin/challenges',
    payload
  );

  return res.data;
};


export interface AdminTask {
  id: string;
  title: string;
  description: string;
  order: number;
  hint?: string | null;
 
}

interface TasksResponse {
  success: boolean;
  data: AdminTask[];
}

export const getChallengeTasks = async (
  challengeId: string
): Promise<TasksResponse> => {
  const res = await api.get(
    `/api/challenges/id/${challengeId}/tasks`
  );

  return res.data;
};

export interface CreateTaskPayload {
  title: string;
  description: string;
  order: number;
  hint?: string;

}

export const createTask = async (
  challengeId: string,
  payload: CreateTaskPayload
) => {
  const res = await api.post(
    `/api/admin/challenges/${challengeId}/tasks`,
    payload
  );

  return res.data;
};

export const deleteChallenge = async (
  challengeId: string
) => {
  const res = await api.delete(
    `/api/admin/challenges/${challengeId}`
  );

  return res.data;
};

export const updateChallenge = async (
  challengeId: string,
  payload: CreateChallengePayload
) => {
  const res = await api.put(
    `/api/admin/challenges/${challengeId}`,
    payload
  );

  return res.data;
};

export const getChallengeById = async (
  challengeId: string
) => {
  const res = await api.get(
    `/api/admin/challenges/${challengeId}`
  );

  return res.data;
};

export const deleteTask = async (
  taskId: string
) => {
  const res = await api.delete(
    `/api/admin/challenges/tasks/${taskId}`
  );

  return res.data;
};

export const updateTask = async (
  taskId: string,
  payload: {
    title: string;
    description: string;
    order: number;
    hint?: string;
   
  }
) => {
  const res = await api.put(
    `/api/admin/challenges/tasks/${taskId}`,
    payload
  );

  return res.data;
};

export const getTaskById = async (
  taskId: string
) => {
  const res = await api.get(
    `/api/admin/challenges/tasks/${taskId}`
  );

  return res.data;
};