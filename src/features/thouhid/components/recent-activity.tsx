import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import type { Call, CallOutcome } from '@/types/thouhid';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const OUTCOME_META: Record<CallOutcome, { label: string; badge: BadgeVariant }> = {
  lead: { label: 'Lead', badge: 'default' },
  appointment: { label: 'Appointment', badge: 'default' },
  message: { label: 'Message', badge: 'secondary' },
  spam: { label: 'Spam', badge: 'outline' },
  failed: { label: 'Failed', badge: 'destructive' }
};

/** Fixed, locale-independent timestamp to avoid SSR/client hydration drift. */
function formatWhen(isoValue: string): string {
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return '';
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${months[d.getMonth()]} ${d.getDate()}, ${h12}:${mm} ${ampm}`;
}

/** Duration as m:ss; em dash when absent (e.g. failed call that never connected). */
function formatDuration(seconds?: number): string {
  if (seconds == null || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function RecentActivity({ calls }: { calls: Call[] }) {
  const recent = [...calls]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Recent activity</CardTitle>
        <Link
          href='/dashboard/calls'
          className='text-muted-foreground hover:text-foreground text-xs transition-colors'
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className='text-muted-foreground text-sm'>No recent calls.</div>
        ) : (
          <div className='flex flex-col divide-y'>
            {recent.map((call) => {
              const meta = OUTCOME_META[call.outcome];
              return (
                <div key={call.id} className='flex items-center justify-between gap-3 py-2.5'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <Icons.phone className='text-muted-foreground h-4 w-4 shrink-0' aria-hidden />
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>
                        {call.callerName ?? 'Unknown caller'}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {formatWhen(call.receivedAt)} · {formatDuration(call.durationSeconds)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
