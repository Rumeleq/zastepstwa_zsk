import zskLogo from "@assets/logo-zsk.svg"
import { useGlobalData } from "@hooks"
import "./Header.scss"
import { Link } from "react-router-dom"

export function Header() {
  const { data, isLoading, isError, error } = useGlobalData()

  return (
    <header>
      <Link to={"/"} className={"logo-link"}>
        <div className="logo">
          <img src={zskLogo} alt="Logo ZSK" />
          <h1>Zastępstwa</h1>
        </div>
      </Link>
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
