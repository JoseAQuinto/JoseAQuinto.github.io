import { useAuth } from "../hooks/useAuth";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

export default function UserSessionInfo() {
  const { t } = useApiUtilitiesLanguage();
  const { userEmail: email } = useAuth();

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
