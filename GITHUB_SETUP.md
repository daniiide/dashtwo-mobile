# 🚀 DashTwo Mobile – GitHub Setup

Hier sind alle Schritte, um das neue `dashtwo-mobile` Repository auf GitHub zu erstellen und den Code hochzuladen.

---

## 📋 Schritt 1: Repository auf GitHub erstellen

1. Gehe zu **https://github.com/new**
2. Fülle die Felder aus:
   - **Repository name:** `dashtwo-mobile`
   - **Description:** `DashTwo Mobile - Twitch Streaming Dashboard für Android (React Native + Expo)`
   - **Visibility:** Public
   - **Add .gitignore:** Node
   - **Add LICENSE:** MIT

3. Klick **Create repository**

---

## 📦 Schritt 2: Code lokal vorbereiten

### Option A: Von Grund auf (empfohlen)

```bash
# 1. Gehe in den Ordner
cd /home/claude/dashtwo-mobile-src

# 2. Git initialisieren
git init

# 3. Remote hinzufügen (ersetze USERNAME mit deinem GitHub-Username)
git remote add origin https://github.com/USERNAME/dashtwo-mobile.git

# 4. Branchen umbenennen (GitHub Standard ist 'main')
git branch -M main

# 5. Alle Dateien hinzufügen
git add -A

# 6. Erster Commit
git commit -m "chore: initial commit - DashTwo Mobile v1.0.0

- Complete React Native + Expo setup
- Twitch OAuth integration
- Follower management with live status
- HLS stream viewer
- IRC chat interface
- IP camera support (Reolink)
- Dark mode UI with purple theme
- Full offline support"

# 7. Zum Remote pushen
git push -u origin main
```

### Option B: Wenn du ein existierendes Repo ändern willst

```bash
cd /path/to/dashtwo-mobile
git remote set-url origin https://github.com/USERNAME/dashtwo-mobile.git
git branch -M main
git push -u origin main
```

---

## 🔐 Schritt 3: Mit PAT pushen

Statt Passwort nutze deinen GitHub Personal Access Token:

```bash
# 1. Token einmalig konfigurieren
git config --global credential.helper store

# 2. Beim nächsten Push wird dich aufgefordert:
# Username: DEIN_GITHUB_USERNAME
# Password: YOUR_PAT (dein PAT)

git push -u origin main
```

---

## 📝 Schritt 4: GitHub Files hinzufügen

### 1. `.gitignore` (Node)

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
.expo-shared/
dist/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
build/
dist/
*.apk
*.aab
```

### 2. `LICENSE` (MIT)

Schon von GitHub hinzugefügt (bei Repo-Erstellung)

### 3. `.github/workflows/ci.yml` (optional – CI/CD)

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Install dependencies
      run: npm install
    
    - name: Lint
      run: npm run lint --if-present
    
    - name: Build
      run: npm run prebuild --if-present
```

---

## 📚 Schritt 5: README & Docs

✅ Schon erstellt! Folgende Dateien sind im Repo:

- **README.md** – Komplette Dokumentation
- **Folder-Structure** – Klar organisiert
- **Code Comments** – Gut dokumentiert

**Optional: Weitere Docs hinzufügen:**

```bash
# SETUP.md – Detaillierte Installations-Anleitung
# ARCHITECTURE.md – App-Architektur
# CONTRIBUTING.md – Contribution Guidelines
# CHANGELOG.md – Version History
```

---

## 🏷️ Schritt 6: Release Tags

Nach dem Initial-Push Tags erstellen:

```bash
# 1. Tag erstellen
git tag -a v1.0.0 -m "Release v1.0.0 - Initial Release

Features:
- Complete app setup with Expo
- Twitch integration
- HLS streaming
- Camera support
- Dark UI theme"

# 2. Tag pushen
git push origin v1.0.0

# 3. Optional: Release auf GitHub erstellen
# Gehe zu https://github.com/USERNAME/dashtwo-mobile/releases
# Click "Create a new release"
# Select tag "v1.0.0"
# Beschreibung hinzufügen
```

---

## 🔗 Zusammenfassung der Git-Commands

```bash
# Kompletter Workflow:
cd /home/claude/dashtwo-mobile-src
git init
git remote add origin https://github.com/USERNAME/dashtwo-mobile.git
git branch -M main
git add -A
git commit -m "chore: initial commit - DashTwo Mobile v1.0.0"
git push -u origin main

# Nach Änderungen:
git add -A
git commit -m "feat: neue funktionalität"
git push origin main

# Tags:
git tag -a v1.0.1 -m "v1.0.1 - Bugfix"
git push origin v1.0.1
```

---

## ✅ Checkliste nach Push

- [ ] Repository auf GitHub sichtbar
- [ ] README.md korrekt angezeigt
- [ ] `package.json` und `App.tsx` im Root
- [ ] `.gitignore` aktiv (node_modules nicht im Repo)
- [ ] Tags für Releases vorhanden
- [ ] GitHub Actions (optional) läuft

---

## 📱 App-Store Vorbereitung (später)

Wenn die App reif für Release ist:

1. **Google Play Store:**
   - APK oder AAB bauen: `eas build --platform android`
   - Developer Account erstellen: $25 einmalig
   - APK hochladen + Store-Listing

2. **GitHub Releases:**
   - APK als Release-Asset hochladen
   - Direkter Download möglich

---

## 🎯 Nächste Schritte

1. ✅ Repository erstellen
2. ✅ Code pushen mit `git push -u origin main`
3. ✅ Credentials konfigurieren (PAT)
4. ✅ Erste Tags & Releases erstellen
5. 🚀 In GitHub-Readme verlinken (von Desktop-DashTwo)

---

## 💡 Pro-Tipps

**Linking in dashtwo (Desktop):**

In der **Desktop-App README** kannst du jetzt verlinken:

```markdown
## 📱 Mobile Companion

Wir haben auch eine **Native Android App** gebaut!

- **Repository:** https://github.com/USERNAME/dashtwo-mobile
- **Features:** Follower, Streams, Chat, Kameras
- **Tech:** React Native + Expo

Zum Starten: `npm install && npm run android`
```

**Synchronisierte Updates:**

```bash
# Update both Repos nach Änderungen
cd ~/dashtwo && git push origin main
cd ~/dashtwo-mobile && git push origin main
```

---

**Ready to push? Let's go! 🚀**

Bei Fragen oder Fehlern: meld dich! 💜

