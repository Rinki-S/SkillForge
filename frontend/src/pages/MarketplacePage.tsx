import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, PlusCircle, Search, Star } from 'lucide-react';
import { skillApi } from '../api/client';
import { EmptyState, ErrorState, LoadingState } from '../components/states/QueryStates';
import { Button } from '../components/ui/Button';
import { PageHeader, ResourcePanel, ResourceRow, MetaPill, MetricTile } from '../components/ui/Console';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { getPageItems, modelTypes } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function MarketplacePage() {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [modelType, setModelType] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: skillApi.categories });
  const skillsQuery = useQuery({
    queryKey: ['marketplace', keyword, categoryId, modelType],
    queryFn: () =>
      skillApi.marketplace({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        modelType: modelType || undefined,
        page: 1,
        size: 20,
      }),
  });

  const skills = useMemo(() => getPageItems(skillsQuery.data), [skillsQuery.data]);
  const modelCount = new Set(skills.map((skill) => skill.modelType).filter(Boolean)).size;
  const totalUsage = skills.reduce((total, skill) => total + (skill.usageCount ?? 0), 0);
  const avgRating = skills.length
    ? (skills.reduce((total, skill) => total + Number(skill.avgRating ?? skill.averageRating ?? 0), 0) / skills.length).toFixed(1)
    : '-';

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="技能目录"
        title="技能市场"
        description="浏览已发布的提示词技能，对比运行数据，并打开技能生成受控提示词。"
        actions={
          isAuthenticated ? (
            <Button type="button" onClick={() => navigate('/skills/new')}>
              <PlusCircle className="h-4 w-4" /> 创建技能
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={() => navigate('/login')}>
              登录后创建
            </Button>
          )
        }
        meta={
          <div className="grid gap-2 sm:grid-cols-3">
            <MetricTile label="已发布技能" value={skills.length} />
            <MetricTile label="当前模型数" value={modelCount || '-'} />
            <MetricTile label="总使用量" value={totalUsage} detail={avgRating !== '-' ? `平均评分 ${avgRating}` : '暂无评分'} />
          </div>
        }
      />

      <ResourcePanel>
        <div className="grid gap-3 p-4 lg:grid-cols-[1fr_220px_180px_auto]">
          <Input
            label="搜索"
            placeholder="搜索标题或简介"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            label="分类"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            options={(categoriesQuery.data ?? []).map((category) => ({ label: category.name, value: String(category.id) }))}
          />
          <Select
            label="模型"
            value={modelType}
            onChange={(event) => setModelType(event.target.value)}
            options={modelTypes.map((type) => ({ label: type, value: type }))}
          />
          <div className="flex items-end">
            <Button type="button" variant="secondary" className="w-full" onClick={() => skillsQuery.refetch()}>
              <Search className="h-4 w-4" /> 搜索
            </Button>
          </div>
        </div>
      </ResourcePanel>

      {skillsQuery.isLoading ? <LoadingState /> : null}
      {skillsQuery.isError ? <ErrorState error={skillsQuery.error} onRetry={() => skillsQuery.refetch()} /> : null}
      {!skillsQuery.isLoading && !skillsQuery.isError && skills.length === 0 ? (
        <EmptyState title="暂无已发布技能" description="请尝试其他筛选条件，或登录后创建第一个待审核技能。" />
      ) : null}

      {skills.length > 0 ? (
        <ResourcePanel>
          <div className="hidden grid-cols-[minmax(0,1.7fr)_130px_150px_90px_90px_90px] gap-4 border-b border-console-line bg-console-subtle/50 px-4 py-2 text-xs font-semibold text-console-muted lg:grid">
            <span>技能</span>
            <span>模型</span>
            <span>分类</span>
            <span>使用量</span>
            <span>收藏数</span>
            <span>评分</span>
          </div>
          {skills.map((skill) => (
            <Link key={skill.id} to={`/skills/public/${skill.id}`} className="block focus:outline-none focus:ring-2 focus:ring-console-orange/25">
              <ResourceRow className="grid gap-3 lg:grid-cols-[minmax(0,1.7fr)_130px_150px_90px_90px_90px] lg:items-center lg:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-semibold text-console-ink">{skill.title}</h2>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-console-muted" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-console-muted">{skill.intro}</p>
                  <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
                    <MetaPill>{skill.modelType || '通用'}</MetaPill>
                    <MetaPill>{skill.categoryName || '未分类'}</MetaPill>
                    <MetaPill>作者 {skill.authorName || '-'}</MetaPill>
                  </div>
                </div>
                <span className="hidden font-mono text-xs text-console-muted lg:block">{skill.modelType || '通用'}</span>
                <span className="hidden text-sm text-console-muted lg:block">{skill.categoryName || '未分类'}</span>
                <span className="text-sm tabular-nums text-console-muted max-lg:hidden">{skill.usageCount ?? 0}</span>
                <span className="text-sm tabular-nums text-console-muted max-lg:hidden">{skill.favoriteCount ?? 0}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-console-ink max-lg:mt-1">
                  <Star className="h-4 w-4 fill-console-orange text-console-orange" /> {skill.avgRating ?? skill.averageRating ?? '-'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-console-muted lg:hidden">
                  <span>使用量 {skill.usageCount ?? 0}</span>
                  <span>收藏数 {skill.favoriteCount ?? 0}</span>
                </div>
              </ResourceRow>
            </Link>
          ))}
        </ResourcePanel>
      ) : null}
    </div>
  );
}
