import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const { data } = await axios.post(endpoint, payload);
      login(data); // saves to context + localStorage
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏠 Mira</div>
        <p className="auth-tagline">Your AI Real Estate Assistant</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        <div className="auth-form">
          {mode === "register" && (
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handle}
            />
          )}
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handle}
          />
          <div className="auth-input-wrap">
  <input
    className="auth-input"
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handle}
    onKeyDown={(e) => e.key === "Enter" && submit()}
  />
  <button
    type="button"
    className="eye-btn"
    onClick={() => setShowPassword(!showPassword)}
    tabIndex={-1}
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
