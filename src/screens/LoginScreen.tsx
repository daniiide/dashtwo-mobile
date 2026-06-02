import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as WebBrowser from 'expo-web-browser';
import { useTwitchStore } from '../stores/twitchStore';
import { twitchService } from '../services/twitchService';

const { width, height } = Dimensions.get('window');

const TWITCH_CLIENT_ID = 's67eqkluw5j6au587foxrgp0v4d665';
const REDIRECT_URI = 'dashtwo://auth';
const SCOPES = [
  'user:read:email',
  'user:read:follows',
  'chat:read',
  'chat:edit',
  'channel:read:stream_key',
];

const LoginScreen = ({ navigation }: any) => {
  const { setToken, setUserData } = useTwitchStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Build OAuth URL
      const scopeString = SCOPES.join(' ');
      const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
        scopeString
      )}`;

      // Open browser
      const result = await WebBrowser.openAuthSessionAsync(oauthUrl, REDIRECT_URI);

      if (result.type === 'success' && result.url) {
        // Extract auth code from URL
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code) {
          // Exchange code for token (würde normalerweise über ein Backend laufen)
          // For demo purposes, use a mock token
          const mockToken =
            'YOUR_PAT

          await twitchService.saveToken(mockToken);
          setToken(mockToken);

          // Get user data
          const userData = await twitchService.getUserData(mockToken);
          setUserData(userData);

          // Navigate to main app
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      Alert.alert('Fehler', 'Login fehlgeschlagen. Bitte versuche es erneut.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);

      // For demo: use stored token or mock data
      const mockUser = {
        id: '50026156',
        login: 'thedaniii',
        display_name: 'theDaniii',
        profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/',
        description: 'DashTwo Stream Dashboard',
      };

      setUserData(mockUser);
      setToken('mock_token');

      // Navigate to main app
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Fehler', 'Demo-Login fehlgeschlagen.');
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background Gradient */}
      <View style={styles.background}>
        <View style={styles.topGradient} />
        <View style={styles.bottomGradient} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo & Title */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="tv" size={56} color="#9146ff" />
          </View>
          <Text style={styles.title}>DashTwo</Text>
          <Text style={styles.subtitle}>Mobile Stream Dashboard</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#9146ff" />
            <Text style={styles.featureText}>Alle Follower übersichtlich</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#9146ff" />
            <Text style={styles.featureText}>Live Streams anschauen</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#9146ff" />
            <Text style={styles.featureText}>Im Chat schreiben</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#9146ff" />
            <Text style={styles.featureText}>Kameras steuern</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="lock" size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Mit Twitch anmelden</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoLogin}
            disabled={loading}
          >
            <MaterialIcons name="preview" size={20} color="#9146ff" />
            <Text style={styles.demoButtonText}>Demo anschauen</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <MaterialIcons name="info" size={16} color="#53535f" />
          <Text style={styles.infoText}>
            Sichere Anmeldung über Twitch OAuth
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>DashTwo Mobile v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 theDaniii</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: 'rgba(145, 70, 255, 0.05)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: 'rgba(145, 70, 255, 0.02)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1a1a1e',
    borderColor: '#9146ff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#53535f',
    letterSpacing: 0.5,
  },
  featuresContainer: {
    width: '100%',
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9146ff',
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#9146ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1e',
    paddingVertical: 14,
    borderRadius: 8,
    borderColor: '#9146ff',
    borderWidth: 2,
  },
  demoButtonText: {
    color: '#9146ff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    color: '#53535f',
    fontSize: 12,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    color: '#53535f',
    fontSize: 12,
  },
  copyrightText: {
    color: '#2a2a2e',
    fontSize: 11,
    marginTop: 4,
  },
});

export default LoginScreen;
