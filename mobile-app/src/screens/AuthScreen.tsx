import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ route, navigation }: any) {
  const initialMode = route?.params?.mode || 'register';
  const [isRegister, setIsRegister] = useState(initialMode === 'register');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Greška', 'Molimo ispuni sva obavezna polja.');
      return;
    }

    if (isRegister && !username.trim()) {
      Alert.alert('Greška', 'Unesi korisničko ime (username).');
      return;
    }

    // login korisnika
    login(email.trim(), isRegister ? username.trim() : undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Natrag</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {isRegister ? 'Kreiraj račun' : 'Dobrodošao natrag'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegister
            ? 'Unesi svoje podatke za početak korištenja PayGo aplikacije.'
            : 'Prijavi se u svoj PayGo račun.'}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email adresa</Text>
          <TextInput
            style={styles.input}
            placeholder="ime@primjer.com"
            placeholderTextColor="#A0A6B5"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {isRegister && (
            <>
              <Text style={styles.label}>Korisničko ime (username)</Text>
              <TextInput
                style={styles.input}
                placeholder="npr. marko99"
                placeholderTextColor="#A0A6B5"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </>
          )}

          <Text style={styles.label}>Lozinka</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#A0A6B5"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {isRegister ? 'Registriraj se' : 'Prijavi se'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.switchMode}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchModeText}>
            {isRegister
              ? 'Već imaš račun? Prijavi se'
              : 'Nemaš račun? Registriraj se'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#3157D5',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20263A',
  },
  subtitle: {
    fontSize: 14,
    color: '#858B9C',
    marginTop: 8,
    marginBottom: 30,
  },
  form: {
    gap: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#20263A',
    marginBottom: -6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#20263A',
  },
  submitButton: {
    backgroundColor: '#3157D5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchMode: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#3157D5',
    fontSize: 14,
    fontWeight: '600',
  },
});