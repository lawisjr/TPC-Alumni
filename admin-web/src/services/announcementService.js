import api from "./api";

const announcementService = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get("/announcements", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/announcements/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/announcements", data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.patch(`/announcements/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default announcementService;
