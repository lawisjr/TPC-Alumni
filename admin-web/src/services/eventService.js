import api from "./api";

const eventService = {
  /**
   * Get all visible events
   */
  getAll: async (filters = {}) => {
    try {
      const response = await api.get("/events", { params: filters });
      return response.data; // ✅ return the full { data, meta, links } object
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get single event
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create event
   */
  create: async (data) => {
    try {
      const response = await api.post("/events", data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update event
   */
  update: async (id, data) => {
    try {
      const response = await api.patch(`/events/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete event
   */
  delete: async (id) => {
    try {
      await api.delete(`/events/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default eventService;
