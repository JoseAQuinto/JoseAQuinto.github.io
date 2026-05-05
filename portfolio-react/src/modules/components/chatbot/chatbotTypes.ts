export type ChatMessage = {
    id: number;
    sender: "bot" | "user";
    text: string;
    variant?: "error" | "support";
};