import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getAppointments,
  getCalls,
  getLeads,
  getPlanUsage,
  type ScenarioKey
} from '@/features/thouhid/api';
import { InsightsMetrics } from '@/features/thouhid/components/insights-metrics';
import { InsightsChart } from '@/features/thouhid/components/insights-chart';
import { PlanUsageCard } from '@/features/thouhid/components/plan-usage-card';
import { ScenarioSwitcher } from '@/features/thouhid/components/scenario-switcher';

export const metadata = {
  title: 'Dashboard: Insights'
};

type PageProps = {
  searchParams: Promise<{ scenario?: string }>;
};

const VALID_SCENARIOS: ScenarioKey[] = [
  'midActivation',
  'activeHealthy',
  'degraded',
  'disconnected',
  'unavailable'
];

function resolveScenario(value?: string): ScenarioKey | undefined {
  return value && (VALID_SCENARIOS as string[]).includes(value)
    ? (value as ScenarioKey)
    : undefined;
}

export default async function Page(props: PageProps) {
  const { scenario } = await props.searchParams;
  const key = resolveScenario(scenario);
  const showSwitcher = process.env.NODE_ENV !== 'production';

  const [calls, leads, appointments, usage] = await Promise.all([
    getCalls(key),
    getLeads(key),
    getAppointments(key),
    getPlanUsage(key)
  ]);

  return (
    <PageContainer pageTitle='Insights' pageDescription='Measurable outcomes and performance.'>
      <div className='flex flex-1 flex-col gap-4'>
        {showSwitcher && (
          <Suspense fallback={null}>
            <ScenarioSwitcher />
          </Suspense>
        )}
        <InsightsMetrics calls={calls} leads={leads} appointments={appointments} usage={usage} />
        <div className='grid gap-4 md:grid-cols-2'>
          <InsightsChart calls={calls} />
          <PlanUsageCard usage={usage} />
        </div>
      </div>
    </PageContainer>
  );
}
