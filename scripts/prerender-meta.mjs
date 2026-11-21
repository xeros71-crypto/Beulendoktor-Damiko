import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { services } from '../src/data/services.js';
import { regionalPages } from '../src/data/regionalPages.js';
import { galleryItems, workshopHighlights } from '../src/data/gallery.js';
import {
    BUSINESS_INFO,
    HOME_FAQS,
    HOME_SEO,
    SITE_URL,
    buildGalleryPageSchema,
    buildHomeSchema,
    buildRegionalPageSchema,
    buildServicePageSchema,
} from '../src/data/businessSchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const ssrDir = path.join(rootDir, 'dist-ssr');
const publicDir = path.join(rootDir, 'public');

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatTitle(title) {
    if (!title) return HOME_SEO.title;
    return title.includes('Damiko') ? title : `${title} | ${BUSINESS_INFO.name}`;
}

function buildAllRoutes() {
    const routes = [
        {
            slug: '',
            priority: '1.0',
            changefreq: 'weekly',
            title: HOME_SEO.title,
            description: HOME_SEO.description,
            keywords: HOME_SEO.keywords,
            image: HOME_SEO.image,
            imageAlt: HOME_SEO.imageAlt,
            schema: buildHomeSchema(HOME_FAQS),
        },
        {
            slug: 'galerie',
            priority: '0.8',
            changefreq: 'monthly',
            title: 'Referenzen & Galerie – Autolackierer Frankfurt',
            description:
                'Vorher-Nachher-Referenzen von Beulendoktor Damiko in Frankfurt: Autolackierung, Teillackierung, Smart Repair & lackschadenfreie Dellenentfernung.',
            keywords:
                'Galerie Autolackierer Frankfurt, Vorher Nachher Autolackierung Frankfurt, Beulendoktor Damiko Referenzen, Smart Repair Ergebnisse Frankfurt',
            image: '/gallery/arbeit-2-porsche-911.jpg',
            imageAlt: 'Vorher-Nachher-Referenzen für Autolackierung und Dellentechnik in Frankfurt',
            schema: buildGalleryPageSchema([...galleryItems, ...workshopHighlights]),
        },
        {
            slug: 'impressum',
            noindex: true,
            title: 'Impressum',
            description: `Impressum und gesetzliche Anbieterkennzeichnung von ${BUSINESS_INFO.name} (${BUSINESS_INFO.legalName}), ${BUSINESS_INFO.street}, ${BUSINESS_INFO.postalCode} ${BUSINESS_INFO.city}.`,
            image: '/images/damiko-logo-shield.png',
            imageAlt: 'Beulendoktor Damiko Logo',
        },
        {
            slug: 'datenschutz',
            noindex: true,
            title: 'Datenschutzerklärung',
            description: `Datenschutzerklärung gemäß DSGVO und TDDDG für ${BUSINESS_INFO.name} (damiko.de).`,
            image: '/images/damiko-logo-shield.png',
            imageAlt: 'Beulendoktor Damiko Logo',
        },
        {
            slug: 'admin',
            noindex: true,
            title: 'Galerie-Verwaltung',
            description: `Geschützter Verwaltungsbereich für die Galerie von ${BUSINESS_INFO.name}.`,
            image: '/images/damiko-logo-shield.png',
            imageAlt: 'Beulendoktor Damiko Logo',
        },
    ];

    for (const s of services) {
        routes.push({
            slug: s.slug,
            priority: s.slug === 'lackierungen' ? '0.95' : '0.9',
            changefreq: 'monthly',
            title: s.seoTitle,
            description: s.seoDescription,
            keywords: s.seoKeywords,
            image: s.heroImage,
            imageAlt: s.heroImageAlt,
            schema: buildServicePageSchema(s),
        });
    }

    for (const p of regionalPages) {
        routes.push({
            slug: p.slug,
            priority: p.priority || (p.slug === 'autolackiererei-frankfurt' ? '0.95' : '0.8'),
            changefreq: 'monthly',
            title: p.title,
            description: p.description,
            keywords: p.keywords,
            image: p.image,
            imageAlt: p.imageAlt || `Autolackierer & Beulendoktor Damiko für ${p.city}`,
            schema: buildRegionalPageSchema(p),
        });
    }

    return routes;
}

function injectRouteHtml(templateHtml, route, appHtml) {
    const fullTitle = escapeHtml(formatTitle(route.title));
    const desc = escapeHtml(route.description || HOME_SEO.description);
    const keywords = escapeHtml(route.keywords || '');
    const canonicalUrl = route.slug ? `${SITE_URL}/${route.slug}` : `${SITE_URL}/`;
    const imageUrl = route.image?.startsWith('http')
        ? route.image
        : `${SITE_URL}${route.image || HOME_SEO.image}`;
    const imageAlt = escapeHtml(route.imageAlt || HOME_SEO.imageAlt);
    const safeJsonLd = route.schema
        ? JSON.stringify(route.schema).replace(/</g, '\\u003c')
        : '';

    const robotsContent = route.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const metaTags = [
        `<meta name="description" content="${desc}" data-rh="true" />`,
        keywords ? `<meta name="keywords" content="${keywords}" data-rh="true" />` : '',
        `<meta name="robots" content="${robotsContent}" data-rh="true" />`,
        !route.noindex ? `<link rel="canonical" href="${canonicalUrl}" data-rh="true" />` : '',
        `<meta property="og:locale" content="de_DE" data-rh="true" />`,
        `<meta property="og:site_name" content="${escapeHtml(BUSINESS_INFO.name)}" data-rh="true" />`,
        `<meta property="og:title" content="${fullTitle}" data-rh="true" />`,
        `<meta property="og:description" content="${desc}" data-rh="true" />`,
        !route.noindex ? `<meta property="og:url" content="${canonicalUrl}" data-rh="true" />` : '',
        `<meta property="og:type" content="website" data-rh="true" />`,
        `<meta property="og:image" content="${imageUrl}" data-rh="true" />`,
        `<meta property="og:image:alt" content="${imageAlt}" data-rh="true" />`,
        `<meta name="twitter:card" content="summary_large_image" data-rh="true" />`,
        `<meta name="twitter:title" content="${fullTitle}" data-rh="true" />`,
        `<meta name="twitter:description" content="${desc}" data-rh="true" />`,
        `<meta name="twitter:image" content="${imageUrl}" data-rh="true" />`,
        safeJsonLd ? `<script type="application/ld+json" data-rh="true">${safeJsonLd}</script>` : '',
    ]
        .filter(Boolean)
        .join('\n  ');

    let html = templateHtml.replace(/<title>[\s\S]*?<\/title>/, `<title data-rh="true">${fullTitle}</title>`);
    html = html.replace('</head>', `  ${metaTags}\n</head>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    return html;
}

function buildSitemapXml(routes) {
    const today = new Date().toISOString().slice(0, 10);
    const urls = routes
        .filter((route) => !route.noindex)
        .map((route) => {
            const loc = route.slug ? `${SITE_URL}/${route.slug}` : `${SITE_URL}/`;
            return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq || 'monthly'}</changefreq>\n    <priority>${route.priority || '0.7'}</priority>\n  </url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
    const indexPath = path.join(distDir, 'index.html');
    const ssrEntryPath = path.join(ssrDir, 'entry-server.js');

    if (!fs.existsSync(indexPath)) {
        console.error('dist/index.html not found. Run vite build first.');
        process.exit(1);
    }

    if (!fs.existsSync(ssrEntryPath)) {
        console.error('dist-ssr/entry-server.js not found. Run vite build --ssr first.');
        process.exit(1);
    }

    const { render } = await import(pathToFileURL(ssrEntryPath).href);
    const templateHtml = fs.readFileSync(indexPath, 'utf8');
    const routes = buildAllRoutes();

    for (const route of routes) {
        const routeUrl = route.slug ? `/${route.slug}` : '/';
        const { html: appHtml } = render(routeUrl);
        const fullHtml = injectRouteHtml(templateHtml, route, appHtml);

        if (!route.slug) {
            fs.writeFileSync(indexPath, fullHtml, 'utf8');
        } else {
            // Write flat <slug>.html for Vercel cleanUrls: true & trailingSlash: false (HTTP 200 without 308 redirect)
            fs.writeFileSync(path.join(distDir, `${route.slug}.html`), fullHtml, 'utf8');
        }
    }

    // Keep sitemap.xml synced in both dist/ and public/
    const sitemapXml = buildSitemapXml(routes);
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

    // Clean up temporary SSR build folder
    fs.rmSync(ssrDir, { recursive: true, force: true });

    console.log(`Prerendered full static HTML & SEO metadata for ${routes.length} routes + updated sitemap.xml.`);
}

main().catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
});
