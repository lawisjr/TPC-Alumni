import { useState, useEffect } from "react";
import { Briefcase, Plus, Pencil, Trash2, Lock } from "lucide-react";
import employmentService from "../../services/employmentService";
import { toast } from "react-toastify";

const EMPTY_FORM = {
  company: "",
  position: "",
  industry: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

export default function StudentEmployment() {
  const [jobs, setJobs] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await employmentService.getAll();
      setJobs(data);
    } catch (err) {
      toast.error(err.message || "Unable to load employment history.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditJob(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditJob(job);
    setForm({
      company: job.company || "",
      position: job.position || "",
      industry: job.industry || "",
      start_date: job.start_date || "",
      end_date: job.end_date || "",
      is_current: job.is_current || false,
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.company.trim()) next.company = "Company is required.";
    if (!form.position.trim()) next.position = "Position is required.";
    if (!form.start_date) next.start_date = "Start date is required.";
    if (!form.is_current && !form.end_date)
      next.end_date = "End date or current role is required.";
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      next.end_date = "End date must be the same or after start date.";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setSaving(true);

    try {
      const payload = { ...form };
      if (payload.is_current) payload.end_date = null;
      if (editJob) {
        await employmentService.update(editJob.id, payload);
        toast.success("Job updated successfully.");
      } else {
        await employmentService.create(payload);
        toast.success("Job added successfully.");
      }
      closeModal();
      fetchJobs();
    } catch (err) {
      toast.error(err.message || "Failed to save job entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm("Delete this job entry?")) return;
    try {
      await employmentService.delete(job.id);
      toast.success("Job entry deleted.");
      fetchJobs();
    } catch (err) {
      toast.error(err.message || "Failed to delete job entry.");
    }
  };

  const currentJob = jobs.data.find((job) => job.is_current);

  return (
    <div className="px-4 py-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Career
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your employment history and keep your latest job details up
            to date.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tpc-greenDeep px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-tpc-green sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpc-green"></div>
        </div>
      ) : jobs.data.length ? (
        <div className="space-y-4 sm:space-y-6">
          {jobs.data.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-gray-900 sm:text-lg">
                      {job.position}
                    </span>
                    <span className="text-sm text-gray-600">
                      @ {job.company}
                    </span>
                    {job.is_current && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Current
                      </span>
                    )}
                    {job.is_employer_updated && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        <Lock className="h-3.5 w-3.5" /> Employer Locked
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {job.industry || "Industry not specified"}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    {new Date(job.start_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                    })}{" "}
                    —
                    {job.is_current
                      ? " Present"
                      : job.end_date
                        ? ` ${new Date(job.end_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}`
                        : " —"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openEditModal(job)}
                    disabled={job.is_employer_updated}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500 sm:rounded-3xl sm:p-12">
          <p className="text-base font-semibold text-gray-900 sm:text-lg">
            No employment history yet.
          </p>
          <p className="mt-2 text-sm sm:text-base">
            Add your first job to start building your career timeline.
          </p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  {editJob ? "Edit Job" : "Add Job"}
                </h2>
                <p className="text-sm text-gray-500">
                  Keep your employment record current.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 transition hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-600">
                  Company
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-tpc-green focus:ring-2 focus:ring-tpc-green/20"
                  />
                  {errors.company && (
                    <p className="text-xs text-red-600">{errors.company}</p>
                  )}
                </label>
                <label className="space-y-2 text-sm text-gray-600">
                  Position
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-tpc-green focus:ring-2 focus:ring-tpc-green/20"
                  />
                  {errors.position && (
                    <p className="text-xs text-red-600">{errors.position}</p>
                  )}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-600">
                  Industry
                  <input
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-tpc-green focus:ring-2 focus:ring-tpc-green/20"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-600">
                  Start Date
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-tpc-green focus:ring-2 focus:ring-tpc-green/20"
                  />
                  {errors.start_date && (
                    <p className="text-xs text-red-600">{errors.start_date}</p>
                  )}
                </label>
              </div>

              {!form.is_current && (
                <label className="space-y-2 text-sm text-gray-600">
                  End Date
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-tpc-green focus:ring-2 focus:ring-tpc-green/20"
                  />
                  {errors.end_date && (
                    <p className="text-xs text-red-600">{errors.end_date}</p>
                  )}
                </label>
              )}

              <label className="inline-flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={form.is_current}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-tpc-green focus:ring-tpc-green"
                />
                Currently working here
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-tpc-greenDeep px-6 py-3 text-sm font-semibold text-white transition hover:bg-tpc-green disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : editJob ? "Save Job" : "Add Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
