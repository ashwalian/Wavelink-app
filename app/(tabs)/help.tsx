import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TelephoneIcon from '@/components/icons/TelephoneIcon';
import MailFilledIcon from '@/components/icons/MailFilledIcon';
import QuestionMark from '@/components/icons/QuestionMark';
import { useThemePreference } from '@/features/theme/theme-preference-provider';

export default function HelpScreen() {
  const { isDarkMode } = useThemePreference();
  const bg = isDarkMode ? '#0a0a0a' : '#ffffff';
  const headingC = isDarkMode ? '#ffffff' : '#0f172a';
  const iconC = isDarkMode ? '#ffffff' : '#0f172a';
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0';
  const descC = isDarkMode ? '#9ca3af' : '#64748b';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: headingC }]}>Help Center</Text>
        <View style={styles.helpList}>
          <View style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <TelephoneIcon size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>Contact Tech Support</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
                24/7 technical assistance for connectivity issues.
              </Text>
            </View>
          </View>

          <View style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <MailFilledIcon size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>Contact via Email</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
                Send us an email and we'll reply within 24 hours.
              </Text>
            </View>
          </View>

          <View style={[styles.helpCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <QuestionMark size={32} color={iconC} />
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpTitle, { color: headingC }]}>FAQ</Text>
              <Text style={[styles.helpDescription, { color: descC }]}>
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
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
