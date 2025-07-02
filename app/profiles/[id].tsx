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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const screenWidth = Dimensions.get('window').width;

const ProfileView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, rating, description')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const rating = profile?.rating ?? 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-5 z-20 bg-gray-600 px-4 py-1 rounded"
      >
        <Text className="text-white font-semibold text-sm">Back</Text>
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
        <View className="flex-row items-center gap-4 mb-10 mt-5">
          <Image
            source={
              profile?.avatar_url
                ? { uri: profile.avatar_url }
                : images.defaultProfile
            }
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
            <LinearGradient
              colors={['#00FF00', '#FFFF00', '#FF0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

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

        {/* Description Section */}
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

export default ProfileView;
