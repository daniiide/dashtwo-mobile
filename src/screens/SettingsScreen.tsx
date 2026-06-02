import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTwitchStore } from '../stores/twitchStore';
import { twitchService } from '../services/twitchService';

const SettingsScreen = ({ navigation }: any) => {
  const {
    user,
    quality,
    notificationsEnabled,
    setQuality,
    setNotificationsEnabled,
    logout,
  } = useTwitchStore();

  const [autoplay, setAutoplay] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Abmelden',
        onPress: async () => {
          await twitchService.clearStorage();
          logout();
          navigation.navigate('Login');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Section */}
      {user && (
        <View style={styles.userSection}>
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <MaterialIcons name="person" size={32} color="#9146ff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.display_name}</Text>
              <Text style={styles.userLogin}>@{user.login}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Stream Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stream-Einstellungen</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="hd" size={20} color="#9146ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Video-Qualität</Text>
              <Text style={styles.settingValue}>{quality}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="chevron-right" size={24} color="#53535f" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="play-arrow" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Automatisches Abspielen</Text>
          </View>
          <Switch
            value={autoplay}
            onValueChange={setAutoplay}
            trackColor={{ false: '#2a2a2e', true: '#9146ff' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benachrichtigungen</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="notifications" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Live-Benachrichtigungen</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#2a2a2e', true: '#9146ff' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="chat" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Chat-Benachrichtigungen</Text>
          </View>
          <Switch
            value={true}
            trackColor={{ false: '#2a2a2e', true: '#9146ff' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Display Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anzeige</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="dark-mode" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#2a2a2e', true: '#9146ff' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="text-fields" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Schriftgröße</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="chevron-right" size={24} color="#53535f" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kamera-Einstellungen</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="videocam" size={20} color="#9146ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Kamera 1 (Tobi)</Text>
              <Text style={styles.settingValue}>192.168.15.248</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#53535f" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="videocam" size={20} color="#9146ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Kamera 2 (Benni)</Text>
              <Text style={styles.settingValue}>192.168.15.249</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#53535f" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Über</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="info" size={20} color="#9146ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>DashTwo Mobile</Text>
              <Text style={styles.settingValue}>v1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="help-outline" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Hilfe & Support</Text>
          </View>
          <MaterialIcons name="open-in-new" size={20} color="#53535f" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="code" size={20} color="#9146ff" />
            <Text style={styles.settingName}>Lizenz & Credits</Text>
          </View>
          <MaterialIcons name="open-in-new" size={20} color="#53535f" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Abmelden</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  userSection: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1e',
    padding: 16,
    borderRadius: 12,
    borderColor: '#2a2a2e',
    borderWidth: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userLogin: {
    fontSize: 12,
    color: '#53535f',
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#53535f',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1e',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: '#2a2a2e',
    borderWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  settingValue: {
    color: '#53535f',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});

export default SettingsScreen;
