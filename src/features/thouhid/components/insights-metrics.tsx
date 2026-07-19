import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { billableMinutes, callsProtected } from '@/features/thouhid/lib/derive';
import type { Appointment, Call, Lead, PlanUsage } from '@/types/thouhid';

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className='flex flex-col gap-1 rounded-lg border p-4'>
      <span className='text-2xl font-semibold tabular-nums'>{value}</span>
      <span className='text-sm font-medium'>{label}</span>
      {hint && <span className='text-muted-foreground text-xs'>{hint}</span>}
    </div>
  );
}

export function InsightsMetrics({
  calls,
  leads,
  appointments,
  usage
}: {
  calls: Call[];
  leads: Lead[];
  appointments: Appointment[];
  usage: PlanUsage;
}) {
  const totalMinutes = calls.reduce((sum, c) => sum + billableMinutes(c), 0);
  const protected_ = callsProtected(calls);
  const confirmed = appointments.filter((a) => a.confirmed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Key metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
          <Metric label='Total calls' value={calls.length} />
          <Metric label='Minutes used' value={totalMinutes} hint='Billable this period' />
          <Metric label='Calls protected' value={protected_} hint='Answered for you' />
          <Metric label='Leads captured' value={leads.length} />
          <Metric label='Appointments' value={confirmed} hint='Confirmed' />
        </div>
      </CardContent>
    </Card>
  );
}
