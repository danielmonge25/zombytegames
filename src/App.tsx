import { useEffect, useRef, useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { matchRoute, metaFor, type Route } from './routes';
import { applyMeta } from './lib/meta';
import { useRevealOnScroll } from './lib/hooks';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BootScreen } from './components/BootScreen';
import { ByteCompanion } from './components/mascot/ByteCompanion';
import { CursorTrail } from './components/CursorTrail';
import { Toasts } from './components/Toasts';
import { SecretsDialog } from './components/SecretsDialog';
import { FishRain } from './components/FishRain';
import { EasterEggs } from './components/EasterEggs';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/global.css';
import './components/ui/ui.css';
import './styles/chrome.css';

export function App({ initialPath }: { initialPath: string }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <Shell />
    </RouterProvider>
  );
}

function Page({ route }: { route: Route }) {
  return route.page === 'home' ? <HomePage /> : <NotFoundPage />;
}

function Shell() {
  const { path, key } = useRouter();
  const route = matchRoute(path);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const firstRender = useRef(true);

  useRevealOnScroll(path);

  // Keep <head> in sync, close the menu and move focus after navigation.
  useEffect(() => {
    const meta = metaFor(route);
    applyMeta(meta);
    setMenuOpen(false);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
    setAnnouncement(meta.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);


  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {route.page === 'home' ? <BootScreen /> : null}
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main" tabIndex={-1} inert={menuOpen}>
        <Page key={key} route={route} />
      </main>
      <Footer inert={menuOpen} />
      <ByteCompanion />
      <Toasts />
      <SecretsDialog />
      <FishRain />
      <EasterEggs />
      <CursorTrail />
      <div className="grain" aria-hidden="true" />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}
