import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegisterForm } from './useRegisterForm';
import { useRegisterMutation } from '@/hooks/auth/useRegisterMutation';
import type { RegisterFormValues } from './register.schema';

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm();

  const registerMutation = useRegisterMutation();

  const handleRegister = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Create Account
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-muted-foreground"
          >
            Username
          </label>
          <Input
            {...register('username')}
            id="username"
            type="text"
            placeholder="yourname"
          />
          {errors?.username?.message && (
            <p className="text-destructive">{errors.username.message}</p>
          )}
        </div>
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
          {errors?.password?.message && (
            <p className="text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirm"
            className="text-sm font-medium text-muted-foreground"
          >
            Confirm Password
          </label>
          <Input
            {...register('confirmPassword')}
            id="confirm"
            type="password"
            placeholder="••••••••"
          />
          {errors?.confirmPassword?.message && (
            <p className="text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button 
          className="w-full mt-4" 
          disabled={registerMutation.isPending}
          type="submit"
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
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
