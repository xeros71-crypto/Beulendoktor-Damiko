import { Link } from 'react-router-dom';
import { services } from '../data/services';
import styles from './ServicesOverview.module.css';

const ServicesOverview = () => {
    return (
        <section id="leistungen" className={styles.section}>
            <div className={styles.inner}>
                <div className="reveal">
                    <span className={styles.kicker}>Autolackierer &amp; Dellentechnik in Frankfurt</span>
                    <h2 className={styles.heading}>Autolackierung, Smart Repair &amp; Beulendoktor aus einer Hand</h2>
                    <p className={styles.subtitle}>
                        Von der exakten Teillackierung (Stoßstange, Kotflügel, Tür) in unserer Lackierkabine über
                        Smart Repair und lackschadenfreies Ausbeulen bis zum kompletten Leasingrückläufer-Service in Frankfurt am Main.
                    </p>
                </div>

                <div className={`${styles.grid} reveal-stagger`}>
                    {services.map((service) => (
                        <Link key={service.slug} to={`/${service.slug}`} className={styles.card}>
                            <div className={styles.imageWrap}>
                                <img
                                    src={service.heroImage}
                                    alt={service.heroImageAlt}
                                    className={styles.cardImage}
                                    width={640}
                                    height={426}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className={styles.imageVignette} aria-hidden="true" />
                                <span className={styles.badge}>{service.navLabel}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{service.shortTitle}</h3>
                                <p className={styles.cardDesc}>{service.shortDesc}</p>
                                <span className={styles.cardLink}>
                                    <span>Mehr erfahren</span>
                                    <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesOverview;
