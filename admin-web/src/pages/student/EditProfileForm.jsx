import { useRef, useEffect } from "react";
import { X, Image, BriefcaseIcon, CheckCircle2, XCircle } from "lucide-react";

export default function EditProfileForm({
  form,
  setForm,
  previewUrl,
  onFileChange,
  onSubmit,
  onClose,
  saving,
  error,
  validationErrors,
}) {
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Whether to show the alignment section
  const isEmployed =
    form?.employment_status === "employed" ||
    form?.employment_status === "self_employed";

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-800 text-sm sm:text-base outline-none transition focus:ring-2 focus:ring-tpc-greenDeep/30 focus:border-tpc-greenDeep ${
      field ? "border-red-500" : "border-gray-200"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2 sm:px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Edit Profile
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Update your personal details below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 text-red-600 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* ── Photo upload ─────────────────────────────────────────────── */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Profile photo
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-tpc-greenDeep transition overflow-hidden group"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 sm:h-40 object-cover"
                />
              ) : (
                <div className="h-32 sm:h-40 flex flex-col items-center justify-center gap-2">
                  <Image className="h-7 w-7 sm:h-8 sm:w-8 text-gray-300 group-hover:text-tpc-greenDeep transition" />
                  <span className="text-xs sm:text-sm text-gray-400 text-center px-2">
                    Click to upload a photo
                  </span>
                </div>
              )}
            </button>
            {previewUrl && (
              <p className="text-xs text-center text-gray-400 mt-2">
                Click to change photo
              </p>
            )}
            {validationErrors.avatar && (
              <p className="mt-2 text-xs sm:text-sm text-red-600">
                {validationErrors.avatar[0]}
              </p>
            )}
          </div>

          {/* ── Main fields ──────────────────────────────────────────────── */}
          <form
            id="edit-profile-form"
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                Full name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className={inputClass(validationErrors.name)}
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {validationErrors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className={inputClass(validationErrors.email)}
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {validationErrors.email[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                  Contact number
                </label>
                <input
                  type="text"
                  value={form.contact_number}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact_number: e.target.value }))
                  }
                  className={inputClass(validationErrors.contact_number)}
                />
                {validationErrors.contact_number && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {validationErrors.contact_number[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  className={inputClass(validationErrors.location)}
                />
                {validationErrors.location && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {validationErrors.location[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                  Batch year
                </label>
                <input
                  type="text"
                  value={form?.batch_year || "—"}
                  disabled
                  readOnly
                  className="w-full rounded-lg border px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-500 text-sm sm:text-base cursor-not-allowed border-gray-200"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Set automatically from your graduate record — can't be edited.
                </p>
              </div>
            </div>

            {/* ── Work Alignment — only shown when employed/self-employed ── */}
            {isEmployed && (
              <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5 space-y-4">
                {/* Section header */}
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4 text-tpc-greenDeep shrink-0" />
                  <p className="text-sm font-semibold text-gray-700">
                    Work Alignment
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 -mt-1">
                  Is your current job aligned with your course in college?
                </p>

                {/* Yes / No toggle buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* YES */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, is_work_aligned: true }))
                    }
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition
                      ${
                        form.is_work_aligned === true
                          ? "border-tpc-greenDeep bg-tpc-greenDeep/10 text-tpc-greenDeep"
                          : "border-gray-200 bg-white text-gray-600 hover:border-tpc-greenDeep/50"
                      }`}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${form.is_work_aligned === true ? "text-tpc-greenDeep" : "text-gray-300"}`}
                    />
                    Yes, it is
                  </button>

                  {/* NO */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        is_work_aligned: false,
                        // clear reason if they switch back to No after typing
                        work_aligned_reason:
                          form.is_work_aligned === false
                            ? form.work_aligned_reason
                            : "",
                      }))
                    }
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition
                      ${
                        form.is_work_aligned === false
                          ? "border-red-400 bg-red-50 text-red-500"
                          : "border-gray-200 bg-white text-gray-600 hover:border-red-300"
                      }`}
                  >
                    <XCircle
                      className={`h-4 w-4 shrink-0 ${form.is_work_aligned === false ? "text-red-400" : "text-gray-300"}`}
                    />
                    No, it isn't
                  </button>
                </div>

                {validationErrors.is_work_aligned && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {validationErrors.is_work_aligned[0]}
                  </p>
                )}

                {/* Optional reason — slides in after either button is picked */}
                {form.is_work_aligned !== null &&
                  form.is_work_aligned !== undefined && (
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                        {form.is_work_aligned
                          ? "Tell us more about how it aligns (optional)"
                          : "Tell us why it doesn't align (optional)"}
                      </label>
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={form.work_aligned_reason ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            work_aligned_reason: e.target.value,
                          }))
                        }
                        placeholder={
                          form.is_work_aligned
                            ? "e.g. I work as a software engineer and I took up Computer Science."
                            : "e.g. I took up Nursing but I currently work in finance."
                        }
                        className={`w-full rounded-lg border px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-800 text-xs sm:text-sm outline-none transition resize-none focus:ring-2 focus:ring-tpc-greenDeep/30 focus:border-tpc-greenDeep ${
                          validationErrors.work_aligned_reason
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      />
                      <div className="flex justify-between mt-1">
                        {validationErrors.work_aligned_reason ? (
                          <p className="text-xs sm:text-sm text-red-600">
                            {validationErrors.work_aligned_reason[0]}
                          </p>
                        ) : (
                          <span />
                        )}
                        <p className="text-xs text-gray-400 text-right">
                          {(form.work_aligned_reason ?? "").length}/500
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </form>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-100 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={saving}
            className="flex-1 rounded-lg bg-tpc-greenDeep px-4 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-tpc-green transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
