import api from "./api";

const graduateService = {
  // ── Super Admin ──────────────────────────────────────────────
  getAll: async (filters = {}) => {
    try {
      const response = await api.get("/super-admin/graduates", {
        params: filters,
      });
      const raw = response.data.data;
      if (Array.isArray(raw)) {
        return {
          data: raw,
          meta: { last_page: 1, current_page: 1, total: raw.length },
        };
      }
      return raw;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/super-admin/graduates/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/super-admin/graduates", data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/super-admin/graduates/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/super-admin/graduates/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ── Admin / Department Head ───────────────────────────────────
  getAdminGraduates: async (filters = {}) => {
    try {
      const response = await api.get("/admin/graduates", { params: filters });
      const raw = response.data.data;
      if (Array.isArray(raw)) {
        return {
          data: raw,
          meta: { last_page: 1, current_page: 1, total: raw.length },
        };
      }
      return raw;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAdminGraduateById: async (id) => {
    try {
      const response = await api.get(`/admin/graduates/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createAdminGraduate: async (data) => {
    try {
      const response = await api.post("/admin/graduates", data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAdminGraduate: async (id, data) => {
    try {
      const response = await api.put(`/admin/graduates/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAdminGraduate: async (id) => {
    try {
      await api.delete(`/admin/graduates/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default graduateService;
