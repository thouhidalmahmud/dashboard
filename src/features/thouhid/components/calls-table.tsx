'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'lead', label: 'Leads' },
  { value: 'appointment', label: 'Appointments' },
  { value: 'failed', label: 'Failed' },
  { value: 'message', label: 'Messages' },
  { value: 'spam', label: 'Spam' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

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

function formatDuration(seconds?: number): string {
  if (seconds == null || seconds <= 0) return '\u2014';
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function CallRow({ call }: { call: Call }) {
  const meta = OUTCOME_META[call.outcome];
  return (
    <div className='flex items-center justify-between gap-3 py-2.5'>
      <div className='flex min-w-0 items-center gap-3'>
        <Icons.phone className='text-muted-foreground h-4 w-4 shrink-0' aria-hidden />
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>{call.callerName ?? 'Unknown caller'}</p>
          <p className='text-muted-foreground text-xs'>
            {formatWhen(call.receivedAt)}
            {call.callerNumber && ` \u00b7 ${call.callerNumber}`}
            {` \u00b7 ${formatDuration(call.durationSeconds)}`}
          </p>
        </div>
      </div>
      <Badge variant={meta.badge}>{meta.label}</Badge>
    </div>
  );
}

function CallList({ calls }: { calls: Call[] }) {
  const [page, setPage] = useState(0);
  const sorted = [...calls].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
  const total = sorted.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const slice = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const start = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const end = Math.min((page + 1) * PAGE_SIZE, total);

  if (total === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>
        No calls match this filter.
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col divide-y'>
        {slice.map((call) => (
          <CallRow key={call.id} call={call} />
        ))}
      </div>
      {pages > 1 && (
        <div className='flex items-center justify-between pt-2'>
          <p className='text-muted-foreground text-xs'>
            Showing {start}&ndash;{end} of {total}
          </p>
          <div className='flex gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className='text-muted-foreground hover:text-foreground disabled:opacity-40 text-xs underline underline-offset-4 transition-colors'
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              className='text-muted-foreground hover:text-foreground disabled:opacity-40 text-xs underline underline-offset-4 transition-colors'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CallsTable({ calls }: { calls: Call[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Call log</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='all'>
          <TabsList className='mb-4 w-full justify-start overflow-x-auto'>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {tab.value !== 'all' && (
                  <span className='text-muted-foreground ml-1.5 text-xs tabular-nums'>
                    ({calls.filter((c) => c.outcome === tab.value).length})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value='all'>
            <CallList calls={calls} />
          </TabsContent>
          {TABS.slice(1).map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <CallList calls={calls.filter((c) => c.outcome === (tab.value as CallOutcome))} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
