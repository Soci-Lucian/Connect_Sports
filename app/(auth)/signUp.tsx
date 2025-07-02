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

export default function SignUp() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, } }
        });

        setIsLoading(false);

        if (error) {
            Alert.alert(error.message);
            return;
        }

        // Optional: wait for email confirmation, change from supabase
        // Alert.alert('Check your email to confirm your account!');
        router.replace('/signIn');
    };

    const passwordsMatch = password === confirmPassword || confirmPassword === '';

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
                    contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6">
                        {/* Logo Section */}
                        <View className="items-center mb-10">
                            <Image
                                source={logo2}
                                className="w-32 h-32 mb-6"
                                resizeMode="contain"
                            />
                            <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
                            <Text className="text-slate-400 text-base text-center">
                                Join the football community today
                            </Text>
                        </View>

                        {/* Form Container */}
                        <View className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/10">
                            {/* Name Input */}
                            <View className="mb-5">
                                <Text className="text-white font-medium mb-3 text-base">Full Name</Text>
                                <View className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <View className="flex-row items-center px-4 py-4">
                                        <Ionicons
                                            name="person-outline"
                                            size={20}
                                            color="#94A3B8"
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="Enter your full name"
                                            placeholderTextColor="#64748B"
                                            value={name}
                                            onChangeText={setName}
                                            className="flex-1 text-white text-base"
                                            autoCapitalize="words"
                                            autoComplete="name"
                                        />
                                    </View>
                                </View>
                            </View>

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
                            <View className="mb-5">
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
                                            placeholder="Create a password"
                                            placeholderTextColor="#64748B"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                            className="flex-1 text-white text-base"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
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

                            {/* Confirm Password Input */}
                            <View className="mb-6">
                                <Text className="text-white font-medium mb-3 text-base">Confirm Password</Text>
                                <View className={`bg-white/10 backdrop-blur-sm rounded-2xl border ${passwordsMatch ? 'border-white/20' : 'border-red-400/50'
                                    }`}>
                                    <View className="flex-row items-center px-4 py-4">
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={20}
                                            color={passwordsMatch ? "#94A3B8" : "#F87171"}
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="Confirm your password"
                                            placeholderTextColor="#64748B"
                                            secureTextEntry={!showConfirmPassword}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            className="flex-1 text-white text-base"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="ml-2"
                                        >
                                            <Ionicons
                                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                                size={20}
                                                color="#94A3B8"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {!passwordsMatch && confirmPassword !== '' && (
                                    <Text className="text-red-400 text-sm mt-2 ml-1">Passwords don't match</Text>
                                )}
                            </View>

                            {/* Terms and Conditions */}
                            <View className="flex-row items-start mb-6">
                                <TouchableOpacity className="mr-3 mt-1">
                                    <View className="w-5 h-5 border border-white/30 rounded bg-white/10 items-center justify-center">
                                        <Ionicons name="checkmark" size={12} color="#8B5CF6" />
                                    </View>
                                </TouchableOpacity>
                                <View className="flex-1">
                                    <Text className="text-slate-300 text-sm leading-5">
                                        I agree to the{' '}
                                        <Text className="text-purple-400 font-medium">Terms of Service</Text>
                                        {' '}and{' '}
                                        <Text className="text-purple-400 font-medium">Privacy Policy</Text>
                                    </Text>
                                </View>
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                onPress={handleSignUp}
                                disabled={isLoading || !passwordsMatch}
                                className="mb-4"
                                style={{
                                    opacity: (!passwordsMatch || isLoading) ? 0.5 : 1
                                }}
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
                                                <Text className="text-white font-bold text-lg">Creating Account...</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Ionicons name="person-add-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                                <Text className="text-white font-bold text-lg">Create Account</Text>
                                            </>
                                        )}
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* bar */}

                        <View className="h-px bg-white/20 mb-6" />


                        {/* Sign In Link */}
                        <View className="flex-row justify-center items-center mb-16">
                            <Text className="text-slate-400 text-base">Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/signIn')}>
                                <Text className="text-purple-400 font-bold text-base">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}