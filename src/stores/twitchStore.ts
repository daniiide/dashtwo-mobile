import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
}

export interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tags: string[];
  is_mature: boolean;
}

export interface Follow {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_login: string;
  to_name: string;
  followed_at: string;
  is_live?: boolean;
  stream?: TwitchStream;
  game_name?: string;
  viewer_count?: number;
}

interface TwitchStoreState {
  // Auth
  token: string | null;
  isAuthenticated: boolean;
  user: TwitchUser | null;

  // Streams & Follows
  follows: Follow[];
  liveFollows: Follow[];
  currentStream: TwitchStream | null;
  currentChannel: string | null;

  // Settings
  quality: string;
  streamVolume: number;
  cameraVolume: number;
  notificationsEnabled: boolean;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  setToken: (token: string) => void;
  setUserData: (user: TwitchUser) => void;
  setFollows: (follows: Follow[]) => void;
  setLiveFollows: (follows: Follow[]) => void;
  setCurrentStream: (stream: TwitchStream | null) => void;
  setCurrentChannel: (channel: string | null) => void;
  setQuality: (quality: string) => void;
  setStreamVolume: (volume: number) => void;
  setCameraVolume: (volume: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useTwitchStore = create<TwitchStoreState>((set) => ({
  // Initial State
  token: null,
  isAuthenticated: false,
  user: null,
  follows: [],
  liveFollows: [],
  currentStream: null,
  currentChannel: null,
  quality: '720p60',
  streamVolume: 75,
  cameraVolume: 0,
  notificationsEnabled: true,
  isLoading: false,
  error: null,

  // Actions
  setToken: (token: string) =>
    set({
      token,
      isAuthenticated: !!token,
    }),

  setUserData: (user: TwitchUser) =>
    set({
      user,
    }),

  setFollows: (follows: Follow[]) =>
    set({
      follows,
    }),

  setLiveFollows: (follows: Follow[]) =>
    set({
      liveFollows: follows,
    }),

  setCurrentStream: (stream: TwitchStream | null) =>
    set({
      currentStream: stream,
    }),

  setCurrentChannel: (channel: string | null) =>
    set({
      currentChannel: channel,
    }),

  setQuality: (quality: string) =>
    set({
      quality,
    }),

  setStreamVolume: (volume: number) =>
    set({
      streamVolume: volume,
    }),

  setCameraVolume: (volume: number) =>
    set({
      cameraVolume: volume,
    }),

  setNotificationsEnabled: (enabled: boolean) =>
    set({
      notificationsEnabled: enabled,
    }),

  setLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),

  setError: (error: string | null) =>
    set({
      error,
    }),

  logout: () =>
    set({
      token: null,
      isAuthenticated: false,
      user: null,
      follows: [],
      liveFollows: [],
      currentStream: null,
      currentChannel: null,
    }),
}));
