import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';
import { galleryItems, workshopHighlights } from '../data/gallery';
import pageStyles from '../styles/PageLayout.module.css';
import galleryStyles from '../components/Gallery.module.css';

const allImages = [...galleryItems, ...workshopHighlights];

const Galerie = () => {
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
        <>
            <SEO
                title="Galerie & Referenzen"
                description="Einblicke in echte Arbeiten von Beulendoktor Damiko: Vorher-Nachher-Ergebnisse aus Dellentechnik, Smart Repair, Autolackierung und Aufbereitung."
                keywords="Galerie Beulendoktor Damiko, Vorher Nachher Dellenentfernung, Autolackierung Beispiele Frankfurt, Smart Repair Ergebnisse"
            />

            <div className={pageStyles.pageContent}>
                <span className={pageStyles.kicker}>Referenzen &amp; Einblicke</span>
                <h1 className={pageStyles.mainTitle}>Galerie – Einige unserer Arbeiten</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', marginBottom: '3rem', fontSize: '1.08rem', lineHeight: 1.7 }}>
                    Überzeugen Sie sich selbst von der Qualität unserer Arbeit – von der lackschadenfreien
                    Dellenentfernung bis zur präzisen Teillackierung und Lackpolitur. Zum Vergrößern einfach anklicken.
                </p>

                <div className={galleryStyles.grid}>
                    {allImages.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            className={galleryStyles.item}
                            onClick={() => setSelectedImage(item)}
                            aria-label={`${item.title} vergrößert ansehen`}
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                loading={index < 3 ? 'eager' : 'lazy'}
                                fetchPriority={index < 3 ? 'high' : 'auto'}
                                decoding="async"
                            />
                            <div className={galleryStyles.captionBar}>
                                <span className={galleryStyles.category}>{item.category}</span>
                                <span className={galleryStyles.itemTitle}>{item.title}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {selectedImage && (
                    <div
                        className={galleryStyles.lightbox}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedImage.title}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            type="button"
                            className={galleryStyles.closeButton}
                            onClick={() => setSelectedImage(null)}
                            aria-label="Ansicht schließen"
                        >
                            &times;
                        </button>
                        <div className={galleryStyles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            <img src={selectedImage.src} alt={selectedImage.alt} decoding="async" />
                            <p className={galleryStyles.lightboxCaption}>{selectedImage.title}</p>
                        </div>
                    </div>
                )}

                <BackButton to="/" label="Zurück zur Startseite" />
            </div>
        </>
    );
};

export default Galerie;
