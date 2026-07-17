import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

export default function UserSessionInfo() {
  const { t } = useApiUtilitiesLanguage();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    };

    void loadUser();
  }, []);

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <span className={`h-2 w-2 shrink-0 rounded-full ${email ? "bg-emerald-500" : "bg-slate-400"}`} />
      <span className="truncate">
        {email ? (
          <>{t.loggedAs} <strong className="text-slate-800">{email}</strong></>
        ) : (
          t.notAuthenticated
        )}
      </span>
    </div>
  );
}
