import * as React from 'react';
import { LayerCard } from '@cloudflare/kumo/components/layer-card';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <LayerCard className={cn('border border-console-line p-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-base font-semibold text-console-ink', className)} {...props} />;
}
