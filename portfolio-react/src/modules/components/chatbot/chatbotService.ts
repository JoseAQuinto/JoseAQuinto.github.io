const CHATBOT_API_URL = "https://TU-PROYECTO-VERCEL.vercel.app/api/chat"; // AJUSTAR JOSE

type ChatbotApiResponse = {
    ok: boolean;
    answer?: string;
    error?: string;
};

export async function sendChatbotMessage(message: string): Promise<string> {
    const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    const data = (await response.json()) as ChatbotApiResponse;

    if (!response.ok || !data.ok) {
        throw new Error(data.error || "Error al contactar con el chatbot");
    }

    return data.answer || "";
}