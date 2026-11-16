import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  // stanja uredivanja placanja
  const [modalVisible, setModalVisible] = useState(false);
  const [iban, setIban] = useState('');
  const [keksPay, setKeksPay] = useState('');
  const [savedIban, setSavedIban] = useState('');
  const [savedKeks, setSavedKeks] = useState('');

  const handleSavePayment = () => {
    setSavedIban(iban);
    setSavedKeks(keksPay);
    setModalVisible(false);
    Alert.alert('Uspjeh', 'Načini plaćanja su uspješno spremljeni!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Moj profil</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        {/*pravi korisnik*/}
        <Text style={styles.name}>{user?.username || 'PayGo korisnik'}</Text>
        <Text style={styles.username}>{user?.email || '@username'}</Text>

        <View style={styles.section}>
          <TouchableOpacity style={styles.itemRow} onPress={() => Alert.alert('Osobni podaci', `Email: ${user?.email}\nKorisničko ime: ${user?.username}`)}>
            <Text style={styles.item}>Osobni podaci</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemRow} onPress={() => setModalVisible(true)}>
            <View>
              <Text style={styles.item}>Načini plaćanja</Text>
              {(savedIban || savedKeks) ? (
                <Text style={styles.subItemText}>Konfigurirano</Text>
              ) : null}
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemRow} onPress={() => Alert.alert('Moj QR kod', 'Ovdje će se generirati QR kod za brzo prebacivanje novca.')}>
            <Text style={styles.item}>Moj QR kod</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemRow} onPress={() => Alert.alert('Postavke', 'Postavke aplikacije uskoro.')}>
            <Text style={styles.item}>Postavke</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Odjavi se</Text>
        </TouchableOpacity>
      </ScrollView>

      {/*modal za unos načina placanja) */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Načini plaćanja</Text>
            <Text style={styles.modalSubtitle}>Unesi podatke preko kojih ti prijatelji mogu slati novac za troškove.</Text>

            <Text style={styles.label}>IBAN (Bankovni račun)</Text>
            <TextInput
              style={styles.input}
              placeholder="HR1234567890123456789"
              placeholderTextColor="#A0A6B5"
              value={iban}
              onChangeText={setIban}
            />

            <Text style={styles.label}>KEKS Pay / Broj mobitela</Text>
            <TextInput
              style={styles.input}
              placeholder="+385 91 123 4567"
              placeholderTextColor="#A0A6B5"
              value={keksPay}
              onChangeText={setKeksPay}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePayment}>
                <Text style={styles.saveButtonText}>Spremi</Text>
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
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20263A',
  },
  avatar: {
    alignSelf: 'center',
    marginTop: 35,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E9EDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#20263A',
    marginTop: 15,
  },
  username: {
    textAlign: 'center',
    color: '#858B9C',
    marginTop: 5,
  },
  section: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF3',
  },
  item: {
    fontSize: 15,
    color: '#20263A',
    fontWeight: '500',
  },
  subItemText: {
    fontSize: 12,
    color: '#3157D5',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#858B9C',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FFE5E5',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#D93838',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingBottom: 40,
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
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
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