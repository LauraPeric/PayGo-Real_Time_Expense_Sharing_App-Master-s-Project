import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../context/TripsContext';

type AddMode = 'username' | 'qr';

export default function AddMembersScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const { trips, addMemberToTrip } = useTrips();

  const [mode, setMode] = useState<AddMode>('username');
  const [username, setUsername] = useState('');

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Grupa nije pronađena.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.linkText}>Natrag</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddByUsername = () => {
    const clean = username.trim().replace(/^@/, '');
    if (!clean) {
      Alert.alert('Greška', 'Unesi korisničko ime.');
      return;
    }

    if (trip.members.includes(clean)) {
      Alert.alert('Info', `@${clean} je već u grupi.`);
      return;
    }

    addMemberToTrip(trip.id, clean);
    setUsername('');
  };

  const handleScanQrPlaceholder = () => {
    const scannedUsername = `clan_${Math.floor(10 + Math.random() * 89)}`;
    addMemberToTrip(trip.id, scannedUsername);
    Alert.alert('Dodano', `@${scannedUsername} je dodan u grupu.`);
  };

  const handleContinueToChat = () => {
    navigation.replace('TripDetails', { tripId: trip.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.linkText}>← Putovanja</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Dodaj članove</Text>
        <Text style={styles.subtitle}>
          Grupa: <Text style={styles.bold}>{trip.name}</Text>
        </Text>

        {/* clanovi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Članovi ({trip.members.length})</Text>
          <View style={styles.chipsWrap}>
            {trip.members.map((member) => (
              <View key={member} style={styles.chip}>
                <Text style={styles.chipText}>@{member}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* switch izmeduj vrste dodavanja clana*/}
        <View style={styles.switcher}>
          <TouchableOpacity
            style={[styles.switchBtn, mode === 'username' && styles.switchBtnActive]}
            activeOpacity={0.85}
            onPress={() => setMode('username')}
          >
            <Text
              style={[
                styles.switchText,
                mode === 'username' && styles.switchTextActive,
              ]}
            >
              Korisničko ime
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchBtn, mode === 'qr' && styles.switchBtnActive]}
            activeOpacity={0.85}
            onPress={() => setMode('qr')}
          >
            <Text
              style={[styles.switchText, mode === 'qr' && styles.switchTextActive]}
            >
              QR kod
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'username' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dodaj po korisničkom imenu</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="npr. marko99"
                placeholderTextColor="#A0A6B5"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
              />
              <TouchableOpacity
                style={styles.addBtn}
                activeOpacity={0.85}
                onPress={handleAddByUsername}
              >
                <Text style={styles.addBtnText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.qrView}>
            <View style={styles.qrBlock}>
              <Text style={styles.sectionTitle}>QR kod grupe</Text>
              <Text style={styles.mutedHint}>
                Drugi korisnici skeniraju ovaj kod da uđu u grupu.
              </Text>
              <View style={styles.qrBox}>
                <Text style={styles.qrTitle}>{trip.name}</Text>
                <Text style={styles.qrCode}>#{trip.id.slice(-6)}</Text>
              </View>
            </View>

            <View style={styles.scanBlock}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitleNoMargin}>Skeniraj tuđi QR kod</Text>
                <Text style={styles.mutedHintLeft}>
                  Dodaj člana čiji kod očitaš.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.scanBtn}
                activeOpacity={0.85}
                onPress={handleScanQrPlaceholder}
              >
                <Text style={styles.scanBtnText}>Skeniraj</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleContinueToChat}>
          <Text style={styles.primaryBtnText}>Nastavi u chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  scroll: {
    padding: 24,
    paddingBottom: 36,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#20263A',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  linkText: {
    color: '#3157D5',
    fontSize: 15,
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
    marginTop: 6,
    marginBottom: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#20263A',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#20263A',
    marginBottom: 10,
  },
  sectionTitleNoMargin: {
    fontSize: 14,
    fontWeight: '700',
    color: '#20263A',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E9EDFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: '#3157D5',
    fontWeight: '600',
    fontSize: 13,
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: '#ECEEF3',
    padding: 4,
    borderRadius: 12,
    marginBottom: 22,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  switchBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B6275',
  },
  switchTextActive: {
    color: '#3157D5',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#20263A',
  },
  addBtn: {
    backgroundColor: '#3157D5',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  qrView: {
    gap: 16,
  },
  qrBlock: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  mutedHint: {
    fontSize: 12,
    color: '#858B9C',
    textAlign: 'center',
    marginBottom: 14,
  },
  mutedHintLeft: {
    fontSize: 12,
    color: '#858B9C',
    marginTop: 3,
  },
  qrBox: {
    width: 156,
    height: 156,
    borderRadius: 16,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#20263A',
    textAlign: 'center',
  },
  qrCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3157D5',
    marginTop: 8,
  },
  scanBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  scanBtn: {
    backgroundColor: '#E9EDFA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanBtnText: {
    color: '#3157D5',
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: '#F8F9FC',
    borderTopWidth: 1,
    borderTopColor: '#ECEEF3',
  },
  primaryBtn: {
    backgroundColor: '#3157D5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});