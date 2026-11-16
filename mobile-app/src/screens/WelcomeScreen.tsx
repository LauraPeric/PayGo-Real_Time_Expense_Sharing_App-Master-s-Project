import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>✈️</Text>
        </View>
        <Text style={styles.logoText}>PayGo</Text>
        <Text style={styles.tagline}>
          Jednostavno dijeli troškove putovanja i račune s prijateljima.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Auth', { mode: 'register' })}
        >
          <Text style={styles.primaryButtonText}>Registracija</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Auth', { mode: 'login' })}
        >
          <Text style={styles.secondaryButtonText}>Prijava</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    justifyContent: 'space-between',
    padding: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E9EDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 42,
  },
  logoText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#3157D5',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 15,
    color: '#858B9C',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#3157D5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE1EF',
  },
  secondaryButtonText: {
    color: '#3157D5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});