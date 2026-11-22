import  { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../context/TripsContext';

export default function GroupSettingsScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const { trips, addMemberToTrip, addExpenseToTrip } = useTrips();

  const [newMember, setNewMember] = useState('');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Grupa nije pronađena.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Natrag</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalExpenses = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const perMemberShare =
    trip.members.length > 0 ? totalExpenses / trip.members.length : 0;

  const handleAddMember = () => {
    const clean = newMember.trim().replace(/^@/, '');
    if (!clean) {
      Alert.alert('Greška', 'Unesi korisničko ime.');
      return;
    }
    const ok = addMemberToTrip(trip.id, clean);
    if (!ok) {
      Alert.alert('Info', 'Korisnik je već u grupi.');
      return;
    }
    setNewMember('');
  };

  const handleAddExpense = () => {
    const parsed = parseFloat(expenseAmount.replace(',', '.'));
    if (!expenseTitle.trim() || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Greška', 'Unesi naziv troška i ispravan iznos.');
      return;
    }
    addExpenseToTrip(trip.id, expenseTitle, parsed, trip.members[0] || 'Ti');
    setExpenseTitle('');
    setExpenseAmount('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>← Natrag u chat</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Postavke grupe</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.groupName}>{trip.name}</Text>
        {trip.description ? (
          <Text style={styles.groupDesc}>{trip.description}</Text>
        ) : null}

 {/* dodavanje člana */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dodaj člana</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="npr. marko99"
              placeholderTextColor="#A0A6B5"
              autoCapitalize="none"
              autoCorrect={false}
              value={newMember}
              onChangeText={setNewMember}
            />
            <TouchableOpacity style={styles.smallBtn} onPress={handleAddMember}>
              <Text style={styles.smallBtnText}>Dodaj</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* stanje po clanu */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stanje po članu</Text>
          <Text style={styles.summaryLine}>
            Ukupno troškova:{' '}
            <Text style={styles.bold}>
              {totalExpenses.toFixed(2)} {trip.currency}
            </Text>
          </Text>
          {trip.members.map((member) => (
            <View key={member} style={styles.memberRow}>
              <Text style={styles.memberName}>@{member}</Text>
              <Text style={styles.memberShare}>
                {perMemberShare.toFixed(2)} {trip.currency}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF3',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#20263A',
  },
  linkText: {
    color: '#3157D5',
    fontSize: 15,
    fontWeight: '600',
  },
  scroll: {
    padding: 20,
    paddingBottom: 36,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20263A',
  },
  groupDesc: {
    fontSize: 14,
    color: '#858B9C',
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEEF3',
    marginTop: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#20263A',
    marginBottom: 10,
  },
  summaryLine: {
    fontSize: 13,
    color: '#5B6275',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
    color: '#20263A',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F8',
  },
  memberName: {
    fontSize: 14,
    color: '#20263A',
    fontWeight: '600',
  },
  memberShare: {
    fontSize: 14,
    color: '#3157D5',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#20263A',
    marginBottom: 10,
  },
  smallBtn: {
    backgroundColor: '#3157D5',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
  },
  smallBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: '#3157D5',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});