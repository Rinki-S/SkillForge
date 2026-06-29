import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Heart, History, Sparkles } from 'lucide-react';
import { userApi } from '../api/client';
import { ErrorState, LoadingState } from '../components/states/QueryStates';
import { CardTitle } from '../components/ui/Card';
import { MetaPill, PageHeader, ResourcePanel, ResourceRow } from '../components/ui/Console';
import { formatDateTime, roleLabels } from '../lib/utils';

const entries = [
  { to: '/my-skills', label: '我的技能', icon: Sparkles, desc: '管理我创建的模板' },
  { to: '/favorites', label: '我的收藏', icon: Heart, desc: '查看收藏的技能' },
  { to: '/usage-logs', label: '使用记录', icon: History, desc: '回看生成过的提示词' },
  { to: '/', label: '技能广场', icon: BookOpen, desc: '发现更多能力模板' },
];

export function ProfilePage() {
  const query = useQuery({ queryKey: ['profile'], queryFn: userApi.profile });

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;

  const user = query.data;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="账号"
        title="个人中心"
        description="查看个人资料，并快速回到技能资源。"
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-console-line bg-console-orangeSoft text-xl font-semibold text-brand-700">
              {(user?.nickname || user?.username || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-console-ink">{user?.nickname || user?.username}</h1>
              <div className="mt-1 flex flex-wrap gap-2">
                <MetaPill>角色 {roleLabels[user?.role || ''] || user?.role}</MetaPill>
                <MetaPill>加入时间 {formatDateTime(user?.createdAt)}</MetaPill>
              </div>
            </div>
          </div>
        }
      />

      <ResourcePanel>
        <div className="sf-panel-header">
          <p className="sf-kicker">控制台入口</p>
          <CardTitle className="mt-1">常用入口</CardTitle>
        </div>
        <div className="grid divide-console-line md:grid-cols-2 xl:grid-cols-4 xl:divide-x">
          {entries.map((entry) => {
            const Icon = entry.icon;
            return (
              <Link key={entry.to} to={entry.to} className="block focus:outline-none focus:ring-2 focus:ring-console-orange/25">
                <ResourceRow className="h-full border-b md:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0">
                  <Icon className="mb-4 h-6 w-6 text-console-orange" />
                  <h2 className="font-semibold text-console-ink">{entry.label}</h2>
                  <p className="mt-1 text-sm leading-6 text-console-muted">{entry.desc}</p>
                </ResourceRow>
              </Link>
            );
          })}
        </div>
      </ResourcePanel>
    </div>
  );
}
