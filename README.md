# 📱 DashTwo Mobile

**Vollständige Twitch Streaming Dashboard App für Android** (React Native + Expo)

Eine native Mobile-Version der beliebten DashTwo Desktop-App. Streame überall, sieh deine Follower, chatte live und steuere deine Kameras – alles auf deinem Pixel-Phone! 📺

---

## 🎯 Features

- ✅ **Follower Management** – Alle deine Twitch-Follower übersichtlich mit Live-Status
- ✅ **Live Stream Viewer** – Schau Streams in hoher Qualität (HLS)
- ✅ **IRC Chat** – Schreib live im Chat, antworte auf Emotes
- ✅ **IP-Kamera Integration** – Steuere Reolink-Kameras (Tobi & Benni)
- ✅ **Full Offline Support** – Funktioniert auch ohne Desktop-App
- ✅ **Dark Mode** – Beautiful Dark UI, optimiert für Nachts-Streaming
- ✅ **Twitch OAuth** – Sichere Authentifizierung über Twitch

---

## 🚀 Quick Start

### Voraussetzungen
- **Node.js** 18+
- **npm** oder **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Emulator** oder **Pixel Phone**

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/daniiide/dashtwo-mobile.git
cd dashtwo-mobile

# 2. Dependencies installieren
npm install

# 3. App starten
npm run android
# oder für iOS:
npm run ios
```

### Oder mit Expo Go (schneller Test):
```bash
npx expo start --android
# Dann QR-Code im Expo Go App scannen
```

---

## 📱 App-Struktur

```
dashtwo-mobile/
├── src/
│   ├── screens/              # 🔴 Hauptbildschirme
│   │   ├── HomeScreen.tsx    # Follower-List mit Live-Status
│   │   ├── StreamScreen.tsx  # Stream Viewer (HLS)
│   │   ├── ChatScreen.tsx    # IRC Chat
│   │   ├── CameraScreen.tsx  # IP-Kamera Steuerung
│   │   ├── SettingsScreen.tsx # App-Einstellungen
│   │   └── LoginScreen.tsx   # Twitch OAuth
│   ├── stores/               # 🟣 State Management (Zustand)
│   │   └── twitchStore.ts    # Global App State
│   ├── services/             # 🟢 API & Backend
│   │   └── twitchService.ts  # Twitch API Wrapper
│   ├── components/           # Wiederverwendbare UI-Components
│   ├── utils/                # Hilfs-Funktionen
│   └── types/                # TypeScript Types
├── App.tsx                   # Main Entry Point
├── app.json                  # Expo Config
└── package.json              # Dependencies
```

---

## 🔑 Credentials & Configuration

### Twitch Credentials (in `twitchService.ts`):
```javascript
const TWITCH_CLIENT_ID = 's67eqkluw5j6au587foxrgp0v4d665';
```

### Kameras (in `CameraScreen.tsx`):
```javascript
const cameras = [
  {
    name: 'Tobi Kamera',
    ip: '192.168.15.248',
    port: 554,
    username: 'admin',
    password: 'reolink',
  },
  {
    name: 'Benni Kamera',
    ip: '192.168.15.249',
    port: 554,
    username: 'admin',
    password: 'reolink',
  },
];
```

---

## 🎨 UI Theme

**Farben (Dark Mode Palette):**
```css
--bg-dark: #0e0e10;           /* Hintergrund */
--bg-light: #1a1a1e;          /* Secondary Background */
--primary: #9146ff;           /* Twitch Purple */
--accent: #00ff00;            /* Neon Green (Alerts) */
--text-primary: #ffffff;      /* Text */
--text-secondary: #53535f;    /* Subtext */
```

---

## 📡 API Integration

### Twitch Helix API
Die App kommuniziert direkt mit der Twitch Helix API:

```typescript
// Follower laden
const follows = await twitchService.getFollows(userId);

// Stream starten
const stream = await twitchService.getStreamByChannel('channelName');

// Chat-Nachricht senden
await twitchService.sendChatMessage(broadcasterId, message, userId);
```

### HLS Stream
Streams werden über HLS.js abgespielt:
```javascript
const url = `https://usher.twitch.tv/api/channel/hls/${channelName}.m3u8`;
```

### RTSP Kameras
IP-Kameras nutzen RTSP (wird zu HLS konvertiert):
```javascript
const rtspUrl = `rtsp://admin:password@192.168.x.x:554/h264Preview_01_main`;
```

---

## 🧪 Testing

### Debug im Emulator
```bash
npm run android
```

### Debug-Menü öffnen:
- Tablet: Schüttel das Gerät
- Emulator: `Ctrl+M` (Android)

### Network Inspector:
```bash
npx react-native-network-logger
```

---

## 📦 Build & Release

### APK bauen (für Installation auf Pixel):
```bash
eas build --platform android --local
```

### oder mit Expo Cloud:
```bash
eas build --platform android
```

Die APK wird dann heruntergeladen und kann mit:
```bash
adb install app.apk
```
installiert werden.

---

## 🔄 State Management (Zustand)

Die App nutzt **Zustand** für globales State Management:

```typescript
// Store nutzen
const { user, follows, currentStream } = useTwitchStore();

// State ändern
const { setToken, setFollows } = useTwitchStore();
setFollows(newFollows);
```

**Store-Struktur:**
- `token` – Auth-Token
- `user` – Aktueller Nutzer
- `follows` – Alle Follower
- `liveFollows` – Live Follower
- `currentStream` – Aktueller Stream
- `quality` – Stream-Qualität
- `streamVolume` – Lautstärke

---

## 🐛 Troubleshooting

### App startet nicht
```bash
# Cache leeren
rm -rf node_modules package-lock.json
npm install
npm run android
```

### Stream wird nicht geladen
- ✅ Check Internetverbindung (WiFi oder Mobile)
- ✅ Check ob Channel live ist
- ✅ Vielleicht HLS-URL nicht erreichbar (würde über Backend laufen)

### Chat funktioniert nicht
- ✅ Check ob Twitch OAuth-Token gültig ist
- ✅ IRC-Verbindung muss noch implementiert werden

### Kameras verbinden nicht
- ✅ Check ob IP-Adresse korrekt ist
- ✅ Check ob Router beide Geräte sieht (ping test)
- ✅ RTSP zu HLS-Conversion würde über Streamlink-Backend laufen

---

## 🚀 Roadmap (v1.1.0+)

- [ ] IRC Chat-Verbindung (Socket.io)
- [ ] Stream HLS → RTMP Pipeline (per Backend)
- [ ] RTSP → HLS Conversion für Kameras
- [ ] Offline VOD Recording
- [ ] Push Notifications
- [ ] Multi-Stream PiP (Picture-in-Picture)
- [ ] Custom Overlays & Alerts
- [ ] Voice Chat (Discord Integration?)

---

## 📚 Wichtige Dateien

| Datei | Beschreibung |
|-------|-------------|
| `App.tsx` | Navigation & Auth-Flow |
| `src/stores/twitchStore.ts` | Zustand Global State |
| `src/services/twitchService.ts` | Twitch API Wrapper |
| `src/screens/HomeScreen.tsx` | Follower-Liste |
| `src/screens/StreamScreen.tsx` | HLS Stream Player |
| `src/screens/ChatScreen.tsx` | Chat Interface |
| `src/screens/CameraScreen.tsx` | IP-Kamera Steuerung |

---

## 💡 Pro-Tipps

1. **Schneller Development:**
   ```bash
   npm run android
   # App hält sich selbst über Expo aktuell
   ```

2. **Debuggen:**
   - `F12` oder Schüttel-Menü für Debugger
   - React DevTools: `npx react-devtools`

3. **Performance:**
   - Video immer im Hardware-Encoding (HLS.js)
   - Follower-List virtualisiert (FlatList)
   - API-Calls debounced (min. 1 Sekunde)

4. **Sicherheit:**
   - Token in AsyncStorage (verschlüsselt auf Geräte)
   - OAuth redirect_uri muss registriert sein
   - Keine API-Keys im Client-Code!

---

## 📞 Support & Issues

- **Bugs:** GitHub Issues unter https://github.com/daniiide/dashtwo-mobile/issues
- **Features:** Diskussionen auf https://github.com/daniiide/dashtwo-mobile/discussions
- **Chat:** Schreib im Twitch-Chat oder auf Discord

---

## 📄 Lizenz

MIT License © 2025 theDaniii

---

**Happy Streaming! 💜**

Made with ❤️ using React Native + Expo

