import AppRoutes from "./app/AppRoutes";
import { ChatbotWidget } from "./modules/components/chatbot/ChatbotWidget";

function App() {
  return (
    <>
      <AppRoutes />
      <ChatbotWidget />
    </>
  );
}

export default App;