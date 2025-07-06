import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SignInForm = () => {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Sign In
      </h1>
      <form className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full mt-4">Sign In</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don’t have an account?{' '}
          <NavLink
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
