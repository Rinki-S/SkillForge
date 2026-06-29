import { AlertCircle } from 'lucide-react';
import { Loader } from '@cloudflare/kumo/components/loader';
import { Empty } from '@cloudflare/kumo/components/empty';
import { getErrorMessage } from '../../api/http';
import { Button } from '../ui/Button';

export function LoadingState({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-console-line bg-console-panel p-8 text-console-muted">
      <Loader size="sm" />
      <span>{text}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5" />
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">加载失败</h3>
            <p className="text-sm">{getErrorMessage(error)}</p>
          </div>
          {onRetry ? (
            <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
              重试
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title = '暂无数据', description }: { title?: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-console-line bg-console-panel">
      <Empty size="sm" title={title} description={description} />
    </div>
  );
}
