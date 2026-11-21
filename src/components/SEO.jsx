import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    BUSINESS_INFO,
    DEFAULT_OG_IMAGE,
    DEFAULT_OG_IMAGE_ALT,
    SITE_URL,
    formatSeoTitle,
    serializeJsonLd,
} from '../data/businessSchema';

const SEO = ({
    title,
    description,
    canonicalPath,
    image = DEFAULT_OG_IMAGE,
    imageAlt = DEFAULT_OG_IMAGE_ALT,
    noindex = false,
    schema,
}) => {
    const { pathname } = useLocation();
    if (typeof document === 'undefined') {
        return null;
    }

    const fullTitle = formatSeoTitle(title);

    const normalizedPath = canonicalPath !== undefined
        ? canonicalPath
        : pathname === '/'
            ? '/'
            : pathname.replace(/\/+$/, '');

    const canonicalUrl = noindex
        ? null
        : normalizedPath === '/'
            ? `${SITE_URL}/`
            : `${SITE_URL}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;

    const imageUrl = image?.startsWith('http')
        ? image
        : `${SITE_URL}${image || DEFAULT_OG_IMAGE}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta
                name="robots"
                content={
                    noindex
                        ? 'noindex, nofollow'
                        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
                }
            />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            <meta property="og:locale" content="de_DE" />
            <meta property="og:site_name" content={BUSINESS_INFO.name} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:type" content="website" />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={imageAlt} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            {schema && (
                <script type="application/ld+json">
                    {serializeJsonLd(schema)}
                </script>
            )}
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    canonicalPath: PropTypes.string,
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    noindex: PropTypes.bool,
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default SEO;
