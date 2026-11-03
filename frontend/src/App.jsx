import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import ProtectedRoute from "./components/Common/ProtectedRoute";

function Dashboard() {
  return <h1>Welcome to PayGuard AI Dashboard</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;