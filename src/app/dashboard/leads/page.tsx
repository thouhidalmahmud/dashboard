import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Leads & Appointments'
};

export default function Page() {
  return (
    <PageContainer
      pageTitle='Leads & Appointments'
      pageDescription='Captured leads and confirmed appointments.'
    >
      <div className='text-muted-foreground text-sm'>Coming soon.</div>
    </PageContainer>
  );
}
