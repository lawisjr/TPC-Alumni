import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../../services/eventService";
import { toast } from "react-toastify";

const EMPTY_FORM = {
  title: "",
  description: "",
  event_date: "",
  location: "",
  scope: "school_wide",
  department_id: "",
};

export default function EventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const basePath = isAdmin ? "/department-head/events" : "/president/events";

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit); // only load if editing
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getById(id);
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        // event_date comes back as ISO string; slice to YYYY-MM-DD for <input type="date">
        event_date: data.event_date ? data.event_date.slice(0, 10) : "",
        location: data.location ?? "",
        scope: data.scope ?? "school_wide",
        department_id: data.department_id ?? "",
      });
    } catch (err) {
      toast.error("Failed to load event");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.event_date) errs.event_date = "Event date is required.";
    if (form.scope === "department_specific" && !form.department_id)
      errs.department_id =
        "Select a department for department-specific events.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    // Don't send department_id when school_wide
    const payload = { ...form };
    if (payload.scope === "school_wide") delete payload.department_id;
    if (!payload.department_id) delete payload.department_id;

    // ✅ add this
    if (payload.event_date && !payload.event_date.includes(" ")) {
      payload.event_date = payload.event_date + " 00:00";
    }

    try {
      setSaving(true);
      if (isEdit) {
        await eventService.update(id, payload);
        toast.success("Event updated successfully");
        navigate(`${basePath}/${id}`);
      } else {
        const created = await eventService.create(payload);
        toast.success("Event created successfully");
        navigate(`${basePath}/${created.id}`);
      }
    } catch (err) {
      // Handle Laravel validation errors (422)
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        toast.error(err.message || "Failed to save event");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpc-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 transition text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Event" : "Create Event"}
        </h1>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Field label="Title" error={errors.title} required>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Alumni Homecoming 2025"
              className={inputClass(errors.title)}
            />
          </Field>

          {/* Description */}
          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Event details, agenda, notes..."
              className={inputClass(errors.description)}
            />
          </Field>

          {/* Date + Location row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Event Date" error={errors.event_date} required>
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                className={inputClass(errors.event_date)}
              />
            </Field>

            <Field label="Location" error={errors.location}>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. TPC Gymnasium"
                className={inputClass(errors.location)}
              />
            </Field>
          </div>

          {/* Scope */}
          {!isAdmin ? (
            <Field label="Scope" error={errors.scope} required>
              <select
                name="scope"
                value={form.scope}
                onChange={handleChange}
                className={inputClass(errors.scope)}
              >
                <option value="school_wide">School-wide</option>
                <option value="department_specific">Department-specific</option>
              </select>
            </Field>
          ) : (
            <Field label="Scope" error={errors.scope} required>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                Department-specific
              </div>
            </Field>
          )}

          {!isAdmin && form.scope === "department_specific" && (
            <Field
              label="Department ID"
              error={errors.department_id}
              required
              hint="Enter the department ID. You can wire this to a department dropdown later."
            >
              <input
                type="number"
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                placeholder="Department ID"
                className={inputClass(errors.department_id)}
              />
            </Field>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2 bg-tpc-greenDeep hover:bg-tpc-green text-white rounded-full transition disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => navigate(basePath)}
              className="px-6 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-full transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────── */

function inputClass(hasError) {
  return [
    "w-full px-4 py-2 border rounded-lg text-gray-800 text-sm",
    "focus:outline-none focus:ring-2",
    hasError
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-300 focus:ring-tpc-green",
  ].join(" ");
}

function Field({ label, children, error, required, hint }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
