import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Appointment, Lead } from '@/types/thouhid';

function Metric({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className='flex flex-col gap-1 rounded-lg border p-4'>
      <span className='text-2xl font-semibold tabular-nums'>{value}</span>
      <span className='text-sm font-medium'>{label}</span>
      {hint && <span className='text-muted-foreground text-xs'>{hint}</span>}
    </div>
  );
}

export function LeadsSummary({
  leads,
  appointments
}: {
  leads: Lead[];
  appointments: Appointment[];
}) {
  const confirmedAppointments = appointments.filter((a) => a.confirmed).length;
  const pendingAppointments = appointments.filter((a) => !a.confirmed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <Metric label='Total leads' value={leads.length} hint='Left contact info' />
          <Metric label='Appointments' value={confirmedAppointments} hint='Confirmed bookings' />
          <Metric label='Pending' value={pendingAppointments} hint='Not yet confirmed' />
          <Metric
            label='Conversion'
            value={
              leads.length === 0 ? 0 : Math.round((confirmedAppointments / leads.length) * 100)
            }
            hint='Leads → appointments %'
          />
        </div>
      </CardContent>
    </Card>
  );
}
