import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './BackButton.module.css';

const BackButton = ({ to = '/', label = 'Zurück zur Übersicht' }) => {
    return (
        <div className={styles.container}>
            <Link to={to} className={styles.button}>
                &larr; {label}
            </Link>
        </div>
    );
};

BackButton.propTypes = {
    to: PropTypes.string,
    label: PropTypes.string,
};

export default BackButton;
