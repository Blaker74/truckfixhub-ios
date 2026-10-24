import { Session, User } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type AuthValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    const appStateSubscription = Platform.OS === "web" ? null : AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
    if (Platform.OS !== "web" && AppState.currentState === "active") supabase.auth.startAutoRefresh();

    return () => {
      active = false;
      subscription.unsubscribe();
      appStateSubscription?.remove();
      if (Platform.OS !== "web") supabase.auth.stopAutoRefresh();
    };
  }, []);

  const value = useMemo<AuthValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signOut: async () => { await supabase.auth.signOut(); },
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
