import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="py-24 sm:py-32 border-b">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Track your cycle, naturally.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Auréa helps you understand your body with clarity. Simple, private,
          and built for real life.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/register">Create Account</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
