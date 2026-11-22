import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../context/TripsContext';
import { Trip, Currency } from '../types/index';

const CURRENCIES: Currency[] = ['EUR', 'USD'];

export default function HomeScreen({ navigation }: any) {
  const { trips, addTrip } = useTrips();

  const [modalVisible, setModalVisible] = useState(false);
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCreateTrip = () => {
    if (!tripName.trim()) {
      Alert.alert('Greška', 'Unesi naziv putovanja ili grupe.');
      return;
    }

    const createdTripId = addTrip(tripName, description, currency);

    setTripName('');
    setDescription('');
    setCurrency('EUR');
    setDropdownOpen(false);
    setModalVisible(false);

    if (createdTripId) {
      navigation.navigate('AddMembers', { tripId: createdTripId });
    }
  };

  const closeModal = () => {
    setDropdownOpen(false);
    setModalVisible(false);
  };

  const renderTripCard = ({ item }: { item: Trip }) => {
    const totalExpenses = item.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
      >
        <View style={styles.tripCardTop}>
          <Text style={styles.tripName}>{item.name}</Text>
          <Text style={styles.tripCurrency}>{item.currency}</Text>
        </View>

        {item.description ? (
          <Text style={styles.tripDescription}>{item.description}</Text>
        ) : null}

        <View style={styles.tripCardBottom}>
          <Text style={styles.tripMeta}>
            👥 {item.members.length} {item.members.length === 1 ? 'član' : 'članova'}
          </Text>
          <Text style={styles.tripTotal}>
            {totalExpenses.toFixed(2)} {item.currency}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>PayGo</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Moja putovanja</Text>
        <Text style={styles.subtitle}>
          Sva tvoja putovanja na jednom mjestu.
        </Text>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✈️</Text>
          <Text style={styles.emptyTitle}>Još nemaš putovanja</Text>
          <Text style={styles.emptyText}>
            Kreiraj svoju prvu grupu i počni jednostavno
            dijeliti troškove s prijateljima.
          </Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTripCard}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* kreiranje novog chata */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo putovanje</Text>
            <Text style={styles.modalSubtitle}>
              Kreiraj grupu, a članove ćeš dodati unutar grupe preko username-a ili QR koda.
            </Text>

            <Text style={styles.label}>Naziv putovanja / grupe</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. Zimovanje na Jahorini"
              placeholderTextColor="#A0A6B5"
              value={tripName}
              onChangeText={setTripName}
            />

            <Text style={styles.label}>Opis</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. Vikend ekipa, apartman i ski pass"
              placeholderTextColor="#A0A6B5"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Valuta</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownOpen((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectedText}>{currency}</Text>
                <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {CURRENCIES.map((curr) => (
                    <TouchableOpacity
                      key={curr}
                      style={[
                        styles.dropdownOption,
                        currency === curr && styles.dropdownOptionActive,
                      ]}
                      onPress={() => {
                        setCurrency(curr);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          currency === curr && styles.dropdownOptionTextActive,
                        ]}
                      >
                        {curr === 'EUR' ? 'EUR (€)' : 'USD ($)'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateTrip}
              >
                <Text style={styles.saveButtonText}>Kreiraj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#3157D5',
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20263A',
  },
  subtitle: {
    fontSize: 14,
    color: '#858B9C',
    marginTop: 7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  emptyIcon: {
    fontSize: 65,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#20263A',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#858B9C',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    gap: 12,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  tripCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20263A',
    flex: 1,
  },
  tripCurrency: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3157D5',
    backgroundColor: '#E9EDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tripDescription: {
    fontSize: 13,
    color: '#858B9C',
    marginTop: 4,
  },
  tripCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F8',
  },
  tripMeta: {
    fontSize: 13,
    color: '#5B6275',
  },
  tripTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#20263A',
  },
  addButton: {
    position: 'absolute',
    right: 25,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3157D5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '300',
    marginTop: -3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#20263A',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#858B9C',
    marginTop: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#20263A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#20263A',
    marginBottom: 14,
  },
  dropdownWrapper: {
    marginBottom: 18,
  },
  dropdownButton: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelectedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#20263A',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#5B6275',
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1EF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionActive: {
    backgroundColor: '#E9EDFA',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#20263A',
  },
  dropdownOptionTextActive: {
    color: '#3157D5',
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F2F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4E5569',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3157D5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});