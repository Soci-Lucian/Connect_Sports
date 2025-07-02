import { View, Image, TextInput, TextInputProps } from 'react-native';
import React from 'react';
import { icons } from '@/constants/icons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
} & Pick<TextInputProps, 'placeholder'>;

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = 'Search by city…',
}: Props) {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 mb-6">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        className="flex-1 ml-2 text-white"
        placeholder={placeholder}
        placeholderTextColor="#A8B5DB"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
    </View>
  );
}
