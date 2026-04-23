import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function UserSessionInfo() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!supabase) return;

      const { data } = await supabase.auth.getUser();

      setEmail(data.user?.email ?? null);
    };

    loadUser();
  }, []);

  return (
    <div className="text-sm text-[#6d655f]">

      {email ? (
        <>
          Logged as:
          <strong> {email}</strong>
        </>
      ) : (
        <>Not authenticated</>
      )}

    </div>
  );
}