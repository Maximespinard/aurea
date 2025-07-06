import { Outlet } from 'react-router';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import Navbar from '@/components/layout/public/Navbar';
import Footer from '@/components/layout/public/Footer';
import Container from '@/components/ui/Container';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`pt-[${NAVBAR_HEIGHT}px] flex-1 mt-25`}>
        {/* Add padding to account for fixed navbar height */}
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
