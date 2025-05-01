// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getUserById } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const userData = await getUserById(userId);
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
      <nav className="flex gap-6 mb-6 text-blue-600 font-semibold">
        <button onClick={() => navigate("/appointments")}>Appointments</button>
        {user?.role === "ADMIN" && (
          <button onClick={() => navigate("/admin")}>Admin</button>
        )}
      </nav>

      <h1 className="text-3xl font-bold">Zdravo, {user.firstName}!</h1>
      <p className="text-lg mt-2">Uloga: {user.role}</p>
    </div>
  );
}
