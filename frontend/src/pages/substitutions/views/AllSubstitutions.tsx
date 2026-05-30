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
  allRows.sort((a, b) => {
    const isSpecialA = a.substitutingTeacher.toLowerCase().includes("uczniow") || a.substitutingTeacher.toLowerCase().includes("okienko") ? 1 : 0
    const isSpecialB = b.substitutingTeacher.toLowerCase().includes("uczniow") || b.substitutingTeacher.toLowerCase().includes("okienko") ? 1 : 0
    if (isSpecialA !== isSpecialB) return isSpecialA - isSpecialB
    
    return parseInt(a.lesson) - parseInt(b.lesson)
  })

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
        <h2>Wszystkie zastępstwa</h2>
      </div>
      <Table
        data={allRows}
        showSubstitutingTeacher={true}
        scheduleDate={data?.date}
      />
    </div>
  )
}
