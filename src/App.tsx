import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ScrollCamera from './components/ScrollCamera';
import StorySection, { type StorySectionData } from './components/StorySection';
import Footer from './components/Footer';
import './App.scss';

const sections: StorySectionData[] = [
  {
    id: 'brand-identity',
    number: '01',
    eyebrow: 'Brand Identity',
    title: 'We shape the soul of your brand.',
    body: `We shape the core of your brand, including its design, voice, and personality.
           We identify your ideal audience so every message comes through loud and clear.`,
    image: 'assets/section-brand.svg',
    imageAlt: 'Cinematic close-up of a camera lens reflecting a brand identity moodboard',
    align: 'right',
    bg: 'light',
  },
  {
    id: 'communication-strategy',
    number: '02',
    eyebrow: 'Communication Strategy',
    title: 'Strategy that speaks in pictures.',
    body: `We transform business goals into engaging visual storytelling by creating a clear
           communication strategy across digital media, print, and everything else.`,
    image: 'assets/section-strategy.svg',
    imageAlt: 'Director reviewing storyboard frames in a softly-lit studio',
    align: 'left',
    bg: 'pale',
  },
  {
    id: 'film-production',
    number: '03',
    eyebrow: 'Content & Film Production',
    title: 'Stories told frame by frame.',
    body: `We bring your brand to life with strong, high-quality content production.
           Whether it's an ad film, a docu-film, a podcast series, or eye-catching social media visuals.`,
    image: 'assets/section-production.svg',
    imageAlt: 'Cinematographer operating a cinema camera on a film set with golden lighting',
    align: 'right',
    bg: 'dark',
  },
  {
    id: 'creative-design',
    number: '04',
    eyebrow: 'Creative Design',
    title: 'Designs you remember.',
    body: `We craft visuals that communicate effectively and leave a lasting impact.
           Our designs are meant to be seen, understood, and remembered.`,
    image: 'assets/section-design.svg',
    imageAlt: "Designer's desk with film stills, color swatches and a vintage camera",
    align: 'left',
    bg: 'light',
  },
];

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <HeroSection />
        <section className="story-track">
          <ScrollCamera />
          {sections.map((section) => (
            <StorySection key={section.id} data={section} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
