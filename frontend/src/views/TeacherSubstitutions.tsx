import arrowLeft from "@assets/arrow-back.svg"

interface Props {
  onSwitch: () => void
  teacherName: string | null
  onChangeTeacher: () => void
}

export function TeacherSubstitutions(props: Props) {
  return (
    <div>
      <h2>Zastępstwa dla nauczyciela {props.teacherName}</h2>
      <button>
        <img src={arrowLeft} alt="Strzałka" onClick={props.onSwitch} />
      </button>
      <p>Ta strona będzie wyświetlać zastępstwa dla wybranego nauczyciela.</p>
      <button onClick={() => props.onChangeTeacher()}>Usuń Wartacza</button>
    </div>
  )
}
