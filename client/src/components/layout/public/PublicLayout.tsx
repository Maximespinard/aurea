import { Outlet } from 'react-router';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import Navbar from '@/components/layout/public/Navbar';
import Footer from '@/components/layout/public/Footer';
import Container from '@/components/shared/Container';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className={`pt-[${NAVBAR_HEIGHT}px]`}>
        {/* Add padding to account for fixed navbar height */}
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
