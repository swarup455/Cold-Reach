import { Routes, Route, Navigate } from "react-router-dom"
import { HashLoader } from "react-spinners"
import DashboardLayout from "./components/layout/DashboardLayout"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import Landing from "./pages/common/Landing"
import type { RootState } from "@/app/store"
import GuestRoute from "./components/common/GuestRoute"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchCurrentUser } from "./features/auth/authSlice"
import { useEffect } from "react"
import Startups from "./pages/dashboard/Startups"
import Templates from "./pages/dashboard/Templates"
import SendEmail from "./pages/dashboard/SendEmail"
import Profile from "./pages/dashboard/Profile"
import RequireProfile from "./components/common/RequireProfile"
import OnboardingPage from "./pages/dashboard/Onboarding"

const App = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  if (loading.fetchCurrentUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <HashLoader color="#2563eb" size={50} />
      </div>
    )
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RequireProfile />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="startups" replace />} />
            <Route path="startups" element={<Startups />} />
            <Route path="templates" element={<Templates />} />
            <Route path="send-mail" element={<SendEmail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App