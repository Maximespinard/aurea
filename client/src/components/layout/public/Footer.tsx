import Container from '@/components/ui/Container';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="border-t bg-background py-10 text-sm text-muted-foreground">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Auréa. All rights reserved.</p>
          <nav className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <a
              href="mailto:your.email@protonmail.com"
              className="hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
