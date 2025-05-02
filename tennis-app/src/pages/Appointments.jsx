import { useEffect, useState } from "react";
import { getAppointments, createAppointment, deleteAppointment } from "../api/appointmentApi";

const AppointmetsPage = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h2>Appointments</h2>
            <ul>
                {appointments.map((appt) => (
                    <li key={appt.id}>
                        {appt.startTime} - {appt.endTime} -{" "}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmetsPage;