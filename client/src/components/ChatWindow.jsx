import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import PropertyCard from "./PropertyCard";
import Toast from "./Toast";
import SkeletonCard from "./SkeletonCard";

const SUGGESTIONS = [
  "3 BHK in New York under 80 lakhs",
  "2 bedroom flat in Miami with gym",
  "Apartments in Florida below 1 crore",
  "4 BHK with pool in New York",
];

const INITIAL_MESSAGE = {
  from: "bot",
  text: "Hi! I'm Mira 🏠 Tell me what kind of property you're looking for — location, budget, bedrooms — and I'll find the best matches for you!",
};

export default function ChatWindow({ token, onSave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const messagesRef = useRef(null);
  const prevLengthRef = useRef(0);

  const authHeader = { Authorization: `Bearer ${token}` };

  // Load chat history on mount
  // Load chat history on mount ONCE only
useEffect(() => {
  let cancelled = false;
  const loadHistory = async () => {
    try {
      const { data } = await axios.get("/api/history", { headers: authHeader });
      if (cancelled) return;
      if (data.length > 0) {
        setMessages(data);
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    } catch {
      if (!cancelled) setMessages([INITIAL_MESSAGE]);
    } finally {
      if (!cancelled) setHistoryLoading(false);
    }
  };
  loadHistory();
  return () => { cancelled = true; }; // cleanup prevents state update if unmounted
}, []); // ← empty array, runs once only

  // Scroll to latest message
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      const msgEls = messagesRef.current?.querySelectorAll(".bubble-wrap, .property-list");
      if (msgEls?.length) {
        msgEls[msgEls.length - 2]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveCallback = () => {
    onSave();
    showToast("❤️ Property saved!");
  };

  const saveToHistory = async (newMessages) => {
  try {
    const toSave = newMessages.map(({ from, text, type, properties }) => ({
      from,
      text: text || "",
      type: type || "text",
      properties: properties || [],
    }));

    if (toSave.length === 0) return;

    await axios.post(
      "/api/history",
      { messages: toSave },
      { headers: authHeader }
    );
  } catch {
    // Non-critical
  }
};

  const clearChat = async () => {
    try {
      await axios.delete("/api/history", { headers: authHeader });
    } catch {
      // Still clear UI even if API fails
    }
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    showToast("🗑 Chat cleared");
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg = { from: "user", text: userText, type: "text", properties: [] };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/chat",
        { message: userText },
        { headers: authHeader }
      );

      const count = data.properties.length;
      const countBadge = count > 0 ? ` Showing ${count} match${count !== 1 ? "es" : ""} 🏘️` : "";
      const botMsg = { from: "bot", text: data.reply + countBadge, type: "text", properties: [] };
      const propMsg = count > 0
        ? { from: "bot", text: "", type: "properties", properties: data.properties }
        : null;

      const newMessages = propMsg ? [botMsg, propMsg] : [botMsg];
      setMessages((prev) => [...prev, ...newMessages]);

      // Save user message + bot response to history
      await saveToHistory([userMsg, ...newMessages]);
    } catch {
      const errMsg = { from: "bot", text: "Oops! Something went wrong. Please try again.", type: "text", properties: [] };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const userMessageCount = messages.filter((m) => m.from === "user").length;

  if (historyLoading) {
    return (
      <div className="chat-window">
        <div className="property-list" style={{ padding: "16px" }}>
          <div className="results-header skeleton-header">⏳ Loading your chat history...</div>
          <SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* Suggestion chips OR toolbar */}
      {userMessageCount === 0 ? (
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>
      ) : (
        <div className="chat-toolbar">
          <span className="toolbar-label">💬 {userMessageCount} message{userMessageCount !== 1 ? "s" : ""} sent</span>
          <button className="clear-btn" onClick={clearChat}>🗑 Clear Chat</button>
        </div>
      )}

      <div className="messages" ref={messagesRef}>
        {messages.map((msg, i) =>
  msg.type === "properties" && msg.properties?.length > 0 ? (
    <div key={i} className="property-list">
      <div className="results-header">
        🏠 {msg.properties.length} Propert{msg.properties.length !== 1 ? "ies" : "y"} Found
      </div>
      {msg.properties.map((p, j) => (
        <PropertyCard key={p.id ?? j} property={p} token={token} onSave={handleSaveCallback} />
      ))}
    </div>
  ) : msg.type !== "properties" ? (
    <MessageBubble key={i} message={msg} />
  ) : null
)}
        {loading && (
          <div className="property-list">
            <div className="results-header skeleton-header">🔍 Searching...</div>
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder="e.g. 3 BHK in New York under 80 lakhs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}
