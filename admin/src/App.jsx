import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError,selectIsVerified, selectIsAdmin } from "./redux/features/auth/authSlice";
import client from "./lib/axios";
import './App.css';
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import AuthModal from "./components/AuthModal/LoginSignupModal";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoadingState] = useState(true);
  const isAdmin = useSelector(selectIsAdmin);
  const isVerified = useSelector(selectIsVerified);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          dispatch(setLoading(true));
          const response = await client.get("/auth/verify-user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success && response.data.user) {
            dispatch(login(response.data.user));
            if (response.data.user.isAdmin && response.data.user.isVerified) {
              navigate("/admindashboard");
            }
          } else {
            dispatch(setError("Authentication failed"));
          }
        } catch (error) {
          dispatch(setError("Token verification failed"));
        } finally {
          dispatch(setLoading(false));
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
      }
    };
    checkAuth();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/loading.gif" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              isVerified && isAdmin ? (
                  <Navigate to="/admindashboard" />
                )  : (
                <AuthModal/>
              )
            }
          />
          <Route path="/admindashboard" element={isVerified && isAdmin? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;