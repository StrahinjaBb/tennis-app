import axios from "axios";
import { APPOINTMENTS_API_URL } from './config';

// const API_BASE_URL = "http://localhost:8080/appointments";

export const getAppointments = async () => {
    const response = await axios.get(APPOINTMENTS_API_URL);
    return response.data;
};

export const getAppointmentsForUser = async (userId) => {
    const response = await axios.get(`${APPOINTMENTS_API_URL}/${userId}`);
    return response.data;
};

export const createAppointment = async (appointment) => {
    const response = await axios.post(APPOINTMENTS_API_URL, appointment, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteAppointment = async (id) => {
    await axios.delete(`${APPOINTMENTS_API_URL}/${id}`);
};
