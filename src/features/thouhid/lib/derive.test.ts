import { describe, expect, test } from 'bun:test';
import {
  attentionStalledState,
  billableMinutes,
  callsProtected,
  totalBillableMinutes,
  usagePercent,
  usageThresholds
} from './derive';

describe('billableMinutes', () => {
  test('rounds 2:30 (150s) up to 3', () => {
    expect(billableMinutes({ durationSeconds: 150 })).toBe(3);
  });
  test('exact minute stays whole (120s -> 2)', () => {
    expect(billableMinutes({ durationSeconds: 120 })).toBe(2);
  });
  test('1 second rounds up to 1', () => {
    expect(billableMinutes({ durationSeconds: 1 })).toBe(1);
  });
  test('zero / missing duration bills 0', () => {
    expect(billableMinutes({ durationSeconds: 0 })).toBe(0);
    expect(billableMinutes({})).toBe(0);
  });
});

describe('totalBillableMinutes', () => {
  test('rounds each call THEN sums (ten 2:30 = 30, not 25)', () => {
    const calls = Array.from({ length: 10 }, () => ({ durationSeconds: 150 }));
    expect(totalBillableMinutes(calls)).toBe(30);
  });
});

describe('usagePercent', () => {
  test('computes percent', () => {
    expect(usagePercent({ minutesUsed: 240, minuteAllowance: 300 })).toBe(80);
  });
  test('guards divide-by-zero', () => {
    expect(usagePercent({ minutesUsed: 5, minuteAllowance: 0 })).toBe(0);
  });
});

describe('usageThresholds', () => {
  test('80% reaches notice, not action', () => {
    const r = usageThresholds({ minutesUsed: 240, minuteAllowance: 300 });
    expect(r.noticeReached).toBe(true);
    expect(r.actionReached).toBe(false);
  });
  test('95% reaches both', () => {
    const r = usageThresholds({ minutesUsed: 285, minuteAllowance: 300 });
    expect(r.noticeReached).toBe(true);
    expect(r.actionReached).toBe(true);
  });
  test('below 80% reaches neither', () => {
    const r = usageThresholds({ minutesUsed: 100, minuteAllowance: 300 });
    expect(r.noticeReached).toBe(false);
    expect(r.actionReached).toBe(false);
  });
});

describe('attentionStalledState', () => {
  const base = '2026-07-01T00:00:00Z';
  test('3 inactive days = stalled, no reminder yet', () => {
    const now = new Date('2026-07-04T00:00:00Z');
    const r = attentionStalledState({ lastActivityAt: base, resolved: false }, now);
    expect(r.stalled).toBe(true);
    expect(r.reminderDue).toBe(false);
  });
  test('7 inactive days = reminder due', () => {
    const now = new Date('2026-07-08T00:00:00Z');
    const r = attentionStalledState({ lastActivityAt: base, resolved: false }, now);
    expect(r.reminderDue).toBe(true);
  });
  test('already reminded = no repeat', () => {
    const now = new Date('2026-07-10T00:00:00Z');
    const r = attentionStalledState(
      { lastActivityAt: base, remindedAt: '2026-07-08T00:00:00Z', resolved: false },
      now
    );
    expect(r.reminderDue).toBe(false);
  });
  test('resolved items are never stalled', () => {
    const now = new Date('2026-07-30T00:00:00Z');
    const r = attentionStalledState({ lastActivityAt: base, resolved: true }, now);
    expect(r.stalled).toBe(false);
  });
});

describe('callsProtected', () => {
  test('counts non-failed calls', () => {
    const calls = [
      { outcome: 'lead' as const },
      { outcome: 'appointment' as const },
      { outcome: 'failed' as const },
      { outcome: 'spam' as const }
    ];
    expect(callsProtected(calls)).toBe(3);
  });
});
