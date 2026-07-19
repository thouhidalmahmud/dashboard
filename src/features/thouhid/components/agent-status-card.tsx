import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ServiceStatus, ServiceStatusLevel, SubscriberControlLevel } from '@/types/thouhid';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const STATUS_META: Record<ServiceStatusLevel, { label: string; badge: BadgeVariant; dot: string }> =
  {
    operational: { label: 'Answering calls', badge: 'default', dot: 'bg-emerald-500' },
    degraded: { label: 'Service degraded', badge: 'secondary', dot: 'bg-amber-500' },
    disconnected: { label: 'Disconnected', badge: 'destructive', dot: 'bg-red-500' },
    unavailable: { label: 'Status unavailable', badge: 'outline', dot: 'bg-muted-foreground' }
  };

const CONTROL_LABEL: Record<SubscriberControlLevel, string> = {
  direct: 'Direct — you manage everything',
  guided: 'Guided — THOUHID assisted',
  thouhid_managed: 'THOUHID managed — fully handled for you'
};

export function AgentStatusCard({
  status,
  controlLevel
}: {
  status: ServiceStatus;
  controlLevel: SubscriberControlLevel;
}) {
  const meta = STATUS_META[status.level];

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden />
          Agent status
        </CardTitle>
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {status.level !== 'operational' && (
          <p className='text-muted-foreground text-sm'>
            {status.reason ?? 'We are looking into this.'}
          </p>
        )}
        {status.level === 'operational' && (
          <p className='text-muted-foreground text-sm'>
            Your agent is active and answering calls on your behalf.
          </p>
        )}
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-xs'>Control level:</span>
          <span className='text-xs font-medium'>{CONTROL_LABEL[controlLevel]}</span>
        </div>
      </CardContent>
    </Card>
  );
}
