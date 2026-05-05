import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ChatMessage } from "./chatbotTypes";
import { sendChatbotMessage } from "./chatbotService";
import "./ChatbotWidget.css";

type DockTarget = {
    top: number;
    left: number;
};

const INITIAL_MESSAGE =
    "Hola, soy el asistente del portfolio de Jose. Puedes preguntarme sobre sus proyectos, experiencia, tecnologías o formas de contacto.";

const ERROR_MESSAGE =
    "Ahora mismo no he podido generar una respuesta. Puedes intentarlo de nuevo en unos segundos.";

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDocked, setIsDocked] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isBotThinking, setIsBotThinking] = useState(false);
    const [dockTarget, setDockTarget] = useState<DockTarget | null>(null);
    const [inputValue, setInputValue] = useState("");

    const anchorRef = useRef<HTMLSpanElement | null>(null);
    const windowRef = useRef<HTMLDivElement | null>(null);
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const animationTimeoutRef = useRef<number | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: "bot",
            text: INITIAL_MESSAGE,
        },
    ]);

    useEffect(() => {
        if (!bodyRef.current) return;

        bodyRef.current.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isBotThinking]);

    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
                animationTimeoutRef.current = null;
            }
        };
    }, []);

    const getAnchorCenter = () => {
        if (!anchorRef.current) return null;

        const rect = anchorRef.current.getBoundingClientRect();

        return {
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
        };
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const cleanMessage = inputValue.trim();

        if (!cleanMessage || isBotThinking) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: "user",
            text: cleanMessage,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputValue("");
        setIsBotThinking(true);

        try {
            const answer = await sendChatbotMessage(cleanMessage);

            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text: answer,
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error enviando mensaje al chatbot:", error);

            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text: ERROR_MESSAGE,
                variant: "error",
            };

            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsBotThinking(false);
        }
    };

    const handleReset = () => {
        setIsBotThinking(false);
        setInputValue("");

        setMessages([
            {
                id: Date.now(),
                sender: "bot",
                text: INITIAL_MESSAGE,
            },
        ]);
    };

    const openChatbot = () => {
        const target = getAnchorCenter();
        setDockTarget(target);

        setIsAnimating(true);
        setIsOpen(true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsDocked(false);

                if (animationTimeoutRef.current) {
                    clearTimeout(animationTimeoutRef.current);
                }

                animationTimeoutRef.current = window.setTimeout(() => {
                    setIsAnimating(false);
                }, 420);
            });
        });
    };

    const dockChatbot = () => {
        const target = getAnchorCenter();
        setDockTarget(target);

        setIsAnimating(true);

        requestAnimationFrame(() => {
            setIsDocked(true);
        });

        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        animationTimeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
            setIsAnimating(false);
        }, 420);
    };

    const getDockTransform = () => {
        if (!dockTarget || !windowRef.current) return undefined;

        const rect = windowRef.current.getBoundingClientRect();

        const chatbotCenterX = rect.left + rect.width / 2;
        const chatbotCenterY = rect.top + rect.height / 2;

        const deltaX = dockTarget.left - chatbotCenterX;
        const deltaY = dockTarget.top - chatbotCenterY;

        return `translate(${deltaX}px, ${deltaY}px) scale(0.13)`;
    };

    const dockedStyle =
        isDocked && dockTarget
            ? {
                  transform: getDockTransform(),
                  opacity: 0,
                  pointerEvents: "none" as const,
                  borderRadius: "8px",
              }
            : undefined;

    const windowElement = isOpen ? (
        <div className="chatbot">
            <div
                ref={windowRef}
                className={`chatbot__window ${
                    isDocked
                        ? "chatbot__window--docking"
                        : "chatbot__window--opening"
                } ${isAnimating ? "chatbot__window--animating" : ""}`}
                style={dockedStyle}
            >
                <div className="chatbot__header">
                    <div className="chatbot__header-left">
                        <span className="chatbot__header-icon" aria-hidden="true">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3v2" />
                                <path d="M7 8h10a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Z" />
                                <path d="M8 13h.01" />
                                <path d="M16 13h.01" />
                                <path d="M9 16h6" />
                                <path d="M12 5a2 2 0 0 0-2 2v1h4V7a2 2 0 0 0-2-2Z" />
                            </svg>
                        </span>

                        <div>
                            <p className="chatbot__title">Asistente virtual</p>
                            <p className="chatbot__subtitle">
                                Portfolio de Jose
                            </p>
                        </div>
                    </div>

                    <div className="chatbot__header-actions">
                        <button
                            type="button"
                            className="chatbot__header-button"
                            onClick={handleReset}
                            aria-label="Reiniciar conversación"
                            title="Reiniciar conversación"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 12a9 9 0 1 0 3-6.7" />
                                <path d="M3 4v6h6" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="chatbot__header-button"
                            onClick={dockChatbot}
                            aria-label="Minimizar chatbot"
                            title="Minimizar chatbot"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div ref={bodyRef} className="chatbot__body">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={[
                                "chatbot__message",
                                message.sender === "bot"
                                    ? "chatbot__message--bot"
                                    : "chatbot__message--user",
                                message.variant === "support"
                                    ? "chatbot__message--support"
                                    : "",
                                message.variant === "error"
                                    ? "chatbot__message--error"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {message.text}
                        </div>
                    ))}

                    {isBotThinking && (
                        <div className="chatbot__message chatbot__message--bot chatbot__message--typing">
                            <span
                                className="chatbot__typing-dots"
                                aria-label="Generando respuesta"
                            >
                                <span />
                                <span />
                                <span />
                            </span>
                        </div>
                    )}
                </div>

                <form className="chatbot__form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="chatbot__input"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        placeholder="Escribe tu pregunta..."
                        maxLength={1000}
                        disabled={isBotThinking}
                    />

                    <button
                        type="submit"
                        className="chatbot__send-button"
                        disabled={isBotThinking || !inputValue.trim()}
                    >
                        Enviar
                    </button>
                </form>

                <div className="chatbot__reset-area">
                    <button
                        type="button"
                        className="chatbot__reset-link"
                        onClick={handleReset}
                    >
                        ↺ Reiniciar conversación
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            <span ref={anchorRef} className="chatbot-inline-anchor">
                {isDocked && !isAnimating && (
                    <button
                        type="button"
                        className="chatbot-mini-launcher"
                        onClick={openChatbot}
                        aria-label="Abrir asistente virtual"
                        title="Abrir asistente virtual"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 3v2" />
                            <path d="M7 8h10a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Z" />
                            <path d="M8 13h.01" />
                            <path d="M16 13h.01" />
                            <path d="M9 16h6" />
                            <path d="M12 5a2 2 0 0 0-2 2v1h4V7a2 2 0 0 0-2-2Z" />
                        </svg>
                    </button>
                )}
            </span>

            {windowElement && createPortal(windowElement, document.body)}
        </>
    );
}