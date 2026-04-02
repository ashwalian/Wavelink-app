import { AiraloFeatureIndex } from '@/features/airalo/airalo-feature-index'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top', 'left', 'right']}>
      <AiraloFeatureIndex />
    </SafeAreaView>
  )
}
