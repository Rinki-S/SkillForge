export type Role = 'USER' | 'ADMIN';
export type SkillStatus = 'PENDING' | 'PUBLISHED' | 'OFFLINE' | 'REJECTED';
export type VariableType = 'text' | 'textarea' | 'number' | 'select';

export interface PageResult<T> {
  records?: T[];
  list?: T[];
  content?: T[];
  total?: number;
  size?: number;
  current?: number;
  page?: number;
  pages?: number;
}

export interface User {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  role: Role;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  userId?: number;
  id?: number;
  username: string;
  nickname?: string;
  role: Role;
}

export interface SkillCategory {
  id: number;
  name: string;
  description?: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface SkillVariable {
  id?: number;
  skillId?: number;
  name: string;
  label: string;
  type: VariableType;
  required: boolean;
  defaultValue?: string;
  options?: string[] | string;
  optionsJson?: string;
  sortOrder?: number;
}

export interface Skill {
  id: number;
  title: string;
  intro: string;
  promptTemplate?: string;
  outputFormat?: string;
  usageExamples?: string;
  examples?: string;
  categoryId?: number;
  categoryName?: string;
  authorId?: number;
  authorName?: string;
  modelType?: string;
  status?: SkillStatus;
  usageCount?: number;
  favoriteCount?: number;
  avgRating?: number;
  averageRating?: number;
  reviewCount?: number;
  variables?: SkillVariable[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillFormValues {
  title: string;
  intro: string;
  promptTemplate: string;
  outputFormat?: string;
  usageExamples?: string;
  categoryId?: number | null;
  modelType?: string;
  variables: Array<SkillVariable & { options?: string[] }>;
}

export interface PromptGenerateResponse {
  renderedPrompt: string;
  prompt?: string;
}

export interface UsageLog {
  id: number;
  skillId: number;
  skillTitle?: string;
  renderedPrompt: string;
  variableValuesJson?: string;
  variableValues?: Record<string, unknown> | string;
  createdAt?: string;
}

export interface ReviewForm {
  rating: number;
  comment?: string;
}

export interface AdminStats {
  userCount?: number;
  totalUsers?: number;
  skillCount?: number;
  totalSkills?: number;
  pendingCount?: number;
  pendingAuditCount?: number;
  pendingAudit?: number;
  publishedCount?: number;
  publishedSkills?: number;
}

export interface AuditLog {
  id: number;
  adminId?: number;
  adminName?: string;
  targetType?: string;
  targetId?: number;
  targetTitle?: string;
  action: string;
  detail?: string;
  createdAt?: string;
}
