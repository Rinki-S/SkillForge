import { useQuery } from '@tanstack/react-query';
import { engagementApi } from '../api/client';
import { EmptyState, ErrorState, LoadingState } from '../components/states/QueryStates';
import { PageHeader, ResourcePanel, ResourceRow } from '../components/ui/Console';
import { formatDateTime, getPageItems } from '../lib/utils';

export function UsageLogsPage() {
  const query = useQuery({ queryKey: ['usage-logs'], queryFn: () => engagementApi.usageLogs({ page: 1, size: 50 }) });
  const logs = getPageItems(query.data);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="提示词历史"
        title="使用记录"
        description="每次成功生成都会保存为一条操作记录，并包含渲染后的提示词输出。"
      />
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState error={query.error} onRetry={() => query.refetch()} /> : null}
      {!query.isLoading && logs.length === 0 ? <EmptyState title="暂无使用记录" description="打开一个技能并生成提示词后，记录会自动出现在这里。" /> : null}

      {logs.length > 0 ? (
        <ResourcePanel>
          {logs.map((log) => (
            <ResourceRow key={log.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-console-ink">{log.skillTitle || `技能 #${log.skillId}`}</h2>
                  <p className="mt-1 text-xs font-medium text-console-muted">已生成提示词</p>
                </div>
                <span className="text-sm text-console-muted">{formatDateTime(log.createdAt)}</span>
              </div>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-console-line bg-console-subtle p-3 font-mono text-xs leading-6 text-console-ink">
                {log.renderedPrompt}
              </pre>
            </ResourceRow>
          ))}
        </ResourcePanel>
      ) : null}
    </div>
  );
}
