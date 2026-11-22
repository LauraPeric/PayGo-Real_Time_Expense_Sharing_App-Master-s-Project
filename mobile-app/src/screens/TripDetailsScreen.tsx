import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../context/TripsContext';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, ReceiptSource } from '../types/index';

const getImagePicker = () => {
  try {
    return require('expo-image-picker');
  } catch {
    return null;
  }
};

export default function TripDetailsScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const { trips, addMessageToTrip, submitReceiptForAiReview } = useTrips();
  const { user } = useAuth();

  const [messageText, setMessageText] = useState('');
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isReviewingImage, setIsReviewingImage] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

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

  const currentUserName = user?.username || 'Ti';

  const triggerAiImageReview = async (source: ReceiptSource) => {
    setIsAttachMenuOpen(false);
    if (isReviewingImage) return;

    const ImagePicker = getImagePicker();
    if (!ImagePicker) {
      Alert.alert(
        'AI pregled slike',
        'Za otvaranje galerije ili kamere instaliraj expo-image-picker (npx expo install expo-image-picker).'
      );
      return;
    }

    try {
      if (source === 'gallery') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Dozvola potrebna', 'Dopusti pristup galeriji.');
          return;
        }
      } else {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Dozvola potrebna', 'Dopusti pristup kameri.');
          return;
        }
      }

      const pickerResult =
        source === 'gallery'
          ? await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? ['images'],
              quality: 0.85,
            })
          : await ImagePicker.launchCameraAsync({
              quality: 0.85,
            });

      if (pickerResult.canceled || !pickerResult.assets?.[0]?.uri) {
        return;
      }

      setIsReviewingImage(true);
      const job = await submitReceiptForAiReview(
        trip.id,
        pickerResult.assets[0].uri,
        source
      );
      setIsReviewingImage(false);

      if (job) {
        Alert.alert(
          'AI pregled slike',
          `Slika (${source === 'gallery' ? 'galerija' : 'kamera'}) je poslana na AI pregled.`
        );
      }
    } catch {
      setIsReviewingImage(false);
      Alert.alert('Greška', 'Nije uspjelo otvaranje odabira slike.');
    }
  };

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    addMessageToTrip(trip.id, trimmed);
    setMessageText('');

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.sender === currentUserName || item.sender === 'Ti';

    return (
      <View
        style={[
          styles.bubbleRow,
          isMine ? styles.bubbleRowMine : styles.bubbleRowOther,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleOther,
          ]}
        >
          {!isMine && <Text style={styles.senderName}>@{item.sender}</Text>}
          <Text style={[styles.messageText, isMine && styles.messageTextMine]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMine && styles.timeTextMine]}>
            {item.createdAt}
          </Text>
        </View>
      </View>
    );
  };

  const canSend = messageText.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* zaglavlje */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.75}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCenter}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('GroupSettings', { tripId: trip.id })}
        >
          <Text style={styles.groupTitle} numberOfLines={1}>
            {trip.name}
          </Text>
          <Text style={styles.groupSub}>
            {trip.members.length} {trip.members.length === 1 ? 'član' : 'članova'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('GroupSettings', { tripId: trip.id })}
        >
          <Text style={styles.settingsBtnText}>Postavke</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* chat */}
        {trip.messages.length === 0 ? (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyTitle}>Nema još poruka</Text>
            <Text style={styles.emptyHint}>
              Napiši poruku za početak razgovora ili klikni + za odabir slike.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={trip.messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        {/* status obrade slike */}
        {isReviewingImage && (
          <View style={styles.aiStatusBar}>
            <ActivityIndicator size="small" color="#3157D5" />
            <Text style={styles.aiStatusText}>AI pregledava sliku...</Text>
          </View>
        )}

        {/* izbornik za galeriju i kameru */}
        {isAttachMenuOpen && (
          <View style={styles.attachSheet}>
            <TouchableOpacity
              style={styles.attachOption}
              activeOpacity={0.8}
              onPress={() => triggerAiImageReview('gallery')}
            >
              <Text style={styles.attachOptionText}>Galerija</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachOption}
              activeOpacity={0.8}
              onPress={() => triggerAiImageReview('camera')}
            >
              <Text style={styles.attachOptionText}>Kamera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* donja traka za unos poruke */}
        <View style={styles.composerWrapper}>
          <TouchableOpacity
            style={[
              styles.plusBtn,
              isAttachMenuOpen && styles.plusBtnActive,
            ]}
            activeOpacity={0.8}
            disabled={isReviewingImage}
            onPress={() => setIsAttachMenuOpen((prev) => !prev)}
          >
            <Text
              style={[
                styles.plusText,
                isAttachMenuOpen && styles.plusTextActive,
              ]}
            >
              +
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Poruka..."
            placeholderTextColor="#9AA1B2"
            value={messageText}
            onChangeText={setMessageText}
            onFocus={() => setIsAttachMenuOpen(false)}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendCircleBtn, !canSend && styles.sendCircleBtnDisabled]}
            activeOpacity={0.85}
            disabled={!canSend}
            onPress={handleSend}
          >
            <Text style={styles.sendArrowText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#1E2436',
  },
  linkText: {
    color: '#3157D5',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF4',
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#1E2436',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E2436',
  },
  groupSub: {
    fontSize: 12,
    color: '#7E869A',
    marginTop: 1,
  },
  settingsBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  settingsBtnText: {
    color: '#3157D5',
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyFeed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2436',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: '#7E869A',
    textAlign: 'center',
    lineHeight: 19,
  },
  feedContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 8,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bubbleMine: {
    backgroundColor: '#3157D5',
    borderBottomRightRadius: 5,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderBottomLeftRadius: 5,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3157D5',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14.5,
    color: '#1E2436',
    lineHeight: 20,
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 10,
    color: '#8E95A7',
    marginTop: 3,
    alignSelf: 'flex-end',
  },
  timeTextMine: {
    color: 'rgba(255, 255, 255, 0.78)',
  },
  aiStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderTopWidth: 1,
    borderTopColor: '#DCE4FF',
  },
  aiStatusText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#3157D5',
  },
  attachSheet: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF4',
  },
  attachOption: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    borderWidth: 1,
    borderColor: '#DCE2EE',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  attachOptionText: {
    color: '#2B3550',
    fontSize: 13,
    fontWeight: '700',
  },
  composerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF4',
    gap: 8,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#B8C4E6',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  plusBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#3157D5',
  },
  plusText: {
    fontSize: 21,
    lineHeight: 23,
    color: '#5B6787',
    fontWeight: '500',
  },
  plusTextActive: {
    color: '#3157D5',
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E2E7F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14.5,
    color: '#1E2436',
  },
  sendCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3157D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  sendCircleBtnDisabled: {
    backgroundColor: '#B8C5EC',
  },
  sendArrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
});