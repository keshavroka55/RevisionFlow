import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore, useAuthLoading } from "../store/auth.store";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");  // client-side validation
  const [success, setSuccess] = useState(false);

  // Token comes from the URL: /reset-password?token=abc123
  // Your backend email sends this link, frontend reads it here
  const token = searchParams.get("token");

  const { runWithLoading, resetPassword } = useAuthStore();
  const loading = useAuthLoading("auth.resetPassword");

  // If no token in URL — this is an invalid link
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-xl shadow-lg border border-border p-8">
          <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-primary hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation before hitting the server
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await runWithLoading("auth.resetPassword", async () => {
        // resetPassword(token, newPassword) → POST /api/auth/reset-password
        await resetPassword(token, password);
        setSuccess(true);
        // Redirect to login after 2 seconds so user reads the success message
        setTimeout(() => navigate("/login"), 2000);
      });
    } catch (err: any) {
      // Backend throws "Invalid or expired reset token" → shows here
      setLocalError(err.response?.data?.message || "Reset failed. Please try again.");
    }
  };

  // Success state — show confirmation before redirect
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-xl shadow-lg border border-border p-8">
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">Password reset successful!</p>
            <p className="text-sm text-green-600 mt-1">Redirecting you to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-border p-8">

          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{localError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-foreground">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Min. 6 characters"
                  required
                  disabled={loading}
                />
                {/* Toggle show/hide password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-2 text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Repeat your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}