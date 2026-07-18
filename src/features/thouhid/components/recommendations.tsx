import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import type { Recommendation } from '@/features/thouhid/lib/derive';

export function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <Icons.circleCheck className='h-4 w-4 text-emerald-500' aria-hidden />
            Nothing to suggest right now.
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {items.map((rec) => {
              const body = (
                <div className='flex items-start justify-between gap-3 rounded-lg border p-3'>
                  <div className='flex items-start gap-3'>
                    <Icons.sparkles
                      className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0'
                      aria-hidden
                    />
                    <div>
                      <p className='text-sm font-medium'>{rec.title}</p>
                      <p className='text-muted-foreground mt-0.5 text-sm'>{rec.detail}</p>
                    </div>
                  </div>
                  {rec.href && (
                    <Icons.arrowRight
                      className='text-muted-foreground mt-1 h-4 w-4 shrink-0'
                      aria-hidden
                    />
                  )}
                </div>
              );
              return rec.href ? (
                <Link
                  key={rec.id}
                  href={rec.href}
                  className='block rounded-lg transition-colors hover:bg-accent/50'
                >
                  {body}
                </Link>
              ) : (
                <div key={rec.id}>{body}</div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
