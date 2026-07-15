import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Briefcase,
  BarChart3,
  CalendarDays,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
} from "lucide-react";

export default function DepartmentHeadDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, eventsResponse, announcementsResponse] =
          await Promise.all([
            api.get("/department-head/dashboard"),
            api.get("/events", { params: { limit: 5 } }),
            api.get("/announcements", { params: { limit: 3 } }),
          ]);

        const dashboardData = statsResponse.data?.data || {};
        setStats(dashboardData.stats || dashboardData);
        setActivity(
          dashboardData.activity || dashboardData.recent_activity || [],
        );

        const eventPayload =
          eventsResponse.data?.data || eventsResponse.data || [];
        setEvents(
          Array.isArray(eventPayload) ? eventPayload : eventPayload.data || [],
        );

        const announcementPayload =
          announcementsResponse.data?.data || announcementsResponse.data || [];
        setAnnouncements(
          Array.isArray(announcementPayload)
            ? announcementPayload
            : announcementPayload.data || [],
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const departmentName =
    stats?.department_name || stats?.department?.name || "Your Department";
  const employmentRate =
    (stats?.employment_rate ?? stats?.total_alumni > 0)
      ? Math.round((stats?.employed_alumni / stats?.total_alumni) * 100)
      : 0;

  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-gray-500 mb-2">
              Department Dashboard
            </p>
            <h1 className="text-4xl font-bold text-gray-900">
              {departmentName}
            </h1>
          </div>
          <div className="rounded-3xl bg-tpc-greenDeep/5 px-5 py-3 text-sm font-semibold text-tpc-greenDeep">
            {stats?.department_code
              ? `${stats.department_code} Department`
              : "Department Overview"}
          </div>
        </div>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Your department metrics, pending approvals, upcoming events, and
          recent announcements are shown below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Graduates"
          value={stats?.total_graduates ?? stats?.total_graduate_count ?? 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-tpc-greenDeep"
        />
        <StatCard
          title="Registered Alumni"
          value={stats?.total_alumni ?? stats?.registered_alumni ?? 0}
          icon={<Sparkles className="w-6 h-6" />}
          color="bg-tpc-gold"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pending_approvals ?? stats?.pending_alumni ?? 0}
          icon={<AlertCircle className="w-6 h-6" />}
          color="bg-amber-500"
        />
        <StatCard
          title="Employed Alumni"
          value={stats?.employed_alumni ?? stats?.total_employed ?? 0}
          icon={<Briefcase className="w-6 h-6" />}
          color="bg-tpc-navy"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Employment Rate
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Percentage of approved alumni in your department who are employed.
            </p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{employmentRate}%</p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-tpc-greenDeep"
            style={{ width: `${Math.min(Math.max(employmentRate, 0), 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500">
                Latest approvals and rejections in your department.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
              {activity.length} items
            </span>
          </div>

          {activity.length > 0 ? (
            <div className="space-y-4">
              {activity.slice(0, 5).map((item) => (
                <div
                  key={
                    item.id || `${item.type}-${item.timestamp}-${item.user_id}`
                  }
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-[0.24em]">
                        {item.action || item.type || "Activity"}
                      </p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {item.name ||
                          item.user_name ||
                          item.alumni_name ||
                          "Alumni action"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                        item.action === "approved" || item.type === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.action || item.type || "Update"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    {item.reason ||
                      item.description ||
                      "No additional details."}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDateTime(item.timestamp || item.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
              No recent approvals or rejections yet.
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h3>
                <p className="text-sm text-gray-500">
                  School-wide and department events.
                </p>
              </div>
              <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-gray-900">
                        {event.title || event.name}
                      </p>
                      <span className="text-xs uppercase tracking-[0.24em] text-gray-500">
                        {event.scope || event.event_type || "Event"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {event.location || event.venue || "No location provided"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {formatDateTime(
                        event.date || event.event_date || event.starts_at,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
                No upcoming events found.
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Announcements
                </h3>
                <p className="text-sm text-gray-500">
                  Department and school-wide news.
                </p>
              </div>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <p className="font-semibold text-gray-900">
                      {announcement.title}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {announcement.body || announcement.content}
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      {formatDateTime(
                        announcement.created_at || announcement.published_at,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
                No announcements available.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-gray-900">{value ?? 0}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-2xl`}>{icon}</div>
      </div>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
