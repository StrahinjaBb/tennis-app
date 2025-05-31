// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import AppointmentsPage from './pages/Appointments';
import UserManagement from './pages/UserManagement';
import PlayersList from './pages/PlayersList';
import Navbar from './components/Navbar';

const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-grow p-4">{children}</div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/appointments"
          element={
            <AppLayout>
              <AppointmentsPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout>
              <UserManagement />
            </AppLayout>
          }
        />
        <Route
          path="/players"
          element={
            <AppLayout>
              <PlayersList />
            </AppLayout>
          }
        />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;