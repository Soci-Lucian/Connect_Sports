import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!email) {
      return Alert.alert('Please enter your email address')
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert(
        'Check your inbox',
        'We’ve sent you a link to reset your password.'
      )
      router.back()
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        className="flex-1 px-6 justify-center"
      >
        <Text className="text-white text-3xl font-bold mb-6 text-center">
          Reset Password
        </Text>

        <View className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6">
          <Text className="text-white font-medium mb-3">Email</Text>
          <View className="bg-white/10 rounded-2xl border border-white/20">
            <View className="flex-row items-center px-4 py-4">
              <Ionicons
                name="mail-outline"
                size={20}
                color="#94A3B8"
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-white"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleReset}
          disabled={loading}
          className="mb-4"
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7', '#7C3AED']}
            style={{
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Send Reset Link
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-purple-400">Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}
