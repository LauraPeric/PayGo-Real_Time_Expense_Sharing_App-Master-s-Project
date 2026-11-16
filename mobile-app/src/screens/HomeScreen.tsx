import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>PayGo</Text>
        {/* <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Moja putovanja</Text>
        <Text style={styles.subtitle}>
          Sva tvoja putovanja na jednom mjestu.
        </Text>
      </View>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>✈️</Text>
        <Text style={styles.emptyTitle}>Još nemaš putovanja</Text>
        <Text style={styles.emptyText}>
          Kreiraj svoju prvu grupu i počni jednostavno
          dijeliti troškove s prijateljima.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => console.log('Create trip')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#3157D5',
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E9EDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginTop: 15,
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
});
