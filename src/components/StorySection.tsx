import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StorySection.scss';

export interface StorySectionData {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  align: 'left' | 'right';
  bg: 'light' | 'pale' | 'dark';
}

interface Props {
  data: StorySectionData;
}

export default function StorySection({ data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const text = root.querySelector('.story-text');
      const visual = root.querySelector('.story-visual');
      const number = root.querySelector('.story-number');

      gsap.from(text, {
        scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
      });

      gsap.from(visual, {
        scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none reverse' },
        y: 80, opacity: 0, duration: 1.1, delay: 0.15, ease: 'power3.out',
      });

      if (number) {
        gsap.from(number, {
          scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none reverse' },
          y: 30, opacity: 0, duration: 0.9, ease: 'power2.out',
        });

        gsap.to(number, {
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
          y: -50,
        });
      }

      gsap.to(visual, {
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
        y: -40,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={data.id}
      className="story"
      data-bg={data.bg}
      data-align={data.align}>
      <div className="container story-grid">
        <div className="story-text">
          <span className="story-number" aria-hidden="true">{data.number}</span>
          <span className="eyebrow">{data.eyebrow}</span>
          <h2>{data.title}</h2>
          <p>{data.body}</p>

          <a className="btn-pill btn-ghost" href="#contact">
            Discuss this
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="story-visual">
          <div className="frame">
            <img src={data.image} alt={data.imageAlt} loading="lazy" />
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>
          </div>
          <div className="frame-caption">
            <span className="rec"></span>
            REC · 4K · {data.eyebrow}
          </div>
        </div>
      </div>
    </section>
  );
}
