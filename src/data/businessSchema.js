export const SITE_URL = 'https://damiko.de';
export const BUSINESS_ID = 'https://damiko.de/#organization';

export const BUSINESS_INFO = {
    name: 'Beulendoktor Damiko',
    legalName: 'Damiko Dellentechnik',
    tagline: 'Autolackierung · Smart Repair · Dellentechnik · Leasingrückläufer',
    foundedYear: 2014,
    street: 'Hagebuttenweg 2',
    postalCode: '60433',
    city: 'Frankfurt am Main',
    region: 'Hessen',
    phoneDisplay: '0151 40 3333 75',
    phoneHref: 'tel:+4915140333375',
    phoneInternational: '+49 151 40 3333 75',
    whatsappUrl: 'https://wa.me/4915140333375',
    instagramUrl: 'https://www.instagram.com/beulendoktor_damiko/',
    facebookUrl: 'https://www.facebook.com/j1979k',
    appointmentNote: 'Termine erfolgen ausschließlich nach vorheriger Absprache',
    partnerNote: 'Kooperation mit Kfz-Gutachter DK',
};

export const BUSINESS_ADDRESS = {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_INFO.street,
    addressLocality: BUSINESS_INFO.city,
    addressRegion: BUSINESS_INFO.region,
    postalCode: BUSINESS_INFO.postalCode,
    addressCountry: 'DE',
};

export const BUSINESS_GEO = {
    '@type': 'GeoCoordinates',
    latitude: 50.1578,
    longitude: 8.6789,
};

export const BUSINESS_SAME_AS = [
    BUSINESS_INFO.instagramUrl,
    BUSINESS_INFO.facebookUrl,
];

export const ALL_AREAS_SERVED = [
    'Frankfurt am Main',
    'Wetteraukreis',
    'Rhein-Main-Gebiet',
    'Bad Homburg vor der Höhe',
    'Bad Vilbel',
    'Offenbach am Main',
    'Oberursel',
    'Friedberg (Hessen)',
    'Karben',
    'Eschborn',
];

export function buildAutoRepairSchema({ url, image, description, areaServed, makesOffer } = {}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AutoRepair',
        '@id': BUSINESS_ID,
        name: `${BUSINESS_INFO.name} – ${BUSINESS_INFO.legalName}`,
        url: url || `${SITE_URL}/`,
        image: image || `${SITE_URL}/images/damiko-logo-shield.png`,
        logo: `${SITE_URL}/images/damiko-logo-shield.png`,
        ...(description ? { description } : {}),
        telephone: '+4915140333375',
        priceRange: '€€',
        address: BUSINESS_ADDRESS,
        geo: BUSINESS_GEO,
        sameAs: BUSINESS_SAME_AS,
        ...(areaServed ? { areaServed } : {}),
        ...(makesOffer ? { makesOffer } : {}),
    };
}

export function buildFaqSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };
}
