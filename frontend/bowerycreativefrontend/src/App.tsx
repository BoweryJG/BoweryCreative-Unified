import { useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { Showcase } from './components/Showcase';
import { Technology } from './components/Technology';
import { Process } from './components/Process';
import { About } from './components/About';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AudioToggle } from './components/AudioToggle';
import { CosmicWelcome } from './components/CosmicWelcome';
import { AuthProvider } from './contexts/AuthContext';
import { trackPageView } from './lib/analytics';

function App() {
  useEffect(() => {
    // Track initial page view
    trackPageView(window.location.pathname);

    // Track navigation changes
    const handleLocationChange = () => {
      trackPageView(window.location.pathname);
    };
    
    // Listen for popstate events
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Navigation />
        <main className="relative">
          <CosmicWelcome />
          <Hero />
          <Capabilities />
          <Showcase />
          <Technology />
          <Process />
          <About />
          <Insights />
          <Contact />
        </main>
        <Footer />
        <AudioToggle />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;