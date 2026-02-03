import { redirect } from 'next/navigation';

const page = () => {
  return redirect('/docs/api/profile');
};

export default page;
