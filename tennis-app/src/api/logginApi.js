import axios from "axios";

const API_BASE_URL = "http://localhost:8080/auth";

export const login = async (userLogin) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userLogin);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};