import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Obavijesti</Text>
      <Text style={styles.subtitle}>
        Ovdje će se prikazivati tvoje obavijesti.
      </Text>

      <View style={styles.empty}>
        <Text style={styles.icon}>🔔</Text>
        <Text style={styles.message}>Nema novih obavijesti</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20263A',
  },
  subtitle: {
    color: '#858B9C',
    marginTop: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 50,
    marginBottom: 15,
  },
  message: {
    color: '#858B9C',
    fontSize: 15,
  },
});