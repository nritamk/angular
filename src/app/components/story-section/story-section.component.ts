import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface StorySection {
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

@Component({
  selector: 'app-story-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-section.component.html',
  styleUrl: './story-section.component.scss',
})
export class StorySectionComponent implements AfterViewInit {
  @Input({ required: true }) data!: StorySection;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = viewChild<ElementRef<HTMLElement>>('section');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.registerPlugin(ScrollTrigger);

    const root = this.host()?.nativeElement;
    if (!root) return;

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
  }
}
