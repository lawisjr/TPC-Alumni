import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  CheckCircle,
  AlertCircle,
  ToggleRight,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export default function PresidentDasboard() {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        if (response.data.status) {
          setStats(response.data.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // fetch a short recent students list (includes alumniProfile)
    (async () => {
      try {
        const res = await api.get("/admin/students", {
          params: { per_page: 5 },
        });
        if (res.data.status) setRecentStudents(res.data.data || []);
      } catch (e) {
        console.error("Failed to fetch recent students:", e);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpc-greenDeep mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Department Head Dashboard
        </h1>
        <p className="text-gray-500">
          Review and manage students in your department
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Graduates"
          value={stats?.total_graduates || 0}
          icon={<GraduationCap className="w-6 h-6" />}
          accent="bg-purple-500"
        />
        <StatCard
          title="Total Alumni"
          value={stats?.total_students || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-tpc-greenDeep"
        />
        <StatCard
          title="Employed Alumni"
          value={stats?.employed_alumni || 0}
          icon={<Briefcase className="w-6 h-6" />}
          color="bg-green-600"
        />
        <StatCard
          title="Verified Alumni"
          value={stats?.verified_students || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Verification"
          value={stats?.unverified_students || 0}
          icon={<AlertCircle className="w-6 h-6" />}
          color="bg-amber-500"
        />
        <StatCard
          title="Active Alumni"
          value={stats?.active_students || 0}
          icon={<ToggleRight className="w-6 h-6" />}
          color="bg-tpc-navy"
        />
        <StatCard
          title="Inactive Alumni"
          value={stats?.inactive_students || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/president/students"
              className="block w-full bg-tpc-greenDeep hover:bg-tpc-green text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-center"
            >
              Review Student Applications
            </a>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200">
              View Reports
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Department Activity
          </h3>
          <div className="space-y-3 text-sm text-gray-500">
            <p>• {stats?.unverified_students || 0} students pending review</p>
            <p>• {stats?.verified_students || 0} students verified</p>
            <p>• {stats?.active_students || 0} students active</p>
            <p className="text-tpc-greenDeep hover:text-tpc-green cursor-pointer font-medium">
              View all activity →
            </p>
          </div>
        </div>
      </div>

      {/* Student Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            Student Overview
          </h3>
          <a
            href="/president/students"
            className="text-tpc-greenDeep hover:text-tpc-green font-semibold text-sm"
          >
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-xs font-medium border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Count</th>
                <th className="px-4 py-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Verified & Active
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {stats?.verified_students || 0}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {stats?.total_students > 0
                    ? Math.round(
                        ((stats?.verified_students || 0) /
                          stats.total_students) *
                          100,
                      )
                    : 0}
                  %
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700">
                  <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                  Pending Verification
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {stats?.unverified_students || 0}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {stats?.total_students > 0
                    ? Math.round(
                        ((stats?.unverified_students || 0) /
                          stats.total_students) *
                          100,
                      )
                    : 0}
                  %
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Inactive
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {stats?.inactive_students || 0}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {stats?.total_students > 0
                    ? Math.round(
                        ((stats?.inactive_students || 0) /
                          stats.total_students) *
                          100,
                      )
                    : 0}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-gray-900 text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}
