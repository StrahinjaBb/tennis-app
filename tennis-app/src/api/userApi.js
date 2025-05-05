import axios from "axios";

const API_BASE_URL = "http://localhost:8080/users";

export const getUsers = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
};

export const register = async (userRegister) => {
    try {
      //String firstName, String lastName, String email, String username, String password
      const user = {
        firstName: userRegister.firstName,
        lastName: userRegister.lastName,
        email: userRegister.email,
        username: userRegister.username,
        password: userRegister.password,
      };
  
      const response = await axios.post(`${API_BASE_URL}`, userRegister, {
        headers: {
            "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch(error) {
      throw error.response?.data || "Registration failed";
    }
  }

export const deleteUser = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};