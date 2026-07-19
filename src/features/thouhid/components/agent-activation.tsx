import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { currentActivationStep } from '@/features/thouhid/lib/derive';
import type { ActivationExceptionState, ActivationProgress } from '@/types/thouhid';

const EXCEPTION_META: Record<ActivationExceptionState, { label: string; description: string }> = {
  payment_failed: {
    label: 'Payment failed',
    description: 'Your payment could not be processed. Please update your payment method.'
  },
  rejected: {
    label: 'Review unsuccessful',
    description: 'Your application requires further review. Our team will be in touch.'
  },
  activation_delayed: {
    label: 'Activation delayed',
    description: 'Your activation is taking longer than expected. We are working on it.'
  }
};

export function AgentActivation({ progress }: { progress: ActivationProgress }) {
  const current = currentActivationStep(progress);
  const isComplete = progress.steps.every((s) => s.complete);
  const completedCount = progress.steps.filter((s) => s.complete).length;
  const total = progress.steps.length;

  if (isComplete) return null;

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Activation progress</CardTitle>
        <span className='text-muted-foreground text-xs tabular-nums'>
          {completedCount} of {total} steps
        </span>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        {progress.exception && (
          <div className='mb-4 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3'>
            <p className='text-sm font-medium'>{EXCEPTION_META[progress.exception].label}</p>
            <p className='text-muted-foreground mt-0.5 text-sm'>
              {EXCEPTION_META[progress.exception].description}
            </p>
          </div>
        )}
        {progress.steps.map((step, i) => {
          const isCurrent = i === progress.currentIndex && !isComplete;
          const isPreCredited = i === 0 && progress.firstStepPreCredited;
          return (
            <div key={step.state} className='flex items-center gap-3 py-1.5'>
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                  step.complete
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {step.complete ? '✓' : i + 1}
              </div>
              <div className='flex flex-1 items-center justify-between gap-2'>
                <span
                  className={`text-sm ${
                    step.complete
                      ? 'text-muted-foreground line-through'
                      : isCurrent
                        ? 'font-medium'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
                <div className='flex items-center gap-1'>
                  {isPreCredited && (
                    <Badge variant='outline' className='text-xs'>
                      Pre-credited
                    </Badge>
                  )}
                  {isCurrent && !progress.exception && (
                    <Badge variant='secondary' className='text-xs'>
                      In progress
                    </Badge>
                  )}
                  {isCurrent && progress.exception && (
                    <Badge variant='secondary' className='text-xs'>
                      Paused
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <p className='text-muted-foreground mt-2 text-xs'>
          Step 1 is pre-credited upon account creation.
        </p>
      </CardContent>
    </Card>
  );
}
