import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./context/AuthContext";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loadingUser } = useAuth();
  if (loadingUser) {
    return <p className="p-4 text-sm text-slate-300">Loading...</p>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RequireOnboarding: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user, loadingUser } = useAuth();
  if (loadingUser) {
    return <p className="p-4 text-sm text-slate-300">Loading...</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            user?.onboardingCompleted ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireOnboarding>
              <DashboardPage />
            </RequireOnboarding>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
