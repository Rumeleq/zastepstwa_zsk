import arrowLeft from "@assets/arrow-back.svg"

interface Props {
  onSwitch: () => void
}

export function AllSubstitutions(props: Props) {
  return (
    <div>
      <h2>Wszystkie zastępstwa</h2>
      <button>
        <img src={arrowLeft} alt="Strzałka" onClick={props.onSwitch} />
      </button>
      <p>Ta strona będzie wyświetlać wszystkie zastępstwa.</p>
    </div>
  )
}
