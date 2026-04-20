import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './HeroSection.scss';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(root.querySelector('.eyebrow'), { y: 24, opacity: 0, duration: 0.7 })
        .from(root.querySelector('.hero-title'), { y: 40, opacity: 0, duration: 0.9 }, '-=0.4')
        .from(root.querySelector('.hero-lead'), { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(root.querySelectorAll('.hero-actions > *'), {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.12,
        }, '-=0.4')
        .from(root.querySelector('.hero-stats'), { y: 30, opacity: 0, duration: 0.7 }, '-=0.3')
        .from(root.querySelector('.hero-visual'), {
          scale: 0.95, opacity: 0, duration: 1.2, ease: 'power2.out',
        }, 0.2)
        .from(root.querySelectorAll('.float-tag'), {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.15,
        }, '-=0.6');
    }, root);

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      gsap.to(root.querySelector('.hero-visual'), {
        x, y, duration: 0.8, ease: 'power2.out',
      });
    };

    root.addEventListener('mousemove', onMouseMove);
    return () => {
      ctx.revert();
      root.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section ref={heroRef} id="home" className="hero" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="grain"></div>
      </div>

      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow">JustVish Creative Studios</span>

          <h1 className="hero-title">
            We're not just another <em>creative</em> agency.
          </h1>

          <p className="hero-lead">
            We're storytellers, filmmakers, and brand architects who believe in the
            transformative power of visual narrative.
          </p>

          <div className="hero-actions">
            <a className="btn-pill" href="#contact">
              Start Your Story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="btn-pill btn-ghost" href="#brand-identity">See Our Work</a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>120+</strong>
              <span>Films delivered</span>
            </div>
            <div>
              <strong>40+</strong>
              <span>Brands built</span>
            </div>
            <div>
              <strong>9 yrs</strong>
              <span>Of storytelling</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="assets/hero-camera.png"
            alt="Cinematographer holding a professional cinema camera in soft golden light"
            loading="eager"
          />
        </div>
      </div>

      <a className="scroll-cue" href="#brand-identity" aria-label="Scroll down">
        <span>Scroll</span>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
          <rect x="1" y="1" width="12" height="20" rx="6"
                stroke="currentColor" strokeWidth="1.4" />
          <circle cx="7" cy="7" r="1.6" fill="currentColor" />
        </svg>
      </a>
    </section>
  );
}
