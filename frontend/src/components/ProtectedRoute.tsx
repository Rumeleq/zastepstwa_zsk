import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute() {
  const apiKey = localStorage.getItem("admin_api_key")
  if (!apiKey) {
    return <Navigate to="/admin/logowanie" />
  }

  return <Outlet />
}
