'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SCENARIO_LABELS, type ScenarioKey } from '@/features/thouhid/api';

const DEFAULT_KEY: ScenarioKey = 'midActivation';

const ENTRIES = Object.entries(SCENARIO_LABELS) as [ScenarioKey, string][];

export function ScenarioSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get('scenario');
  const current: ScenarioKey = raw && raw in SCENARIO_LABELS ? (raw as ScenarioKey) : DEFAULT_KEY;

  function handleChange(value: ScenarioKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('scenario', value);
    // replace (not push) so QA clicks don't fill browser history;
    // scroll:false keeps the viewport where the reviewer is looking.
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className='flex items-center gap-2 rounded-lg border border-dashed p-2'>
      <Label htmlFor='scenario-switcher' className='text-muted-foreground text-xs'>
        Preview scenario
      </Label>
      <Select
        items={ENTRIES.map(([value, label]) => ({ value, label }))}
        value={current}
        onValueChange={(value) => {
          if (value !== null) handleChange(value as ScenarioKey);
        }}
      >
        <SelectTrigger id='scenario-switcher' className='h-8 w-48'>
          <SelectValue placeholder='Select scenario' />
        </SelectTrigger>
        <SelectContent align='start'>
          <SelectGroup>
            <SelectLabel>Reliability states</SelectLabel>
            {ENTRIES.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
