import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, schema }) => {
    const siteTitle = 'Beulendoktor Damiko';
    const fullTitle = title
        ? (title.includes(siteTitle) ? title : `${title} | ${siteTitle}`)
        : `${siteTitle} | Autolackierung, Smart Repair & Dellentechnik`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema).replace(/</g, '\\u003c')}
                </script>
            )}
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default SEO;
