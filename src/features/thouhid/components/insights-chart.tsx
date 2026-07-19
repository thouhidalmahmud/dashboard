'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import type { Call, CallOutcome } from '@/types/thouhid';

const OUTCOME_LABELS: Record<CallOutcome, string> = {
  lead: 'Leads',
  appointment: 'Appointments',
  failed: 'Failed',
  message: 'Messages',
  spam: 'Spam'
};

const chartConfig = {
  count: { label: 'Calls' },
  lead: { label: 'Leads', color: 'var(--chart-1)' },
  appointment: { label: 'Appointments', color: 'var(--chart-2)' },
  failed: { label: 'Failed', color: 'var(--chart-3)' },
  message: { label: 'Messages', color: 'var(--chart-4)' },
  spam: { label: 'Spam', color: 'var(--chart-5)' }
} satisfies ChartConfig;

export function InsightsChart({ calls }: { calls: Call[] }) {
  const outcomes: CallOutcome[] = ['lead', 'appointment', 'failed', 'message', 'spam'];
  const chartData = outcomes
    .map((outcome) => ({
      outcome,
      label: OUTCOME_LABELS[outcome],
      count: calls.filter((c) => c.outcome === outcome).length,
      fill: `var(--color-${outcome})`
    }))
    .filter((d) => d.count > 0);

  if (calls.length === 0 || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Call outcomes</CardTitle>
          <CardDescription>Distribution by outcome type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center text-sm'>
            No call data available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Call outcomes</CardTitle>
        <CardDescription>Distribution by outcome type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[280px]'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey='label' hideLabel />} />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='label'
              innerRadius={50}
              cornerRadius={6}
              paddingAngle={3}
            />
            <ChartLegend content={<ChartLegendContent nameKey='label' />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
