import arrowLeft from "@assets/arrow-back.svg"
import { useGlobalData } from "@hooks"

interface Props {
  onSwitch: () => void
  onSelectTeacher: (teacherName: string) => void
}

export function TeacherSelection(props: Props) {
  const { data } = useGlobalData()
  if (!data) return <p>Brak planowanych zastępstw</p>
  return (
    <div>
      <h2>Wybór nauczyciela</h2>
      <button>
        <img src={arrowLeft} alt="Strzałka" onClick={props.onSwitch} />
      </button>

      {Object.entries(data.replacements).map(([teacherName, _]) => (
        <button
          key={teacherName}
          onClick={() => props.onSelectTeacher(teacherName)}
        >
          {teacherName}
        </button>
      ))}
    </div>
  )
}
