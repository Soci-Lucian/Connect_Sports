import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '@/constants/images';
import { useSavedMatches } from '@/api/matches';
import { useSavedTournaments } from '@/api/tournaments';

export default function Saved() {
  const {
    data: savedMatches,
    isLoading: loadingMatches,
    error: matchesError,
  } = useSavedMatches();
  const {
    data: savedTournaments,
    isLoading: loadingTournaments,
    error: toursError,
  } = useSavedTournaments();

  if (loadingMatches || loadingTournaments) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (matchesError || toursError) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-4">
        <Text className="text-red-400 text-lg">
          Failed to load saved items.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full"
        resizeMode="cover"
      />

      <View className="flex-1 px-5 pt-20 z-10">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Saved Tournaments */}
          <Text className="text-white text-xl font-bold mb-2">
            Saved Tournaments
          </Text>
          <View className="h-1 bg-dark-200 mb-4" />

          {savedTournaments?.length ? (
            savedTournaments.map((t) => (
              <Link key={t.id} href={`/tournaments/${t.id}`} asChild>
                <TouchableOpacity className="rounded-xl mb-3 overflow-hidden shadow-md">
                  <LinearGradient
                    colors={['#3B0A45', '#000A1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="trophy"
                        size={20}
                        color="white"
                        className="mr-3"
                      />
                      <View className="flex-1">
                        <Text className="text-white font-bold text-lg">
                          {t.name}
                        </Text>
                        <Text className="text-white text-sm">
                          City: {t.city}
                        </Text>
                        <Text className="text-white text-sm">
                          {t.start_date} – {t.end_date}
                        </Text>
                        <Text className="text-white text-sm mt-1">
                          Teams joined: {t.joined_count}/{t.teams}
                        </Text>
                        <View className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                          <View
                            className="h-1 bg-green-500"
                            style={{
                              width: `${(t.joined_count / t.teams) * 100}%`,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <Text className="text-slate-400 mb-6">No tournaments saved.</Text>
          )}

          {/* Saved Matches */}
          <Text className="text-white text-xl font-bold mt-6 mb-2">
            Saved Matches
          </Text>
          <View className="h-1 bg-dark-200 mb-4" />

          {savedMatches?.length ? (
            savedMatches.map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`} asChild>
                <TouchableOpacity className="rounded-xl mb-3 overflow-hidden shadow-md">
                  <LinearGradient
                    colors={['#3B0A45', '#000A1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4 flex-row items-center"
                  >
                    <Ionicons
                      name="football"
                      size={20}
                      color="white"
                      className="mr-3"
                    />
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg">
                        {m.name}
                      </Text>
                      <Text className="text-white text-sm">
                        City: {m.city}
                      </Text>
                      <Text className="text-white text-sm mt-1">
                        Joined: {m.joined_count}/{m.players_needed}
                      </Text>
                      <View className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                        <View
                          className="h-1 bg-green-500"
                          style={{
                            width: `${
                              (m.joined_count / m.players_needed) * 100
                            }%`,
                          }}
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <Text className="text-slate-400">No matches saved.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
