import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';


type NewMatch = {
  name: string;
  address: string;
  city: string;
  players_needed: number;
  info: string;
  created_by: string;
};

export const useMatchesList = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          name,
          city,
          players_needed,
          match_players(count)
        `);

      if (error) throw error;

      return data.map((match: any) => ({
        ...match,
        joined_count: match.match_players?.[0]?.count ?? 0,
      }));
    },
  });
};


export const useMatchById = (id: string) => {
  return useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*, profiles:created_by (id, full_name, avatar_url, rating)')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};


export const useInsertMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: NewMatch) {
      const { error } = await supabase.from('matches').insert(data);

      if (error) {
        throw error;
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['matches'] });
      await queryClient.invalidateQueries({ queryKey: ['saved_matches'] });
    },
    onError(error) {
      console.error('Insert match error:', error);
    },
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('matches').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['matches'] });
      await queryClient.invalidateQueries({ queryKey: ['saved_matches'] });
    },
    onError: (error) => {
      console.error('Delete failed:', error);
    },
  });
};

export const useJoinedMatchStatus = (matchId: string) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['match_player_status', matchId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_players')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // "no rows" error
      return !!data;
    },
    enabled: !!matchId && !!userId,
  });
};

export const useJoinMatch = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase.from('match_players').insert({
        match_id: matchId,
        user_id: session?.user.id,
      });
      if (error) throw error;
    },
    onSuccess: (_, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match_player_status', matchId, session?.user.id] });
      queryClient.invalidateQueries({ queryKey: ['match_players', matchId] });
      queryClient.invalidateQueries({ queryKey: ['saved_matches'] });
    },
  });
};

export const useWithdrawFromMatch = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from('match_players')
        .delete()
        .eq('match_id', matchId)
        .eq('user_id', session?.user.id);
      if (error) throw error;
    },
    onSuccess: (_, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match_player_status', matchId, session?.user.id] });
      queryClient.invalidateQueries({ queryKey: ['match_players', matchId] });
      queryClient.invalidateQueries({ queryKey: ['saved_matches'] });
    },
  });
};

export const useMatchPlayers = (matchId: string) => {
  return useQuery({
    queryKey: ['match_players', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_players')
        .select('profiles(id, full_name, rating, avatar_url)')
        .eq('match_id', matchId);

      if (error) throw error;
      return data.map((entry: any) => entry.profiles);
    },
    enabled: !!matchId,
  });
};

export type SavedMatch = {
  id: string;
  name: string;
  city: string;
  players_needed: number;
  joined_count: number;
};

export const useSavedMatches = () => {
  const { session } = useAuth();

  return useQuery<SavedMatch[]>({
    queryKey: ['saved_matches', session?.user.id],
    queryFn: async () => {
      const userId = session?.user.id;
      if (!userId) return [];

      const { data: joins, error: joinErr } = await supabase
        .from('match_players')
        .select('match_id')
        .eq('user_id', userId);
      if (joinErr) throw joinErr;
      const joinedIds = joins?.map((r) => r.match_id) || [];

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          name,
          city,
          players_needed,
          match_players(count)
        `)
        .or(
          joinedIds.length > 0
            ? `created_by.eq.${userId},id.in.(${joinedIds.join(',')})`
            : `created_by.eq.${userId}`
        );
      if (error) throw error;

      return (data || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        city: m.city,
        players_needed: m.players_needed,
        joined_count: m.match_players?.[0]?.count ?? 0,
      }));
    },
    enabled: !!session?.user.id,
  });
};