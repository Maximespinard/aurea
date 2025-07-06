import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const CallToAction = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to take control of your cycle?
      </h2>
      <p className="mt-4 text-muted-foreground text-lg">
        Join <span className="text-primary font-semibold">Auréa</span> today and
        start tracking with clarity and ease.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/register">Create Account</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
