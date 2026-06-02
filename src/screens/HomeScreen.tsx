import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useTwitchStore, Follow } from '../stores/twitchStore';
import { twitchService } from '../services/twitchService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const {
    user,
    follows,
    liveFollows,
    setFollows,
    setLiveFollows,
    setLoading,
    isLoading,
  } = useTwitchStore();

  const [searchText, setSearchText] = useState('');
  const [sortMode, setSortMode] = useState<'watch' | 'asc' | 'desc'>('watch');
  const [refreshing, setRefreshing] = useState(false);

  // Load follows on screen focus
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadFollows();
      }
    }, [user?.id])
  );

  const loadFollows = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const allFollows = await twitchService.getFollows(user.id);
      setFollows(allFollows);

      // Filter live follows
      const live = allFollows.filter((f) => f.is_live);
      setLiveFollows(live);
    } catch (error) {
      console.error('Failed to load follows:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFollows();
    setRefreshing(false);
  };

  // Filter follows based on search
  const filteredFollows = follows.filter(
    (f) =>
      f.to_name.toLowerCase().includes(searchText.toLowerCase()) ||
      f.game_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort follows
  const sortedFollows = [...filteredFollows].sort((a, b) => {
    if (sortMode === 'watch') {
      // Live first, then by viewer count
      if (a.is_live && !b.is_live) return -1;
      if (!a.is_live && b.is_live) return 1;
      return (b.viewer_count || 0) - (a.viewer_count || 0);
    } else if (sortMode === 'asc') {
      return a.to_name.localeCompare(b.to_name);
    } else if (sortMode === 'desc') {
      return b.to_name.localeCompare(a.to_name);
    }
    return 0;
  });

  const renderFollowItem = ({ item }: { item: Follow }) => (
    <TouchableOpacity
      style={[styles.followCard, item.is_live && styles.followCardLive]}
      onPress={() => {
        navigation.navigate('Stream', { channel: item.to_login });
      }}
    >
      {/* Thumbnail */}
      {item.stream?.thumbnail_url && (
        <Image
          source={{ uri: item.stream.thumbnail_url }}
          style={styles.thumbnail}
        />
      )}

      {/* Overlay mit Status */}
      {item.is_live && (
        <View style={styles.liveOverlay}>
          <View style={styles.liveBadge}>
            <MaterialIcons name="fiber-manual-record" size={8} color="#fff" />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.viewersText}>{item.viewer_count?.toLocaleString()} viewers</Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.followInfo}>
        <Text style={styles.channelName} numberOfLines={1}>
          {item.to_name}
        </Text>
        <Text style={styles.gameName} numberOfLines={1}>
          {item.game_name || 'No game'}
        </Text>
        {item.stream?.title && (
          <Text style={styles.streamTitle} numberOfLines={2}>
            {item.stream.title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="tv-off" size={64} color="#53535f" />
      <Text style={styles.emptyText}>
        {searchText ? 'Keine Follower gefunden' : 'Keine Follower'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{liveFollows.length}</Text>
            <Text style={styles.statLabel}>Live</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{follows.length}</Text>
            <Text style={styles.statLabel}>Follower</Text>
          </View>
        </View>
      </View>

      {/* Search & Sort Bar */}
      <View style={styles.filterBar}>
        <MaterialIcons name="search" size={20} color="#53535f" />
        <TextInput
          style={styles.searchInput}
          placeholder="Suche Follower..."
          placeholderTextColor="#53535f"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          onPress={() => {
            const modes = ['watch', 'asc', 'desc'] as const;
            const currentIndex = modes.indexOf(sortMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            setSortMode(nextMode);
          }}
        >
          <MaterialIcons name="sort" size={20} color="#9146ff" />
        </TouchableOpacity>
      </View>

      {/* Follows List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9146ff" />
        </View>
      ) : (
        <FlatList
          data={sortedFollows}
          renderItem={renderFollowItem}
          keyExtractor={(item) => item.to_id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#9146ff"
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  header: {
    backgroundColor: '#1a1a1e',
    padding: 16,
    borderBottomColor: '#2a2a2e',
    borderBottomWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9146ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#53535f',
    marginTop: 4,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1e',
    marginHorizontal: 12,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: '#2a2a2e',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#ffffff',
    marginHorizontal: 8,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  followCard: {
    width: (width - 36) / 2,
    backgroundColor: '#1a1a1e',
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#2a2a2e',
    borderWidth: 1,
  },
  followCardLive: {
    borderColor: '#9146ff',
    borderWidth: 2,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: '#2a2a2e',
  },
  liveOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  viewersText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
  },
  followInfo: {
    padding: 8,
  },
  channelName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameName: {
    color: '#9146ff',
    fontSize: 12,
    marginTop: 2,
  },
  streamTitle: {
    color: '#53535f',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: '#53535f',
    fontSize: 16,
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
