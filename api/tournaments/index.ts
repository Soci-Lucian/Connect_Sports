import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

type NewTournament = {
    name: string;
    type: string;
    start_date: string;
    end_date: string;
    teams: number;
    players_per_team: string;
    address: string;
    city: string;
    info: string;
    created_by: string;
};


export const useTournamentList = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          id,
          name,
          city,
          start_date,
          end_date,
          teams,
          tournament_captains(count)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data.map((t: any) => ({
        ...t,
        joined_count: t.tournament_captains?.[0]?.count ?? 0,
      }));
    },
  });
};


export const useTournamentById = (id: string) => {
    return useQuery({
        queryKey: ['tournament', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*, profiles(full_name, avatar_url, rating)')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!id,
    });
};

export const useInsertTournament = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: NewTournament) {
            const { error } = await supabase.from('tournaments').insert(data);
            if (error) throw error;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            await queryClient.invalidateQueries({ queryKey: ['saved_tournaments'] });
        },
        onError(error) {
            console.error('Insert tournament error:', error);
        },
    });
};

export const useDeleteTournament = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('tournaments').delete().eq('id', id);
            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            await queryClient.invalidateQueries({ queryKey: ['saved_tournaments'] });
        },
        onError: (error) => {
            console.error('Delete tournament failed:', error);
        },
    });
};


export const useJoinedTournamentStatus = (tournamentId: string) => {
    const { session } = useAuth();
    const userId = session?.user.id;

    return useQuery({
        queryKey: ['tournament_captain_status', tournamentId, userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tournament_captains')
                .select('id')
                .eq('tournament_id', tournamentId)
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return !!data;
        },
        enabled: !!tournamentId && !!userId,
    });
};


export const useJoinTournament = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();

    return useMutation({
        mutationFn: async (tournamentId: string) => {
            const { error } = await supabase.from('tournament_captains').insert({
                tournament_id: tournamentId,
                user_id: session?.user.id,
            });
            if (error) throw error;
        },
        onSuccess: (_, tournamentId) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            queryClient.invalidateQueries({ queryKey: ['tournament_captain_status', tournamentId, session?.user.id], });
            queryClient.invalidateQueries({ queryKey: ['tournament_captains', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['saved_tournaments'] });
        },
    });
};


export const useWithdrawFromTournament = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();

    return useMutation({
        mutationFn: async (tournamentId: string) => {
            const { error } = await supabase
                .from('tournament_captains')
                .delete()
                .eq('tournament_id', tournamentId)
                .eq('user_id', session?.user.id);
            if (error) throw error;
        },
        onSuccess: (_, tournamentId) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            queryClient.invalidateQueries({ queryKey: ['tournament_captain_status', tournamentId, session?.user.id], });
            queryClient.invalidateQueries({ queryKey: ['tournament_captains', tournamentId] });
            queryClient.invalidateQueries({ queryKey: ['saved_tournaments'] });
        },
    });
};

export const useTournamentCaptains = (tournamentId: string) => {
    return useQuery({
        queryKey: ['tournament_captains', tournamentId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tournament_captains')
                .select('profiles(id, full_name, rating, avatar_url)')
                .eq('tournament_id', tournamentId);

            if (error) throw error;
            return data.map((entry: any) => entry.profiles);
        },
        enabled: !!tournamentId,
    });
};

export type SavedTournament = {
  id: string;
  name: string;
  city: string;
  start_date: string;
  end_date: string;
  teams: number;
  joined_count: number;
};

export const useSavedTournaments = () => {
  const { session } = useAuth();

  return useQuery<SavedTournament[]>({
    queryKey: ['saved_tournaments', session?.user.id],
    queryFn: async () => {
      const userId = session?.user.id;
      if (!userId) return [];

      const { data: caps, error: capErr } = await supabase
        .from('tournament_captains')
        .select('tournament_id')
        .eq('user_id', userId);
      if (capErr) throw capErr;
      const joinedIds = caps?.map((r) => r.tournament_id) || [];

      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          id,
          name,
          city,
          start_date,
          end_date,
          teams,
          tournament_captains(count)
        `)
        .or(
          joinedIds.length > 0
            ? `created_by.eq.${userId},id.in.(${joinedIds.join(',')})`
            : `created_by.eq.${userId}`
        );
      if (error) throw error;

      return (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        city: t.city,
        start_date: t.start_date,
        end_date: t.end_date,
        teams: t.teams,
        joined_count: t.tournament_captains?.[0]?.count ?? 0,
      }));
    },
    enabled: !!session?.user.id,
  });
};