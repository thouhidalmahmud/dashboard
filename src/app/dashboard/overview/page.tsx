import PageContainer from '@/components/layout/page-container';
import {
  getActivationProgress,
  getAppointments,
  getAttentionItems,
  getCalls,
  getLeads,
  getPlanUsage,
  getServiceStatus,
  type ScenarioKey
} from '@/features/thouhid/api';
import { deriveRecommendations } from '@/features/thouhid/lib/derive';
import { ServiceStatusCard } from '@/features/thouhid/components/service-status-card';
import { AttentionQueue } from '@/features/thouhid/components/attention-queue';
import { OutcomesSummary } from '@/features/thouhid/components/outcomes-summary';
import { RecentActivity } from '@/features/thouhid/components/recent-activity';
import { Recommendations } from '@/features/thouhid/components/recommendations';
import { PlanUsageCard } from '@/features/thouhid/components/plan-usage-card';

export const metadata = {
  title: 'Dashboard: Home'
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

  const [status, attention, calls, leads, appointments, activation, usage] = await Promise.all([
    getServiceStatus(key),
    getAttentionItems(key),
    getCalls(key),
    getLeads(key),
    getAppointments(key),
    getActivationProgress(key),
    getPlanUsage(key)
  ]);

  const recommendations = deriveRecommendations({ activation, usage });

  return (
    <PageContainer pageTitle='Home' pageDescription='Your service at a glance.'>
      <div className='flex flex-1 flex-col gap-4'>
        <ServiceStatusCard status={status} />
        <AttentionQueue items={attention} />
        <OutcomesSummary calls={calls} leads={leads} appointments={appointments} />
        <RecentActivity calls={calls} />
        <Recommendations items={recommendations} />
        <PlanUsageCard usage={usage} />
      </div>
    </PageContainer>
  );
}
