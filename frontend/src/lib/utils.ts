import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPageItems<T>(data: T[] | { records?: T[]; list?: T[]; content?: T[] } | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.records ?? data.list ?? data.content ?? [];
}

export function formatDateTime(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function parseOptions(options?: string[] | string) {
  if (!options) return [];
  if (Array.isArray(options)) return options;
  try {
    const parsed = JSON.parse(options);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // fall through
  }
  return options
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function extractTemplateVariables(template: string) {
  const matches = template.matchAll(/{{\s*(\w+)\s*}}/g);
  return Array.from(new Set(Array.from(matches, (match) => match[1])));
}

export function renderPromptPreview(template: string, values: Record<string, unknown>) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, name: string) => {
    const value = values[name];
    return value === undefined || value === null || value === '' ? `{{${name}}}` : String(value);
  });
}

export const statusLabels: Record<string, string> = {
  PENDING: '待审核',
  PUBLISHED: '已发布',
  OFFLINE: '已下架',
  REJECTED: '已拒绝',
};

export const roleLabels: Record<string, string> = {
  ADMIN: '管理员',
  USER: '用户',
};

export const auditActionLabels: Record<string, string> = {
  approve: '通过',
  reject: '拒绝',
  offline: '下架',
  delete: '删除',
  create_category: '创建分类',
  update_category: '更新分类',
  delete_category: '删除分类',
};

export const targetTypeLabels: Record<string, string> = {
  skill: '技能',
  category: '分类',
  user: '用户',
};

export const modelTypes = ['GPT', 'Claude', 'Gemini', '通用'];
