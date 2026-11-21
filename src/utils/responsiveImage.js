const LOCAL_JPG_RE = /^\/(?:images|gallery)\/[^/]+\.jpg$/i;

export function getResponsiveWebpSrcSet(src) {
    if (typeof src !== 'string' || !LOCAL_JPG_RE.test(src)) {
        return null;
    }
    const base = src.replace(/\.jpg$/i, '');
    return `${base}-640w.webp 640w, ${base}-960w.webp 960w`;
}

export const LOGO_FALLBACK_SRC = '/images/damiko-lack-beulendoktor-logo.png';
export const LOGO_WEBP_96 = '/images/damiko-lack-beulendoktor-logo-96w.webp';
export const LOGO_WEBP_320 = '/images/damiko-lack-beulendoktor-logo-320w.webp';
export const LOGO_WEBP_480 = '/images/damiko-lack-beulendoktor-logo-480w.webp';
