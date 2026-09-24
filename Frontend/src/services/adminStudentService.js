import api from "../api/axios";

const adminStudentService = {
  getStudents: async (params = {}) => {
    const res = await api.get(
      "/admin/students",
      {
        params,
      }
    );

    return res.data;
  },

  getStudentById: async (id) => {
    const res = await api.get(
      `/admin/students/${id}`
    );

    return res.data;
  },
};

export default adminStudentService;