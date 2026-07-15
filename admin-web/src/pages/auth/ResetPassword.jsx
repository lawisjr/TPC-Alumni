import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(searchParams.get("token") || "");
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Password reset token is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.data.status) {
        toast.success("Password has been reset successfully.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tpc-navyDeep px-4 py-6 text-tpc-white sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl bg-white p-4 shadow-2xl shadow-black/20 text-tpc-navy sm:gap-8 sm:rounded-[28px] sm:p-6 md:flex-row md:gap-10 md:p-8">
        <div className="flex-1 rounded-2xl bg-tpc-greenDeep/10 p-5 sm:rounded-3xl sm:p-8 md:p-12">
          <h1 className="text-2xl font-semibold sm:text-3xl">Reset Password</h1>
          <p className="mt-3 text-sm text-tpc-navy/70 sm:mt-4">
            Enter your new password to complete the reset process.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
          >
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <label className="relative block">
              <span className="sr-only">Email</span>
              <input
                type="email"
                name="email"
                value={email}
                readOnly
                className="h-12 w-full rounded-full border border-tpc-navy/20 bg-tpc-cream/30 pl-4 pr-4 text-sm text-tpc-navy outline-none"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">New Password</span>
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tpc-navy/40" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="New password"
                className="h-12 w-full rounded-full border border-tpc-navy/20 bg-tpc-cream/30 pl-12 pr-4 text-sm text-tpc-navy outline-none transition focus:border-tpc-gold focus:ring-2 focus:ring-tpc-gold/20"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Confirm Password</span>
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tpc-navy/40" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                placeholder="Confirm password"
                className="h-12 w-full rounded-full border border-tpc-navy/20 bg-tpc-cream/30 pl-12 pr-4 text-sm text-tpc-navy outline-none transition focus:border-tpc-gold focus:ring-2 focus:ring-tpc-gold/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-tpc-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-tpc-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-tpc-navy/60">
            Remembered your password?
            <Link className="font-medium text-tpc-gold underline" to="/login">
              {" "}
              Login
            </Link>
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-tpc-navy p-6 text-center text-white sm:rounded-3xl sm:p-8 md:p-12">
          <h2 className="text-xl font-semibold sm:text-2xl">Password Reset</h2>
          <p className="mt-3 max-w-xs text-sm text-tpc-cream/80 sm:mt-4">
            Use the link from your email to set a new password for your account.
          </p>
        </div>
      </div>
    </div>
  );
}
