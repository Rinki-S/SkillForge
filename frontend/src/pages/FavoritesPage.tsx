import { Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { engagementApi, skillApi } from '../api/client';
import { EmptyState, ErrorState, LoadingState } from '../components/states/QueryStates';
import { MetaPill, PageHeader, ResourcePanel, ResourceRow } from '../components/ui/Console';
import { getPageItems, formatDateTime } from '../lib/utils';

export function FavoritesPage() {
  const favoritesQuery = useQuery({ queryKey: ['favorites'], queryFn: () => engagementApi.favorites({ page: 1, size: 50 }) });
  const favorites = getPageItems(favoritesQuery.data);
  const skillQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ['favorite-skill', favorite.skillId],
      queryFn: () => skillApi.detail(favorite.skillId),
      enabled: Boolean(favorite.skillId),
      retry: false,
    })),
  });

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="已保存资源"
        title="我的收藏"
        description="把常用技能保存在提示词工作流附近。"
      />
      {favoritesQuery.isLoading ? <LoadingState /> : null}
      {favoritesQuery.isError ? <ErrorState error={favoritesQuery.error} onRetry={() => favoritesQuery.refetch()} /> : null}
      {!favoritesQuery.isLoading && favorites.length === 0 ? <EmptyState title="暂无收藏" description="在技能详情页点击收藏，即可把常用资源加入这里。" /> : null}

      {favorites.length > 0 ? (
        <ResourcePanel>
          {favorites.map((favorite, index) => {
            const skill = skillQueries[index]?.data;
            return (
              <Link key={favorite.id} to={`/skills/public/${favorite.skillId}`} className="block focus:outline-none focus:ring-2 focus:ring-console-orange/25">
                <ResourceRow className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_120px] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-semibold text-console-ink">{skill?.title || `技能 #${favorite.skillId}`}</h2>
                      <ArrowUpRight className="h-4 w-4 text-console-muted" />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-console-muted">{skill?.intro || '点击查看详情'}</p>
                    <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
                      <MetaPill>{skill?.modelType || '通用'}</MetaPill>
                      <MetaPill>{skill?.categoryName || '未分类'}</MetaPill>
                    </div>
                  </div>
                  <span className="text-sm text-console-muted">收藏于 {formatDateTime(favorite.createdAt)}</span>
                  <span className="hidden font-mono text-xs text-console-muted lg:block">{skill?.modelType || '通用'}</span>
                </ResourceRow>
              </Link>
            );
          })}
        </ResourcePanel>
      ) : null}
    </div>
  );
}
