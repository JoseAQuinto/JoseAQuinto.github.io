import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

const editorialFont = "'Georgia', 'Times New Roman', serif";

export default function LoginModal() {
  useLockBodyScroll(true);

  const navigate = useNavigate();
  const { t } = useApiUtilitiesLanguage();

  const [email, setEmail] = useState("user@demo.com");
  const [password, setPassword] = useState("1234");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!supabase) {
        throw new Error(t.supabaseNotConfigured);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t.loginError;

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

    <div className="relative w-full max-w-md rounded-[32px] border border-[#e5dfd6] bg-white p-8 shadow-xl">
      {/* HEADER */}
      <div className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-2">

        <button
          onClick={handleBack}
          className="
            inline-flex items-center gap-2
            rounded-full
            border border-[#e2ddd4]
            bg-white/80
            px-3 py-1.5
            text-sm font-medium
            text-[#6d655f]
            backdrop-blur
            transition
            duration-200
            hover:border-[#cfc6ba]
            hover:bg-[#f3eee7]
            hover:text-[#171717]
            active:scale-[0.98]
            focus:outline-none
            focus:ring-2
            focus:ring-[#d9d2c7]
            shrink-0
            whitespace-nowrap
          "
        >
          <span className="text-base leading-none">←</span>
          {t.back}
        </button>

        <div className="flex min-w-0 items-center justify-center gap-2">
          <h2
            className="truncate text-center text-[clamp(1.1rem,4vw,1.6rem)] text-[#171717]"
            style={{ fontFamily: editorialFont }}
          >
            {t.loginRequired}
          </h2>

          <div className="group relative shrink-0">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d8d2c8] text-sm font-medium text-[#6d655f] transition hover:bg-[#f3eee7]"
              aria-label={t.loginInfoAriaLabel}
            >
              i
            </button>

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-full
                z-50
                mt-3
                w-72
                -translate-x-1/2
                rounded-xl
                border
                border-[#e5dfd6]
                bg-white/95
                p-4
                text-left
                text-sm
                text-[#3d3d3d]
                shadow-lg
                opacity-0
                backdrop-blur-sm
                transition
                duration-200
                group-hover:opacity-100
                group-focus-within:opacity-100
              "
            >
              <div className="space-y-2">
                <div className="font-medium text-[#171717]">
                  {t.demoAuthenticationTitle}
                </div>
                <p className="leading-relaxed text-[#5f5a55]">
                  {t.demoAuthenticationDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[72px] shrink-0" />
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-[18px] border border-[#e4dfd8] px-4 py-3 text-sm outline-none focus:border-[#cfc6ba]"
        />

        <input
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-[18px] border border-[#e4dfd8] px-4 py-3 text-sm outline-none focus:border-[#cfc6ba]"
        />

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full rounded-full border border-[#cfc5b9] bg-[#f9f7f4] px-4 py-3 text-sm font-medium hover:bg-[#f3eee7] disabled:opacity-60"
        >
          {isLoading ? t.loggingIn : t.login}
        </button>

        {errorMessage && (
          <div className="text-center text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="mt-2 text-center text-xs text-[#8f887f]">
          {t.demoCredentialsLabel}:
          <br />
          user@demo.com / 1234
        </div>
      </div>
    </div>
  </div>
);
}