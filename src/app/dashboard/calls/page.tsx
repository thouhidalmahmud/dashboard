import PageContainer from '@/components/layout/page-container';
import { getCalls } from '@/features/thouhid/api';
import { type ScenarioKey } from '@/features/thouhid/api';
import { CallsSummary } from '@/features/thouhid/components/calls-summary';
import { CallsTable } from '@/features/thouhid/components/calls-table';

export const metadata = {
  title: 'Dashboard: Calls'
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
  const calls = await getCalls(key);

  return (
    <PageContainer pageTitle='Calls' pageDescription='Call activity and records.'>
      <div className='flex flex-1 flex-col gap-4'>
        <CallsSummary calls={calls} />
        <CallsTable calls={calls} />
      </div>
    </PageContainer>
  );
}
