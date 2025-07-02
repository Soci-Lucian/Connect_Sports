import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';


const EditProfile = () => {
  const { profile, session } = useAuth();

  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setDescription(profile.description || '');
      setRating(profile.rating?.toString() || '');
      if (profile.avatar_url) setImageUri(profile.avatar_url);
    }
  }, [profile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!session?.user) return;

    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 1000) {
      Alert.alert('Invalid Rating', 'Please enter a number between 0 and 1000.');
      return;
    }

    let avatar_url = profile.avatar_url;

    if (imageUri && imageUri.startsWith('file://')) {
      try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fileExt = imageUri.split('.').pop() || 'png';
        const fileName = `${session.user.id}-${Date.now()}.png`;
        const filePath = `${fileName}`;
        const contentType = `image/${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, decode(base64), {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          Alert.alert('Upload Error', uploadError.message);
          return;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = data.publicUrl;
      } catch (err) {
        console.error('Upload exception:', err);
        Alert.alert('Upload Error', 'Failed to upload image...');
        return;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: name,
        description,
        rating: numericRating,
        avatar_url,
      })
      .eq('id', session.user.id);

    if (error) {
      Alert.alert('Update Error', error.message);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary px-5 pt-20"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-white text-2xl font-bold mb-6">Edit Profile</Text>

        {/* Profile Picture */}
        <TouchableOpacity className="items-center mb-6" onPress={pickImage}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-28 h-28 rounded-full bg-gray-300"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-gray-600 justify-center items-center">
              <Text className="text-white">Select Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-white mb-1">Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#A8B5DB"
            className="bg-dark-200 text-white p-3 rounded-lg"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-white mb-1">Description</Text>
          <TextInput
            placeholder="Write something about yourself"
            placeholderTextColor="#A8B5DB"
            className="bg-dark-200 text-white p-3 rounded-lg"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Rating Input */}
        <View className="mb-6">
          <Text className="text-white mb-1">Rating (0–1000)</Text>
          <TextInput
            placeholder="e.g. 650"
            placeholderTextColor="#A8B5DB"
            className="bg-dark-200 text-white p-3 rounded-lg"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Save Changes</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 items-center"
        >
          <Text className="text-gray-300 underline">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
