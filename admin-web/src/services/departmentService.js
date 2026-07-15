import api from "./api";

const departmentService = {
  /**
   * Get all departments
   */
  getAll: async (filters = {}) => {
    try {
      const response = await api.get("/departments", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get single department
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create department
   */
  create: async (data) => {
    try {
      const response = await api.post("/departments", data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update department
   */
  update: async (id, data) => {
    try {
      const response = await api.patch(`/departments/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete department
   */
  delete: async (id) => {
    try {
      await api.delete(`/departments/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default departmentService;
