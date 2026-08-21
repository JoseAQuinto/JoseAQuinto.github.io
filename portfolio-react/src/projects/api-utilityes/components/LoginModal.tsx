import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  signInDemo,
} from "../services/demoAuth";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

export default function LoginModal() {
  useLockBodyScroll(true);
  const navigate = useNavigate();
  const { t } = useApiUtilitiesLanguage();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Supabase auth is intentionally disabled for the public portfolio.
      // Original implementation kept for reference:
      // await supabase.auth.signInWithPassword({ email, password });
      if (!signInDemo(email, password)) throw new Error(t.loginError);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t.loginError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-slate-950"
            >
              ← {t.back}
            </button>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-mono text-sm font-bold text-cyan-300">
                API
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                  Secure workspace
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">{t.loginRequired}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {t.demoAuthenticationDescription}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-5 sm:p-6">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.emailPlaceholder}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.passwordPlaceholder}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            {errorMessage ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 h-11 w-full rounded-lg bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? t.loggingIn : t.login}
            </button>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center font-mono text-xs text-slate-600">
              <p className="mb-1 font-sans font-semibold text-slate-700">{t.demoCredentialsLabel}</p>
              {DEMO_EMAIL} / {DEMO_PASSWORD}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
