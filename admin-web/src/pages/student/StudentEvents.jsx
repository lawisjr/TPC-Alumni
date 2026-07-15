import { useState, useEffect } from "react";
import eventService from "../../services/eventService";

export default function StudentEvents() {
  const [events, setEvents] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", include_past: false });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [filters, currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await eventService.getAll({
        search: filters.search,
        include_past: filters.include_past,
        page: currentPage,
      });
      setEvents(data);
    } catch (err) {
      setError(err.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="px-4 py-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Events
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Browse upcoming and past events that apply to your department.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search events..."
              className="w-full sm:w-80 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-tpc-green focus:outline-none focus:ring-2 focus:ring-tpc-green/20"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="include_past"
              checked={filters.include_past}
              onChange={handleFilterChange}
              className="h-4 w-4 rounded border-gray-300 text-tpc-green focus:ring-tpc-green"
            />
            Show past events
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && !events.data.length ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpc-green"></div>
        </div>
      ) : events.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {events.data.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:text-xl">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description || "No description available."}
                  </p>
                </div>
                <span
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                    event.scope === "school_wide"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {event.scope === "school_wide"
                    ? "School-wide"
                    : event.department?.name || "Department"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:mt-6">
                <div className="flex items-center justify-between gap-3">
                  <span>Date</span>
                  <span className="font-medium text-gray-900 text-right">
                    {new Date(event.event_date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Location</span>
                  <span className="font-medium text-gray-900 text-right truncate">
                    {event.location || "TBA"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Status</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${event.is_future ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                  >
                    {event.is_future ? "Upcoming" : "Past"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500 sm:rounded-3xl sm:p-12">
          No events match your current search.
        </div>
      )}

      {events.meta?.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {events.meta.last_page}
          </span>
          <button
            disabled={currentPage >= events.meta.last_page}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
