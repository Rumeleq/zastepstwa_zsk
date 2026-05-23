import "./App.css"
import { useGlobalData } from "@hooks"
import { Header } from "@components"

function App() {
  const { data, isLoading, isError, error } = useGlobalData()
  if (isLoading) {
    return <div>Ładowanie danych...</div>
  }
  if (isError) {
    return (
      <div>
        Błąd podczas pobierania danych:{" "}
        {error instanceof Error ? error.message : "Nieznany błąd"}
      </div>
    )
  }

  return (
    <>
      <Header />
      <div>
        <h1>Zastępstwa (Raw Data)</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  )
}

export default App
