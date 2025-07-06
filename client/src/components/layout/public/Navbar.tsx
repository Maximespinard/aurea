import { Button } from '@/components/ui/button';
import { NavLink, useLocation } from 'react-router';

const Navbar = () => {
  const location = useLocation();
  const hideAuthLink = ['/signin', '/register'].includes(location.pathname);

  return (
    <header className=" border-b bg-background px-4 md:px-8 h-[80px]">
      <div className="mx-auto h-full flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-2xl font-semibold tracking-tight text-primary"
        >
          Auréa
        </NavLink>
        <nav className="flex items-center gap-8">
          {!hideAuthLink && (
            <NavLink to="/signin">
              <Button>Sign In</Button>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
