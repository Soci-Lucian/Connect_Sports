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
import { useAuth } from '@/providers/AuthProvider';
import {
  useTournamentById,
  useDeleteTournament,
  useJoinedTournamentStatus,
  useJoinTournament,
  useWithdrawFromTournament,
  useTournamentCaptains,
} from '@/api/tournaments';
import { images } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';

export default function TournamentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuth();
  const router = useRouter();

  const {
    data: tournament,
    isLoading,
    error,
  } = useTournamentById(id!);
  const { mutate: deleteTournament, isPending: deleting } = useDeleteTournament();
  const {data: isCaptain, isPending: loadingStatus,} = useJoinedTournamentStatus(id!);
  const { mutate: joinTournament, isPending: joining } = useJoinTournament();
  const { mutate: withdraw, isPending: withdrawing } = useWithdrawFromTournament();
  const {
    data: captains,
    isLoading: loadingCaptains,
    error: captainsError,
  } = useTournamentCaptains(id!);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  if (error || !tournament) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-4">
        <Text className="text-red-500 text-lg">Failed to load tournament.</Text>
      </View>
    );
  }

  const handleJoin = () => joinTournament(id!);
  const handleWithdraw = () => withdraw(id!);
  const handleDelete = () => {
    deleteTournament(id!, {
      onSuccess: () => router.replace('/'),
    });
  };


  const confirmDelete = () => {
    Alert.alert(
      'Delete Tournament?',
      'Are you sure you want to delete this tournament? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={images.tournamentBanner}
        className="w-full h-48"
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-10 left-4 bg-black/50 p-2 rounded-full"
        >
          <Text className="text-white text-sm"> Back  </Text>
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Title */}
        <Text className="text-white text-3xl font-bold mb-4">
          {tournament.name}
        </Text>

        {/* Facts */}
        <View className="bg-dark-200 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-white font-semibold">City:</Text>
            <Text className="text-white">{tournament.city}</Text>
          </View>
          <View className="flex-row justify-between mb-2 flex-wrap">
            <Text className="text-white font-semibold w-1/2">Address:</Text>
            <Text className="text-white w-2/2">{tournament.address}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-white font-semibold">Type:</Text>
            <Text className="text-white">{tournament.type}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-white font-semibold">Dates:</Text>
            <Text className="text-white">
              {tournament.start_date} → {tournament.end_date}
            </Text>
          </View>
        </View>

        {/* Teams & Players/Team */}
        <View className="bg-dark-200 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-white font-semibold">Teams:</Text>
            <Text className="text-white">{tournament.teams}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-white font-semibold">Players/Team:</Text>
            <Text className="text-white">
              {tournament.players_per_team}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View className="bg-dark-200 rounded-xl p-4 mb-6">
          <Text className="text-white font-semibold mb-2">Info</Text>
          <Text className="text-slate-300 leading-relaxed">
            {tournament.info || 'No additional information.'}
          </Text>
        </View>

        {/* Creator */}
        <Text className="text-white font-semibold mb-2">Created By</Text>
        <Link href={`../profiles/${tournament.created_by}`} asChild>
          <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-6">
            <Image
              source={
                tournament.profiles?.avatar_url
                  ? { uri: tournament.profiles.avatar_url }
                  : images.defaultProfile
              }
              className="w-12 h-12 rounded-full bg-gray-500"
              resizeMode="cover"
            />
            <View className="ml-3">
              <Text className="text-white font-semibold">
                {tournament.profiles?.full_name || 'Unknown'}
              </Text>
              <Text className="text-slate-300 text-sm">
                Rating: {tournament.profiles?.rating ?? 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Join / Resign */}
        {!loadingStatus && (
          <TouchableOpacity
            onPress={isCaptain ? handleWithdraw : handleJoin}
            disabled={joining || withdrawing || (!isCaptain && (captains?.length ?? 0) >= tournament.teams)}
            className={`py-3 rounded-xl items-center mb-6 flex-row justify-center ${isCaptain ? 'bg-red-700' : 'bg-green-600'
              }`}
          >
            <Ionicons
              name={isCaptain ? 'remove-circle' : 'person-add'}
              size={20}
              color="white"
              className="mr-2"
            />
            <Text className="text-white font-semibold">
              {joining || withdrawing
                ? 'Processing…'
                : isCaptain
                  ? 'Resign Captaincy'
                  : 'Join as Captain'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Captain Count */}
        <Text className="text-white text-lg font-semibold mb-4">
          Captains Joined: {captains?.length ?? 0}/{tournament.teams}
        </Text>

        {/* Captains List */}
        {loadingCaptains ? (
          <ActivityIndicator color="white" />
        ) : captainsError ? (
          <Text className="text-red-500 mb-2">Failed to load captains.</Text>
        ) : captains?.length ? (
          captains.map((cap) => (
            <Link key={cap.id} href={`../profiles/${cap.id}`} asChild>
              <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-3">
                <Image
                  source={
                    cap.avatar_url
                      ? { uri: cap.avatar_url }
                      : images.defaultProfile
                  }
                  className="w-10 h-10 rounded-full bg-gray-500"
                  resizeMode="cover"
                />
                <View className="ml-3">
                  <Text className="text-white font-semibold">
                    {cap.full_name}
                  </Text>
                  <Text className="text-slate-300 text-sm">
                    Rating: {cap.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        ) : (
          <Text className="text-slate-400">No captains yet.</Text>
        )}

        {/* Delete (creator only) */}
        {profile?.id === tournament.created_by && (
          <TouchableOpacity
            onPress={confirmDelete}
            disabled={deleting}
            className="bg-red-900 py-3 rounded-xl items-center mb-16"
          >
            <Text className="text-white font-semibold">
              {deleting ? 'Deleting…' : 'Delete Tournament'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
