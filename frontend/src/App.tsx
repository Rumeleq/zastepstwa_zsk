import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@components"
import { SubstitutionsPage, AdminLoginPage, AdminPanelPage } from "@pages"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubstitutionsPage />} />
        <Route path="/admin/logowanie" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/panel" element={<AdminPanelPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
