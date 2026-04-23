import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "./LoginModal";

type Props = {
  children: ReactNode;
};

export default function AuthGate({
  children,
}: Props) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-[#6d655f]">
          Loading session...
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {!isAuthenticated && (
        <LoginModal />
      )}
    </>
  );
}