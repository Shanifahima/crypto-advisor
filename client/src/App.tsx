import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";

import { useAuth } from "./context/AuthContext";

// דורש שלמשתמש יש token
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loadingUser } = useAuth();

  if (loadingUser) return <p className="p-4 text-sm text-slate-300">Loading...</p>;
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// דורש שהמשתמש השלים Onboarding
const RequireOnboarding: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p className="p-4 text-sm text-slate-300">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  // 🔥 כאן מתקנים את הבעיה:
  if (!Boolean(user.onboardingCompleted)) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* 🔥 ברירת מחדל: תמיד הולכים ל-Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

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
