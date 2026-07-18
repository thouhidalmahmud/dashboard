import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ServiceStatus, ServiceStatusLevel } from '@/types/thouhid';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const STATUS_META: Record<ServiceStatusLevel, { label: string; badge: BadgeVariant; dot: string }> =
  {
    operational: {
      label: 'All calls are covered',
      badge: 'default',
      dot: 'bg-emerald-500'
    },
    degraded: {
      label: 'Service degraded',
      badge: 'secondary',
      dot: 'bg-amber-500'
    },
    disconnected: {
      label: 'Service disconnected',
      badge: 'destructive',
      dot: 'bg-red-500'
    },
    unavailable: {
      label: 'Status unavailable',
      badge: 'outline',
      dot: 'bg-muted-foreground'
    }
  };

function formatSince(isoValue: string): string {
  const d = new Date(isoValue);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function ServiceStatusCard({ status }: { status: ServiceStatus }) {
  const meta = STATUS_META[status.level];
  const since = formatSince(status.since);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden />
          Service status
        </CardTitle>
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </CardHeader>
      <CardContent className='text-muted-foreground text-sm'>
        {status.level === 'operational' ? (
          <p>Your existing number is answering calls normally.</p>
        ) : (
          <p>{status.reason ?? 'We are looking into this.'}</p>
        )}
        {since && <p className='mt-1 text-xs'>Since {since}</p>}
      </CardContent>
    </Card>
  );
}
