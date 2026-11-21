import PropTypes from 'prop-types';
import styles from './FaqSection.module.css';

const FaqSection = ({ title = 'Häufige Fragen', kicker = 'Gut zu wissen', faqs }) => {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                <div className="reveal">
                    {kicker && <span className={styles.kicker}>{kicker}</span>}
                    <h2 className={styles.heading}>{title}</h2>
                </div>
                <div className={`${styles.list} reveal-stagger`}>
                    {faqs.map((item) => (
                        <details key={item.q} className={styles.item}>
                            <summary className={styles.question}>{item.q}</summary>
                            <p className={styles.answer}>{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

FaqSection.propTypes = {
    title: PropTypes.string,
    kicker: PropTypes.string,
    faqs: PropTypes.arrayOf(
        PropTypes.shape({
            q: PropTypes.string.isRequired,
            a: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default FaqSection;
