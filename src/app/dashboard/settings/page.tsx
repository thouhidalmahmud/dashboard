import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPlanUsage, getControlLevel, type ScenarioKey } from '@/features/thouhid/api';
import { PLAN_TIERS } from '@/config/thouhid-plans';

export const metadata = {
  title: 'Dashboard: Settings'
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

const CONTROL_LABEL = {
  direct: 'Direct',
  guided: 'Guided',
  thouhid_managed: 'THOUHID Managed'
} as const;

const CONTROL_DESCRIPTION = {
  direct: 'You configure and manage your agent directly.',
  guided: 'THOUHID assists with configuration and changes.',
  thouhid_managed: 'THOUHID fully manages your agent on your behalf.'
} as const;

export default async function Page(props: PageProps) {
  const { scenario } = await props.searchParams;
  const key = resolveScenario(scenario);

  const [usage, controlLevel] = await Promise.all([getPlanUsage(key), getControlLevel(key)]);

  const tier = PLAN_TIERS[usage.tier];

  return (
    <PageContainer pageTitle='Settings' pageDescription='Account and subscriber controls.'>
      <div className='flex flex-1 flex-col gap-4 max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Plan</CardTitle>
            <CardDescription>Your current subscription tier.</CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>{tier.label}</p>
              <p className='text-muted-foreground text-sm'>
                {tier.minuteAllowance} minutes included per period
              </p>
            </div>
            <Badge variant='secondary'>{tier.label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Subscriber control level</CardTitle>
            <CardDescription>How much you manage your agent vs. THOUHID.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{CONTROL_LABEL[controlLevel]}</p>
                <p className='text-muted-foreground text-sm'>{CONTROL_DESCRIPTION[controlLevel]}</p>
              </div>
              <Badge variant='outline'>{CONTROL_LABEL[controlLevel]}</Badge>
            </div>
            <p className='text-muted-foreground text-xs'>
              To change your control level, contact THOUHID support.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Make changes</CardTitle>
            <CardDescription>
              Configuration changes are handled by our team to ensure everything stays working
              correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <p className='text-muted-foreground text-sm'>
              Need to update your phone number, business hours, call handling instructions, or any
              other settings?
            </p>
            <a
              href='mailto:support@thouhid.com'
              className='text-sm font-medium underline underline-offset-4'
            >
              Contact support
            </a>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
