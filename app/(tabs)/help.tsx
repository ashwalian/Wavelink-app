import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TelephoneIcon from '@/components/icons/TelephoneIcon';
import MailFilledIcon from '@/components/icons/MailFilledIcon';
import QuestionMark from '@/components/icons/QuestionMark';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Help Center</Text>
        <View style={styles.helpList}>
          <View style={styles.helpCard}>
            <TelephoneIcon size={32} color="#ffffff" />
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpTitle}>Contact Tech Support</Text>
              <Text style={styles.helpDescription}>
                24/7 technical assistance for connectivity issues.
              </Text>
            </View>
          </View>

          <View style={styles.helpCard}>
            <MailFilledIcon size={32} color="#ffffff" />
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpTitle}>Contact via Email</Text>
              <Text style={styles.helpDescription}>
                Send us an email and we'll reply within 24 hours.
              </Text>
            </View>
          </View>

          <View style={styles.helpCard}>
            <QuestionMark size={32} color="#ffffff" />
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpTitle}>FAQ</Text>
              <Text style={styles.helpDescription}>
                Find answers to common questions about eSIMs.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
});
