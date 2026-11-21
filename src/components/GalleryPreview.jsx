import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { galleryItems } from '../data/gallery';
import styles from './Gallery.module.css';

const GalleryPreview = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (!selectedImage) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedImage]);

    return (
        <section id="arbeiten" className={styles.gallery}>
            <div className={styles.inner}>
                <div className="reveal">
                    <span className={styles.kicker}>Referenzen · Vorher &amp; Nachher</span>
                    <h2 className={styles.heading}>Einige unserer Arbeiten</h2>
                    <p className={styles.subtitle}>
                        Echte Ergebnisse aus unserer täglichen Praxis – von der lackschadenfreien Dellenentfernung
                        über Smart Repair bis zur präzisen Lackinstandsetzung. Zum Vergrößern einfach anklicken.
                    </p>
                </div>

                <div className={`${styles.grid} reveal-stagger`}>
                    {galleryItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={styles.item}
                            onClick={() => setSelectedImage(item)}
                            aria-label={`${item.title} vergrößert ansehen`}
                        >
                            <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                            <div className={styles.captionBar}>
                                <span className={styles.category}>{item.category}</span>
                                <span className={styles.itemTitle}>{item.title}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className={styles.moreWrap}>
                    <Link to="/galerie" className={styles.moreButton}>
                        Alle Referenzen &amp; Einblicke ansehen &rarr;
                    </Link>
                </div>
            </div>

            {selectedImage && (
                <div
                    className={styles.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedImage.title}
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() => setSelectedImage(null)}
                        aria-label="Ansicht schließen"
                    >
                        &times;
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage.src} alt={selectedImage.alt} decoding="async" />
                        <p className={styles.lightboxCaption}>{selectedImage.title}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GalleryPreview;
