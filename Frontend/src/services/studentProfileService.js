import api from "../api/axios";

const studentProfileService = {
  // Get logged-in student's profile
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  // Update logged-in student's profile
  updateProfile: async (data) => {
    const response = await api.put("/user/profile", data);
    return response.data;
  },
};

export default studentProfileService;