import AuthGate from "./components/AuthGate";
import ApiUtilitiesPage from "./pages/ApiUtilitiesPage";
import { ApiUtilitiesLanguageProvider } from "./translations/ApiUtilitiesLanguageProvider";


export default function AppApiUtilities() {
  return (
    <ApiUtilitiesLanguageProvider>
      <AuthGate>

        <ApiUtilitiesPage />

      </AuthGate>
    </ApiUtilitiesLanguageProvider>
  );
}