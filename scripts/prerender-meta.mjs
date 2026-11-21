import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../src/data/services.js';
import { regionalPages } from '../src/data/regionalPages.js';
import {
    ALL_AREAS_SERVED,
    SITE_URL,
    buildAutoRepairSchema,
    buildFaqSchema,
} from '../src/data/businessSchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatTitle(title) {
    if (!title) return 'Beulendoktor Damiko | Autolackierung, Smart Repair & Dellentechnik';
    return title.includes('Beulendoktor Damiko') || title.includes('Damiko')
        ? title
        : `${title} | Beulendoktor Damiko`;
}

function buildAllRoutes() {
    const routes = [
        {
            slug: '',
            title: 'Autolackierung, Smart Repair & Beulendoktor in Frankfurt',
            description:
                'Beulendoktor Damiko in Frankfurt am Main: Professionelle Autolackierungen, Smart Repair, mobiler Ausbeulservice ohne Lackieren, Hagelschäden & Leasingrückläufer-Service seit 2014.',
            keywords:
                'Autolackiererei Frankfurt, Beulendoktor Frankfurt, Smart Repair Frankfurt, Mobiler Ausbeulservice, Hagelschaden Frankfurt, Leasingrückläufer Rhein-Main, Damiko',
            image: '/images/lackierung-kabine.jpg',
            schema: buildAutoRepairSchema({
                url: `${SITE_URL}/`,
                image: `${SITE_URL}/images/lackierung-kabine.jpg`,
                description:
                    'Seit 2014 Ihr Spezialist für Autolackierungen, Smart Repair, mobilen Ausbeulservice, Hagelschäden und Leasingrückläufer in Frankfurt, Wetterau & Rhein-Main.',
                areaServed: ALL_AREAS_SERVED,
            }),
        },
        {
            slug: 'galerie',
            title: 'Galerie & Referenzen',
            description:
                'Vorher-Nachher-Referenzen von Beulendoktor Damiko: Dellenentfernung ohne Lackieren, Smart Repair, Autolackierung und Fahrzeugaufbereitung.',
            keywords: 'Galerie Beulendoktor Damiko, Vorher Nachher Dellen, Autolackierung Frankfurt Bilder',
            image: '/gallery/arbeit-2-porsche-911.jpg',
        },
        {
            slug: 'impressum',
            title: 'Impressum',
            description: 'Impressum und gesetzliche Angaben von Beulendoktor Damiko (Damiko Dellentechnik), Frankfurt am Main.',
            image: '/images/damiko-logo-shield.png',
        },
        {
            slug: 'datenschutz',
            title: 'Datenschutzerklärung',
            description: 'Datenschutzerklärung gemäß DSGVO und TDDDG für Beulendoktor Damiko (damiko.de).',
            image: '/images/damiko-logo-shield.png',
        },
    ];

    for (const s of services) {
        routes.push({
            slug: s.slug,
            title: s.seoTitle,
            description: s.seoDescription,
            keywords: s.seoKeywords,
            image: s.heroImage,
            schema: s.faqs && s.faqs.length > 0 ? buildFaqSchema(s.faqs) : null,
        });
    }

    for (const p of regionalPages) {
        const schemaList = [
            buildAutoRepairSchema({
                url: `${SITE_URL}/${p.slug}`,
                image: `${SITE_URL}${p.image}`,
                description: p.description,
                areaServed: p.areaServed,
            }),
        ];
        if (p.faqs && p.faqs.length > 0) {
            schemaList.push(buildFaqSchema(p.faqs));
        }

        routes.push({
            slug: p.slug,
            title: p.title,
            description: p.description,
            keywords: p.keywords,
            image: p.image,
            schema: schemaList,
        });
    }

    return routes;
}

function injectMeta(templateHtml, route) {
    const fullTitle = escapeHtml(formatTitle(route.title));
    const desc = escapeHtml(
        route.description ||
            'Beulendoktor Damiko in Frankfurt am Main: Autolackierungen, Smart Repair, mobiler Ausbeulservice & Leasingrückläufer-Service.',
    );
    const keywords = escapeHtml(route.keywords || '');
    const canonicalUrl = route.slug ? `${SITE_URL}/${route.slug}` : `${SITE_URL}/`;
    const imageUrl = route.image?.startsWith('http')
        ? route.image
        : `${SITE_URL}${route.image || '/images/lackierung-kabine.jpg'}`;
    const safeJsonLd = route.schema
        ? JSON.stringify(route.schema).replace(/</g, '\\u003c')
        : '';

    const metaTags = [
        `<meta name="description" content="${desc}" />`,
        keywords ? `<meta name="keywords" content="${keywords}" />` : '',
        `<link rel="canonical" href="${canonicalUrl}" />`,
        `<meta property="og:title" content="${fullTitle}" />`,
        `<meta property="og:description" content="${desc}" />`,
        `<meta property="og:url" content="${canonicalUrl}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:image" content="${imageUrl}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${fullTitle}" />`,
        `<meta name="twitter:description" content="${desc}" />`,
        safeJsonLd ? `<script type="application/ld+json" data-rh="true">${safeJsonLd}</script>` : '',
    ]
        .filter(Boolean)
        .join('\n  ');

    let html = templateHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`);
    html = html.replace('</head>', `  ${metaTags}\n</head>`);
    return html;
}

function main() {
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.error('dist/index.html not found. Run vite build first.');
        process.exit(1);
    }

    const templateHtml = fs.readFileSync(indexPath, 'utf8');
    const routes = buildAllRoutes();

    for (const route of routes) {
        const html = injectMeta(templateHtml, route);
        if (!route.slug) {
            fs.writeFileSync(indexPath, html, 'utf8');
        } else {
            const targetDir = path.join(distDir, route.slug);
            fs.mkdirSync(targetDir, { recursive: true });
            fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
        }
    }

    console.log(`Prerendered SEO meta tags for ${routes.length} routes.`);
}

main();
