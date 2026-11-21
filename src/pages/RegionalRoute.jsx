import PropTypes from 'prop-types';
import { getRegionalPageBySlug } from '../data/regionalPages';
import RegionalLandingPage from './RegionalLandingPage';
import NotFound from './NotFound';

const RegionalRoute = ({ slug }) => {
    const page = getRegionalPageBySlug(slug);
    if (!page) return <NotFound />;
    return <RegionalLandingPage page={page} />;
};

RegionalRoute.propTypes = {
    slug: PropTypes.string.isRequired,
};

export default RegionalRoute;
