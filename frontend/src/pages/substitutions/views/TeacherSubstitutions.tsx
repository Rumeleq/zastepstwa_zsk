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
  if (data?.replacements?.[props.teacherName]) {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <div className="view-header">
        <button className="back-button" onClick={props.onSwitch}>
          <img src={arrowLeft} alt="Strzałka" />
        </button>
        <h2>Zastępstwa: {props.teacherName}</h2>
        <button
          className="change-teacher-btn"
          onClick={() => props.onChangeTeacher()}
        >
          Zmień
        </button>
      </div>
      <Table
        data={teacherRows}
        showSubstitutingTeacher={false}
        scheduleDate={data?.date}
      />
    </div>
  )
}
