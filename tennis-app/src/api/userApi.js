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

export const createUser = async (user) => {
    const response = await axios.post(API_BASE_URL, user, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};