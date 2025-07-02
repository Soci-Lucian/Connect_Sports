import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useMatchById,
  useDeleteMatch,
  useJoinedMatchStatus,
  useJoinMatch,
  useWithdrawFromMatch,
  useMatchPlayers,
} from '@/api/matches';
import { useAuth } from '@/providers/AuthProvider';
import { images } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';

export default function MatchDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuth();
  const router = useRouter();

  const {
    data: match,
    isLoading,
    error,
  } = useMatchById(id!);
  const { mutate: deleteMatch, isPending: deleting } = useDeleteMatch();
  const {
    data: isJoined,
    isPending: loadingJoinStatus,
  } = useJoinedMatchStatus(id!);
  const { mutate: joinMatch, isPending: joining } = useJoinMatch();
  const { mutate: withdraw, isPending: withdrawing } = useWithdrawFromMatch();
  const { data: players, isLoading: loadingPlayers } = useMatchPlayers(id!);

  const confirmDelete = () => {
    Alert.alert(
      'Delete Match?',
      'Are you sure you want to delete this match? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const handleDelete = () => {
    if (!match?.id) return;
    deleteMatch(match.id, {
      onSuccess: () => router.replace('/'),
    });
  };


  const handleJoin = () => joinMatch(id!);
  const handleWithdraw = () => withdraw(id!);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  if (error || !match) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-4">
        <Text className="text-red-500 text-lg">Failed to load match.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={images.matchBanner}
        className="w-full h-48"
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-10 left-4 bg-black/50 p-2 rounded-full"
        >
          <Text className="text-white text-sm">  Back  </Text>
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Title */}
        <Text className="text-white text-3xl font-bold mb-4">
          {match.name}
        </Text>

        {/* Key Details */}
        <View className="bg-dark-200 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-white font-semibold">City:</Text>
            <Text className="text-white">{match.city}</Text>
          </View>
          <View className="flex-row justify-between mb-2 flex-wrap">
            <Text className="text-white font-semibold w-1/2">Address:</Text>
            <Text className="text-white w-2/2">{match.address}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-white font-semibold">Players Needed:</Text>
            <Text className="text-white">{match.players_needed}</Text>
          </View>
        </View>

        {/* Info */}
        <View className="bg-dark-200 rounded-xl p-4 mb-6">
          <Text className="text-white font-semibold mb-2">Info</Text>
          <Text className="text-slate-300 leading-relaxed">
            {match.info || 'No additional information.'}
          </Text>
        </View>

        {/* Creator */}
        <Text className="text-white font-semibold mb-2">Created By</Text>
        <Link href={`../profiles/${match.created_by}`} asChild>
          <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-6">
            <Image
              source={
                match.profiles?.avatar_url
                  ? { uri: match.profiles.avatar_url }
                  : images.defaultProfile
              }
              className="w-12 h-12 rounded-full bg-gray-500"
              resizeMode="cover"
            />
            <View className="ml-3">
              <Text className="text-white font-semibold">
                {match.profiles?.full_name || 'Unknown'}
              </Text>
              <Text className="text-slate-300 text-sm">
                Rating: {match.profiles?.rating ?? 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Join / Withdraw */}
        {!loadingJoinStatus && (
          <TouchableOpacity
            onPress={isJoined ? handleWithdraw : handleJoin}
            disabled={
              joining ||
              withdrawing ||
              (!isJoined && (players?.length ?? 0) >= match.players_needed)
            }
            className={`py-3 rounded-xl mb-6 flex-row justify-center items-center ${isJoined ? 'bg-red-700' : 'bg-green-600'
              }`}
          >
            <Ionicons
              name={isJoined ? 'remove-circle' : 'person-add'}
              size={20}
              color="white"
              className="mr-2"
            />
            <Text className="text-white font-semibold">
              {joining || withdrawing
                ? 'Processing…'
                : isJoined
                  ? 'Withdraw'
                  : 'Join Match'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Player Count */}
        <Text className="text-white text-lg font-semibold mb-4">
          Players Joined: {players?.length || 0}/{match.players_needed}
        </Text>

        {/* Players List */}
        {loadingPlayers ? (
          <ActivityIndicator color="white" />
        ) : players?.length ? (
          players.map((player) => (
            <Link
              key={player.id}
              href={`../profiles/${player.id}`}
              asChild
            >
              <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-3">
                <Image
                  source={
                    player.avatar_url
                      ? { uri: player.avatar_url }
                      : images.defaultProfile
                  }
                  className="w-10 h-10 rounded-full bg-gray-500"
                  resizeMode="cover"
                />
                <View className="ml-3">
                  <Text className="text-white font-semibold">
                    {player.full_name}
                  </Text>
                  <Text className="text-slate-300 text-sm">
                    Rating: {player.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        ) : (
          <Text className="text-slate-400">No one has joined yet.</Text>
        )}

        {/* Delete (creator only) */}
        {profile?.id === match.created_by && (
          <TouchableOpacity
            onPress={confirmDelete}
            disabled={deleting}
            className="bg-red-900 py-3 rounded-xl items-center mb-16"
          >
            <Text className="text-white font-semibold">
              {deleting ? 'Deleting…' : 'Delete Match'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
