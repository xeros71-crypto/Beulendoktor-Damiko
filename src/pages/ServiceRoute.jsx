import PropTypes from 'prop-types';
import { getServiceBySlug } from '../data/services';
import ServiceDetailPage from './ServiceDetailPage';
import NotFound from './NotFound';

const ServiceRoute = ({ slug }) => {
    const service = getServiceBySlug(slug);
    if (!service) return <NotFound />;
    return <ServiceDetailPage service={service} />;
};

ServiceRoute.propTypes = {
    slug: PropTypes.string.isRequired,
};

export default ServiceRoute;
