export default function HowItWorks() {
  const steps = [
    {
      title: '1. Create your profile',
      desc: 'Tell us about your cycle so Auréa can personalize your experience.',
    },
    {
      title: '2. Track your period',
      desc: 'Log your periods, moods, symptoms, and more — effortlessly.',
    },
    {
      title: '3. Know your rhythm',
      desc: 'Visualize fertile days, PMS phases, and cycle trends over time.',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          It only takes a few steps to get the insights you deserve.
        </p>
      </div>

      <div className="mt-16 grid gap-12 sm:grid-cols-3 max-w-5xl mx-auto px-4">
        {steps.map((step, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {i + 1}
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
