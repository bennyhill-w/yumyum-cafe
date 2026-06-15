import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import Contacts from "./pages/Contacts";
import MenuManager from "./pages/MenuManager";
import BranchSettings from "./pages/BranchSettings";
import AdminWrapper from "./components/layout/AdminWrapper";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const admin = useAuthStore((s) => s.admin);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (
    requiredRole &&
    admin?.role !== "super_admin" &&
    admin?.role !== requiredRole
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="contacts" element={<Contacts />} />
          <Route
            path="menu"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <MenuManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <BranchSettings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
