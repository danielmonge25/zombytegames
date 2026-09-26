import { Hero } from '../components/home/Hero';
import { Games } from '../components/home/Games';
import { About } from '../components/home/About';
import { Timeline } from '../components/home/Timeline';
import { Contact } from '../components/home/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <Games />
      <About />
      <Timeline />
      <Contact />
    </>
  );
}
