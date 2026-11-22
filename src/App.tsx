import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LenisProvider } from './context/LenisContext';
import { NavProvider } from './context/NavContext';
import { ScrollToTop } from './components/ScrollToTop';
import { LoaderMask } from './components/LoaderMask';
import { FloatingNavbar } from './components/FloatingNavbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { KineticMarquee } from './components/KineticMarquee';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { WorkPage } from './pages/WorkPage';

// Admin console is code-split so it never ships in the public bundle.
const AdminPage = lazy(() => import('./pages/AdminPage'));

// sessionStorage key — set once so returning from /work skips the loader
const LOADED_KEY = 'portfolio_loaded';

function HomePage() {
  const hasLoaded = sessionStorage.getItem(LOADED_KEY) === '1';
  const [isLoaded, setIsLoaded] = useState(hasLoaded);

  const handleLoaderComplete = () => {
    sessionStorage.setItem(LOADED_KEY, '1');
    setIsLoaded(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0D0E12] relative selection:bg-[#0052FF] selection:text-white">
      {!isLoaded && <LoaderMask onComplete={handleLoaderComplete} />}

      <FloatingNavbar />

      <main className="w-full relative sm:pl-14 transition-all duration-300">
        <HeroSection
          onAbout={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <KineticMarquee />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      {/* Single Lenis instance lives here — persists across route changes */}
      <LenisProvider>
        <NavProvider>
          {/* Global custom magnetic cursor */}
          <CustomCursor />
          {/* ScrollToTop resets the shared Lenis + DOM scroll on every navigation */}
          <ScrollToTop />
          <Routes>
            <Route path="/"     element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-[#0D0E12] text-zinc-500 flex items-center justify-center font-mono text-sm">
                      loading console…
                    </div>
                  }
                >
                  <AdminPage />
                </Suspense>
              }
            />
          </Routes>
        </NavProvider>
      </LenisProvider>
    </BrowserRouter>
  );
}

export default App;
