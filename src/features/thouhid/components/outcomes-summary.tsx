import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callsProtected } from '@/features/thouhid/lib/derive';
import type { Appointment, Call, Lead } from '@/types/thouhid';

function Metric({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className='flex flex-col gap-1 rounded-lg border p-4'>
      <span className='text-2xl font-semibold tabular-nums'>{value}</span>
      <span className='text-sm font-medium'>{label}</span>
      {hint && <span className='text-muted-foreground text-xs'>{hint}</span>}
    </div>
  );
}

export function OutcomesSummary({
  calls,
  leads,
  appointments
}: {
  calls: Call[];
  leads: Lead[];
  appointments: Appointment[];
}) {
  const confirmedAppointments = appointments.filter((a) => a.confirmed).length;
  const protectedCount = callsProtected(calls);
  const failedCount = calls.filter((c) => c.outcome === 'failed').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <Metric label='Leads' value={leads.length} />
          <Metric label='Appointments' value={confirmedAppointments} hint='Confirmed' />
          <Metric label='Calls protected' value={protectedCount} hint='Answered for you' />
          <Metric label='Failed calls' value={failedCount} hint='Not completed' />
        </div>
      </CardContent>
    </Card>
  );
}
