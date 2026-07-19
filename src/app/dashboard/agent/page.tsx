import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getActivationProgress,
  getControlLevel,
  getServiceStatus,
  type ScenarioKey
} from '@/features/thouhid/api';
import { AgentStatusCard } from '@/features/thouhid/components/agent-status-card';
import { AgentActivation } from '@/features/thouhid/components/agent-activation';
import { ScenarioSwitcher } from '@/features/thouhid/components/scenario-switcher';

export const metadata = {
  title: 'Dashboard: Agent'
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

  const [status, activation, controlLevel] = await Promise.all([
    getServiceStatus(key),
    getActivationProgress(key),
    getControlLevel(key)
  ]);

  return (
    <PageContainer
      pageTitle='Agent'
      pageDescription='Your AI answering agent configuration and status.'
    >
      <div className='flex flex-1 flex-col gap-4'>
        {showSwitcher && (
          <Suspense fallback={null}>
            <ScenarioSwitcher />
          </Suspense>
        )}
        <AgentStatusCard status={status} controlLevel={controlLevel} />
        <AgentActivation progress={activation} />
      </div>
    </PageContainer>
  );
}
