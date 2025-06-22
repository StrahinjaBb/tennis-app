// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getUserById } from "../api/userApi";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisnika:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="p-4">Učitavanje...</div>;

  return (
      <div className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold">Zdravo {user?.firstName}!</h1>
        </div>
      </div>
    );
}

export default HomePage;