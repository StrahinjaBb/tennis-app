// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getUserById } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { getAppointments, createAppointment, deleteAppointment } from "../api/appointmentApi";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  let canReserve;

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const userData = await getUserById(userId);
        canReserve = userData.roleType === 'ADMIN' || userData.roleType === 'USER';
        setUser(userData);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisnika:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className="p-4">Učitavanje...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Zdravo, {user.firstName}!</h1>
      <p className="text-lg mt-2">Uloga: {user.roleType}</p>
      <nav className="flex gap-6 mb-6 text-blue-600 font-semibold">
        <button onClick={() => navigate("/appointments")}>Appointments</button>
        {user?.role === "ADMIN" && (
          <button onClick={() => navigate("/admin")}>Admin</button>
        )}
      </nav>

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
    </div>
  );
}
