import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Agent'
};

export default function Page() {
  return (
    <PageContainer
      pageTitle='Agent'
      pageDescription='Your AI answering agent configuration and status.'
    >
      <div className='text-muted-foreground text-sm'>Coming soon.</div>
    </PageContainer>
  );
}
