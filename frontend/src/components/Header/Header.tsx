import zskLogo from "@assets/logo-zsk.svg"
import { useGlobalData } from "@hooks"
import "./Header.scss"

export function Header() {
  const { data, isLoading, isError, error } = useGlobalData()

  return (
    <header>
      <div className="logo">
        <img src={zskLogo} alt="Logo ZSK" />
        <h1>Zastępstwa</h1>
      </div>
      <div className="date">
        {isLoading ? (
          <h1>Pobieranie danych...</h1>
        ) : isError ? (
          <h1 className="error">Błąd: {error?.message}</h1>
        ) : (
          <h1>{data?.date}</h1>
        )}
      </div>
    </header>
  )
}
