import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  ScrollRestoration,
  Navigate,
} from "react-router-dom";
import PageWrapper from "./components/layout/PageWrapper";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import FindUs from "./pages/FindUs";
import Gallery from "./pages/Gallery";
import Reservations from "./pages/Reservations";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/OrderTracking";
import useUserStore from "./store/userStore";
import api from "./services/api";

function RequireUser({ children }) {
  const { isAuthenticated } = useUserStore();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function SessionGuard() {
  const { isAuthenticated, clearAuth } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/users/me").catch((err) => {
      if (err.response?.status === 401) {
        clearAuth();
      }
    });
  }, []);

  return null;
}

export default function App() {
  return (
    <>
      <SessionGuard />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageWrapper />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="order" element={<Order />} />
            <Route
              path="dashboard"
              element={
                <RequireUser>
                  <Dashboard />
                </RequireUser>
              }
            />
            <Route path="about" element={<About />} />
            <Route path="find-us" element={<FindUs />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="contact" element={<Contact />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route
              path="order-tracking/:orderNumber"
              element={<OrderTracking />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
