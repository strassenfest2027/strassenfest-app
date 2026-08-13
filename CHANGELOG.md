# Changelog

## V10.1 – Reliable Data
- Automatische Wiederholungsversuche bei Lesezugriffen.
- Wiederholungen nach 1, 2 und 4 Sekunden.
- Lokaler Cache für Stammdaten, Dashboard und Galerie.
- Letzte bekannte Daten werden beim Start sofort angezeigt.
- Aktuelle Daten werden parallel nachgeladen.
- Temporäre Serverprobleme lassen die Oberfläche nicht mehr leer erscheinen.
- Schreibvorgänge werden nicht automatisch wiederholt, damit keine Doppelbuchungen entstehen.
- Backend unverändert; Code.gs muss nicht geändert werden.

## V10.0
- Langfristige Projektstruktur eingeführt.
- `assets/` in `icons/`, `logo/` und `images/` gegliedert.
- `VERSION.txt` hinzugefügt.
- `CHANGELOG.md` hinzugefügt.
- PWA-Unterstützung sauber eingeführt.
- Service Worker speichert nur die GitHub-Oberfläche.
- Google-Apps-Script-/Sheets-/Drive-Daten werden nicht gecacht.
- HTML, JavaScript, CSS und `config.js` werden bevorzugt aktuell aus dem Netz geladen.
- Backend bleibt unverändert kompatibel mit V9.1.

## V9.2
- Direktpaket für GitHub Desktop.

## V9.1
- Progressive Skeleton-Platzhalter.
- Dashboard priorisiert geladen.
- Galerie nachgelagert.

## V9.0
- Erste eigenständige GitHub-Web-App ohne iframe.
