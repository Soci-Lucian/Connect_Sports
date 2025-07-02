import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants/images';
import { useInsertMatch } from '@/api/matches';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useInsertTournament } from '@/api/tournaments';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateEvent = () => {
  const [type, setType] = useState<'match' | 'tournament'>('match');

  const [matchForm, setMatchForm] = useState({
    name: '',
    address: '',
    players: '',
    city: '',
    info: '',
  });

  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    teams: '',
    playersPerTeam: '',
    address: '',
    city: '',
    info: '',
  });
  const isMatch = type === 'match';

  const router = useRouter();
  const { session } = useAuth();
  const { mutate: insertMatch, isPending: creatingMatch } = useInsertMatch();
  const { mutate: insertTournament, isPending: creatingTournament } = useInsertTournament();

  const resetFields = () => {
    setMatchForm({
      name: '',
      address: '',
      city: '',
      players: '',
      info: '',
    });

    setTournamentForm({
      name: '',
      type: '',
      startDate: '',
      endDate: '',
      teams: '',
      playersPerTeam: '',
      address: '',
      city: '',
      info: '',
    });
  };

  const validateFields = () => {
    const { name, address, city, players, info } = matchForm;
    if (!name || !address || !city || !players || !info) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return false;
    }

    const playersNum = parseInt(players);
    if (isNaN(playersNum) || playersNum <= 0) {
      Alert.alert('Invalid Players', 'Enter a valid number of players.');
      return false;
    }

    return true;
  };

  const validateTournamentFields = () => {
    const {
      name, type, startDate, endDate,
      teams, playersPerTeam, address,
      city, info,
    } = tournamentForm;

    if (!name || !type || !startDate || !endDate || !teams || !playersPerTeam || !address || !city || !info) {
      Alert.alert('Missing Fields', 'Please fill in all tournament fields.');
      return false;
    }

    const teamsNum = parseInt(teams);
    if (isNaN(teamsNum) || teamsNum <= 0) {
      Alert.alert('Invalid Teams', 'Enter a valid number of teams.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!session?.user) {
      Alert.alert('Error', 'You must be logged in to create a match.');
      return;
    }

    if (isMatch) {
      if (!validateFields()) return;

      const matchData = {
        name: matchForm.name.trim(),
        address: matchForm.address.trim(),
        city: matchForm.city.trim(),
        players_needed: parseInt(matchForm.players),
        info: matchForm.info.trim(),
        created_by: session.user.id,
      };

      insertMatch(matchData, {
        onSuccess: () => {
          resetFields();
          router.push('/'); 
        },
      }
      )

    } else {
      if (!validateTournamentFields()) return;

      const tournamentData = {
        name: tournamentForm.name.trim(),
        type: tournamentForm.type.trim(),
        start_date: tournamentForm.startDate.trim(),
        end_date: tournamentForm.endDate.trim(),
        teams: parseInt(tournamentForm.teams),
        players_per_team: tournamentForm.playersPerTeam.trim(),
        address: tournamentForm.address.trim(),
        city: tournamentForm.city.trim(),
        info: tournamentForm.info.trim(),
        created_by: session.user.id,
      };

      insertTournament(tournamentData, {
        onSuccess: () => {
          resetFields();
          router.push('/'); 
        },
      });
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <Image
        source={images.bg}
        className="absolute inset-0 w-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/40" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >

        <ScrollView
          className="flex-1 z-10"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        >
          {/* Header */}
          <View className="pt-16 pb-8 px-6">
            <Text className="text-3xl font-bold text-white mb-2">Create Event</Text>
            <Text className="text-slate-300 text-base">
              {isMatch ? 'Set up a new football match' : 'Organize a tournament'}
            </Text>
          </View>

          <View className="px-6">
            {/* Toggle Buttons */}
            <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8">
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setType('match')}
                  className="flex-1"
                >
                  {isMatch ? (
                    <LinearGradient
                      colors={['#8B5CF6', '#A855F7']}
                      style={{
                        paddingVertical: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name="football"
                          size={16}
                          color="white"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="font-semibold text-white">
                          Match
                        </Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View className="py-4 rounded-xl items-center justify-center">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="football"
                          size={16}
                          color="#94A3B8"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="font-semibold text-slate-400">
                          Match
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setType('tournament')}
                  className="flex-1"
                >
                  {!isMatch ? (
                    <LinearGradient
                      colors={['#8B5CF6', '#A855F7']}
                      style={{
                        paddingVertical: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name="trophy"
                          size={16}
                          color="white"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="font-semibold text-white">
                          Tournament
                        </Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View className="py-4 rounded-xl items-center justify-center">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="trophy"
                          size={16}
                          color="#94A3B8"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="font-semibold text-slate-400">
                          Tournament
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Container */}
            <View className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-6">
              <View className="space-y-5">
                {isMatch ? (
                  <>
                    <FormField
                      label="Match Name"
                      value={matchForm.name}
                      onChange={(text) =>
                        setMatchForm({ ...matchForm, name: text })
                      }
                      placeholder="Enter match name"
                      icon="football"
                    />
                    <FormField
                      label="Football Field Address"
                      value={matchForm.address}
                      onChange={(text) =>
                        setMatchForm({ ...matchForm, address: text })
                      }
                      placeholder="Enter field location"
                      icon="location"
                    />
                    <FormField
                      label="Players"
                      value={matchForm.players}
                      onChange={(text) =>
                        setMatchForm({ ...matchForm, players: text })
                      }
                      placeholder="Number of players"
                      keyboardType="numeric"
                      icon="people"
                    />
                    <FormField
                      label="City"
                      value={matchForm.city}
                      onChange={(text) =>
                        setMatchForm({ ...matchForm, city: text })
                      }
                      placeholder="Enter city"
                      icon="business"
                    />
                    <FormField
                      label="Additional Info"
                      value={matchForm.info}
                      onChange={(text) =>
                        setMatchForm({ ...matchForm, info: text })
                      }
                      placeholder="Any additional details..."
                      multiline
                      icon="information-circle"
                    />
                  </>
                ) : (
                  <>
                    <FormField
                      label="Tournament Name"
                      value={tournamentForm.name}
                      onChange={(text) =>
                        setTournamentForm({ ...tournamentForm, name: text })
                      }
                      placeholder="Enter tournament name"
                      icon="trophy"
                    />
                    <FormField
                      label="Tournament Type"
                      value={tournamentForm.type}
                      onChange={(text) =>
                        setTournamentForm({ ...tournamentForm, type: text })
                      }
                      placeholder="Knockout / League / Hybrid"
                      icon="git-network"
                    />
                    <View className="flex-row space-x-3">
                      <View className="flex-1">
                        <FormField
                          label="Start Date"
                          value={tournamentForm.startDate}
                          onChange={(text) =>
                            setTournamentForm({ ...tournamentForm, startDate: text })
                          }
                          placeholder="DD-MM-YYYY"
                          icon="calendar"
                        />
                      </View>
                      <View className="flex-1">
                        <FormField
                          label="End Date"
                          value={tournamentForm.endDate}
                          onChange={(text) =>
                            setTournamentForm({ ...tournamentForm, endDate: text })
                          }
                          placeholder="DD-MM-YYYY"
                          icon="calendar"
                        />
                      </View>
                    </View>
                    <View className="flex-row space-x-3">
                      <View className="flex-1">
                        <FormField
                          label="Teams"
                          value={tournamentForm.teams}
                          onChange={(text) =>
                            setTournamentForm({ ...tournamentForm, teams: text })
                          }
                          placeholder="e.g. 8"
                          keyboardType="numeric"
                          icon="people-circle"
                        />
                      </View>
                      <View className="flex-1">
                        <FormField
                          label="Players/Team"
                          value={tournamentForm.playersPerTeam}
                          onChange={(text) =>
                            setTournamentForm({ ...tournamentForm, playersPerTeam: text })
                          }
                          placeholder="e.g. 5+1"
                          icon="person-add"
                        />
                      </View>
                    </View>
                    <FormField
                      label="Football Field Address"
                      value={tournamentForm.address}
                      onChange={(text) =>
                        setTournamentForm({ ...tournamentForm, address: text })
                      }
                      placeholder="Enter field location"
                      icon="location"
                    />
                    <FormField
                      label="City"
                      value={tournamentForm.city}
                      onChange={(text) =>
                        setTournamentForm({ ...tournamentForm, city: text })
                      }
                      placeholder="Enter city"
                      icon="business"
                    />

                    <FormField
                      label="Additional Info"
                      value={tournamentForm.info}
                      onChange={(text) =>
                        setTournamentForm({ ...tournamentForm, info: text })
                      }
                      placeholder="Any additional details..."
                      multiline
                      icon="information-circle"
                    />
                  </>
                )}
              </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity className="mb-6" disabled={isMatch ? creatingMatch : creatingTournament} onPress={handleSubmit}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7', '#7C3AED']}
                style={{
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isMatch
                    ? creatingMatch
                      ? 0.6
                      : 1
                    : creatingTournament
                      ? 0.6
                      : 1,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="add-circle" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-lg">
                    {isMatch
                      ? creatingMatch
                        ? 'Creating Match...'
                        : 'Create Match'
                      : creatingTournament
                        ? 'Creating Tournament...'
                        : 'Create Tournament'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  keyboardType = 'default',
  icon,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <View>
    <Text className="text-white font-medium mb-3 text-base">{label}</Text>
    <View className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
      <View className="flex-row items-center px-4 py-4">
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#94A3B8"
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className={`flex-1 text-white text-base ${multiline ? 'min-h-[80px] text-top' : ''}`}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#64748B"
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  </View>
);

export default CreateEvent;