import type { ActivationProgress, ActivationStep, Call, PlanUsage } from '@/types/thouhid';
import {
  STALLED_AFTER_DAYS,
  STALLED_REMINDER_DAYS,
  USAGE_ACTION_PCT,
  USAGE_NOTICE_PCT
} from '@/config/thouhid-plans';

/**
 * Pure derivation helpers. Types store facts; these compute the rest.
 * No side effects, no I/O — safe to unit test and reuse anywhere.
 */

const SECONDS_PER_MINUTE = 60;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Billable minutes for a single call: rounded UP to the whole minute.
 * A 2:30 call (150s) bills as 3. A 0s/failed call bills as 0.
 */
export function billableMinutes(call: Pick<Call, 'durationSeconds'>): number {
  const seconds = call.durationSeconds ?? 0;
  if (seconds <= 0) return 0;
  return Math.ceil(seconds / SECONDS_PER_MINUTE);
}

/**
 * Total billable minutes across calls: round each call up, THEN sum.
 * (Ten 2:30 calls = 10 x 3 = 30, not 25.)
 */
export function totalBillableMinutes(calls: Pick<Call, 'durationSeconds'>[]): number {
  return calls.reduce((sum, c) => sum + billableMinutes(c), 0);
}

/** Usage as a percent (0-100+). Guards divide-by-zero. */
export function usagePercent(usage: Pick<PlanUsage, 'minutesUsed' | 'minuteAllowance'>): number {
  if (usage.minuteAllowance <= 0) return 0;
  return (usage.minutesUsed / usage.minuteAllowance) * 100;
}

/** Which usage thresholds are reached (80% quiet notice, 95% action). */
export function usageThresholds(usage: Pick<PlanUsage, 'minutesUsed' | 'minuteAllowance'>): {
  noticeReached: boolean;
  actionReached: boolean;
} {
  const pct = usagePercent(usage);
  return {
    noticeReached: pct >= USAGE_NOTICE_PCT,
    actionReached: pct >= USAGE_ACTION_PCT
  };
}

/** The current activation step (derived, not stored). Null if out of range. */
export function currentActivationStep(progress: ActivationProgress): ActivationStep | null {
  return progress.steps[progress.currentIndex] ?? null;
}

/**
 * Stalled state for an attention item, derived from days since last activity.
 * - stalled: >= 3 inactive days
 * - reminderDue: >= 7 inactive days AND not already reminded
 */
export function attentionStalledState(
  item: { lastActivityAt: string; remindedAt?: string; resolved: boolean },
  now: Date = new Date()
): { stalled: boolean; reminderDue: boolean; inactiveDays: number } {
  const last = new Date(item.lastActivityAt).getTime();
  const inactiveDays = Math.floor((now.getTime() - last) / MS_PER_DAY);
  const stalled = !item.resolved && inactiveDays >= STALLED_AFTER_DAYS;
  const reminderDue = !item.resolved && inactiveDays >= STALLED_REMINDER_DAYS && !item.remindedAt;
  return { stalled, reminderDue, inactiveDays };
}

/**
 * Neutral "calls protected" metric: count of handled (non-failed) calls.
 * Deliberately NOT loss-framed - a factual outcome count (see research notes).
 */
export function callsProtected(calls: Pick<Call, 'outcome'>[]): number {
  return calls.filter((c) => c.outcome !== 'failed').length;
}
