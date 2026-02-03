import Sidebar from '@/components/docs/sidebar';

const DocsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid grid-cols-4 gap-6 py-5'>
      <aside className='col-span-1'>
        <div className='sticky top-20'>
          <Sidebar />
        </div>
      </aside>
      <main className='col-span-3 p-2'>{children}</main>
    </div>
  );
};

export default DocsLayout;
