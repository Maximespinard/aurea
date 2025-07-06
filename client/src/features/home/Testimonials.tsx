import Container from '@/components/shared/Container';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Camille, 28',
    quote:
      'Finally, an app that doesn’t feel bloated. Auréa is simple, and that’s what I needed.',
  },
  {
    name: 'Lina, 31',
    quote:
      'I’ve tried so many trackers, but this one feels different. Clean, respectful, and intuitive.',
  },
  {
    name: 'Maya, 26',
    quote:
      'I love how it doesn’t overcomplicate things. The calendar view is just perfect.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">What users say</h2>
          <p className="mt-4 text-muted-foreground">
            Real voices, real people — here’s what they think about Auréa.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {testimonials.map((testi, i) => (
            <blockquote
              key={i}
              className="relative bg-muted rounded-2xl p-6 shadow-sm"
            >
              <Quote className="absolute -top-4 -left-4 h-8 w-8 text-muted-foreground opacity-20" />
              <p className="text-sm text-muted-foreground italic">
                “{testi.quote}”
              </p>
              <footer className="mt-4 text-sm font-medium text-foreground">
                {testi.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
