import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventService from "../../../services/eventService";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function EventCreate() {
  const navigate = useNavigate();
  const basePath =
    localStorage.getItem("userRole") === "admin"
      ? "/department-head/events"
      : "/president/events";
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    scope: isAdmin ? "department_specific" : "school_wide",
    department_id: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.data);
    } catch (err) {
      toast.error("Failed to load departments");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Format date for API
      const dateTime = formData.event_date
        ? formData.event_date.replace("T", " ")
        : "";

      const payload = {
        ...formData,
        event_date: dateTime,
      };

      if (isAdmin) {
        payload.scope = "department_specific";
        delete payload.department_id;
      }

      await eventService.create(payload);
      toast.success("Event created successfully");
      navigate(basePath);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        toast.error(err.message || "Failed to create event");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(basePath)}
          className="text-tpc-green hover:text-tpc-greenDeep font-medium flex items-center gap-2"
        >
          ← Back to Events
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Alumni Reunion 2024"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Event details and agenda..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Event Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date & Time *
            </label>
            <input
              type="datetime-local"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green ${
                errors.event_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.event_date && (
              <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Main Auditorium"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Scope */}
          {!isAdmin ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Scope *
              </label>
              <select
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green ${
                  errors.scope ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="school_wide">School-wide</option>
                <option value="department_specific">Department-specific</option>
              </select>
              {errors.scope && (
                <p className="text-red-500 text-sm mt-1">{errors.scope}</p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Event scope</p>
              <p className="text-sm text-gray-600">
                Department-specific events only. This event will be created for
                your department.
              </p>
            </div>
          )}

          {/* Department (if department-specific) */}
          {!isAdmin && formData.scope === "department_specific" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green ${
                  errors.department_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.department_id}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-tpc-greenDeep hover:bg-tpc-green text-white rounded-full transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => navigate(basePath)}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
