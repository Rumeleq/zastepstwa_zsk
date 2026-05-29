import arrowLeft from "@assets/arrow-back.svg"
import { useGlobalData } from "@hooks"
import type { TableRowData } from "@components"
import { Table } from "@components"

interface Props {
  onSwitch: () => void
}

export function AllSubstitutions(props: Props) {
  const { data } = useGlobalData()
  const allRows: TableRowData[] = []
  if (data?.replacements) {
    for (const [substitutingTeacher, list] of Object.entries(
      data.replacements,
    )) {
      list.forEach((row) => {
        allRows.push({
          ...row,
          substitutingTeacher,
        })
      })
    }
  }
  allRows.sort((a, b) => parseInt(a.lesson) - parseInt(b.lesson))

  return (
    <div>
      <h2>Wszystkie zastępstwa</h2>
      <button>
        <img src={arrowLeft} alt="Strzałka" onClick={props.onSwitch} />
      </button>
      <Table data={allRows} showSubstitutingTeacher={true} scheduleDate={data?.date} />
    </div>
  )
}
