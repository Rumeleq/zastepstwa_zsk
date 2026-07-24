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
        <h2>Wybór nauczyciela</h2>
      </div>

      <div
        className="teacher-list"
        style={{ flex: 1, overflowY: "auto", width: "100%" }}
      >
        {Object.entries(data.replacements)
          .sort(([nameA], [nameB]) => {
            const isSpecialA =
              nameA.toLowerCase().includes("uczniow") ||
              nameA.toLowerCase().includes("okienko")
                ? 1
                : 0
            const isSpecialB =
              nameB.toLowerCase().includes("uczniow") ||
              nameB.toLowerCase().includes("okienko")
                ? 1
                : 0
            if (isSpecialA !== isSpecialB) return isSpecialA - isSpecialB

            return nameA.localeCompare(nameB)
          })
          .map(([teacherName]) => (
            <button
              key={teacherName}
              className="teacher-btn"
              onClick={() => props.onSelectTeacher(teacherName)}
            >
              {teacherName}
            </button>
          ))}
      </div>
    </div>
  )
}
