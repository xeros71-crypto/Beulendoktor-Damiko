import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import ServiceRoute from './pages/ServiceRoute';
import RegionalRoute from './pages/RegionalRoute';
import Galerie from './pages/Galerie';
import AdminGallery from './pages/AdminGallery';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { services } from './data/services';
import { regionalPages } from './data/regionalPages';

export function render(url) {
    const helmetContext = {};

    const html = renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
                <ErrorBoundary>
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
                            <Route path="admin" element={<AdminGallery />} />
                            <Route path="impressum" element={<Impressum />} />
                            <Route path="datenschutz" element={<Datenschutz />} />
                            <Route path="datenschutzerklaerung" element={<Navigate to="/datenschutz" replace />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </ErrorBoundary>
            </StaticRouter>
        </HelmetProvider>,
    );

    return { html, helmet: helmetContext.helmet };
}
