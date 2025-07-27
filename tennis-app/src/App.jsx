// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import AppointmentsPage from './pages/Appointments';
import UserManagement from './pages/UserManagement';
import PlayersList from './pages/PlayersList';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/admin" element={<UserManagement />} />
            <Route path="/players" element={<PlayersList />} />
            <Route path="/" element={<Navigate to="/appointments" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;