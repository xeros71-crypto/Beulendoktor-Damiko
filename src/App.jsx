import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { services } from './data/services';
import { regionalPages } from './data/regionalPages';

const ServiceRoute = lazy(() => import('./pages/ServiceRoute'));
const RegionalRoute = lazy(() => import('./pages/RegionalRoute'));
const Galerie = lazy(() => import('./pages/Galerie'));
const Impressum = lazy(() => import('./components/Impressum'));
const Datenschutz = lazy(() => import('./components/Datenschutz'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              {services.map((service) => (
                <Route
                  key={service.slug}
                  path={service.slug}
                  element={<ServiceRoute slug={service.slug} />}
                />
              ))}
              {regionalPages.map((page) => (
                <Route
                  key={page.slug}
                  path={page.slug}
                  element={<RegionalRoute slug={page.slug} />}
                />
              ))}
              <Route path="galerie" element={<Galerie />} />
              <Route path="impressum" element={<Impressum />} />
              <Route path="datenschutz" element={<Datenschutz />} />
              <Route path="datenschutzerklaerung" element={<Navigate to="/datenschutz" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
