'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import type { Appointment, Lead } from '@/types/thouhid';

const PAGE_SIZE = 5;

function formatWhen(iso: string): string {
  const d = new Date(iso);
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

function Pagination({
  page,
  pages,
  total,
  onPrev,
  onNext
}: {
  page: number;
  pages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (pages <= 1) return null;
  const start = page * PAGE_SIZE + 1;
  const end = Math.min((page + 1) * PAGE_SIZE, total);
  return (
    <div className='flex items-center justify-between pt-2'>
      <p className='text-muted-foreground text-xs'>
        Showing {start}&ndash;{end} of {total}
      </p>
      <div className='flex gap-2'>
        <button
          onClick={onPrev}
          disabled={page === 0}
          className='text-muted-foreground hover:text-foreground disabled:opacity-40 text-xs underline underline-offset-4 transition-colors'
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={page === pages - 1}
          className='text-muted-foreground hover:text-foreground disabled:opacity-40 text-xs underline underline-offset-4 transition-colors'
        >
          Next
        </button>
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const contact = lead.email ?? lead.phone ?? 'No contact info';
  return (
    <div className='flex items-start justify-between gap-3 py-2.5'>
      <div className='flex min-w-0 items-start gap-3'>
        <Icons.user className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' aria-hidden />
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>{lead.name}</p>
          <p className='text-muted-foreground text-xs'>{contact}</p>
          {lead.interest && (
            <p className='text-muted-foreground mt-0.5 truncate text-xs italic'>{lead.interest}</p>
          )}
        </div>
      </div>
      <p className='text-muted-foreground shrink-0 text-xs'>{formatWhen(lead.createdAt)}</p>
    </div>
  );
}

function LeadsList({ leads }: { leads: Lead[] }) {
  const [page, setPage] = useState(0);
  const sorted = [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const total = sorted.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const slice = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (total === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>No leads captured yet.</div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col divide-y'>
        {slice.map((lead) => (
          <LeadRow key={lead.id} lead={lead} />
        ))}
      </div>
      <Pagination
        page={page}
        pages={pages}
        total={total}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(pages - 1, p + 1))}
      />
    </div>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return (
    <div className='flex items-center justify-between gap-3 py-2.5'>
      <div className='flex min-w-0 items-center gap-3'>
        <Icons.calendar className='text-muted-foreground h-4 w-4 shrink-0' aria-hidden />
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>{appointment.customerName}</p>
          <p className='text-muted-foreground text-xs'>{formatWhen(appointment.scheduledFor)}</p>
        </div>
      </div>
      <Badge variant={appointment.confirmed ? 'default' : 'outline'}>
        {appointment.confirmed ? 'Confirmed' : 'Pending'}
      </Badge>
    </div>
  );
}

function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  const [page, setPage] = useState(0);
  const sorted = [...appointments].sort(
    (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );
  const total = sorted.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const slice = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (total === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>No appointments yet.</div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col divide-y'>
        {slice.map((appt) => (
          <AppointmentRow key={appt.id} appointment={appt} />
        ))}
      </div>
      <Pagination
        page={page}
        pages={pages}
        total={total}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(pages - 1, p + 1))}
      />
    </div>
  );
}

export function LeadsTable({
  leads,
  appointments
}: {
  leads: Lead[];
  appointments: Appointment[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='leads'>
          <TabsList className='mb-4'>
            <TabsTrigger value='leads'>
              Leads
              <span className='text-muted-foreground ml-1.5 text-xs tabular-nums'>
                ({leads.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value='appointments'>
              Appointments
              <span className='text-muted-foreground ml-1.5 text-xs tabular-nums'>
                ({appointments.filter((a) => a.confirmed).length})
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='leads'>
            <LeadsList leads={leads} />
          </TabsContent>
          <TabsContent value='appointments'>
            <AppointmentsList appointments={appointments} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
