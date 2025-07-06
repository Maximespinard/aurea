import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignInForm } from './useSignInForm';
import type { SignInFormValues } from './signIn.schema';

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useSignInForm();

  const handleSignIn = (values: SignInFormValues) => {
    console.log('values:', values);
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Sign In
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit(handleSignIn)}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email
          </label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@example.com"
          />
          {errors?.email?.message && (
            <p className="text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </label>
          <Input
            {...register('password')}
            id="password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        {errors?.password?.message && (
          <p className="text-destructive">{errors.password.message}</p>
        )}
        <Button className="w-full mt-4" disabled={isSubmitting}>
          Sign In
        </Button>
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
