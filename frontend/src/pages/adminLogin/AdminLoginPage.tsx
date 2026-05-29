import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {verifyApiKey} from "@services";
import {ErrorNotice} from "@components";

export function AdminLoginPage() {
  const [key, setKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();


  async function handleLogin() {
    setError(null)
    localStorage.setItem("admin_api_key", key)
    if (await verifyApiKey()) {
      navigate("/admin/panel")
    } else {
      localStorage.removeItem("admin_api_key")
      setError("Niepoprawny klucz dostępu!")
    }
  }

  return <>

    <div className="login-container">
      <h3>Wprowadź klucz dostępu</h3>
      <input type="password" value={key} onChange={(e) => setKey(e.target.value)} />
      {error && ErrorNotice({ message: error })}
      <button onClick={handleLogin}>Zatwierdź klucz</button>
    </div>

  </>
}
