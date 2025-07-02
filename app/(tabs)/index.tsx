import React, { useState, useMemo } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import SearchBar from '@/components/searchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { useMatchesList } from '@/api/matches';
import { useTournamentList } from '@/api/tournaments';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const [searchCity, setSearchCity] = useState('');
  const { data: matches, isLoading: lm, error: me } = useMatchesList();
  const { data: tours, isLoading: lt, error: te } = useTournamentList();

  // filter by city
  const filteredMatches = useMemo(
    () =>
      matches?.filter((m) =>
        m.city.toLowerCase().includes(searchCity.trim().toLowerCase())
      ) || [],
    [matches, searchCity]
  );
  const filteredTours = useMemo(
    () =>
      tours?.filter((t) =>
        t.city.toLowerCase().includes(searchCity.trim().toLowerCase())
      ) || [],
    [tours, searchCity]
  );

  if (lm || lt) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  if (me || te) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-4">
        <Text className="text-red-400 text-lg">Failed to load data.</Text>
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
        <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />

        <SearchBar value={searchCity} onChangeText={setSearchCity} />

        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Tournaments */}
          <Text className="text-white text-xl font-bold mb-2">
            Tournaments
          </Text>
          <View className="h-1 bg-dark-200 mb-4" />

          {filteredTours.map((t) => (
            <Link key={t.id} href={`/tournaments/${t.id}`} asChild>
              <TouchableOpacity className="rounded-xl mb-3 overflow-hidden shadow-md">
                <LinearGradient
                  colors={[ '#3B0A45', '#000A1F']}
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

                      {/* progress bar */}
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
          ))}

          {/* Matches  */}
          <Text className="text-white text-xl font-bold mt-6 mb-2">
            Matches
          </Text>
          <View className="h-1 bg-dark-200 mb-4" />

          {filteredMatches.map((m) => (
            <Link key={m.id} href={`/matches/${m.id}`} asChild>
              <TouchableOpacity className="rounded-xl mb-3 overflow-hidden shadow-md">
                <LinearGradient
                  colors={[ '#3B0A45', '#000A1F']}
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

                    {/* progress bar */}
                    <View className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                      <View
                        className="h-1 bg-green-500"
                        style={{
                          width: `${(m.joined_count / m.players_needed) * 100}%`,
                        }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}