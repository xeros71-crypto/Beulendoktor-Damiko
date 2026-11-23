export const REGIONAL_NAV_GROUPS = [
    {
        id: 'kerngebiet',
        label: 'Frankfurt & Kerngebiet',
        pages: [
            { slug: 'autolackiererei-frankfurt', city: 'Frankfurt am Main', shortCity: 'Frankfurt' },
            { slug: 'autolackiererei-bad-homburg', city: 'Bad Homburg', shortCity: 'Bad Homburg' },
            { slug: 'autolackiererei-oberursel', city: 'Oberursel', shortCity: 'Oberursel' },
            { slug: 'autolackiererei-eschborn', city: 'Eschborn', shortCity: 'Eschborn' },
            { slug: 'beulendoktor-bad-vilbel', city: 'Bad Vilbel', shortCity: 'Bad Vilbel' },
            { slug: 'beulendoktor-wetterau', city: 'Wetterau', shortCity: 'Wetterau' },
            { slug: 'beulendoktor-offenbach', city: 'Offenbach', shortCity: 'Offenbach' },
            { slug: 'smart-repair-rhein-main', city: 'Rhein-Main', shortCity: 'Rhein-Main' },
        ],
    },
    {
        id: 'norden',
        label: 'Norden & Wetterau',
        pages: [
            { slug: 'beulendoktor-karben', city: 'Karben', shortCity: 'Karben' },
            { slug: 'beulendoktor-friedrichsdorf', city: 'Friedrichsdorf', shortCity: 'Friedrichsdorf' },
            { slug: 'beulendoktor-rosbach', city: 'Rosbach vor der Höhe', shortCity: 'Rosbach' },
            { slug: 'autolackiererei-friedberg', city: 'Friedberg (Hessen)', shortCity: 'Friedberg' },
            { slug: 'beulendoktor-bad-nauheim', city: 'Bad Nauheim', shortCity: 'Bad Nauheim' },
        ],
    },
    {
        id: 'westen',
        label: 'Taunus & Main-Taunus-Kreis',
        pages: [
            { slug: 'beulendoktor-steinbach', city: 'Steinbach (Taunus)', shortCity: 'Steinbach' },
            { slug: 'autolackiererei-kronberg', city: 'Kronberg im Taunus', shortCity: 'Kronberg' },
            { slug: 'beulendoktor-koenigstein', city: 'Königstein im Taunus', shortCity: 'Königstein' },
            { slug: 'smart-repair-schwalbach', city: 'Schwalbach am Taunus', shortCity: 'Schwalbach' },
            { slug: 'autolackiererei-bad-soden', city: 'Bad Soden am Taunus', shortCity: 'Bad Soden' },
            { slug: 'beulendoktor-kelkheim', city: 'Kelkheim (Taunus)', shortCity: 'Kelkheim' },
            { slug: 'beulendoktor-hofheim', city: 'Hofheim am Taunus', shortCity: 'Hofheim' },
            { slug: 'smart-repair-hattersheim', city: 'Hattersheim am Main', shortCity: 'Hattersheim' },
            { slug: 'beulendoktor-main-taunus-kreis', city: 'Main-Taunus-Kreis', shortCity: 'Main-Taunus-Kreis' },
        ],
    },
    {
        id: 'sueden',
        label: 'Süden, Airport & Kreis Offenbach',
        pages: [
            { slug: 'autolackiererei-neu-isenburg', city: 'Neu-Isenburg', shortCity: 'Neu-Isenburg' },
            { slug: 'beulendoktor-dreieich', city: 'Dreieich', shortCity: 'Dreieich' },
            { slug: 'smart-repair-langen', city: 'Langen (Hessen)', shortCity: 'Langen' },
            { slug: 'beulendoktor-kelsterbach', city: 'Kelsterbach', shortCity: 'Kelsterbach' },
            { slug: 'beulendoktor-dietzenbach', city: 'Dietzenbach', shortCity: 'Dietzenbach' },
            { slug: 'smart-repair-moerfelden-walldorf', city: 'Mörfelden-Walldorf', shortCity: 'Mörfelden-Walldorf' },
            { slug: 'beulendoktor-raunheim', city: 'Raunheim', shortCity: 'Raunheim' },
            { slug: 'autolackiererei-ruesselsheim', city: 'Rüsselsheim am Main', shortCity: 'Rüsselsheim' },
        ],
    },
    {
        id: 'osten',
        label: 'Osten & Main-Kinzig',
        pages: [
            { slug: 'beulendoktor-niederdorfelden', city: 'Niederdorfelden', shortCity: 'Niederdorfelden' },
            { slug: 'beulendoktor-schoeneck', city: 'Schöneck', shortCity: 'Schöneck' },
            { slug: 'autolackiererei-maintal', city: 'Maintal', shortCity: 'Maintal' },
            { slug: 'beulendoktor-muehlheim', city: 'Mühlheim am Main', shortCity: 'Mühlheim' },
            { slug: 'autolackiererei-nidderau', city: 'Nidderau', shortCity: 'Nidderau' },
            { slug: 'autolackiererei-bruchkoebel', city: 'Bruchköbel', shortCity: 'Bruchköbel' },
            { slug: 'autolackiererei-hanau', city: 'Hanau', shortCity: 'Hanau' },
        ],
    },
];

export const CORE_HUB_NAV = REGIONAL_NAV_GROUPS[0].pages;

export const REGIONAL_SLUGS = REGIONAL_NAV_GROUPS.flatMap((group) => group.pages.map((p) => p.slug));
