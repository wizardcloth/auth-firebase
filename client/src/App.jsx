import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import ProtectedRoute from './components/protectedroute.jsx'; // Import the ProtectedRoute component

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
