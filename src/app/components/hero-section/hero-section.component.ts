import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = viewChild<ElementRef<HTMLElement>>('hero');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.host()?.nativeElement;
    if (!root) return;

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

    // Subtle parallax on mouse move
    root.addEventListener('mousemove', (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      gsap.to(root.querySelector('.hero-visual'), {
        x, y, duration: 0.8, ease: 'power2.out',
      });
    });
  }
}
