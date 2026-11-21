import Hero from '../components/Hero';
import ServicesOverview from '../components/ServicesOverview';
import FrankfurtPaintSection from '../components/FrankfurtPaintSection';
import About from '../components/About';
import LeasingProcess from '../components/LeasingProcess';
import GalleryPreview from '../components/GalleryPreview';
import FaqSection from '../components/FaqSection';
import Contact from '../components/Contact';
import SEO from '../components/SEO';
import { HOME_FAQS, HOME_SEO, buildHomeSchema } from '../data/businessSchema';

const homeSchema = buildHomeSchema();

const Home = () => {
    return (
        <>
            <SEO
                title={HOME_SEO.title}
                description={HOME_SEO.description}
                canonicalPath="/"
                image={HOME_SEO.image}
                imageAlt={HOME_SEO.imageAlt}
                schema={homeSchema}
            />
            <Hero />
            <ServicesOverview />
            <FrankfurtPaintSection />
            <About />
            <LeasingProcess />
            <GalleryPreview />
            <FaqSection faqs={HOME_FAQS} />
            <Contact />
        </>
    );
};

export default Home;
