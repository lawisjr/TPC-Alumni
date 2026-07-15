import { useState, useEffect } from "react";
import alumniService from "../../../services/alumniService";
import departmentService from "../../../services/departmentService";
import { toast } from "react-toastify";

export default function AlumniApproval() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchPendingAlumni();
    fetchDepartments();
  }, []);

  const fetchPendingAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alumniService.getPending();
      setPending(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch pending alumni");
      toast.error("Failed to load pending alumni");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      const list = Array.isArray(response?.data) ? response.data : [];
      setDepartments(list);
    } catch {
      setDepartments([]);
    }
  };

  const getStudentNumber = (alumni) =>
    alumni.studentNumber ||
    alumni.student_number ||
    alumni.schoolId ||
    alumni.school_id ||
    alumni.graduate_id ||
    alumni.graduate?.student_number ||
    "-";

  const getDepartmentName = (alumni) => {
    const directName =
      alumni.department?.name ||
      alumni.departmentName ||
      alumni.department_name ||
      alumni.department?.title ||
      "";

    if (directName) return directName;

    const departmentId =
      alumni.departmentId ||
      alumni.department_id ||
      alumni.department?.id ||
      "";

    if (departmentId && departments.length > 0) {
      const match = departments.find(
        (department) => String(department.id) === String(departmentId),
      );
      if (match?.name) return match.name;
    }

    return "-";
  };

  const handleApprove = async (alumniId) => {
    if (!window.confirm("Approve this alumni?")) return;

    setApprovingId(alumniId);
    try {
      await alumniService.approve(alumniId);
      toast.success("Alumni approved successfully");
      setPending(pending.filter((a) => a.id !== alumniId));
    } catch (err) {
      toast.error(err.message || "Failed to approve alumni");
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectSubmit = async (alumniId) => {
    setRejectingId(alumniId);
    try {
      await alumniService.reject(alumniId, rejectReason[alumniId] || "");
      toast.success("Alumni rejected successfully");
      setPending(pending.filter((a) => a.id !== alumniId));
      setShowRejectModal(null);
      setRejectReason({});
    } catch (err) {
      toast.error(err.message || "Failed to reject alumni");
    } finally {
      setRejectingId(null);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Alumni Approval</h1>
        <p className="text-gray-600 mt-2">
          Review and approve pending alumni registrations. {pending.length}{" "}
          awaiting approval.
        </p>
      </div>

      {/* Pending Alumni Cards */}
      {pending.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pending.map((alumni) => (
            <div
              key={alumni.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4"
            >
              {/* Alumni Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {alumni.name}
                </h3>
                <p className="text-sm text-gray-600">{alumni.email}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Student Number</p>
                  <p className="font-medium text-gray-800">
                    {getStudentNumber(alumni)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Department</p>
                  <p className="font-medium text-gray-800">
                    {getDepartmentName(alumni)}
                  </p>
                </div>
              </div>

              {/* Registration Date */}
              <div className="text-sm">
                <p className="text-gray-600">Registered</p>
                <p className="font-medium text-gray-800">
                  {alumni.createdAt
                    ? new Date(alumni.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(alumni.id)}
                  disabled={approvingId === alumni.id}
                  className="flex-1 px-4 py-2 bg-tpc-green hover:bg-tpc-greenDeep text-white rounded-lg transition disabled:opacity-50"
                >
                  {approvingId === alumni.id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => setShowRejectModal(alumni.id)}
                  className="flex-1 px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">
            No pending alumni. All registrations have been reviewed!
          </p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Reject Alumni</h3>
            <p className="text-sm text-gray-600">
              {pending.find((a) => a.id === showRejectModal)?.name}
            </p>

            <textarea
              value={rejectReason[showRejectModal] || ""}
              onChange={(e) =>
                setRejectReason({
                  ...rejectReason,
                  [showRejectModal]: e.target.value,
                })
              }
              placeholder="Optional: Provide a reason for rejection..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tpc-green"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectSubmit(showRejectModal)}
                disabled={rejectingId === showRejectModal}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {rejectingId === showRejectModal
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
