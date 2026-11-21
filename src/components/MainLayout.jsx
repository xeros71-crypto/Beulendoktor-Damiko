import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import useScrollReveal from '../hooks/useScrollReveal';

const MainLayout = () => {
    const { hash, pathname, key } = useLocation();

    useScrollReveal(pathname);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    useEffect(() => {
        if (hash) {
            const targetId = hash.replace('#', '');
            const timer = setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 80);
            return () => clearTimeout(timer);
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [hash, pathname, key]);

    return (
        <div className="app">
            <ScrollProgress routeKey={pathname} />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
