import type { CapabilityTier, Money, SubscriberControlLevel } from '@/types/thouhid';

/**
 * THOUHID plan and behavior configuration.
 *
 * Billing is metered by CALL MINUTES (each call rounded UP to whole minutes,
 * then summed — rounding done in helpers, not here). Commercial values (monthly
 * price, minute allowances, PAYG rates) are PLACEHOLDERS — illustrative for
 * design only, NOT final pricing. Isolated here so finalizing pricing is a
 * one-file change. Thresholds and timings encode confirmed strategy decisions.
 */

/* ------------------------------- Thresholds ------------------------------- */

/** Quiet, informational usage notice at 80%. */
export const USAGE_NOTICE_PCT = 80;
/** Stronger, action-oriented usage prompt at 95%. */
export const USAGE_ACTION_PCT = 95;

/* ---------------------------- Stalled handling ---------------------------- */

/** An attention item is derived as "stalled" after 3 inactive days. */
export const STALLED_AFTER_DAYS = 3;
/** A follow-up reminder fires at 7 inactive days. */
export const STALLED_REMINDER_DAYS = 7;

/* ------------------------- Subscriber control default --------------------- */

/** Default control level for new subscribers. */
export const DEFAULT_SUBSCRIBER_CONTROL: SubscriberControlLevel = 'guided';

/* -------------------------------- Currency -------------------------------- */

/** Default currency until multi-currency is introduced. ISO 4217. */
export const DEFAULT_CURRENCY = 'USD';

/* ------------------------------ Plan tiers -------------------------------- */

/**
 * Placeholder tier definitions — illustrative values for design, NOT final.
 * Allowances are in call MINUTES.
 */
export interface TierDefinition {
  tier: CapabilityTier;
  label: string;
  /** PLACEHOLDER monthly price, whole currency units. */
  monthlyPrice: Money;
  /** PLACEHOLDER included call minutes (whole number). */
  minuteAllowance: number;
  /**
   * PLACEHOLDER pay-as-you-go rate per extra MINUTE, in dollars.
   * Not `Money`: rates may be fractional (e.g. 0.15), unlike whole-unit prices.
   */
  paygRatePerMinute: number;
}

export const PLAN_TIERS: Record<CapabilityTier, TierDefinition> = {
  essential: {
    tier: 'essential',
    label: 'Essential',
    monthlyPrice: 49, // placeholder
    minuteAllowance: 300, // placeholder
    paygRatePerMinute: 0.2 // placeholder
  },
  professional: {
    tier: 'professional',
    label: 'Professional',
    monthlyPrice: 99, // placeholder
    minuteAllowance: 900, // placeholder
    paygRatePerMinute: 0.15 // placeholder
  },
  premium: {
    tier: 'premium',
    label: 'Premium',
    monthlyPrice: 199, // placeholder
    minuteAllowance: 2400, // placeholder
    paygRatePerMinute: 0.12 // placeholder
  }
};
