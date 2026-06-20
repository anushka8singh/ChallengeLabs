import api from '../api/axios';

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
  hint: string;
}

export interface ChallengeDetail extends Challenge {
  description: string;
  dockerImage: string;
  tasks: Task[];
}

export interface ChallengesResponse {
  success: boolean;
  data: Challenge[];
}

export interface ChallengeDetailResponse {
  success: boolean;
  data: ChallengeDetail;
}

export const getChallenges = async (): Promise<ChallengesResponse> => {
  const res = await api.get<ChallengesResponse>('/api/challenges');
  return res.data;
};

export const getChallengeBySlug = async (slug: string): Promise<ChallengeDetailResponse> => {
  const res = await api.get<ChallengeDetailResponse>(`/api/challenges/${slug}`);
  return res.data;
};
