import PageContainer from '@/components/layout/page-container';
import { getAppointments, getLeads, type ScenarioKey } from '@/features/thouhid/api';
import { LeadsSummary } from '@/features/thouhid/components/leads-summary';
import { LeadsTable } from '@/features/thouhid/components/leads-table';

export const metadata = {
  title: 'Dashboard: Leads & Appointments'
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

  const [leads, appointments] = await Promise.all([getLeads(key), getAppointments(key)]);

  return (
    <PageContainer
      pageTitle='Leads & Appointments'
      pageDescription='Captured leads and confirmed appointments.'
    >
      <div className='flex flex-1 flex-col gap-4'>
        <LeadsSummary leads={leads} appointments={appointments} />
        <LeadsTable leads={leads} appointments={appointments} />
      </div>
    </PageContainer>
  );
}
