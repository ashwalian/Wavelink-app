import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { useThemePreference } from '@/features/theme/theme-preference-provider'

type TabKey = 'available' | 'expired'

const EXPIRED_DUMMY = [
  {
    id: '1',
    flag: '🇺🇸',
    name: 'United States eSIM',
    iccid: '8910 3000 0000 5271 146',
    expiredOn: '2026-02-15',
  },
  {
    id: '2',
    flag: '🇯🇵',
    name: 'Japan eSIM',
    iccid: '8910 3000 0000 4211 902',
    expiredOn: '2026-01-10',
  },
]

export default function VirtualNumberScreen() {
  const router = useRouter()
  const { isDarkMode } = useThemePreference()
  const [tab, setTab] = useState<TabKey>('available')

  const bg = isDarkMode ? '#0a0a0a' : '#ffffff'
  const titleC = isDarkMode ? '#ffffff' : '#0f172a'
  const subC = isDarkMode ? '#9ca3af' : '#64748b'
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'
  const activeTabBg = isDarkMode ? 'rgba(99,102,241,0.24)' : 'rgba(99,102,241,0.12)'
  const activeTabBorder = isDarkMode ? 'rgba(129,140,248,0.65)' : '#818cf8'
  const tabBg = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'

  const content = useMemo(() => {
    if (tab === 'available') {
      return (
        <View style={styles.emptyWrap}>
          <Image
            source={{
              uri: 'https://img.freepik.com/premium-photo/flying-cartoon-shopping-basket-purple-background-minimal-style-empty-grocery-shopping-cart-3d_989822-2737.jpg',
            }}
            style={styles.emptyImage}
            contentFit="cover"
          />
          <Text style={[styles.emptyTitle, { color: titleC }]}>You don&apos;t have eSIMs yet</Text>
          <Text style={[styles.emptySub, { color: subC }]}>
            Buy your first eSIM plan to get started.
          </Text>
          <Pressable style={styles.buyBtn} onPress={() => router.push('/')}>
            <Text style={styles.buyBtnText}>Buy eSIM</Text>
          </Pressable>
        </View>
      )
    }

    return (
      <View style={styles.list}>
        {EXPIRED_DUMMY.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemFlag}>{item.flag}</Text>
              <Text style={[styles.itemTitle, { color: titleC }]}>{item.name}</Text>
            </View>
            <Text style={[styles.itemMeta, { color: subC }]}>ICCID: {item.iccid}</Text>
            <Text style={[styles.itemMeta, { color: subC }]}>Expired on: {item.expiredOn}</Text>
          </View>
        ))}
      </View>
    )
  }, [tab, cardBg, cardBorder, titleC, subC, router])

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: titleC }]}>My eSIMs</Text>
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setTab('available')}
            style={[
              styles.tabBtn,
              { backgroundColor: tabBg, borderColor: cardBorder },
              tab === 'available' && { backgroundColor: activeTabBg, borderColor: activeTabBorder },
            ]}
          >
            <Text style={[styles.tabLabel, { color: tab === 'available' ? '#818cf8' : subC }]}>Available</Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('expired')}
            style={[
              styles.tabBtn,
              { backgroundColor: tabBg, borderColor: cardBorder },
              tab === 'expired' && { backgroundColor: activeTabBg, borderColor: activeTabBorder },
            ]}
          >
            <Text style={[styles.tabLabel, { color: tab === 'expired' ? '#818cf8' : subC }]}>Expired</Text>
          </Pressable>
        </View>

        {content}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  emptyImage: {
    width: 220,
    height: 160,
    borderRadius: 14,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  buyBtn: {
    marginTop: 16,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  itemFlag: {
    fontSize: 20,
  },
  itemMeta: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
})
