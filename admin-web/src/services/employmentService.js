import api from "./api";

const employmentService = {
  getAll: async () => {
    try {
      const response = await api.get("/employment");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (job) => {
    try {
      const response = await api.post("/employment", job);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, job) => {
    try {
      const response = await api.patch(`/employment/${id}`, job);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/employment/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default employmentService;
