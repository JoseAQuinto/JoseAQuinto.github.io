import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

const editorialFont =
  "'Georgia', 'Times New Roman', serif";

export default function LoginModal() {
  useLockBodyScroll(true);

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("user@demo.com");

  const [password, setPassword] =
    useState("1234");

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!supabase) {
        throw new Error(
          "Supabase no está configurado."
        );
      }

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw new Error(error.message);
      }

      // AuthGate detectará sesión automáticamente

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login error.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay blur */}

      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}

      <div className="relative w-full max-w-md rounded-[32px] border border-[#e5dfd6] bg-white p-8 shadow-xl">

        {/* Back button */}

        <button
          onClick={handleBack}
          className="absolute left-6 top-6 flex items-center gap-2 text-sm text-[#6d655f] hover:text-[#171717]"
        >
          ← Back
        </button>

        <h2
          className="mb-6 text-center text-[1.6rem] text-[#171717]"
          style={{ fontFamily: editorialFont }}
        >
          Login required
        </h2>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="w-full rounded-[18px] border border-[#e4dfd8] px-4 py-3 text-sm outline-none focus:border-[#cfc6ba]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="w-full rounded-[18px] border border-[#e4dfd8] px-4 py-3 text-sm outline-none focus:border-[#cfc6ba]"
          />

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full rounded-full border border-[#cfc5b9] bg-[#f9f7f4] px-4 py-3 text-sm font-medium hover:bg-[#f3eee7] disabled:opacity-60"
          >
            {isLoading
              ? "Logging in..."
              : "Login"}
          </button>

          {errorMessage && (
            <div className="text-center text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="mt-2 text-center text-xs text-[#8f887f]">
            Demo credentials:
            <br />
            user@demo.com / 1234
          </div>

        </div>
      </div>
    </div>
  );
}