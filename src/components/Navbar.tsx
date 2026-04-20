import { useState, useEffect } from 'react';
import './Navbar.scss';

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#brand-identity' },
  { label: 'Work', href: '#film-production' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar-wrap${scrolled ? ' is-scrolled' : ''}`}>
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="6" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-name">JustVish</span>
        </a>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu}>{link.label}</a>
            </li>
          ))}
        </ul>

        <a className="btn-pill nav-cta" href="#contact" onClick={closeMenu}>
          Let's Connect
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
