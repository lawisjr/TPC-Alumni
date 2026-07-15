import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.status) {
        toast.success("Password reset email sent. Check your inbox.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tpc-navyDeep px-4 py-6 text-tpc-white sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl bg-white p-4 shadow-2xl shadow-black/20 text-tpc-navy sm:gap-8 sm:rounded-[28px] sm:p-6 md:flex-row md:gap-10 md:p-8">
        <div className="flex-1 rounded-2xl bg-tpc-greenDeep/10 p-5 sm:rounded-3xl sm:p-8 md:p-12">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Forgot Password
          </h1>
          <p className="mt-3 text-sm text-tpc-navy/70 sm:mt-4">
            Enter your email address and we will send you a password reset link.
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
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tpc-navy/40" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="Email address"
                className="h-12 w-full rounded-full border border-tpc-navy/20 bg-tpc-cream/30 pl-12 pr-4 text-sm text-tpc-navy outline-none transition focus:border-tpc-gold focus:ring-2 focus:ring-tpc-gold/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-tpc-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-tpc-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-tpc-navy/60">
            Remembered your password?{" "}
            <Link className="font-medium text-tpc-gold underline" to="/login">
              Login
            </Link>
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-tpc-navy p-6 text-center text-white sm:rounded-3xl sm:p-8 md:p-12">
          <h2 className="text-xl font-semibold sm:text-2xl">
            TPC Alumni Portal
          </h2>
          <p className="mt-3 max-w-xs text-sm text-tpc-cream/80 sm:mt-4">
            Securely reset your password and return to the alumni system.
          </p>
        </div>
      </div>
    </div>
  );
}
