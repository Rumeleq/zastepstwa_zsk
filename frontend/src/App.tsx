import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@components"
import { SubstitutionsPage, AdminLoginPage, AdminPanelPage } from "@pages"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubstitutionsPage />} />
        <Route path="/panel/logowanie" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<AdminPanelPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
