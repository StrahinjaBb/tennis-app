import axios from "axios";

const API_BASE_URL = "http://localhost:8080/appointments";

export const getAppointments = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const getAppointmentsForUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
};

export const createAppointment = async (appointment) => {
    const response = await axios.post(API_BASE_URL, appointment, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteAppointment = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
