/**
 * THOUHID domain types for the pre-activation dashboard.
 *
 * Conventions (read before editing):
 * - Money: use the `Money` alias — WHOLE currency units. `49` = $49.00, never cents.
 *   A real backend may return minor units; reconcile in the API layer, not here.
 * - Dates/times: ISO 8601 strings (e.g. "2026-07-18T09:00:00Z"), matching JSON APIs.
 *   Never Date objects in these contracts.
 * - Optional/nullable fields are marked `?` deliberately to model the
 *   "unavailable data" reliability state — the UI must handle their absence.
 * - Types hold FACTS only. Derived values (percentages, thresholds, current step)
 *   are computed in helper/selector functions, never stored here (avoids drift).
 * - Some invariants (e.g. Lead has at least one of email/phone; ServiceStatus.reason
 *   present when not operational) are documented runtime rules, not enforced by the
 *   base shape — kept simple deliberately for a mock-backed UI contract.
 * - These are UI contracts backed by mock data today; real API responses
 *   should conform so the mock→live swap needs no UI rework.
 */

/** Whole currency units. 49 = $49.00. Never minor units (cents). */
export type Money = number;

/* ----------------------------- Service status ----------------------------- */

/** Overall health of the answering service, shown at the top of Home. */
export type ServiceStatusLevel = 'operational' | 'degraded' | 'disconnected' | 'unavailable';

export interface ServiceStatus {
  level: ServiceStatusLevel;
  /** Human-readable explanation. Expected present when level !== 'operational'. */
  reason?: string;
  /** ISO timestamp the current status began. */
  since: string;
}

/* --------------------------- Activation sequence -------------------------- */

/**
 * The seven ordered steps of the happy-path activation sequence:
 * payment → configuration → phone_setup → review → approval → activating → active
 */
export type ActivationSequenceState =
  | 'payment'
  | 'configuration'
  | 'phone_setup'
  | 'review'
  | 'approval'
  | 'activating'
  | 'active';

/** Exception conditions (not steps) required by the reliability spec. */
export type ActivationExceptionState = 'payment_failed' | 'rejected' | 'activation_delayed';

export type ActivationState = ActivationSequenceState | ActivationExceptionState;

export interface ActivationStep {
  /** Only ever a sequence step, never an exception condition. */
  state: ActivationSequenceState;
  label: string;
  complete: boolean;
}

/**
 * Progress model for the activation tracker UI.
 * Built for the endowed-progress effect (Nunes & Drèze, 2006): the first step
 * is pre-credited so the sequence never renders at 0%.
 * NOTE: current state is derived (steps[currentIndex]) in a helper, not stored.
 */
export interface ActivationProgress {
  steps: ActivationStep[];
  /** Index of the current in-flight step within `steps`. */
  currentIndex: number;
  /** Always true: the first step is credited on entry (endowed progress). */
  firstStepPreCredited: boolean;
  /**
   * Present only in an exception condition. The exception attaches to the step
   * at `currentIndex` — e.g. exception 'activation_delayed' with currentIndex
   * pointing at 'activating' means "delayed while activating". Consumers should
   * render it against steps[currentIndex], not as a separate step.
   */
  exception?: ActivationExceptionState;
}

/* -------------------------------- Calls ----------------------------------- */

/** Outcome of a received call. Lead/appointment/failed per confirmed defs. */
export type CallOutcome = 'lead' | 'appointment' | 'failed' | 'message' | 'spam';

export interface Call {
  id: string;
  /** ISO timestamp the call was received. */
  receivedAt: string;
  callerName?: string;
  callerNumber?: string;
  outcome: CallOutcome;
  /** Duration in seconds; absent for failed calls that never connected. */
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------- Leads & appointments --------------------------- */

/** A caller who left contact info and expressed service interest. */
export interface Lead {
  id: string;
  callId: string;
  name: string;
  /** Invariant: at least one of email/phone is present. */
  email?: string;
  phone?: string;
  /** Service / quote / consultation summary. */
  interest?: string;
  createdAt: string;
  updatedAt: string;
}

/** A confirmed calendar booking (not merely a request). */
export interface Appointment {
  id: string;
  callId?: string;
  leadId?: string;
  customerName: string;
  /** ISO timestamp of the booked slot. */
  scheduledFor: string;
  /** Must be true to count as an appointment per the confirmed definition. */
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------------------------- Attention queue ----------------------------- */

export type AttentionKind =
  | 'activation'
  | 'failed_call'
  | 'lead_followup'
  | 'plan_usage'
  | 'configuration';

export type AttentionSeverity = 'info' | 'action';

/**
 * A persistent item in the attention queue (Zeigarnik effect: kept visible to
 * sustain a productive pull toward resolution).
 * Stalled handling: "attention" derived after 3 inactive days, reminder at 7.
 * Both thresholds are computed in helpers from `lastActivityAt`, not stored.
 */
export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  severity: AttentionSeverity;
  title: string;
  description?: string;
  /** Deep link to the relevant page. */
  href?: string;
  createdAt: string;
  /** ISO timestamp of last activity; used to derive stalled state. */
  lastActivityAt: string;
  /** Set once the 7-day reminder has fired, to avoid repeats. */
  remindedAt?: string;
  resolved: boolean;
}

/* -------------------------- Subscriber controls --------------------------- */

/** How much the subscriber manages vs. THOUHID. Default: 'guided'. */
export type SubscriberControlLevel = 'direct' | 'guided' | 'thouhid_managed';

/* ------------------------------ Plan & usage ------------------------------ */

export type CapabilityTier = 'essential' | 'professional' | 'premium';

/**
 * Plan and raw usage FACTS only. Billing is metered by CALL MINUTES.
 * Call *count* is tracked separately for outcomes/metrics (see Call/CallOutcome),
 * not for billing. Derived values — percent used, whether the 80% notice / 95%
 * action thresholds are reached — are computed in helpers using the threshold
 * constants from the plan config.
 * Billing rule: each call is rounded UP to whole minutes (ceil(durationSeconds/60)),
 * then summed. `minutesUsed` is that already-rounded billable total; exact seconds
 * are preserved on Call.durationSeconds for analytics and disputes.
 */
export interface PlanUsage {
  tier: CapabilityTier;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** Included call minutes this period (whole number). */
  minuteAllowance: number;
  /** Billable call minutes used this period (whole number, already rounded). */
  minutesUsed: number;
  extraNumbers: number;
  extraLocations: number;
  /**
   * Pay-as-you-go rate per extra MINUTE, in dollars.
   * Not `Money`: rates may be fractional (e.g. 0.15), unlike whole-unit prices.
   */
  paygRatePerMinute: number;
  /** ISO date the current billing period ends. */
  periodEndsAt: string;
}
