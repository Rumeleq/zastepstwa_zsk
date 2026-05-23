import zskLogo from "@assets/logo-zsk.svg"
import {useGlobalData} from "@hooks"
import "./Header.scss"

export function Header() {
  const { data, isLoading, isError, error } = useGlobalData()

  return (
    <header>
      <div id="logo">
        <img src={zskLogo} alt="Logo ZSK" />
        <h1>Zastępstwa</h1>
      </div>
      <div id="date">
        {isLoading && <p>Pobieranie danych...</p>}
        {isError && <p className="error">Błąd: {error.message}</p>}
        {!isLoading && !isError && <p>{data?.date}</p>}
      </div>
    </header>
  )
}
