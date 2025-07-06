import { Outlet } from 'react-router';
import Navbar from '@/components/layout/public/Navbar';
import Footer from '@/components/layout/public/Footer';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
