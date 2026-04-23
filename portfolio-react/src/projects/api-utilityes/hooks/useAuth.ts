import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export function useAuth() {
  const [userEmail, setUserEmail] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // guardamos referencia segura
    const client = supabase;

    const loadUser = async () => {
      const { data } =
        await client.auth.getUser();

      setUserEmail(
        data.user?.email ?? null
      );

      setIsLoading(false);
    };

    loadUser();

    const { data: listener } =
      client.auth.onAuthStateChange(
        (_event, session) => {
          setUserEmail(
            session?.user?.email ?? null
          );
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    userEmail,
    isAuthenticated: !!userEmail,
    isLoading,
  };
}