import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { images } from '@/constants/images';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../providers/AuthProvider';

const router = useRouter();

const screenWidth = Dimensions.get('window').width;

const Profile = () => {
  const { profile, refreshProfile } = useAuth();

  const rating = profile?.rating ?? 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      refreshProfile();
    }, [])
  );

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: rating,
      duration: 1500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [rating]);

  const animatedMaskWidth = animatedWidth.interpolate({
    inputRange: [0, 1000],
    outputRange: [barWidth, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-primary">
      <TouchableOpacity
        onPress={() => supabase.auth.signOut()}
        className="absolute top-14 right-5 z-20 bg-red-500 px-4 py-1 rounded"
      >
        <Text className="text-white font-semibold text-sm">Logout</Text>
      </TouchableOpacity>

      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5 pt-20 z-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className="flex-row items-center gap-4 mb-10">
          <Image
            source={
              profile?.avatar_url
                ? { uri: profile.avatar_url }
                : images.defaultProfile}
            style={{
              width: screenWidth * 0.25,
              height: screenWidth * 0.25,
              borderRadius: (screenWidth * 0.25) / 2,
            }}
            className="bg-gray-300"
            resizeMode="cover"
          />

          <View className="flex-1 justify-center space-y-2">
            <Text
              className="text-white text-xl font-semibold"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {profile?.full_name || 'No Name'}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/editProfile')}
              className="bg-gray-500 px-4 py-1 rounded w-32 h-8 justify-center items-center mt-1">
              <Text className="text-white text-sm text-center">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Rating Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-lg">Rating</Text>
            <Text className="text-white text-base font-semibold">{rating}</Text>
          </View>

          <View
            className="h-4 bg-dark-200 rounded-full overflow-hidden relative"
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
          >
            {/* Full Gradient Background */}
            <LinearGradient
              colors={['#00FF00', '#FFFF00', '#FF0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Animated Black Mask */}
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: animatedMaskWidth,
                backgroundColor: 'black',
              }}
            />

            {/* Center Marker */}
            <View
              className="absolute w-1 h-6 bg-white -top-1 rounded-full"
              style={{ left: '50%' }}
            />
          </View>

          <View className="flex-row justify-between mt-1">
            <Text className="text-white text-xs">0</Text>
            <Text className="text-white text-xs">500</Text>
            <Text className="text-white text-xs">1000</Text>
          </View>
        </View>

        {/* Description */}
        <View>
          <Text className="text-white text-lg mb-2">Description</Text>
          <View className="bg-dark-200 p-4 rounded-xl">
            <Text className="text-white text-sm">{profile?.description || 'No description provided.'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
