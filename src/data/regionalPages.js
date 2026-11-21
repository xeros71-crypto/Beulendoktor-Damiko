import { coreRegionalPages } from './regional/coreRegions.js';
import { northWetterauPages } from './regional/northWetterau.js';
import { westTaunusPages } from './regional/westTaunus.js';
import { southOffenbachPages } from './regional/southOffenbach.js';
import { eastMainKinzigPages } from './regional/eastMainKinzig.js';

export const regionalPages = [
    ...coreRegionalPages,
    ...northWetterauPages,
    ...westTaunusPages,
    ...southOffenbachPages,
    ...eastMainKinzigPages,
];

export const REGIONAL_GROUPS = [
    {
        id: 'kerngebiet',
        label: 'Frankfurt & Kerngebiet',
        pages: coreRegionalPages,
    },
    {
        id: 'norden',
        label: 'Norden & Wetterau',
        pages: northWetterauPages,
    },
    {
        id: 'westen',
        label: 'Taunus & Westen',
        pages: westTaunusPages,
    },
    {
        id: 'sueden',
        label: 'Süden & Kreis Offenbach',
        pages: southOffenbachPages,
    },
    {
        id: 'osten',
        label: 'Osten & Main-Kinzig',
        pages: eastMainKinzigPages,
    },
];

export const CORE_HUB_SLUGS = coreRegionalPages.map((page) => page.slug);

const regionalPagesBySlug = new Map(regionalPages.map((item) => [item.slug, item]));

export function getRegionalPageBySlug(slug) {
    return regionalPagesBySlug.get(slug);
}

export function getNearbyRegionalPages(page) {
    if (page?.nearbySlugs && page.nearbySlugs.length > 0) {
        return page.nearbySlugs
            .map((slug) => regionalPagesBySlug.get(slug))
            .filter((item) => item && item.slug !== page.slug);
    }

    return regionalPages.filter((item) => item.slug !== page?.slug).slice(0, 8);
}
