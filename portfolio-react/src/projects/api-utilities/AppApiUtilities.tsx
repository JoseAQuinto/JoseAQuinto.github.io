import AuthGate from "./components/AuthGate";
import ApiUtilitiesPage from "./pages/ApiUtilitiesPage";

export default function AppApiUtilities() {
  return (
    <AuthGate>
      <ApiUtilitiesPage />
    </AuthGate>
  );
}