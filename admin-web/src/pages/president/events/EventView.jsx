import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../../services/eventService";
import { toast } from "react-toastify";

export default function EventView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath =
    localStorage.getItem("userRole") === "admin"
      ? "/department-head/events"
      : "/president/events";
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getById(id);
      setEvent(data);
    } catch (err) {
      toast.error("Failed to load event");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventService.delete(id);
      toast.success("Event deleted successfully");
      navigate(basePath);
    } catch (err) {
      toast.error(err.message || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpc-green"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(basePath)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm"
        >
          ← Back to Events
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`${basePath}/${id}/edit`)}
            className="px-5 py-2 bg-tpc-greenDeep hover:bg-tpc-green text-white rounded-full text-sm transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full text-sm transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Title bar */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {event.title}
              </h1>
              <p className="text-sm text-gray-500">
                Created by{" "}
                <span className="font-medium text-gray-700">
                  {event.creator?.name ?? "—"}
                </span>{" "}
                · {new Date(event.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Status badge */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              {event.is_future ? (
                <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                  Upcoming
                </span>
              ) : (
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  Past
                </span>
              )}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  event.scope === "school_wide"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {event.scope === "school_wide"
                  ? "School-wide"
                  : "Department-specific"}
              </span>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-200">
          <Detail label="Event Date">
            {new Date(event.event_date).toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Detail>

          <Detail label="Location">{event.location || "—"}</Detail>

          <Detail label="Department">
            {event.department?.name ?? (
              <span className="text-gray-400 italic">
                {event.scope === "school_wide" ? "All departments" : "—"}
              </span>
            )}
          </Detail>

          <Detail label="Scope">
            {event.scope === "school_wide"
              ? "School-wide"
              : "Department-specific"}
          </Detail>
        </div>

        {/* Description */}
        {event.description && (
          <div className="px-8 py-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Description
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-gray-800 font-medium">{children}</p>
    </div>
  );
}
