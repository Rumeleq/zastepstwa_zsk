import arrowLeft from "@assets/arrow-back.svg"

interface Props {
  onSwitch: () => void
  onSelectTeacher: (teacherName: string) => void
}

export function TeacherSelection(props: Props) {
  return (
    <div>
      <h2>Wybór nauczyciela</h2>
      <button>
        <img src={arrowLeft} alt="Strzałka" onClick={props.onSwitch} />
      </button>
      <p>Ta strona będzie umożliwiać wybór nauczyciela.</p>
      <button onClick={() => props.onSelectTeacher("Wartacz")}>
        Ustaw Wartacza
      </button>
    </div>
  )
}
