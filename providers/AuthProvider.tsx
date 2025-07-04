import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

type AuthData = {
    session: Session | null;
    profile: any;
    loading: boolean;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
    session: null,
    profile: null,
    loading: true,
    refreshProfile: async () => {},
});


export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (!session?.user) return;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        setProfile(data || null);
    };

    useEffect(() => {
        const fetchSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setSession(session);

            if (session) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(data || null);
            }

            setLoading(false);
        };

        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading, profile, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);