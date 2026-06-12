export default function MessageBubble({ message, isTyping }) {
  const isBot = message.from === "bot";
  return (
    <div className={`bubble-wrap ${isBot ? "bot" : "user"}`}>
      {isBot && <span className="avatar">🏠</span>}
      <div className={`bubble ${isBot ? "bubble-bot" : "bubble-user"}`}>
        {isTyping ? <span className="typing">●●●</span> : message.text}
      </div>
    </div>
  );
}
