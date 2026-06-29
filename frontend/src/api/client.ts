import type { AxiosRequestConfig } from 'axios';
import { http } from './http';
import type {
  AdminStats,
  AuditLog,
  LoginResponse,
  PageResult,
  PromptGenerateResponse,
  ReviewForm,
  Skill,
  SkillCategory,
  SkillFormValues,
  SkillVariable,
  UsageLog,
  User,
} from '../types/models';

const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => http.get(url, config) as unknown as Promise<T>,
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => http.post(url, data, config) as unknown as Promise<T>,
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => http.put(url, data, config) as unknown as Promise<T>,
  delete: <T = void>(url: string, config?: AxiosRequestConfig) => http.delete(url, config) as unknown as Promise<T>,
};

export const authApi = {
  register: (payload: { username: string; password: string; nickname?: string }) => api.post<void>('/auth/register', payload),
  login: (payload: { username: string; password: string }) => api.post<LoginResponse>('/auth/login', payload),
};

export const skillApi = {
  marketplace: (params?: Record<string, unknown>) =>
    api.get<PageResult<Skill>>('/skills/public/marketplace', { params }),
  publicDetail: (id: string | number) => api.get<Skill>(`/skills/public/${id}`),
  detail: (id: string | number) => api.get<Skill>(`/skills/${id}`),
  variables: (id: string | number) => api.get<SkillVariable[]>(`/skills/public/${id}/variables`),
  reviews: (id: string | number, params?: Record<string, unknown>) =>
    api.get<PageResult<{ id: number; rating: number; comment?: string; username?: string; createdAt?: string }>>(
      `/skills/public/${id}/reviews`,
      { params },
    ),
  categories: () => api.get<SkillCategory[]>('/skills/categories'),
  mySkills: (params?: Record<string, unknown>) => api.get<PageResult<Skill>>('/skills/my', { params }),
  create: (payload: SkillFormValues) => api.post<Skill>('/skills', payload),
  update: (id: string | number, payload: SkillFormValues) => api.put<Skill>(`/skills/${id}`, payload),
  remove: (id: string | number) => api.delete(`/skills/${id}`),
};

export const promptApi = {
  generate: (skillId: string | number, variableValues: Record<string, unknown>) =>
    api.post<PromptGenerateResponse>('/prompt/generate', { skillId, variableValues }),
};

export const engagementApi = {
  favorite: (skillId: string | number) => api.post<void>(`/favorites/${skillId}`),
  unfavorite: (skillId: string | number) => api.delete(`/favorites/${skillId}`),
  favorites: (params?: Record<string, unknown>) => api.get<PageResult<{ id: number; skillId: number; createdAt?: string }>>('/favorites/my', { params }),
  usageLogs: (params?: Record<string, unknown>) => api.get<PageResult<UsageLog>>('/usage-logs/my', { params }),
  review: (skillId: string | number, payload: ReviewForm) => api.post<void>(`/reviews/${skillId}`, payload),
};

export const userApi = {
  profile: () => api.get<User>('/user/profile'),
  updateProfile: (payload: Partial<User>) => api.put<void>('/user/profile', payload),
};

export const adminApi = {
  stats: () => api.get<AdminStats>('/admin/dashboard'),
  skills: (params?: Record<string, unknown>) => api.get<PageResult<Skill>>('/admin/skills', { params }),
  auditAction: (skillId: string | number, action: string, reason?: string) =>
    api.post<void>(`/admin/skills/${skillId}/audit`, { action, reason }),
  createCategory: (payload: Partial<SkillCategory>) =>
    api.post<void>('/admin/categories', null, { params: { name: payload.name, description: payload.description } }),
  updateCategory: (id: string | number, payload: Partial<SkillCategory>) =>
    api.put<void>(`/admin/categories/${id}`, null, { params: { name: payload.name, description: payload.description } }),
  deleteCategory: (id: string | number) => api.delete(`/admin/categories/${id}`),
  users: (params?: Record<string, unknown>) => api.get<PageResult<User>>('/admin/users', { params }),
  auditLogs: (params?: Record<string, unknown>) => api.get<PageResult<AuditLog>>('/admin/audit-logs', { params }),
};
