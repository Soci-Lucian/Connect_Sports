import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import logo2 from "@/assets/images/logo2.png";
import { supabase } from '@/lib/supabase';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsLoading(false);

        if (error) {
            Alert.alert(error.message);
        } else {
            router.replace('/(tabs)');
        }
    };


    return (
        <View className="flex-1">
            <LinearGradient
                colors={['#0F172A', '#1E293B', '#334155']}
                className="absolute inset-0"
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
            >
                <StatusBar barStyle="light-content" />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, paddingTop: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6">
                        {/* Logo Section */}
                        <View className="items-center mb-12">
                            <Image
                                source={logo2}
                                className="w-32 h-32 mb-6"
                                resizeMode="contain"
                            />
                            <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
                            <Text className="text-slate-400 text-base text-center">
                                Sign in to continue your football journey
                            </Text>
                        </View>

                        {/* Form Container */}
                        <View className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/10">
                            {/* Email Input */}
                            <View className="mb-5">
                                <Text className="text-white font-medium mb-3 text-base">Email</Text>
                                <View className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <View className="flex-row items-center px-4 py-4">
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color="#94A3B8"
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="Enter your email"
                                            placeholderTextColor="#64748B"
                                            value={email}
                                            onChangeText={setEmail}
                                            className="flex-1 text-white text-base"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Password Input */}
                            <View className="mb-6">
                                <Text className="text-white font-medium mb-3 text-base">Password</Text>
                                <View className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <View className="flex-row items-center px-4 py-4">
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color="#94A3B8"
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="Enter your password"
                                            placeholderTextColor="#64748B"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                            className="flex-1 text-white text-base"
                                            autoCapitalize="none"
                                            autoComplete="password"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            className="ml-2"
                                        >
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={20}
                                                color="#94A3B8"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity
                                onPress={() => router.push('/forgotPassword')}
                                className="self-end mb-6">
                                <Text className="text-purple-400 font-medium">Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Sign In Button */}
                            <TouchableOpacity
                                onPress={handleSignIn}
                                disabled={isLoading}
                                className="mb-4"
                            >
                                <LinearGradient
                                    colors={['#8B5CF6', '#A855F7', '#7C3AED']}
                                    style={{
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View className="flex-row items-center">
                                        {isLoading ? (
                                            <>
                                                <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                <Text className="text-white font-bold text-lg">Signing In...</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Ionicons name="log-in-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                                <Text className="text-white font-bold text-lg">Sign In</Text>
                                            </>
                                        )}
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Bar */}
                        <View className="h-px bg-white/20 mb-6" />

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center items-center mb-6">
                            <Text className="text-slate-400 text-base">Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/signUp')}>
                                <Text className="text-purple-400 font-bold text-base">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}