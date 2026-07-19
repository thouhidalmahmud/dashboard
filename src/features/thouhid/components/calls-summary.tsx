import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Call } from '@/types/thouhid';

function Metric({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className='flex flex-col gap-1 rounded-lg border p-4'>
      <span className='text-2xl font-semibold tabular-nums'>{value}</span>
      <span className='text-sm font-medium'>{label}</span>
      {hint && <span className='text-muted-foreground text-xs'>{hint}</span>}
    </div>
  );
}

export function CallsSummary({ calls }: { calls: Call[] }) {
  const total = calls.length;
  const leads = calls.filter((c) => c.outcome === 'lead').length;
  const appointments = calls.filter((c) => c.outcome === 'appointment').length;
  const failed = calls.filter((c) => c.outcome === 'failed').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <Metric label='Total calls' value={total} />
          <Metric label='Leads captured' value={leads} hint='Left contact info' />
          <Metric label='Appointments' value={appointments} hint='Confirmed' />
          <Metric label='Failed calls' value={failed} hint='Not completed' />
        </div>
      </CardContent>
    </Card>
  );
}
