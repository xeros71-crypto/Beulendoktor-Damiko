import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';
import { GALERIE_SEO, buildGallerySchema } from '../data/businessSchema';
import { galleryItems, workshopHighlights } from '../data/gallery';
import pageStyles from '../styles/PageLayout.module.css';
import galleryStyles from '../components/Gallery.module.css';

const allImages = [...galleryItems, ...workshopHighlights];
const gallerySchema = buildGallerySchema();

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
                title={GALERIE_SEO.title}
                description={GALERIE_SEO.description}
                canonicalPath="/galerie"
                image={GALERIE_SEO.image}
                imageAlt={GALERIE_SEO.imageAlt}
                schema={gallerySchema}
            />

            <div className={pageStyles.pageContent}>
                <nav className={pageStyles.breadcrumb} aria-label="Breadcrumb">
                    <Link to="/">Startseite</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Galerie</span>
                </nav>

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
                                width={640}
                                height={640}
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
