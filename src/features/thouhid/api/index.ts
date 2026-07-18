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
import { DEFAULT_SCENARIO, SCENARIOS, type ScenarioKey } from './scenarios';

/**
 * Fetch-shaped accessors over mock scenario data.
 *
 * Each returns a Promise and a DEEP CLONE of the fixture, so callers can never
 * mutate shared mock state. Swapping mock -> real API later means changing only
 * this file (replace the clone-return with a real fetch); no UI rework needed.
 */

function clone<T>(value: T): T {
  return structuredClone(value);
}

function pick(scenario: ScenarioKey = DEFAULT_SCENARIO) {
  return SCENARIOS[scenario];
}

export async function getServiceStatus(scenario?: ScenarioKey): Promise<ServiceStatus> {
  return clone(pick(scenario).serviceStatus);
}

export async function getActivationProgress(scenario?: ScenarioKey): Promise<ActivationProgress> {
  return clone(pick(scenario).activation);
}

export async function getCalls(scenario?: ScenarioKey): Promise<Call[]> {
  return clone(pick(scenario).calls);
}

export async function getLeads(scenario?: ScenarioKey): Promise<Lead[]> {
  return clone(pick(scenario).leads);
}

export async function getAppointments(scenario?: ScenarioKey): Promise<Appointment[]> {
  return clone(pick(scenario).appointments);
}

export async function getAttentionItems(scenario?: ScenarioKey): Promise<AttentionItem[]> {
  return clone(pick(scenario).attention);
}

export async function getPlanUsage(scenario?: ScenarioKey): Promise<PlanUsage> {
  return clone(pick(scenario).planUsage);
}

export async function getControlLevel(scenario?: ScenarioKey): Promise<SubscriberControlLevel> {
  return clone(pick(scenario).controlLevel);
}

export type { ScenarioKey } from './scenarios';

export { SCENARIO_LABELS } from './scenarios';
