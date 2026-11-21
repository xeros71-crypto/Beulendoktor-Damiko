import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.error('UI ErrorBoundary:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        minHeight: '70vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#fff',
                    }}
                >
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Etwas ist schiefgelaufen</h1>
                    <p style={{ color: '#cfcbe0', maxWidth: '480px', marginBottom: '2rem' }}>
                        Beim Laden dieser Ansicht ist ein unerwarteter Fehler aufgetreten. Bitte laden Sie die Seite neu.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.85rem 1.75rem',
                            border: '1px solid #fef579',
                            borderRadius: '8px',
                            background: 'rgba(254, 245, 121, 0.12)',
                            color: '#fef579',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        Seite neu laden
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
