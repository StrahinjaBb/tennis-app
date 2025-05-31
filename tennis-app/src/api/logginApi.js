import axios from "axios";
import { AUTH_API_URL } from './config'

export const login = async (userLogin) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, userLogin);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};