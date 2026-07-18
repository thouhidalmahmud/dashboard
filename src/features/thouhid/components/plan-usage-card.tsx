import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usagePercent, usageThresholds } from '@/features/thouhid/lib/derive';
import { PLAN_TIERS } from '@/config/thouhid-plans';
import type { PlanUsage } from '@/types/thouhid';

export function PlanUsageCard({ usage }: { usage: PlanUsage }) {
  const pct = usagePercent(usage);
  const { noticeReached, actionReached } = usageThresholds(usage);
  const tierLabel = PLAN_TIERS[usage.tier].label;
  const clamped = Math.min(100, Math.round(pct));

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Plan usage</CardTitle>
        <span className='text-muted-foreground text-xs'>{tierLabel} plan</span>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-baseline justify-between'>
          <span className='text-sm font-medium tabular-nums'>
            {usage.minutesUsed} / {usage.minuteAllowance} min
          </span>
          <span className='text-muted-foreground text-xs tabular-nums'>{clamped}%</span>
        </div>

        <Progress value={clamped} />

        {actionReached ? (
          <div className='flex items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3'>
            <p className='text-sm'>
              You&apos;ve used {clamped}% of your minutes. Add minutes to avoid interruptions.
            </p>
            <Link
              href='/dashboard/billing'
              className='text-sm font-medium whitespace-nowrap underline underline-offset-4'
            >
              Add minutes
            </Link>
          </div>
        ) : noticeReached ? (
          <p className='text-muted-foreground text-sm'>
            You&apos;ve used {clamped}% of your included minutes this period.
          </p>
        ) : (
          <p className='text-muted-foreground text-sm'>
            You&apos;re well within your plan this period.
          </p>
        )}

        {(usage.extraNumbers > 0 || usage.extraLocations > 0) && (
          <p className='text-muted-foreground text-xs'>
            {usage.extraNumbers} extra number{usage.extraNumbers === 1 ? '' : 's'} ·{' '}
            {usage.extraLocations} extra location{usage.extraLocations === 1 ? '' : 's'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
