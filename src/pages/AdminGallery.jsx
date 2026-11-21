import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { invalidateGalleryCache } from '../hooks/useGalleryItems';
import styles from './AdminGallery.module.css';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const CSRF_HEADERS = { 'X-Requested-With': 'fetch' };

const CATEGORIES = [
    'Autolackierung',
    'Lackierung & Smart Repair',
    'Ausbeulservice',
    'Ausbeulservice & Lack',
    'Smart Repair',
    'Leasingrückläufer',
    'Hagelschäden',
    'Fahrzeugaufbereitung',
];

const EMPTY_FORM = {
    title: '',
    category: 'Autolackierung',
    alt: '',
    src: '',
    section: 'referenzen',
};

function getSafePreviewSrc(value) {
    if (typeof value !== 'string') return '';
    const v = value.trim();
    if (v.startsWith('/gallery/') || v.startsWith('/images/')) return v;
    if (
        v.startsWith('data:image/jpeg;base64,') ||
        v.startsWith('data:image/png;base64,') ||
        v.startsWith('data:image/webp;base64,')
    ) {
        return v;
    }
    return '';
}

function compressImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Ungültiges Bildformat.'));
            img.onload = () => {
                const maxDim = 1100;
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Adaptive compression so Data-URL always stays comfortably under API/Firestore limit
                let quality = 0.82;
                let dataUrl = canvas.toDataURL('image/jpeg', quality);
                while (dataUrl.length > 520000 && quality > 0.45) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                }
                resolve(dataUrl);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

const AdminGallery = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [storageConfigured, setStorageConfigured] = useState(true);

    const [items, setItems] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);

    const [status, setStatus] = useState({ type: '', text: '' });
    const [busy, setBusy] = useState(false);

    const loadGallery = useCallback(async () => {
        const res = await fetch('/api/gallery', { credentials: 'same-origin' });
        if (!res.ok) throw new Error('Galerie konnte nicht geladen werden.');
        const data = await res.json();
        setItems(data.items || []);
        setStorageConfigured(data.storageConfigured !== false);
        invalidateGalleryCache();
    }, []);

    const handleSessionExpired = () => {
        setIsAuthenticated(false);
        setEditingId(null);
        setStatus({ type: 'error', text: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.' });
    };

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch('/api/admin-session', { credentials: 'same-origin' });
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok && data.authenticated) {
                    setIsAuthenticated(true);
                    await loadGallery();
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                if (active) setStatus({ type: 'error', text: 'Verbindung zur Admin-API fehlgeschlagen.' });
            } finally {
                if (active) setCheckingSession(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [loadGallery]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setStatus({ type: '', text: '' });

        try {
            const res = await fetch('/api/admin-session', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    ...CSRF_HEADERS,
                },
                body: JSON.stringify({ password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus({ type: 'error', text: data.error || 'Anmeldung fehlgeschlagen.' });
                return;
            }
            setPassword('');
            setIsAuthenticated(true);
            await loadGallery();
        } catch {
            setStatus({ type: 'error', text: 'Netzwerkfehler bei der Anmeldung.' });
        } finally {
            setBusy(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin-session', {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: CSRF_HEADERS,
            });
        } catch {
            // Best effort logout
        }
        setIsAuthenticated(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const validateAndCompress = async (file) => {
        if (!file.type.startsWith('image/')) {
            throw new Error('Bitte wählen Sie eine gültige Bilddatei (JPG, PNG oder WebP) aus.');
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            throw new Error('Die Bilddatei ist zu groß (max. 15 MB).');
        }
        return compressImageFile(file);
    };

    const handleFormFileUpload = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setStatus({ type: '', text: '' });
        try {
            const compressed = await validateAndCompress(file);
            setForm((prev) => ({ ...prev, src: compressed }));
            setStatus({ type: 'success', text: 'Bild erfolgreich fürs Web optimiert – jetzt speichern!' });
        } catch (err) {
            setStatus({ type: 'error', text: err.message });
        }
    };

    const handleQuickReplaceImage = async (item, e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || busy) return;

        setBusy(true);
        setStatus({ type: '', text: '' });
        try {
            const compressed = await validateAndCompress(file);
            const res = await fetch('/api/gallery', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    ...CSRF_HEADERS,
                },
                body: JSON.stringify({
                    id: item.id,
                    src: compressed,
                }),
            });
            if (res.status === 401) {
                handleSessionExpired();
                return;
            }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus({ type: 'error', text: data.error || 'Austauschen fehlgeschlagen.' });
                return;
            }
            await loadGallery();
            setStatus({ type: 'success', text: `Bild „${item.title}“ wurde direkt ausgetauscht!` });
        } catch (err) {
            setStatus({ type: 'error', text: err.message || 'Fehler beim Austauschen.' });
        } finally {
            setBusy(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (busy) return;
        if (!form.title.trim() || !form.src) {
            setStatus({ type: 'error', text: 'Bitte geben Sie einen Titel ein und wählen Sie ein Foto aus.' });
            return;
        }

        setBusy(true);
        setStatus({ type: '', text: '' });
        const wasEditing = Boolean(editingId);

        try {
            const res = await fetch('/api/gallery', {
                method: wasEditing ? 'PUT' : 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    ...CSRF_HEADERS,
                },
                body: JSON.stringify(
                    wasEditing
                        ? { ...form, id: editingId, alt: form.alt.trim() || form.title.trim() }
                        : { ...form, alt: form.alt.trim() || form.title.trim() },
                ),
            });
            if (res.status === 401) {
                handleSessionExpired();
                return;
            }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus({ type: 'error', text: data.error || 'Speichern fehlgeschlagen.' });
                return;
            }
            await loadGallery();
            setForm(EMPTY_FORM);
            setEditingId(null);
            setStatus({
                type: 'success',
                text: wasEditing ? 'Galerie-Eintrag aktualisiert!' : 'Neues Bild zur Galerie hinzugefügt!',
            });
        } catch {
            setStatus({ type: 'error', text: 'Netzwerkfehler beim Speichern.' });
        } finally {
            setBusy(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title || '',
            category: item.category || 'Autolackierung',
            alt: item.alt || '',
            src: item.src || '',
            section: item.section || 'referenzen',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMove = async (index, direction) => {
        const targetIndex = index + direction;
        if (busy || targetIndex < 0 || targetIndex >= items.length) return;

        const current = items[index];
        const neighbor = items[targetIndex];
        const orderA = typeof current.order === 'number' ? current.order : index + 1;
        const orderB = typeof neighbor.order === 'number' ? neighbor.order : targetIndex + 1;
        const nextOrderCurrent = orderA === orderB ? targetIndex + 1 : orderB;
        const nextOrderNeighbor = orderA === orderB ? index + 1 : orderA;

        setBusy(true);
        setStatus({ type: '', text: '' });
        try {
            const headers = { 'Content-Type': 'application/json', ...CSRF_HEADERS };
            const [res1, res2] = await Promise.all([
                fetch('/api/gallery', {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers,
                    body: JSON.stringify({ id: current.id, order: nextOrderCurrent }),
                }),
                fetch('/api/gallery', {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers,
                    body: JSON.stringify({ id: neighbor.id, order: nextOrderNeighbor }),
                }),
            ]);
            if (res1.status === 401 || res2.status === 401) {
                handleSessionExpired();
                return;
            }
            await loadGallery();
        } catch {
            setStatus({ type: 'error', text: 'Reihenfolge konnte nicht geändert werden.' });
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (item) => {
        if (busy) return;
        if (!window.confirm(`Bild „${item.title}“ wirklich aus der Galerie löschen?`)) return;

        setBusy(true);
        setStatus({ type: '', text: '' });
        try {
            const res = await fetch(`/api/gallery?id=${encodeURIComponent(item.id)}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: CSRF_HEADERS,
            });
            if (res.status === 401) {
                handleSessionExpired();
                return;
            }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus({ type: 'error', text: data.error || 'Löschen fehlgeschlagen.' });
                return;
            }
            if (editingId === item.id) {
                setEditingId(null);
                setForm(EMPTY_FORM);
            }
            await loadGallery();
            setStatus({ type: 'success', text: `Bild „${item.title}“ wurde entfernt.` });
        } catch {
            setStatus({ type: 'error', text: 'Netzwerkfehler beim Löschen.' });
        } finally {
            setBusy(false);
        }
    };

    const previewSrc = getSafePreviewSrc(form.src);

    return (
        <>
            <SEO
                title="Galerie-Verwaltung | Beulendoktor Damiko"
                description="Geschützter Verwaltungsbereich für die Galerie von Beulendoktor Damiko."
                noindex
            />

            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.kicker}>Geschützter Bereich</span>
                        <h1 className={styles.title}>Galerie-Verwaltung</h1>
                    </div>
                    <div className={styles.headerActions}>
                        <Link to="/galerie" className={styles.linkBtn}>
                            Live-Galerie ansehen &rarr;
                        </Link>
                        {isAuthenticated && (
                            <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                                Abmelden
                            </button>
                        )}
                    </div>
                </div>

                {status.text && (
                    <div
                        className={`${styles.alert} ${status.type === 'error' ? styles.alertError : styles.alertSuccess}`}
                        role={status.type === 'error' ? 'alert' : 'status'}
                    >
                        {status.text}
                    </div>
                )}

                {checkingSession ? (
                    <div className={styles.card}>
                        <p className={styles.muted}>Sitzung wird geprüft...</p>
                    </div>
                ) : !isAuthenticated ? (
                    <form className={styles.loginCard} onSubmit={handleLogin}>
                        <h2>Admin-Anmeldung</h2>
                        <p className={styles.muted}>
                            Melden Sie sich mit Ihrem Admin-Passwort an, um Bilder in der Galerie und auf der Startseite
                            auszutauschen oder neu hochzuladen.
                        </p>
                        <div className={styles.field}>
                            <label htmlFor="admin-password">Admin-Passwort</label>
                            <input
                                id="admin-password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Passwort eingeben"
                            />
                        </div>
                        <button type="submit" className={styles.primaryBtn} disabled={busy}>
                            {busy ? 'Prüfe...' : 'Anmelden'}
                        </button>
                    </form>
                ) : (
                    <>
                        {!storageConfigured && (
                            <div className={`${styles.alert} ${styles.alertError}`}>
                                Hinweis: <code>FIREBASE_SERVICE_ACCOUNT</code> ist in Vercel noch nicht hinterlegt –
                                Änderungen können erst gespeichert werden, sobald Firebase verbunden ist.
                            </div>
                        )}

                        <form className={styles.card} onSubmit={handleSubmit}>
                            <div className={styles.cardHeader}>
                                <h2>{editingId ? 'Galerie-Eintrag bearbeiten' : 'Neues Bild hinzufügen'}</h2>
                                {editingId && (
                                    <button
                                        type="button"
                                        className={styles.secondaryBtn}
                                        onClick={() => {
                                            setEditingId(null);
                                            setForm(EMPTY_FORM);
                                        }}
                                    >
                                        Abbrechen
                                    </button>
                                )}
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.uploadCol}>
                                    <div className={styles.previewBox}>
                                        {previewSrc ? (
                                            <img src={previewSrc} alt="Vorschau" className={styles.previewImg} />
                                        ) : (
                                            <span className={styles.previewPlaceholder}>Noch kein Foto ausgewählt</span>
                                        )}
                                    </div>
                                    <label className={styles.fileLabel}>
                                        <span>{previewSrc ? 'Anderes Foto wählen' : 'Foto vom Gerät / Handy wählen'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFormFileUpload}
                                            className={styles.hiddenFileInput}
                                        />
                                    </label>
                                    <p className={styles.helperText}>
                                        Bilder werden automatisch im Browser fürs Web verkleinert &amp; komprimiert.
                                    </p>
                                </div>

                                <div className={styles.fieldsCol}>
                                    <div className={styles.field}>
                                        <label htmlFor="gallery-title">Titel / Fahrzeug *</label>
                                        <input
                                            id="gallery-title"
                                            type="text"
                                            required
                                            maxLength={140}
                                            placeholder="z. B. Audi A4 – Teillackierung Kotflügel"
                                            value={form.title}
                                            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                        />
                                    </div>

                                    <div className={styles.twoCol}>
                                        <div className={styles.field}>
                                            <label htmlFor="gallery-category">Kategorie</label>
                                            <select
                                                id="gallery-category"
                                                value={form.category}
                                                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                                            >
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="gallery-section">Anzeige-Bereich</label>
                                            <select
                                                id="gallery-section"
                                                value={form.section}
                                                onChange={(e) => setForm((prev) => ({ ...prev, section: e.target.value }))}
                                            >
                                                <option value="referenzen">Startseite &amp; Galerie</option>
                                                <option value="werkstatt">Nur auf der Galerie-Seite</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.field}>
                                        <label htmlFor="gallery-alt">Bildbeschreibung (optional, gut für Google)</label>
                                        <input
                                            id="gallery-alt"
                                            type="text"
                                            maxLength={240}
                                            placeholder="z. B. Vorher-Nachher-Ergebnis einer Lackierung in Frankfurt"
                                            value={form.alt}
                                            onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
                                        />
                                    </div>

                                    <div className={styles.formActions}>
                                        <button type="submit" className={styles.primaryBtn} disabled={busy || !storageConfigured}>
                                            {busy ? 'Speichere...' : editingId ? 'Änderungen speichern' : 'Bild hinzufügen'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <section className={styles.listSection}>
                            <h2 className={styles.sectionTitle}>Aktuelle Galerie-Bilder ({items.length})</h2>
                            <p className={styles.muted} style={{ marginBottom: '1.5rem' }}>
                                Tipp: Mit <strong>„Foto austauschen“</strong> können Sie direkt ein neues Bild vom Handy
                                oder PC wählen – Titel &amp; Position bleiben dabei erhalten.
                            </p>

                            <div className={styles.grid}>
                                {items.map((item, idx) => (
                                    <article key={item.id} className={styles.itemCard}>
                                        <div className={styles.itemImageWrap}>
                                            <img
                                                src={getSafePreviewSrc(item.src)}
                                                alt={item.alt || item.title}
                                                className={styles.itemImage}
                                                loading="lazy"
                                            />
                                            <span className={styles.sectionBadge}>
                                                {item.section === 'werkstatt' ? 'Nur Galerie' : 'Startseite + Galerie'}
                                            </span>
                                        </div>

                                        <div className={styles.itemBody}>
                                            <span className={styles.itemCategory}>{item.category}</span>
                                            <h3 className={styles.itemTitle}>{item.title}</h3>

                                            <div className={styles.itemActions}>
                                                <label className={styles.replaceBtn}>
                                                    <span>Foto austauschen</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        disabled={busy || !storageConfigured}
                                                        onChange={(e) => handleQuickReplaceImage(item, e)}
                                                        className={styles.hiddenFileInput}
                                                    />
                                                </label>

                                                <button
                                                    type="button"
                                                    className={styles.smallBtn}
                                                    disabled={busy}
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Bearbeiten
                                                </button>

                                                <button
                                                    type="button"
                                                    className={styles.iconBtn}
                                                    disabled={busy || idx === 0 || !storageConfigured}
                                                    onClick={() => handleMove(idx, -1)}
                                                    title="Nach vorne verschieben"
                                                    aria-label="Nach vorne verschieben"
                                                >
                                                    &uarr;
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.iconBtn}
                                                    disabled={busy || idx === items.length - 1 || !storageConfigured}
                                                    onClick={() => handleMove(idx, 1)}
                                                    title="Nach hinten verschieben"
                                                    aria-label="Nach hinten verschieben"
                                                >
                                                    &darr;
                                                </button>

                                                <button
                                                    type="button"
                                                    className={styles.deleteBtn}
                                                    disabled={busy || !storageConfigured}
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    Löschen
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </>
    );
};

export default AdminGallery;
