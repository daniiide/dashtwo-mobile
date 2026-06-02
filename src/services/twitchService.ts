import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TwitchUser, TwitchStream, Follow } from '../stores/twitchStore';

const TWITCH_CLIENT_ID = 's67eqkluw5j6au587foxrgp0v4d665';
const TWITCH_API_BASE = 'https://api.twitch.tv/helix';
const STORAGE_KEYS = {
  TOKEN: 'dt_auth_token',
  USER: 'dt_user_data',
  FOLLOWS: 'dt_follows',
  SETTINGS: 'dt_settings',
};

class TwitchService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: TWITCH_API_BASE,
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Set Authorization Token für alle nachfolgenden Requests
   */
  setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Get stored token from AsyncStorage
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  /**
   * Save token to AsyncStorage
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      this.setToken(token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  /**
   * Get current authenticated user data
   */
  async getUserData(token?: string): Promise<TwitchUser> {
    try {
      if (token) {
        this.setToken(token);
      }

      const response = await this.client.get<{ data: TwitchUser[] }>('/users');
      const user = response.data.data[0];

      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Failed to get user data:', error);
      throw error;
    }
  }

  /**
   * Get user's followers and their live status
   */
  async getFollows(userId: string): Promise<Follow[]> {
    try {
      const response = await this.client.get<{ data: any[] }>('/users/follows', {
        params: {
          from_id: userId,
          first: 100,
        },
      });

      const follows: Follow[] = response.data.data.map((f) => ({
        from_id: f.from_id,
        from_login: f.from_login,
        from_name: f.from_name,
        to_id: f.to_id,
        to_login: f.to_login,
        to_name: f.to_name,
        followed_at: f.followed_at,
      }));

      // Fetch live status für alle Follows
      const liveFollows = await this.getFollowsLiveStatus(follows);

      await AsyncStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(liveFollows));

      return liveFollows;
    } catch (error) {
      console.error('Failed to get follows:', error);

      // Fallback: get cached follows
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.FOLLOWS);
      return cached ? JSON.parse(cached) : [];
    }
  }

  /**
   * Get live status for follows
   */
  private async getFollowsLiveStatus(follows: Follow[]): Promise<Follow[]> {
    try {
      if (follows.length === 0) return [];

      const userIds = follows.map((f) => f.to_id).join('&user_id=');
      const response = await this.client.get<{ data: TwitchStream[] }>('/streams', {
        params: {
          user_id: follows.map((f) => f.to_id),
          first: 100,
        },
      });

      const streams = response.data.data;

      // Map live status to follows
      return follows.map((follow) => {
        const stream = streams.find((s) => s.user_id === follow.to_id);
        return {
          ...follow,
          is_live: !!stream,
          stream: stream || undefined,
          viewer_count: stream?.viewer_count,
          game_name: stream?.game_name,
        };
      });
    } catch (error) {
      console.error('Failed to get live status:', error);
      return follows;
    }
  }

  /**
   * Get specific stream by channel name
   */
  async getStreamByChannel(channelName: string): Promise<TwitchStream | null> {
    try {
      const response = await this.client.get<{ data: TwitchStream[] }>('/streams', {
        params: {
          user_login: channelName,
        },
      });

      return response.data.data[0] || null;
    } catch (error) {
      console.error(`Failed to get stream for ${channelName}:`, error);
      return null;
    }
  }

  /**
   * Get game info by name
   */
  async getGame(gameName: string): Promise<any> {
    try {
      const response = await this.client.get('/games', {
        params: {
          name: gameName,
        },
      });

      return response.data.data[0];
    } catch (error) {
      console.error(`Failed to get game ${gameName}:`, error);
      return null;
    }
  }

  /**
   * Send chat message
   */
  async sendChatMessage(
    broadcasterId: string,
    message: string,
    userId: string
  ): Promise<boolean> {
    try {
      const response = await this.client.post('/chat/messages', {
        broadcaster_id: broadcasterId,
        sender_id: userId,
        message: message,
      });

      return !!response.data.data;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      return false;
    }
  }

  /**
   * Get HLS stream URL for a channel
   * (Note: This requires Streamlink or similar service)
   */
  async getStreamUrl(channelName: string, quality: string = '720p60'): Promise<string> {
    // This would typically call a backend service that uses Streamlink
    // For now, return placeholder
    return `https://usher.twitch.tv/api/channel/hls/${channelName}.m3u8?nauth=token&oauth_token=token`;
  }

  /**
   * Clear all stored data
   */
  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.FOLLOWS);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const twitchService = new TwitchService();
