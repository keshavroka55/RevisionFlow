import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Brain, Mail, Lock, User } from "lucide-react";
import { useAuthStore, useAuthLoading } from "../store/auth.store";

export default function Signup() {
  const navigate = useNavigate();
  const { register, error, clearError, runWithLoading, loginWithGoogle } = useAuthStore();
  const isRegisterLoading = useAuthLoading("auth.register");
  const isGoogleLoading = useAuthLoading("auth.google");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [oauthError, setOauthError] = useState("");

  const isLoading = isRegisterLoading || isGoogleLoading;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setOauthError("");
    try {
      await runWithLoading("auth.register", async () => {
        await register(name, email, password);
        navigate("/dashboard");
      });
    } catch {
      // error is already set in the store
    }
  };

  const handleGoogleSignup = async () => {
    setOauthError("");
    try {
      await runWithLoading("auth.google", async () => {
        loginWithGoogle();
      });
    } catch (err: any) {
      setOauthError(err?.message || "Unable to start Google signup.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Brain className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Revision Flow</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start your learning journey today</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-border p-8">

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={clearError} className="text-red-400 hover:text-red-600 text-lg leading-none">
                ✕
              </button>
            </div>
          )}

          {oauthError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{oauthError}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="isStudent"
                checked={isStudent}
                onChange={(e) => setIsStudent(e.target.checked)}
                className="mt-1 rounded border-border text-primary focus:ring-primary"
                disabled={isLoading}
              />
              <label htmlFor="isStudent" className="ml-2 text-sm text-foreground">
                I am a student{" "}
                <span className="text-accent">(Get 3-6 months Premium free!)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegisterLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="mt-4 w-full bg-white border-2 border-border text-foreground py-3 rounded-lg hover:bg-background transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? "Connecting to Google..." : "Sign up with Google"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}