import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import TelephoneIcon from '@/components/icons/TelephoneIcon';
import MailFilledIcon from '@/components/icons/MailFilledIcon';
import QuestionMark from '@/components/icons/QuestionMark';
import { useThemePreference } from '@/features/theme/theme-preference-provider';
import { getAiraloCompatibleDevicesLite } from '@/lib/airalo';

export default function HelpScreen() {
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [question, setQuestion] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [devices, setDevices] = useState<string[]>([]);
  const { isDarkMode } = useThemePreference();
  const bg = isDarkMode ? '#0a0a0a' : '#ffffff';
  const headingC = isDarkMode ? '#ffffff' : '#0f172a';
  const iconC = isDarkMode ? '#ffffff' : '#0f172a';
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0';
  const descC = isDarkMode ? '#9ca3af' : '#64748b';
  const modalBg = isDarkMode ? '#101010' : '#ffffff';
  const inputBg = isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc';

  const faqItems = useMemo(
    () => [
      {
        q: 'How long does eSIM activation take?',
        a: 'Most plans activate within a minute after purchase and installation.',
      },
      {
        q: 'Can I top up my current eSIM?',
        a: 'Yes, supported plans can be recharged from your eSIM details screen.',
      },
      {
        q: 'Can I pay with USDC on Solana?',
        a: 'Yes, WaveLink supports USDC on Solana for checkout.',
      },
    ],
    [],
  );

  const submitQuestion = () => {
    if (!question.trim()) {
      Alert.alert('Please add a question');
      return;
    }
    Alert.alert('Saved', 'Your question has been saved and will be sent to ashwalian13@gmail.com.');
    setQuestion('');
    setShowEmailBox(false);
  };

  const openDevicesModal = async () => {
    setShowDevices(true);
    if (devices.length > 0) return;
    setLoadingDevices(true);
    try {
      const response = await getAiraloCompatibleDevicesLite();
      const names = (response.data ?? [])
        .map((entry) => {
          const row = entry as Record<string, unknown>;
          const brand = typeof row.brand === 'string' ? row.brand : '';
          const model = typeof row.model === 'string' ? row.model : '';
          const name = typeof row.name === 'string' ? row.name : `${brand} ${model}`.trim();
          return name.trim();
        })
        .filter(Boolean)
        .slice(0, 30);
      setDevices(names);
    } catch {
      setDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: headingC }]}>Help Center</Text>
        <View style={styles.helpList}>
          <Pressable style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <TelephoneIcon size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>Contact Tech Support</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
                24/7 technical assistance for connectivity issues.
              </Text>
            </View>
            <Text style={[styles.arrow, { color: descC }]}>›</Text>
          </Pressable>

          <Pressable
            style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setShowEmailBox(true)}
          >
            <MailFilledIcon size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>Contact via Email</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
                Send us an email and we'll reply within 24 hours.
              </Text>
              <Text style={[styles.emailText, { color: headingC }]}>ashwalian13@gmail.com</Text>
            </View>
            <Text style={[styles.arrow, { color: descC }]}>›</Text>
          </Pressable>

          <Pressable
            style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setShowFaq(true)}
          >
            <QuestionMark size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>FAQ</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
                Find answers to common questions about eSIMs.
              </Text>
            </View>
            <Text style={[styles.arrow, { color: descC }]}>›</Text>
          </Pressable>

          <Pressable
            style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={openDevicesModal}
          >
            <QuestionMark size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>Compatible Devices</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
                View phone models that support eSIM.
              </Text>
            </View>
            <Text style={[styles.arrow, { color: descC }]}>›</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showEmailBox} transparent animationType="fade" onRequestClose={() => setShowEmailBox(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={65} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalDimmer} />
          <View style={[styles.modalCard, { backgroundColor: modalBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headingC }]}>Ask your question</Text>
            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder="Write your question..."
              placeholderTextColor={descC}
              multiline
              style={[
                styles.input,
                {
                  color: headingC,
                  backgroundColor: inputBg,
                  borderColor: cardBorder,
                  outlineColor: 'transparent',
                },
              ]}
            />
            <View style={styles.modalActions}>
              <Pressable style={[styles.btn, { borderColor: cardBorder }]} onPress={() => setShowEmailBox(false)}>
                <Text style={[styles.btnText, { color: headingC }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.primaryBtn]} onPress={submitQuestion}>
                <Text style={[styles.btnText, { color: '#ffffff' }]}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showFaq} transparent animationType="fade" onRequestClose={() => setShowFaq(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={65} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalDimmer} />
          <View style={[styles.modalCard, { backgroundColor: modalBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headingC }]}>FAQ</Text>
            <View style={[styles.faqWrap, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <Pressable
                    key={item.q}
                    style={[
                      styles.faqItem,
                      idx !== faqItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: cardBorder },
                    ]}
                    onPress={() => setOpenFaqIndex(isOpen ? null : idx)}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={[styles.faqQ, { color: headingC }]}>{item.q}</Text>
                      <Text style={[styles.faqToggle, { color: headingC }]}>{isOpen ? '-' : '+'}</Text>
                    </View>
                    {isOpen ? <Text style={[styles.faqA, { color: descC }]}>{item.a}</Text> : null}
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.modalActions}>
              <Pressable style={[styles.btn, { borderColor: cardBorder }]} onPress={() => setShowFaq(false)}>
                <Text style={[styles.btnText, { color: headingC }]}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showDevices} transparent animationType="fade" onRequestClose={() => setShowDevices(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={65} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalDimmer} />
          <View style={[styles.modalCard, { backgroundColor: modalBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headingC }]}>Compatible devices</Text>
            {loadingDevices ? <ActivityIndicator color="#4f46e5" /> : null}
            {!loadingDevices && devices.length === 0 ? (
              <Text style={[styles.modalDesc, { color: descC }]}>Unable to load compatible devices right now.</Text>
            ) : null}
            {!loadingDevices && devices.length > 0 ? (
              <ScrollView style={styles.deviceList} contentContainerStyle={{ gap: 8 }}>
                {devices.map((name) => (
                  <Text key={name} style={[styles.deviceItem, { color: headingC }]}>
                    • {name}
                  </Text>
                ))}
              </ScrollView>
            ) : null}
            <View style={styles.modalActions}>
              <Pressable style={[styles.btn, { borderColor: cardBorder }]} onPress={() => setShowDevices(false)}>
                <Text style={[styles.btnText, { color: headingC }]}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  helpList: {
    gap: 16,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  helpTextContainer: {
    flex: 1,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '700',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  emailText: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 13,
  },
  faqWrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
  },
  faqA: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.22)',
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  deviceList: {
    maxHeight: 260,
  },
  deviceItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    textAlignVertical: 'top',
  },
  modalActions: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  primaryBtn: {
    borderColor: '#4f46e5',
    backgroundColor: '#4f46e5',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
