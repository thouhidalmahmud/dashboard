import type {
  ActivationProgress,
  Appointment,
  AttentionItem,
  Call,
  Lead,
  PlanUsage,
  ServiceStatus,
  SubscriberControlLevel
} from '@/types/thouhid';
import { DEFAULT_CURRENCY, PLAN_TIERS } from '@/config/thouhid-plans';

/**
 * Named mock scenarios for the pre-activation dashboard.
 *
 * Timestamps are RELATIVE to real "now" so time-derived states (stalled at
 * 3 days, reminder at 7) actually trigger when viewed. Accessors (see index.ts)
 * return deep clones so the UI can never mutate these shared fixtures.
 *
 * These are illustrative fixtures, NOT real customer data.
 */

const NOW = () => new Date();
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => iso(new Date(NOW().getTime() - n * 86400000));
const hoursAgo = (n: number) => iso(new Date(NOW().getTime() - n * 3600000));
const daysAhead = (n: number) => iso(new Date(NOW().getTime() + n * 86400000));

export interface ThouhidScenario {
  serviceStatus: ServiceStatus;
  activation: ActivationProgress;
  calls: Call[];
  leads: Lead[];
  appointments: Appointment[];
  attention: AttentionItem[];
  planUsage: PlanUsage;
  controlLevel: SubscriberControlLevel;
}

export type ScenarioKey =
  | 'midActivation'
  | 'activeHealthy'
  | 'degraded'
  | 'disconnected'
  | 'unavailable';

/** Build the 7-step activation sequence with the first step pre-credited. */
function buildActivation(
  currentIndex: number,
  exception?: ActivationProgress['exception']
): ActivationProgress {
  const labels: { state: ActivationProgress['steps'][number]['state']; label: string }[] = [
    { state: 'payment', label: 'Payment' },
    { state: 'configuration', label: 'Configuration' },
    { state: 'phone_setup', label: 'Phone setup' },
    { state: 'review', label: 'Review' },
    { state: 'approval', label: 'Approval' },
    { state: 'activating', label: 'Activating' },
    { state: 'active', label: 'Active' }
  ];
  return {
    steps: labels.map((l, i) => ({
      state: l.state,
      label: l.label,
      complete: i < currentIndex
    })),
    currentIndex,
    firstStepPreCredited: true,
    exception
  };
}

const midActivation: ThouhidScenario = {
  serviceStatus: { level: 'operational', since: daysAgo(2) },
  activation: buildActivation(2),
  calls: [
    {
      id: 'c1',
      receivedAt: hoursAgo(3),
      callerName: 'Dana Ruiz',
      callerNumber: '+15550111',
      outcome: 'lead',
      durationSeconds: 150,
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3)
    },
    {
      id: 'c2',
      receivedAt: hoursAgo(20),
      callerName: 'Sam Ito',
      callerNumber: '+15550112',
      outcome: 'appointment',
      durationSeconds: 240,
      createdAt: hoursAgo(20),
      updatedAt: hoursAgo(20)
    },
    {
      id: 'c3',
      receivedAt: daysAgo(1),
      outcome: 'failed',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    }
  ],
  leads: [
    {
      id: 'l1',
      callId: 'c1',
      name: 'Dana Ruiz',
      phone: '+15550111',
      interest: 'Quote request',
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3)
    }
  ],
  appointments: [
    {
      id: 'a1',
      callId: 'c2',
      customerName: 'Sam Ito',
      scheduledFor: daysAhead(2),
      confirmed: true,
      createdAt: hoursAgo(20),
      updatedAt: hoursAgo(20)
    }
  ],
  attention: [
    {
      id: 'at1',
      kind: 'activation',
      severity: 'action',
      title: 'Finish phone setup',
      description: 'Complete phone setup to continue activation.',
      href: '/dashboard/agent',
      createdAt: daysAgo(2),
      lastActivityAt: hoursAgo(6),
      resolved: false
    }
  ],
  planUsage: {
    tier: 'professional',
    currency: DEFAULT_CURRENCY,
    minuteAllowance: PLAN_TIERS.professional.minuteAllowance,
    minutesUsed: 270,
    extraNumbers: 0,
    extraLocations: 0,
    paygRatePerMinute: PLAN_TIERS.professional.paygRatePerMinute,
    periodEndsAt: daysAhead(18)
  },
  controlLevel: 'guided'
};

const activeHealthy: ThouhidScenario = {
  serviceStatus: { level: 'operational', since: daysAgo(30) },
  activation: buildActivation(6),
  calls: [
    {
      id: 'c1',
      receivedAt: hoursAgo(2),
      callerName: 'Lee Park',
      callerNumber: '+15550120',
      outcome: 'lead',
      durationSeconds: 90,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(2)
    },
    {
      id: 'c2',
      receivedAt: hoursAgo(5),
      callerName: 'Nia Osei',
      callerNumber: '+15550121',
      outcome: 'appointment',
      durationSeconds: 300,
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(5)
    },
    {
      id: 'c3',
      receivedAt: hoursAgo(9),
      outcome: 'message',
      durationSeconds: 45,
      createdAt: hoursAgo(9),
      updatedAt: hoursAgo(9)
    }
  ],
  leads: [
    {
      id: 'l1',
      callId: 'c1',
      name: 'Lee Park',
      email: 'lee@example.com',
      interest: 'Consultation',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(2)
    }
  ],
  appointments: [
    {
      id: 'a1',
      callId: 'c2',
      customerName: 'Nia Osei',
      scheduledFor: daysAhead(1),
      confirmed: true,
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(5)
    }
  ],
  attention: [],
  planUsage: {
    tier: 'professional',
    currency: DEFAULT_CURRENCY,
    minuteAllowance: PLAN_TIERS.professional.minuteAllowance,
    minutesUsed: 450,
    extraNumbers: 1,
    extraLocations: 0,
    paygRatePerMinute: PLAN_TIERS.professional.paygRatePerMinute,
    periodEndsAt: daysAhead(12)
  },
  controlLevel: 'guided'
};

const degraded: ThouhidScenario = {
  serviceStatus: {
    level: 'degraded',
    reason: 'Partial call-routing delays in your region.',
    since: hoursAgo(4)
  },
  activation: buildActivation(6),
  calls: [
    {
      id: 'c1',
      receivedAt: hoursAgo(1),
      callerName: 'Omar Fahd',
      callerNumber: '+15550130',
      outcome: 'lead',
      durationSeconds: 200,
      createdAt: hoursAgo(1),
      updatedAt: hoursAgo(1)
    },
    {
      id: 'c2',
      receivedAt: hoursAgo(7),
      outcome: 'failed',
      createdAt: hoursAgo(7),
      updatedAt: hoursAgo(7)
    }
  ],
  leads: [
    {
      id: 'l1',
      callId: 'c1',
      name: 'Omar Fahd',
      phone: '+15550130',
      interest: 'Service inquiry',
      createdAt: hoursAgo(1),
      updatedAt: hoursAgo(1)
    }
  ],
  appointments: [],
  attention: [
    {
      id: 'at1',
      kind: 'plan_usage',
      severity: 'info',
      title: 'Approaching your minute limit',
      description: 'You have used over 80% of your included minutes.',
      href: '/dashboard/insights',
      createdAt: daysAgo(1),
      lastActivityAt: daysAgo(1),
      resolved: false
    },
    {
      id: 'at2',
      kind: 'lead_followup',
      severity: 'action',
      title: 'Follow up with a waiting lead',
      description: 'A lead has had no activity for several days.',
      href: '/dashboard/leads',
      createdAt: daysAgo(5),
      lastActivityAt: daysAgo(4),
      resolved: false
    }
  ],
  planUsage: {
    tier: 'professional',
    currency: DEFAULT_CURRENCY,
    minuteAllowance: PLAN_TIERS.professional.minuteAllowance,
    minutesUsed: 745,
    extraNumbers: 1,
    extraLocations: 1,
    paygRatePerMinute: PLAN_TIERS.professional.paygRatePerMinute,
    periodEndsAt: daysAhead(6)
  },
  controlLevel: 'thouhid_managed'
};

const disconnected: ThouhidScenario = {
  serviceStatus: {
    level: 'disconnected',
    reason: 'We cannot currently reach your phone number provider.',
    since: hoursAgo(1)
  },
  activation: buildActivation(6),
  calls: [
    {
      id: 'c1',
      receivedAt: hoursAgo(2),
      outcome: 'failed',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(2)
    },
    {
      id: 'c2',
      receivedAt: hoursAgo(3),
      outcome: 'failed',
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3)
    }
  ],
  leads: [],
  appointments: [],
  attention: [
    {
      id: 'at1',
      kind: 'failed_call',
      severity: 'action',
      title: 'Calls are not being answered',
      description: 'Service is disconnected from your number provider.',
      href: '/dashboard/calls',
      createdAt: hoursAgo(1),
      lastActivityAt: hoursAgo(1),
      resolved: false
    }
  ],
  planUsage: {
    tier: 'essential',
    currency: DEFAULT_CURRENCY,
    minuteAllowance: PLAN_TIERS.essential.minuteAllowance,
    minutesUsed: 120,
    extraNumbers: 0,
    extraLocations: 0,
    paygRatePerMinute: PLAN_TIERS.essential.paygRatePerMinute,
    periodEndsAt: daysAhead(20)
  },
  controlLevel: 'direct'
};

const unavailable: ThouhidScenario = {
  serviceStatus: {
    level: 'unavailable',
    reason: 'Live status is temporarily unavailable.',
    since: hoursAgo(1)
  },
  activation: buildActivation(5, 'activation_delayed'),
  calls: [],
  leads: [],
  appointments: [],
  attention: [],
  planUsage: {
    tier: 'essential',
    currency: DEFAULT_CURRENCY,
    minuteAllowance: PLAN_TIERS.essential.minuteAllowance,
    minutesUsed: 0,
    extraNumbers: 0,
    extraLocations: 0,
    paygRatePerMinute: PLAN_TIERS.essential.paygRatePerMinute,
    periodEndsAt: daysAhead(25)
  },
  controlLevel: 'guided'
};

/** All named scenarios, keyed for the accessors. */
export const SCENARIOS: Record<ScenarioKey, ThouhidScenario> = {
  midActivation,
  activeHealthy,
  degraded,
  disconnected,
  unavailable
};

/** Default scenario used when an accessor is called without a key. */
export const DEFAULT_SCENARIO: ScenarioKey = 'midActivation';
