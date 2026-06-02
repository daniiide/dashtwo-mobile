# 🎯 DashTwo Mobile – Komplette Übersicht

---

## 📁 Projekt-Struktur

```
dashtwo-mobile/
│
├── 📄 App.tsx                          ← MAIN: Navigation + Auth
├── 📄 app.json                         ← Expo Config
├── 📄 babel.config.js                  ← Babel Setup
├── 📄 tsconfig.json                    ← TypeScript Config
├── 📄 eas.json                         ← EAS Build Config
├── 📄 package.json                     ← Dependencies
│
├── 📚 Dokumentation/
│   ├── README.md                       ← Komplette Doku
│   ├── QUICKSTART.md                   ← 5-Min Anleitung
│   ├── SUMMARY.md                      ← Was wurde gebaut?
│   ├── GITHUB_SETUP.md                 ← GitHub Integration
│   └── ÜBERBLICK.md                    ← Diese Datei
│
└── 📂 src/
    ├── 📂 screens/                     ← 6 App-Screens
    │   ├── LoginScreen.tsx             🔐 Twitch OAuth
    │   ├── HomeScreen.tsx              🏠 Follower-Liste
    │   ├── StreamScreen.tsx            📺 HLS Player
    │   ├── ChatScreen.tsx              💬 IRC Chat
    │   ├── CameraScreen.tsx            🎥 Kameras
    │   └── SettingsScreen.tsx          ⚙️ Settings
    │
    ├── 📂 stores/                      ← State Management
    │   └── twitchStore.ts              🟣 Zustand Global Store
    │
    ├── 📂 services/                    ← API + Backend
    │   └── twitchService.ts            🌐 Twitch API Wrapper
    │
    ├── 📂 components/                  ← Wiederverwendbar (leer, can expand)
    ├── 📂 utils/                       ← Helper-Functions (leer, can expand)
    └── 📂 types/                       ← TypeScript Types (leer, can expand)
```

---

## 🎨 App Navigation (Bottom Tabs)

```
┌──────────────────────────────────────┐
│                                      │
│  [Active Screen Content]             │
│                                      │
├──────────────────────────────────────┤
│ 🏠 Home  📺 Stream  💬 Chat  🎥 Cam ⚙️ |  ← Tab Bar
└──────────────────────────────────────┘
```

### **Tab 1: HomeScreen 🏠**
```
┌─────────────────────────────┐
│  Live: 3  Follower: 127    │  ← Statistiken
├─────────────────────────────┤
│ 🔍 Suche... ⬇️ Sortieren    │  ← Filter Bar
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────┐    │
│ │ Follower│ │ Follower│    │  ← 2-Column Grid
│ │ 1 LIVE  │ │ 2       │    │
│ └─────────┘ └─────────┘    │
│ ┌─────────┐ ┌─────────┐    │
│ │ Follower│ │ Follower│    │
│ │ 3       │ │ 4 LIVE  │    │
│ └─────────┘ └─────────┘    │
└─────────────────────────────┘
```

### **Tab 2: StreamScreen 📺**
```
┌──────────────────────────┐
│    HLS Video Player      │  (50% screen height)
│    [▶ Stream]            │
└──────────────────────────┤
│ ▶  Channel Name      ❤️  │  ← Header Info
│ 🔴 LIVE • 1,234 viewers │
├──────────────────────────┤
│ "Awesome Stream Title"   │  ← Stream Info
│ Playing: Game Name       │
├──────────────────────────┤
│ 🔊 Volume ▓▓▓▓░░░░ 75%   │  ← Controls
├──────────────────────────┤
│ [Chat] [Share] [Follow]  │  ← Action Buttons
└──────────────────────────┘
```

### **Tab 3: ChatScreen 💬**
```
┌──────────────────────────┐
│ User1: Hey!              │
│ User2: Awesome stream!   │  ← Chat Messages
│ Streamer: Thanks!        │
│ User3: LUL               │
├──────────────────────────┤
│ [Message input field...] │
│                    [Send]│  ← Input Bar
└──────────────────────────┘
```

### **Tab 4: CameraScreen 🎥**
```
┌──────────────────────────┐
│ [Tobi] [Benni]           │  ← Camera Tabs
├──────────────────────────┤
│ 🎥 Live Feed: Tobi       │  ← Video Placeholder
│   (16:9 Aspect)          │
├──────────────────────────┤
│ 🔊 Volume ▓▓▓▓░░░░ 0%    │  ← Controls
│ [Brightness] [Contrast]  │
│ [Flip] [Rotate]          │
├──────────────────────────┤
│ Model: Reolink E1 Pro    │
│ Status: 🟢 Online        │  ← Info
└──────────────────────────┘
```

### **Tab 5: SettingsScreen ⚙️**
```
┌──────────────────────────┐
│ 👤 theDaniii      [Logout]│  ← User Card
├──────────────────────────┤
│ 📺 Video Quality  720p60 │
│ ▶️  Autoplay       [ON]   │  ← Stream Settings
├──────────────────────────┤
│ 🔔 Live Notifications  [ON]
│ 💬 Chat Alerts       [ON] │  ← Notifications
├──────────────────────────┤
│ 🌙 Dark Mode         [ON] │  ← Display
│ 🎥 Kamera 1: 192.168... │
│ 🎥 Kamera 2: 192.168... │  ← Cameras
├──────────────────────────┤
│ [Abmelden]               │
└──────────────────────────┘
```

---

## 🧠 State Management (Zustand Store)

```
┌─────────────────────────────────────┐
│      useTwitchStore() Global State   │
├─────────────────────────────────────┤
│                                     │
│  AUTH:                              │
│  ├─ token: string                   │
│  ├─ isAuthenticated: boolean        │
│  └─ user: TwitchUser                │
│                                     │
│  CONTENT:                           │
│  ├─ follows: Follow[]               │
│  ├─ liveFollows: Follow[]           │
│  ├─ currentStream: TwitchStream     │
│  └─ currentChannel: string          │
│                                     │
│  SETTINGS:                          │
│  ├─ quality: '720p60' | '1080p60'   │
│  ├─ streamVolume: 0-100             │
│  ├─ cameraVolume: 0-100             │
│  └─ notificationsEnabled: boolean   │
│                                     │
│  UI STATE:                          │
│  ├─ isLoading: boolean              │
│  └─ error: string | null            │
│                                     │
└─────────────────────────────────────┘
```

---

## 🌐 API Integration

```
┌──────────────────────────────────────┐
│         twitchService.ts             │
│    (API Wrapper + Local Storage)     │
├──────────────────────────────────────┤
│                                      │
│  Public Methods:                     │
│  ├─ getStoredToken()                 │
│  ├─ saveToken(token)                 │
│  ├─ getUserData(token)                │
│  ├─ getFollows(userId)                │
│  ├─ getStreamByChannel(name)          │
│  ├─ getGame(gameName)                 │
│  ├─ sendChatMessage(...)              │
│  ├─ getStreamUrl(channel)             │
│  └─ clearStorage()                    │
│                                      │
│  Private Methods:                    │
│  └─ getFollowsLiveStatus(follows)     │
│                                      │
└──────────────────────────────────────┘
         │
         ├─→ AsyncStorage (Token, User)
         │
         └─→ Twitch Helix API
             https://api.twitch.tv/helix/
             ├─ /users
             ├─ /users/follows
             ├─ /streams
             ├─ /games
             └─ /chat/messages
```

---

## 🔐 Auth Flow

```
┌─────────────────────────────┐
│     App Starts              │
├─────────────────────────────┤
│                             │
│  App.tsx useEffect:         │
│  └─ checkAuth() ?           │
│     ├─ Ist Token gespeichert│
│     ├─ Ja: Navigate Main    │
│     └─ Nein: Navigate Login │
│                             │
├─────────────────────────────┤
│     LoginScreen             │
├─────────────────────────────┤
│                             │
│  [Twitch anmelden] ────┐    │
│  [Demo anschauen]    ┌─┴──┐
│                      │    │
│                      ↓    ↓
│              OAuth URL   Mock
│                      │    │
│         ┌────────────┴────┘
│         │
│    Browser opens
│    Twitch Login
│         │
│    Redirect with code
│         │
│    Exchange code → token
│         │
│    Save to AsyncStorage
│         │
│    setToken() in Store
│         │
│    getUser() from API
│         │
│    Navigate → MainTabs
│         │
│    ✅ App Ready!
│
└─────────────────────────────┘
```

---

## 📱 Screen Flows

### **HomeScreen Flow**
```
HomeScreen.tsx
├─ useFocusEffect
│  └─ loadFollows() → twitchService.getFollows()
│     └─ Followed users + live status
├─ renderFollowItem()
│  ├─ Image + Thumbnail
│  ├─ Live Badge
│  ├─ Channel Name
│  ├─ Game Name
│  └─ onPress → navigate StreamScreen
└─ Filter & Sort
   ├─ Search by name/game
   └─ Sort: watch/asc/desc
```

### **StreamScreen Flow**
```
StreamScreen.tsx
├─ route.params.channel
├─ useEffect
│  └─ loadStream(channel)
│     └─ getStreamByChannel() → stream data
├─ HLSPlayer
│  ├─ url = Twitch HLS URL
│  ├─ autoplay
│  └─ controls
└─ Stream Info Panel
   ├─ Title
   ├─ Game
   ├─ Viewer Count
   └─ Action Buttons [Chat][Share][Follow]
```

### **ChatScreen Flow**
```
ChatScreen.tsx
├─ useEffect
│  └─ connectToChat(channel)
│     └─ IRC connection (placeholder)
├─ FlatList Messages
│  ├─ Username (colored)
│  └─ Message Text
└─ Input Bar
   ├─ TextInput message
   └─ [Send] → sendChatMessage()
```

### **CameraScreen Flow**
```
CameraScreen.tsx
├─ State: cameras[]
│  ├─ { name, ip, port, isOnline }
│  └─ { name, ip, port, isOnline }
├─ Tab Selector
│  └─ Select camera → loadCamera()
├─ Feed Display
│  ├─ If online: RTSP → HLS placeholder
│  └─ If offline: Offline message
└─ Controls
   ├─ Volume slider
   ├─ Brightness/Contrast/Flip/Rotate
   └─ Toggle Power
```

### **SettingsScreen Flow**
```
SettingsScreen.tsx
├─ User Card
│  ├─ Avatar
│  ├─ Name
│  └─ [Logout]
├─ Stream Settings
│  ├─ Quality selector
│  └─ Autoplay toggle
├─ Notifications
│  ├─ Live notifications
│  └─ Chat alerts
├─ Display
│  ├─ Dark mode
│  └─ Font size
├─ Cameras
│  ├─ Camera 1 settings
│  └─ Camera 2 settings
└─ About
   └─ Version, Help, License
```

---

## 🎨 Design System

### **Color Palette**
```
Primary:     #9146ff (Twitch Purple) - Buttons, Links, Icons
Background:  #0e0e10 (Dark)          - Main Background
Secondary:   #1a1a1e (Dark Gray)     - Cards, Panels
Border:      #2a2a2e (Gray)          - Dividers, Borders
Text Main:   #ffffff (White)         - Headers, Important
Text Sub:    #53535f (Light Gray)    - Labels, Descriptions
Success:     #00ff00 (Neon Green)    - Live Indicator
Error:       #ff6b6b (Red)           - Errors, Offline
```

### **Typography**
```
Headline (H1):  Bold 20px  → Screen Titles
Headline (H2):  Bold 16px  → Section Titles
Body:           Regular 14px → Main Text
Caption:        Regular 12px → Labels, Hints
Small:          Regular 11px → Metadata
```

### **Spacing**
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
xxl: 24px
```

### **Border Radius**
```
Small:   4px
Medium:  6px   
Large:   8px
Circle:  50%
```

---

## 🚀 Deployment Pipeline

```
┌─────────────┐
│ Development │
│  (npm run)  │
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│ Build APK       │
│ eas build       │
│ --platform      │
│ android         │
└──────┬──────────┘
       │
       ↓
┌─────────────────────┐
│ Install on Device   │
│ adb install app.apk │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Google Play Store   │
│ (Future Release)    │
└─────────────────────┘
```

---

## 📊 Größe & Performance

| Metrik | Wert |
|--------|------|
| APK Größe | ~50-80 MB |
| Min. Android | 8.0 (API 26) |
| RAM Usage | ~150-200 MB |
| Bundle Size | ~15 MB |
| Startup Time | ~2-3 Sec |

---

## ✅ Feature Checklist

| Feature | Status | Details |
|---------|--------|---------|
| React Native Setup | ✅ | v0.73 + Expo v50 |
| Navigation | ✅ | Bottom Tabs + Stack |
| Auth (OAuth) | ✅ | Twitch OAuth Flow |
| Follower List | ✅ | Live Status Grid |
| HLS Stream | ✅ | Video Player |
| Chat UI | ✅ | Message List + Input |
| Kameras | ✅ | 2x Reolink + Controls |
| Settings | ✅ | All options |
| Dark Mode | ✅ | Full Theme |
| State Mgmt | ✅ | Zustand |
| TypeScript | ✅ | Full Coverage |
| Notifications | ⏳ | Expo Notifications |
| IRC Chat | ⏳ | Socket.io Integration |
| HLS Backend | ⏳ | Streamlink |
| RTSP→HLS | ⏳ | FFmpeg |

---

## 🎯 Nächste Priority

1. **🔴 IRC Chat** – Echte Twitch IRC Verbindung
2. **🔴 Stream URL** – Streamlink Backend Integration
3. **🔴 Camera RTSP** – FFmpeg Conversion
4. **🟡 Notifications** – Expo Push Setup
5. **🟡 Offline VODs** – AsyncStorage Recording
6. **🟢 APK Release** – Google Play Store

---

## 📞 Schnelle Navigation

- **Starten:** QUICKSTART.md
- **Details:** README.md
- **Setup:** GITHUB_SETUP.md
- **Übersicht:** SUMMARY.md
- **Diese Datei:** ÜBERBLICK.md

---

**Viel Spaß beim Coding! 💜**

Made with ❤️ using React Native + Expo

