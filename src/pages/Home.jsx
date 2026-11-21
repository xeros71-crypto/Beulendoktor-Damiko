import Hero from '../components/Hero';
import ServicesOverview from '../components/ServicesOverview';
import About from '../components/About';
import LeasingProcess from '../components/LeasingProcess';
import GalleryPreview from '../components/GalleryPreview';
import FaqSection from '../components/FaqSection';
import Contact from '../components/Contact';
import SEO from '../components/SEO';
import {
    ALL_AREAS_SERVED,
    SITE_URL,
    buildAutoRepairSchema,
    buildFaqSchema,
} from '../data/businessSchema';

const homeFaqs = [
    {
        q: 'Welche Leistungen bietet Beulendoktor Damiko an?',
        a: 'Wir bieten Autolackierungen (Teil- & Spotlackierungen), mobilen Kfz-Ausbeulservice ohne Lackieren (PDR), Smart Repair, Hagelschaden-Beseitigung, Leasingrückläufer-Service inkl. Hol- & Bringservice sowie professionelle Fahrzeugaufbereitung.',
    },
    {
        q: 'Wie hoch ist die Ersparnis beim lackschadenfreien Ausbeulen?',
        a: 'Gegenüber einem klassischen Teiletausch mit Neulackierung sparen Sie beim lackschadenfreien Ausbeulen (PDR) häufig bis zu 75 % der Kosten – und Ihr wertvoller Originallack bleibt vollständig erhalten.',
    },
    {
        q: 'Was kostet eine Teillackierung am Auto?',
        a: 'Je nach Bauteil, Schadenstiefe und Farbton liegt eine fachgerechte Teillackierung häufig bei ca. 400 € bis 600 €. Bei kleinen Kratzern ist oft auch günstigeres Spot Repair möglich.',
    },
    {
        q: 'Wie läuft der Leasingrückläufer-Service ab?',
        a: 'Sie senden uns Fotos Ihrer Schäden und den Rückgabetermin per WhatsApp oder Formular. Wir erstellen schnell einen transparenten Kostenvoranschlag und bieten auf Wunsch einen bequemen Hol- und Bringservice.',
    },
    {
        q: 'Übernimmt die Versicherung meinen Hagelschaden?',
        a: 'Ja, Hagelschäden sind in der Regel über die Teilkaskoversicherung abgedeckt – ohne Rückstufung Ihres Schadenfreiheitsrabatts. Auf Wunsch unterstützen wir Sie in Kooperation mit Kfz-Gutachter DK.',
    },
    {
        q: 'Wie vereinbare ich am schnellsten einen Termin?',
        a: 'Termine erfolgen flexibel nach vorheriger Absprache. Rufen Sie direkt unter 0151 40 3333 75 an, senden Sie Fotos per WhatsApp oder nutzen Sie unser Kontaktformular.',
    },
];

const Home = () => {
    return (
        <>
            <SEO
                title="Autolackierung, Smart Repair & Beulendoktor in Frankfurt"
                description="Beulendoktor Damiko in Frankfurt am Main: Professionelle Autolackierungen, Smart Repair, mobiler Ausbeulservice ohne Lackieren, Hagelschäden & Leasingrückläufer-Service seit 2014."
                keywords="Autolackiererei Frankfurt, Beulendoktor Frankfurt, Smart Repair Frankfurt, Mobiler Ausbeulservice, Dellen entfernen ohne Lackieren, Hagelschaden Frankfurt, Leasingrückläufer Rhein-Main, Damiko"
                schema={[
                    buildAutoRepairSchema({
                        url: `${SITE_URL}/`,
                        image: `${SITE_URL}/images/lackierung-kabine.jpg`,
                        description:
                            'Seit 2014 Ihr Spezialist für Autolackierungen, Smart Repair, mobilen Ausbeulservice, Hagelschäden und Leasingrückläufer in Frankfurt, Wetterau & Rhein-Main.',
                        areaServed: ALL_AREAS_SERVED,
                        makesOffer: [
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Autolackierungen & Teillackierungen' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobiler Ausbeulservice (Dellentechnik)' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Smart Repair & Spot Repair' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Leasingrückläufer-Service' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hagelschaden-Instandsetzung' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fahrzeugaufbereitung & Politur' } },
                        ],
                    }),
                    buildFaqSchema(homeFaqs),
                ]}
            />
            <Hero />
            <ServicesOverview />
            <About />
            <LeasingProcess />
            <GalleryPreview />
            <FaqSection faqs={homeFaqs} />
            <Contact />
        </>
    );
};

export default Home;
