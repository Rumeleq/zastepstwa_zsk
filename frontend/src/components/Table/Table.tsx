import type { Replacement } from "@services"
import "./Table.scss"

export interface TableRowData extends Replacement {
  substitutingTeacher: string
}

export interface TableProps {
  data: TableRowData[]
  showSubstitutingTeacher?: boolean
}

const LESSON_HOURS: Record<string, string> = {
  "0": "7:10 - 7:55",
  "1": "8:00 - 8:45",
  "2": "8:50 - 9:35",
  "3": "9:50 - 10:35",
  "4": "10:40 - 11:25",
  "5": "11:30 - 12:15",
  "6": "12:30 - 13:15",
  "7": "13:20 - 14:05",
  "8": "14:10 - 14:55",
  "9": "15:00 - 15:45",
  "10": "15:50 - 16:35",
  "11": "16:40 - 17:25",
}

export function Table({ data, showSubstitutingTeacher = true }: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>Brak zaplanowanych zastępstw.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Lekcja</th>
            <th>Godzina</th>
            {showSubstitutingTeacher && <th>Nauczyciel zastępujący</th>}
            <th>Klasa</th>
            <th>Przedmiot</th>
            <th>Sala</th>
            <th>Nauczyciel nieobecny / Status</th>
            <th>Uwagi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const time = LESSON_HOURS[row.lesson] || "—"
            return (
              <tr key={index}>
                <td className="col-lesson">{row.lesson}</td>
                <td className="col-time">{time}</td>
                {showSubstitutingTeacher && (
                  <td className="col-sub-teacher">{row.substitutingTeacher}</td>
                )}
                <td className="col-class">{row.className}</td>
                <td className="col-subject">{row.subject}</td>
                <td className="col-room">{row.room || "—"}</td>
                <td className="col-status">{row.teacherOrStatus}</td>
                <td className="col-comments">{row.comments || "—"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
