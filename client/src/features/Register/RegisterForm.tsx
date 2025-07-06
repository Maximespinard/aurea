import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RegisterForm = () => {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Create Account
      </h1>
      <form className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-muted-foreground"
          >
            Username
          </label>
          <Input id="username" type="text" placeholder="yourname" />
        </div>
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
        <div className="space-y-2">
          <label
            htmlFor="confirm"
            className="text-sm font-medium text-muted-foreground"
          >
            Confirm Password
          </label>
          <Input id="confirm" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full mt-4">Create Account</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <NavLink
            to="/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
