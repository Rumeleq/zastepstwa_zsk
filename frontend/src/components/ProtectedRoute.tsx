import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { verifyApiKey } from "@services"

export function ProtectedRoute() {
  const apiKey = localStorage.getItem("admin_api_key")
  const [isValid, setIsValid] = useState<boolean | null>(apiKey ? null : false)

  useEffect(() => {
    if (!apiKey) return

    let active = true
    async function checkKey() {
      const api_key_valid = await verifyApiKey()
      if (active) {
        setIsValid(api_key_valid)
      }
    }
    checkKey()
    return () => {
      active = false
    }
  }, [apiKey])

  if (!apiKey || isValid === false) {
    return <Navigate to="/admin/logowanie" replace />
  }

  if (isValid === null) {
    return <p>Weryfikacja klucza dostępu...</p>
  }

  return <Outlet />
}
