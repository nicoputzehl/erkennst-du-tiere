import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import type { AvailableHint, Hint } from '@/src/quiz/types'

type ReceivedHintsProps = {
  hints: AvailableHint[]
}

const ReceivedHints = ({ hints }: ReceivedHintsProps) => {
  // console.log(hints)
  return (
    <View>
      <Text>ReceivedHints</Text>
    </View>
  )
}

export default ReceivedHints

const styles = StyleSheet.create({})