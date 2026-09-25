import { Hero } from '../components/home/Hero';
import { CurrentlyBuilding } from '../components/home/CurrentlyBuilding';
import { GameLibrary } from '../components/home/GameLibrary';
import { About } from '../components/home/About';
import { Timeline } from '../components/home/Timeline';
import { Skills } from '../components/home/Skills';
import { DevLogPreview } from '../components/home/DevLogPreview';
import { Contact } from '../components/home/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <CurrentlyBuilding />
      <GameLibrary />
      <About />
      <Timeline />
      <Skills />
      <DevLogPreview />
      <Contact />
    </>
  );
}
