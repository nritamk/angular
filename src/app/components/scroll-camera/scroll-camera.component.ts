import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-camera',
  standalone: true,
  imports: [],
  templateUrl: './scroll-camera.component.html',
  styleUrl: './scroll-camera.component.scss',
})
export class ScrollCameraComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly camRef = viewChild<ElementRef<HTMLElement>>('cam');
  private st?: ScrollTrigger;
  private stOpacity?: ScrollTrigger;
  private tl?: gsap.core.Timeline;
  private ro?: ResizeObserver;
  private rebuildTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);
    // Prevent browser scroll-restoration from repositioning the page after
    // GSAP has already built its triggers at scrollY = 0.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    requestAnimationFrame(() => requestAnimationFrame(() => this.build()));
  }

  private build(): void {
    this.st?.kill();
    this.stOpacity?.kill();
    this.tl?.kill();

    const cam = this.camRef()?.nativeElement;
    if (!cam) return;

    const CAM_W = cam.offsetWidth;
    const CAM_H = cam.offsetHeight;
    if (CAM_W === 0 || CAM_H === 0) {
      setTimeout(() => this.build(), 80);
      return;
    }

    const track = document.querySelector<HTMLElement>('.story-track');
    if (!track) return;

    const frames = Array.from(
      document.querySelectorAll<HTMLElement>('.story-visual .frame'),
    );
    if (!frames.length) return;

    const vh = window.innerHeight;
    const sy = window.scrollY;

    // SLOT_Y = 220.5 / 500 = 0.441 matches the dock centre in the 400×500 SVG viewBox.
    const SLOT_X = 0.50;
    const SLOT_Y = 0.441;

    // ── per-section: restScroll (scrollY where section centre = viewport centre)
    //    + camera target position at that scroll state ────────────────────────
    const restScrolls: number[] = [];
    const positions = frames.map((frame) => {
      const section = frame.closest<HTMLElement>('.story')!;
      const fr = frame.getBoundingClientRect();
      const sr = section.getBoundingClientRect();

      const framePageTop   = fr.top + sy;
      const sectionPageMid = sr.top + sy + section.offsetHeight / 2;
      const restScroll     = sectionPageMid - vh / 2;

      restScrolls.push(restScroll);

      return {
        x: fr.left + frame.offsetWidth  * SLOT_X - CAM_W / 2,
        y: (framePageTop - restScroll) + frame.offsetHeight * SLOT_Y - CAM_H / 2,
      };
    });

    const trackPageTop = track.getBoundingClientRect().top + sy;

    // ── scrub range: section-1 centre → last-section centre ─────────────────
    // The scrub progress 0 = section 1 is centred in the viewport.
    // The scrub progress 1 = last section is centred.
    // Camera is stationary at pos[0] before progress 0 and at pos[last] after 1.
    const scrubStart = restScrolls[0];
    const scrubEnd   = restScrolls[restScrolls.length - 1];
    const scrubRange = Math.max(scrubEnd - scrubStart, 1);

    // Map each section centre to a [0..1] fraction within the scrub range
    const sectFractions = restScrolls.map(rs =>
      Math.max(0, Math.min(1, (rs - scrubStart) / scrubRange)),
    );

    // ── GSAP timeline ────────────────────────────────────────────────────────
    // For each inter-section interval [fractions[i], fractions[i+1]]:
    //   • First half  → camera HOLDS at positions[i]   (docked at current section)
    //   • Second half → camera TWEENS to positions[i+1] (moves to next section)
    // This means the camera stays docked at section i while that section is the
    // dominant view, then moves during the hand-off, arriving at dock i+1
    // exactly when section i+1 reaches viewport centre.
    const HOLD = 0.5; // fraction of each interval spent holding vs tweening

    const tl = gsap.timeline({ paused: true });
    tl.set(cam, { x: positions[0].x, y: positions[0].y }, 0);

    for (let i = 1; i < positions.length; i++) {
      const iStart = sectFractions[i - 1];
      const iEnd   = sectFractions[i];
      const iLen   = iEnd - iStart;

      // Tween starts halfway through the interval, ends at iEnd
      const tweenAt  = iStart + iLen * HOLD;
      const tweenDur = iLen * (1 - HOLD);

      if (tweenDur > 0) {
        tl.to(
          cam,
          { x: positions[i].x, y: positions[i].y, ease: 'power2.inOut', duration: tweenDur },
          tweenAt,
        );
      }
    }

    this.tl = tl;

    // ── initial position (no opacity change here — CSS class handles it) ─────
    gsap.set(cam, { x: positions[0].x, y: positions[0].y });

    // Sync the CSS visibility class with the current scroll position so a
    // page-reload mid-section doesn't leave the camera invisible.
    const inView = sy >= trackPageTop && sy <= trackPageTop + track.offsetHeight - vh;
    cam.classList.toggle('cam-visible', inView);

    // ── animation scrub ───────────────────────────────────────────────────────
    // 'top top-=X' fires when the track's top edge is X px above the viewport
    // top, i.e. when scrollY = trackPageTop + X.
    const startOff = Math.max(0, Math.round(scrubStart - trackPageTop));
    const endOff   = Math.round(scrubEnd   - trackPageTop);

    this.st = ScrollTrigger.create({
      trigger:   track,
      start:     `top top-=${startOff}`,
      end:       `top top-=${endOff}`,
      scrub:     0.8,
      animation: tl,
    });

    // ── visibility trigger ────────────────────────────────────────────────────
    // Camera fades in (via CSS transition) as soon as section 1 enters the
    // viewport from the bottom, and fades out once the whole track has scrolled
    // past. Using direct classList calls avoids any GSAP tween conflicts.
    this.stOpacity = ScrollTrigger.create({
      trigger:     track,
      start:       'top top',      // camera appears when hero exits and section 1 fills viewport
      end:         'bottom bottom', // camera hides as last section scrolls past
      onEnter:     () => cam.classList.add('cam-visible'),
      onLeave:     () => cam.classList.remove('cam-visible'),
      onEnterBack: () => cam.classList.add('cam-visible'),
      onLeaveBack: () => cam.classList.remove('cam-visible'),
    });

    // ── responsive rebuild (debounced 200 ms) ─────────────────────────────────
    if (!this.ro) {
      this.ro = new ResizeObserver(() => {
        clearTimeout(this.rebuildTimer);
        this.rebuildTimer = setTimeout(() => {
          ScrollTrigger.refresh();
          this.build();
        }, 200);
      });
      this.ro.observe(document.documentElement);
    }
  }

  ngOnDestroy(): void {
    this.st?.kill();
    this.stOpacity?.kill();
    this.tl?.kill();
    this.ro?.disconnect();
    clearTimeout(this.rebuildTimer);
  }
}
