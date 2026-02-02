import Footer from '@/components/core/footer';
import HomeHeader from '@/components/core/home-header';
import { ReactNode } from 'react';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <HomeHeader />
      {children}
      <Footer />
    </>
  );
};

export default HomeLayout;
