import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Trash2, X, ArrowDownCircle } from 'lucide-react';
import { adminApi, skillApi } from '../api/client';
import { getErrorMessage } from '../api/http';
import { EmptyState, ErrorState, LoadingState } from '../components/states/QueryStates';
import { Button } from '../components/ui/Button';
import { CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { MetricTile, PageHeader, ResourcePanel, ResourceRow, StatusBadge } from '../components/ui/Console';
import { auditActionLabels, formatDateTime, getPageItems, roleLabels, statusLabels, targetTypeLabels } from '../lib/utils';

const actions = [
  { action: 'approve', label: '通过', icon: Check, variant: 'primary' as const },
  { action: 'reject', label: '拒绝', icon: X, variant: 'secondary' as const },
  { action: 'offline', label: '下架', icon: ArrowDownCircle, variant: 'secondary' as const },
  { action: 'delete', label: '删除', icon: Trash2, variant: 'danger' as const },
];

export function AdminPage() {
  const [status, setStatus] = useState('PENDING');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const queryClient = useQueryClient();

  const statsQuery = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.stats });
  const skillsQuery = useQuery({ queryKey: ['admin-skills', status], queryFn: () => adminApi.skills({ status: status || undefined, page: 1, size: 50 }) });
  const usersQuery = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.users({ page: 1, size: 20 }) });
  const logsQuery = useQuery({ queryKey: ['admin-logs'], queryFn: () => adminApi.auditLogs({ page: 1, size: 20 }) });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: skillApi.categories });

  const auditMutation = useMutation({
    mutationFn: ({ skillId, action }: { skillId: number; action: string }) => adminApi.auditAction(skillId, action, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-logs'] });
    },
    onError: (error) => alert(getErrorMessage(error)),
  });

  const createCategoryMutation = useMutation({
    mutationFn: () => adminApi.createCategory({ name: categoryName, description: categoryDescription }),
    onSuccess: () => {
      setCategoryName('');
      setCategoryDescription('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => alert(getErrorMessage(error)),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (error) => alert(getErrorMessage(error)),
  });

  const stats = statsQuery.data;
  const statCards = [
    { label: '用户数', value: stats?.totalUsers ?? stats?.userCount ?? 0 },
    { label: '技能数', value: stats?.totalSkills ?? stats?.skillCount ?? 0 },
    { label: '待审核', value: stats?.pendingAudit ?? stats?.pendingAuditCount ?? stats?.pendingCount ?? 0 },
    { label: '已发布', value: stats?.publishedSkills ?? stats?.publishedCount ?? 0 },
  ];
  const skills = getPageItems(skillsQuery.data);
  const users = getPageItems(usersQuery.data);
  const logs = getPageItems(logsQuery.data);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="管理控制台"
        title="管理员后台"
        description="审核已提交的技能，管理分类和用户，并查看审核历史。"
        meta={
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => (
              <MetricTile key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        }
      />

      <ResourcePanel>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-console-line p-4">
          <div>
            <p className="sf-kicker">审核队列</p>
            <CardTitle className="mt-1">技能审核</CardTitle>
          </div>
          <Select
            className="w-48"
            label="状态"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { label: '全部', value: '' },
              { label: '待审核', value: 'PENDING' },
              { label: '已发布', value: 'PUBLISHED' },
              { label: '已下架', value: 'OFFLINE' },
              { label: '已拒绝', value: 'REJECTED' },
            ]}
          />
        </div>
        {skillsQuery.isLoading ? <div className="p-4"><LoadingState /></div> : null}
        {skillsQuery.isError ? <div className="p-4"><ErrorState error={skillsQuery.error} onRetry={() => skillsQuery.refetch()} /></div> : null}
        {!skillsQuery.isLoading && skills.length === 0 ? <div className="p-4"><EmptyState title="暂无待处理技能" /></div> : null}
        {skills.length > 0 ? (
          <div>
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_260px] gap-4 border-b border-console-line bg-console-subtle/50 px-4 py-2 text-xs font-semibold text-console-muted lg:grid">
              <span>技能</span>
              <span>状态</span>
              <span>操作</span>
            </div>
            {skills.map((skill) => (
              <ResourceRow key={skill.id} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_120px_260px] lg:items-center lg:gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-console-ink">{skill.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-console-muted">{skill.intro}</p>
                  <div className="mt-3 lg:hidden">
                    <StatusBadge status={skill.status}>{statusLabels[skill.status || ''] || skill.status}</StatusBadge>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <StatusBadge status={skill.status}>{statusLabels[skill.status || ''] || skill.status}</StatusBadge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {actions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.action}
                        type="button"
                        size="sm"
                        variant={item.variant}
                        onClick={() => {
                          if (confirm(`确认${item.label}该技能？`)) auditMutation.mutate({ skillId: skill.id, action: item.action });
                        }}
                      >
                        <Icon className="h-4 w-4" /> {item.label}
                      </Button>
                    );
                  })}
                </div>
              </ResourceRow>
            ))}
          </div>
        ) : null}
      </ResourcePanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <ResourcePanel>
          <div className="sf-panel-header">
            <p className="sf-kicker">分类体系</p>
            <CardTitle className="mt-1">分类管理</CardTitle>
          </div>
          <div className="grid gap-3 border-b border-console-line p-4 md:grid-cols-[1fr_1fr_auto]">
            <Input label="分类" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            <Input label="描述" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} />
            <div className="flex items-end">
              <Button type="button" disabled={!categoryName || createCategoryMutation.isPending} onClick={() => createCategoryMutation.mutate()}>
                新增
              </Button>
            </div>
          </div>
          <div>
            {(categoriesQuery.data ?? []).map((category) => (
              <ResourceRow key={category.id} className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-medium text-console-ink">{category.name}</span>
                  {category.description ? <p className="text-sm text-console-muted">{category.description}</p> : null}
                </div>
                <Button type="button" variant="danger" size="sm" onClick={() => deleteCategoryMutation.mutate(category.id)}>
                  删除
                </Button>
              </ResourceRow>
            ))}
            {(categoriesQuery.data ?? []).length === 0 ? <div className="p-4 text-sm text-console-muted">暂无分类</div> : null}
          </div>
        </ResourcePanel>

        <ResourcePanel>
          <div className="sf-panel-header">
            <p className="sf-kicker">账号</p>
            <CardTitle className="mt-1">用户管理</CardTitle>
          </div>
          <div>
            {users.map((user) => (
              <ResourceRow key={user.id} className="flex items-center justify-between gap-3">
                <span className="font-medium text-console-ink">{user.nickname || user.username}</span>
                <span className="rounded-full border border-console-line bg-console-subtle px-2 py-1 text-xs text-console-muted">
                  {roleLabels[user.role] || user.role}
                </span>
              </ResourceRow>
            ))}
            {users.length === 0 ? <div className="p-4 text-sm text-console-muted">暂无用户</div> : null}
          </div>
        </ResourcePanel>
      </div>

      <ResourcePanel>
        <div className="sf-panel-header">
          <p className="sf-kicker">操作历史</p>
          <CardTitle className="mt-1">审核日志</CardTitle>
        </div>
        <div>
          {logs.map((log) => (
            <ResourceRow key={log.id}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-console-muted">
                <span className="font-semibold text-console-ink">{log.adminName || `管理员 #${log.adminId}`}</span>
                <span>对</span>
                <span>{log.targetTitle || `${targetTypeLabels[log.targetType || ''] || log.targetType} #${log.targetId}`}</span>
                <span>执行</span>
                <span className="font-semibold text-console-ink">{auditActionLabels[log.action] || log.action}</span>
                <span>{formatDateTime(log.createdAt)}</span>
              </div>
              {log.detail ? <p className="mt-1 text-sm text-console-muted">备注：{log.detail}</p> : null}
            </ResourceRow>
          ))}
          {logs.length === 0 ? <div className="p-4 text-sm text-console-muted">暂无日志</div> : null}
        </div>
      </ResourcePanel>
    </div>
  );
}
