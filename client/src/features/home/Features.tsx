import { LucideShieldCheck, LucideSparkles, LucideClock } from 'lucide-react';

const features = [
  {
    icon: LucideShieldCheck,
    title: '100% Private',
    description:
      'Your data is stored securely and never shared. No ads, no tracking.',
  },
  {
    icon: LucideSparkles,
    title: 'Beautifully Simple',
    description:
      'A clean interface designed to help you focus on what matters.',
  },
  {
    icon: LucideClock,
    title: 'Always in Sync',
    description: 'Track and visualize your cycle anywhere, anytime.',
  },
];

export default function Features() {
  return (
    <section className="py-20 border-b">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Why Auréa?</h2>
        <p className="mt-4 text-muted-foreground">
          Built with care, for people who value clarity and simplicity.
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-3">
        {features.map((feat, i) => (
          <div key={i} className="text-center px-4">
            <feat.icon className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">{feat.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
