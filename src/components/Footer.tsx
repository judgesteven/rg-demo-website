import { footerText } from '../data/howItWorks';

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <strong>Sample data.</strong> {footerText}
      </p>
    </footer>
  );
}
