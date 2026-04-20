import './Footer.scss';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-cta">
          <span className="eyebrow">Let's create something</span>
          <h2>Have a story worth telling? <em>Let's roll camera.</em></h2>
          <a className="btn-pill" href="mailto:hello@justvish.in">
            Start a Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="footer-grid">
          <div className="brand-block">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="6" fill="currentColor" />
                </svg>
              </span>
              <span className="brand-name">JustVish Creative Studios</span>
            </div>
            <p className="tagline">We don't just film. We tell your story.</p>
          </div>

          <div className="link-col">
            <h4>Studio</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#brand-identity">Services</a></li>
              <li><a href="#film-production">Work</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="link-col">
            <h4>Reach Us</h4>
            <ul>
              <li><a href="mailto:hello@justvish.in">hello@justvish.in</a></li>
              <li><a href="tel:+919999999999">+91 99999 99999</a></li>
              <li className="muted">Mumbai · India</li>
            </ul>
          </div>

          <div className="link-col">
            <h4>Follow</h4>
            <ul className="social">
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
                  </svg>
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} JustVish Creative Studios · All rights reserved.</span>
          <span>Crafted with care, cut with precision.</span>
        </div>
      </div>
    </footer>
  );
}
