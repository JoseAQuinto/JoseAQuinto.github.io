import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const loadUser = async () => {
      const { data } = await client.auth.getUser();
      setUserEmail(data.user?.email ?? null);
      setIsLoading(false);
    };

    void loadUser();
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setIsLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return {
    userEmail,
    isAuthenticated: Boolean(userEmail),
    isLoading,
  };
}
