import { Outlet } from 'react-router';
import Navbar from '@/components/layout/public/Navbar';
import Footer from '@/components/layout/public/Footer';
import Container from '@/components/shared/Container';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
