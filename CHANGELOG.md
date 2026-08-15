# Changelog

## V10.3 – Administrator-Hilfe
- Anleitung für Administratoren direkt in die App integriert.
- Der Button „Anleitung für Administratoren“ erscheint erst nach erfolgreicher Freischaltung des Adminbereichs.
- Enthält Teilnehmerübersicht, Stammdatenpflege, Bilder, Dashboard, technische Updates und Zugriffsübersicht.
- Öffentliche Nachbarn sehen diese Admin-Anleitung nicht.
- Backend unverändert; keine Änderung an Code.gs nötig.

## V10.2 – Hilfe / FAQ
- Neuer, direkt sichtbarer Button „Hilfe / FAQ“ im oberen Bereich.
- Kurzanleitung zur Nutzung direkt in der App integriert.
- Anleitung für Installation auf dem Home-Bildschirm ergänzt.
- iOS: Safari → Teilen → Zum Home-Bildschirm → Hinzufügen.
- Android: Chrome → Drei Punkte → Zum Startbildschirm hinzufügen / App installieren.
- Hilfe funktioniert als eigenes Modal und beeinflusst die restliche App nicht.
- Backend unverändert; keine Änderung an Code.gs nötig.

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
