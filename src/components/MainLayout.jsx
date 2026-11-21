import { useEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import useScrollReveal from '../hooks/useScrollReveal';

const MainLayout = () => {
    const { hash, pathname } = useLocation();
    const parallaxRef = useRef(null);

    useScrollReveal(pathname);

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                return () => clearTimeout(timer);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash, pathname]);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const handleMouseMove = (e) => {
            const bg = parallaxRef.current;
            if (!bg) return;

            const moveX = (e.clientX - window.innerWidth / 2) * 0.04;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.04;
            bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="app">
            <div ref={parallaxRef} className="bg-parallax" />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
