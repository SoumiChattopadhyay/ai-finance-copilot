
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/auth";

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isLogin = mode === "login";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setMessageType("");
    setShowPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!isLogin && !acceptedTerms) {
      setMessage("Please accept the Terms & Conditions.");
      setMessageType("error");
      return;
    }

    if (isLogin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? "/login" : "/register";

      const payload = isLogin
        ? {
            email: form.email.trim(),
            password: form.password,
          }
        : {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          };

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        payload
      );

      if (isLogin) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setMessage(
          `Welcome back, ${response.data.user.name}! Login successful.`
        );

        setMessageType("success");

        navigate("/dashboard");
      } else {
        setMessage(
          "Your account has been created successfully. Please sign in."
        );

        setForm((previous) => ({
          ...previous,
          name: "",
          password: "",
        }));

        setAcceptedTerms(false);
        setMode("login");
        setMessageType("success");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <header className="brand">
          <div className="brand-icon">✦</div>
          <span>
            PayGuard <strong>AI</strong>
          </span>
        </header>

        <div className="visual-content">
          <span className="eyebrow">
            YOUR SMART FINANCE COMPANION
          </span>

          <h1>
            Smarter Transactions.
            <br />
            Safer Tomorrow.
          </h1>

          <p>
            Take control of your finances with intelligent
            insights, transaction monitoring and AI-powered
            fraud protection.
          </p>

          <div className="illustration">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="phone">
              <div className="phone-top"></div>
              <div className="phone-shield">✓</div>
              <span className="phone-label">UPI PROTECTED</span>
              <div className="phone-line"></div>
              <div className="phone-line short"></div>

              <div className="phone-status">
                <span>●</span> Secure Transaction
              </div>
            </div>

            <div className="floating-shield">✓</div>
            <div className="floating-orb">✦</div>
          </div>
        </div>

        <div className="feature-strip">
          <div className="feature">
            <span className="feature-icon">◈</span>
            <div>
              <strong>Real-time Protection</strong>
              <small>Detect suspicious activity</small>
            </div>
          </div>

          <div className="feature">
            <span className="feature-icon">✧</span>
            <div>
              <strong>Smart Insights</strong>
              <small>Understand your spending</small>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand">
            <div className="brand-icon">✦</div>
            <span>
              PayGuard <strong>AI</strong>
            </span>
          </div>

          <div className="card-heading">
            <div className="card-icon">✦</div>

            <h2>
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </h2>

            <p>
              {isLogin
                ? "Sign in to continue your finance journey."
                : "Start your journey towards smarter finance."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>

                {isLogin && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setMessage(
                        "Password recovery is not available yet."
                      );
                      setMessageType("error");
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="password-wrapper">
                <input
                  key={mode}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={
                    isLogin ? "current-password" : "new-password"
                  }
                  minLength={isLogin ? undefined : 6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isLogin && (
                <small className="field-hint">
                  Use at least 6 characters.
                </small>
              )}
            </div>

            {!isLogin && (
              <label className="terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                />
                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>
            )}

            {message && (
              <div
                className={`form-message ${messageType}`}
                role="status"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="security-note">
            <span>◈</span>
            Your information is securely processed.
          </div>

          <p className="switch-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                switchMode(isLogin ? "register" : "login")
              }
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <footer className="panel-footer">
          © 2026 PayGuard AI. All rights reserved.
        </footer>
      </section>
    </main>
  );
}

export default AuthPage;