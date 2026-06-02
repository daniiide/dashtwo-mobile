import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HLSPlayer from 'react-native-hls-player';
import { useTwitchStore } from '../stores/twitchStore';
import { twitchService } from '../services/twitchService';

const { width, height } = Dimensions.get('window');

const StreamScreen = ({ route, navigation }: any) => {
  const { channel } = route.params || {};
  const { streamVolume, setCurrentStream, currentStream } = useTwitchStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    if (channel) {
      loadStream(channel);
    }
  }, [channel]);

  const loadStream = async (channelName: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get stream info
      const stream = await twitchService.getStreamByChannel(channelName);
      if (!stream) {
        setError('Stream nicht gefunden oder offline');
        setLoading(false);
        return;
      }

      setCurrentStream(stream);

      // Get stream URL (würde über Streamlink-Backend laufen)
      // For now, use HLS URL pattern
      const url = `https://usher.twitch.tv/api/channel/hls/${channelName}.m3u8`;
      setStreamUrl(url);
    } catch (err) {
      setError('Fehler beim Laden des Streams');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <View style={styles.playerContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9146ff" />
            <Text style={styles.loadingText}>Stream wird geladen...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={64} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => channel && loadStream(channel)}
            >
              <Text style={styles.retryButtonText}>Erneut versuchen</Text>
            </TouchableOpacity>
          </View>
        ) : streamUrl ? (
          <HLSPlayer
            ref={playerRef}
            url={streamUrl}
            autoplay={true}
            controls={true}
            style={styles.player}
            onLoad={() => setLoading(false)}
            onError={() => setError('Fehler beim Abspielen des Streams')}
          />
        ) : null}
      </View>

      {/* Stream Info & Controls */}
      {currentStream && (
        <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerInfo}>
            <View style={styles.titleSection}>
              <Text style={styles.channelName} numberOfLines={1}>
                {currentStream.user_name}
              </Text>
              <View style={styles.liveIndicator}>
                <MaterialIcons name="fiber-manual-record" size={8} color="#fff" />
                <Text style={styles.liveLabel}>LIVE</Text>
                <Text style={styles.viewerCount}>
                  {currentStream.viewer_count.toLocaleString()} viewers
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.streamTitle}>{currentStream.title}</Text>

          {/* Game */}
          <View style={styles.gameSection}>
            <Text style={styles.label}>Playing</Text>
            <Text style={styles.gameName}>{currentStream.game_name}</Text>
          </View>

          {/* Volume Control */}
          <View style={styles.volumeSection}>
            <Text style={styles.label}>Lautstärke</Text>
            <View style={styles.volumeControl}>
              <MaterialIcons name="volume-down" size={20} color="#9146ff" />
              <View style={styles.volumeBar}>
                <View
                  style={[
                    styles.volumeFill,
                    { width: `${streamVolume}%` },
                  ]}
                />
              </View>
              <MaterialIcons name="volume-up" size={20} color="#9146ff" />
              <Text style={styles.volumeText}>{streamVolume}%</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Chat', { channel })}
            >
              <MaterialIcons name="chat" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Alert.alert('Share', `Open ${currentStream.user_name}'s stream`);
              }}
            >
              <MaterialIcons name="share" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Teilen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Alert.alert('Follow', `You are already following ${currentStream.user_name}`);
              }}
            >
              <MaterialIcons name="favorite" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  playerContainer: {
    width: '100%',
    height: height * 0.5,
    backgroundColor: '#000',
  },
  player: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#9146ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#0e0e10',
    padding: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  channelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  liveLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
    backgroundColor: '#ff0000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  viewerCount: {
    color: '#53535f',
    fontSize: 12,
    marginLeft: 8,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9146ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    color: '#53535f',
    fontWeight: '600',
    marginBottom: 8,
  },
  gameSection: {
    marginBottom: 20,
  },
  gameName: {
    fontSize: 14,
    color: '#9146ff',
    fontWeight: '500',
  },
  volumeSection: {
    marginBottom: 24,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#2a2a2e',
    borderRadius: 2,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#9146ff',
    borderRadius: 2,
  },
  volumeText: {
    color: '#ffffff',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 8,
  },
});

export default StreamScreen;
