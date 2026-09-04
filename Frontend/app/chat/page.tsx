"use client";

import { useEffect, useRef, useState } from "react";
import {
  createConversation,
  getConversations,
  getConversationMessages,
  sendMessage,
} from "../../services/tripService";

type Message = {
  id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

type Conversation = {
  id: number;
  user_id: number;
  created_at: string;
  title?: string;
};

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;

    elements.push(
      <ul key={`list-${elements.length}`} className="markdown-list">
        {listItems.map((item, index) => (
          <li key={index}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );

    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList();

      elements.push(
        <h2 key={index} className="markdown-h2">
          {renderInlineMarkdown(trimmed.substring(2))}
        </h2>
      );

      return;
    }

    if (
      trimmed.startsWith("## ") ||
      trimmed.startsWith("### ") ||
      trimmed.startsWith("#### ")
    ) {
      flushList();

      const heading = trimmed.replace(/^#{2,4}\s+/, "");

      elements.push(
        <h3 key={index} className="markdown-h3">
          {renderInlineMarkdown(heading)}
        </h3>
      );

      return;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.substring(2));
      return;
    }

    flushList();

    elements.push(
      <p key={index} className="markdown-paragraph">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();

  return elements;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (
      part.startsWith("**") &&
      part.endsWith("**")
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

export default function ChatPage() {
  const [conversationId, setConversationId] =
    useState<number | null>(null);

  const [conversationTitle, setConversationTitle] =
    useState("New conversation");

  function createConversationTitle(content: string) {
    const title = content.replace(/\s+/g, " ").trim();

    if (!title) {
      return "New conversation";
    }

    if (title.length <= 38) {
      return title;
    }

    return `${title.substring(0, 38)}...`;
  }

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] =
    useState(false);

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Load conversations when page opens
   */
  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();

        const conversationsWithTitles = await Promise.all(
          data.map(async (conversation) => {
            try {
              const messages =
                await getConversationMessages(conversation.id);

              const firstUserMessage = messages.find(
                (message: Message) =>
                  message.role === "user"
              );

              return {
                ...conversation,
                title: firstUserMessage
                  ? createConversationTitle(
                      firstUserMessage.content
                    )
                  : "New conversation",
              };
            } catch (error) {
              console.error(
                `Failed to load messages for conversation ${conversation.id}:`,
                error
              );

              return {
                ...conversation,
                title: "New conversation",
              };
            }
          })
        );

        setConversations(conversationsWithTitles);

        /*
         * If conversations already exist,
         * open the newest one.
         */
        if (data.length > 0) {
          await loadConversation(data[0].id);
        } else {
          await handleNewConversation();
        }
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );
      }
    }

    loadConversations();
  }, []);

  /*
   * Auto scroll
   */
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /*
   * Load one conversation
   */
  async function loadConversation(id: number) {
    setConversationId(id);
    setLoadingHistory(true);

    try {
      const data = await getConversationMessages(id);

      const title =
        data.length > 0
          ? createConversationTitle(
                data.find(
                    (message: Message) =>
                        message.role === "user"
                )?.content || ""
            )
          : "New conversation";

      setConversationTitle(title);

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                title,
              }
            : conversation
        )
      );

      setMessages(data);
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );
    } finally {
      setLoadingHistory(false);
    }
  }

  /*
   * Create new conversation
   */
  async function handleNewConversation() {
    try {
      const data = await createConversation();

      const newConversation: Conversation = {
        id: data.conversation_id,
        user_id: 0,
        created_at: new Date().toISOString(),
        title: "New conversation",
      };

      setConversations((prev) => [
        newConversation,
        ...prev,
      ]);

      setConversationId(data.conversation_id);
      setMessages([]);
      setConversationTitle("New conversation");
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );
    }
  }

  /*
   * Send message
   */
  async function handleSend() {
    if (
      !input.trim() ||
      conversationId === null ||
      loading
    ) {
      return;
    }

    const userMessage = input.trim();

    if (!userMessage) {
        return;
    }

    if (messages.length === 0) {
        const title = createConversationTitle(userMessage);

        setConversationTitle(title);

        setConversations((prev) =>
            prev.map((conversation) =>
            conversation.id === conversationId
              ? {
                    ...conversation,
                    title,
                }
              : conversation
            )
          );
        }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(
        conversationId,
        userMessage
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message.content,
        },
      ]);
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="chat-page">
      <div className="chat-shell">

        {/* Header */}
        <header className="chat-header">
          <div className="brand">
            <div className="brand-mark">K</div>

            <div>
              <div className="brand-name">
                KelanaAI
              </div>

              <div className="brand-subtitle">
                {conversationTitle}
              </div>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>
        </header>

        {/* Main content */}
        <div className="chat-layout">

          {/* Sidebar */}
          <aside className="conversation-sidebar">

            <div className="sidebar-header">
              <div className="sidebar-title">
                Conversations
              </div>

              <button
                className="new-chat-button"
                onClick={handleNewConversation}
              >
                +
              </button>
            </div>

            <button
              className="new-conversation"
              onClick={handleNewConversation}
            >
              <span>＋</span>
              New conversation
            </button>

            <div className="conversation-list">
              {conversations.map(
                (conversation) => (
                  <button
                    key={conversation.id}
                    className={`conversation-item ${
                      conversation.id ===
                      conversationId
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      loadConversation(
                        conversation.id
                      )
                    }
                  >
                    <span className="conversation-icon">
                      ◇
                    </span>

                    <span className="conversation-info">
                      <span className="conversation-name">
                        {conversation.title || "New conversation"}
                      </span>

                      <span className="conversation-date">
                        {new Date(
                          conversation.created_at
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </span>
                  </button>
                )
              )}
            </div>
          </aside>

          {/* Chat */}
          <section className="chat-content">

            {loadingHistory ? (
              <div className="history-loading">
                Loading conversation...
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ✦
                </div>

                <p className="eyebrow">
                  TRAVEL CONCIERGE
                </p>

                <h1>
                  Where will you
                  <br />
                  go next?
                </h1>

                <p className="empty-description">
                  Tell KelanaAI where you want to
                  go, and let&apos;s craft a journey
                  worth remembering.
                </p>

                <div className="suggestions">
                  <button
                    onClick={() =>
                      setInput(
                        "Plan a 5-day trip to Japan for my family."
                      )
                    }
                  >
                    🇯🇵 Plan a Japan getaway
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "What are the best places to visit in Tokyo?"
                      )
                    }
                  >
                    🗾 Explore Tokyo
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "Help me plan a romantic trip to Kyoto."
                      )
                    }
                  >
                    🍵 Discover Kyoto
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="messages"
                ref={messagesContainerRef}
              >
                {messages.map(
                  (message, index) => (
                    <div
                      key={
                        message.id ??
                        `${conversationId}-${index}`
                      }
                      className={`message-row ${
                        message.role === "user"
                          ? "message-user"
                          : "message-assistant"
                      }`}
                    >
                      {message.role ===
                        "assistant" && (
                        <div className="avatar">
                          K
                        </div>
                      )}

                      <div className="message-content">
                        <div className="message-meta">
                          <span className="message-label">
                            {message.role === "user"
                              ? "You"
                              : "KelanaAI"}
                          </span>

                          {message.created_at && (
                            <span className="message-time">
                              {new Date(
                                message.created_at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>

                        <div className="message-bubble">
                          {message.role ===
                          "assistant"
                            ? renderMarkdown(
                                message.content
                              )
                            : message.content}
                        </div>
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="message-row message-assistant">
                    <div className="avatar">
                      K
                    </div>

                    <div className="message-content">
                      <div className="message-label">
                        KelanaAI
                      </div>

                      <div className="message-bubble typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                
              </div>
            )}

            {/* Composer */}
            <div className="composer-wrapper">
              <div className="composer">
                <input
                  type="text"
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Ask KelanaAI about your next journey..."
                  disabled={
                    conversationId === null ||
                    loading ||
                    loadingHistory
                  }
                />

                <button
                  className="send-button"
                  onClick={handleSend}
                  disabled={
                    conversationId === null ||
                    loading ||
                    loadingHistory ||
                    !input.trim()
                  }
                  aria-label="Send message"
                >
                  ↑
                </button>
              </div>

              <p className="composer-hint">
                KelanaAI can help you plan
                destinations, itineraries,
                transportation and more.
              </p>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}