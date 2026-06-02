import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTwitchStore } from '../stores/twitchStore';

const { width } = Dimensions.get('window');

interface Camera {
  id: string;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  isOnline: boolean;
}

const CameraScreen = () => {
  const { cameraVolume, setCameraVolume } = useTwitchStore();

  const [cameras, setCameras] = useState<Camera[]>([
    {
      id: 'cam0',
      name: 'Tobi Kamera',
      ip: '192.168.15.248',
      port: 554,
      username: 'admin',
      password: 'reolink',
      isOnline: true,
    },
    {
      id: 'cam1',
      name: 'Benni Kamera',
      ip: '192.168.15.249',
      port: 554,
      username: 'admin',
      password: 'reolink',
      isOnline: true,
    },
  ]);

  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(cameras[0]);
  const [loading, setLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCamera) {
      loadCamera(selectedCamera);
    }
  }, [selectedCamera]);

  const loadCamera = async (camera: Camera) => {
    try {
      setLoading(true);

      // RTSP Stream URL pattern für Reolink
      const rtspUrl = `rtsp://${camera.username}:${camera.password}@${camera.ip}:${camera.port}/h264Preview_01_main`;

      // In production würde dies über einen Backend-Service gehen
      // der RTSP zu HLS/fMP4 konvertiert
      setStreamUrl(rtspUrl);
    } catch (error) {
      Alert.alert('Fehler', 'Kamera konnte nicht geladen werden');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = (camera: Camera) => {
    const updated = cameras.map((c) =>
      c.id === camera.id ? { ...c, isOnline: !c.isOnline } : c
    );
    setCameras(updated);

    if (selectedCamera?.id === camera.id) {
      setSelectedCamera(camera);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Camera Selector */}
      <View style={styles.cameraSelector}>
        {cameras.map((camera) => (
          <TouchableOpacity
            key={camera.id}
            style={[
              styles.cameraTab,
              selectedCamera?.id === camera.id && styles.cameraTabActive,
            ]}
            onPress={() => setSelectedCamera(camera)}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: camera.isOnline ? '#00ff00' : '#ff6b6b' },
              ]}
            />
            <Text
              style={[
                styles.cameraTabText,
                selectedCamera?.id === camera.id && styles.cameraTabTextActive,
              ]}
            >
              {camera.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Camera Feed */}
      {selectedCamera && (
        <View style={styles.feedContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9146ff" />
              <Text style={styles.loadingText}>Kamera wird geladen...</Text>
            </View>
          ) : selectedCamera.isOnline ? (
            <View style={styles.feedPlaceholder}>
              <MaterialIcons name="videocam" size={64} color="#53535f" />
              <Text style={styles.feedText}>
                Live Feed: {selectedCamera.name}
              </Text>
              <Text style={styles.feedSubtext}>
                {selectedCamera.ip}:{selectedCamera.port}
              </Text>
            </View>
          ) : (
            <View style={styles.offlineContainer}>
              <MaterialIcons name="videocam-off" size={64} color="#ff6b6b" />
              <Text style={styles.offlineText}>Kamera offline</Text>
            </View>
          )}
        </View>
      )}

      {/* Camera Controls */}
      {selectedCamera && (
        <View style={styles.controlsSection}>
          {/* Volume Control */}
          <View style={styles.volumeSection}>
            <Text style={styles.sectionTitle}>Kamera-Lautstärke</Text>
            <View style={styles.volumeControl}>
              <MaterialIcons name="volume-down" size={20} color="#9146ff" />
              <View style={styles.volumeBar}>
                <View
                  style={[
                    styles.volumeFill,
                    { width: `${cameraVolume}%` },
                  ]}
                />
              </View>
              <MaterialIcons name="volume-up" size={20} color="#9146ff" />
              <Text style={styles.volumeText}>{cameraVolume}%</Text>
            </View>
            <Text style={styles.volumeHint}>
              (Normalerweise stumm geschaltet)
            </Text>
          </View>

          {/* Camera Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Kamera-Einstellungen</Text>

            <TouchableOpacity style={styles.settingButton}>
              <MaterialIcons name="tune" size={20} color="#9146ff" />
              <Text style={styles.settingButtonText}>Helligkeit</Text>
              <MaterialIcons name="chevron-right" size={20} color="#53535f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <MaterialIcons name="contrast" size={20} color="#9146ff" />
              <Text style={styles.settingButtonText}>Kontrast</Text>
              <MaterialIcons name="chevron-right" size={20} color="#53535f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <MaterialIcons name="flip" size={20} color="#9146ff" />
              <Text style={styles.settingButtonText}>Spiegeln</Text>
              <MaterialIcons name="chevron-right" size={20} color="#53535f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <MaterialIcons name="rotate-right" size={20} color="#9146ff" />
              <Text style={styles.settingButtonText}>Drehen</Text>
              <MaterialIcons name="chevron-right" size={20} color="#53535f" />
            </TouchableOpacity>
          </View>

          {/* Camera Info */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informationen</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Modell:</Text>
              <Text style={styles.infoValue}>Reolink E1 Pro</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IP-Adresse:</Text>
              <Text style={styles.infoValue}>{selectedCamera.ip}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor: selectedCamera.isOnline
                        ? '#00ff00'
                        : '#ff6b6b',
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {selectedCamera.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                toggleCamera(selectedCamera)
              }
            >
              <MaterialIcons
                name={selectedCamera.isOnline ? 'power-settings-new' : 'power'}
                size={20}
                color="#fff"
              />
              <Text style={styles.actionButtonText}>
                {selectedCamera.isOnline ? 'Ausschalten' : 'Einschalten'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="refresh" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Neu laden</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  cameraSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1e',
    borderBottomColor: '#2a2a2e',
    borderBottomWidth: 1,
  },
  cameraTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightColor: '#2a2a2e',
    borderRightWidth: 1,
  },
  cameraTabActive: {
    borderBottomColor: '#9146ff',
    borderBottomWidth: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  cameraTabText: {
    color: '#53535f',
    fontSize: 12,
    fontWeight: '500',
  },
  cameraTabTextActive: {
    color: '#9146ff',
  },
  feedContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 12,
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
  feedPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
  },
  feedSubtext: {
    color: '#53535f',
    fontSize: 12,
    marginTop: 4,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginTop: 12,
  },
  controlsSection: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  volumeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
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
  volumeHint: {
    color: '#53535f',
    fontSize: 11,
    marginTop: 8,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1e',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderColor: '#2a2a2e',
    borderWidth: 1,
  },
  settingButtonText: {
    flex: 1,
    color: '#ffffff',
    marginLeft: 12,
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#2a2a2e',
    borderBottomWidth: 1,
  },
  infoLabel: {
    color: '#53535f',
    fontSize: 13,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9146ff',
    paddingVertical: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default CameraScreen;
