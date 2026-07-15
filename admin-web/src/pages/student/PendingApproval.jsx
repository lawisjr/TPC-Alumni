import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, LogOut } from "lucide-react";
import api from "../../services/api";

export default function PendingApproval() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("studentEmail");

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
      return;
    }
    setLoading(false);
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentEmail");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpc-greenDeep mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mb-5 flex justify-center sm:mb-6">
            <div className="rounded-full bg-amber-50 p-3.5 sm:p-4">
              <Clock className="h-7 w-7 text-amber-500 sm:h-8 sm:w-8" />
            </div>
          </div>

          <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
            Account Pending Approval
          </h1>

          <p className="mb-6 text-sm text-gray-500 sm:text-base">
            Your account has been created successfully! Your department head is
            reviewing your application and will verify your account soon.
          </p>

          <div className="mb-6 rounded-lg bg-gray-50 p-4 sm:mb-8">
            <p className="text-sm text-gray-500 break-words">
              <span className="font-semibold text-gray-900">Email:</span>
              <br />
              {email}
            </p>
          </div>

          <div className="mb-6 space-y-2 text-sm text-gray-500 sm:mb-8">
            <p>Once verified, you'll be able to:</p>
            <ul className="text-left space-y-1 ml-4">
              <li>✓ Access your student dashboard</li>
              <li>✓ View your profile</li>
              <li>✓ Submit assignments and coursework</li>
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-tpc-greenDeep font-semibold text-white transition hover:bg-tpc-green"
          >
            <LogOut className="h-4 w-4" />
            Back to Login
          </button>

          <p className="mt-4 text-xs text-gray-500">
            Questions? Contact your department head for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
