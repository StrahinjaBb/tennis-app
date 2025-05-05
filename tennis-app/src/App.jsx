// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import AppointmentsPage from './pages/Appointments';
// import AdminPage from './pages/Admin';
import Navbar from './components/Navbar';

const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-grow p-4">{children}</div>
  </div>
);

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />}
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <AppLayout>
                <HomePage />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            isAuthenticated ? (
              <AppLayout>
                <AppointmentsPage />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* <Route
          path="/admin"
          element={
            isAuthenticated && localStorage.getItem('userRole') === 'ADMIN' ? (
              <AppLayout>
                <AdminPage />
              </AppLayout>
            ) : (
              <Navigate to="/home" />
            )
          }
        /> */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;