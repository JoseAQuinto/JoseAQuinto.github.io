import { useEffect, useState } from "react";
import {
  getDemoUserEmail,
  subscribeToDemoSession,
} from "../services/demoAuth";

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    getDemoUserEmail()
  );

  useEffect(() => {
    return subscribeToDemoSession(() => setUserEmail(getDemoUserEmail()));
  }, []);

  return {
    userEmail,
    isAuthenticated: Boolean(userEmail),
    isLoading: false,
  };
}
