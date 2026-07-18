import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { attentionStalledState } from '@/features/thouhid/lib/derive';
import type { AttentionItem } from '@/types/thouhid';

/** Sort: action before info, then most inactive (stalled) first. */
function sortItems(items: AttentionItem[]): AttentionItem[] {
  const now = new Date();
  return [...items].sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'action' ? -1 : 1;
    const da = attentionStalledState(a, now).inactiveDays;
    const db = attentionStalledState(b, now).inactiveDays;
    return db - da;
  });
}

function AttentionRow({ item }: { item: AttentionItem }) {
  const { stalled, inactiveDays } = attentionStalledState(item);
  const isAction = item.severity === 'action';
  const Icon = isAction ? Icons.warning : Icons.info;

  const row = (
    <div className='flex items-start justify-between gap-3 rounded-lg border p-3'>
      <div className='flex items-start gap-3'>
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${isAction ? 'text-amber-600' : 'text-muted-foreground'}`}
          aria-hidden
        />
        <div>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-medium'>{item.title}</p>
            {stalled && (
              <Badge variant='outline' className='text-xs'>
                Needs attention · {inactiveDays}d
              </Badge>
            )}
          </div>
          {item.description && (
            <p className='text-muted-foreground mt-0.5 text-sm'>{item.description}</p>
          )}
        </div>
      </div>
      {item.href && (
        <Icons.arrowRight className='text-muted-foreground mt-1 h-4 w-4 shrink-0' aria-hidden />
      )}
    </div>
  );

  return item.href ? (
    <Link href={item.href} className='block transition-colors hover:bg-accent/50 rounded-lg'>
      {row}
    </Link>
  ) : (
    row
  );
}

export function AttentionQueue({ items }: { items: AttentionItem[] }) {
  const open = items.filter((i) => !i.resolved);
  const sorted = sortItems(open);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Attention queue</CardTitle>
        {open.length > 0 && <Badge variant='secondary'>{open.length}</Badge>}
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <Icons.circleCheck className='h-4 w-4 text-emerald-500' aria-hidden />
            You&apos;re all caught up.
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {sorted.map((item) => (
              <AttentionRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
