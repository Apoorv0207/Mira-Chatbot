import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import ChatWindow from "./components/ChatWindow";
import SavedPanel from "./components/SavedPanel";
import "./App.css";

export default function App() {
  const { user, token, logout } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  const fetchSaved = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedProperties(data);
    } catch {
      setSavedProperties([]);
    }
  };

  useEffect(() => { fetchSaved(); }, [token]);

  // Show login/register page if not authenticated
  if (!user) return <AuthPage />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">🏠 Mira</div>
        <p className="tagline">Hi, {user.name}!</p>
        <div className="header-actions">
          <button className="saved-btn" onClick={() => setShowSaved(!showSaved)}>
            ❤️ Saved ({savedProperties.length})
          </button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
  <div style={{ display: showSaved ? "none" : "flex", flex: 1, overflow: "hidden" }}>
    <ChatWindow token={token} onSave={fetchSaved} />
  </div>
  {showSaved && (
    <SavedPanel
      saved={savedProperties}
      token={token}
      onRefresh={fetchSaved}
      onClose={() => setShowSaved(false)}
    />
  )}
</main>
    </div>
  );
}
