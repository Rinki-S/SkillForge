import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { skillApi } from '../api/client';
import { getErrorMessage } from '../api/http';
import { EmptyState, ErrorState, LoadingState } from '../components/states/QueryStates';
import { Button } from '../components/ui/Button';
import { MetaPill, PageHeader, ResourcePanel, ResourceRow, StatusBadge } from '../components/ui/Console';
import { getPageItems, statusLabels } from '../lib/utils';

export function MySkillsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const skillsQuery = useQuery({ queryKey: ['my-skills'], queryFn: () => skillApi.mySkills({ page: 1, size: 50 }) });
  const removeMutation = useMutation({
    mutationFn: (id: number) => skillApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-skills'] }),
    onError: (error) => alert(getErrorMessage(error)),
  });
  const skills = getPageItems(skillsQuery.data);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="创作者工作台"
        title="我的技能"
        description="跟踪我创建的每个技能在审核、发布、下架和拒绝状态中的变化。"
        actions={
          <Button type="button" onClick={() => navigate('/skills/new')}>
            <Plus className="h-4 w-4" /> 创建技能
          </Button>
        }
      />

      {skillsQuery.isLoading ? <LoadingState /> : null}
      {skillsQuery.isError ? <ErrorState error={skillsQuery.error} onRetry={() => skillsQuery.refetch()} /> : null}
      {!skillsQuery.isLoading && skills.length === 0 ? <EmptyState title="还没有技能" description="创建一个模板，提交管理员审核后即可发布到目录。" /> : null}

      {skills.length > 0 ? (
        <ResourcePanel>
          <div className="hidden grid-cols-[minmax(0,1fr)_120px_120px_220px] gap-4 border-b border-console-line bg-console-subtle/50 px-4 py-2 text-xs font-semibold text-console-muted lg:grid">
            <span>技能</span>
            <span>状态</span>
            <span>模型</span>
            <span>操作</span>
          </div>
          {skills.map((skill) => (
            <ResourceRow key={skill.id} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_120px_120px_220px] lg:items-center lg:gap-4">
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-console-ink">{skill.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-console-muted">{skill.intro}</p>
                <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
                  <StatusBadge status={skill.status}>{statusLabels[skill.status || ''] || skill.status}</StatusBadge>
                  <MetaPill>{skill.modelType || '通用'}</MetaPill>
                  <MetaPill>{skill.categoryName || '未分类'}</MetaPill>
                </div>
              </div>
              <div className="hidden lg:block">
                <StatusBadge status={skill.status}>{statusLabels[skill.status || ''] || skill.status}</StatusBadge>
              </div>
              <span className="hidden font-mono text-xs text-console-muted lg:block">{skill.modelType || '通用'}</span>
              <div className="flex flex-wrap gap-2">
                <Link to={`/skills/public/${skill.id}`}>
                  <Button type="button" variant="secondary" size="sm">查看</Button>
                </Link>
                <Link to={`/skills/${skill.id}/edit`}>
                  <Button type="button" variant="secondary" size="sm"><Edit className="h-4 w-4" /> 编辑</Button>
                </Link>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm('确认删除该技能？')) removeMutation.mutate(skill.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> 删除
                </Button>
              </div>
            </ResourceRow>
          ))}
        </ResourcePanel>
      ) : null}
    </div>
  );
}
