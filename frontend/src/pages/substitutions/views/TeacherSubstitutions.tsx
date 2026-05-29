import arrowLeft from "@assets/arrow-back.svg"
import { Table } from "@components"
import type { TableRowData } from "@components"
import { useGlobalData } from "@hooks"

interface Props {
  onSwitch: () => void
  teacherName: string
  onChangeTeacher: () => void
}

export function TeacherSubstitutions(props: Props) {
  const { data } = useGlobalData()
  const teacherRows: TableRowData[] = []
  if (props.teacherName && data?.replacements?.[props.teacherName]) {
    const replacements = data.replacements[props.teacherName]
    replacements.forEach((replacement) => {
      teacherRows.push({
        ...replacement,
        substitutingTeacher: props.teacherName,
      })
    })
  }
  teacherRows.sort((a, b) => parseInt(a.lesson) - parseInt(b.lesson))
  return (
    <div>
      <h2>Zastępstwa dla nauczyciela {props.teacherName}</h2>
      <button>
        <img src={arrowLeft} alt="Strzałka" onClick={props.onSwitch} />
      </button>
      <Table
        data={teacherRows}
        showSubstitutingTeacher={false}
      />
      <button onClick={() => props.onChangeTeacher()}>Usuń Wartacza</button>
    </div>
  )
}
