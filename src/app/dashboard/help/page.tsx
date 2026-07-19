import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata = {
  title: 'Dashboard: Help'
};

const FAQ = [
  {
    q: 'How does my agent answer calls?',
    a: 'Your THOUHID agent answers calls on your behalf, captures caller details, qualifies leads, and books appointments — all without you having to pick up.'
  },
  {
    q: 'Will my existing phone number change?',
    a: 'No. Your existing number stays unchanged with no downtime. We set up call forwarding so your agent handles calls seamlessly.'
  },
  {
    q: 'What counts as a lead?',
    a: 'A lead is a caller who provides contact information and expresses interest in a service, quote, consultation, or appointment.'
  },
  {
    q: 'What counts as an appointment?',
    a: 'An appointment is a successfully confirmed calendar booking — not merely a request. Both the time slot and caller details are confirmed.'
  },
  {
    q: 'What happens if the agent cannot handle a call?',
    a: 'This is recorded as a failed call. You can see all failed calls in the Calls page. Our team monitors these and works to minimise them.'
  },
  {
    q: 'How do I update my business hours or call script?',
    a: 'Contact our support team and we will update your configuration. Changes are handled by us to ensure everything keeps working correctly.'
  }
];

export default function Page() {
  return (
    <PageContainer pageTitle='Help' pageDescription='Guides and support.'>
      <div className='flex flex-1 flex-col gap-4 max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Get in touch</CardTitle>
            <CardDescription>
              Our team is here to help with any question or change you need.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium'>Email support</p>
              <a
                href='mailto:support@thouhid.com'
                className='text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors'
              >
                support@thouhid.com
              </a>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium'>Service status</p>
              <a
                href='https://dashboard.thouhid.workers.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors'
              >
                Check live status
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col divide-y'>
            {FAQ.map((item) => (
              <div key={item.q} className='py-3 first:pt-0 last:pb-0'>
                <p className='text-sm font-medium'>{item.q}</p>
                <p className='text-muted-foreground mt-1 text-sm'>{item.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
