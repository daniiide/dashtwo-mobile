# ⚡ DashTwo Mobile – Quick Start (5 Min)

**Für die eiligen unter euch** 😉

---

## 🚀 Super-Schnell-Setup

### Step 1: Alles runterladbar!

```bash
# Projekt-Ordner öffnen
cd dashtwo-mobile

# Dependencies installieren (2 Min)
npm install

# Fertig! ✅
```

### Step 2: App starten (wähle eine Option)

**Option A – Mit Emulator (schnellste Variante):**
```bash
npm run android
# → Android Emulator öffnet sich
# → App startet automatisch
```

**Option B – Mit echtem Pixel Phone:**
```bash
npm run android
# → Handy per USB verbinden
# → App installiert und startet
```

**Option C – Mit Expo Go (kein Build nötig):**
```bash
npx expo start --android
# → QR-Code mit Handy einscannen (Expo Go App)
# → Live im Emulator/Phone
```

### Step 3: Teste die App

- 🔐 Login: Klick auf **"Mit Twitch anmelden"** oder **"Demo anschauen"**
- 📺 HomeScreen: Alle deine Follower (Grid)
- 🎥 StreamScreen: Stream Player
- 💬 ChatScreen: Chat Interface
- 🎬 CameraScreen: Kamera Steuerung
- ⚙️ SettingsScreen: Einstellungen

### Step 4: Zum GitHub pushen

```bash
# 1. Repository erstellen: https://github.com/new
# Name: dashtwo-mobile
# Public + MIT License

# 2. Code pushen:
git init
git remote add origin https://github.com/YOUR_NAME/dashtwo-mobile.git
git branch -M main
git add -A
git commit -m "chore: initial commit - DashTwo Mobile v1.0.0"
git push -u origin main

# ✅ Fertig!
```

---

## 🔧 Wichtigste Commands

```bash
# Starten
npm run android              # Mit Emulator
npx expo start --android     # Mit Expo Go

# Debuggen
npm run android              # Debug-Menü: Handy schütteln

# Build für APK (zum installieren)
eas build --platform android --local

# Cache leeren (wenn Fehler)
rm -rf node_modules package-lock.json && npm install
```

---

## 🎯 Was funktioniert schon?

✅ Bottom Tab Navigation (5 Screens)  
✅ Twitch OAuth Login  
✅ Follower-Liste mit Live-Status  
✅ HLS Stream Player  
✅ Chat Interface  
✅ Kamera-Steuerung (UI)  
✅ Dark Mode Theme  
✅ Zustand State Management  

---

## ⚠️ Was braucht noch Backend?

Diese Features brauchen noch einen Server:

- 🔴 **IRC Chat** – Echte Twitch Chat Verbindung (Socket.io)
- 🔴 **HLS Stream URL** – Streamlink oder ähnlich
- 🔴 **RTSP→HLS** – Kamera-Conversion (FFmpeg)

→ Momentan sind das **Mock/Demo-Implementierungen**

---

## 📱 Auf Pixel Phone installieren

```bash
# 1. APK bauen
eas build --platform android --local

# 2. Heruntergeladen: dashtwo-mobile.apk

# 3. Auf Phone übertragen und installieren
adb install dashtwo-mobile.apk

# ✅ App ist jetzt auf Phone!
```

---

## 🐛 Häufige Fehler

### "npm: command not found"
→ Node.js installieren von https://nodejs.org

### "Android Emulator startet nicht"
→ Android Studio Emulator starten BEVOR `npm run android`

### "npm install dauert ewig"
→ Mit `npm ci` statt `npm install` schneller

### "App startet aber zeigt nur Weißer Screen"
→ Handy schütteln → Open DevTools → Fehler im Terminal?

---

## 📚 Weiterführende Links

- **Ausführliche Docs:** README.md
- **GitHub Setup:** GITHUB_SETUP.md
- **Komplette Übersicht:** SUMMARY.md
- **Expo Docs:** https://docs.expo.dev
- **Twitch API:** https://dev.twitch.tv/docs/api

---

## ✅ Fertig!

Du hast jetzt eine **funktionierende Mobile App**! 🎉

Nächster Schritt: **Zu GitHub pushen** und dann die fehlenden Features implementieren.

---

**Fragen? Schau in die anderen .md Dateien!** 💜

