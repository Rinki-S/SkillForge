import * as React from 'react';
import { Badge } from '@cloudflare/kumo/components/badge';
import { LayerCard } from '@cloudflare/kumo/components/layer-card';
import { cn } from '../../lib/utils';

// Console primitives are local SkillForge compositions built on Kumo surfaces
// (LayerCard) and Kumo Badge. We intentionally did NOT install Kumo CLI blocks
// (PageHeader / ResourceList): those are copy-paste source you then own, and our
// header/resource layout is already tailored to SkillForge pages and the custom
// Prompt Rail. Keeping these as thin local compositions over Kumo primitives
// avoids forking block source while still rendering on the Kumo design system.

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, meta, className }: PageHeaderProps) {
  return (
    <LayerCard className={cn('border border-console-line p-0', className)}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="sf-kicker">{eyebrow}</p> : null}
          <h1 className="mt-1 text-2xl font-semibold text-console-ink">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-console-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {meta ? <div className="border-t border-console-line bg-console-subtle/45 px-4 py-3">{meta}</div> : null}
    </LayerCard>
  );
}

interface MetricTileProps {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  className?: string;
}

export function MetricTile({ label, value, detail, className }: MetricTileProps) {
  return (
    <div className={cn('rounded-md border border-console-line bg-white px-3 py-2', className)}>
      <p className="sf-kicker">{label}</p>
      <div className="mt-1 text-xl font-semibold tabular-nums text-console-ink">{value}</div>
      {detail ? <div className="mt-1 text-xs text-console-muted">{detail}</div> : null}
    </div>
  );
}

// Map SkillForge skill statuses onto Kumo Badge variants.
const statusVariant: Record<string, 'success' | 'warning' | 'secondary' | 'error'> = {
  PUBLISHED: 'success',
  PENDING: 'warning',
  OFFLINE: 'secondary',
  REJECTED: 'error',
};

export function StatusBadge({ status, children }: { status?: string; children?: React.ReactNode }) {
  return <Badge variant={statusVariant[status || ''] || 'secondary'}>{children || status || '未知'}</Badge>;
}

export function MetaPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-console-line bg-white px-2.5 py-1 text-xs font-medium text-console-muted', className)}>
      {children}
    </span>
  );
}

export function ResourcePanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <LayerCard className={cn('overflow-hidden border border-console-line p-0', className)} {...props} />;
}

export function ResourceRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('sf-resource-row', className)} {...props} />;
}
