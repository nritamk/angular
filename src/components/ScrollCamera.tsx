import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollCamera.scss';

export default function ScrollCamera() {
  const camRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    let st: ScrollTrigger | undefined;
    let stOpacity: ScrollTrigger | undefined;
    let tl: gsap.core.Timeline | undefined;
    let ro: ResizeObserver | undefined;
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;

    function build() {
      st?.kill();
      stOpacity?.kill();
      tl?.kill();

      const cam = camRef.current;
      if (!cam) return;

      const CAM_W = cam.offsetWidth;
      const CAM_H = cam.offsetHeight;
      if (CAM_W === 0 || CAM_H === 0) {
        setTimeout(build, 80);
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

      const SLOT_X = 0.50;
      const SLOT_Y = 0.441;

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

      const scrubStart = restScrolls[0];
      const scrubEnd   = restScrolls[restScrolls.length - 1];
      const scrubRange = Math.max(scrubEnd - scrubStart, 1);

      const sectFractions = restScrolls.map(rs =>
        Math.max(0, Math.min(1, (rs - scrubStart) / scrubRange)),
      );

      const timeline = gsap.timeline({ paused: true });
      timeline.set(cam, { x: positions[0].x, y: positions[0].y }, 0);

      const HOLD = 0.5;
      for (let i = 1; i < positions.length; i++) {
        const iStart = sectFractions[i - 1];
        const iEnd   = sectFractions[i];
        const iLen   = iEnd - iStart;
        const tweenAt  = iStart + iLen * HOLD;
        const tweenDur = iLen * (1 - HOLD);

        if (tweenDur > 0) {
          timeline.to(
            cam,
            { x: positions[i].x, y: positions[i].y, ease: 'power2.inOut', duration: tweenDur },
            tweenAt,
          );
        }
      }

      tl = timeline;

      gsap.set(cam, { x: positions[0].x, y: positions[0].y });

      const inView = sy >= trackPageTop && sy <= trackPageTop + track.offsetHeight - vh;
      cam.classList.toggle('cam-visible', inView);

      const startOff = Math.max(0, Math.round(scrubStart - trackPageTop));
      const endOff   = Math.round(scrubEnd - trackPageTop);

      st = ScrollTrigger.create({
        trigger:   track,
        start:     `top top-=${startOff}`,
        end:       `top top-=${endOff}`,
        scrub:     0.8,
        animation: tl,
      });

      stOpacity = ScrollTrigger.create({
        trigger:     track,
        start:       'top top',
        end:         'bottom bottom',
        onEnter:     () => cam.classList.add('cam-visible'),
        onLeave:     () => cam.classList.remove('cam-visible'),
        onEnterBack: () => cam.classList.add('cam-visible'),
        onLeaveBack: () => cam.classList.remove('cam-visible'),
      });

      if (!ro) {
        ro = new ResizeObserver(() => {
          clearTimeout(rebuildTimer);
          rebuildTimer = setTimeout(() => {
            ScrollTrigger.refresh();
            build();
          }, 200);
        });
        ro.observe(document.documentElement);
      }
    }

    requestAnimationFrame(() => requestAnimationFrame(build));

    return () => {
      st?.kill();
      stOpacity?.kill();
      tl?.kill();
      ro?.disconnect();
      clearTimeout(rebuildTimer);
    };
  }, []);

  return (
    <div ref={camRef} className="float-cam" aria-hidden="true">
      <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fc-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#EDECEA"/>
            <stop offset="100%" stopColor="#D4D2CC"/>
          </linearGradient>
          <linearGradient id="fc-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F4F3F1"/>
            <stop offset="100%" stopColor="#E0DFDA"/>
          </linearGradient>
          <linearGradient id="fc-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#C0BEB8"/>
            <stop offset="100%" stopColor="#AEACA6"/>
          </linearGradient>
          <linearGradient id="fc-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#aaaaaa"/>
            <stop offset="30%"  stopColor="#e8e8e8"/>
            <stop offset="55%"  stopColor="#888888"/>
            <stop offset="100%" stopColor="#aaaaaa"/>
          </linearGradient>
          <radialGradient id="fc-glass" cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor="#4a6080"/>
            <stop offset="40%"  stopColor="#1a2535"/>
            <stop offset="100%" stopColor="#050c16"/>
          </radialGradient>
          <radialGradient id="fc-sheen" cx="33%" cy="28%" r="55%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.38"/>
            <stop offset="70%"  stopColor="white" stopOpacity="0.04"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <filter id="fc-drop" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="6"
                          floodColor="#000" floodOpacity="0.28"/>
          </filter>
        </defs>

        <g filter="url(#fc-drop)">
          <polygon points="6,28 154,28 162,18 14,18" fill="url(#fc-top)" stroke="#1C1C1C" strokeWidth="1.2"/>
          <polygon points="154,28 162,18 162,90 154,102" fill="url(#fc-right)" stroke="#1C1C1C" strokeWidth="1.2"/>
          <rect x="6" y="28" width="148" height="74" rx="5" fill="url(#fc-front)" stroke="#1C1C1C" strokeWidth="1.5"/>
          <line x1="8" y1="29.5" x2="152" y2="29.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>

          <rect x="40" y="16" width="8" height="13" rx="2" fill="#D8D6D0" stroke="#1C1C1C" strokeWidth="1.2"/>
          <rect x="84" y="16" width="8" height="13" rx="2" fill="#D8D6D0" stroke="#1C1C1C" strokeWidth="1.2"/>
          <path d="M44 16 C44 6, 88 6, 88 16" stroke="#1C1C1C" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M44 16 C44 6, 88 6, 88 16" stroke="#CECDCB" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M50 11 C60 6, 74 6, 82 11" stroke="rgba(28,28,28,0.22)" strokeWidth="0.8" fill="none" strokeDasharray="3 2" strokeLinecap="round"/>
          <path d="M46 12 C60 7, 76 7, 86 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeLinecap="round"/>

          <circle cx="58" cy="65" r="27" fill="rgba(0,0,0,0.18)"/>
          <circle cx="58" cy="65" r="25.5" fill="#2A2A28" stroke="url(#fc-metal)" strokeWidth="2"/>
          <circle cx="58" cy="65" r="22.5" fill="#222220" stroke="#3A3A38" strokeWidth="3" strokeDasharray="2.4 1"/>
          <circle cx="58" cy="65" r="18.5" fill="#1A1A18" stroke="#333330" strokeWidth="1.2"/>
          <circle cx="58" cy="65" r="15" fill="#111110" stroke="#222228" strokeWidth="1"/>
          <circle cx="58" cy="65" r="13" fill="url(#fc-glass)"/>
          <circle cx="58" cy="65" r="13" fill="url(#fc-sheen)"/>
          <circle cx="58" cy="65" r="10" fill="none" stroke="#1E2C3A" strokeWidth="1"/>
          <circle cx="58" cy="65" r="6.5" fill="#050c16"/>
          <ellipse cx="51" cy="58" rx="4.5" ry="3" fill="rgba(255,255,255,0.28)" transform="rotate(-25 51 58)"/>
          <ellipse cx="49.5" cy="56.5" rx="1.5" ry="1" fill="rgba(255,255,255,0.55)" transform="rotate(-25 49.5 56.5)"/>
          <path d="M54 62 Q57 57.5 63 60.5" stroke="rgba(100,140,255,0.2)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <g stroke="#888" strokeWidth="0.6" strokeLinecap="round">
            <line x1="58" y1="39.5" x2="58" y2="42.5"/>
            <line x1="58" y1="87.5" x2="58" y2="90.5"/>
            <line x1="32.5" y1="65" x2="35.5" y2="65"/>
            <line x1="80.5" y1="65" x2="83.5" y2="65"/>
            <line x1="40" y1="47" x2="42.1" y2="49.1"/>
            <line x1="74" y1="47" x2="71.9" y2="49.1"/>
            <line x1="40" y1="83" x2="42.1" y2="80.9"/>
            <line x1="74" y1="83" x2="71.9" y2="80.9"/>
          </g>

          <rect x="112" y="16" width="28" height="14" rx="2" fill="#D8D6D0" stroke="#1C1C1C" strokeWidth="1.2"/>
          <rect x="115" y="18.5" width="22" height="9" rx="1" fill="#1A2535" stroke="#253545" strokeWidth="0.6"/>
          <ellipse cx="126" cy="23" rx="9" ry="4" fill="#0A1522" opacity="0.9"/>
          <circle  cx="126" cy="23" r="2.2" fill="#050e18"/>

          <rect x="97" y="34" width="50" height="62" rx="2" fill="#DDDBD6" stroke="#1C1C1C" strokeWidth="1"/>

          <rect x="100" y="37" width="44" height="26" rx="2" fill="#0A1825" stroke="#1A3040" strokeWidth="0.8"/>
          <rect x="102" y="39.5" width="10" height="3.5" rx="0.5" fill="#00CC66" opacity="0.85"/>
          <rect x="114" y="39.5" width="7"  height="3.5" rx="0.5" fill="#00AA55" opacity="0.7"/>
          <rect x="123" y="39.5" width="5"  height="3.5" rx="0.5" fill="#007740" opacity="0.5"/>
          <rect x="130" y="39.5" width="12" height="3.5" rx="0.5" fill="#4488FF" opacity="0.6"/>
          <rect x="102" y="45" width="8"  height="2.5" rx="0.4" fill="#6688AA" opacity="0.5"/>
          <rect x="112" y="45" width="10" height="2.5" rx="0.4" fill="#6688AA" opacity="0.4"/>
          <rect x="124" y="45" width="18" height="2.5" rx="0.4" fill="#44BB55" opacity="0.65"/>
          <rect x="102" y="49.5" width="40" height="1.8" rx="0.3" fill="#006633" opacity="0.4"/>
          <rect x="102" y="53"   width="28" height="1.8" rx="0.3" fill="#00CC66" opacity="0.5"/>
          <rect x="102" y="56.5" width="18" height="1.8" rx="0.3" fill="#00CC66" opacity="0.38"/>

          <circle cx="103" cy="70" r="3.5" fill="#C8C6C0" stroke="#AEACA8" strokeWidth="0.8"/>
          <circle cx="112" cy="70" r="3.5" fill="#C8C6C0" stroke="#AEACA8" strokeWidth="0.8"/>
          <circle cx="121" cy="70" r="3.5" fill="#C8C6C0" stroke="#AEACA8" strokeWidth="0.8"/>
          <circle cx="133" cy="70" r="5"   fill="#1A0000" stroke="#CC2222" strokeWidth="1.5"/>
          <circle cx="133" cy="70" r="3"   fill="#DD2222">
            <animate attributeName="opacity" values="1;0.12;1" dur="1.4s" repeatCount="indefinite"/>
          </circle>

          <circle cx="119" cy="84" r="8.5" fill="#C8C6C0" stroke="#A8A6A0" strokeWidth="1"/>
          <circle cx="119" cy="84" r="6"   fill="#D8D6D0" stroke="#B8B6B0" strokeWidth="0.7"/>
          <circle cx="119" cy="84" r="2"   fill="#B0AEA8"/>
          <line x1="119" y1="75.5" x2="119" y2="78.5" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
          <g fill="#888888">
            <circle cx="119"   cy="75.4" r="0.8"/>
            <circle cx="124.6" cy="77.4" r="0.7"/>
            <circle cx="127.2" cy="83.5" r="0.7"/>
            <circle cx="124.6" cy="89.6" r="0.7"/>
            <circle cx="119"   cy="92.6" r="0.8"/>
            <circle cx="113.4" cy="89.6" r="0.7"/>
            <circle cx="110.8" cy="83.5" r="0.7"/>
            <circle cx="113.4" cy="77.4" r="0.7"/>
          </g>

          <rect x="147" y="40" width="7" height="5"  rx="1" fill="#B0AEA8" stroke="#9A9892" strokeWidth="0.6"/>
          <rect x="147" y="49" width="7" height="4"  rx="1" fill="#B0AEA8" stroke="#9A9892" strokeWidth="0.6"/>
          <rect x="147" y="57" width="7" height="7"  rx="1" fill="#B0AEA8" stroke="#9A9892" strokeWidth="0.6"/>
          <circle cx="150.5" cy="60.5" r="2" fill="#9A9892" stroke="#888680" strokeWidth="0.4"/>
          <rect x="147" y="68" width="7" height="10" rx="1" fill="#B0AEA8" stroke="#9A9892" strokeWidth="0.6"/>

          <rect x="10" y="103" width="142" height="6" rx="2" fill="#D0CEC8" stroke="#1C1C1C" strokeWidth="1"/>
          <circle cx="72" cy="106" r="1.8" fill="#B8B6B0"/>
          <circle cx="81" cy="106" r="1.8" fill="#B8B6B0"/>
          <circle cx="90" cy="106" r="1.8" fill="#B8B6B0"/>

          <circle cx="25" cy="27" r="3.5" fill="#CC1A1A">
            <animate attributeName="opacity" values="1;0.08;1" dur="1.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="25" cy="27" r="2" fill="#FF4040">
            <animate attributeName="opacity" values="1;0.1;1" dur="1.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="35" cy="27" r="2.2" fill="#5B9A3A">
            <animate attributeName="opacity" values="0.55;1;0.55" dur="2.8s" repeatCount="indefinite"/>
          </circle>

          <rect x="8" y="38" width="11" height="26" rx="2" fill="#D8D6D0" stroke="#1C1C1C" strokeWidth="1"/>
          <rect x="10" y="42" width="7" height="2" rx="0.5" fill="#B8B6B0"/>
          <rect x="10" y="46" width="7" height="2" rx="0.5" fill="#B8B6B0"/>
          <rect x="10" y="50" width="7" height="2" rx="0.5" fill="#B8B6B0"/>
          <rect x="10" y="54" width="7" height="2" rx="0.5" fill="#B8B6B0"/>
        </g>
      </svg>
    </div>
  );
}
